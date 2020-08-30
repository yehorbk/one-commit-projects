'use strict';

const drumsList = [
    {
        code: "small",
        sound: new Audio("assets/audio/small.wav"),
        key: 71
    },
    {
        code: "bass",
        sound: new Audio("assets/audio/bass.wav"),
        key: 72
    },
    {
        code: "hihat",
        sound: new Audio("assets/audio/hihat.mp3"),
        key: 74
    },
];

const getDrumsByKeyCode = keyCode => {
    var result = null;
    for (var item of drumsList) {
        if (item.key == keyCode) {
            result = item;
            break;
        }
    }
    return result;
};

document.onkeydown = event => {
    var drums = getDrumsByKeyCode(event.keyCode);
    drums.sound.play();
};

addEventListener("keydown", document);
