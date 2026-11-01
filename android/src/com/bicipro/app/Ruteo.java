package com.bicipro.app;

import android.app.Activity;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;

import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import btools.router.FormatJson;
import btools.router.OsmNodeNamed;
import btools.router.OsmTrack;
import btools.router.RoutingContext;
import btools.router.RoutingEngine;

/**
 * Mapas y ruteo 100 % offline de ADO O260T (Kotone 2026-10-31).
 *  · RUTEO: BRouter (brouter-ro.jar, MIT) embebido, con los segmentos de Chile en
 *    Android/data/com.bicipro.app/files/segments/*.rd5 y el perfil de bici en assets/brouter/.
 *    JS: window.Ruteo.calcular(id, latA, lonA, latB, lonB, perfil) → window.__ruta(id, geojson|null, error).
 *  · MAPA: sirve el PMTiles de Chile (files/mapas/chile.pmtiles) en https://ado.local/mapas/chile.pmtiles
 *    con peticiones por rango (206), que es como lo lee protomaps-leaflet. Sin archivo → 404 y la app
 *    usa el mapa en línea de respaldo.
 */
public class Ruteo {
    static final String TAG = "AdoRuteo";
    static final String HOST = "https://ado.local/";
    private final Activity act;
    private final WebView web;

    Ruteo(Activity a, WebView w) { act = a; web = w; }

    private void js(String code) { act.runOnUiThread(() -> web.evaluateJavascript(code, null)); }

    static File dirSegmentos(Activity a) { return new File(a.getExternalFilesDir(null), "segments"); }
    static File archivoMapa(Activity a) { return new File(new File(a.getExternalFilesDir(null), "mapas"), "chile.pmtiles"); }


    // ------------------------------------------------------------------ descarga de los mapas de Chile (primer uso)
    // Los datos (1,2 GB) viven en una release pública del repositorio; se bajan con reanudación y se verifican con SHA-256.
    private static final String BASE = "https://github.com/navarretenoir/bicipro/releases/download/mapas-20261031/";
    private static final String[][] ARCH = {   // nombre, bytes, sha256
        {"chile.pmtiles", "1136902024", "82cb17ea9a1e2162e91cab42696dbd8475f8ff00b52a2cf983c8c8ea78060fe1"},
        {"segmentos-brouter.zip", "122423210", "e002e6fb331096b5783bba66fc43e102f9d10c267d73e4152ec745e9f77582da"}};
    private volatile boolean bajando = false, cancelar = false;
    private volatile String msg = "";
    private volatile long hechos = 0;

    @JavascriptInterface
    public String descarga() {
        long total = 0; for (String[] a : ARCH) total += Long.parseLong(a[1]);
        try { return new JSONObject().put("activa", bajando).put("hechos", hechos).put("total", total).put("mensaje", msg).toString(); }
        catch (Exception e) { return "{}"; }
    }

    @JavascriptInterface
    public void cancelarDescarga() { cancelar = true; }

    @JavascriptInterface
    public void descargarMapas() {
        if (bajando) return;
        bajando = true; cancelar = false; msg = "Conectando…"; hechos = 0;
        new Thread(() -> {
            try {
                File base = act.getExternalFilesDir(null);
                for (String[] a : ARCH) {
                    File dst = a[0].endsWith(".zip") ? new File(base, "descargas/" + a[0]) : new File(new File(base, "mapas"), a[0]);
                    if (a[0].endsWith(".pmtiles") && dst.isFile() && dst.length() == Long.parseLong(a[1])) { hechos += dst.length(); continue; }
                    bajar(BASE + a[0], dst, Long.parseLong(a[1]), a[2]);
                    if (a[0].endsWith(".zip")) { extraer(dst, dirSegmentos(act)); dst.delete(); }
                }
                msg = "Mapas instalados";
                js("window.onMapasInstalados&&onMapasInstalados()");
            } catch (Exception e) {
                msg = cancelar ? "Descarga cancelada" : "Error: " + e.getMessage() + " (puedes reanudar)";
            } finally { bajando = false; }
        }).start();
    }

