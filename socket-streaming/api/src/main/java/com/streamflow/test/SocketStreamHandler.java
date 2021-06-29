package com.streamflow.test;

import java.nio.ByteBuffer;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;

@Component
public class SocketStreamHandler extends BinaryWebSocketHandler {

    @Override
    protected void handleBinaryMessage(WebSocketSession session,
            BinaryMessage message) throws Exception {
        ByteBuffer data = message.getPayload();
        StreamStorage.putData(data);
        System.out.println("Message size: " + message.getPayloadLength());
    }
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session)
            throws Exception {
        StreamStorage.setStreamer(session);
        System.out.println("Streamer connected");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session,
            CloseStatus status) throws Exception {
        StreamStorage.removeStreamer();
        System.out.println("Streamer disconnected");
    }

}
