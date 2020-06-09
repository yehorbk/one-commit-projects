const ctx = document.getElementById('canvas').getContext('2d');
const coefficient = 10;

const drawer = (isDraw = true) => {
    if(!isDraw) {
        //ctx.fill();
    }
    let time = 0;
    let value = 0;
    ctx.beginPath();
    ctx.moveTo(time, value);
    return () => {
        value = Math.random() * 200;
        time += 1;
        ctx.lineTo(time * 1 * coefficient, value);
        console.log(time, value);
        ctx.stroke();
    }
}

const draw = drawer();

const interval = setInterval(draw, 10 * coefficient);
const timeout = setTimeout(() => {
    clearInterval(interval);
    drawer(false);
}, 10000);
