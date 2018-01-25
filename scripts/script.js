let test = document.querySelector('#test');
let testButton = document.querySelector('#test-button');
let resetButton = document.querySelector('#reset');
let running = false;
let work = document.querySelector('#work');
let workSession = work.querySelector('p');
let workButtons = work.querySelectorAll('button');

let workTimer = 25;
let breakTimer = 5;
let longBreak = 15;

let minutes = 25
let seconds = 0;
let currentTime;
let timer;
let pause;

minutesDisplay = minutes;
secondsDisplay = '00';

test.textContent = minutesDisplay + ':' + secondsDisplay; 

testButton.addEventListener('click', () => {
    if (!running) {
        startTimer();
        pause = false;
    } else {
        clearInterval(timer);
        running = false;
        pause = true;
    }
});

function startTimer() {
    running = true;
    
    if (!pause) {
        seconds--;
    }
    timer = setInterval(() => {
        if (minutes == 0 && seconds == 0) {
            clearInterval(timer);
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
        test.textContent = minutesDisplay + ':' + secondsDisplay;
        seconds--;
    }, 1000);
}

resetButton.addEventListener('click', () => {
    clearInterval(timer);
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

    test.textContent = minutesDisplay + ':' + secondsDisplay;
    running = false;
});

workButtons.forEach(position => {
    position.addEventListener('click', function(e) {
        increment(e.target.getAttribute('class'));
        
    });
});

function increment(position) {
    let button = document.getElementsByClassName(position)[0];
    if (position == 'up') {
        if (button.parentNode.id == 'work') {
            workTimer++;
            workSession.textContent = workTimer;
            if (!running) {
                minutes = workTimer;
                if (minutes < 10) {
                    minutesDisplay = '0' + minutes;
                } else {
                    minutesDisplay = minutes;
                }
                test.textContent = minutesDisplay + ':' + secondsDisplay;
            }
        }
    }

    if (position == 'down') {
        if (button.parentNode.id == 'work') {
            workTimer--;
            workSession.textContent = workTimer;
            if (!running) {
                minutes = workTimer;
                if (minutes < 10) {
                    minutesDisplay = '0' + minutes;
                } else {
                    minutesDisplay = minutes;
                }
                test.textContent = minutesDisplay + ':' + secondsDisplay;
            }
        }
    }
} 
