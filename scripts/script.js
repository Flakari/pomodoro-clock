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

let sessionMinutes = document.querySelector('#session-minutes');
let totalMinutes = document.querySelector('#total-minutes');

const alarm = new Audio('./sounds/alarm.wav');
let workButton = true;
let breakButton = false;
let restButton = false;

let minuteCount = 0;
let breakCount = 0;

let minuteCounter = 0;
let totalCounter = 0;
let sessionAmt = 0;
let minutes = 25
let seconds = 0;
let timer;
let pause;
let button;
let sessionFinished = false;

let minutesDisplay = minutes;
let secondsDisplay = '00';

timerDisplay.textContent = minutesDisplay + ':' + secondsDisplay; 

const timerSettings = (() => {
    let workTimer = 25;
    let breakTimer = 5;
    let longBreak = 15;
    let newSession = true;
    let running = false;
    let working = true;

    function getWorkTimer() {
        return workTimer;
    }

    function changeWorkTimer(direction) {
        if (direction === 'up') {
            workTimer += 1;
        } else {
            workTimer -= 1;
        }
    }

    function getBreakTimer() {
        return breakTimer;
    }

    function changeBreakTimer(direction) {
        if (direction === 'up') {
            breakTimer += 1;
        } else {
            breakTimer -= 1;
        }
    }

    function getLongBreak() {
        return longBreak;
    }

    function changeLongBreak(direction) {
        if (direction === 'up') {
            longBreak += 1;
        } else {
            longBreak -= 1;
        }
    }

    function isNewSession() {
        return newSession;
    }

    function changeNewSession() {
        if (newSession) {
            newSession = false;
        } else {
            newSession = true;
        }
    }

    function isRunning() {
        return running;
    }

    function changeRunning() {
        if (running) {
            running = false;
        } else {
            running = true;
        }
    }

    function isWorking() {
        return working;
    }

    function changeWorking() {
        if (working) {
            working = false;
        } else {
            working = true;
        }
    }

    return { getWorkTimer, changeWorkTimer, getBreakTimer, changeBreakTimer, getLongBreak, changeLongBreak,
    isNewSession, changeNewSession, isRunning, changeRunning, isWorking, changeWorking };
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

playPause.addEventListener('click', () => {
    if (sessionFinished) {
        return;
    }
    
    if (!timerSettings.isRunning()) {
        startTimer();
        if (working) {
            body.classList.add('work-bg');
            timerDisplay.classList.add('work-active');
        } else {
            body.classList.add('break-bg');
            timerDisplay.classList.add('break-active');
        }
        pause = false;
        playPause.textContent = "Pause";
    } else {
        clearInterval(timer);
        if (working) {
            timerDisplay.classList.remove('work-active');
        } else {
            timerDisplay.classList.remove('break-active');
        }
        timerSettings.changeRunning();
        pause = true;
        playPause.textContent = "Resume";
    }
});

function startTimer() {
    if (newSession) {
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
    if (sessionAmt == 3) {
        timerSettings.changeWorking();
        minutes = timerSettings.getLongBreak();
        breakCount = timerSettings.getLongBreak();
        seconds = 0;
        sessionAmt = 0;
        body.classList.remove('work-bg');
        body.classList.add('break-bg');
        timerDisplay.classList.remove('work-active');
        timerDisplay.classList.add('break-active');
        dataCounter('work');           
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
        dataCounter('work');
    } 
}

function endBreak() {
    if (sessionAmt == 0) {
        clearInterval(timer);
        newSession = true;
        timerSettings.changeRunning();
        minutes = 0;
        seconds = 0;
        sessionFinished = true;
        body.classList.remove('break-bg');
        timerDisplay.classList.remove('break-active');
        dataCounter('break');
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
        dataCounter('break');
    }
}

resetButton.addEventListener('click', () => {
    clearInterval(timer);
    
    playPause.textContent = "Start";
    
    if (working) {
        timerDisplay.classList.remove('work-active');
        body.classList.remove('work-bg');
    } else {
        body.classList.remove('break-bg');
        timerDisplay.classList.remove('break-active');
    }
    newSession = true;
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
    sessionFinished = false;
});

workButtons.forEach((position) => {
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
}

function dataDisplay(sessionType) {
    
}

function dataCounter(sessionType) {
    if (sessionType == 'work') {
        minuteCounter += minuteCount;
        totalCounter += minuteCount;
        
        if (minuteCounter > 60) {
            if (Math.floor(minuteCounter / 60) == 1 && minuteCounter % 60 == 1) {
                sessionMinutes.textContent = Math.floor(minuteCounter / 60) + ' hour and ' + minuteCounter % 60 + ' minute';
            } else if (Math.floor(minuteCounter / 60) == 1) {
                sessionMinutes.textContent = Math.floor(minuteCounter / 60) + ' hour and ' + minuteCounter % 60 + ' minutes';
            } else if (minuteCounter % 60 == 1) {
                sessionMinutes.textContent = Math.floor(minuteCounter / 60) + ' hour and ' + minuteCounter % 60 + ' minute';
            } else {
                sessionMinutes.textContent = Math.floor(minuteCounter / 60) + ' hours and ' + minuteCounter % 60 + ' minutes';
            }
        } else {
            if (minuteCounter == 1) {
                sessionMinutes.textContent = minuteCounter + ' minute';
            } else {
                sessionMinutes.textContent = minuteCounter + ' minutes';
            }
        }

        if (totalCounter > 60) {
            if (Math.floor(totalCounter / 60) == 1 && totalCounter % 60 == 1) {
                totalMinutes.textContent = Math.floor(totalCounter / 60) + ' hour and ' + totalCounter % 60 + ' minute';
            } else if (Math.floor(totalCounter / 60) == 1) {
                totalMinutes.textContent = Math.floor(totalCounter / 60) + ' hour and ' + totalCounter % 60 + ' minutes';
            } else if (totalCounter % 60 == 1) {
                totalMinutes.textContent = Math.floor(totalCounter / 60) + ' hour and ' + totalCounter % 60 + ' minute';
            } else {
                totalMinutes.textContent = Math.floor(totalCounter / 60) + ' hours and ' + totalCounter % 60 + ' minutes';
            }
        } else {
            if (totalCounter == 1) {
                totalMinutes.textContent = totalCounter + ' minute';
            } else {
                totalMinutes.textContent = totalCounter + ' minutes';
            }
        }
    }

    if (sessionType == 'break') {
        totalCounter += breakCount;
        if (totalCounter > 60) {
            if (Math.floor(totalCounter / 60) == 1 && totalCounter % 60 == 1) {
                totalMinutes.textContent = Math.floor(totalCounter / 60) + ' hour and ' + totalCounter % 60 + ' minute';
            } else if (Math.floor(totalCounter / 60) == 1) {
                totalMinutes.textContent = Math.floor(totalCounter / 60) + ' hour and ' + totalCounter % 60 + ' minutes';
            } else if (totalCounter % 60 == 1) {
                totalMinutes.textContent = Math.floor(totalCounter / 60) + ' hour and ' + totalCounter % 60 + ' minute';
            } else {
                totalMinutes.textContent = Math.floor(totalCounter / 60) + ' hours and ' + totalCounter % 60 + ' minutes';
            }
        } else {
            if (totalCounter == 1) {
                totalMinutes.textContent = totalCounter + ' minute';
            } else {
                totalMinutes.textContent = totalCounter + ' minutes';
            }
        }
    }
}
