package com.bicipro.app;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.util.Log;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Cliente de la API de Strava (Kotone 2026-10-30).
 *
 * Flujo OAuth 2 para apps móviles: se abre /oauth/mobile/authorize (si está la app de Strava
 * instalada, ella misma muestra la autorización), Strava vuelve a bicipro://localhost/strava con
 * un `code`, y ese código se cambia por access_token + refresh_token. El access_token dura 6 h:
 * antes de cada llamada se renueva solo con el refresh_token. «localhost» está en la lista blanca
 * de Strava, así que no hay que configurar dominio de retorno en la aplicación de la API.
 *
 * Las credenciales (Client ID / Client Secret) las ingresa el usuario una vez en Ajustes; viven sólo
 * en las preferencias privadas de la app, nunca en el código ni en el APK.
 */
public class StravaClient {
    public interface Callback {
        void ok(JSONObject result);
        void error(String message);
    }

    private static final String TAG = "BiciProStrava";
    public static final String REDIRECT_URI = "bicipro://localhost/strava";
    private static final String SCOPE = "read,activity:write,activity:read";
    private static final String API = "https://www.strava.com/api/v3";

    private final SharedPreferences prefs;

    public StravaClient(SharedPreferences prefs) {
        this.prefs = prefs;
    }

    // ------------------------------------------------------------------ estado

    public boolean isConfigured() {
        return !prefs.getString("strava_client_id", "").isEmpty()
                && !prefs.getString("strava_client_secret", "").isEmpty();
    }

    public boolean isConnected() {
        return !prefs.getString("strava_refresh_token", "").isEmpty();
    }

    public JSONObject status() {
        JSONObject o = new JSONObject();
        try {
            o.put("configured", isConfigured());
            o.put("connected", isConnected());
            o.put("athlete", prefs.getString("strava_athlete", ""));
            o.put("scope", prefs.getString("strava_scope", ""));
            o.put("lastUpload", prefs.getString("strava_last_upload", ""));
        } catch (Exception ignored) {}
        return o;
    }

    public void setCredentials(String clientId, String clientSecret) {
        prefs.edit()
                .putString("strava_client_id", clientId == null ? "" : clientId.trim())
                .putString("strava_client_secret", clientSecret == null ? "" : clientSecret.trim())
                .apply();
    }

    public void disconnect() {
        final String token = prefs.getString("strava_access_token", "");
        prefs.edit()
                .remove("strava_access_token").remove("strava_refresh_token")
                .remove("strava_expires_at").remove("strava_athlete").remove("strava_scope")
                .apply();
        if (!token.isEmpty()) {
            // Revoca también en Strava (si falla, igual quedó desconectada localmente).
            new Thread(() -> {
                try { http("POST", "https://www.strava.com/oauth/deauthorize", token, form("access_token", token)); }
                catch (Exception ignored) {}
            }).start();
        }
    }

    // ------------------------------------------------------------------ OAuth

    public boolean startAuthorization(Activity activity) {
        if (!isConfigured()) return false;
        Uri uri = Uri.parse("https://www.strava.com/oauth/mobile/authorize").buildUpon()
                .appendQueryParameter("client_id", prefs.getString("strava_client_id", ""))
                .appendQueryParameter("redirect_uri", REDIRECT_URI)
                .appendQueryParameter("response_type", "code")
                .appendQueryParameter("approval_prompt", "auto")
                .appendQueryParameter("scope", SCOPE)
                .build();
        Intent i = new Intent(Intent.ACTION_VIEW, uri);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        activity.startActivity(i);
        return true;
    }

    public static boolean isRedirect(Uri data) {
        return data != null && "bicipro".equals(data.getScheme())
                && "localhost".equals(data.getHost()) && "/strava".equals(data.getPath());
    }

