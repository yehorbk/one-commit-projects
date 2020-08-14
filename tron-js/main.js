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
	width: 16,
	height: 16,
	posX: -1,
	posY: -1,
	speed: 1,
	direction: directionState.UP,
};

const orangePlayer = {
  color: '#efe059',
	width: 16,
	height: 16,
	posX: -1,
	posY: -1,
	speed: 1,
	direction: directionState.DOWN,
}

const clearField = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

const prepareBluePlayer = () => {
  bluePlayer.posX = canvas.width / 2 - bluePlayer.width / 2;
	bluePlayer.posY = canvas.height - bluePlayer.height * 2;
};

const prepareOrangePlayer = () => {
	orangePlayer.posX = canvas.width / 2 - orangePlayer.width / 2;
	orangePlayer.posY = 0 + orangePlayer.height * 2;
};

const draw = object => {
  context.fillStyle = object.color;
	context.fillRect(object.posX, object.posY, object.width, object.height);
};

const move = player => {
  if (player.direction === directionState.LEFT &&
		player.posX > 0) {
		player.posX -= player.speed;
	} else if (player.direction === directionState.RIGHT &&
		(player.posX + player.width) < canvas.width) {
		player.posX += player.speed;
	}
	if (player.direction === directionState.UP &&
		player.posY > 0) {
		player.posY -= player.speed;
	} else if (player.direction === directionState.DOWN &&
		(player.posY + player.height) < canvas.height) {
		player.posY += player.speed;
	}
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
  }
};

const reloadFrame = () => {
  clearField();
  draw(bluePlayer);
	draw(orangePlayer);
	move(bluePlayer);
	move(orangePlayer);
};

prepareBluePlayer();
prepareOrangePlayer();

setInterval(reloadFrame, 10);
addEventListener('keydown', keyEventListener);
