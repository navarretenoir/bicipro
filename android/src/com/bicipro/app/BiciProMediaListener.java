package com.bicipro.app;

import android.content.ComponentName;
import android.content.Context;
import android.graphics.Bitmap;
import android.media.MediaMetadata;
import android.media.session.MediaController;
import android.media.session.MediaSessionManager;
import android.media.session.PlaybackState;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.service.notification.NotificationListenerService;
import android.util.Base64;
import android.util.Log;
import android.view.KeyEvent;
import java.io.ByteArrayOutputStream;
import java.util.List;

public class BiciProMediaListener extends NotificationListenerService {

    private static final String TAG = "BiciProMedia";
    private static BiciProMediaListener instance;
    private MediaSessionManager sessionManager;
    private MediaController activeController;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    private final MediaController.Callback controllerCallback = new MediaController.Callback() {
        @Override
        public void onMetadataChanged(MediaMetadata metadata) {
            handleMetadata(metadata);
        }

        @Override
        public void onPlaybackStateChanged(PlaybackState state) {
            handlePlaybackState(state);
        }

        @Override
        public void onSessionDestroyed() {
            activeController = null;
            findActiveMediaSession();
        }
    };

    private final MediaSessionManager.OnActiveSessionsChangedListener sessionsChangedListener = 
            new MediaSessionManager.OnActiveSessionsChangedListener() {
        @Override
        public void onActiveSessionsChanged(List<MediaController> controllers) {
            updateFromControllers(controllers);
        }
    };

    public static BiciProMediaListener getInstance() {
        return instance;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        sessionManager = (MediaSessionManager) getSystemService(Context.MEDIA_SESSION_SERVICE);
    }

    @Override
    public void onListenerConnected() {
        super.onListenerConnected();
        instance = this;
        Log.i(TAG, "BiciProMediaListener conectado con éxito al sistema de sesiones");
        findActiveMediaSession();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (instance == this) instance = null;
        if (activeController != null) {
            try {
                activeController.unregisterCallback(controllerCallback);
            } catch (Exception ignored) {}
        }
    }

    public synchronized void findActiveMediaSession() {
        if (sessionManager == null) {
            sessionManager = (MediaSessionManager) getSystemService(Context.MEDIA_SESSION_SERVICE);
        }
        if (sessionManager == null) return;

        try {
            ComponentName comp = new ComponentName(this, BiciProMediaListener.class);
            List<MediaController> controllers = sessionManager.getActiveSessions(comp);
            updateFromControllers(controllers);
            try {
                sessionManager.removeOnActiveSessionsChangedListener(sessionsChangedListener);
            } catch (Exception ignored) {}
            sessionManager.addOnActiveSessionsChangedListener(sessionsChangedListener, comp, mainHandler);
        } catch (SecurityException e) {
            Log.w(TAG, "Permiso de escucha de notificaciones no activo aún: " + e.getMessage());
        } catch (Exception e) {
            Log.e(TAG, "Error buscando sesiones activas", e);
        }
    }

    /** Paquete del reproductor activo (para abrirlo desde la tarjeta Multimedia), o null. */
    public synchronized String getActivePackage() {
        return activeController != null ? activeController.getPackageName() : null;
    }

    private synchronized void updateFromControllers(List<MediaController> controllers) {
        if (controllers == null || controllers.isEmpty()) return;

        MediaController best = null;
        // Cualquier reproductor: primero el que está sonando, después el que está en pausa
        for (int estado : new int[]{PlaybackState.STATE_PLAYING, PlaybackState.STATE_PAUSED}) {
            for (MediaController mc : controllers) {
                PlaybackState ps = mc.getPlaybackState();
                if (best == null && ps != null && ps.getState() == estado) best = mc;
            }
        }
        if (best == null) best = controllers.get(0);

        if (activeController != null && !activeController.getSessionToken().equals(best.getSessionToken())) {
            try {
                activeController.unregisterCallback(controllerCallback);
            } catch (Exception ignored) {}
        }

        activeController = best;
        try {
            activeController.registerCallback(controllerCallback, mainHandler);
        } catch (Exception ignored) {}

        handleMetadata(activeController.getMetadata());
        handlePlaybackState(activeController.getPlaybackState());
    }

