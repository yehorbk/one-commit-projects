'use strict';

const canvas = document.getElementById('canvas');
const score = document.getElementById('score');
const lives = document.getElementById('lives');
const context = canvas.getContext('2d');

const random = (min, max) => () =>
  Math.floor(Math.random() * (max - min) + min);

const animationIntervals = {
  field: null,
  enemy: null,
};

const playerBulletAnimation = {
  interval: null,
  state: false,
};

const enemyBulletAnimation = {
  interval: null,
  state: false,
};

const player = {
  color: 'grey',
  posX: -1,
  posY: -1,
  width: 32,
  height: 8,
};

const barrier = {
  color: 'grey',
  posX: -1,
  posY: -1,
  width: 64,
  height: 32,
  indentX: 96,
  lives: 5,
};

const enemy = {
  color: 'grey',
  posX: -1,
  posY: -1,
  width: 24,
  height: 24,
  indentX: 8,
  indentY: 8,
  step: 0,
};

const copyObject = object => Object.assign({}, object);

const enemyList = [];
const barrierList = [];

const clearField = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

const increaseScore = () => {
  score.innerText = Number(score.innerText) + 100;
};

const reducePlayerLives = () => {
  const livesCount = Number(lives.innerText);
  if (livesCount === 0) {
    finishGame();
  } else {
    lives.innerText = livesCount - 1;
  }
};

const reduceBarrierUnitLives = barrierUnit => {
  barrierUnit.lives -= 1;
  if (barrierUnit.lives <= 0) {
    barrierList.splice(barrierList.indexOf(barrierUnit), 1);
  }
};

const draw = object => {
  context.fillStyle = object.color;
  context.fillRect(object.posX, object.posY,
    object.width, object.height);
};

const prepareScore = () => {
  score.innerText = 0;
};

const prepareLives = () => {
  lives.innerText = 3;
};

const preparePlayer = () => {
  player.posX = canvas.width / 2 - player.width / 2;
  player.posY = canvas.height - player.height * 2;
};

const prepareBarrier = () => {
  barrierList.splice(0, barrierList.length);
  const defaultPosX = canvas.width / 8;
  const defaultPosY = canvas.height - barrier.height * 3;
  const countX = (canvas.width - defaultPosX * 2) /
    (barrier.width + barrier.indentX + 1);
  for (let i = 0; i < countX; i++) {
    const barrierUnit = copyObject(barrier);
    barrierUnit.posX = defaultPosX + (barrier.width * i) +
      (barrier.indentX * i);
    barrierUnit.posY = defaultPosY;
    barrierList.push(barrierUnit);
  }
};

const prepareEnemies = () => {
  enemyList.splice(0, enemyList.length);
  const defaultPosX = enemy.width * 4;
  const defaultPosY = canvas.height / 6;
  const countX = (canvas.width - defaultPosX * 2) /
    (enemy.width + enemy.indentX + 1);
  const countY = canvas.height / 4 / (enemy.width + enemy.indentY);
  for (let i = 0; i < countY; i++) {
    for (let j = 0; j < countX; j++) {
      const enemyUnit = copyObject(enemy);
      enemyUnit.posX = defaultPosX + (enemy.width * j) +
        enemy.indentX * j;
      enemyUnit.posY = defaultPosY + (enemy.height * i) +
        enemy.indentY * i;
      enemyList.push(enemyUnit);
    }
  }
  enemy.step = 1;
};

const prepareGame = () => {
  prepareScore();
  prepareLives();
  preparePlayer();
  prepareBarrier();
  prepareEnemies();
};

const prepareIntervals = () => {
  for (const interval in animationIntervals) {
    clearInterval(animationIntervals[interval]);
  }
  animationIntervals.field = setInterval(fieldAnimation, 60);
  animationIntervals.enemy = setInterval(moveEnemy, 60);
};

const loadGame = () => {
  prepareGame();
  prepareIntervals();
};

const finishGame = state => {
  alert(`${state ? 'Congratulations!' : 'Failure!'}`);
  loadGame();
};

const checkIsEnemyDestroyed = () => {
  if (enemyList.length === 0) {
    finishGame(true);
  }
};

const spawnBarrier = () => {
  for (const barrierUnit of barrierList) {
    draw(barrierUnit);
  }
};

const spawnEnemies = () => {
  for (const enemyUnit of enemyList) {
    draw(enemyUnit);
  }
};

const destroyEnemyUnit = enemyUnit => {
  enemyList.splice(enemyList.indexOf(enemyUnit), 1);
  checkIsEnemyDestroyed();
};

