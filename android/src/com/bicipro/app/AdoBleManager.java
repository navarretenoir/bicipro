package com.bicipro.app;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothProfile;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Queue;
import java.util.UUID;
import java.util.concurrent.ConcurrentLinkedQueue;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

@SuppressLint("MissingPermission")
public class AdoBleManager {

    private static final String TAG = "ADO_BLE";

    // BiciPRO pública: sin dispositivos de fábrica. Los asigna el usuario (Sensores.java) y cada uno se configura
    // según los servicios estándar que anuncia.
    private boolean esCentralita(String a) { return Sensores.es(context, a, Sensores.CENTRALITA); }
    private boolean esPulso(String a) { return Sensores.es(context, a, Sensores.PULSO); }
    private boolean esVelocidad(String a) { return Sensores.es(context, a, Sensores.VELOCIDAD); }

    // UUIDs Oficiales Bluetooth SIG
    private static final UUID UUID_CLIENT_CHARACTERISTIC_CONFIG = UUID.fromString("00002902-0000-1000-8000-00805f9b34fb");
    
    // CSCP: Cycling Speed and Cadence 
    private static final UUID SERVICE_CSCP = UUID.fromString("00001816-0000-1000-8000-00805f9b34fb");
    private static final UUID CHAR_CSC_MEASUREMENT = UUID.fromString("00002a5b-0000-1000-8000-00805f9b34fb");

    // HRS: Heart Rate Service 
    private static final UUID SERVICE_HEART_RATE = UUID.fromString("0000180d-0000-1000-8000-00805f9b34fb");
    private static final UUID CHAR_HEART_RATE_MEASUREMENT = UUID.fromString("00002a37-0000-1000-8000-00805f9b34fb");

    // CPS: Cycling Power Service
    private static final UUID SERVICE_CYCLING_POWER = UUID.fromString("00001818-0000-1000-8000-00805f9b34fb");
    private static final UUID CHAR_POWER_MEASUREMENT = UUID.fromString("00002a63-0000-1000-8000-00805f9b34fb");

    // ADO O260T E-Bike Protocol: Nordic UART Service (NUS) Real
    public static final UUID SERVICE_ADO_NUS = UUID.fromString("6e400001-b5a3-f393-e0a9-e50e24dcca9e");
    public static final UUID CHAR_ADO_NUS_WRITE = UUID.fromString("6e400002-b5a3-f393-e0a9-e50e24dcca9e");
    public static final UUID CHAR_ADO_NUS_NOTIFY = UUID.fromString("6e400003-b5a3-f393-e0a9-e50e24dcca9e");

    // Fallback legado FFF0
    public static final UUID SERVICE_ADO_LEGACY = UUID.fromString("0000fff0-0000-1000-8000-00805f9b34fb");
    public static final UUID CHAR_ADO_LEGACY_WRITE = UUID.fromString("0000fff1-0000-1000-8000-00805f9b34fb");
    public static final UUID CHAR_ADO_LEGACY_NOTIFY = UUID.fromString("0000fff2-0000-1000-8000-00805f9b34fb");

    // Puerto serie BLE tipo HM-10 (muchas centralitas y displays chinos con módulo Bluetooth)
    public static final UUID SERVICE_SERIE_FFE0 = UUID.fromString("0000ffe0-0000-1000-8000-00805f9b34fb");
    public static final UUID CHAR_SERIE_FFE1 = UUID.fromString("0000ffe1-0000-1000-8000-00805f9b34fb");

    // Batería estándar (pulsómetros y sensores)
    private static final UUID SERVICE_BATERIA = UUID.fromString("0000180f-0000-1000-8000-00805f9b34fb");
    private static final UUID CHAR_NIVEL_BATERIA = UUID.fromString("00002a19-0000-1000-8000-00805f9b34fb");

    public interface BleListener {
        void onDeviceFound(String name, String address, int rssi, String type);
        void onConnectionState(String address, boolean connected, String deviceName);
        void onSpeedCadenceUpdate(double speedKmh, int cadenceRpm);
        void onHeartRateUpdate(int bpm);
        void onPowerUpdate(int watts);
        void onAdoTelemetry(int batteryPct, int assistLvl, int motorWatts, double speedKmh, double odoTotalKm, double odoTripKm);
        /** Trama cruda de una centralita (hex) que no es del protocolo ADO: la muestra el lector de códigos. */
        void onCentralitaTrama(String hex);
        /** Detalle del pulsómetro: intervalos RR (ms) y batería (%; -1 si no se sabe). */
        void onPulsoDetalle(int[] rrMs, int bateria);
    }

    private final Context context;
    private final BleListener listener;
    private final Handler mainHandler;
    private final Handler reconnectHandler;

    private BluetoothAdapter bluetoothAdapter;
    private BluetoothLeScanner bleScanner;
    private boolean isScanning = false;
    private long lastScanTimestamp = 0;

    // Dispositivos activos
    private final Map<String, BluetoothGatt> activeGatts = new java.util.concurrent.ConcurrentHashMap<>();
    private BluetoothGatt adoGatt = null;
    private BluetoothGattCharacteristic adoWriteChar = null;