    private void handleMetadata(MediaMetadata metadata) {
        if (metadata == null) return;
        String title = metadata.getString(MediaMetadata.METADATA_KEY_TITLE);
        String artist = metadata.getString(MediaMetadata.METADATA_KEY_ARTIST);
        String album = metadata.getString(MediaMetadata.METADATA_KEY_ALBUM);

        if (title == null || title.trim().isEmpty()) {
            CharSequence displayTitle = metadata.getText(MediaMetadata.METADATA_KEY_DISPLAY_TITLE);
            if (displayTitle != null) title = displayTitle.toString();
        }

        Bitmap art = metadata.getBitmap(MediaMetadata.METADATA_KEY_ALBUM_ART);
        if (art == null) art = metadata.getBitmap(MediaMetadata.METADATA_KEY_ART);

        String coverBase64 = "";
        if (art != null) {
            try {
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                art.compress(Bitmap.CompressFormat.JPEG, 75, baos);
                coverBase64 = "data:image/jpeg;base64," + Base64.encodeToString(baos.toByteArray(), Base64.NO_WRAP);
            } catch (Exception ignored) {}
        }

        boolean isPlaying = false;
        if (activeController != null) {
            PlaybackState ps = activeController.getPlaybackState();
            if (ps != null) isPlaying = (ps.getState() == PlaybackState.STATE_PLAYING);
        }

        AdoBridge bridge = AdoBridge.getInstance();
        if (bridge != null && title != null && !title.trim().isEmpty()) {
            bridge.updateLiveMediaMetadata(title, (artist != null ? artist : ""), (album != null ? album : ""), isPlaying, coverBase64);
        }
    }

    private void handlePlaybackState(PlaybackState state) {
        if (state == null) return;
        boolean isPlaying = (state.getState() == PlaybackState.STATE_PLAYING);
        AdoBridge bridge = AdoBridge.getInstance();
        if (bridge != null) {
            bridge.updateLivePlaybackState(isPlaying);
        }
    }

    private long lastControlTime = 0;

    public synchronized boolean sendPlayPause() {
        long now = SystemClock.uptimeMillis();
        if (now - lastControlTime < 350) return true;
        lastControlTime = now;

        if (activeController == null) {
            findActiveMediaSession();
        }
        if (activeController != null) {
            try {
                PlaybackState state = activeController.getPlaybackState();
                if (state != null && state.getState() == PlaybackState.STATE_PLAYING) {
                    activeController.getTransportControls().pause();
                } else {
                    activeController.getTransportControls().play();
                }
                return true;
            } catch (Exception e) {
                Log.w(TAG, "Error enviando play/pause a activeController", e);
            }
        }
        return false;
    }

    public synchronized boolean sendNext() {
        long now = SystemClock.uptimeMillis();
        if (now - lastControlTime < 350) return true;
        lastControlTime = now;

        if (activeController == null) {
            findActiveMediaSession();
        }
        if (activeController != null) {
            try {
                activeController.getTransportControls().skipToNext();
                return true;
            } catch (Exception e) {
                Log.w(TAG, "Error enviando skipToNext a activeController", e);
            }
        }
        return false;
    }

    public synchronized boolean sendPrevious() {
        long now = SystemClock.uptimeMillis();
        if (now - lastControlTime < 350) return true;
        lastControlTime = now;

        if (activeController == null) {
            findActiveMediaSession();
        }
        if (activeController != null) {
            try {
                activeController.getTransportControls().skipToPrevious();
                return true;
            } catch (Exception e) {
                Log.w(TAG, "Error enviando skipToPrevious a activeController", e);
            }
        }
        return false;
    }
}
