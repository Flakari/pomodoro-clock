let timerDisplay = document.querySelector('#time-display');
let playPause= document.querySelector('#play-pause');
let resetButton = document.querySelector('#reset');
let running = false;

let work = document.querySelector('#work');
let workSession = work.querySelector('p');
let workButtons = work.querySelectorAll('button');

let br = document.querySelector('#break');
let brSession = br.querySelector('p');
let brButtons = br.querySelectorAll('button');

let sessionMinutes = document.querySelector('#session-minutes');
let totalMinutes = document.querySelector('#total-minutes');

let working = true;
let workButton = true;
let breakButton = false;

let newSession = true;
let workTimer = 25;
let breakTimer = 5;
let longBreak = 15;

let minuteCount = 0;
let totalCount = 0;

let minuteCounter = 0;
let totalCounter = 0;
let sessionAmt = 0;
let minutes = 25
let seconds = 0;
let currentTime;
let timer;
let pause;

let minutesDisplay = minutes;
let secondsDisplay = '00';

timerDisplay.textContent = minutesDisplay + ':' + secondsDisplay; 

playPause.addEventListener('click', () => {
    if (!running) {
        startTimer();
        pause = false;
        playPause.textContent = "Pause";
    } else {
        clearInterval(timer);
        running = false;
        pause = true;
        playPause.textContent = "Start";
    }
});

function startTimer() {
    if (newSession) {
        minuteCount += workTimer;
        totalCount += workTimer;
    }
    
    running = true;
    newSession = false;
    
    if (!pause) {
        seconds--;
    }
    timer = setInterval(() => {
        if (minutes == 0 && seconds < 0) {
            if (working) {
                if (sessionAmt == 3) {
                    working = false;
                    minutes = longBreak;
                    seconds = 0;
                    sessionAmt = 0;
                    newSession = true;
                } else {
                    working = false
                    minutes = breakTimer;
                    seconds = 0;
                    sessionAmt++;
                }
            } else if (!working) {
                if (sessionAmt == 0) {
                    clearInterval(timer);
                    minutes = 0;
                    seconds = 0;
                } else {
                    working = true;
                    minutes = workTimer;
                    seconds = 0;
                }
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

resetButton.addEventListener('click', () => {
    clearInterval(timer);
    newSession = true;
    minutes = workTimer;
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
    running = false;
});

workButtons.forEach(position => {
    position.addEventListener('click', function(e) {
        workButton = true;
        breakButton = false;
        increment(e.target.getAttribute('class'));
    });
});

brButtons.forEach(position => {
    position.addEventListener('click', function(e) {
        workButton = false;
        breakButton = true;
        increment(e.target.getAttribute('class'));
    });
});

function increment(position) {
    let button;
    if (workButton) {
        button = document.getElementsByClassName(position)[0];
    } else if (breakButton) {
        button = document.getElementsByClassName(position)[1];
    }
    if (position == 'up') {
        if (button.parentNode.id == 'work') {
            workTimer++;
            workSession.textContent = workTimer;
            if (!running) {
                if (workTimer < 10) {
                    minutesDisplay = '0' + workTimer;
                } else {
                    minutesDisplay = workTimer;
                }
                if (working && newSession) {
                    timerDisplay.textContent = minutesDisplay + ':' + secondsDisplay;
                }
            }
        }

        if (button.parentNode.id == 'break') {
            breakTimer++;
            brSession.textContent = breakTimer;
        }
    }

    if (position == 'down') {
        if (button.parentNode.id == 'work') {
            if (workTimer == 1) {return}
            workTimer--;
            workSession.textContent = workTimer;
            if (!running) {
                if (workTimer < 10) {
                    minutesDisplay = '0' + workTimer;
                } else {
                    minutesDisplay = workTimer;
                }
                if (working && newSession) {
                    timerDisplay.textContent = minutesDisplay + ':' + secondsDisplay;
                }
            }
        }

        if (button.parentNode.id == 'break') {
            if (breakTimer == 1) {return}
            breakTimer--;
            brSession.textContent = breakTimer;
        }
    }
} 

function dataCounter(sessionType) {
    if (sessionType == 'work') {
        
    }
}