    // Cola serial y control de flujo BLE para ADO O260T (100% local / offline)
    private final Queue<byte[]> adoWriteQueue = new ConcurrentLinkedQueue<>();
    private boolean isAdoWriting = false;
    private final Handler writeTimeoutHandler = new Handler(Looper.getMainLooper());
    private final Runnable writeTimeoutRunnable = new Runnable() {
        @Override
        public void run() {
            Log.w(TAG, "Watchdog de escritura GATT ADO: timeout 1.2s alcanzado, liberando bloqueo...");
            isAdoWriting = false;
            processAdoWriteQueue();
        }
    };
    private long lastTelemetryReceivedTime = 0;

    // Métricas del sensor CSC
    private long lastWheelRevs = -1;
    private int lastWheelTime = -1;
    private int lastCrankRevs = -1;
    private int lastCrankTime = -1;
    private double wheelCircumferenceM = 2.105; // 700x25C

    public AdoBleManager(Context context, BleListener listener) {
        this.context = context;
        this.listener = listener;
        this.mainHandler = new Handler(Looper.getMainLooper());
        this.reconnectHandler = new Handler(Looper.getMainLooper());

        try {
            bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
            if (bluetoothAdapter != null) {
                bleScanner = bluetoothAdapter.getBluetoothLeScanner();
            }
        } catch (Exception ignored) {}

        // Iniciar loop de reconexión automática en segundo plano
        startAutoConnectLoop();

        // Sin escaneo automático: el usuario busca y asigna sus sensores en la pestaña Sensores.
    }

