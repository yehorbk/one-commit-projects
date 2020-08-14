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
};

const orangePlayer = {
  color: '#efe059',
	width: 16,
	height: 16,
	posX: -1,
	posY: -1,
	speed: 1,
}

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
  draw(bluePlayer);
	draw(orangePlayer);
};

prepareBluePlayer();
prepareOrangePlayer();

setTimeout(reloadFrame, 10);
addEventListener('keydown', keyEventListener);