const movePlayer = direction => {
  const position = player.posX + (!direction ? 8 : -8);
  if (position > 0 && position + player.width < canvas.width) {
    player.posX = position;
  }
};

const moveEnemy = () => {
  const moveDown = () => {
    for (const enemyUnit of enemyList) {
      enemyUnit.posY += enemy.height;
    }
  };
  const collisionRecognizer = () => {
    const firstEnemy = enemyList.reduce((current, next) =>
      (current.posX < next.posX) ? current : next);
    const lastEnemy = enemyList.reduce((current, next) =>
      (current.posX > next.posX) ? current : next);
    if (firstEnemy.posX <= 0 ||
      (lastEnemy.posX + enemy.width) >= canvas.width) {
      enemy.step *= -1;
      moveDown();
    }
    if (lastEnemy.posY >= player.posY) {
      finishGame(false);
    };
  };
  for (const enemyUnit of enemyList) {
    enemyUnit.posX += enemy.step;
  }
  collisionRecognizer();
};

const barrierCollisionRecognizer = bullet => {
  for (const barrierUnit of barrierList) {
    const collisionX = bullet.posX >= barrierUnit.posX &&
      bullet.posX <= barrierUnit.posX + barrier.width;
    const collisionY = bullet.posY >= barrierUnit.posY &&
      bullet.posY <= barrierUnit.posY + barrier.height;
    if (collisionX && collisionY) {
      reduceBarrierUnitLives(barrierUnit);
      return true;
    }
  }
  return false;
};

const shootPlayer = () => {
  const move = bullet => {
    bullet.posY -= 10;
  };
  const destroy = () => {
    clearInterval(playerBulletAnimation.interval);
    playerBulletAnimation.state = false;
  };
  const collisionRecognizer = bullet => {
    const borderCollision = bullet.posY <= 0;
    const enemyCollision = (() => {
      for (const enemyUnit of enemyList) {
        const enemyCollisionX = (bullet.posX >= (enemyUnit.posX -bullet.width) &&
          bullet.posX <= (enemyUnit.posX + enemy.width + bullet.width));
        const enemyCollisionY = (bullet.posY >= enemyUnit.posY &&
          bullet.posY <= (enemyUnit.posY + enemy.height));
        if (enemyCollisionX && enemyCollisionY) {
          increaseScore();
          destroyEnemyUnit(enemyUnit);
          return true;
        }
      }
      return false;
    })();
    if (borderCollision || enemyCollision ||
      barrierCollisionRecognizer(bullet)) {
      destroy();
    };
  };
  if (!playerBulletAnimation.state) {
    playerBulletAnimation.state = true;
    const bullet = {
      posX: -1,
      posY: -1,
      width: 4,
      height: 8,
    };
    bullet.posX = player.posX + player.width / 2 - bullet.width / 2;
    bullet.posY = player.posY - bullet.height;
    playerBulletAnimation.interval = setInterval(() => {
      move(bullet);
      collisionRecognizer(bullet);
      draw(bullet);
    }, 30);
  }
};

const shootEnemy = () => {
  const move = bullet => {
    bullet.posY += 10;
  };
  const destroy = () => {
    clearInterval(enemyBulletAnimation.interval);
    enemyBulletAnimation.state = false;
  };
  const collisionRecognizer = bullet => {
    const borderCollision = bullet.posY >= canvas.height;
    const playerCollisionX = bullet.posX >= player.posX &&
      bullet.posX <= player.posX + player.width;
    const playerCollisionY = bullet.posY + bullet.height >= player.posY;
    if (playerCollisionX && playerCollisionY) {
      reducePlayerLives();
      destroy(bullet);
    }
    if (borderCollision || barrierCollisionRecognizer(bullet)) {
      destroy(bullet);
    }
  };
  const enemyUnit = enemyList[random(0, enemyList.length)()];
  if (!enemyBulletAnimation.state) {
    enemyBulletAnimation.state = true;
    const bullet = {
      posX: -1,
      posY: -1,
      width: 4,
      height: 8,
    };
    bullet.posX = enemyUnit.posX + enemyUnit.width / 2 - bullet.width / 2;
    bullet.posY = enemyUnit.posY - bullet.height;
    enemyBulletAnimation.interval = setInterval(() => {
      move(bullet);
      collisionRecognizer(bullet);
      draw(bullet);
    }, 30);
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
    case 32: // space
      shootPlayer();
      break;
  }
};

const fieldAnimation = () => {
  clearField();
  draw(player);
  spawnBarrier();
  spawnEnemies();
  shootEnemy();
};

loadGame();
addEventListener('keydown', keyEventListener);
