package com.streamflow.test;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.WebSocketSession;

public class StreamStorage {
    
    private static WebSocketSession streamer;
    private static List<WebSocketSession> watchers;
    
    static {
        StreamStorage.watchers = new CopyOnWriteArrayList<>();
    }
    
    public static void setStreamer(WebSocketSession streamer) {
        StreamStorage.streamer = streamer;
    }
    
    public static void removeStreamer() {
        StreamStorage.streamer = null;
    }
    
    public static void appendWatcher(WebSocketSession watcher) {
        watchers.add(watcher);
    }
    
    public static void removeWatcher(WebSocketSession watcher) {
        watchers.remove(watcher);
    }
    
    public static void putData(ByteBuffer data) throws IOException {
        BinaryMessage streamMessage = new BinaryMessage(data);
        for (WebSocketSession watcher : watchers) {
            watcher.sendMessage(streamMessage);
        }
    }
    
}
