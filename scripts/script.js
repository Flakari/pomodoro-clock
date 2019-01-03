let timerDisplay = document.querySelector('#time-display');
let playPause= document.querySelector('#play-pause');
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

const alarm = new Audio('./sounds/alarm.wav');
let workButton = true;
let breakButton = false;
let restButton = false;

let minuteCount = 0;
let breakCount = 0;

let sessionAmt = 1;
let minutes = 25
let seconds = 0;
let timer;
let pause;
let button;

let minutesDisplay = minutes;
let secondsDisplay = '00';

timerDisplay.textContent = minutesDisplay + ':' + secondsDisplay; 

const newTimer = (() => {
    let newWorkTimer = 25;
    let newBreakTimer = 5;
    let newLongBreak = 15;

    function getNewWorkTimer() {
        return newWorkTimer;
    }

    function changeNewWorkTimer(direction) {
        direction === 'up' ? newWorkTimer += 1 : newWorkTimer -= 1;
    }
    
    function getNewBreakTimer() {
        return newBreakTimer;
    }

    function changeNewBreakTimer(direction) {
        direction === 'up' ? newBreakTimer += 1 : newBreakTimer -= 1;
    }

    function getNewLongBreak() {
        return newLongBreak;
    }

    function changeLongBreak(direction) {
        direction === 'up' ? newLongBreak += 1 : newLongBreak -= 1;     
    }

    return { getNewWorkTimer, changeNewWorkTimer, getNewBreakTimer, changeNewBreakTimer, getNewLongBreak,
        changeLongBreak };
})();

const timerSettings = (() => {
    // All timer variables refer to current timer status
    let workTimer = 25;
    let breakTimer = 5;
    let longBreak = 15;
    let newSession = true;
    let sessionFinished = false;
    let running = false;
    let working = true;
    let pause = false;

    function getWorkTimer() {
        return workTimer;
    }

    function getBreakTimer() {
        return breakTimer;
    }

    function getLongBreak() {
        return longBreak;
    }

    function changeTimer(workTime, breakTime, longBreakTime) {
        workTimer = workTime;
        breakTimer = breakTime;
        longBreak = longBreakTime;
    }

    function isNewSession() {
        return newSession;
    }

    function changeNewSession() {
        newSession ? newSession = false : newSession = true;
    }

    function isSessionFinished() {
        return newSession;
    }

    function changeSessionFininshed() {
        sessionFinished ? sessionFinished = false : sessionFinished = true;
    }

    function isRunning() {
        return running;
    }

    function changeRunning() {
        running ? running = false : running = true;
    }

    function isWorking() {
        return working;
    }

    function changeWorking() {
        working ? working = false : working = true;
    }

    function isPaused() {
        return pause;
    }

    function changePaused() {
        pause ? pause = false : pause = true;
    }

    return { getWorkTimer, getBreakTimer, getLongBreak, changeTimer, isNewSession, changeNewSession,
        isSessionFinished, changeSessionFininshed, isRunning, changeRunning, isWorking, changeWorking,
        isPaused, changePaused };
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
    }

    function decreaseSeconds() {
        seconds -= 1;
        if (seconds < 0) {
            seconds = 59;
            decreaseMinutes();
        }
    }

    function decreaseMinutes() {
        minutes -= 1;
    }

    return { getMinutes, getSeconds, changeTime, decreaseSeconds };
})();

playPause.addEventListener('click', () => {
    /*if (timerSettings.isSessionFinished()) {
        return;
    }*/
    
    if (!timerSettings.isRunning()) {
        //startTimer();
        if (timerSettings.isWorking()) {
            body.classList.add('work-bg');
            timerDisplay.classList.add('work-active');
        } else {
            body.classList.add('break-bg');
            timerDisplay.classList.add('break-active');
        }
        //pause = false;
        playPause.textContent = "Pause";
    } else {
        clearInterval(timer);
        if (timerSettings.isWorking()) {
            timerDisplay.classList.remove('work-active');
        } else {
            timerDisplay.classList.remove('break-active');
        }
        /*timerSettings.changeRunning();
        pause = true;*/
        playPause.textContent = "Resume";
    }
});

/*function startTimer() {
    if (newSession) {
        timerSettings.changeTimer(newTimer.getNewWorkTimer(), newTimer.getNewBreakTimer(), newTimer.getNewLongBreak());
        minutes = timerSettings.getWorkTimer();
        minuteCount = timerSettings.getWorkTimer();
    }
    
    timerSettings.changeRunning();
    newSession = false;
    
    if (!pause) {
        seconds--;
    }
    timer = setInterval(() => {
        if (minutes == 0 && seconds == 0) {
            alarm.play();
        }
        
        if (minutes == 0 && seconds < 0) {
            if (working) {
                endWork(); 
            } else if (!working) {
                endBreak();
            }
               
        }
        if (seconds < 0) {
            seconds = 59;
            minutes--;
        }
        if (minutes < 10) {
            minutesDisplay = '0' + minutes;
        } else {
            minutesDisplay = minutes;
        }

        if (seconds < 10) {
            secondsDisplay = '0' + seconds;
        } else {
            secondsDisplay = seconds;
        }
        timerDisplay.textContent = minutesDisplay + ':' + secondsDisplay;
        seconds--;
    }, 1000);
}

function endWork() {
    if (sessionAmt == 4) {
        timerSettings.changeWorking();
        minutes = timerSettings.getLongBreak();
        breakCount = timerSettings.getLongBreak();
        seconds = 0;
        sessionAmt = 1;
        body.classList.remove('work-bg');
        body.classList.add('break-bg');
        timerDisplay.classList.remove('work-active');
        timerDisplay.classList.add('break-active');
        timeCounter('work');           
    } else {
        timerSettings.changeWorking();
        minutes = timerSettings.getBreakTimer();
        breakCount = timerSettings.getBreakTimer();
        seconds = 0;
        sessionAmt++;
        body.classList.remove('work-bg');
        body.classList.add('break-bg');
        timerDisplay.classList.remove('work-active');
        timerDisplay.classList.add('break-active');
        timeCounter('work');
    } 
}

function endBreak() {
    if (sessionAmt == 1) {
        clearInterval(timer);
        newSession = true;
        timerSettings.changeRunning();
        minutes = 0;
        seconds = 0;
        sessionFinished = true;
        body.classList.remove('break-bg');
        timerDisplay.classList.remove('break-active');
        timeCounter('long break');
        playPause.textContent = "Start";
    } else {
        working = true;
        minutes = timerSettings.getWorkTimer();
        minuteCount = timerSettings.getWorkTimer();
        seconds = 0;
        body.classList.remove('break-bg');
        body.classList.add('work-bg');
        timerDisplay.classList.remove('break-active');
        timerDisplay.classList.add('work-active');
        timeCounter('break');
    }
}*/

