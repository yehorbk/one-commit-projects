const canvas = document.getElementById('canvas');
const score = document.getElementById('score');
const context = canvas.getContext('2d');

const random = (min, max) => () => Math.floor(Math.random() * (max - min) + min);

const directionState = {
  LEFT: '00',
  UP: '01',
  RIGHT: '10',
  DOWN: '11',
};

const player = {
  color: '#33cc33',
  size: 16,
  posX: -1,
  posY: -1,
  tail: [],
  // speed: 1,
  direction: '',
  stepX: -1,
  stepY: -1,
};

const snack = {
  color: '#5933cc',
  size: 8,
  posX: -1,
  posY: -1,
};

const clearField = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

const updateScore = value => {
  score.innerText = Number(score.innerText) + value;
};

const appendTail = () => {
  const tailSection = {
    posX: player.posX,
    posY: player.posY,
  };
  player.tail.push(tailSection);
};

/*const increaseSpeed = () => {
  player.speed += 0.1;
};*/

const changeDirection = direction => {
  switch (direction) {
    case directionState.LEFT:
      if (player.direction != directionState.RIGHT) {
        //player.stepX = player.speed * -1;
        player.stepX = player.size * -1;
        player.stepY = 0;
        player.direction = direction;
      }
      break;
    case directionState.UP:
      if (player.direction != directionState.DOWN) {
        player.stepX = 0;
        //player.stepY = player.speed * -1;
        player.stepY = player.size * -1;
        player.direction = direction;
      }
      break;
    case directionState.RIGHT:
      if (player.direction != directionState.LEFT) {
        //player.stepX = player.speed;
        player.stepX = player.size;
        player.stepY = 0;
        player.direction = direction;
      }
      break;
    case directionState.DOWN:
      if (player.direction != directionState.UP) {
        player.stepX = 0;
        //player.stepY = player.speed;
        player.stepY = player.size;
        player.direction = direction;
      }
      break;
  }
};

const move = () => {
  if (player.tail.length > 0) {
    for (let i = player.tail.length - 1; i > 0; i--) {
      player.tail[i].posX = player.tail[i - 1].posX;
      player.tail[i].posY = player.tail[i - 1].posY;
    }
    player.tail[0].posX = player.posX;
    player.tail[0].posY = player.posY;
  }
  player.posX += player.stepX;
  player.posY += player.stepY;
  if (player.posX > canvas.width - player.size) {
    player.posX = 0;
  } else if (player.posX < 0) {
    player.posX = canvas.width;
  }
  if (player.posY > canvas.height - player.size) {
    player.posY = 0;
  } else if (player.posY < 0) {
    player.posY = canvas.height;
  }
};

const selfCollisionRecognizer = () => {
  for (const tailSection of player.tail) {
    if (tailSection.posX === player.posX && tailSection.posY === player.posY) {
      player.tail = [];
      score.innerText = 0;
    }
  }
};

const draw = () => {
  context.fillStyle = player.color;
  context.fillRect(player.posX, player.posY, player.size, player.size);
  for (let i = 0; i < player.tail.length; i++) {
    context.fillRect(player.tail[i].posX, player.tail[i].posY, player.size, player.size);
  }
};

const spawnSnack = (isGenerate = false) => {
  if (isGenerate) {
    const snackRandom = random(0, canvas.width - snack.size);
    snack.posX = snackRandom();
    snack.posY = snackRandom();
  }
  context.fillStyle = snack.color;
  context.fillRect(snack.posX, snack.posY, snack.size, snack.size);
};

const snackRecognizer = () => {
  const collisionX = (snack.posX > player.posX &&
    snack.posX < player.posX + player.size) ||
    (snack.posX + snack.size > player.posX &&
      snack.posX + snack.size < player.posX + player.size);
  const collisionY = (snack.posY > player.posY &&
    snack.posY < player.posY + player.size) ||
    (snack.posY + snack.size > player.posY &&
      snack.posY + snack.size < player.posY + player.size);
  if (collisionX && collisionY) {
    // increaseSpeed();
    appendTail();
    updateScore(100);
    spawnSnack(true);
  }
}

const prepareField = () => {
  canvas.style.backgroundColor = 'black';
  spawnSnack(true);
};

const preparePlayer = () => {
  const snakeRandom = random(0, canvas.width - player.size);
  player.posX = snakeRandom();
  player.posY = snakeRandom();
  const directionRandom = random(0, 2);
  changeDirection(directionRandom() + '' + directionRandom());
};

const keyEventListener = event => {
  switch (event.keyCode) {
    case 37: // left
      changeDirection(directionState.LEFT);
      break;
    case 38: // up
      changeDirection(directionState.UP);
      break;
    case 39: // right
      changeDirection(directionState.RIGHT);
      break;
    case 40: // down
      changeDirection(directionState.DOWN);
      break;
  }
};

const reloadFrame = () => {
  clearField();
  spawnSnack();
  snackRecognizer();
  move();
  selfCollisionRecognizer();
  draw();
};

prepareField();
preparePlayer();
setInterval(reloadFrame, player.size * 10);
addEventListener('keydown', keyEventListener);
