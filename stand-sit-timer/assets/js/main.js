'use strict';

const sittingTimeInput = document.getElementById('sitting-time');
const warmupTimeInput = document.getElementById('warmup-time');
const standingTimeInput = document.getElementById('standing-time');

const timeCounter = document.getElementById('time-counter');
const timeState = document.getElementById('time-state');

const startTimerButton = document.getElementById('start-timer');
const clearTimerButton = document.getElementById('clear-timer');

const notificationAudio = (() => {
	const audioSource = './assets/audio/notification.wav';
	const instance = new Audio(audioSource);
	return instance;
})();

const Position = {
	SITTING: 'Sitting',
	WARMUP: 'Warm-up',
	STANDING: 'Standing',
};

const m2ms = minute => minute * 60000;

const ms2time = miliseconds => {
	const minutes = Math.floor(miliseconds / 60000);
	const seconds = ((miliseconds % 60000) / 1000).toFixed(0);
	return (minutes < 10 ? '0' : '') + minutes + ":"
		+ (seconds < 10 ? '0' : '') + seconds;
};

const updateTime = (time, state) => {
	timeCounter.innerText = ms2time(time);
	timeState.innerText = state;
};

const configureTimer = timings => {
	const instance = new Function();

	let interval = null;
	let timeout = null;
	let positionId = 0;
	let position = Object.values(Position)[positionId];

	const switchPosition = () => {
		positionId = positionId === timings.length ? 0 : positionId + 1;
		position = Object.values(Position)[positionId];
		instance.clear();
		notificationAudio.play();
		instance.start();
	};

	instance.start = () => {
		let time = timings[positionId];
		interval = setInterval(() => {
			time -= 1000;
			updateTime(time, position);
		}, 1000);
		timeout = setTimeout(switchPosition, time);
	};

	instance.clear = () => {
		clearInterval(interval);
		clearTimeout(timeout);
		updateTime(0, '');
	};

	return instance;
};

let timer = null;

const clearTimer = () => {
	if (timer) {
		timer.clear();
	}
}

const startTimer = () => {
	clearTimer();
	const sittingTime = sittingTimeInput.value;
	const warmupTime = warmupTimeInput.value;
	const standingTime = standingTimeInput.value;
	timer = configureTimer([m2ms(sittingTime),
		m2ms(warmupTime), m2ms(standingTime)]);
	timer.start();
};

clearTimerButton.onclick = clearTimer;
startTimerButton.onclick = startTimer;
