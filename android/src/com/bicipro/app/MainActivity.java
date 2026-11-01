package com.bicipro.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.Display;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

public class MainActivity extends Activity {
    private WebView webView;
    private AdoBridge bridge;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Pantalla OLED full-black y siempre encendida
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        try {
            android.os.StrictMode.VmPolicy.Builder builder = new android.os.StrictMode.VmPolicy.Builder();
            android.os.StrictMode.setVmPolicy(builder.build());
        } catch (Exception ignored) {}

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(Color.BLACK);
            getWindow().setNavigationBarColor(Color.BLACK);
        }

        // 120Hz en pantallas Super AMOLED 
        optimizeForHighRefreshRate();

        // Configuración de WebView ultra-fluido
        webView = new WebView(this);
        webView.setBackgroundColor(Color.BLACK);
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setGeolocationEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        bridge = new AdoBridge(this, webView);
        webView.addJavascriptInterface(bridge, "ADO");
        webView.addJavascriptInterface(bridge, "AdoBridge");
        webView.addJavascriptInterface(bridge, "BiciPRO");
        // enlace con Clima y Metro (alertas); Kotone 2026-10-31
        webView.addJavascriptInterface(new Enlace(this, webView), "Enlace");
        // mapas y ruteo offline de Chile (BRouter + PMTiles servido localmente)
        webView.addJavascriptInterface(new Ruteo(this, webView), "Ruteo");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public android.webkit.WebResourceResponse shouldInterceptRequest(WebView view, android.webkit.WebResourceRequest req) {
                android.webkit.WebResourceResponse r = Ruteo.servir(MainActivity.this, req.getUrl().toString(), req.getRequestHeaders(), req.getMethod());
                return r != null ? r : super.shouldInterceptRequest(view, req);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                pageReady = true;
                if (pendingNav != null) { final String js = pendingNav; pendingNav = null; view.postDelayed(() -> view.evaluateJavascript(js, null), 1500); }
                Log.i("ADO_O260T", "Page loaded: " + url);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                Log.e("ADO_O260T", "WebView error: " + description + " (" + errorCode + ")");
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage cm) {
                Log.d("ADO_JS", cm.message() + " [" + cm.sourceId() + ":" + cm.lineNumber() + "]");
                return true;
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                Log.i("ADO_O260T", "Geolocation permission granted to: " + origin);
                callback.invoke(origin, true, false);
            }
        });

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.BLACK);
        root.addView(webView);
        setContentView(root);

        // Solicitar permisos
        checkAndRequestPermissions();

        // Iniciar servicio en primer plano
        try {
            Intent svc = new Intent(this, AdoKeepAliveService.class);
            svc.putExtra("status", "BiciPRO en espera");
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(svc);
            } else {
                startService(svc);
            }
        } catch (Exception ignored) {}

        // Cargar interfaz Negative LCD
        webView.loadUrl("file:///android_asset/web/index.html");
        handleStravaIntent(getIntent());
        handleLocationIntent(getIntent());
    }

    // Kotone 2026-10-30: vuelta de la autorización de Strava (bicipro://localhost/strava?code=…).
    @Override
    protected void onNewIntent(android.content.Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleStravaIntent(intent);
        handleLocationIntent(intent);
    }

    // ------------------------------------------------------------------ ubicaciones desde otras apps
    // geo:lat,lng?q=… · google.navigation:q=lat,lng&mode=b · texto compartido con enlace de mapas.
    // (Kotone 2026-10-31; contratos estudiados con REA en Google Maps — mapas-offline/APRENDIZAJES-GOOGLE-MAPS.md)
    private String pendingNav = null;
    private boolean pageReady = false;
    private static final java.util.regex.Pattern COORD = java.util.regex.Pattern.compile(
            "(-?\\d{1,2}\\.\\d+)\\s*,\\s*(-?\\d{1,3}\\.\\d+)");

    private void handleLocationIntent(android.content.Intent intent) {
        if (intent == null) return;
        String raw = null;
        if (android.content.Intent.ACTION_SEND.equals(intent.getAction())) raw = intent.getStringExtra(android.content.Intent.EXTRA_TEXT);
        else if (intent.getData() != null && ("geo".equals(intent.getData().getScheme()) || "google.navigation".equals(intent.getData().getScheme())))
            raw = android.net.Uri.decode(intent.getData().toString());
        if (raw == null) return;
        String label = "Destino compartido";
        java.util.regex.Matcher lab = java.util.regex.Pattern.compile("\\(([^)]{1,80})\\)").matcher(raw);
        if (lab.find()) label = lab.group(1);
        // en enlaces de Google Maps la posición real va tras «@», «q=», «ll=» o «destination=»
        java.util.regex.Matcher m = java.util.regex.Pattern.compile("(?:@|[?&](?:q|ll|query|destination|daddr)=|geo:)" + COORD.pattern()).matcher(raw);
        java.util.regex.Matcher m2 = COORD.matcher(raw);
        String lat = null, lng = null;
        if (m.find()) { lat = m.group(1); lng = m.group(2); }
        else if (m2.find()) { lat = m2.group(1); lng = m2.group(2); }
        if (lat != null && !("0.0".equals(lat) || "0".equals(lat))) {
            pendingNav = "window.navegarA(" + lat + "," + lng + "," + org.json.JSONObject.quote(label) + ")";
        } else {
            // sin coordenadas: se busca el texto (dirección/lugar) en el directorio offline de Chile
            String q = raw.replaceAll("^(geo:[^?]*\\?q=|google\\.navigation:q=)", "").replaceAll("&.*$", "").trim();
            if (q.isEmpty() || q.startsWith("http")) { android.widget.Toast.makeText(this, "Ese enlace no trae coordenadas", android.widget.Toast.LENGTH_LONG).show(); return; }
            pendingNav = "window.navegarATexto&&window.navegarATexto(" + org.json.JSONObject.quote(q) + ")";
        }
        intent.setAction(null); intent.setData(null);
        if (pageReady) { webView.evaluateJavascript(pendingNav, null); pendingNav = null; }
    }

    private void handleStravaIntent(android.content.Intent intent) {
        if (intent == null || bridge == null) return;
        android.net.Uri data = intent.getData();
        if (StravaClient.isRedirect(data)) {
            bridge.handleStravaRedirect(data);
            intent.setData(null);
        }
    }

    private void optimizeForHighRefreshRate() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            try {
                Display display = getWindowManager().getDefaultDisplay();
                Display.Mode[] modes = display.getSupportedModes();
                Display.Mode bestMode = null;
                float maxRate = 60.0f;
                for (Display.Mode mode : modes) {
                    if (mode.getRefreshRate() > maxRate) {
                        maxRate = mode.getRefreshRate();
                        bestMode = mode;
                    }
                }
                if (bestMode != null) {
                    WindowManager.LayoutParams params = getWindow().getAttributes();
                    params.preferredDisplayModeId = bestMode.getModeId();
                    getWindow().setAttributes(params);
                }
            } catch (Exception ignored) {}
        }
    }

    private void checkAndRequestPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            String[] permissions;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                permissions = new String[]{
                        "android.permission.ACCESS_FINE_LOCATION",
                        "android.permission.ACCESS_COARSE_LOCATION",
                        "android.permission.BLUETOOTH_SCAN",
                        "android.permission.BLUETOOTH_CONNECT",
                        "android.permission.READ_PHONE_STATE",
                        "android.permission.ANSWER_PHONE_CALLS",
                        "android.permission.RECEIVE_SMS",
                        "android.permission.READ_SMS",
                        "android.permission.READ_MEDIA_AUDIO",
                        "android.permission.POST_NOTIFICATIONS"
                };
            } else {
                permissions = new String[]{
                        "android.permission.ACCESS_FINE_LOCATION",
                        "android.permission.ACCESS_COARSE_LOCATION",
                        "android.permission.READ_PHONE_STATE",
                        "android.permission.ANSWER_PHONE_CALLS",
                        "android.permission.RECEIVE_SMS",
                        "android.permission.READ_SMS"
                };
            }

            boolean needRequest = false;
            for (String p : permissions) {
                if (checkSelfPermission(p) != PackageManager.PERMISSION_GRANTED) {
                    needRequest = true;
                    break;
                }
            }
            if (needRequest) {
                requestPermissions(permissions, 100);
            } else {
                askBackgroundLocation();
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 100) askBackgroundLocation();
    }

    /** Ubicación permanente (Kotone 2026-10-31): Android 10+ exige pedirla APARTE y después de la normal;
     *  se explica primero y Android abre su selector «Permitir todo el tiempo». Se ofrece una vez. */
    private void askBackgroundLocation() {
        if (Build.VERSION.SDK_INT < 29) return;
        if (checkSelfPermission("android.permission.ACCESS_FINE_LOCATION") != PackageManager.PERMISSION_GRANTED
                && checkSelfPermission("android.permission.ACCESS_COARSE_LOCATION") != PackageManager.PERMISSION_GRANTED) return;
        if (checkSelfPermission("android.permission.ACCESS_BACKGROUND_LOCATION") == PackageManager.PERMISSION_GRANTED) return;
        android.content.SharedPreferences sp = getSharedPreferences("enlace", MODE_PRIVATE);
        if (sp.getBoolean("bg_pedido", false)) return;
        sp.edit().putBoolean("bg_pedido", true).apply();
        new android.app.AlertDialog.Builder(this, android.R.style.Theme_DeviceDefault_Dialog_Alert)
                .setTitle("Ubicación todo el tiempo")
                .setMessage("Para grabar la ruta con la pantalla apagada y recibir alertas de Clima donde estés, "
                        + "elige «Permitir todo el tiempo» en la siguiente pantalla.")
                .setPositiveButton("Continuar", (d, w) -> requestPermissions(
                        new String[]{"android.permission.ACCESS_BACKGROUND_LOCATION"}, 101))
                .setNegativeButton("Ahora no", null)
                .show();
    }

    @Override
    public void onBackPressed() {
        // En modo ciclocomputador evitar salir accidentalmente
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            // Mover a segundo plano sin destruir la actividad
            moveTaskToBack(true);
        }
    }
}
