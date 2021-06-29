package com.streamflow.test;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    
    @Bean
    public ServletServerContainerFactoryBean createServletContainerFactoryBean() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
        container.setMaxTextMessageBufferSize(16 * 1024 * 1024);
        container.setMaxBinaryMessageBufferSize(16 * 1024 * 1024);
        return container;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry wshr) {
        wshr.addHandler(new SocketStreamHandler(), "/ws/stream")
                .setAllowedOrigins("*")
                .addHandler(new SocketWatchHandler(), "/ws/watch")
                .setAllowedOrigins("*");
    }
    
}
