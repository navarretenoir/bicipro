package com.bicipro.app;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.location.Location;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.lang.ref.WeakReference;

/**
 * Enlace de ADO O260T con las apps hermanas (Kotone 2026-10-31):
 *   · Clima (org.kotone.clima)  → alertas PARA PEDALEAR en tu posición (ClimaProveedor, bajo demanda)
 *                                  + empujes de sus avisos en segundo plano (org.kotone.clima.ALERTA)
 *   · Metro (org.kotone.metro)  → empujes de estado de la red (org.kotone.metro.ALERTA)
 * Todo protegido por el permiso de FIRMA org.kotone.clima.permission.ALERTAS: sólo apps firmadas con
 * la misma llave se hablan. JS: window.Enlace.{consultarClima, alertas, abrir, notificar}.
 */
public class Enlace {
    static final String TAG = "BiciEnlace";
    static final String CLIMA = "org.kotone.clima", METRO = "org.kotone.metro";
    static final String CH = "enlace_alertas", CH_NOW = "now_bar";
    static final int ID_NOW = 60;
    /** Now Bar de Samsung (Live Updates de Android 16): sólo en Samsung con soporte; en otras marcas no se activa. */
    static boolean nowBarDisponible(Context c) {
        if (android.os.Build.VERSION.SDK_INT < 36 || !"samsung".equalsIgnoreCase(android.os.Build.MANUFACTURER)) return false;
        try { return c.getSystemService(NotificationManager.class).canPostPromotedNotifications(); } catch (Throwable t) { return false; }
    }
    private static WeakReference<Enlace> vivo = new WeakReference<>(null);

    private final Activity act;
    private final WebView web;

    Enlace(Activity a, WebView w) { act = a; web = w; vivo = new WeakReference<>(this); }

    private void js(String code) { act.runOnUiThread(() -> web.evaluateJavascript(code, null)); }

    // ------------------------------------------------------------------ Clima bajo demanda
    /** Alertas de Clima para la posición actual → window.onClimaAlertas(json | null). */
    @JavascriptInterface
    public void consultarClima() {
        new Thread(() -> {
            String json = null;
            try {
                Location l = ultimaPosicion(act);
                if (l != null) {
                    Bundle x = new Bundle();
                    x.putDouble("lat", l.getLatitude());
                    x.putDouble("lon", l.getLongitude());
                    Bundle r = act.getContentResolver().call(Uri.parse("content://org.kotone.clima.alertas"), "alertas", null, x);
                    if (r != null) json = r.getString("json");
                    if (r != null && r.containsKey("error")) Log.w(TAG, "Clima: " + r.getString("error"));
                }
            } catch (Exception e) { Log.w(TAG, "Clima no disponible: " + e); }
            js("window.onClimaAlertas&&window.onClimaAlertas(" + (json == null ? "null" : json) + ")");
        }, "enlace-clima").start();
    }

    static Location ultimaPosicion(Context c) {
        try {
            LocationManager lm = (LocationManager) c.getSystemService(Context.LOCATION_SERVICE);
            Location best = null;
            for (String p : new String[]{"fused", LocationManager.GPS_PROVIDER, LocationManager.NETWORK_PROVIDER, LocationManager.PASSIVE_PROVIDER}) {
                try { Location l = lm.getLastKnownLocation(p); if (l != null && (best == null || l.getTime() > best.getTime())) best = l; }
                catch (Exception ignored) { }
            }
            return best;
        } catch (Exception e) { return null; }
    }

    // ------------------------------------------------------------------ empujes recibidos
    /** Últimas alertas empujadas por Clima/Metro (JSON array, más reciente primero, máx. 10). */
    @JavascriptInterface
    public String alertas() {
        return act.getSharedPreferences("enlace", Context.MODE_PRIVATE).getString("recibidas", "[]");
    }

    /** Abre Clima o Metro («clima» | «metro»). */
    @JavascriptInterface
    public boolean abrir(String app) {
        Intent i = act.getPackageManager().getLaunchIntentForPackage("metro".equals(app) ? METRO : CLIMA);
        if (i == null) return false;
        act.runOnUiThread(() -> act.startActivity(i));
        return true;
    }

    @JavascriptInterface
    public boolean instalada(String app) {
        return act.getPackageManager().getLaunchIntentForPackage("metro".equals(app) ? METRO : CLIMA) != null;
    }

    /**
     * Now Bar: la interfaz llama cada ~2 s con el estado de la ruta o la navegación.
     * json: {modo:"nav"|"ruta"|"off", titulo, texto, chip, progreso(0–1000, sólo nav)}
     */
    @JavascriptInterface
    public void nowBar(String json) {
        NotificationManager nm = (NotificationManager) act.getSystemService(Context.NOTIFICATION_SERVICE);
        try {
            JSONObject j = new JSONObject(json);
            if ("off".equals(j.optString("modo")) || !nowBarDisponible(act)) { nm.cancel(ID_NOW); return; }
            nowBar16(nm, j);                                   // nowBarDisponible ⇒ Android 16 (Samsung)
        } catch (Exception e) { Log.w(TAG, "now bar: " + e); }
    }

