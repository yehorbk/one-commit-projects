package com.streamflow.test;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;

public class SocketWatchHandler extends BinaryWebSocketHandler {

    @Override
    public void afterConnectionEstablished(WebSocketSession session)
            throws Exception {
        StreamStorage.appendWatcher(session);
        System.out.println("Watcher connected");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session,
            CloseStatus status) throws Exception {
        StreamStorage.removeWatcher(session);
        System.out.println("Watcher disconnected");
    }
    
}
