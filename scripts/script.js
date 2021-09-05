let timerDisplay = document.querySelector('#time-display');
let autoToggle = document.querySelector('#auto-toggle');
let playPause = document.querySelector('#play-pause');
let resetButton = document.querySelector('#reset');
let body = document.querySelector('body');

let work = document.querySelector('#work');
let workSession = work.querySelector('p');
let workButtons = work.querySelectorAll('button');

let br = document.querySelector('#break');
let brSession = br.querySelector('p');
let brButtons = br.querySelectorAll('button');

let rest = document.querySelector('#rest');
let restSession = rest.querySelector('p');
let restButtons = rest.querySelectorAll('button');

let workButton = true;
let breakButton = false;
let restButton = false;

let timer;

const newTimer = (() => {
    let newWorkTimer = 25;
    let newBreakTimer = 5;
    let newRestTimer = 15;
    let newSessionAmount = 4;

    function changeTimer(timer, direction) {
        if (direction === 'up') {
            return timer += 1;
        } else if (direction === 'down' && timer > 1) {
            return timer -= 1;
        }
        return timer;
    }

    function getNewWorkTimer() {
        return newWorkTimer;
    }

    function changeNewWorkTimer(direction) {
        newWorkTimer = changeTimer(newWorkTimer, direction);
    }

    function getNewBreakTimer() {
        return newBreakTimer;
    }

    function changeNewBreakTimer(direction) {
        newBreakTimer = changeTimer(newBreakTimer, direction);
    }

    function getNewRestTimer() {
        return newRestTimer;
    }

    function changeNewRestTimer(direction) {
        newRestTimer = changeTimer(newRestTimer, direction);
    }

    return {
        getNewWorkTimer, changeNewWorkTimer, getNewBreakTimer, changeNewBreakTimer, getNewRestTimer,
        changeNewRestTimer
    };
})();

const timerSettings = (() => {
    // All timer variables refer to current timer status
    let workTimer = 25;
    let breakTimer = 5;
    let restTimer = 15;
    let maxSessionAmount = 4;
    let newSession = true;
    let sessionFinished = false;
    let running = false;
    let working = true;
    let pause = false;
    let sessionAmount = maxSessionAmount;

    function getWorkTimer() {
        return workTimer;
    }

    function getBreakTimer() {
        return breakTimer;
    }

    function getRestTimer() {
        return restTimer;
    }

    function changeTimer(workTime, breakTime, restTime) {
        workTimer = workTime;
        breakTimer = breakTime;
        restTimer = restTime;
    }

    function isNewSession() {
        return newSession;
    }

    function changeNewSession(state) {
        newSession = state;
    }

    function isSessionFinished() {
        return sessionFinished;
    }

    function changeSessionFinished(state) {
        sessionFinished = state;
    }

    function isRunning() {
        return running;
    }

    function changeRunning(state) {
        running = state;
    }

    function isWorking() {
        return working;
    }

    function changeWorking(state) {
        working = state;
    }

    function isPaused() {
        return pause;
    }

    function changePaused(state) {
        pause = state;
    }

    function getSessionAmount() {
        return sessionAmount;
    }

    function decrementSessionAmount() {
        sessionAmount -= 1;
    }

    function resetSessionAmount() {
        sessionAmount = maxSessionAmount;
    }

    return {
        getWorkTimer, getBreakTimer, getRestTimer, changeTimer, isNewSession, changeNewSession,
        isSessionFinished, changeSessionFinished, isRunning, changeRunning, isWorking, changeWorking,
        isPaused, changePaused, getSessionAmount, decrementSessionAmount, resetSessionAmount
    };
})();

const timerTotals = (() => {
    let workCounter = 0;
    let totalCounter = 0;

    function getWorkCounter() {
        return workCounter;
    }

    // Function adds to both as work is always counted towards total time
    function addToWorkAndTotalCounters(amount) {
        workCounter += amount;
        totalCounter += amount;
    }

    function getTotalCounter() {
        return totalCounter;
    }

    function addToTotalCounter(amount) {
        totalCounter += amount;
    }

    return { getWorkCounter, addToWorkAndTotalCounters, getTotalCounter, addToTotalCounter };
})();

