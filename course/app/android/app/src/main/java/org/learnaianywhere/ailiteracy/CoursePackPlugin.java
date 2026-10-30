package org.learnaianywhere.ailiteracy;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.net.Uri;
import androidx.core.content.FileProvider;
import androidx.core.content.pm.PackageInfoCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.RandomAccessFile;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.util.Enumeration;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

/**
 * Downloads one language's offline course package (the same zip the website offers),
 * checks its fingerprint, unzips it into the app's own storage and serves its START HERE
 * page as the app. The setup screens in www/ call it; the course page calls openShell and
 * openFile when it runs inside the app.
 *
 * When the app opens it also checks, in the background, for a newer course version
 * (downloads.json on the course-latest release) and a newer APK (app.json on app-latest),
 * at the addresses in capacitor.config.json; getLatest reports what it found, and
 * installApp downloads a newer APK and hands it to Android's installer.
 *
 * Files: downloads/<package>-v<version>.zip(.part) while downloading, then
 * courses/<package>-v<version>/ with the package's files and an index.html copy of
 * START HERE.html (the app loads index.html). Only the installed course is kept.
 */
@CapacitorPlugin(name = "CoursePack")
public class CoursePackPlugin extends Plugin {

    private static final String PREFS = "coursepack";
    private static final String SHELL_ASSETS = "public";
    // Unzipped files plus the zip itself, before the zip is deleted.
    private static final double SPACE_FACTOR = 2.2;

    private final ExecutorService worker = Executors.newSingleThreadExecutor();
    private final ExecutorService checker = Executors.newSingleThreadExecutor();
    private volatile boolean cancelled = false;
    private volatile boolean busy = false;
    private String pendingScreen = null;
    private long lastEvent = 0;
    // What the update check found: the newest course list and the newest APK's details.
    private Future<JSObject> latest;

    @Override
    public void load() {
        latest = checker.submit(this::checkLatest);
    }

