package com.bicipro.app;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.os.Environment;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;
import java.io.File;
import java.io.FileNotFoundException;

public class BiciProContentProvider extends ContentProvider {
    public static final String AUTHORITY = "com.bicipro.app.fileprovider";
    public static final Uri CONTENT_URI = Uri.parse("content://" + AUTHORITY);

    @Override
    public boolean onCreate() {
        return true;
    }

    @Override
    public ParcelFileDescriptor openFile(Uri uri, String mode) throws FileNotFoundException {
        String path = uri.getPath();
        if (path == null) {
            throw new FileNotFoundException("URI vacía: " + uri);
        }

        File file = new File(path);
        if (!file.exists()) {
            File downloadDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            file = new File(downloadDir, file.getName());
        }

        if (!file.exists()) {
            throw new FileNotFoundException("Archivo GPX no encontrado: " + file.getAbsolutePath());
        }

        return ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY);
    }

    @Override
    public String getType(Uri uri) {
        return "application/gpx+xml";
    }

    @Override
    public Cursor query(Uri uri, String[] projection, String selection, String[] selectionArgs, String sortOrder) {
        MatrixCursor cursor = new MatrixCursor(new String[]{OpenableColumns.DISPLAY_NAME, OpenableColumns.SIZE});
        String path = uri.getPath();
        if (path != null) {
            File file = new File(path);
            if (!file.exists()) {
                File downloadDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                file = new File(downloadDir, file.getName());
            }
            if (file.exists()) {
                cursor.addRow(new Object[]{file.getName(), file.length()});
            }
        }
        return cursor;
    }

    @Override
    public Uri insert(Uri uri, ContentValues values) {
        return null;
    }

    @Override
    public int delete(Uri uri, String selection, String[] selectionArgs) {
        return 0;
    }

    @Override
    public int update(Uri uri, ContentValues values, String selection, String[] selectionArgs) {
        return 0;
    }
}
