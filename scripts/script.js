let test = document.querySelector('#test');
let testButton = document.querySelector('#test-button');
let resetButton = document.querySelector('#reset');
let running = false;

let minutes = 3
let seconds = 0;
let currentTime;
let timer;
let pause;

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
            seconds = 9;
            minutes--;
        }
        test.textContent = minutes + ' minutes, ' + seconds + ' seconds.'
        seconds--;
    }, 1000);
}

resetButton.addEventListener('click', () => {
    clearInterval(timer);
    minutes = 3;
    seconds = 0;
    test.textContent = minutes + ' minutes, ' + seconds + ' seconds.';
    running = false;
});