    private SharedPreferences prefs() {
        return getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    private File installedDir() {
        String dir = prefs().getString("dir", null);
        if (dir == null) return null;
        File f = new File(dir);
        return new File(f, "index.html").isFile() ? f : null;
    }

    /** What is installed, and which setup screen the course page asked for, if any. */
    @PluginMethod
    public void getState(PluginCall call) {
        JSObject ret = new JSObject();
        File dir = installedDir();
        if (dir != null) {
            JSObject installed = new JSObject();
            installed.put("id", prefs().getString("id", ""));
            installed.put("version", prefs().getString("version", ""));
            installed.put("lang", prefs().getString("lang", ""));
            ret.put("installed", installed);
        }
        ret.put("screen", pendingScreen);
        ret.put("busy", busy);
        pendingScreen = null;
        call.resolve(ret);
    }

    /** Downloads, checks and unzips a package. Sends "progress" events while it works. */
    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    public void download(PluginCall call) {
        String url = call.getString("url");
        String sha256 = call.getString("sha256");
        String id = call.getString("id");
        String version = call.getString("version");
        String lang = call.getString("lang", "");
        Double bytesD = call.getDouble("bytes");
        if (url == null || sha256 == null || id == null || version == null || bytesD == null) {
            call.reject("Missing url, sha256, id, version or bytes", "badInput");
            return;
        }
        if (busy) {
            call.reject("A download is already running", "busy");
            return;
        }
        long bytes = bytesD.longValue();
        busy = true;
        cancelled = false;
        worker.execute(() -> {
            try {
                File dir = install(url, sha256.toLowerCase(), id, version, lang, bytes);
                JSObject ret = new JSObject();
                ret.put("dir", dir.getAbsolutePath());
                call.resolve(ret);
            } catch (CancelledException e) {
                call.reject("Cancelled", "cancelled");
            } catch (NoSpaceException e) {
                JSObject data = new JSObject();
                data.put("neededMb", e.neededMb);
                call.reject("Not enough space", "noSpace", data);
            } catch (BadFileException e) {
                call.reject(e.getMessage(), "badFile");
            } catch (Exception e) {
                call.reject(String.valueOf(e.getMessage()), "network");
            } finally {
                busy = false;
            }
        });
    }

    /**
     * The result of the update check started when the app opened: "course" is the newest
     * downloads.json and "app" the newest APK's app.json, when they could be read, and
     * "appVersionCode" this APK's version. Waits for the check up to "waitMs".
     */
    @PluginMethod
    public void getLatest(PluginCall call) {
        int waitMs = call.getInt("waitMs", 0);
        new Thread(() -> {
            JSObject ret = new JSObject();
            try {
                ret = latest.get(waitMs, TimeUnit.MILLISECONDS);
            } catch (Exception e) {
                // Offline, slow or not published yet: no news is fine.
            }
            ret.put("appVersionCode", appVersionCode());
            call.resolve(ret);
        }).start();
    }

    /** Downloads a newer APK, checks it and hands it to Android's installer. */
    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    public void installApp(PluginCall call) {
        String url = call.getString("url");
        String sha256 = call.getString("sha256");
        Double bytesD = call.getDouble("bytes");
        Integer versionCode = call.getInt("versionCode");
        if (url == null || sha256 == null || bytesD == null || versionCode == null) {
            call.reject("Missing url, sha256, bytes or versionCode", "badInput");
            return;
        }
        if (busy) {
            call.reject("A download is already running", "busy");
            return;
        }
        busy = true;
        cancelled = false;
        worker.execute(() -> {
            try {
                File dir = new File(getContext().getCacheDir(), "apk");
                dir.mkdirs();
                File apk = new File(dir, "ai-literacy-" + versionCode + ".apk");
                File part = new File(dir, apk.getName() + ".part");
                deleteChildrenExcept(dir, apk.getName(), part.getName());
                if (!apk.isFile()) {
                    fetch(url, part, bytesD.longValue());
                    if (!part.renameTo(apk)) throw new IOException("Could not save the download");
                }
                progress("verify", 0, 1);
                if (!sha256Of(apk).equals(sha256.toLowerCase())) {
                    apk.delete();
                    throw new BadFileException("The download was damaged. Please try again.");
                }
                Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", apk);
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setDataAndType(uri, "application/vnd.android.package-archive");
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(intent);
                call.resolve();
            } catch (CancelledException e) {
                call.reject("Cancelled", "cancelled");
            } catch (BadFileException e) {
                call.reject(e.getMessage(), "badFile");
            } catch (Exception e) {
                call.reject(String.valueOf(e.getMessage()), "network");
            } finally {
                busy = false;
            }
        });
    }

    /** Stops a running download. The part already downloaded is kept, to continue later. */
    @PluginMethod
    public void cancel(PluginCall call) {
        cancelled = true;
        call.resolve();
    }

    /** Shows the installed course (its index.html) as the app. */
    @PluginMethod
    public void openCourse(PluginCall call) {
        File dir = installedDir();
        if (dir == null) {
            call.reject("No course installed", "notInstalled");
            return;
        }
        call.resolve();
        getBridge().setServerBasePath(dir.getAbsolutePath());
    }

    /** Goes back to the setup screens, optionally straight to one of them ("settings"). */
    @PluginMethod
    public void openShell(PluginCall call) {
        pendingScreen = call.getString("screen");
        call.resolve();
        getBridge().setServerAssetPath(SHELL_ASSETS);
    }

    /** Opens a file of the installed course, such as a PDF, in another app on the phone. */
    @PluginMethod
    public void openFile(PluginCall call) {
        File dir = installedDir();
        String path = call.getString("path");
        String type = call.getString("type", "application/pdf");
        if (dir == null || path == null) {
            call.reject("No course installed", "notInstalled");
            return;
        }
        try {
            File file = new File(dir, path).getCanonicalFile();
            if (!file.getPath().startsWith(dir.getCanonicalPath() + File.separator) || !file.isFile()) {
                call.reject("File not found", "notFound");
                return;
            }
            Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", file);
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(uri, type);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            call.resolve();
        } catch (ActivityNotFoundException e) {
            call.reject("No app on this phone opens this file", "noViewer");
        } catch (IOException e) {
            call.reject(String.valueOf(e.getMessage()), "notFound");
        }
    }

    // ---------- Work ----------

    /** Reads the newest course list and APK details from the addresses in capacitor.config.json. */
    private JSObject checkLatest() {
        JSObject ret = new JSObject();
        String courseUrl = getConfig().getString("courseLatestUrl", null);
        String appUrl = getConfig().getString("appLatestUrl", null);
        try {
            if (courseUrl != null) ret.put("course", new JSObject(fetchText(courseUrl)));
        } catch (Exception e) {
            // Offline or not published: keep the list that came with the app.
        }
        try {
            if (appUrl != null) ret.put("app", new JSObject(fetchText(appUrl)));
        } catch (Exception e) {
            // Offline or no app release yet.
        }
        return ret;
    }

    private long appVersionCode() {
        try {
            PackageInfo info = getContext().getPackageManager().getPackageInfo(getContext().getPackageName(), 0);
            return PackageInfoCompat.getLongVersionCode(info);
        } catch (Exception e) {
            return 0;
        }
    }

    private static String fetchText(String url) throws IOException {
        HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(10000);
        try {
            if (conn.getResponseCode() != 200) throw new IOException("Server answered " + conn.getResponseCode());
            try (InputStream in = conn.getInputStream(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                pipe(in, out);
                return out.toString("UTF-8");
            }
        } finally {
            conn.disconnect();
        }
    }

    private File install(String url, String sha256, String id, String version, String lang, long bytes) throws Exception {
        File root = getContext().getFilesDir();
        File downloads = new File(root, "downloads");
        File courses = new File(root, "courses");
        downloads.mkdirs();
        courses.mkdirs();
        String name = id + "-v" + version;
        File zip = new File(downloads, name + ".zip");
        File part = new File(downloads, name + ".zip.part");

        // Partial downloads of other packages would only take up space.
        deleteChildrenExcept(downloads, zip.getName(), part.getName());

        long have = zip.isFile() ? zip.length() : part.isFile() ? part.length() : 0;
        long needed = (long) (bytes * SPACE_FACTOR) - have;
        if (root.getUsableSpace() < needed) throw new NoSpaceException(Math.round(needed / 1e6));

        if (!zip.isFile()) {
            fetch(url, part, bytes);
            if (!part.renameTo(zip)) throw new IOException("Could not save the download");
        }

        progress("verify", 0, 1);
        String actual = sha256Of(zip);
        if (!actual.equals(sha256)) {
            zip.delete();
            throw new BadFileException("The download was damaged. Please try again.");
        }

        File target = new File(courses, name);
        File tmp = new File(courses, name + ".tmp");
        deleteTree(tmp);
        unzip(zip, tmp);
        File start = new File(tmp, "START HERE.html");
        if (!start.isFile()) throw new BadFileException("START HERE.html is missing from the package");
        copy(start, new File(tmp, "index.html"));
        deleteTree(target);
        if (!tmp.renameTo(target)) throw new IOException("Could not finish unpacking");
        zip.delete();

        prefs().edit().putString("id", id).putString("version", version).putString("lang", lang).putString("dir", target.getAbsolutePath()).apply();
        deleteChildrenExcept(courses, target.getName());
        progress("done", 1, 1);
        return target;
    }

    private void fetch(String url, File part, long total) throws Exception {
        int attempts = 0;
        while (true) {
            checkCancelled();
            long have = part.isFile() ? part.length() : 0;
            if (total > 0 && have >= total) return;
            HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
            conn.setConnectTimeout(20000);
            conn.setReadTimeout(30000);
            if (have > 0) conn.setRequestProperty("Range", "bytes=" + have + "-");
            try {
                int code = conn.getResponseCode();
                if (code == 416) return; // already complete
                boolean resume = code == 206;
                if (!resume && code != 200) throw new IOException("Server answered " + code);
                if (!resume) have = 0;
                try (InputStream in = conn.getInputStream(); RandomAccessFile out = new RandomAccessFile(part, "rw")) {
                    out.setLength(have);
                    out.seek(have);
                    byte[] buf = new byte[1 << 16];
                    int n;
                    while ((n = in.read(buf)) != -1) {
                        checkCancelled();
                        out.write(buf, 0, n);
                        have += n;
                        progress("download", have, total);
                    }
                }
                return;
            } catch (IOException e) {
                // A dropped connection: try again a few times, continuing from what we have.
                if (cancelled || ++attempts > 5) throw e;
                Thread.sleep(2000L * attempts);
            } finally {
                conn.disconnect();
            }
        }
    }

    private void unzip(File zip, File dest) throws Exception {
        dest.mkdirs();
        String destPath = dest.getCanonicalPath() + File.separator;
        try (ZipFile zf = new ZipFile(zip)) {
            int total = zf.size(), done = 0;
            Enumeration<? extends ZipEntry> entries = zf.entries();
            while (entries.hasMoreElements()) {
                checkCancelled();
                ZipEntry entry = entries.nextElement();
                done++;
                // Packages have one top folder ("AI Literacy for Everyone - English/"); drop it.
                String name = entry.getName().replace('\\', '/');
                int slash = name.indexOf('/');
                String rel = slash >= 0 ? name.substring(slash + 1) : name;
                if (rel.isEmpty()) continue;
                File out = new File(dest, rel).getCanonicalFile();
                if (!out.getPath().startsWith(destPath)) throw new BadFileException("Unsafe path in the package: " + name);
                if (entry.isDirectory()) {
                    out.mkdirs();
                } else {
                    out.getParentFile().mkdirs();
                    try (InputStream in = zf.getInputStream(entry); OutputStream os = new FileOutputStream(out)) {
                        pipe(in, os);
                    }
                }
                progress("unpack", done, total);
            }
        }
    }

    private String sha256Of(File f) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        long total = f.length(), done = 0;
        try (InputStream in = new FileInputStream(f)) {
            byte[] buf = new byte[1 << 20];
            int n;
            while ((n = in.read(buf)) != -1) {
                md.update(buf, 0, n);
                done += n;
                progress("verify", done, total);
            }
        }
        StringBuilder sb = new StringBuilder();
        for (byte b : md.digest()) sb.append(String.format("%02x", b));
        return sb.toString();
    }

    private void progress(String phase, long done, long total) {
        long now = System.currentTimeMillis();
        if (done < total && now - lastEvent < 200) return;
        lastEvent = now;
        JSObject data = new JSObject();
        data.put("phase", phase);
        data.put("done", done);
        data.put("total", total);
        notifyListeners("progress", data);
    }

    private void checkCancelled() throws CancelledException {
        if (cancelled) throw new CancelledException();
    }

    private static void pipe(InputStream in, OutputStream out) throws IOException {
        byte[] buf = new byte[1 << 16];
        int n;
        while ((n = in.read(buf)) != -1) out.write(buf, 0, n);
    }

    private static void copy(File from, File to) throws IOException {
        try (InputStream in = new FileInputStream(from); OutputStream out = new FileOutputStream(to)) {
            pipe(in, out);
        }
    }

    private static void deleteChildrenExcept(File dir, String... keep) {
        File[] children = dir.listFiles();
        if (children == null) return;
        outer:
        for (File c : children) {
            for (String k : keep) if (c.getName().equals(k)) continue outer;
            deleteTree(c);
        }
    }

    private static void deleteTree(File f) {
        if (f.isDirectory()) {
            File[] children = f.listFiles();
            if (children != null) for (File c : children) deleteTree(c);
        }
        f.delete();
    }

    private static class CancelledException extends Exception {}

    private static class BadFileException extends Exception {

        BadFileException(String message) {
            super(message);
        }
    }

    private static class NoSpaceException extends Exception {

        final long neededMb;

        NoSpaceException(long neededMb) {
            this.neededMb = neededMb;
        }
    }
}
