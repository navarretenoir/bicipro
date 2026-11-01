package com.bicipro.app;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Sensores asignados por el usuario (BiciPRO pública): ninguno viene de fábrica. El usuario busca por Bluetooth y
 * asigna cada dispositivo a un rol; uno por rol. La conexión se decide por los servicios que el dispositivo anuncia
 * (perfiles estándar de Bluetooth), no por su dirección.
 */
final class Sensores {
    static final String CENTRALITA = "centralita", PULSO = "pulso", VELOCIDAD = "velocidad", POTENCIA = "potencia";

    private Sensores() {}

    private static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences("bicipro_sensores", Context.MODE_PRIVATE);
    }

    static JSONArray lista(Context c) {
        try { return new JSONArray(prefs(c).getString("asignados", "[]")); } catch (Exception e) { return new JSONArray(); }
    }

    static String rol(Context c, String mac) {
        if (mac == null) return "";
        JSONArray a = lista(c);
        for (int i = 0; i < a.length(); i++) {
            JSONObject o = a.optJSONObject(i);
            if (o != null && mac.equalsIgnoreCase(o.optString("mac"))) return o.optString("rol");
        }
        return "";
    }

    static String macDe(Context c, String rol) {
        JSONArray a = lista(c);
        for (int i = 0; i < a.length(); i++) {
            JSONObject o = a.optJSONObject(i);
            if (o != null && rol.equals(o.optString("rol"))) return o.optString("mac");
        }
        return "";
    }

    static String nombreDe(Context c, String rol) {
        JSONArray a = lista(c);
        for (int i = 0; i < a.length(); i++) {
            JSONObject o = a.optJSONObject(i);
            if (o != null && rol.equals(o.optString("rol"))) return o.optString("nombre");
        }
        return "";
    }

    static boolean es(Context c, String mac, String rol) {
        return mac != null && !mac.isEmpty() && mac.equalsIgnoreCase(macDe(c, rol));
    }

    /** Asigna `mac` al rol (reemplaza al que tuviera ese rol y saca a ese dispositivo de cualquier otro rol). */
    static void asignar(Context c, String mac, String nombre, String rol) {
        JSONArray a = lista(c), b = new JSONArray();
        for (int i = 0; i < a.length(); i++) {
            JSONObject o = a.optJSONObject(i);
            if (o == null || rol.equals(o.optString("rol")) || mac.equalsIgnoreCase(o.optString("mac"))) continue;
            b.put(o);
        }
        try {
            b.put(new JSONObject().put("mac", mac.toUpperCase()).put("nombre", nombre == null ? "" : nombre).put("rol", rol));
        } catch (Exception ignored) {}
        prefs(c).edit().putString("asignados", b.toString()).apply();
    }

    static void quitar(Context c, String mac) {
        JSONArray a = lista(c), b = new JSONArray();
        for (int i = 0; i < a.length(); i++) {
            JSONObject o = a.optJSONObject(i);
            if (o != null && !mac.equalsIgnoreCase(o.optString("mac"))) b.put(o);
        }
        prefs(c).edit().putString("asignados", b.toString()).apply();
    }
}