const timerRunner = (() => {
    let minutes = 0;
    let seconds = 0;

    function getMinutes() {
        return minutes;
    }

    function getSeconds() {
        return seconds;
    }

    function changeTime(newMinutes) {
        minutes = newMinutes;
        seconds = 0;
    }

    function decreaseSeconds() {
        seconds -= 1;
        if (seconds < 0 && minutes > 0) {
            seconds = 59;
            if (minutes > 0) {
                decreaseMinutes();
            }
        }
    }

    function decreaseMinutes() {
        minutes -= 1;
    }

    return { getMinutes, getSeconds, changeTime, decreaseSeconds };
})();

playPause.addEventListener('click', () => {
    if (timerSettings.isSessionFinished()) {
        return;
    }

    if (!timerSettings.isRunning()) {
        startTimer();
        timerSettings.changeNewSession(false);
        timerSettings.changeRunning(true);
        timerSettings.changePaused(false);

        if (timerSettings.isWorking()) {
            changeTimerStyles('work');
        } else {
            changeTimerStyles('break');
        }

        playPause.textContent = "Pause";
    } else {
        clearInterval(timer);
        changeTimerStyles('pause');
        timerSettings.changePaused(true);
        timerSettings.changeRunning(false);

        playPause.textContent = "Resume";
    }
});

function startTimer() {
    const alarm = new Audio('./sounds/alarm.wav');

    if (timerSettings.isNewSession()) {
        timerSettings.changeTimer(newTimer.getNewWorkTimer(), newTimer.getNewBreakTimer(), newTimer.getNewRestTimer());
        timerRunner.changeTime(timerSettings.getWorkTimer());
        timerSettings.changeWorking(true);
    }

    if (!timerSettings.isPaused()) {
        timerRunner.decreaseSeconds();
        timerDisplay.textContent = updateTimerDisplay('running');
    }

    timer = setInterval(() => {
        if (timerRunner.getMinutes() === 0 && timerRunner.getSeconds() === 0) {
            alarm.play();
            timerSettings.isWorking() ? endWork() : endBreak();
        }

        if (!timerSettings.isSessionFinished()) {
            timerRunner.decreaseSeconds();
            timerDisplay.textContent = updateTimerDisplay('running');
        }
    }, 1000);
}

function endWork() {
    timerSettings.changeWorking(false);
    if (timerSettings.getSessionAmount() === 1) {
        timerRunner.changeTime(timerSettings.getRestTimer());
        timerSettings.resetSessionAmount();
    } else {
        timerRunner.changeTime(timerSettings.getBreakTimer());
        timerSettings.decrementSessionAmount();
    }
    changeTimerStyles('break');
    timeCounter('work');
}

function endBreak() {
    if (timerSettings.getSessionAmount() === 0) {
        clearInterval(timer);
        timerSettings.changeNewSession(true);
        timerSettings.changeRunning(false);
        timerSettings.changeSessionFinished(true);
        changeTimerStyles('reset');
        timerRunner.changeTime(0);

        timeCounter('rest');
        playPause.textContent = "Start";
    } else {
        timerSettings.changeWorking(true);
        timerRunner.changeTime(timerSettings.getWorkTimer());
        changeTimerStyles('work');
        timeCounter('break');
    }
}

function changeTimerStyles(state) {
    if (state !== 'pause') {
        timerDisplay.className = '';
        body.className = '';
    }

    if (state === 'work') {
        timerDisplay.classList.add('work-active');
        body.classList.add('work-bg');
    } else if (state === 'break') {
        timerDisplay.classList.add('break-active');
        body.classList.add('break-bg');
    } else if (state === 'pause') {
        timerDisplay.className = '';
    }
}

function updateTimerDisplay(state) {
    let minutesDisplay = '';
    let secondsDisplay = '';

    if (state === 'running') {
        minutesDisplay = timerRunner.getMinutes().toString();
        secondsDisplay = timerRunner.getSeconds().toString();
    } else if (state === 'new') {
        minutesDisplay = newTimer.getNewWorkTimer().toString();
        secondsDisplay = '0';
    }

    if (+minutesDisplay < 10) {
        minutesDisplay = '0' + minutesDisplay;
    }

    if (+secondsDisplay < 10) {
        secondsDisplay = '0' + secondsDisplay;
    }

    return minutesDisplay + ':' + secondsDisplay;
}

