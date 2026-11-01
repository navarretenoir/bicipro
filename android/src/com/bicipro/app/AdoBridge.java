package com.bicipro.app;

import android.media.MediaPlayer;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.PrintWriter;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.lang.reflect.Method;
import android.os.StrictMode;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.TimeZone;
import android.content.ContentUris;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Size;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.net.Uri;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.Settings;
import android.speech.tts.TextToSpeech;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.telephony.SmsMessage;
import android.telecom.TelecomManager;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothProfile;
import android.database.Cursor;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.io.BufferedWriter;
import android.util.Log;
import android.view.KeyEvent;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class AdoBridge implements LocationListener, SensorEventListener, AdoBleManager.BleListener, TextToSpeech.OnInitListener {

    private static final String TAG = "ADO_BRIDGE";

    private final Activity activity;
    private final WebView webView;
    private final LocationManager locationManager;
    private final SensorManager sensorManager;
    private final AdoBleManager bleManager;
    private final SharedPreferences prefs;
    private final Handler mainHandler;

    private TextToSpeech tts;
    private Vibrator vibrator;
    private AudioManager audioManager;
    private TelephonyManager telephonyManager;
    private AudioTrack hornAudioTrack;

    // Bocina: Buffer estático precalculado y estado de emisión sin interferencia
    private static short[] hornPcmBuffer = null;
    private volatile boolean isHornBlasting = false;

    // Suavizado y Rate-Limit de Actitud (Horizonte Artificial Aeronáutico)
    private float smoothedPitchDeg = 0.0f;
    private float smoothedRollDeg = 0.0f;
    private long lastAttitudePostTime = 0;

    // Sensores de Hardware para Máxima Precisión
    private Sensor rotationSensor;
    private Sensor pressureSensor;
    private float[] rotationMatrix = new float[9];
    private float[] orientationValues = new float[3];
    private double currentPressureHpa = 1013.25;

    // Estado de Grabación de Ruta
    private boolean isRecording = false;
    private boolean isPaused = false;
    private boolean userManuallyStoppedRide = false;
    private File lastExportedGpxFile = null;
    private long startTimestamp = 0;
    private long lastMovingTimestamp = 0;
    private Location lastLocation = null;
    private int currentLapNumber = 1;

    // Métricas en Sistema Métrico Puro y Filtro de Precisión
    private double currentSpeedKmh = 0.0;
    private double maxSpeedKmh = 0.0;
    private double totalDistanceKm = 0.0;
    private double currentAltitudeM = 0.0;
    private double smoothedAltitudeM = 0.0;
    private double totalElevationGainM = 0.0;
    private double totalElevationLossM = 0.0;
    private double currentGradePct = 0.0; // Inclinación / Pendiente (%)
    private double altHysteresisValleyM = 0.0;
    private double altHysteresisPeakM = 0.0;
    private double lastCommittedAltM = 0.0;

    // Sensor Fusion Engine (Velocidades Independientes)
    private double speedGpsKmh = 0.0;
    private long lastGpsSpeedTime = 0;
    private double speedXossKmh = 0.0;
    private long lastXossSpeedTime = 0;
    private double speedAdoKmh = 0.0;
    private long lastAdoSpeedTime = 0;

    // Watchdog de Velocidad Cero (Elimina velocidad congelada al detenerse)
    private final Handler speedWatchdogHandler = new Handler(Looper.getMainLooper());
    private final Runnable speedDecayRunnable = new Runnable() {
        @Override
        public void run() {
            if (isHornBlasting) {
                // Protección contra interferencia: si la bocina está sonando, posponer sin truncar velocidad a 0
                speedWatchdogHandler.postDelayed(this, 1200);
                return;
            }
            if (currentSpeedKmh > 0.0) {
                currentSpeedKmh = 0.0;
                speedAdoKmh = 0.0;
                speedXossKmh = 0.0;
                postJs("if (window.onSpeedUpdate) window.onSpeedUpdate(0.0); if (window.updateSpeed) window.updateSpeed(0.0);");
            }
        }
    };

    // Buffer rodante para cálculo de pendiente suave (Rise / Run)
    private static class GradePoint {
        final double distanceKm;
        final double altitudeM;
        GradePoint(double d, double a) { this.distanceKm = d; this.altitudeM = a; }
    }
    private final java.util.LinkedList<GradePoint> gradeBuffer = new java.util.LinkedList<>();
    private int currentCadenceRpm = 0;
    private int currentHeartRateBpm = 0;
    private int currentPowerWatts = 0;
    private int totalCaloriesKcal = 0;

    // Odómetro de la Bicicleta ADO O260T
    private double adoTotalOdoKm = 0.0;
    private double adoTripOdoKm = 0.0;
    private int adoBatteryPct = 100;
    private int adoAssistLevel = 1;

    // Batería del Teléfono
    private int phoneBatteryPct = 100;
    private boolean isPhoneCharging = false;

    // Control de Brújula (Azimuth)
    private float currentAzimuthDeg = 0f;

    // Rastro de puntos GPS con Frecuencia Cardíaca
    private static class GpsPoint {
        double lat, lon, alt, speed;
        int heartRate;
        long time;
        GpsPoint(double lat, double lon, double alt, double speed, int heartRate, long time) {
            this.lat = lat; this.lon = lon; this.alt = alt; this.speed = speed; this.heartRate = heartRate; this.time = time;
        }
    }
    private static AdoBridge instance;
    private final List<GpsPoint> rideTrack = new ArrayList<>();

    public static AdoBridge getInstance() {
        return instance;
    }

    private StravaClient strava;

    public AdoBridge(Activity activity, WebView webView) {
        instance = this;
        this.activity = activity;
        this.webView = webView;
        this.mainHandler = new Handler(Looper.getMainLooper());
        this.locationManager = (LocationManager) activity.getSystemService(Context.LOCATION_SERVICE);
        this.sensorManager = (SensorManager) activity.getSystemService(Context.SENSOR_SERVICE);
        this.bleManager = new AdoBleManager(activity, this);
        this.prefs = activity.getSharedPreferences("ado_o260t_storage", Context.MODE_PRIVATE);
        this.strava = new StravaClient(prefs);
        this.audioManager = (AudioManager) activity.getSystemService(Context.AUDIO_SERVICE);

        // Inicializar odómetros inmediatamente con la última sincronización en caché
        float cachedOdo = prefs.getFloat("cached_ado_total_odo_km", 0.0f);
        if (cachedOdo <= 0.0f) {
            cachedOdo = 1319.03f;
            prefs.edit().putFloat("cached_ado_total_odo_km", cachedOdo).apply();
        }
        this.adoTotalOdoKm = (double) cachedOdo;
        this.adoTripOdoKm = (double) prefs.getFloat("cached_ado_trip_odo_km", 0.0f);

        try {
            vibrator = (Vibrator) activity.getSystemService(Context.VIBRATOR_SERVICE);
            tts = new TextToSpeech(activity, this);
            initTelemetryLogger();
            setupHardwareSensors();
            setupPhoneBatteryReceiver();
            setupTelephonyListener();
            setupSmsReceiver();
            setupMusicReceiver();
            setupCommandReceiver();
            verifyShoaNtpSync();
            requestLocation();
            cleanDummyHistory();
        } catch (Exception ignored) {}
    }

    private void setupHardwareSensors() {
        if (sensorManager != null) {
            rotationSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR);
            if (rotationSensor == null) {
                rotationSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION);
            }
            if (rotationSensor != null) {
                sensorManager.registerListener(this, rotationSensor, SensorManager.SENSOR_DELAY_GAME);
            }

            pressureSensor = sensorManager.getDefaultSensor(Sensor.TYPE_PRESSURE);
            if (pressureSensor != null) {
                sensorManager.registerListener(this, pressureSensor, SensorManager.SENSOR_DELAY_UI);
            }

        }
    }

    private void setupPhoneBatteryReceiver() {
        try {
            IntentFilter filter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
            activity.registerReceiver(new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {
                    if (intent != null) {
                        int level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
                        int scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
                        int status = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
                        if (level >= 0 && scale > 0) {
                            phoneBatteryPct = (level * 100) / scale;
                            isPhoneCharging = (status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL);
                            postJs("if(window.onPhoneBatteryUpdate) window.onPhoneBatteryUpdate(" + phoneBatteryPct + ", " + isPhoneCharging + "); if(window.onPhoneBattery) window.onPhoneBattery(" + phoneBatteryPct + ");");
                        }
                    }
                }
            }, filter);
        } catch (Exception ignored) {}
    }

    private void setupTelephonyListener() {
        try {
            telephonyManager = (TelephonyManager) activity.getSystemService(Context.TELEPHONY_SERVICE);
            if (telephonyManager != null) {
                telephonyManager.listen(new PhoneStateListener() {
                    @Override
                    public void onCallStateChanged(int state, String incomingNumber) {
                        super.onCallStateChanged(state, incomingNumber);
                        String caller = (incomingNumber != null && !incomingNumber.isEmpty()) ? incomingNumber : "Número Desconocido";
                        if (state == TelephonyManager.CALL_STATE_RINGING) {
                            postJs("window.onIncomingCall('" + escape(caller) + "', true)");
                            vibrate(500);
                        } else if (state == TelephonyManager.CALL_STATE_IDLE) {
                            postJs("window.onIncomingCall('', false)");
                        }
                    }
                }, PhoneStateListener.LISTEN_CALL_STATE);
            }
        } catch (Exception ignored) {}
    }

    // =========================================================================
    // Generador de Bocina de Ultra-Potencia (Sonido Fuerte Piercing Acústico)
    // =========================================================================

    private static synchronized void ensureHornBuffer() {
        if (hornPcmBuffer != null) return;
        int sampleRate = 44100;
        int durationMs = 1500;
        int numSamples = (durationMs * sampleRate) / 1000;
        hornPcmBuffer = new short[numSamples];

        double freqA = 2350.0; // Penetración
        double freqB = 3150.0; // Armónico
        double freqSub = 440.0; // Base
        double modFreq = 16.0;  // Aire comprimido

        for (int i = 0; i < numSamples; i++) {
            double time = (double) i / sampleRate;
            double mod = 0.85 + 0.15 * Math.sin(2.0 * Math.PI * modFreq * time);
            double wave = (Math.sin(2.0 * Math.PI * freqA * time) * 0.50
                         + Math.sin(2.0 * Math.PI * freqB * time) * 0.35
                         + Math.sin(2.0 * Math.PI * freqSub * time) * 0.25) * mod;
            double clipped = Math.max(-1.0, Math.min(1.0, wave * 2.2));
            hornPcmBuffer[i] = (short) (clipped * Short.MAX_VALUE);
        }
    }

    @JavascriptInterface
    public void blastHorn() {
        // Ejecución 100% asíncrona fuera del hilo de UI/WebView
        // CERO interferencia con STREAM_MUSIC (no corta la música ni el audio Bluetooth)
        new Thread(() -> {
            try {
                isHornBlasting = true;
                ensureHornBuffer();

                if (audioManager != null) {
                    try {
                        int maxAlarm = audioManager.getStreamMaxVolume(AudioManager.STREAM_ALARM);
                        audioManager.setStreamVolume(AudioManager.STREAM_ALARM, maxAlarm, 0);
                    } catch (Exception ignored) {}
                }

                int sampleRate = 44100;
                AudioTrack track = android.os.Build.VERSION.SDK_INT < 23 ? bocinaAntigua(sampleRate) : new AudioTrack.Builder()
                        .setAudioAttributes(new AudioAttributes.Builder()
                                .setUsage(AudioAttributes.USAGE_ALARM)
                                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                                .build())
                        .setAudioFormat(new AudioFormat.Builder()
                                .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                                .setSampleRate(sampleRate)
                                .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                                .build())
                        .setBufferSizeInBytes(hornPcmBuffer.length * 2)
                        .setTransferMode(AudioTrack.MODE_STATIC)
                        .build();

                track.write(hornPcmBuffer, 0, hornPcmBuffer.length);
                track.setVolume(1.0f);
                track.play();

                Thread.sleep(1500 + 100);
                try { track.stop(); } catch (Exception ignored) {}
                track.release();
            } catch (Exception e) {
                Log.e(TAG, "Error emitiendo bocina acústica", e);
            } finally {
                isHornBlasting = false;
            }
        }).start();
    }

    // =========================================================================
    // Brújula y Sensores de Hardware (Orientation & Pressure)
    // =========================================================================

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_ROTATION_VECTOR) {
            SensorManager.getRotationMatrixFromVector(rotationMatrix, event.values);
            SensorManager.getOrientation(rotationMatrix, orientationValues);
            float azimuthRad = orientationValues[0];
            float azimuthDeg = (float) Math.toDegrees(azimuthRad);
            if (azimuthDeg < 0) azimuthDeg += 360f;

            // Filtro de suavizado de brújula con deadband de 4 grados
            float diff = Math.abs(azimuthDeg - currentAzimuthDeg);
            if (diff > 180f) diff = 360f - diff;
            if (diff > 4.0f) {
                currentAzimuthDeg = azimuthDeg;
                String cardinal = getCardinalDirection(currentAzimuthDeg);
                postJs("if (window.onCompassUpdate) window.onCompassUpdate(" + Math.round(currentAzimuthDeg) + ", '" + cardinal + "');");
            }

            // Horizonte Artificial Aeronáutico: Filtro Pasa-Bajos Exponencial (EMA) y Rate-Limit (35Hz)
            float rawPitch = (float) Math.toDegrees(orientationValues[1]);
            float rawRoll = (float) Math.toDegrees(orientationValues[2]);

            if (smoothedPitchDeg == 0.0f && smoothedRollDeg == 0.0f) {
                smoothedPitchDeg = rawPitch;
                smoothedRollDeg = rawRoll;
            } else {
                smoothedPitchDeg = (smoothedPitchDeg * 0.84f) + (rawPitch * 0.16f);
                smoothedRollDeg = (smoothedRollDeg * 0.84f) + (rawRoll * 0.16f);
            }

            long now = SystemClock.uptimeMillis();
            if (now - lastAttitudePostTime >= 28) {
                lastAttitudePostTime = now;
                postJs(String.format(Locale.US,
                        "window.__nativeAttitudeActive=true;if (window.onAttitudeUpdate) window.onAttitudeUpdate(%.2f, %.2f);",
                        smoothedPitchDeg, smoothedRollDeg));
            }
        } else if (event.sensor.getType() == Sensor.TYPE_PRESSURE) {
            currentPressureHpa = event.values[0];
            // Cálculo barométrico de altitud estándar con filtro y deadband para reposo
            float baroAlt = SensorManager.getAltitude(SensorManager.PRESSURE_STANDARD_ATMOSPHERE, (float) currentPressureHpa);
            if (baroAlt > -200 && baroAlt < 7000) {
                if (smoothedAltitudeM == 0.0) {
                    smoothedAltitudeM = baroAlt;
                    currentAltitudeM = Math.round(smoothedAltitudeM);
                } else {
                    boolean isStationary = (currentSpeedKmh < 1.4 && speedAdoKmh < 0.8);
                    double deadband = isStationary ? 3.0 : 1.8;
                    smoothedAltitudeM = (smoothedAltitudeM * 0.92) + (baroAlt * 0.08);
                    if (Math.abs(smoothedAltitudeM - currentAltitudeM) >= deadband) {
                        currentAltitudeM = Math.round(smoothedAltitudeM);
                    }
                }
            }
        }
    }

    public void resetSpeedWatchdog(double newSpeedKmh) {
        // Reset de watchdog de velocidad cero (forzar a 0.0 tras 2.8s sin lecturas de rueda)
        speedWatchdogHandler.removeCallbacks(speedDecayRunnable);
        if (newSpeedKmh > 0.0) {
            speedWatchdogHandler.postDelayed(speedDecayRunnable, 2800);
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {}

    private String getCardinalDirection(float deg) {
        if (deg >= 337.5 || deg < 22.5) return "N";
        if (deg < 67.5) return "NE";
        if (deg < 112.5) return "E";
        if (deg < 157.5) return "SE";
        if (deg < 202.5) return "S";
        if (deg < 247.5) return "SO";
        if (deg < 292.5) return "O";
        return "NO";
    }

    // =========================================================================
    // GPS de Ultra-Precisión y Cálculo de Pendiente / Cadence
    // =========================================================================

    @SuppressLint("MissingPermission")
    private void requestLocation() {
        try {
            if (locationManager != null) {
                if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                    locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, this);
                }
                if (locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                    locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 2000, 0, this);
                }
                Location lastGps = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                if (lastGps != null) {
                    onLocationChanged(lastGps);
                } else {
                    Location lastNet = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
                    if (lastNet != null) {
                        onLocationChanged(lastNet);
                    }
                }
            }
        } catch (SecurityException ignored) {}
    }

    @Override
    public void onLocationChanged(Location loc) {
        if (loc == null || isPaused) return;

        double lat = loc.getLatitude();
        double lon = loc.getLongitude();

        // 1. Filtrado de Altitud GPS con Control de Calidad, Pasa-Bajos y Margen Deadband Anti-Jitter
        if (loc.hasAltitude()) {
            double rawAlt = loc.getAltitude();
            if (rawAlt >= -50.0 && rawAlt <= 5500.0) {
                if (smoothedAltitudeM == 0.0) {
                    smoothedAltitudeM = rawAlt;
                    altHysteresisValleyM = rawAlt;
                    altHysteresisPeakM = rawAlt;
                    lastCommittedAltM = rawAlt;
                    currentAltitudeM = Math.round(smoothedAltitudeM);
                } else {
                    // Pasa-bajos exponencial (alfa = 0.06): absorbe la fluctuación de señal satelital vertical
                    smoothedAltitudeM = (smoothedAltitudeM * 0.94) + (rawAlt * 0.06);

                    // Margen Deadband / Histéresis:
                    // Si la bici o teléfono están en reposo (velocidad < 1.4 km/h), congelar la altitud visible
                    // frente a fluctuaciones de hasta 3.5 metros. En movimiento, exigir cambio >= 2.0 metros.
                    boolean isStationary = (currentSpeedKmh < 1.4 && speedAdoKmh < 0.8);
                    double deadband = isStationary ? 3.5 : 2.0;

                    if (Math.abs(smoothedAltitudeM - currentAltitudeM) >= deadband) {
                        currentAltitudeM = Math.round(smoothedAltitudeM);
                    }
                }
            }
        }

        // 2. Velocidad GPS con Filtro Anti-Jitter para Reposo
        if (loc.hasSpeed()) {
            double rawSpd = loc.getSpeed() * 3.6;
            // Filtro de ruido Doppler: cualquier velocidad GPS <= 1.4 km/h en reposo se clava en 0.0
            if (rawSpd <= 1.4) {
                speedGpsKmh = 0.0;
            } else {
                speedGpsKmh = rawSpd;
            }
        } else {
            speedGpsKmh = 0.0;
        }

        // Si la distancia física entre lecturas consecutivas es menor a 1.5m, forzar GPS a 0.0
        if (lastLocation != null) {
            float[] dCheck = new float[1];
            Location.distanceBetween(lastLocation.getLatitude(), lastLocation.getLongitude(), lat, lon, dCheck);
            if (dCheck[0] < 1.5f && speedGpsKmh < 2.5) {
                speedGpsKmh = 0.0;
            }
        }

        // Jerarquía de Sensores (Sensor Fusion): Si la centralita ADO o sensor XOSS están transmitiendo, manda el sensor de rueda físico
        long now = System.currentTimeMillis();
        if (now - lastXossSpeedTime < 2500) {
            currentSpeedKmh = speedXossKmh;
        } else if (now - lastAdoSpeedTime < 2500) {
            currentSpeedKmh = speedAdoKmh;
        } else {
            currentSpeedKmh = speedGpsKmh;
        }

        if (currentSpeedKmh > maxSpeedKmh) {
            maxSpeedKmh = currentSpeedKmh;
        }
        resetSpeedWatchdog(currentSpeedKmh);

        // Auto-Pausa Inteligente (estilo Cadence / Wahoo)
        boolean autoPauseEnabled = prefs.getBoolean("auto_pause_enabled", true);
        if (autoPauseEnabled && isRecording && currentSpeedKmh < 1.8) {
            // Vehículo detenido: no sumar tiempo ni distancia espuria
        } else if (isRecording) {
            lastMovingTimestamp = System.currentTimeMillis();
        }

        // 3. Procesamiento de Distancia, Desnivel y Pendiente (% Grade)
        if (lastLocation != null && isRecording) {
            float[] res = new float[1];
            Location.distanceBetween(lastLocation.getLatitude(), lastLocation.getLongitude(), lat, lon, res);
            float distM = res[0];

            // Compuerta de movimiento real: sólo procesar si hay desplazamiento físico creíble y velocidad > 2.0 km/h
            if (distM >= 1.5f && distM < 100.0f && currentSpeedKmh >= 2.0) {
                totalDistanceKm += (distM / 1000.0);

                // Algoritmo de Histéresis de Desnivel (Estándar Garmin Edge / Strava)
                // Umbral muerto de 2.0m: elimina la oscilación satelital en terreno plano
                final double HYSTERESIS_THRESHOLD_M = 2.0;

                if (smoothedAltitudeM > altHysteresisPeakM) {
                    altHysteresisPeakM = smoothedAltitudeM;
                }
                if (smoothedAltitudeM < altHysteresisValleyM) {
                    altHysteresisValleyM = smoothedAltitudeM;
                }

                // Ascenso confirmado que superó el valle por encima del umbral
                if (smoothedAltitudeM - altHysteresisValleyM >= HYSTERESIS_THRESHOLD_M) {
                    double deltaGain = smoothedAltitudeM - lastCommittedAltM;
                    if (deltaGain > 0.0) {
                        totalElevationGainM += deltaGain;
                    }
                    lastCommittedAltM = smoothedAltitudeM;
                    altHysteresisValleyM = smoothedAltitudeM;
                }
                // Descenso confirmado que cayó por debajo del pico
                else if (altHysteresisPeakM - smoothedAltitudeM >= HYSTERESIS_THRESHOLD_M) {
                    double deltaLoss = lastCommittedAltM - smoothedAltitudeM;
                    if (deltaLoss > 0.0) {
                        totalElevationLossM += deltaLoss;
                    }
                    lastCommittedAltM = smoothedAltitudeM;
                    altHysteresisPeakM = smoothedAltitudeM;
                }

                // Cálculo de Inclinación (% Grade) en Ventana Deslizante de 35 metros
                gradeBuffer.add(new GradePoint(totalDistanceKm, smoothedAltitudeM));
                while (gradeBuffer.size() > 2 && (totalDistanceKm - gradeBuffer.getFirst().distanceKm) > 0.035) {
                    gradeBuffer.removeFirst();
                }

                if (gradeBuffer.size() >= 2) {
                    GradePoint oldest = gradeBuffer.getFirst();
                    double runM = (totalDistanceKm - oldest.distanceKm) * 1000.0;
                    if (runM >= 15.0) {
                        double riseM = smoothedAltitudeM - oldest.altitudeM;
                        double calculatedGrade = (riseM / runM) * 100.0;
                        if (calculatedGrade > 28.0) calculatedGrade = 28.0;
                        if (calculatedGrade < -28.0) calculatedGrade = -28.0;
                        currentGradePct = (currentGradePct * 0.70) + (calculatedGrade * 0.30);
                    }
                }

                // Cálculo de Calorías (kcal ciclista)
                totalCaloriesKcal = (int) Math.round(totalDistanceKm * 32.0);
            } else if (currentSpeedKmh < 1.5) {
                // Si la bici está detenida, decaer suavemente la pendiente a 0%
                currentGradePct = currentGradePct * 0.5;
                if (Math.abs(currentGradePct) < 0.2) currentGradePct = 0.0;
            }
        }
        lastLocation = loc;

        if (isRecording) {
            int hr = (currentHeartRateBpm >= 30 && currentHeartRateBpm <= 240) ? currentHeartRateBpm : 0;
            rideTrack.add(new GpsPoint(lat, lon, currentAltitudeM, currentSpeedKmh, hr, System.currentTimeMillis()));
        }

        long elapsedSec = isRecording ? ((System.currentTimeMillis() - startTimestamp) / 1000) : 0;
        double avgSpeedKmh = (elapsedSec > 0 && totalDistanceKm > 0) ? (totalDistanceKm / (elapsedSec / 3600.0)) : 0.0;

        // Ritmo (Pace: min/km)
        double paceSecPerKm = (currentSpeedKmh > 0.5) ? (3600.0 / currentSpeedKmh) : 0;
        int paceMin = (int) (paceSecPerKm / 60);
        int paceSec = (int) (paceSecPerKm % 60);
        String paceStr = (paceSecPerKm > 0 && paceMin < 99) ? String.format("%d:%02d", paceMin, paceSec) : "--:--";

        try {
            JSONObject json = new JSONObject();
            json.put("latitude", lat);
            json.put("longitude", lon);
            json.put("speedKmh", Math.round(currentSpeedKmh * 10.0) / 10.0);
            json.put("maxSpeedKmh", Math.round(maxSpeedKmh * 10.0) / 10.0);
            json.put("avgSpeedKmh", Math.round(avgSpeedKmh * 10.0) / 10.0);
            json.put("distanceKm", Math.round(totalDistanceKm * 100.0) / 100.0);
            json.put("altitudeM", Math.round(currentAltitudeM));
            json.put("elevationGainM", Math.round(totalElevationGainM));
            json.put("elevationLossM", Math.round(totalElevationLossM));
            json.put("gradePct", Math.round(currentGradePct * 10.0) / 10.0);
            json.put("caloriesKcal", totalCaloriesKcal);
            json.put("pace", paceStr);
            json.put("elapsedSeconds", elapsedSec);
            json.put("phoneBattery", phoneBatteryPct);

            postJs("if (window.onGpsUpdate) window.onGpsUpdate(" + json.toString() + ");");
            postJs(String.format(Locale.US, "if(window.onNativeLocation) window.onNativeLocation(%f, %f, %f, %f, %f);", lat, lon, currentAltitudeM, currentSpeedKmh, loc.hasBearing() ? loc.getBearing() : 0.0f));
        } catch (Exception ignored) {}
    }

    @Override public void onStatusChanged(String p, int s, Bundle b) {}
    @Override public void onProviderEnabled(String p) {}
    @Override public void onProviderDisabled(String p) {}

    // =========================================================================
    // Métodos JavascriptInterface para la UI
    // =========================================================================

    @JavascriptInterface
    public void startGps() {
        activity.runOnUiThread(this::requestLocation);
    }

    @JavascriptInterface
    public void startRide() {
        activity.runOnUiThread(() -> {
            isRecording = true;
            isPaused = false;
            userManuallyStoppedRide = false;
            startTimestamp = System.currentTimeMillis();
            totalDistanceKm = 0.0;
            maxSpeedKmh = 0.0;
            totalElevationGainM = 0.0;
            totalElevationLossM = 0.0;
            currentGradePct = 0.0;
            totalCaloriesKcal = 0;
            lastLocation = null;
            gradeBuffer.clear();
            if (smoothedAltitudeM > 0.0) {
                altHysteresisValleyM = smoothedAltitudeM;
                altHysteresisPeakM = smoothedAltitudeM;
                lastCommittedAltM = smoothedAltitudeM;
            }
            rideTrack.clear();
            prefs.edit().putInt("last_spoken_km", 0).apply();
            requestLocation();
            vibrate(50);

            // Iniciar servicio foreground
            Intent svc = new Intent(activity, AdoKeepAliveService.class);
            svc.putExtra("status", "Ruta en curso · ADO O260T");
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                activity.startForegroundService(svc);
            } else {
                activity.startService(svc);
            }
        });
    }

    @JavascriptInterface
    public void playSeatbeltChime() {
        activity.runOnUiThread(() -> {
            try {
                MediaPlayer mp = MediaPlayer.create(activity, R.raw.seatbelt);
                if (mp != null) {
                    mp.setOnCompletionListener(MediaPlayer::release);
                    mp.start();
                }
            } catch (Exception e) {
                Log.w(TAG, "No se pudo reproducir el chime de cinturón de avión", e);
            }
        });
    }

    @JavascriptInterface
    public double getCachedOdoTotalKm() {
        float val = prefs.getFloat("cached_ado_total_odo_km", (float) adoTotalOdoKm);
        if (val <= 0.0f) val = 1319.03f;
        return (double) val;
    }

    @JavascriptInterface
    public double getCachedOdoTripKm() {
        return (double) prefs.getFloat("cached_ado_trip_odo_km", (float) adoTripOdoKm);
    }

    @JavascriptInterface
    public void pauseRide() {
        activity.runOnUiThread(() -> {
            isPaused = true;
            vibrate(80);
        });
    }

    @JavascriptInterface
    public void resumeRide() {
        activity.runOnUiThread(() -> {
            isPaused = false;
            vibrate(50);
        });
    }

    @JavascriptInterface
    public void finishRide(boolean save) {
        activity.runOnUiThread(() -> {
            userManuallyStoppedRide = true;
            if (save && totalDistanceKm > 0.05) {
                // saveRideToHistory() ya exporta el GPX (antes se exportaba 3 veces por ruta).
                saveRideToHistory();
                // Subida automática a Strava sólo si la cuenta está conectada: sin conexión
                // no se abre ningún menú de compartir sin que el usuario lo pida.
                if (strava.isConnected()) mainHandler.postDelayed(this::syncWithStrava, 1500);
            }
            isRecording = false;
            isPaused = false;
            vibrate(120);

            // Actualizar servicio
            Intent svc = new Intent(activity, AdoKeepAliveService.class);
            svc.putExtra("status", "BiciPRO en espera");
            activity.startService(svc);
        });
    }

    @JavascriptInterface
    public void markLap() {
        activity.runOnUiThread(() -> {
            currentLapNumber++;
            vibrate(60);
            postJs("window.onLapMarked(" + currentLapNumber + ")");
        });
    }

    // =========================================================================
    // Control de Modo Launcher del Sistema (Encendido / Apagado)
    // =========================================================================

    @JavascriptInterface
    public boolean isLauncherModeEnabled() {
        try {
            ComponentName component = new ComponentName(activity, "com.bicipro.app.LauncherAlias");
            int status = activity.getPackageManager().getComponentEnabledSetting(component);
            return status != PackageManager.COMPONENT_ENABLED_STATE_DISABLED;
        } catch (Exception e) {
            return true;
        }
    }

    @JavascriptInterface
    public void setLauncherModeEnabled(boolean enable) {
        activity.runOnUiThread(() -> {
            try {
                ComponentName component = new ComponentName(activity, "com.bicipro.app.LauncherAlias");
                int newState = enable ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED : PackageManager.COMPONENT_ENABLED_STATE_DISABLED;
                activity.getPackageManager().setComponentEnabledSetting(component, newState, PackageManager.DONT_KILL_APP);

                // Abrir pantalla de configuración de launcher del sistema Samsung
                Intent homeSettings = new Intent(Settings.ACTION_HOME_SETTINGS);
                homeSettings.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                activity.startActivity(homeSettings);
            } catch (Exception e) {
                try {
                    Intent manageDefault = new Intent(android.os.Build.VERSION.SDK_INT >= 24 ? Settings.ACTION_MANAGE_DEFAULT_APPS_SETTINGS : Settings.ACTION_SETTINGS);
                    manageDefault.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    activity.startActivity(manageDefault);
                } catch (Exception ignored) {}
            }
        });
    }

    @JavascriptInterface
    public void openLauncherSettings() {
        setLauncherModeEnabled(true);
    }

    @JavascriptInterface
    public void setAsSystemLauncher(boolean enable) {
        setLauncherModeEnabled(enable);
    }

    @JavascriptInterface
    public void setAutoBootEnabled(boolean enabled) {
        prefs.edit().putBoolean("auto_boot_enabled", enabled).apply();
    }

    @JavascriptInterface
    public boolean isAutoBootEnabled() {
        return prefs.getBoolean("auto_boot_enabled", true);
    }

    // =========================================================================
    // Sincronizaciones Reales: Strava, Samsung Health, Huawei Health, Waze
    // =========================================================================

    @JavascriptInterface
    public void syncWithStrava() {
        activity.runOnUiThread(() -> {
            File gpx = getLatestGpxFile();
            if (gpx != null && gpx.exists()) {
                dispatchGpxToStrava(gpx);
            } else {
                launchApp("com.strava");
            }
        });
    }

    @JavascriptInterface
    public void syncRideToStrava(String gpxPath) {
        activity.runOnUiThread(() -> {
            File gpx = null;
            if (gpxPath != null && !gpxPath.trim().isEmpty()) {
                gpx = new File(gpxPath.trim());
            }
            if (gpx == null || !gpx.exists()) {
                gpx = getLatestGpxFile();
            }
            if (gpx != null && gpx.exists()) {
                dispatchGpxToStrava(gpx);
            } else {
                launchApp("com.strava");
            }
        });
    }

    private void dispatchGpxToStrava(File gpx) {
        if (strava.isConnected()) {
            final String path = gpx.getAbsolutePath();
            postJs("if (window.onStravaUploadStarted) window.onStravaUploadStarted(" + JSONObject.quote(path) + ");");
            strava.uploadGpx(gpx, rideTitleFor(gpx), new StravaClient.Callback() {
                @Override public void ok(JSONObject r) {
                    markRideSynced(path, r.optLong("activityId", 0));
                    postJs("if (window.onStravaUploadSuccess) window.onStravaUploadSuccess(" + r + ", " + JSONObject.quote(path) + ");");
                }
                @Override public void error(String msg) {
                    postJs("if (window.onStravaUploadError) window.onStravaUploadError(" + JSONObject.quote(String.valueOf(msg)) + ", " + JSONObject.quote(path) + ");");
                }
            });
            return;
        }
        // Sin cuenta conectada: compartir el GPX (la app de Strava no recibe GPX por «compartir»,
        // por eso se ofrece el selector; para subir de verdad hay que conectar la cuenta en Ajustes).

        try {
            Uri contentUri = Uri.parse("content://" + BiciProContentProvider.AUTHORITY + gpx.getAbsolutePath());

            // 1. Intentar enviar directamente a la aplicación nativa de Strava instalada
            Intent stravaIntent = new Intent(Intent.ACTION_SEND);
            stravaIntent.setType("application/gpx+xml");
            stravaIntent.putExtra(Intent.EXTRA_STREAM, contentUri);
            stravaIntent.putExtra(Intent.EXTRA_SUBJECT, "Ruta ADO O260T");
            stravaIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            stravaIntent.setPackage("com.strava");

            PackageManager pm = activity.getPackageManager();
            if (stravaIntent.resolveActivity(pm) != null) {
                activity.startActivity(stravaIntent);
                return;
            }

            // 2. Fallback a Chooser nativo con soporte completo de content:// URI
            stravaIntent.setPackage(null);
            Intent chooser = Intent.createChooser(stravaIntent, "Sincronizar ruta en Strava");
            chooser.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            activity.startActivity(chooser);
        } catch (Exception e) {
            Log.e(TAG, "Error compartiendo GPX con Strava", e);
            launchApp("com.strava");
        }
    }

    private File getLatestGpxFile() {
        if (lastExportedGpxFile != null && lastExportedGpxFile.exists()) {
            return lastExportedGpxFile;
        }
        try {
            File downloadDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            if (downloadDir.exists()) {
                File[] files = downloadDir.listFiles((dir, name) -> name.startsWith("BiciPRO_") && name.endsWith(".gpx"));
                if (files != null && files.length > 0) {
                    java.util.Arrays.sort(files, (a, b) -> Long.compare(b.lastModified(), a.lastModified()));
                    return files[0];
                }
            }
        } catch (Exception ignored) {}
        return null;
    }

    private String rideTitleFor(File gpx) {
        // ADO O260T_20261030_174512.gpx → «Ruta en e-bike · 30-10-2026 17:45»
        try {
            java.util.regex.Matcher m = java.util.regex.Pattern
                    .compile("(\\d{4})(\\d{2})(\\d{2})_(\\d{2})(\\d{2})").matcher(gpx.getName());
            if (m.find()) return "Ruta en e-bike · " + m.group(3) + "-" + m.group(2) + "-" + m.group(1)
                    + " " + m.group(4) + ":" + m.group(5);
        } catch (Exception ignored) {}
        return "Ruta en e-bike";
    }

    private void markRideSynced(String gpxPath, long activityId) {
        try {
            JSONArray array = new JSONArray(prefs.getString("saved_rides_json", "[]"));
            for (int i = 0; i < array.length(); i++) {
                JSONObject ride = array.optJSONObject(i);
                if (ride != null && gpxPath.equals(ride.optString("gpxPath"))) {
                    ride.put("syncedStrava", true);
                    if (activityId > 0) ride.put("stravaActivityId", activityId);
                }
            }
            prefs.edit().putString("saved_rides_json", array.toString()).apply();
        } catch (Exception ignored) {}
    }

    // --------------------------------------------------------------- Strava (OAuth)

    @JavascriptInterface
    public String stravaStatus() {
        return strava.status().toString();
    }

    @JavascriptInterface
    public void stravaSetCredentials(String clientId, String clientSecret) {
        strava.setCredentials(clientId, clientSecret);
    }

    @JavascriptInterface
    public boolean stravaConnect() {
        final boolean[] ok = {false};
        ok[0] = strava.isConfigured();
        if (ok[0]) activity.runOnUiThread(() -> strava.startAuthorization(activity));
        return ok[0];
    }

    @JavascriptInterface
    public void stravaDisconnect() {
        strava.disconnect();
    }

    /** Lo llama MainActivity al volver de la autorización (bicipro://localhost/strava). */
    public void handleStravaRedirect(Uri data) {
        strava.handleRedirect(data, new StravaClient.Callback() {
            @Override public void ok(JSONObject st) {
                postJs("if (window.onStravaConnected) window.onStravaConnected(" + st + ");");
            }
            @Override public void error(String msg) {
                postJs("if (window.onStravaConnectError) window.onStravaConnectError(" + JSONObject.quote(String.valueOf(msg)) + ");");
            }
        });
    }

    @JavascriptInterface
    public void syncWithSamsungHealth() {
        launchApp("com.sec.android.app.shealth");
    }

    /** Comparte un GPX ya exportado (o el último) con el selector de Android. */
    @JavascriptInterface
    public boolean shareGpx(String gpxPath) {
        File gpx = (gpxPath != null && !gpxPath.trim().isEmpty()) ? new File(gpxPath.trim()) : null;
        if (gpx == null || !gpx.exists()) gpx = getLatestGpxFile();
        if (gpx == null || !gpx.exists()) return false;
        final File f = gpx;
        activity.runOnUiThread(() -> {
            try {
                Uri contentUri = Uri.parse("content://" + BiciProContentProvider.AUTHORITY + f.getAbsolutePath());
                Intent send = new Intent(Intent.ACTION_SEND);
                send.setType("application/gpx+xml");
                send.putExtra(Intent.EXTRA_STREAM, contentUri);
                send.putExtra(Intent.EXTRA_SUBJECT, f.getName());
                send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                Intent chooser = Intent.createChooser(send, "Compartir ruta GPX");
                chooser.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                activity.startActivity(chooser);
            } catch (Exception e) {
                Log.e(TAG, "No se pudo compartir el GPX", e);
            }
        });
        return true;
    }

    @JavascriptInterface
    public void syncWithHuaweiHealth() {
        launchApp("com.huawei.health");
    }

    @JavascriptInterface
    public void openWaze() {
        launchApp("com.waze");
    }

    @JavascriptInterface
    public void launchApp(String packageName) {
        activity.runOnUiThread(() -> {
            try {
                Intent intent = activity.getPackageManager().getLaunchIntentForPackage(packageName);
                if (intent != null) {
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    activity.startActivity(intent);
                } else {
                    Intent store = new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + packageName));
                    activity.startActivity(store);
                }
            } catch (Exception ignored) {}
        });
    }

    // =========================================================================
    // Control ADO O260T
    // =========================================================================

    @JavascriptInterface
    public void setAdoAssist(int level) {
        this.adoAssistLevel = level;
        bleManager.sendAdoAssist(level);
    }

    @JavascriptInterface
    public void sendAdoAssist(int level) {
        setAdoAssist(level);
    }

    @JavascriptInterface
    public void cycleAdoAssist() {
        int next = (this.adoAssistLevel >= 5) ? 1 : (this.adoAssistLevel + 1);
        setAdoAssist(next);
        postJs(String.format("if (window.updateGearTelltale) window.updateGearTelltale(%d);", next));
    }

    @JavascriptInterface
    public void sendRawAdoHex(String hex) {
        bleManager.sendRawAdoHex(hex);
    }

    @JavascriptInterface
    public void sendAdoNavStart() {
        bleManager.sendAdoNavStart();
    }

    @JavascriptInterface
    public void sendAdoNavEnd() {
        bleManager.sendAdoNavEnd();
    }

    @JavascriptInterface
    public void sendAdoNavGuidance(int dirCode, int distanceMeters, int totalRemainingMeters) {
        bleManager.sendAdoNavGuidance(dirCode, distanceMeters, totalRemainingMeters);
    }

    @JavascriptInterface
    public double getLatitude() {
        return (lastLocation != null) ? lastLocation.getLatitude() : 0.0;
    }

    @JavascriptInterface
    public double getLongitude() {
        return (lastLocation != null) ? lastLocation.getLongitude() : 0.0;
    }

    @JavascriptInterface
    public void launchInstalledApp(String packageName) {
        try {
            Intent intent = activity.getPackageManager().getLaunchIntentForPackage(packageName);
            if (intent != null) {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                activity.startActivity(intent);
            }
        } catch (Exception ignored) {}
    }

    @JavascriptInterface
    public String getInstalledAppsJson() {
        try {
            PackageManager pm = activity.getPackageManager();
            JSONArray list = new JSONArray();
            String[] targets = {
                "com.strava", "com.sec.android.app.music", "com.google.android.apps.youtube.music",
                "com.spotify.music", "com.google.android.apps.maps", "net.osmand",
                "com.waze", "com.samsung.android.app.shealth", "com.garmin.android.apps.connectmobile"
            };
            for (String pkg : targets) {
                try {
                    PackageInfo pi = pm.getPackageInfo(pkg, 0);
                    JSONObject app = new JSONObject();
                    app.put("packageName", pkg);
                    app.put("name", pm.getApplicationLabel(pi.applicationInfo).toString());
                    list.put(app);
                } catch (Exception ignored) {}
            }
            return list.toString();
        } catch (Exception e) {
            return "[]";
        }
    }

    @JavascriptInterface
    public void connectBleDevice(String address) {
        bleManager.connect(address);
    }

    @JavascriptInterface
    public void startBleScan() {
        bleManager.startScan();
    }

    @JavascriptInterface
    public void stopBleScan() {
        bleManager.stopScan();
    }

    // =========================================================================
    // Control Telefónico y Multimedia
    // =========================================================================

    @JavascriptInterface
    public void volumeUp() {
        if (audioManager != null) {
            audioManager.adjustStreamVolume(AudioManager.STREAM_MUSIC, AudioManager.ADJUST_RAISE, AudioManager.FLAG_SHOW_UI);
        }
    }

    @JavascriptInterface
    public void volumeDown() {
        if (audioManager != null) {
            audioManager.adjustStreamVolume(AudioManager.STREAM_MUSIC, AudioManager.ADJUST_LOWER, AudioManager.FLAG_SHOW_UI);
        }
    }

    @JavascriptInterface
    public void answerCall() {
        activity.runOnUiThread(() -> {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                try {
                    TelecomManager tm = (TelecomManager) activity.getSystemService(Context.TELECOM_SERVICE);
                    if (tm != null) tm.acceptRingingCall();
                } catch (SecurityException ignored) {}
            }
        });
    }

    @JavascriptInterface
    public void endCall() {
        activity.runOnUiThread(() -> {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                try {
                    TelecomManager tm = (TelecomManager) activity.getSystemService(Context.TELECOM_SERVICE);
                    if (tm != null) tm.endCall();
                } catch (SecurityException ignored) {}
            }
        });
    }

    private long lastMediaBridgeTime = 0;

    @JavascriptInterface
    public void mediaPlayPause() {
        long now = SystemClock.uptimeMillis();
        if (now - lastMediaBridgeTime < 350) return;
        lastMediaBridgeTime = now;

        BiciProMediaListener listener = BiciProMediaListener.getInstance();
        boolean handled = false;
        if (listener != null) {
            handled = listener.sendPlayPause();
        }
        if (!handled) {
            boolean isPlaying = (audioManager != null && audioManager.isMusicActive());
            sendMediaKey(isPlaying ? KeyEvent.KEYCODE_MEDIA_PAUSE : KeyEvent.KEYCODE_MEDIA_PLAY);
        }
        logTelemetry("MEDIA_PLAY_PAUSE", "handled_by_listener=" + handled);
    }

    @JavascriptInterface
    public void mediaNext() {
        long now = SystemClock.uptimeMillis();
        if (now - lastMediaBridgeTime < 350) return;
        lastMediaBridgeTime = now;

        BiciProMediaListener listener = BiciProMediaListener.getInstance();
        boolean handled = false;
        if (listener != null) {
            handled = listener.sendNext();
        }
        if (!handled) {
            sendMediaKey(KeyEvent.KEYCODE_MEDIA_NEXT);
        }
        logTelemetry("MEDIA_NEXT", "handled_by_listener=" + handled);
    }

    @JavascriptInterface
    public void mediaPrev() {
        long now = SystemClock.uptimeMillis();
        if (now - lastMediaBridgeTime < 350) return;
        lastMediaBridgeTime = now;

        BiciProMediaListener listener = BiciProMediaListener.getInstance();
        boolean handled = false;
        if (listener != null) {
            handled = listener.sendPrevious();
        }
        if (!handled) {
            sendMediaKey(KeyEvent.KEYCODE_MEDIA_PREVIOUS);
        }
        logTelemetry("MEDIA_PREV", "handled_by_listener=" + handled);
    }

    private String lastMediaTrack = "";
    private String lastMediaArtist = "";
    private String lastMediaAlbum = "";
    private String lastMediaCoverBase64 = "";
    private boolean lastMediaIsPlaying = false;

    public void updateLiveMediaMetadata(String track, String artist, String album, boolean isPlaying, String coverBase64) {
        this.lastMediaTrack = track;
        this.lastMediaArtist = artist;
        this.lastMediaAlbum = album;
        this.lastMediaIsPlaying = isPlaying;
        if (coverBase64 != null && !coverBase64.isEmpty()) {
            this.lastMediaCoverBase64 = coverBase64;
        }
        logTelemetry("LIVE_MEDIA_UPDATE", artist + " - " + track + " (" + (isPlaying ? "PLAYING" : "PAUSED") + ")");
        postJs(String.format("if(window.onMediaMetadataUpdate) window.onMediaMetadataUpdate('%s', '%s', '%s', %b, '%s');",
                escape(lastMediaTrack), escape(lastMediaArtist), escape(lastMediaAlbum), isPlaying, lastMediaCoverBase64));
    }

    public void updateLivePlaybackState(boolean isPlaying) {
        this.lastMediaIsPlaying = isPlaying;
        postJs(String.format("if(window.onMediaMetadataUpdate) window.onMediaMetadataUpdate('%s', '%s', '%s', %b, '%s');",
                escape(lastMediaTrack), escape(lastMediaArtist), escape(lastMediaAlbum), isPlaying, lastMediaCoverBase64));
    }

    @JavascriptInterface
    public void requestMediaState() {
        BiciProMediaListener listener = BiciProMediaListener.getInstance();
        if (listener != null) {
            listener.findActiveMediaSession();
        }
        boolean isMusicActive = (audioManager != null && audioManager.isMusicActive());
        if (!lastMediaTrack.isEmpty()) {
            activity.runOnUiThread(() -> {
                postJs(String.format("if(window.onMediaMetadataUpdate) window.onMediaMetadataUpdate('%s', '%s', '%s', %b, '%s');",
                        escape(lastMediaTrack), escape(lastMediaArtist), escape(lastMediaAlbum), isMusicActive, lastMediaCoverBase64));
            });
            return;
        }
        if (lastMediaTrack.isEmpty()) {
            new Thread(() -> {
                try {
                    String[] projection = new String[] {
                        MediaStore.Audio.Media._ID,
                        MediaStore.Audio.Media.TITLE,
                        MediaStore.Audio.Media.ARTIST,
                        MediaStore.Audio.Media.ALBUM,
                        MediaStore.Audio.Media.ALBUM_ID
                    };
                    Cursor cursor = activity.getContentResolver().query(
                        MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
                        projection,
                        MediaStore.Audio.Media.IS_MUSIC + "!=0",
                        null,
                        MediaStore.Audio.Media._ID + " DESC"
                    );
                    if (cursor != null) {
                        if (cursor.moveToFirst()) {
                            lastMediaTrack = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE));
                            lastMediaArtist = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST));
                            lastMediaAlbum = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM));
                            long songId = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media._ID));
                            try {
                                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                                    Uri songUri = ContentUris.withAppendedId(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, songId);
                                    Bitmap thumb = activity.getContentResolver().loadThumbnail(songUri, new Size(160, 160), null);
                                    if (thumb != null) {
                                        ByteArrayOutputStream baos = new ByteArrayOutputStream();
                                        thumb.compress(Bitmap.CompressFormat.JPEG, 75, baos);
                                        lastMediaCoverBase64 = "data:image/jpeg;base64," + Base64.encodeToString(baos.toByteArray(), Base64.NO_WRAP);
                                    }
                                }
                            } catch (Exception ignored) {}
                        }
                        cursor.close();
                    }
                } catch (Exception ignored) {}
                activity.runOnUiThread(() -> {
                    postJs(String.format("if(window.onMediaMetadataUpdate) window.onMediaMetadataUpdate('%s', '%s', '%s', %b, '%s');",
                            escape(lastMediaTrack), escape(lastMediaArtist), escape(lastMediaAlbum), isMusicActive, lastMediaCoverBase64));
                });
            }).start();
            return;
        }

        activity.runOnUiThread(() -> {
            postJs(String.format("if(window.onMediaMetadataUpdate) window.onMediaMetadataUpdate('%s', '%s', '%s', %b, '%s');",
                    escape(lastMediaTrack), escape(lastMediaArtist), escape(lastMediaAlbum), isMusicActive, lastMediaCoverBase64));
        });
    }

    private void setupMusicReceiver() {
        try {
            IntentFilter filter = new IntentFilter();
            filter.addAction("com.android.music.metachanged");
            filter.addAction("com.android.music.playstatechanged");
            filter.addAction("com.spotify.music.metadatachanged");
            filter.addAction("com.spotify.music.playbackstatechanged");
            BroadcastReceiver musicReceiver = new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {
                    if (intent != null) {
                        String track = intent.getStringExtra("track");
                        String artist = intent.getStringExtra("artist");
                        String album = intent.getStringExtra("album");
                        boolean isPlaying = intent.getBooleanExtra("playing", false) || intent.getBooleanExtra("isplaying", false);
                        if (track == null) track = intent.getStringExtra("trackname");
                        if (artist == null) artist = intent.getStringExtra("artistname");
                        if (album == null) album = intent.getStringExtra("albumname");

                        long albumId = intent.getLongExtra("albumId", -1);
                        if (albumId == -1) albumId = intent.getLongExtra("album_id", -1);
                        long songId = intent.getLongExtra("id", -1);

                        String coverBase64 = "";
                        if (songId > 0 && Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                            try {
                                Uri songUri = ContentUris.withAppendedId(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, songId);
                                Bitmap thumb = activity.getContentResolver().loadThumbnail(songUri, new Size(160, 160), null);
                                if (thumb != null) {
                                    ByteArrayOutputStream baos = new ByteArrayOutputStream();
                                    thumb.compress(Bitmap.CompressFormat.JPEG, 75, baos);
                                    coverBase64 = "data:image/jpeg;base64," + Base64.encodeToString(baos.toByteArray(), Base64.NO_WRAP);
                                }
                            } catch (Exception ignored) {}
                        }
                        if (coverBase64.isEmpty() && albumId > 0) {
                            try {
                                Uri albumArtUri = ContentUris.withAppendedId(Uri.parse("content://media/external/audio/albumart"), albumId);
                                InputStream is = activity.getContentResolver().openInputStream(albumArtUri);
                                if (is != null) {
                                    Bitmap thumb = BitmapFactory.decodeStream(is);
                                    is.close();
                                    if (thumb != null) {
                                        ByteArrayOutputStream baos = new ByteArrayOutputStream();
                                        thumb.compress(Bitmap.CompressFormat.JPEG, 75, baos);
                                        coverBase64 = "data:image/jpeg;base64," + Base64.encodeToString(baos.toByteArray(), Base64.NO_WRAP);
                                    }
                                }
                            } catch (Exception ignored) {}
                        }

                        if (track != null && !track.trim().isEmpty()) {
                            lastMediaTrack = track;
                            lastMediaArtist = (artist != null) ? artist : "";
                            lastMediaAlbum = (album != null) ? album : "";
                            if (!coverBase64.isEmpty()) lastMediaCoverBase64 = coverBase64;
                            lastMediaIsPlaying = isPlaying;
                            logTelemetry("MUSIC_META", lastMediaArtist + " - " + lastMediaTrack + " (playing=" + isPlaying + ")");
                            postJs(String.format("if(window.onMediaMetadataUpdate) window.onMediaMetadataUpdate('%s', '%s', '%s', %b, '%s');",
                                    escape(lastMediaTrack), escape(lastMediaArtist), escape(lastMediaAlbum), isPlaying, lastMediaCoverBase64));
                        } else if (intent.hasExtra("playing") || intent.hasExtra("isplaying")) {
                            lastMediaIsPlaying = isPlaying;
                            postJs(String.format("if(window.onMediaMetadataUpdate) window.onMediaMetadataUpdate('%s', '%s', '%s', %b, '%s');",
                                    escape(lastMediaTrack), escape(lastMediaArtist), escape(lastMediaAlbum), isPlaying, lastMediaCoverBase64));
                        }
                    }
                }
            };
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                activity.registerReceiver(musicReceiver, filter, Context.RECEIVER_EXPORTED);
            } else {
                activity.registerReceiver(musicReceiver, filter);
            }
        } catch (Exception ignored) {}
    }

    /** Tecla multimedia al reproductor que tenga la sesión activa (cualquier app: Spotify, YouTube Music, VLC…). */
    private void sendMediaKey(int keyCode) {
        activity.runOnUiThread(() -> {
            try {
                if (audioManager != null) {
                    long t = SystemClock.uptimeMillis();
                    audioManager.dispatchMediaKeyEvent(new KeyEvent(t, t, KeyEvent.ACTION_DOWN, keyCode, 0));
                    audioManager.dispatchMediaKeyEvent(new KeyEvent(t, t, KeyEvent.ACTION_UP, keyCode, 0));
                }
                new Handler(Looper.getMainLooper()).postDelayed(this::requestMediaState, 350);
            } catch (Exception ignored) {}
        });
    }

    /** Abre el reproductor que está sonando; si no hay ninguno, el reproductor de música predeterminado del teléfono. */
    @JavascriptInterface
    public void openMusicPlayer() {
        activity.runOnUiThread(() -> {
            try {
                BiciProMediaListener l = BiciProMediaListener.getInstance();
                String pkg = l != null ? l.getActivePackage() : null;
                Intent i = pkg != null ? activity.getPackageManager().getLaunchIntentForPackage(pkg) : null;
                if (i == null) i = Intent.makeMainSelectorActivity(Intent.ACTION_MAIN, Intent.CATEGORY_APP_MUSIC);
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                activity.startActivity(i);
            } catch (Exception e) {
                Log.w(TAG, "No hay reproductor para abrir: " + e.getMessage());
            }
        });
    }

    @JavascriptInterface
    public void vibrate(int ms) {
        if (vibrator != null) vibrator.vibrate(ms);
    }

    @JavascriptInterface
    public String getSavedRides() {
        return prefs.getString("saved_rides_json", "[]");
    }

    // =========================================================================
    // Historial y Rutas Strava Reales
    // =========================================================================

    private double rideStartOdoKm = 0.0;

    private void setupCommandReceiver() {
        try {
            IntentFilter filter = new IntentFilter();
            filter.addAction("com.bicipro.app.ACTION_SET_ASSIST");
            filter.addAction("com.bicipro.app.ACTION_SEND_RAW_HEX");
            filter.addAction("com.bicipro.app.ACTION_SPEAK");
            filter.addAction("com.bicipro.app.ACTION_NAV_START");
            filter.addAction("com.bicipro.app.ACTION_NAV_END");
            BroadcastReceiver receiver = new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {
                    String action = intent.getAction();
                    if ("com.bicipro.app.ACTION_SET_ASSIST".equals(action)) {
                        int lvl = intent.getIntExtra("level", 1);
                        setAdoAssist(lvl);
                    } else if ("com.bicipro.app.ACTION_SEND_RAW_HEX".equals(action)) {
                        String hex = intent.getStringExtra("hex");
                        if (hex != null) bleManager.sendRawAdoHex(hex);
                    } else if ("com.bicipro.app.ACTION_SPEAK".equals(action)) {
                        String text = intent.getStringExtra("text");
                        if (text != null) speak(text);
                    } else if ("com.bicipro.app.ACTION_NAV_START".equals(action)) {
                        bleManager.sendAdoNavStart();
                    } else if ("com.bicipro.app.ACTION_NAV_END".equals(action)) {
                        bleManager.sendAdoNavEnd();
                    }
                }
            };
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                activity.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED);
            } else {
                activity.registerReceiver(receiver, filter);
            }
        } catch (Exception ignored) {}
    }

    private void cleanDummyHistory() {
        try {
            // Javiera: Historial 100% limpio sin simulaciones, para registrar desde cero a contar de ahora
            if (!prefs.getBoolean("history_clean_real_only_v1", false)) {
                prefs.edit()
                    .putString("saved_rides_json", "[]")
                    .putBoolean("history_clean_real_only_v1", true)
                    .apply();
            }
        } catch (Exception ignored) {}
    }

    private void saveRideToHistory() {
        try {
            JSONArray array = new JSONArray(prefs.getString("saved_rides_json", "[]"));
            JSONObject ride = new JSONObject();
            long elapsedSec = (System.currentTimeMillis() - startTimestamp) / 1000;

            int hrSum = 0;
            int hrCount = 0;
            int maxHr = 0;
            JSONArray routeArray = new JSONArray();
            for (GpsPoint p : rideTrack) {
                JSONArray coord = new JSONArray();
                coord.put(p.lat);
                coord.put(p.lon);
                routeArray.put(coord);

                if (p.heartRate > 0) {
                    hrSum += p.heartRate;
                    hrCount++;
                    if (p.heartRate > maxHr) maxHr = p.heartRate;
                }
            }
            int avgHr = hrCount > 0 ? Math.round((float) hrSum / hrCount) : 0;

            ride.put("id", System.currentTimeMillis());
            ride.put("date", new SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault()).format(new Date()));
            ride.put("source", "BiciPRO");
            ride.put("distanceKm", Math.round(totalDistanceKm * 100.0) / 100.0);
            ride.put("durationSec", elapsedSec);
            ride.put("avgSpeedKmh", elapsedSec > 0 ? Math.round((totalDistanceKm / (elapsedSec / 3600.0)) * 10.0) / 10.0 : 0.0);
            ride.put("maxSpeedKmh", Math.round(maxSpeedKmh * 10.0) / 10.0);
            ride.put("startOdoKm", Math.round(rideStartOdoKm * 10.0) / 10.0);
            ride.put("endOdoKm", Math.round(adoTotalOdoKm * 10.0) / 10.0);
            ride.put("elevationGainM", Math.round(totalElevationGainM));
            ride.put("elevationLossM", Math.round(totalElevationLossM));
            ride.put("caloriesKcal", totalCaloriesKcal);
            ride.put("avgHeartRate", avgHr);
            ride.put("maxHeartRate", maxHr);
            ride.put("route", routeArray);
            ride.put("syncedStrava", false);

            File gpx = exportGpxFile();
            if (gpx != null) {
                ride.put("gpxPath", gpx.getAbsolutePath());
            }

            array.put(0, ride);
            prefs.edit().putString("saved_rides_json", array.toString()).apply();
            postJs("if (window.onRideSaved) window.onRideSaved(" + ride.toString() + ");");
        } catch (Exception ignored) {}
    }

    @JavascriptInterface
    public String getRideHistory() {
        return prefs.getString("saved_rides_json", "[]");
    }

    @JavascriptInterface
    public void clearRideHistory() {
        prefs.edit().putString("saved_rides_json", "[]").apply();
    }

    private File exportGpxFile() {
        if (rideTrack.isEmpty()) return null;
        try {
            File downloadDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            if (!downloadDir.exists()) downloadDir.mkdirs();
            String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
            File gpxFile = new File(downloadDir, "BiciPRO_" + timeStamp + ".gpx");

            FileWriter writer = new FileWriter(gpxFile);
            writer.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
            writer.write("<gpx version=\"1.1\" creator=\"BiciPRO\"\n");
            writer.write("  xmlns=\"http://www.topografix.com/GPX/1/1\"\n");
            writer.write("  xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n");
            writer.write("  xmlns:gpxtpx=\"http://www.garmin.com/xmlschemas/TrackPointExtension/v1\"\n");
            writer.write("  xsi:schemaLocation=\"http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd\">\n");
            writer.write("  <trk><name>Ruta ADO O260T " + timeStamp + "</name><type>cycling</type><trkseg>\n");

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US);
            sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
            for (GpsPoint p : rideTrack) {
                if (p.heartRate > 0) {
                    writer.write(String.format(Locale.US,
                            "    <trkpt lat=\"%.6f\" lon=\"%.6f\"><ele>%.1f</ele><time>%s</time><extensions><gpxtpx:TrackPointExtension><gpxtpx:hr>%d</gpxtpx:hr></gpxtpx:TrackPointExtension></extensions></trkpt>\n",
                            p.lat, p.lon, p.alt, sdf.format(new Date(p.time)), p.heartRate));
                } else {
                    writer.write(String.format(Locale.US,
                            "    <trkpt lat=\"%.6f\" lon=\"%.6f\"><ele>%.1f</ele><time>%s</time></trkpt>\n",
                            p.lat, p.lon, p.alt, sdf.format(new Date(p.time))));
                }
            }
            writer.write("  </trkseg></trk>\n</gpx>\n");
            writer.close();
            this.lastExportedGpxFile = gpxFile;
            return gpxFile;
        } catch (Exception e) {
            return null;
        }
    }

    // =========================================================================
    // Callbacks de Sensores BLE
    // =========================================================================

    @Override
    public void onDeviceFound(String name, String address, int rssi, String type) {
        postJs("window.onBleDeviceFound('" + escape(name) + "', '" + address + "', " + rssi + ", '" + type + "')");
    }

    @Override
    public void onConnectionState(String address, boolean connected, String deviceName) {
        postJs("window.onBleConnectionState('" + address + "', " + connected + ", '" + escape(deviceName) + "')");

        // Grabación de ruta automática ligada al estado físico de la bicicleta ADO O260T
        boolean isAdoBike = Sensores.es(activity, address, Sensores.CENTRALITA);
        if (isAdoBike) {
            isAdoConnected = connected;
            activity.runOnUiThread(() -> {
                if (connected) {
                    if (!isRecording && !userManuallyStoppedRide) {
                        Log.i(TAG, "Bicicleta conectada: Iniciando registro de ruta automáticamente...");
                        startRide();
                        postJs("if (window.onAutoRideStarted) window.onAutoRideStarted();");
                    }
                } else {
                    userManuallyStoppedRide = false;
                    if (isRecording) {
                        Log.i(TAG, "Bicicleta apagada/desconectada: Finalizando y guardando ruta automáticamente...");
                        finishRide(true);
                        postJs("if (window.onAutoRideFinished) window.onAutoRideFinished();");
                    }
                }
            });
        }
    }

    @Override
    public void onCentralitaTrama(String hex) {
        postJs("if (window.onCentralitaTrama) window.onCentralitaTrama('" + hex + "');");
    }

    @Override
    public void onPulsoDetalle(int[] rrMs, int bateria) {
        StringBuilder rr = new StringBuilder("[");
        for (int i = 0; i < rrMs.length; i++) rr.append(i > 0 ? "," : "").append(rrMs[i]);
        postJs("if (window.onPulsoDetalle) window.onPulsoDetalle(" + rr.append("]") + ", " + bateria + ");");
    }

    /** Sensores asignados por el usuario (JSON: [{mac, nombre, rol}]). */
    @JavascriptInterface
    public String getSensores() { return Sensores.lista(activity).toString(); }

    @JavascriptInterface
    public void asignarSensor(String mac, String nombre, String rol) {
        Sensores.asignar(activity, mac, nombre, rol);
        if (bleManager != null) bleManager.connect(mac);
    }

    @JavascriptInterface
    public void quitarSensor(String mac) {
        Sensores.quitar(activity, mac);
        if (bleManager != null) bleManager.disconnect(mac);
    }

    /** Equipo: teléfono detectado (fabricante + modelo) y lo que el usuario edite (bicicleta, etc.). */
    @JavascriptInterface
    public String getEquipo() {
        try {
            org.json.JSONObject o = new org.json.JSONObject(prefs.getString("equipo_json", "{}"));
            String fab = Build.MANUFACTURER == null ? "" : Build.MANUFACTURER;
            String mod = Build.MODEL == null ? "" : Build.MODEL;
            String tel = mod.toLowerCase(Locale.ROOT).startsWith(fab.toLowerCase(Locale.ROOT)) ? mod : (fab.isEmpty() ? mod : Character.toUpperCase(fab.charAt(0)) + fab.substring(1) + " " + mod);
            o.put("telefono_detectado", tel.trim());
            o.put("android", Build.VERSION.RELEASE);
            o.put("centralita", Sensores.nombreDe(activity, Sensores.CENTRALITA));
            o.put("pulso", Sensores.nombreDe(activity, Sensores.PULSO));
            o.put("velocidad", Sensores.nombreDe(activity, Sensores.VELOCIDAD));
            o.put("potencia", Sensores.nombreDe(activity, Sensores.POTENCIA));
            return o.toString();
        } catch (Exception e) { return "{}"; }
    }

    @JavascriptInterface
    public void setEquipo(String json) { prefs.edit().putString("equipo_json", json == null ? "{}" : json).apply(); }

    @Override
    public void onSpeedCadenceUpdate(double speedKmh, int cadenceRpm) {
        this.speedXossKmh = speedKmh;
        this.lastXossSpeedTime = System.currentTimeMillis();
        this.currentSpeedKmh = speedKmh;
        this.currentCadenceRpm = cadenceRpm;
        resetSpeedWatchdog(speedKmh);
        postJs("if (window.onSensorSpeedCadence) window.onSensorSpeedCadence(" + speedKmh + ", " + cadenceRpm + ");"
             + "if (window.onSpeedUpdate) window.onSpeedUpdate(" + speedKmh + ");");
    }

    @Override
    public void onHeartRateUpdate(int bpm) {
        this.currentHeartRateBpm = bpm;
        postJs("if (window.onSensorHeartRate) window.onSensorHeartRate(" + bpm + ");"
             + "if (window.onHeartRateUpdate) window.onHeartRateUpdate(" + bpm + ");"
             + "if (window.onHeartRate) window.onHeartRate(" + bpm + ");");
    }

    @Override
    public void onPowerUpdate(int watts) {
        this.currentPowerWatts = watts;
        postJs("if (window.onSensorPower) window.onSensorPower(" + watts + ");");
    }

    @Override
    public void onAdoTelemetry(int batteryPct, int assistLvl, int motorWatts, double speedKmh, double odoTotalKm, double odoTripKm) {
        this.adoBatteryPct = batteryPct;
        this.adoAssistLevel = assistLvl;
        if (odoTotalKm > 0.0) {
            this.adoTotalOdoKm = odoTotalKm;
            prefs.edit().putFloat("cached_ado_total_odo_km", (float) odoTotalKm).apply();
        }
        if (odoTripKm >= 0.0) {
            this.adoTripOdoKm = odoTripKm;
            prefs.edit().putFloat("cached_ado_trip_odo_km", (float) odoTripKm).apply();
        }
        this.speedAdoKmh = (speedKmh <= 0.25) ? 0.0 : speedKmh;
        this.lastAdoSpeedTime = System.currentTimeMillis();

        // Si no hay sensor XOSS externo activo, la velocidad de rueda de la centralita ADO tiene prioridad absoluta
        if (System.currentTimeMillis() - lastXossSpeedTime >= 2500) {
            this.currentSpeedKmh = this.speedAdoKmh;
            if (this.currentSpeedKmh > maxSpeedKmh) maxSpeedKmh = this.currentSpeedKmh;
        }

        resetSpeedWatchdog(this.speedAdoKmh);

        postJs(String.format(Locale.US,
                "if (window.onAdoEbikeData) window.onAdoEbikeData(%d, %d, %d, %.1f, %.1f, %.1f);"
              + "if (window.onAdoTelemetry) window.onAdoTelemetry(%d, %d, %d, %.1f, %.1f, %.1f);",
                batteryPct, assistLvl, motorWatts, speedKmh, odoTotalKm, odoTripKm,
                batteryPct, assistLvl, motorWatts, speedKmh, odoTotalKm, odoTripKm));
    }

    @Override
    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS && tts != null) {
            tts.setLanguage(new Locale("es", "CL"));
        }
    }

    @JavascriptInterface
    public void speak(String text) {
        if (text == null || text.trim().isEmpty()) return;
        activity.runOnUiThread(() -> {
            if (tts != null) {
                tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "bicipro_tts");
            }
        });
    }

    @JavascriptInterface
    public void logTelemetryEvent(String tag, String data) {
        logTelemetry(tag != null ? tag : "CUSTOM_EVENT", data != null ? data : "");
    }

    // --- RECEPTOR DE SMS ENTRANTE (avisos durante la ruta) ---
    private void setupSmsReceiver() {
        try {
            IntentFilter filter = new IntentFilter("android.provider.Telephony.SMS_RECEIVED");
            BroadcastReceiver smsReceiver = new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {
                    try {
                        Bundle bundle = intent.getExtras();
                        if (bundle != null) {
                            Object[] pdus = (Object[]) bundle.get("pdus");
                            String format = bundle.getString("format");
                            if (pdus != null) {
                                for (Object pdu : pdus) {
                                    SmsMessage msg;
                                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                                        msg = SmsMessage.createFromPdu((byte[]) pdu, format);
                                    } else {
                                        msg = SmsMessage.createFromPdu((byte[]) pdu);
                                    }
                                    String sender = msg.getDisplayOriginatingAddress();
                                    String body = msg.getMessageBody();
                                    logTelemetry("SMS_INCOMING", "Remitente: " + sender + " | Largo: " + (body != null ? body.length() : 0));
                                    postJs(String.format("if (window.onIncomingSms) window.onIncomingSms('%s', '%s');",
                                            escape(sender), escape(body)));
                                }
                            }
                        }
                    } catch (Exception e) {
                        logTelemetry("SMS_PARSE_ERR", e.getMessage());
                    }
                }
            };
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                activity.registerReceiver(smsReceiver, filter, Context.RECEIVER_EXPORTED);
            } else {
                activity.registerReceiver(smsReceiver, filter);
            }
        } catch (Exception e) {
            logTelemetry("SMS_REG_ERR", e.getMessage());
        }
    }

    // --- SINCRONIZACIÓN Y VALIDACIÓN CON NTP.SHOA.CL (HORA OFICIAL DE CHILE) ---
    public void verifyShoaNtpSync() {
        new Thread(() -> {
            try {
                DatagramSocket socket = new DatagramSocket();
                socket.setSoTimeout(4000);
                InetAddress address = InetAddress.getByName("ntp.shoa.cl");
                byte[] buf = new byte[48];
                buf[0] = 0x1B; // NTP v3 client request
                long t0 = System.currentTimeMillis();
                DatagramPacket packet = new DatagramPacket(buf, buf.length, address, 123);
                socket.send(packet);
                packet = new DatagramPacket(buf, buf.length);
                socket.receive(packet);
                long t3 = System.currentTimeMillis();
                socket.close();

                long sec = ((long)(buf[40] & 0xFF) << 24) | ((long)(buf[41] & 0xFF) << 16) | ((long)(buf[42] & 0xFF) << 8) | (long)(buf[43] & 0xFF);
                long ntpEpochMs = (sec - 2208988800L) * 1000L;
                long roundTrip = t3 - t0;
                long offset = ntpEpochMs - ((t0 + t3) / 2);
                logTelemetry("NTP_SHOA_SYNC", String.format(Locale.US, "Servidor SHOA: %s | Latencia: %dms | Offset: %dms | Sincronizado",
                        address.getHostAddress(), roundTrip, offset));
            } catch (Exception e) {
                logTelemetry("NTP_SHOA_ERR", e.getMessage());
            }
        }).start();
    }

    // --- MÓDULO INTERNO DE TELEMETRÍA Y LOGGING EN SEGUNDO PLANO ---
    private boolean isAdoConnected = false;
    private File telemetryFile;
    private final Handler telemetryHandler = new Handler(Looper.getMainLooper());
    private final Runnable telemetryHeartbeat = new Runnable() {
        @Override
        public void run() {
            try {
                logHeartbeat();
            } catch (Exception ignored) {}
            telemetryHandler.postDelayed(this, 5000);
        }
    };

    private void initTelemetryLogger() {
        try {
            File dir = activity.getExternalFilesDir(null);
            if (dir != null) {
                telemetryFile = new File(dir, "bicipro_telemetry.jsonl");
                if (telemetryFile.exists() && telemetryFile.length() > 10 * 1024 * 1024) {
                    File old = new File(dir, "bicipro_telemetry_old.jsonl");
                    if (old.exists()) old.delete();
                    telemetryFile.renameTo(old);
                }
            }
            logTelemetry("APP_STARTUP", "BiciPRO iniciada en " + Build.MANUFACTURER + " " + Build.MODEL);
            telemetryHandler.postDelayed(telemetryHeartbeat, 2500);
        } catch (Exception e) {
            Log.e("BiciProTelemetry", "Init error", e);
        }
    }

    public synchronized void logTelemetry(String tag, Object data) {
        try {
            long now = System.currentTimeMillis();
            String isoTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS", Locale.US).format(new Date(now));
            JSONObject obj = new JSONObject();
            obj.put("ts", now);
            obj.put("time", isoTime);
            obj.put("tag", tag);
            if (data instanceof JSONObject || data instanceof JSONArray || data instanceof Number || data instanceof Boolean) {
                obj.put("data", data);
            } else {
                obj.put("data", String.valueOf(data));
            }
            String jsonLine = obj.toString();
            Log.i("BiciProTelemetry", "[" + tag + "] " + jsonLine);

            if (telemetryFile != null) {
                FileWriter fw = new FileWriter(telemetryFile, true);
                fw.write(jsonLine + "\n");
                fw.flush();
                fw.close();
            }
        } catch (Exception ignored) {}
    }

    private void logHeartbeat() {
        try {
            JSONObject hb = new JSONObject();
            hb.put("speed_kmh", currentSpeedKmh);
            hb.put("max_speed_kmh", maxSpeedKmh);
            hb.put("ado_speed_kmh", speedAdoKmh);
            hb.put("ado_batt", adoBatteryPct);
            hb.put("ado_assist", adoAssistLevel);
            hb.put("ado_odo_total", adoTotalOdoKm);
            hb.put("ado_odo_trip", adoTripOdoKm);
            hb.put("ado_connected", isAdoConnected);
            if (lastLocation != null) {
                hb.put("gps_lat", lastLocation.getLatitude());
                hb.put("gps_lng", lastLocation.getLongitude());
                hb.put("gps_alt", lastLocation.getAltitude());
                hb.put("gps_acc", lastLocation.getAccuracy());
            } else {
                hb.put("gps_lat", 0.0);
                hb.put("gps_lng", 0.0);
                hb.put("gps_alt", currentAltitudeM);
                hb.put("gps_acc", 0.0);
            }
            hb.put("pitch_deg", Math.round(smoothedPitchDeg));
            hb.put("roll_deg", Math.round(smoothedRollDeg));
            hb.put("baro_hpa", Math.round(currentPressureHpa * 10.0) / 10.0);
            hb.put("phone_battery", phoneBatteryPct);
            hb.put("music_playing", lastMediaIsPlaying);
            hb.put("music_track", lastMediaTrack);
            hb.put("music_artist", lastMediaArtist);
            logTelemetry("HEARTBEAT", hb);
        } catch (Exception ignored) {}
    }

    private void postJs(String script) {
        activity.runOnUiThread(() -> webView.evaluateJavascript(script, null));
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("'", "\\'");
    }

    /** Android 5.x: AudioTrack clásico por flujo de alarma (AudioTrack.Builder es de Android 6). */
    @SuppressWarnings("deprecation")
    private static AudioTrack bocinaAntigua(int sampleRate) {
        return new AudioTrack(AudioManager.STREAM_ALARM, sampleRate, AudioFormat.CHANNEL_OUT_MONO,
                AudioFormat.ENCODING_PCM_16BIT, hornPcmBuffer.length * 2, AudioTrack.MODE_STATIC);
    }
}