    private void startAutoConnectLoop() {
        reconnectHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                try {
                    checkAndReconnectEssentialDevices();
                } catch (Exception ignored) {}
                reconnectHandler.postDelayed(this, 7000);
            }
        }, 2000);
    }

    public void checkAndReconnectEssentialDevices() {
        if (bluetoothAdapter == null || !bluetoothAdapter.isEnabled()) return;
        // Sólo se reconecta lo que NO tiene un intento en curso (cada intento abre un cliente GATT; Android permite ~32).
        org.json.JSONArray a = Sensores.lista(context);
        for (int i = 0; i < a.length(); i++) {
            String mac = a.optJSONObject(i) != null ? a.optJSONObject(i).optString("mac") : "";
            if (!mac.isEmpty() && !activeGatts.containsKey(mac)) connect(mac);
        }
        String c = Sensores.macDe(context, Sensores.CENTRALITA);
        if (protocoloAdo && !c.isEmpty() && activeGatts.containsKey(c)) {
            long now = System.currentTimeMillis();
            if (lastTelemetryReceivedTime > 0 && (now - lastTelemetryReceivedTime > 5000)) {
                Log.d(TAG, "Keep-alive ADO: solicitando refresco CAN");
                enqueueAdoWrite(hexStringToByteArray("55AA0111F3010035C4FE"));
            }
        }
    }

    /** true cuando la centralita respondió con tramas del protocolo ADO (55 AA …). */
    private boolean protocoloAdo = false;

    private boolean hasActiveXoss() {
        String v = Sensores.macDe(context, Sensores.VELOCIDAD);
        return !v.isEmpty() && activeGatts.containsKey(v);
    }

    public void startScan() {
        if (bluetoothAdapter == null || !bluetoothAdapter.isEnabled()) return;
        if (bleScanner == null) {
            bleScanner = bluetoothAdapter.getBluetoothLeScanner();
        }
        if (bleScanner == null || isScanning) return;

        long now = System.currentTimeMillis();
        if (now - lastScanTimestamp < 15000) {
            // Protección contra rate limiting de Android 14
            return;
        }
        lastScanTimestamp = now;
        isScanning = true;

        ScanSettings settings = new ScanSettings.Builder()
                .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
                .build();

        try {
            Log.i(TAG, "Iniciando BluetoothLeScanner...");
            bleScanner.startScan(null, settings, scanCallback);
            mainHandler.postDelayed(this::stopScan, 12000);
        } catch (Exception e) {
            Log.e(TAG, "Error iniciando escaneo BLE", e);
            isScanning = false;
        }
    }

    public void stopScan() {
        if (bleScanner != null && isScanning) {
            try {
                bleScanner.stopScan(scanCallback);
                Log.i(TAG, "Detenido BluetoothLeScanner");
            } catch (Exception ignored) {}
            isScanning = false;
        }
    }

    private final ScanCallback scanCallback = new ScanCallback() {
        @Override
        public void onScanResult(int callbackType, ScanResult result) {
            BluetoothDevice device = result.getDevice();
            if (device == null) return;
            String address = device.getAddress();

            String name = null;
            if (result.getScanRecord() != null) {
                name = result.getScanRecord().getDeviceName();
            }
            if (name == null || name.trim().isEmpty()) {
                try { name = device.getName(); } catch (SecurityException ignored) {}
            }

            java.util.List<android.os.ParcelUuid> uuids = result.getScanRecord() != null ? result.getScanRecord().getServiceUuids() : null;
            ultimosServicios.put(address, uuids == null ? "" : uuids.toString().toLowerCase(Locale.US));

            if (name == null || name.trim().isEmpty()) {
                name = "Dispositivo BLE (" + (address != null && address.length() >= 5 ? address.substring(address.length() - 5) : "BT") + ")";
            }

            int rssi = result.getRssi();
            String type = classifyDevice(name, address);
            String asignado = Sensores.rol(context, address);
            if (!asignado.isEmpty() && !activeGatts.containsKey(address)) connect(address);

            final String finalName = name;
            mainHandler.post(() -> listener.onDeviceFound(finalName, address, rssi, type));
        }

        @Override
        public void onScanFailed(int errorCode) {
            Log.w(TAG, "BLE Scan Failed: " + errorCode);
            isScanning = false;
        }
    };

    private final Map<String, String> ultimosServicios = new java.util.concurrent.ConcurrentHashMap<>();

    /** Tipo sugerido según los servicios anunciados (perfiles estándar) y, de respaldo, el nombre. */
    private String classifyDevice(String name, String address) {
        String sv = ultimosServicios.containsKey(address) ? ultimosServicios.get(address) : "";
        String n = name == null ? "" : name.toLowerCase(Locale.US);
        if (sv.contains("6e400001") || sv.contains("0000fff0") || sv.contains("0000ffe0")
                || n.contains("ebike") || n.contains("e-bike") || n.contains("ado") || n.contains("bafang") || n.contains("display")) return "ebike";
        if (sv.contains("0000180d") || n.contains("hr") || n.contains("heart") || n.contains("polar") || n.contains("pulse")) return "heartrate";
        if (sv.contains("00001816") || n.contains("speed") || n.contains("cadence") || n.contains("csc")) return "speed";
        if (sv.contains("00001818") || n.contains("power")) return "power";
        return "sensor";
    }

    public void connect(String address) {
        if (bluetoothAdapter == null || address == null) return;
        try {
            BluetoothDevice device = bluetoothAdapter.getRemoteDevice(address);
            if (activeGatts.containsKey(address)) {
                disconnect(address);
            }
            Log.i(TAG, "Conectando GATT a: " + address);
            // autoConnect=true: el sistema espera al dispositivo conocido en segundo plano, sin el
            // tope de 30 s (error 133) que obligaba a reintentar y a abrir clientes nuevos.
            BluetoothGatt gatt = android.os.Build.VERSION.SDK_INT >= 23
                    ? device.connectGatt(context, true, gattCallback, BluetoothDevice.TRANSPORT_LE)
                    : device.connectGatt(context, true, gattCallback);          // Android 5: sólo LE de todos modos
            activeGatts.put(address, gatt);
        } catch (Exception e) {
            Log.e(TAG, "Error conectando a BLE " + address, e);
        }
    }

    public void disconnect(String address) {
        if (activeGatts.containsKey(address)) {
            BluetoothGatt gatt = activeGatts.remove(address);
            if (esCentralita(address)) adoGatt = null;
            if (gatt != null) {
                try {
                    gatt.disconnect();
                    gatt.close();
                } catch (Exception ignored) {}
            }
        }
    }

    private final BluetoothGattCallback gattCallback = new BluetoothGattCallback() {
        @Override
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            String address = gatt.getDevice().getAddress();
            String name = gatt.getDevice().getName();

            if (newState == BluetoothProfile.STATE_CONNECTED) {
                Log.i(TAG, "GATT Conectado: " + address + " (" + name + ")");
                gatt.requestConnectionPriority(BluetoothGatt.CONNECTION_PRIORITY_HIGH);
                gatt.discoverServices();
                if (esCentralita(address)) {
                    adoGatt = gatt;
                }
                mainHandler.post(() -> listener.onConnectionState(address, true, name));
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                Log.i(TAG, "GATT Desconectado: " + address + " status=" + status);
                // Cerrar SIEMPRE el cliente: sacarlo del mapa sin close() lo dejaba registrado
                // en el stack Bluetooth (fuga de clientes GATT en cada intento fallido).
                if (activeGatts.get(address) == gatt) activeGatts.remove(address);
                try { gatt.close(); } catch (Exception ignored) {}
                if (esCentralita(address)) {
                    adoGatt = null;
                    adoWriteChar = null;
                    adoWriteQueue.clear();
                    isAdoWriting = false;
                    writeTimeoutHandler.removeCallbacks(writeTimeoutRunnable);
                    lastTelemetryReceivedTime = 0;
                }
                mainHandler.post(() -> listener.onConnectionState(address, false, name));
            }
        }

        @Override
        public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            String address = gatt.getDevice().getAddress();
            Log.d(TAG, "onCharacteristicWrite status=" + status + " dev=" + address);
            if (esCentralita(address)) {
                writeTimeoutHandler.removeCallbacks(writeTimeoutRunnable);
                isAdoWriting = false;
                mainHandler.post(AdoBleManager.this::processAdoWriteQueue);
            }
        }

        @Override
        public void onServicesDiscovered(BluetoothGatt gatt, int status) {
            if (status != BluetoothGatt.GATT_SUCCESS) {
                Log.w(TAG, "onServicesDiscovered status fallido: " + status);
                return;
            }

            String address = gatt.getDevice().getAddress();
            String name = null;
            try { name = gatt.getDevice().getName(); } catch (SecurityException ignored) {}
            Log.i(TAG, "Servicios descubiertos en: " + address + " (" + name + ")");

            // Centralita asignada: puerto serie BLE (Nordic UART, FFF0 o FFE0). Se intenta el protocolo ADO; si la
            // centralita habla otro, sus tramas llegan crudas al lector de códigos.
            if (esCentralita(address)) {
                adoGatt = gatt;
                UUID[][] puertos = {
                    {SERVICE_ADO_NUS, CHAR_ADO_NUS_WRITE, CHAR_ADO_NUS_NOTIFY},
                    {SERVICE_ADO_LEGACY, CHAR_ADO_LEGACY_WRITE, CHAR_ADO_LEGACY_NOTIFY},
                    {SERVICE_SERIE_FFE0, CHAR_SERIE_FFE1, CHAR_SERIE_FFE1}};
                for (UUID[] p : puertos) {
                    BluetoothGattService sv = gatt.getService(p[0]);
                    if (sv == null) continue;
                    Log.i(TAG, "Centralita: puerto serie " + p[0] + " detectado");
                    adoWriteChar = sv.getCharacteristic(p[1]);
                    BluetoothGattCharacteristic notifyChar = sv.getCharacteristic(p[2]);
                    if (notifyChar != null) {
                        enableNotifications(gatt, notifyChar);
                        mainHandler.postDelayed(AdoBleManager.this::sendAdoIdentification, 500);
                    }
                    break;
                }
            }
            // Perfiles estándar, en cualquier dispositivo asignado: pulso (0x180D), velocidad/cadencia (0x1816),
            // potencia (0x1818) y batería (0x180F). Las suscripciones se encadenan con pausa (el stack BLE atiende una a la vez).
            java.util.List<BluetoothGattCharacteristic> subs = new java.util.ArrayList<>();
            UUID[][] perfiles = {{SERVICE_HEART_RATE, CHAR_HEART_RATE_MEASUREMENT}, {SERVICE_CSCP, CHAR_CSC_MEASUREMENT},
                                 {SERVICE_CYCLING_POWER, CHAR_POWER_MEASUREMENT}, {SERVICE_BATERIA, CHAR_NIVEL_BATERIA}};
            if (!Sensores.rol(context, address).isEmpty() && !esCentralita(address)) {
                for (UUID[] p : perfiles) {
                    BluetoothGattService sv = gatt.getService(p[0]);
                    BluetoothGattCharacteristic ch = sv != null ? sv.getCharacteristic(p[1]) : null;
                    if (ch != null) subs.add(ch);
                }
            }
            for (int i = 0; i < subs.size(); i++) {
                final BluetoothGattCharacteristic ch = subs.get(i);
                mainHandler.postDelayed(() -> {
                    Log.i(TAG, "Suscribiendo a " + ch.getUuid() + " en " + address);
                    enableNotifications(gatt, ch);
                    if (CHAR_NIVEL_BATERIA.equals(ch.getUuid())) gatt.readCharacteristic(ch);
                }, 300L * i);
            }
        }

        @Override
        public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            if (status == BluetoothGatt.GATT_SUCCESS) handleCharacteristicData(characteristic.getUuid(), characteristic.getValue());
        }

        @Override
        public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
            byte[] data = characteristic.getValue();
            handleCharacteristicData(characteristic.getUuid(), data);
        }

        @Override
        public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, byte[] value) {
            handleCharacteristicData(characteristic.getUuid(), value);
        }

        private void handleCharacteristicData(UUID uuid, byte[] data) {
            if (data == null || data.length == 0) return;

            if (uuid.equals(CHAR_ADO_NUS_NOTIFY) || uuid.equals(CHAR_ADO_LEGACY_NOTIFY) || uuid.equals(CHAR_SERIE_FFE1)) {
                if (data.length >= 2 && (data[0] & 0xFF) == 0x55 && (data[1] & 0xFF) == 0xAA) {
                    protocoloAdo = true;
                    parseAdoPacket(data);
                } else {
                    final String hex = bytesToHex(data);
                    mainHandler.post(() -> listener.onCentralitaTrama(hex));
                }
            } else if (uuid.equals(CHAR_NIVEL_BATERIA)) {
                final int pct = data[0] & 0xFF;
                mainHandler.post(() -> listener.onPulsoDetalle(new int[0], pct));
            } else if (uuid.equals(CHAR_CSC_MEASUREMENT)) {
                parseCscMeasurement(data);
            } else if (uuid.equals(CHAR_HEART_RATE_MEASUREMENT)) {
                parseHeartRate(data);
            } else if (uuid.equals(CHAR_POWER_MEASUREMENT)) {
                parsePower(data);
            }
        }
    };

    private void enableNotifications(BluetoothGatt gatt, BluetoothGattCharacteristic ch) {
        try {
            gatt.setCharacteristicNotification(ch, true);
            BluetoothGattDescriptor desc = ch.getDescriptor(UUID_CLIENT_CHARACTERISTIC_CONFIG);
            if (desc != null) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    gatt.writeDescriptor(desc, BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
                } else {
                    desc.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
                    gatt.writeDescriptor(desc);
                }
                Log.d(TAG, "Notificaciones habilitadas para " + ch.getUuid());
            }
        } catch (Exception e) {
            Log.e(TAG, "Error habilitando notificaciones para " + ch.getUuid(), e);
        }
    }

    // =========================================================================
    // Protocolo ADO O260T Nativo 100% Offline (55AA Frame Protocol)
    // =========================================================================

    private static final int MAX_QUEUE_DEPTH = 6;
    private long lastAssistDebounceTime = 0;
    private int pendingAssistLevel = -1;

    public synchronized void enqueueAdoWrite(byte[] frame) {
        if (frame == null || frame.length == 0) return;
        // Guardarraíl: Evitar saturación del buffer UART de la centralita
        while (adoWriteQueue.size() >= MAX_QUEUE_DEPTH) {
            adoWriteQueue.poll();
        }
        adoWriteQueue.offer(frame);
        processAdoWriteQueue();
    }

    private synchronized void processAdoWriteQueue() {
        if (isAdoWriting) return;
        if (adoGatt == null || adoWriteChar == null) return;
        byte[] frame = adoWriteQueue.poll();
        if (frame == null) return;

        isAdoWriting = true;
        writeTimeoutHandler.removeCallbacks(writeTimeoutRunnable);
        writeTimeoutHandler.postDelayed(writeTimeoutRunnable, 1200);

        int props = adoWriteChar.getProperties();
        if ((props & BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE) != 0) {
            adoWriteChar.setWriteType(BluetoothGattCharacteristic.WRITE_TYPE_NO_RESPONSE);
        } else {
            adoWriteChar.setWriteType(BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT);
        }

        adoWriteChar.setValue(frame);
        boolean initiated = adoGatt.writeCharacteristic(adoWriteChar);
        Log.d(TAG, "GATT writeCharacteristic iniciado=" + initiated + " (type=" + adoWriteChar.getWriteType() + ") -> " + bytesToHex(frame));
        if (initiated) {
            // Si es WRITE_TYPE_NO_RESPONSE, avanzar la cola tras 80ms para no saturar el buffer UART de la centralita
            if (adoWriteChar.getWriteType() == BluetoothGattCharacteristic.WRITE_TYPE_NO_RESPONSE) {
                mainHandler.postDelayed(() -> {
                    isAdoWriting = false;
                    writeTimeoutHandler.removeCallbacks(writeTimeoutRunnable);
                    processAdoWriteQueue();
                }, 80);
            }
        } else {
            isAdoWriting = false;
            writeTimeoutHandler.removeCallbacks(writeTimeoutRunnable);
            mainHandler.postDelayed(this::processAdoWriteQueue, 150);
        }
    }

    public void sendAdoIdentification() {
        if (adoGatt == null || adoWriteChar == null) return;
        Log.i(TAG, "Enviando ADO Identification Handshake: 55AA011110010004D8FF");
        byte[] frame = hexStringToByteArray("55AA011110010004D8FF");
        enqueueAdoWrite(frame);
    }

    private final Runnable assistDebounceRunnable = () -> {
        if (pendingAssistLevel >= 1 && pendingAssistLevel <= 5) {
            executeSendAdoAssist(pendingAssistLevel);
            pendingAssistLevel = -1;
        }
    };

    public synchronized void sendAdoAssist(int level) {
        if (adoGatt == null) {
            Log.w(TAG, "sendAdoAssist: adoGatt no está conectado!");
            return;
        }
        if (level < 1) level = 1;
        if (level > 5) level = 5;

        long now = System.currentTimeMillis();
        // Guardarraíl: Debounce de 250ms para no saturar el bus UART con pulsaciones rápidas
        if (now - lastAssistDebounceTime < 250) {
            pendingAssistLevel = level;
            mainHandler.removeCallbacks(assistDebounceRunnable);
            mainHandler.postDelayed(assistDebounceRunnable, 250);
            return;
        }
        lastAssistDebounceTime = now;
        executeSendAdoAssist(level);
    }

    private void executeSendAdoAssist(int level) {
        Log.i(TAG, "Enviando Asistencia ADO nivel: " + level);

        // 1. Comando oficial ADO UART gear: 0111F2020B + "0" + level + checksum Little-Endian
        String payloadGear = String.format(Locale.US, "0111F2020B0%X", level);
        byte[] frameGear = buildAdoFrame(payloadGear);
        enqueueAdoWrite(frameGear);

        // 2. Comando oficial ADO CAN canzhuli: 0111F30204 + "0" + level + checksum Little-Endian
        String payloadCan = String.format(Locale.US, "0111F302040%X", level);
        byte[] frameCan = buildAdoFrame(payloadCan);
        enqueueAdoWrite(frameCan);

        // 3. Comando oficial ADO CAN modo conducción: canqixing: 0111F30205 + "0" + level + checksum Little-Endian
        String payloadMode = String.format(Locale.US, "0111F302050%X", level);
        byte[] frameMode = buildAdoFrame(payloadMode);
        enqueueAdoWrite(frameMode);
    }

    public void sendAdoNavStart() {
        if (adoGatt == null) {
            Log.w(TAG, "sendAdoNavStart: adoGatt no conectado");
            return;
        }
        Log.i(TAG, ">>> ACTIVANDO MODO NAVEGACION EN PANEL DE CENTRALITA ADO <<<");
        // startadress oficial: 0211F103000101 (Checksum F6FE)
        byte[] frame = buildAdoFrame("0211F103000101");
        enqueueAdoWrite(frame);
    }

    public void sendAdoNavEnd() {
        if (adoGatt == null) {
            Log.w(TAG, "sendAdoNavEnd: adoGatt no conectado");
            return;
        }
        Log.i(TAG, ">>> DESACTIVANDO MODO NAVEGACION EN PANEL DE CENTRALITA ADO <<<");
        // endadress oficial: 0211F103000003 (Checksum F5FE)
        byte[] frame = buildAdoFrame("0211F103000003");
        enqueueAdoWrite(frame);
    }

    private int navSeqCounter = 0;

    public void sendAdoNavGuidance(int dirCode, int distanceMeters, int totalRemainingMeters) {
        if (adoGatt == null) return;
        navSeqCounter = (navSeqCounter + 1) & 0xFF;
        String seqHex = String.format(Locale.US, "%02X", navSeqCounter);

        // Protocolo Oficial ADO adressPath: 3 bytes distancia en Little-Endian + 1 byte código de maniobra
        int d = Math.min(0xFFFFFF, Math.max(0, distanceMeters));
        byte d0 = (byte) (d & 0xFF);
        byte d1 = (byte) ((d >> 8) & 0xFF);
        byte d2 = (byte) ((d >> 16) & 0xFF);
        String stepHex = String.format(Locale.US, "%02X%02X%02X%02X", d0, d1, d2, (byte) dirCode);

        // Protocolo Oficial ADO adressCount: 4 bytes distancia total restante en Little-Endian
        int rem = Math.min(0x7FFFFFFF, Math.max(0, totalRemainingMeters));
        byte r0 = (byte) (rem & 0xFF);
        byte r1 = (byte) ((rem >> 8) & 0xFF);
        byte r2 = (byte) ((rem >> 16) & 0xFF);
        byte r3 = (byte) ((rem >> 24) & 0xFF);
        String remHex = String.format(Locale.US, "%02X%02X%02X%02X", r0, r1, r2, r3);

        // 1211F10300 + seq + "02" + stepHex + nextStepHex("00000000") + pad("00000000") + remHex
        String payload = "1211F10300" + seqHex + "02" + stepHex + "00000000" + "00000000" + remHex;
        byte[] frame = buildAdoFrame(payload);
        enqueueAdoWrite(frame);
    }

    public void sendAdoNavGuidance(int dirCode, int distanceMeters) {
        sendAdoNavGuidance(dirCode, distanceMeters, distanceMeters);
    }

    public void sendRawAdoHex(String hex) {
        if (hex == null || hex.trim().isEmpty()) return;
        String clean = hex.trim().toUpperCase(Locale.US);
        byte[] frame;
        if (!clean.startsWith("55AA")) {
            frame = buildAdoFrame(clean);
        } else {
            frame = hexStringToByteArray(clean);
        }
        enqueueAdoWrite(frame);
    }

    private byte[] buildAdoFrame(String hexPayload) {
        String chk = calculateChecksum(hexPayload);
        String fullHex = "55AA" + hexPayload + chk;
        Log.d(TAG, "Frame construido: " + fullHex);
        return hexStringToByteArray(fullHex);
    }

    // Clave AES-128 del protocolo oficial ADO O260T extraída de la app oficial
    private static final byte[] ADO_AES_KEY = "2CTDU40qNyCgTjb1".getBytes(StandardCharsets.UTF_8);

    private byte[] encryptAdoChallenge(byte[] token4Bytes) {
        try {
            byte[] input = new byte[16];
            System.arraycopy(token4Bytes, 0, input, 0, Math.min(4, token4Bytes.length));

            SecretKeySpec keySpec = new SecretKeySpec(ADO_AES_KEY, "AES");
            Cipher cipher = Cipher.getInstance("AES/ECB/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            return cipher.doFinal(input);
        } catch (Exception e) {
            Log.e(TAG, "Error cifrando reto AES ADO", e);
            return null;
        }
    }

    private void parseAdoPacket(byte[] data) {
        if (data == null || data.length < 6) return;

        String hex = bytesToHex(data);
        Log.i(TAG, "ADO INCOMING: " + hex);

        // Validar cabecera 0x55 0xAA
        if ((data[0] & 0xFF) == 0x55 && (data[1] & 0xFF) == 0xAA) {

            // 1. Detección de Reto de Autenticación de la Centralita ADO: 55AA 04 10 11 04 00 [4 bytes token] [checksum]
            if (data.length >= 11 && (data[3] & 0xFF) == 0x10 && (data[5] & 0xFF) == 0x04 && (data[6] & 0xFF) == 0x00) {
                byte[] token = new byte[4];
                System.arraycopy(data, 7, token, 0, 4);
                Log.i(TAG, "¡Reto de autenticación ADO detectado! Token: " + bytesToHex(token));
                
                byte[] enc = encryptAdoChallenge(token);
                if (enc != null) {
                    String encHex = bytesToHex(enc);
                    // Comando ide oficial: terminalProtocol (55AA) + 1011102000 + encHex + checksum
                    String payload = "1011102000" + encHex;
                    byte[] responseFrame = buildAdoFrame(payload);
                    Log.i(TAG, "Enviando respuesta de autenticación AES (ide): " + bytesToHex(responseFrame));
                    enqueueAdoWrite(responseFrame);
                }
                return;
            }

            // 2. Confirmación de Autenticación Exitosa enviada por la bici (55AA 01 10 11 20 00 01 [checksum])
            if (data.length >= 8 && (data[3] & 0xFF) == 0x10 && (data[5] & 0xFF) == 0x20 && (data[6] & 0xFF) == 0x00) {
                Log.i(TAG, "¡AUTENTICACION ADO EXITOSA CONFIRMADA POR LA CENTRALITA!");
                
                // 100% OFFLINE SECUENCIA DE ARRANQUE LOCAL:
                // Paso 1: timeSend (sincronizar RTC local)
                long nowSec = System.currentTimeMillis() / 1000L;
                java.util.TimeZone tz = java.util.TimeZone.getDefault();
                int offsetSec = tz.getOffset(System.currentTimeMillis()) / 1000;
                long localSec = nowSec + offsetSec;
                byte[] tsLe = new byte[4];
                tsLe[0] = (byte) (localSec & 0xFF);
                tsLe[1] = (byte) ((localSec >> 8) & 0xFF);
                tsLe[2] = (byte) ((localSec >> 16) & 0xFF);
                tsLe[3] = (byte) ((localSec >> 24) & 0xFF);
                String payloadTime = "0411100246" + bytesToHex(tsLe);
                byte[] frameTime = buildAdoFrame(payloadTime);
                Log.i(TAG, "Enviando timeSend sincronización reloj: " + bytesToHex(frameTime));
                enqueueAdoWrite(frameTime);

                // Paso 2: newcode (0111F1010101) a los 250ms
                mainHandler.postDelayed(() -> {
                    Log.i(TAG, "Enviando newcode (0111F1010101)");
                    enqueueAdoWrite(hexStringToByteArray("55AA0111F1010101F9FE"));
                }, 250);

                // Paso 3: code (0111A5011818) a los 500ms
                mainHandler.postDelayed(() -> {
                    Log.i(TAG, "Enviando code (0111A5011818)");
                    enqueueAdoWrite(hexStringToByteArray("55AA0111A501181813FE"));
                }, 500);

                // Paso 4: candsone (0111F3010035) a los 750ms
                mainHandler.postDelayed(() -> {
                    Log.i(TAG, "Enviando CAN candsone (0111F3010035)");
                    enqueueAdoWrite(hexStringToByteArray("55AA0111F3010035C4FE"));
                }, 750);

                // Paso 5: caninfo (0111F3013005) a los 1000ms
                mainHandler.postDelayed(() -> {
                    Log.i(TAG, "Enviando CAN caninfo (0111F3013005)");
                    enqueueAdoWrite(hexStringToByteArray("55AA0111F3013005C4FE"));
                }, 1000);
                return;
            }

            // 3. Paquete de Telemetría Oficial (Tabla 01, longitud >= 26 bytes)
            if (data.length >= 26 && (data[3] & 0xFF) == 0x10 && (data[6] & 0xFF) == 0x01) {
                lastTelemetryReceivedTime = System.currentTimeMillis();

                // Byte 11 (D40): Estado luces
                // Byte 12 (D5): Asistencia actual (1 a 5)
                // Byte 13 (D6): Total de marchas (5)
                // Byte 14 (D7): Batería del vehículo (% 0-100, valor & 0x7F)
                // Bytes 16, 17 (D9): Velocidad actual (16-bit Little-Endian / 10.0 = km/h)
                // Bytes 18..21 (D11): Trip mileage (32-bit Little-Endian / 100.0)
                // Bytes 22..25 (D15): Odómetro acumulado total (32-bit Little-Endian / 100.0)

                int rawAssist = data[12] & 0xFF;
                int rawBat = data[14] & 0xFF;
                int batteryPct = rawBat & 0x7F; // parseHex(val): 127 & val
                if (batteryPct > 100) batteryPct = 100;

                int rawSpeed = (data[16] & 0xFF) | ((data[17] & 0xFF) << 8);
                double speedKmh = rawSpeed / 10.0;
                // Deadband reposo
                if (speedKmh <= 0.25) speedKmh = 0.0;

                // Odómetro total: 4 bytes Little Endian (D15)
                long rawOdo = ((long)(data[22] & 0xFF)) |
                              (((long)(data[23] & 0xFF)) << 8) |
                              (((long)(data[24] & 0xFF)) << 16) |
                              (((long)(data[25] & 0xFF)) << 24);

                // En app-service.js: Math.floor(parseFloat(hexCharCodeToStr(i) / 10)) / 10 = rawOdo / 100.0
                double odoTotalKm = rawOdo / 100.0;
                // Si la bici reporta en decámetros o hectómetros
                if (odoTotalKm < 100.0 && rawOdo >= 10000) {
                    odoTotalKm = rawOdo / 10.0;
                } else if (odoTotalKm > 50000.0 && rawOdo > 1000000) {
                    odoTotalKm = rawOdo / 1000.0;
                }

                // Trip mileage: 4 bytes Little Endian
                long rawTrip = ((long)(data[18] & 0xFF)) |
                               (((long)(data[19] & 0xFF)) << 8) |
                               (((long)(data[20] & 0xFF)) << 16) |
                               (((long)(data[21] & 0xFF)) << 24);
                double odoTripKm = rawTrip / 100.0;

                Log.i(TAG, String.format(Locale.US, ">>> TELEMETRIA ADO REAL: Bat=%d%%, Assist=%d, Vel=%.1f km/h, ODO=%.1f km, Trip=%.1f km <<<",
                        batteryPct, rawAssist, speedKmh, odoTotalKm, odoTripKm));

                final int fBat = batteryPct;
                final int fAssist = rawAssist;
                final double fSpeed = speedKmh;
                final double fOdoTotal = odoTotalKm;
                final double fOdoTrip = odoTripKm;

                mainHandler.post(() -> listener.onAdoTelemetry(fBat, fAssist, 0, fSpeed, fOdoTotal, fOdoTrip));
                return;
            }

            // 4. Paquete de Datos de Kilometraje / Tiempo (Tabla 09, longitud >= 24 bytes)
            if (data.length >= 24 && (data[3] & 0xFF) == 0x10 && (data[6] & 0xFF) == 0x09) {
                lastTelemetryReceivedTime = System.currentTimeMillis();
                Log.i(TAG, "ADO PACKET 09 RECIBIDO: " + bytesToHex(data));
                return;
            }
        }
    }

    public static String calculateChecksum(String hexPayload) {
        int sum = 0;
        for (int i = 0; i < hexPayload.length(); i += 2) {
            String part = hexPayload.substring(i, Math.min(i + 2, hexPayload.length()));
            sum += Integer.parseInt(part, 16);
        }
        sum ^= 0xFFFF;
        // Little-Endian (low byte first, then high byte)
        return String.format(Locale.US, "%02X%02X", sum & 0xFF, (sum >> 8) & 0xFF);
    }

    public static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i+1), 16));
        }
        return data;
    }

    public static String bytesToHex(byte[] bytes) {
        if (bytes == null) return "";
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02X", b));
        }
        return sb.toString();
    }

    // =========================================================================
    // Parseo de Sensores Estándar
    // =========================================================================

    /** Medición de ritmo cardíaco (0x2A37, perfil HRS completo): pulso de 8 o 16 bits, energía e intervalos RR. */
    private void parseHeartRate(byte[] data) {
        if (data.length < 2) return;
        int flags = data[0] & 0xFF;
        boolean dieciseis = (flags & 0x01) != 0;
        if (dieciseis && data.length < 3) return;
        int hr = dieciseis ? ((data[1] & 0xFF) | ((data[2] & 0xFF) << 8)) : (data[1] & 0xFF);
        int off = dieciseis ? 3 : 2;
        if ((flags & 0x08) != 0) off += 2;                       // energía gastada (no se usa)
        java.util.List<Integer> rr = new java.util.ArrayList<>();
        if ((flags & 0x10) != 0) {
            for (; off + 1 < data.length; off += 2) rr.add((int) Math.round(((data[off] & 0xFF) | ((data[off + 1] & 0xFF) << 8)) * 1000.0 / 1024.0));
        }
        mainHandler.post(() -> listener.onHeartRateUpdate(hr));
        if (!rr.isEmpty()) {
            int[] v = new int[rr.size()];
            for (int i = 0; i < v.length; i++) v[i] = rr.get(i);
            mainHandler.post(() -> listener.onPulsoDetalle(v, -1));
        }
    }

    private void parsePower(byte[] data) {
        if (data.length < 4) return;
        int watts = (data[2] & 0xFF) | ((data[3] & 0xFF) << 8);
        mainHandler.post(() -> listener.onPowerUpdate(watts));
    }

    private void parseCscMeasurement(byte[] data) {
        int flags = data[0] & 0xFF;
        boolean hasWheel = (flags & 0x01) != 0;
        boolean hasCrank = (flags & 0x02) != 0;
        int offset = 1;

        double speedKmh = 0.0;
        int cadenceRpm = 0;

        if (hasWheel && data.length >= offset + 6) {
            long wheelRevs = ((long)(data[offset] & 0xFF)) |
                             (((long)(data[offset+1] & 0xFF)) << 8) |
                             (((long)(data[offset+2] & 0xFF)) << 16) |
                             (((long)(data[offset+3] & 0xFF)) << 24);
            int wheelTime = ((data[offset+4] & 0xFF) | ((data[offset+5] & 0xFF) << 8));
            offset += 6;

            if (lastWheelRevs >= 0 && lastWheelTime >= 0) {
                long dRevs = wheelRevs - lastWheelRevs;
                int dTime = wheelTime - lastWheelTime;
                if (dTime < 0) dTime += 65536;
                if (dTime > 0 && dRevs > 0) {
                    double distMeters = dRevs * wheelCircumferenceM;
                    double timeSec = dTime / 1024.0;
                    speedKmh = (distMeters / timeSec) * 3.6;
                }
            }
            lastWheelRevs = wheelRevs;
            lastWheelTime = wheelTime;
        }

        if (hasCrank && data.length >= offset + 4) {
            int crankRevs = (data[offset] & 0xFF) | ((data[offset+1] & 0xFF) << 8);
            int crankTime = (data[offset+2] & 0xFF) | ((data[offset+3] & 0xFF) << 8);

            if (lastCrankRevs >= 0 && lastCrankTime >= 0) {
                int dRevs = crankRevs - lastCrankRevs;
                int dTime = crankTime - lastCrankTime;
                if (dRevs < 0) dRevs += 65536;
                if (dTime < 0) dTime += 65536;
                if (dTime > 0) {
                    cadenceRpm = (int) Math.round((dRevs * 60.0 * 1024.0) / dTime);
                }
            }
            lastCrankRevs = crankRevs;
            lastCrankTime = crankTime;
        }

        final double fSpeed = speedKmh;
        final int fCad = cadenceRpm;
        mainHandler.post(() -> listener.onSpeedCadenceUpdate(fSpeed, fCad));
    }
}
