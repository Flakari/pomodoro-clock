let test = document.querySelector('#test');
let testButton = document.querySelector('#test-button');
let timerStart = false;

testButton.addEventListener('click', function(e) {
    let startTime = Math.floor(performance.now());
    if (timerStart) {return}
    timerStart = true;
    let secondsTimer = setInterval(() => {
        let currentTime = Math.floor(performance.now());
        let elapsedTime = Math.floor((startTime - currentTime) / 100);
        if (Math.round(elapsedTime) == elapsedTime) {
            elapsedTime = (elapsedTime / 10) + 10;
            if (elapsedTime < 0) {
                elapsedTime += 10;
            }
            test.textContent = elapsedTime.toFixed(1) + ' seconds';
        }
    }, 50)
});

