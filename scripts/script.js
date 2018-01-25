let test = document.querySelector('#test');
let testButton = document.querySelector('#test-button');
let resetButton = document.querySelector('#reset');
let running = false;

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
    minutes = 25;
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

