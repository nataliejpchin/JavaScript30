// global variable;
let countdown;

// get reference to element
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

// timer calculation
function timer(seconds) {
  // clear any existing timers
  clearInterval(countdown);

  // when the timer started in milliseconds
  const now = Date.now();

  // when the timer should stop in milliseconds
  const then = now + seconds * 1000;

  console.log({now, then});

  // display timer immediately
  displayTimeLeft(seconds);
  displayEndTime(then);

  // every single second, display amount of time left
  // does not run immediately - have to wait for the first second to elapse
  countdown = setInterval(() => {
    // calculate how much time is left on the clock
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    console.log(secondsLeft);

    // intervals don't know when to stop themselves
    // check if should stop timer
    if(secondsLeft < 0){
      clearInterval(countdown);
      return;
    }

    // display it
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  // convert seconds into whole minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  console.log({minutes, remainderSeconds});

  // visually display time left
  const display = `${minutes}:${remainderSeconds < 10? '0': ''}${remainderSeconds}`;
  timerDisplay.textContent = display;

  // show time left in <title> tag to show in the browser tab
  document.title = display;
}

// show ending time
function displayEndTime(timestamp) {
  // convert timestamp into a date
  const end = new Date(timestamp);

  // get the hour and minutes
  const hour = end.getHours();
  const minutes = end.getMinutes();

  // endTime.textContent = `Be back at ${hour > 12 ? hour - 12 : hour}:${minutes}`;
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  endTime.textContent = `Be back at ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`;
  // endTime.textContent = 'HI';
}

// start timer
function startTimer() {
  // returns an object with the time(in seconds) on it
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

// listen for click
buttons.forEach(button => button.addEventListener('click', startTimer));

document.customForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const mins = this.minutes.value;
  console.log(mins);

  // run timer function
  timer(mins * 60);

  // clear value in form
  this.reset();
});
