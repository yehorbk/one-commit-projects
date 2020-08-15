'use strict'

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const directionState = {
  LEFT: '00',
  UP: '01',
  RIGHT: '10',
  DOWN: '11',
};

const bluePlayer = {
  color: '#98d4da',
	width: 8,
	height: 8,
	posX: -1,
	posY: -1,
	direction: directionState.UP,
	speed: 0,
	barrier: false,
};

const orangePlayer = {
  color: '#efe059',
	width: 8,
	height: 8,
	posX: -1,
	posY: -1,
	direction: directionState.DOWN,
	speed: 0,
	barrier: false,
};

const barrierList = [];

const clearField = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

const prepareBluePlayer = () => {
	bluePlayer.posX = canvas.width / 2 - bluePlayer.width / 2;
	bluePlayer.posY = canvas.height - bluePlayer.height * 2;
	bluePlayer.direction = directionState.UP;
	bluePlayer.speed = 1;
	bluePlayer.barrier = true;
};

const prepareOrangePlayer = () => {
	orangePlayer.direction = directionState.DOWN;
	orangePlayer.posX = canvas.width / 2 - orangePlayer.width / 2;
	orangePlayer.posY = 0 + orangePlayer.height * 2;
	orangePlayer.speed = 1;
	orangePlayer.barrier = true;
};

const loadGame = () => {
	barrierList.splice(0, barrierList.length);
	clearField();
	prepareBluePlayer();
	prepareOrangePlayer();
};

const gameOver = () => {
	// alert('Game Over!');
};

const generateBarrierUnit = player => {
	if (player.barrier) {
		const posX = player.posX + player.width / 2 - 2;
		const posY = player.posY + player.height / 2 - 2;
  	const barrierUnit = {
			posX,
			posY,
			width: 4,
			height: 4,
			color: player.color,
		};
		barrierList.push(barrierUnit);
	}
};

const spawnBarrier = () => {
  for (const barrierUnit of barrierList) {
		draw(barrierUnit)
	};
};

const collisionRecognizer = player => {
  const borderCollisionX = (player.posX <= 0 ||
	  (player.posX + player.width) >= canvas.width);
	const borderCollisionY = (player.posY <= 0 ||
		(player.posY + player.height) >= canvas.height);
	const barrierCollision = (() => {
  	for (const barrierUnit of barrierList) {
			const innerBarrierCollisionX = (player.posX === barrierUnit.posX) &&
				((player.posX + player.width) === (barrierUnit.posX + barrierUnit.width));
			const innerBarrierCollisionY = (player.posY === barrierUnit.posY) &&
				((player.posY + player.height) === (barrierUnit.posY + barrierUnit.height));
			if (innerBarrierCollisionX && innerBarrierCollisionY) {
				return false;
			}
		  const barrierCollisionX = (player.posX >= barrierUnit.posX &&
        player.posX <= (barrierUnit.posX + barrierUnit.width));
      const barrierCollisionY = (player.posY <=
        (barrierUnit.posY + barrierUnit.height)) &&
        (player.posY + player.height) >= barrierUnit.posY;
      if (barrierCollisionX && barrierCollisionY) {
				console.log(player);
				console.log(barrierUnit);
				//alert();
        return false; // true
      }
		}
		return false;
	})();
	if (borderCollisionX || borderCollisionY ||
		barrierCollision) {
		gameOver();
		loadGame();
	}
};

const move = player => {
	generateBarrierUnit(player);
	if (player.direction === directionState.LEFT) {
		player.posX -= player.speed;
	} else if (player.direction === directionState.RIGHT) {
		player.posX += player.speed;
	}
	if (player.direction === directionState.UP) {
		player.posY -= player.speed;
	} else if (player.direction === directionState.DOWN) {
		player.posY += player.speed;
	}	
	collisionRecognizer(player);
};

const changeDirection = (player, direction) => {
  switch (direction) {
    case directionState.LEFT:
      if (player.direction !== directionState.RIGHT) {
        player.direction = direction;
      }
      break;
    case directionState.UP:
      if (player.direction !== directionState.DOWN) {
        player.direction = direction;
      }
      break;
    case directionState.RIGHT:
      if (player.direction !== directionState.LEFT) {
        player.direction = direction;
      }
      break;
    case directionState.DOWN:
      if (player.direction !== directionState.UP) {
        player.direction = direction;
      }
      break;
  }
};

const switchSpeed = player => {
	player.speed = player.speed === 1 ? 2 : 1;
};

const switchBarrier = player => {
	player.barrier = !player.barrier;
};

const keyEventListener = event => {
  switch (event.keyCode) {
    case 37: // left
      changeDirection(bluePlayer, directionState.LEFT);
      break;
    case 38: // up
      changeDirection(bluePlayer, directionState.UP);
      break;
    case 39: // right
      changeDirection(bluePlayer, directionState.RIGHT);
      break;
    case 40: // down
      changeDirection(bluePlayer, directionState.DOWN);
      break;
		case 78: // n
		  switchSpeed(bluePlayer);
			break;
		case 77: // m
			switchBarrier(bluePlayer);
			break;
		case 65: // a
      changeDirection(orangePlayer, directionState.LEFT);
      break;
    case 87: // w
      changeDirection(orangePlayer, directionState.UP);
      break;
    case 68: // d
      changeDirection(orangePlayer, directionState.RIGHT);
      break;
    case 83: // s
      changeDirection(orangePlayer, directionState.DOWN);
      break;
		case 88: // x
		  switchSpeed(orangePlayer);
			break;
		case 67: // c
			switchBarrier(orangePlayer);
			break;
  }
};

const draw = object => {
  context.fillStyle = object.color;
	context.fillRect(object.posX, object.posY, object.width, object.height);
};

const reloadFrame = () => {
  clearField();
  draw(bluePlayer);
	draw(orangePlayer);
	move(bluePlayer);
	move(orangePlayer);
	spawnBarrier();
};

loadGame();
setInterval(reloadFrame, 10);
addEventListener('keydown', keyEventListener);