    private void bajar(String url, File dst, long total, String sha) throws Exception {
        dst.getParentFile().mkdirs();
        File parcial = new File(dst.getPath() + ".parcial");
        long ya = parcial.isFile() ? parcial.length() : 0;
        if (ya > total) { parcial.delete(); ya = 0; }
        long baseHechos = hechos;
        if (ya < total) {
            java.net.HttpURLConnection c = (java.net.HttpURLConnection) new java.net.URL(url).openConnection();
            c.setConnectTimeout(20000); c.setReadTimeout(30000);
            if (ya > 0) c.setRequestProperty("Range", "bytes=" + ya + "-");
            int cod = c.getResponseCode();
            if (cod == 200) ya = 0;                         // el servidor ignoró el rango: empezar de cero
            else if (cod != 206) throw new Exception("HTTP " + cod);
            msg = "Descargando " + dst.getName();
            try (java.io.InputStream in = c.getInputStream(); java.io.FileOutputStream out = new java.io.FileOutputStream(parcial, ya > 0)) {
                byte[] b = new byte[65536]; int n; long suma = ya;
                while ((n = in.read(b)) > 0) {
                    if (cancelar) throw new Exception("cancelada");
                    out.write(b, 0, n); suma += n; hechos = baseHechos + suma;
                }
            }
        }
        msg = "Verificando " + dst.getName();
        java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
        try (java.io.FileInputStream in = new java.io.FileInputStream(parcial)) { byte[] b = new byte[65536]; int n; while ((n = in.read(b)) > 0) md.update(b, 0, n); }
        StringBuilder h = new StringBuilder(); for (byte x : md.digest()) h.append(String.format("%02x", x));
        if (!h.toString().equals(sha)) { parcial.delete(); throw new Exception("archivo dañado, vuelve a intentar"); }
        if (dst.exists()) dst.delete();
        if (!parcial.renameTo(dst)) throw new Exception("no se pudo guardar el archivo");
        hechos = baseHechos + total;
    }

    private void extraer(File zip, File destino) throws Exception {
        destino.mkdirs(); msg = "Instalando rutas…";
        try (java.util.zip.ZipInputStream z = new java.util.zip.ZipInputStream(new java.io.FileInputStream(zip))) {
            java.util.zip.ZipEntry e;
            while ((e = z.getNextEntry()) != null) {
                String n = new File(e.getName()).getName();                   // sin rutas: evita escapar de la carpeta
                if (!n.endsWith(".rd5")) continue;
                try (java.io.FileOutputStream o = new java.io.FileOutputStream(new File(destino, n))) { byte[] b = new byte[65536]; int k; while ((k = z.read(b)) > 0) o.write(b, 0, k); }
            }
        }
    }

    /** Estado de los datos offline, para la interfaz. */
    @JavascriptInterface
    public String estado() {
        try {
            File[] seg = dirSegmentos(act).listFiles((d, n) -> n.endsWith(".rd5"));
            File m = archivoMapa(act);
            return new JSONObject().put("segmentos", seg == null ? 0 : seg.length)
                    .put("mapa", m.isFile() ? m.length() : 0).toString();
        } catch (Exception e) { return "{}"; }
    }

    /** Perfil BRouter copiado de assets a un directorio real (BRouter lee archivos, junto a lookups.dat). */
    private File perfil(String nombre) throws Exception {
        File dir = new File(act.getFilesDir(), "brouter");
        if (!dir.isDirectory() && !dir.mkdirs()) throw new Exception("sin directorio de perfiles");
        for (String f : new String[]{"lookups.dat", nombre + ".brf"}) {
            File out = new File(dir, f);
            if (out.isFile() && out.length() > 0) continue;
            try (InputStream in = act.getAssets().open("brouter/" + f); FileOutputStream o = new FileOutputStream(out)) {
                byte[] b = new byte[16384]; int n;
                while ((n = in.read(b)) > 0) o.write(b, 0, n);
            }
        }
        return new File(dir, nombre + ".brf");
    }

    private static OsmNodeNamed punto(String nombre, double lat, double lon) {
        OsmNodeNamed n = new OsmNodeNamed();
        n.name = nombre;
        n.ilon = (int) ((lon + 180.0) * 1_000_000.0 + 0.5);
        n.ilat = (int) ((lat + 90.0) * 1_000_000.0 + 0.5);
        return n;
    }

    /** Ruta en bici A→B. perfil: «trekking» (equilibrado, prefiere ciclovías) | «fastbike» | «safety». */
    @JavascriptInterface
    public void calcular(final int id, final double latA, final double lonA, final double latB, final double lonB, final String perfil) {
        new Thread(() -> {
            String geo = null, err = null;
            try {
                String p = perfil == null || !perfil.matches("trekking|fastbike|safety") ? "trekking" : perfil;
                RoutingContext rc = new RoutingContext();
                rc.localFunction = perfil(p).getAbsolutePath();
                rc.turnInstructionMode = 9;            // indicaciones de giro en el JSON (voicehints)
                List<OsmNodeNamed> wps = new ArrayList<>();
                wps.add(punto("desde", latA, lonA));
                wps.add(punto("hasta", latB, lonB));
                long t0 = System.currentTimeMillis();
                RoutingEngine re = new RoutingEngine(null, null, dirSegmentos(act), wps, rc);
                re.quite = true;
                re.doRun(60_000);
                if (re.getErrorMessage() != null) err = re.getErrorMessage();
                else {
                    OsmTrack t = re.getFoundTrack();
                    if (t == null) err = "sin ruta";
                    else geo = new FormatJson(rc).format(t);
                }
                Log.i(TAG, "ruta " + p + " en " + (System.currentTimeMillis() - t0) + " ms" + (err != null ? " · " + err : ""));
            } catch (Throwable e) {
                err = String.valueOf(e);
                Log.w(TAG, "ruteo falló", e);
            }
            js("window.__ruta&&window.__ruta(" + id + "," + (geo == null ? "null" : JSONObject.quote(geo)) + ","
                    + JSONObject.quote(err == null ? "" : err) + ")");
        }, "ado-ruteo").start();
    }

