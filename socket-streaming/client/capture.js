'use strict'

const startButton = document.getElementById('start');
const videoField = document.getElementById('video');

const startCapture = async displayMediaOptions => {
    let captureStream = null;
    try {
      captureStream = await navigator.mediaDevices
        .getDisplayMedia(displayMediaOptions);
    } catch(err) {
      console.error("Error: " + err);
    }
    return captureStream;
}

const sendToServer = async stream => {
    const options = {
        mimeType: 'video/webm;codecs=vp8'
    };
    const mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
            socket.send(event.data);
            console.log(event.data);
        }
    }
    const socket = new WebSocket('ws://localhost:8080/ws/stream');
    socket.binaryType = "blob";
    socket.onopen = event => {
        mediaRecorder.start(100);
        console.log('Connected to server');
    }
    socket.onclose = event => {
        mediaRecorder.stop();
        videoField.srcObject = null;
        console.log('Disconnected from server');
        console.log(event);
    }
};

startButton.addEventListener('click', async () => {
    const options = {
        video: {
            cursor: "always"
        },
        audio: false
    };
    const mediaStream = await startCapture(options);
    videoField.srcObject = mediaStream;
    sendToServer(mediaStream);
});
