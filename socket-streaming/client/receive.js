'use strict'

const video = document.getElementById('video');

const mediaSource = new MediaSource();
video.src = window.URL.createObjectURL(mediaSource);

const sourceOpen = mediaSourceEvent => {
    const sourceBuffer = mediaSource.addSourceBuffer('video/webm;codecs=vp8');
    const socket = new WebSocket('ws://localhost:8080/ws/watch');
    socket.onopen = event => {
        console.log('Connected to stream');
    };
    socket.onmessage = async event => {
        console.log(event);
        const arrayBuffer = await event.data.arrayBuffer();
        sourceBuffer.appendBuffer(arrayBuffer);
    };
    socket.onclose = event => {
        mediaSource.endOfStream();
        console.log('Disconnected from stream');
    };
}

mediaSource.addEventListener('sourceopen', sourceOpen);