function resetTimer() {
    timerDisplay.className = '';
    body.className = '';

    if (!timerSettings.isNewSession()) {
        timerSettings.changeNewSession(true);
    }

    if (timerSettings.isRunning()) {
        timerSettings.changeRunning(false);
    }

    timerSettings.changeSessionFinished(false);
    timerSettings.resetSessionAmount();
    timerDisplay.textContent = updateTimerDisplay('new');
}

resetButton.addEventListener('click', () => {
    clearInterval(timer);
    resetTimer();

    playPause.textContent = "Start";
});

function changeButtonType(type, position) {
    workButton = breakButton = restButton = false;

    if (type === 'work') workButton = true;
    if (type === 'break') breakButton = true;
    if (type === 'rest') restButton = true;

    increment(position.getAttribute('class'))
}

workButtons.forEach((position) => position.addEventListener('click', () => changeButtonType('work', position)));
brButtons.forEach((position) => position.addEventListener('click', () => changeButtonType('break', position)));
restButtons.forEach((position) => position.addEventListener('click', () => changeButtonType('rest', position)));

function increment(position) {
    let button;
    if (workButton) {
        button = document.getElementsByClassName(position)[0];
    } else if (breakButton) {
        button = document.getElementsByClassName(position)[1];
    } else if (restButton) {
        button = document.getElementsByClassName(position)[2];
    }

    direction(position, button);
}

function direction(position, button) {
    if (button.parentNode.id === 'work') {
        newTimer.changeNewWorkTimer(position);
        workSession.textContent = newTimer.getNewWorkTimer().toString();
        if (!timerSettings.isRunning() && timerSettings.isNewSession()) {
            timerDisplay.textContent = updateTimerDisplay('new');
        }
    }

    if (button.parentNode.id === 'break') {
        newTimer.changeNewBreakTimer(position);
        brSession.textContent = newTimer.getNewBreakTimer().toString();
    }

    if (button.parentNode.id === 'rest') {
        newTimer.changeNewRestTimer(position);
        restSession.textContent = newTimer.getNewRestTimer().toString();
    }
}

function timeCounter(sessionType) {
    if (sessionType === 'work') {
        timerTotals.addToWorkAndTotalCounters(timerSettings.getWorkTimer());
    } else if (sessionType === 'break') {
        timerTotals.addToTotalCounter(timerSettings.getBreakTimer());
    } else {
        timerTotals.addToTotalCounter(timerSettings.getRestTimer());
    }

    counterDisplay();
}

function counterDisplay() {
    const sessionMinutes = document.querySelector('#session-minutes');
    const totalMinutes = document.querySelector('#total-minutes');
    const workCounter = timerTotals.getWorkCounter();
    const totalCounter = timerTotals.getTotalCounter();
    const hourWorkCount = Math.floor(workCounter / 60);
    const hourTotalCount = Math.floor(totalCounter / 60);
    const minuteWorkCount = workCounter % 60;
    const minuteTotalCount = totalCounter % 60;

    let hourWorkString = '';
    let hourTotalString = '';
    let minuteWorkString = '';
    let minuteTotalString = '';

    (hourWorkCount === 1) ? hourWorkString = 'hour' : hourWorkString = 'hours';
    (hourTotalCount === 1) ? hourTotalString = 'hour' : hourTotalString = 'hours';
    (minuteWorkCount === 1) ? minuteWorkString = 'minute' : minuteWorkString = 'minutes';
    (minuteTotalCount === 1) ? minuteTotalString = 'minute' : minuteTotalString = 'minutes';

    if (workCounter >= 60) {
        sessionMinutes.textContent = `${hourWorkCount} ${hourWorkString} and ${minuteWorkCount} ${minuteWorkString}`;
    } else {
        sessionMinutes.textContent = `${minuteWorkCount} ${minuteWorkString}`;
    }

    if (totalCounter >= 60) {
        totalMinutes.textContent = `${hourTotalCount} ${hourTotalString} and ${minuteTotalCount} ${minuteTotalString}`;
    } else {
        totalMinutes.textContent = `${minuteTotalCount} ${minuteTotalString}`;
    }
}

window.onload = function () {
    timerDisplay.textContent = updateTimerDisplay('new');
}