    @android.annotation.TargetApi(36)
    private void nowBar16(NotificationManager nm, JSONObject j) {
        {
            NotificationChannel ch = new NotificationChannel(CH_NOW, "Ruta y navegación en curso (Now Bar)", NotificationManager.IMPORTANCE_DEFAULT);
            ch.setSound(null, null); ch.enableVibration(false);
            nm.createNotificationChannel(ch);
            PendingIntent abrir = PendingIntent.getActivity(act, 1, new Intent(act, MainActivity.class)
                    .setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), PendingIntent.FLAG_IMMUTABLE);
            Notification.Builder b = new Notification.Builder(act, CH_NOW)
                    .setSmallIcon(R.drawable.ic_stat_bici).setOngoing(true).setOnlyAlertOnce(true).setShowWhen(false)
                    .setContentTitle(j.optString("titulo")).setContentText(j.optString("texto")).setContentIntent(abrir)
                    .setCategory("nav".equals(j.optString("modo")) ? Notification.CATEGORY_NAVIGATION : Notification.CATEGORY_WORKOUT)
                    .setGroup("now-bar")  /* grupo propio: el autoagrupado la esconde de la Now Bar */;
            if (android.os.Build.VERSION.SDK_INT_FULL >= android.os.Build.VERSION_CODES_FULL.BAKLAVA_1) b.setRequestPromotedOngoing(true);
            if (!j.optString("chip").isEmpty()) b.setShortCriticalText(j.optString("chip"));
            if ("nav".equals(j.optString("modo"))) {
                // barra de progreso del trayecto con la bici avanzando (ProgressStyle de Android 16)
                Notification.ProgressStyle ps = new Notification.ProgressStyle()
                        .setStyledByProgress(true)
                        .setProgressTrackerIcon(android.graphics.drawable.Icon.createWithResource(act, R.drawable.ic_stat_bici))
                        .setProgressSegments(java.util.Collections.singletonList(new Notification.ProgressStyle.Segment(1000).setColor(0xFF0A84FF)))
                        .setProgress(Math.max(0, Math.min(1000, j.optInt("progreso"))));
                b.setStyle(ps);
            } else b.setStyle(new Notification.BigTextStyle().bigText(j.optString("texto")));
            nm.notify(ID_NOW, b.build());
        }
    }

    /** Notificación del sistema (la usa el cockpit al aparecer una alerta nueva durante una ruta). */
    @JavascriptInterface
    public void notificar(String titulo, String texto, String nivel) { avisar(act, titulo, texto, nivel, 30); }

    static void avisar(Context c, String titulo, String texto, String nivel, int id) {
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        if (android.os.Build.VERSION.SDK_INT >= 26)
            nm.createNotificationChannel(new NotificationChannel(CH, "Alertas de Clima y Metro", NotificationManager.IMPORTANCE_HIGH));
        PendingIntent abrir = PendingIntent.getActivity(c, 0, new Intent(c, MainActivity.class)
                .setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP), android.os.Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0);
        Notification n = builder(c, CH)
                .setPriority(Notification.PRIORITY_HIGH).setDefaults(Notification.DEFAULT_ALL)   // Android 5–7: sin canales
                .setSmallIcon(R.drawable.ic_bici_glifo)
                .setColor("danger".equals(nivel) ? 0xFFFF453A : 0xFFFF9F0A)
                .setContentTitle(titulo).setContentText(texto)
                .setStyle(new Notification.BigTextStyle().bigText(texto))
                .setContentIntent(abrir).setAutoCancel(true).build();
        try { nm.notify(id, n); } catch (SecurityException ignored) { }
    }

    @SuppressWarnings("deprecation")
    static Notification.Builder builder(Context c, String canal) {
        return android.os.Build.VERSION.SDK_INT >= 26 ? new Notification.Builder(c, canal) : new Notification.Builder(c);
    }

    /** Receptor de empujes de Clima y Metro (sólo emisores con la misma firma: permiso en el manifiesto). */
    public static class Receptor extends BroadcastReceiver {
        @Override public void onReceive(Context c, Intent in) {
            String origen = in.getAction() != null && in.getAction().startsWith("org.kotone.metro") ? "metro" : "clima";
            String titulo = in.getStringExtra("titulo"), texto = in.getStringExtra("texto"), nivel = in.getStringExtra("nivel");
            if (titulo == null || texto == null) return;
            try {
                SharedPreferences sp = c.getSharedPreferences("enlace", Context.MODE_PRIVATE);
                JSONArray old = new JSONArray(sp.getString("recibidas", "[]")), nu = new JSONArray();
                JSONObject a = new JSONObject().put("origen", origen).put("titulo", titulo).put("texto", texto)
                        .put("nivel", nivel == null ? "warn" : nivel).put("ts", System.currentTimeMillis() / 1000);
                nu.put(a);
                for (int i = 0; i < old.length() && nu.length() < 10; i++) nu.put(old.get(i));
                sp.edit().putString("recibidas", nu.toString()).apply();
                avisar(c, ("metro".equals(origen) ? "🚇 Metro: " : "🌦️ Clima: ") + titulo, texto, nivel, "metro".equals(origen) ? 32 : 31);
                Enlace e = vivo.get();
                if (e != null) e.js("window.onEnlaceAlerta&&window.onEnlaceAlerta(" + a + ")");
            } catch (Exception ex) { Log.w(TAG, "empuje inválido: " + ex); }
        }
    }
}
