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
let percentage = document.querySelector('#percentage');

let working = true;
let workButton = true;
let breakButton = false;

let newSession = true;
let workTimer = 25;
let breakTimer = 5;
let longBreak = 15;

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

playPause.addEventListener('click', () => {
    if (sessionFinished) {
        return;
    }
    
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
        minutes = workTimer;
        minuteCount = workTimer;
    }
    
    running = true;
    newSession = false;
    
    if (!pause) {
        seconds--;
    }
    timer = setInterval(() => {
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
        working = false;
        minutes = longBreak;
        breakCount = longBreak;
        seconds = 0;
        sessionAmt = 0;
        dataCounter('work');            
    } else {
        working = false
        minutes = breakTimer;
        breakCount = breakTimer;
        seconds = 0;
        sessionAmt++;
        dataCounter('work');
    } 
}

function endBreak() {
    if (sessionAmt == 0) {
        clearInterval(timer);
        newSession = true;
        running = true;
        minutes = 0;
        seconds = 0;
        sessionFinished = true;
        dataCounter('break');
        playPause.textContent = "Start";
    } else {
        working = true;
        minutes = workTimer;
        minuteCount = workTimer;
        seconds = 0;
        dataCounter('break');
    }
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
    working = true;
    sessionFinished = false;
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
    button;
    if (workButton) {
        button = document.getElementsByClassName(position)[0];
    } else if (breakButton) {
        button = document.getElementsByClassName(position)[1];
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
            if (workTimer == 1) {return}
            workDirection(position);
        } else {
            workDirection(position);
        } 
    }

    if (button.parentNode.id == 'break') {
        if (position == 'up') {
            breakTimer++;
        } else {
            if (breakTimer == 1) {return}
            breakTimer--;
        }
        brSession.textContent = breakTimer;
    }
}

function workDirection(position) {
    if (position == 'up') {
        workTimer++;
    } else {
        workTimer--;
    }
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

function dataCounter(sessionType) {
    if (sessionType == 'work') {
        minuteCounter += minuteCount;
        totalCounter += minuteCount;
        
        if (minuteCounter > 60) {
            sessionMinutes.textContent = Math.floor(minuteCounter / 60) + ' hours and ' + minuteCounter % 60 + ' minutes.'
        } else {
            sessionMinutes.textContent = minuteCounter + ' minutes.';
        }
        if (totalCounter > 60) {
            totalMinutes.textContent = Math.floor(totalCounter / 60) + ' hours and ' + totalCounter % 60 + ' minutes.'
        } else {
            totalMinutes.textContent = totalCounter + ' minutes.';
        }
    }

    if (sessionType == 'break') {
        totalCounter += breakCount;
        if (totalCounter > 60) {
            totalMinutes.textContent = Math.floor(totalCounter / 60) + ' hours and ' + totalCounter % 60 + ' minutes.'
        } else {
            totalMinutes.textContent = totalCounter + ' minutes.';
        }
    }
    let workRatio = (minuteCounter / totalCounter) * 100;
    if (workRatio % 1 == 0) {
        percentage.textContent = workRatio + '%';
    } else {
        percentage.textContent = workRatio.toFixed(2) + '%';
    }
}
