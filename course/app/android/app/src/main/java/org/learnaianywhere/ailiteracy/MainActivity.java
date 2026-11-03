package org.learnaianywhere.ailiteracy;

import android.content.res.AssetFileDescriptor;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MainActivity extends BridgeActivity {

    private static final Pattern RANGE = Pattern.compile("bytes=(\\d*)-(\\d*)");

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(CoursePackPlugin.class);
        super.onCreate(savedInstanceState);
        if (CoursePackPlugin.isBundled()) {
            getBridge().setWebViewClient(new BridgeWebViewClient(getBridge()) {
                @Override
                public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                    WebResourceResponse video = serveVideo(request);
                    return video != null ? video : super.shouldInterceptRequest(view, request);
                }
            });
        }
    }

    /**
     * Answers requests for the course's videos in an app with the course inside. Capacitor's
     * own server ignores the byte range the WebView asks for when you drag the slider, and
     * sends the video from the start. Videos are stored uncompressed in the APK (noCompress
     * in build.gradle), so we can read just the bytes asked for, straight from the APK.
     * Anything else, or a video we can't open this way, goes to Capacitor as usual.
     */
    private WebResourceResponse serveVideo(WebResourceRequest request) {
        Uri url = request.getUrl();
        String path = url.getPath();
        if (path == null || !path.toLowerCase().endsWith(".mp4") || path.contains("..")) return null;
        if (!getBridge().getHost().equalsIgnoreCase(url.getHost())) return null;
        AssetFileDescriptor afd;
        try {
            afd = getAssets().openFd("public" + path);
        } catch (IOException e) {
            return null; // missing, or compressed after all
        }
        long total = afd.getLength();
        long start = 0, end = total - 1;
        String range = null;
        for (Map.Entry<String, String> h : request.getRequestHeaders().entrySet()) {
            if (h.getKey().equalsIgnoreCase("Range")) range = h.getValue();
        }
        Matcher m = range == null ? null : RANGE.matcher(range.trim());
        boolean partial = m != null && m.matches() && !(m.group(1).isEmpty() && m.group(2).isEmpty());
        if (partial) {
            if (m.group(1).isEmpty()) {
                start = Math.max(0, total - Long.parseLong(m.group(2))); // the last N bytes
            } else {
                start = Long.parseLong(m.group(1));
                if (!m.group(2).isEmpty()) end = Math.min(end, Long.parseLong(m.group(2)));
            }
        }
        Map<String, String> headers = new HashMap<>();
        headers.put("Accept-Ranges", "bytes");
        headers.put("Cache-Control", "no-cache");
        if (start > end) {
            close(afd);
            headers.put("Content-Range", "bytes */" + total);
            return new WebResourceResponse("video/mp4", null, 416, "Range Not Satisfiable", headers, null);
        }
        headers.put("Content-Length", String.valueOf(end - start + 1));
        if (partial) headers.put("Content-Range", "bytes " + start + "-" + end + "/" + total);
        try {
            InputStream body = new AssetRange(afd, start, end + 1);
            return new WebResourceResponse("video/mp4", null, partial ? 206 : 200, partial ? "Partial Content" : "OK", headers, body);
        } catch (IOException e) {
            close(afd);
            return null;
        }
    }

    private static void close(AssetFileDescriptor afd) {
        try {
            afd.close();
        } catch (IOException e) {
            // Nothing to do.
        }
    }

    /**
     * Bytes [from, to) of an asset. Reads by absolute position in the APK (the asset starts
     * at afd.getStartOffset()), so requests running at the same time don't disturb each other.
     */
    private static class AssetRange extends InputStream {

        private final InputStream owner;
        private final FileChannel channel;
        private long pos;
        private final long end;

        AssetRange(AssetFileDescriptor afd, long from, long to) throws IOException {
            owner = afd.createInputStream(); // closing it closes the file
            channel = ((java.io.FileInputStream) owner).getChannel();
            pos = afd.getStartOffset() + from;
            end = afd.getStartOffset() + to;
        }

        @Override
        public int read(byte[] b, int off, int len) throws IOException {
            if (pos >= end) return -1;
            int n = channel.read(ByteBuffer.wrap(b, off, (int) Math.min(len, end - pos)), pos);
            if (n <= 0) return -1;
            pos += n;
            return n;
        }

        @Override
        public int read() throws IOException {
            byte[] one = new byte[1];
            return read(one, 0, 1) == 1 ? one[0] & 0xff : -1;
        }

        @Override
        public int available() {
            return (int) Math.min(Integer.MAX_VALUE, end - pos);
        }

        @Override
        public void close() throws IOException {
            owner.close();
        }
    }
}
