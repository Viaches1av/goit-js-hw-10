import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

let userSelectedDate;
let timerInterval;
const dateTimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('button[data-start]');
const timerFields = document.querySelectorAll('.timer .value');

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer(days, hours, minutes, seconds) {
  timerFields[0].textContent = addLeadingZero(days);
  timerFields[1].textContent = addLeadingZero(hours);
  timerFields[2].textContent = addLeadingZero(minutes);
  timerFields[3].textContent = addLeadingZero(seconds);
}

function convertMs(milliseconds) {
  const oneSecond = 1000;
  const oneMinute = oneSecond * 60;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;

  const days = Math.floor(milliseconds / oneDay);
  const hours = Math.floor((milliseconds % oneDay) / oneHour);
  const minutes = Math.floor((milliseconds % oneHour) / oneMinute);
  const seconds = Math.floor((milliseconds % oneMinute) / oneSecond);

  return { days, hours, minutes, seconds };
}

function startCountdown() {
  const now = new Date().getTime();
  const distance = userSelectedDate.getTime() - now;

  if (distance <= 0) {
    clearInterval(timerInterval);
    updateTimer(0, 0, 0, 0);
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
    });
    startButton.disabled = true;
    dateTimePicker.disabled = false;
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(distance);
  updateTimer(days, hours, minutes, seconds);

  if (distance <= 1000) {
    clearInterval(timerInterval);
    iziToast.success({
      title: 'Success',
      message: 'Timer finished',
    });
    dateTimePicker.disabled = false;
    startButton.disabled = false;
  }
}

function handleDateSelection(selectedDates) {
  userSelectedDate = selectedDates[0];

  const now = new Date().getTime();
  if (userSelectedDate.getTime() < now) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
    });
    startButton.disabled = true;
  } else {
    startButton.disabled = false;
  }
}

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: handleDateSelection,
});

startButton.addEventListener('click', () => {
  startButton.disabled = true;
  dateTimePicker.disabled = true;
  startCountdown();
  timerInterval = setInterval(startCountdown, 1000);
});