    // ------------------------------------------------------------------ servidor local del mapa
    /** Atiende https://ado.local/mapas/chile.pmtiles con rangos; null = no es nuestro. */
    static WebResourceResponse servir(Activity a, String url, Map<String, String> headers) { return servir(a, url, headers, "GET"); }
    static WebResourceResponse servir(Activity a, String url, Map<String, String> headers, String metodo) {
        if (url == null || !url.startsWith(HOST + "mapas/")) return null;
        Map<String, String> h = new HashMap<>();
        h.put("Access-Control-Allow-Origin", "*");
        // la página vive en file:// (origen «null») → CORS: protomaps/pmtiles mandan Range + If-Match/If-None-Match,
        // lo que dispara una consulta previa (OPTIONS). Sin autorizarlas, «Failed to fetch» y mapa en blanco.
        h.put("Access-Control-Allow-Headers", "Range, If-Match, If-None-Match, Cache-Control, Content-Type");
        h.put("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
        h.put("Access-Control-Max-Age", "86400");
        h.put("Access-Control-Expose-Headers", "Content-Range, Content-Length, ETag, Accept-Ranges");
        h.put("Accept-Ranges", "bytes");
        if ("OPTIONS".equalsIgnoreCase(metodo))
            return new WebResourceResponse("text/plain", null, 204, "No Content", h, new java.io.ByteArrayInputStream(new byte[0]));
        h.put("Cache-Control", "no-cache");
        File f = archivoMapa(a);
        String sinQuery = url.split("\\?", 2)[0];
        if (!sinQuery.endsWith("/chile.pmtiles") || !f.isFile())
            return new WebResourceResponse("text/plain", null, 404, "Not Found", h, new java.io.ByteArrayInputStream(new byte[0]));
        try {
            long len = f.length(), ini = 0, fin = len - 1;
            String r = null;
            if (headers != null) for (Map.Entry<String, String> e : headers.entrySet())
                if ("range".equalsIgnoreCase(e.getKey())) r = e.getValue();
            // Trozo pedido como ?o=<desde>&l=<largo> (SIN cabecera Range: Chromium rechaza las respuestas
            // interceptadas a peticiones con rango que no parte en 0). Se mantiene Range por compatibilidad.
            android.net.Uri qu = android.net.Uri.parse(url);
            if (qu.getQueryParameter("o") != null && qu.getQueryParameter("l") != null) {
                long o = Long.parseLong(qu.getQueryParameter("o")), l = Long.parseLong(qu.getQueryParameter("l"));
                r = "bytes=" + o + "-" + (o + l - 1);
            }
            boolean parcial = r != null && r.startsWith("bytes=");
            if (parcial) {
                String[] p = r.substring(6).split("-", 2);
                if (!p[0].isEmpty()) ini = Long.parseLong(p[0].trim());
                if (p.length > 1 && !p[1].isEmpty()) fin = Math.min(len - 1, Long.parseLong(p[1].trim()));
                else if (p[0].isEmpty() && p.length > 1) { ini = Math.max(0, len - Long.parseLong(p[1].trim())); fin = len - 1; }
            }
            int n = (int) Math.min(fin - ini + 1, 32L << 20);
            byte[] buf = new byte[Math.max(0, n)];
            try (RandomAccessFile raf = new RandomAccessFile(f, "r")) { raf.seek(ini); raf.readFully(buf); }
            h.put("Content-Length", String.valueOf(buf.length));
            // SIN ETag a propósito: con él pmtiles agrega If-Match → consulta CORS previa, que el WebView no deja
            // interceptar para un host inventado → «Failed to fetch». Sólo Range (cabecera simple) pasa directo.
            // Respuesta 200 con EXACTAMENTE los bytes pedidos: el WebView rechaza («Failed to fetch») los 206
            // interceptados cuyo rango no parte en 0; pmtiles acepta un 200 de largo ≤ al pedido (verificado en el A55).
            return new WebResourceResponse("application/octet-stream", null, 200, "OK", h, new java.io.ByteArrayInputStream(buf));
        } catch (Exception e) {
            Log.w(TAG, "mapa: " + e);
            return new WebResourceResponse("text/plain", null, 500, "Error", h, new java.io.ByteArrayInputStream(new byte[0]));
        }
    }
}
