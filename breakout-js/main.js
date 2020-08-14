'use strict';

const canvas = document.getElementById('canvas');
const score = document.getElementById('score');
const lives = document.getElementById('lives');
const context = canvas.getContext('2d');

const random = (min, max) => () =>
  Math.floor(Math.random() * (max - min) + min);

const player = {
  color: 'grey',
  width: 64,
  height: 8,
  posX: -1,
  posY: -1,
};

const barrier = {
  color: 'grey',
  width: 24,
  height: 12,
  posX: -1,
  posY: -1,
  indentX: 4,
  indentY: 4,
};

const ball = {
  color: 'grey',
  width: 8,
  height: 8,
  posX: -1,
  posY: -1,
  stepX: 0,
  stepY: 0,
};

const makeBarrierCopy = () => Object.assign({}, barrier);

const barrierList = [];

const clearField = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

const increaseScore = () => {
  score.innerText = Number(score.innerText) + 100;
};

const reduceLives = () => {
  const livesCount = Number(lives.innerText);
  if (livesCount === 0) {
    loadGame();
  } else {
    lives.innerText = livesCount - 1;
    prepareBall();
    preparePlayer();
  }
};

const draw = object => {
  context.fillStyle = object.color;
  context.fillRect(object.posX, object.posY, object.width, object.height);
};

const prepareScore = () => {
  score.innerText = 0;
};

const prepareLives = () => {
  lives.innerText = 3;
};

const prepareField = () => {
  canvas.style.background = 'black';
};

const prepareBarrier = () => {
  barrierList.splice(0, barrierList.length);
  const countX = canvas.width / (barrier.width + barrier.indentX + 1);
  const countY = canvas.height / 2 / (barrier.width + barrier.indentY);
  const defaultPosX = barrier.indentX * 1.5;
  const defaultPosY = canvas.height / 8;
  for (let i = 0; i < countY; i++) {
    for (let j = 0; j < countX; j++) {
      const barrierUnit = makeBarrierCopy();
      barrierUnit.posX = defaultPosX + (barrier.width * j) +
        barrier.indentX * j;
      barrierUnit.posY = defaultPosY + (barrier.height * i) +
        barrier.indentY * i;
      barrierList.push(barrierUnit);
    }
  }
};

const preparePlayer = () => {
  player.posX = canvas.width / 2 - player.width / 2;
  player.posY = canvas.height - player.height * 2;
};

const prepareBall = () => {
  const directionRandom = random(0, 2);
  ball.posX = random(0, canvas.width)();
  ball.posY = canvas.height / 2;
  ball.stepX = directionRandom() === 0 ? -1 : 1;
  ball.stepY = -1;
};

const loadGame = () => {
  prepareScore();
  prepareLives();
  prepareField();
  prepareBarrier();
  preparePlayer();
  prepareBall();
};

const spawnBarrier = () => {
  for (const barrierUnit of barrierList) {
    draw(barrierUnit);
  }
};

const checkIsGameEnded = () => {
  if (barrierList.length === 0) {
    loadGame();
    alert('Congratulations!');
  }
};

const destroyBarrierUnit = object => {
  const index = barrierList.indexOf(object);
  barrierList.splice(index, 1);
  checkIsGameEnded();
};

const movePlayer = direction => {
  const position = player.posX + (!direction ? 10 : -10);
  if (position >= 0 && position <= (canvas.width - player.width)) {
    player.posX = position;
  }
};

const moveBall = () => {
  ball.posX -= ball.stepX;
  ball.posY -= ball.stepY;
};

const ballCollisionRecongizer = () => {
  const playerCollisionX = (ball.posX >= player.posX &&
    ball.posX <= (player.posX + player.width));
  const playerCollisionY = ((ball.posY + ball.height) === player.posY);
  const borderCollisionX = (ball.posX <= 0 ||
    (ball.posX + ball.width) >= canvas.width);
  const borderCollisionY = (ball.posY <= 0);
  const barrierCollision = (() => {
    for (const barrierUnit of barrierList) {
      const barrierCollisionX = (ball.posX >= barrierUnit.posX &&
        ball.posX <= (barrierUnit.posX + barrier.width));
      const barrierCollisionY = (ball.posY <=
        (barrierUnit.posY + barrierUnit.height)) &&
        (ball.posY + ball.height) >= barrierUnit.posY;
      if (barrierCollisionX && barrierCollisionY) {
        destroyBarrierUnit(barrierUnit);
        increaseScore();
        return true;
      }
    }
    return false;
  })();
  if ((playerCollisionX && playerCollisionY) ||
    borderCollisionY || barrierCollision) {
    ball.stepY = -ball.stepY;
  }
  if (borderCollisionX) {
    ball.stepX = -ball.stepX;
  }
  if (ball.posY >= canvas.height) {
    reduceLives();
  }
};

const keyEventListener = event => {
  switch (event.keyCode) {
    case 37: // left
      movePlayer(true);
      break;
    case 39: // right
      movePlayer(false);
      break;
  }
};

const reloadFrame = () => {
  clearField();
  spawnBarrier();
  draw(player);
  draw(ball);
  moveBall();
  ballCollisionRecongizer();
};

loadGame();
setInterval(reloadFrame, 10);
addEventListener('keydown', keyEventListener);