    /** Procesa bicipro://localhost/strava?code=…&scope=… en un hilo aparte. */
    public void handleRedirect(Uri data, Callback cb) {
        String err = data.getQueryParameter("error");
        if (err != null) { cb.error("Autorización rechazada (" + err + ")"); return; }
        String code = data.getQueryParameter("code");
        String scope = data.getQueryParameter("scope");
        if (code == null) { cb.error("Strava no devolvió código de autorización"); return; }
        if (scope == null || !scope.contains("activity:write")) {
            cb.error("Falta el permiso «subir actividades»: vuelve a conectar y deja marcada esa casilla");
            return;
        }
        new Thread(() -> {
            try {
                JSONObject r = tokenRequest(form(
                        "client_id", prefs.getString("strava_client_id", ""),
                        "client_secret", prefs.getString("strava_client_secret", ""),
                        "code", code,
                        "grant_type", "authorization_code"));
                JSONObject athlete = r.optJSONObject("athlete");
                String name = athlete == null ? "" :
                        (athlete.optString("firstname", "") + " " + athlete.optString("lastname", "")).trim();
                prefs.edit().putString("strava_athlete", name).putString("strava_scope", scope).apply();
                cb.ok(status());
            } catch (Exception e) {
                Log.e(TAG, "Intercambio de código falló", e);
                cb.error(e.getMessage());
            }
        }).start();
    }

    private JSONObject tokenRequest(String body) throws Exception {
        JSONObject r = http("POST", "https://www.strava.com/oauth/token", null, body);
        prefs.edit()
                .putString("strava_access_token", r.getString("access_token"))
                .putString("strava_refresh_token", r.getString("refresh_token"))
                .putLong("strava_expires_at", r.getLong("expires_at"))
                .apply();
        return r;
    }

    /** Token vigente; lo renueva si vence en menos de 5 minutos. Llamar fuera del hilo de UI. */
    private String accessToken() throws Exception {
        if (!isConnected()) throw new IllegalStateException("Strava no está conectada");
        long now = System.currentTimeMillis() / 1000;
        if (prefs.getLong("strava_expires_at", 0) - 300 < now) {
            tokenRequest(form(
                    "client_id", prefs.getString("strava_client_id", ""),
                    "client_secret", prefs.getString("strava_client_secret", ""),
                    "refresh_token", prefs.getString("strava_refresh_token", ""),
                    "grant_type", "refresh_token"));
        }
        return prefs.getString("strava_access_token", "");
    }

    // ------------------------------------------------------------------ subida

    /**
     * Sube un GPX, espera a que Strava lo procese y lo marca como «E-Bike Ride».
     * result: {activityId, duplicate}
     */
    public void uploadGpx(File gpx, String name, Callback cb) {
        new Thread(() -> {
            try {
                String token = accessToken();
                String boundary = "----ADO O260T" + System.currentTimeMillis();
                ByteArrayOutputStream body = new ByteArrayOutputStream();
                part(body, boundary, "data_type", "gpx");
                part(body, boundary, "name", name);
                part(body, boundary, "external_id", gpx.getName());
                body.write(("--" + boundary + "\r\nContent-Disposition: form-data; name=\"file\"; filename=\""
                        + gpx.getName() + "\"\r\nContent-Type: application/gpx+xml\r\n\r\n").getBytes(StandardCharsets.UTF_8));
                try (FileInputStream in = new FileInputStream(gpx)) {
                    byte[] buf = new byte[8192]; int n;
                    while ((n = in.read(buf)) != -1) body.write(buf, 0, n);
                }
                body.write(("\r\n--" + boundary + "--\r\n").getBytes(StandardCharsets.UTF_8));

                JSONObject up = httpBytes("POST", API + "/uploads", token,
                        "multipart/form-data; boundary=" + boundary, body.toByteArray());
                long uploadId = up.getLong("id");

                // Strava procesa en segundo plano: consultar hasta tener la actividad (máx. ~90 s).
                for (int i = 0; i < 45; i++) {
                    String error = up.isNull("error") ? null : up.optString("error", null);
                    if (error != null && !error.isEmpty()) {
                        // «… duplicate of activity 123» = ya estaba subida: es un éxito.
                        java.util.regex.Matcher m = java.util.regex.Pattern
                                .compile("duplicate of .*?(\\d{6,})").matcher(error);
                        if (m.find()) {
                            JSONObject res = new JSONObject();
                            res.put("activityId", Long.parseLong(m.group(1)));
                            res.put("duplicate", true);
                            remember(res);
                            cb.ok(res);
                            return;
                        }
                        throw new Exception(error);
                    }
                    if (!up.isNull("activity_id") && up.optLong("activity_id", 0) > 0) break;
                    Thread.sleep(2000);
                    up = http("GET", API + "/uploads/" + uploadId, token, null);
                }
                long activityId = up.optLong("activity_id", 0);
                if (activityId == 0) throw new Exception("Strava sigue procesando el archivo; aparecerá en unos minutos");

                // Tipo correcto: bicicleta eléctrica (si falla, la actividad igual quedó subida).
                try {
                    http("PUT", API + "/activities/" + activityId, token, form("sport_type", "EBikeRide"));
                } catch (Exception e) {
                    Log.w(TAG, "No se pudo marcar EBikeRide: " + e.getMessage());
                }
                JSONObject res = new JSONObject();
                res.put("activityId", activityId);
                res.put("duplicate", false);
                remember(res);
                cb.ok(res);
            } catch (Exception e) {
                Log.e(TAG, "Subida a Strava falló", e);
                cb.error(e.getMessage() == null ? e.toString() : e.getMessage());
            }
        }).start();
    }

