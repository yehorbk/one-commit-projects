'use strict';

const canvas = document.getElementById('canvas');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');

const ctx = canvas.getContext('2d');

const FPS = (frames, x = -1, y = -1, size = 0, context = null) =>
    ({ frames, context });

const FPSCompetitors = [
    FPS(24),
    FPS(30),
    FPS(60),
    FPS(120),
];

const start = () => {
    const figureSize = (canvas.height - FPSCompetitors.length * 2 * 40) /
        FPSCompetitors.length;
    const calculateInterval = frames => 1000 / frames;
    let position = figureSize;
    const FPSInterval = competitor => () => {
        ctx.clearRect(
            competitor.x - competitor.size / 2 - 20,
            competitor.y - competitor.size / 2 - 20,
            competitor.size + 40,
            competitor.size + 40,
        );
        competitor.x = position;
        ctx.beginPath();
        ctx.arc(
            competitor.x,
            competitor.y,
            competitor.size / 2,
            0,
            2 * Math.PI,
        );
        ctx.stroke();
    };
    for (let i = 0; i < FPSCompetitors.length; i++) {
        const entry = FPSCompetitors[i];
        entry.y = 20 + (figureSize + 40) * i + figureSize;
        entry.size = figureSize;
        entry.context = setInterval(
            FPSInterval(entry),
            calculateInterval(entry.frames),
        );
    }
    console.log(position);
    console.log(figureSize);
    console.log(FPSCompetitors);
    const counter = setInterval(() => {
        position = position + 1;
        if (position + figureSize >= canvas.width) {
            clearInterval(counter);
        }
    }, 1);
};

const reset = () => {
    for (const entry of FPSCompetitors) {
        clearInterval(entry.context);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
startButton.addEventListener('click', start);
resetButton.addEventListener('click', reset);