function resetTimer() {
    timerDisplay.className = '';
    body.className = '';

    if (!timerSettings.isNewSession()) {
        timerSettings.changeNewSession();
    } 
}

resetButton.addEventListener('click', () => {
    clearInterval(timer);
    resetTimer();

    playPause.textContent = "Start";
    
    /*
    minutes = timerSettings.getWorkTimer;
    seconds = 0;

    if (minutes < 10) {
        minutesDisplay = '0' + minutes;
    } else {
        minutesDisplay = minutes;
    }

    if (seconds < 10) {
        secondsDisplay = '0' + seconds;
    } else {
        secondsDisplay = seconds;
    }

    timerDisplay.textContent = minutesDisplay + ':' + secondsDisplay;
    if (timerSettings.isRunning()) {
        timerSettings.changeRunning();
    }
    working = true;
    sessionFinished = false;*/
});

/*workButtons.forEach((position) => {
    position.addEventListener('click', (e) => {
        workButton = true;
        breakButton = false;
        restButton = false;
        increment(e.target.getAttribute('class'));
    });
});

brButtons.forEach((position) => {
    position.addEventListener('click', (e) => {
        workButton = false;
        breakButton = true;
        restButton = false;
        increment(e.target.getAttribute('class'));
    });
});

restButtons.forEach((position) => {
    position.addEventListener('click', (e) => {
        workButton = false;
        breakButton = false;
        restButton = true;
        increment(e.target.getAttribute('class'));
    });
});

function increment(position) {
    button;
    if (workButton) {
        button = document.getElementsByClassName(position)[0];
    } else if (breakButton) {
        button = document.getElementsByClassName(position)[1];
    } else if (restButton) {
        button = document.getElementsByClassName(position)[2];
    }

    if (position == 'up') {
        direction(position);
    }

    if (position == 'down') {
        direction(position);
    }
} 

function direction(position) {
    if (button.parentNode.id == 'work') {
        if (position == 'down') {
            if (timerSettings.getWorkTimer() == 1) {return}
            workDirection(position);
        } else {
            workDirection(position);
        } 
    }

    if (button.parentNode.id == 'break') {
        if (position == 'up') {
            breakTimer++;
        } else {
            if (breakTimer == 1) { return; }
            breakTimer--;
        }
        brSession.textContent = breakTimer;
    }

    if (button.parentNode.id == 'rest') {
        if (position == 'up') {
            longBreak++
        } else {
            if (longBreak == 1) { return; }
            longBreak--
        }
        restSession.textContent = longBreak;
    }
}

function workDirection(position) {
    timerSettings.changeWorkTimer(position);

    workSession.textContent = timerSettings.getWorkTimer();
    if (!timerSettings.isRunning()) {
        if (timerSettings.getWorkTimer() < 10) {
            minutesDisplay = '0' + timerSettings.getWorkTimer();
        } else {
            minutesDisplay = timerSettings.getWorkTimer();
        }
        
        if (working && newSession) {
            timerDisplay.textContent = minutesDisplay + ':' + secondsDisplay;
        }
    }
}*/

function timeCounter(sessionType) {
    if (sessionType === 'work') {
        timerTotals.addToWorkAndTotalCounters(timerSettings.getWorkTimer());
    } else if (sessionType === 'break') {
        timerTotals.addToTotalCounter(timerSettings.getBreakTimer());
    } else {
        timerTotals.addToTotalCounter(timerSettings.getLongBreak());
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
    const minuteTotalCount = workCounter % 60;

    let hourWorkString = '';
    let hourTotalString = '';
    let minuteWorkString = '';
    let minuteTotalString = '';
    
    (hourWorkCount === 1) ? hourWorkString = 'hour' : hourWorkString = 'hours';
    (hourTotalCount === 1) ? hourTotalString = 'hour' : hourTotalString = 'hours';
    (minuteWorkCount === 1) ? minuteWorkString = 'minute' : minuteWorkString = 'minutes';
    (minuteTotalCount === 1) ? minuteTotalString = 'minute' : minuteTotalString = 'minutes';

    if (workCounter > 60) {
        sessionMinutes.textContent = `${ hourWorkCount } ${ hourWorkString } and ${ minuteWorkCount } ${ minuteWorkString }`;
    } else {
        sessionMinutes.textContent = `${ minuteWorkCount } ${ minuteWorkString }`;
    }

    if (totalCounter > 60) {
        totalMinutes.textContent = `${ hourTotalCount } ${ hourTotalString } and ${ minuteTotalCount } ${ minuteTotalString }`;
    } else {
        totalMinutes.textContent = `${ minuteTotalCount } ${ minuteTotalString }`;
    }
}
