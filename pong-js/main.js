const canvas = document.getElementById('canvas');
const playerScore = document.getElementById('player-score');
const enemyScore = document.getElementById('enemy-score');
const context = canvas.getContext('2d');

const random = (min, max) => () =>
  Math.floor(Math.random() * (max - min) + min);

const border = {
  color: 'grey',
  width: canvas.width,
  height: 4,
  posX: 0,
  posY: -1,
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

const player = {
  color: 'grey',
  width: 8,
  height: 32,
  posX: -1,
  posY: -1,
};

const enemy = {
  color: 'grey',
  width: 8,
  height: 32,
  posX: -1,
  posY: -1,
};

const increasePlayerScore = () => {
  playerScore.innerText = Number(playerScore.innerText) + 1;
};

const increaseEnemyScore = () => {
  enemyScore.innerText = Number(enemyScore.innerText) + 1;
};

const clearField = () => {
  context.clearRect(0, border.height, canvas.width,
    canvas.height - border.height * 2);
};

const prepareField = () => {
  canvas.style.background = 'black';
  context.fillStyle = border.color;
  context.fillRect(border.posX, 0, border.width, border.height);
  context.fillRect(border.posX, canvas.height - border.height,
    border.width, border.height);
};

const spawnBall = () => {
  const directionRandom = random(-8, 8);
  ball.posX = canvas.width / 2 - ball.width / 2;
  ball.posY = canvas.height / 2 - ball.height / 2;
  ball.stepX = directionRandom();
  ball.stepY = directionRandom();
};

const spawnParticipants = () => {
  player.posX = player.width;
  player.posY = canvas.height / 2 - player.height / 2;
  enemy.posX = canvas.width - enemy.width * 2;
  enemy.posY = canvas.height / 2 - player.height / 2;
};

const moveBall = () => {
  ball.posX -= ball.stepX;
  ball.posY -= ball.stepY;
};

const ballCollisionRecognizer = () => {
  const playerCollisionX = (ball.posX === player.posX + player.width);
  const playerCollisionY = (ball.posY >= player.posY &&
    ball.posY <= player.posY + player.height);
  const enemyCollisionX = (ball.posX === enemy.posX - ball.width);
  const enemyCollisionY = (ball.posY >= enemy.posY &&
    ball.posY <= enemy.posY + enemy.height);
  if ((playerCollisionX && playerCollisionY) ||
    (enemyCollisionX && enemyCollisionY)) {
    ball.stepX = -ball.stepX;
  }
  if (ball.posX <= 0) {
    increaseEnemyScore();
    spawnBall();
    spawnParticipants();
  }
  if (ball.posX >= canvas.width - ball.width) {
    increasePlayerScore();
    spawnBall();
    spawnParticipants();
  }
  if (ball.posY <= border.height ||
    ball.posY >= canvas.height - ball.height - border.height) {
    ball.stepY = -ball.stepY;
  }
};

const movePlayer = state => {
  const position = player.posY + (!state ? ball.height : -ball.height);
  if (position >= 0 && position <= canvas.height - player.height) {
    player.posY = position;
  }
};

const moveEnemy = () => {
  const position = enemy.posY +
    (!(enemy.posY + enemy.height / 2 > ball.posY) ?
      ball.height :
      -ball.height);
  if (position >= 0 && position <= canvas.height - enemy.height) {
    enemy.posY = position;
  }
};

const draw = object => {
  context.fillStyle = object.color;
  context.fillRect(object.posX, object.posY, object.width, object.height);
};

const keyEventListener = event => {
  switch (event.keyCode) {
    case 38: // up
      movePlayer(true);
      break;
    case 40: // down
      movePlayer(false);
      break;
  }
};

const reloadFrame = () => {
  clearField();
  moveBall();
  ballCollisionRecognizer();
  draw(ball);
  draw(player);
  moveEnemy();
  draw(enemy);
};

prepareField();
spawnBall();
spawnParticipants();
setInterval(reloadFrame, 160);
addEventListener('keydown', keyEventListener);