    private void remember(JSONObject res) {
        prefs.edit().putString("strava_last_upload", res.toString()).apply();
    }

    // ------------------------------------------------------------------ HTTP

    private static void part(ByteArrayOutputStream out, String boundary, String name, String value) throws Exception {
        out.write(("--" + boundary + "\r\nContent-Disposition: form-data; name=\"" + name + "\"\r\n\r\n"
                + value + "\r\n").getBytes(StandardCharsets.UTF_8));
    }

    private static String form(String... kv) throws Exception {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i + 1 < kv.length; i += 2) {
            if (sb.length() > 0) sb.append('&');
            sb.append(URLEncoder.encode(kv[i], "UTF-8")).append('=').append(URLEncoder.encode(kv[i + 1], "UTF-8"));
        }
        return sb.toString();
    }

    private static JSONObject http(String method, String url, String token, String formBody) throws Exception {
        return httpBytes(method, url, token, "application/x-www-form-urlencoded",
                formBody == null ? null : formBody.getBytes(StandardCharsets.UTF_8));
    }

    private static JSONObject httpBytes(String method, String url, String token, String contentType, byte[] body) throws Exception {
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        c.setConnectTimeout(15000);
        c.setReadTimeout(30000);
        c.setRequestMethod(method);
        if (token != null) c.setRequestProperty("Authorization", "Bearer " + token);
        if (body != null) {
            c.setDoOutput(true);
            c.setRequestProperty("Content-Type", contentType);
            c.setFixedLengthStreamingMode(body.length);
            try (OutputStream os = c.getOutputStream()) { os.write(body); }
        }
        int code = c.getResponseCode();
        InputStream in = code >= 400 ? c.getErrorStream() : c.getInputStream();
        String text = "";
        if (in != null) {
            ByteArrayOutputStream b = new ByteArrayOutputStream();
            byte[] buf = new byte[4096]; int n;
            while ((n = in.read(buf)) != -1) b.write(buf, 0, n);
            in.close();
            text = b.toString("UTF-8");
        }
        c.disconnect();
        if (code >= 400) {
            String msg = text;
            try { msg = new JSONObject(text).optString("message", text); } catch (Exception ignored) {}
            if (code == 401) msg = "Strava rechazó la sesión (401): vuelve a conectar la cuenta";
            if (code == 429) msg = "Límite de la API de Strava alcanzado (429): intenta en 15 minutos";
            throw new Exception("HTTP " + code + ": " + msg);
        }
        return text.isEmpty() ? new JSONObject() : new JSONObject(text);
    }
}
