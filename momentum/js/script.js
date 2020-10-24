// DOM Elements
const TIME = document.getElementById('time');
const DATE = document.getElementById('date');
const GREETING = document.getElementById('greeting');
const NAME = document.getElementById('name');
const GOAL = document.getElementById('goal');
const WEATHER = document.getElementById('weather');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const weatherWind = document.querySelector('.weather-wind');
const weatherHumidity = document.querySelector('.weather-humidity');

const APP = {
  run() {
    this.showTime();
    this.showDate();
    this.setBGGreet();
    this.getName();
    this.getGoal();
    this.getCity();
    this.getWeather();
  },

  showTime() {
    const today = new Date();
    const hour = today.getHours();
    const min = today.getMinutes();
    const sec = today.getSeconds();

    // Add zeros
    const addZero = (n) => (parseInt(n, 10) < 10 ? '0' : '') + n;

    // Output Time
    TIME.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;

    setTimeout(APP.showTime, 1000);
  },

  showDate() {
    const today = new Date();
    const day = today.getDate();
    const weekDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()];
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][today.getMonth()];

    // Output Date
    DATE.innerHTML = `${weekDay}, ${month} ${day}`;
  },

  setBGGreet() {
    const today = new Date();
    const hour = today.getHours();

    if (hour < 12) {
      document.body.style.backgroundImage = "url('../img/morning.jpg')";
      GREETING.textContent = 'Good morning';
    } else if (hour < 18) {
      document.body.style.backgroundImage = "url('../img/afternoon.jpg')";
      GREETING.textContent = 'Good afternoon';
    } else {
      document.body.style.backgroundImage = "url('../img/evening.jpg')";
      GREETING.textContent = 'Good evening';
      document.body.style.color = 'white';
    }
  },

  getName() {
    if (localStorage.getItem('name') === null) {
      NAME.textContent = '[Enter yor name]';
    } else {
      NAME.textContent = localStorage.getItem('name');
    }
  },

  setName(event) {
    if (event.type === 'keypress') {
      if (event.which === 13 || event.keyCode === 13) {
        NAME.blur();
      }
    } else if (event.target.innerText !== '') {
      localStorage.setItem('name', event.target.innerText);
    } else APP.getName();
  },

  getGoal() {
    if (localStorage.getItem('goal') === null) {
      GOAL.textContent = '[Enter your goal]';
    } else {
      GOAL.textContent = localStorage.getItem('goal');
    }
  },

  setGoal(event) {
    if (event.type === 'keypress') {
      if (event.which === 13 || event.keyCode === 13) {
        GOAL.blur();
      }
    } else if (event.target.innerText !== '') {
      localStorage.setItem('goal', event.target.innerText);
    } else APP.getGoal();
  },

  getCity() {
    if (localStorage.getItem('city') === null) {
      WEATHER.textContent = '[Enter yor city]';
    } else {
      WEATHER.textContent = localStorage.getItem('city');
    }
  },

  setCity(event) {
    if (event.type === 'keypress') {
      if (event.which === 13 || event.keyCode === 13) {
        APP.getWeather();
        WEATHER.blur();
      }
    } else if (event.target.innerText !== '') {
      localStorage.setItem('city', event.target.innerText);
    } else {
      APP.getCity();
      APP.getWeather();
    }
  },

  async getWeather() {
    const APIkey = '1ab9afb1a4fe7697d9c2df60ecdab26c';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER.textContent}&lang=en&appid=${APIkey}&units=metric`;
    try {
      const res = await fetch(url);
      const data = await res.json();

      weatherIcon.classList.add(`owf-${data.weather[0].id}`);
      temperature.textContent = `${data.main.temp}°C`;
      weatherDescription.textContent = data.weather[0].description;
      weatherWind.textContent = `Wind: ${data.wind.speed} m/s`;
      weatherHumidity.textContent = `Humidity: ${data.main.humidity}%`;
    } catch (error) {
      weatherIcon.className = 'weather-icon owf';
      temperature.textContent = '';
      weatherDescription.textContent = 'Город с таким название не найден!';
      weatherWind.textContent = '';
      weatherHumidity.textContent = '';
    }
  },
};

// Event listeners
NAME.addEventListener('keypress', APP.setName);
NAME.addEventListener('blur', APP.setName);
GOAL.addEventListener('keypress', APP.setGoal);
GOAL.addEventListener('blur', APP.setGoal);
WEATHER.addEventListener('keypress', APP.setCity);
WEATHER.addEventListener('blur', APP.setCity);
// WEATHER.addEventListener('blur', APP.getWeather);
document.addEventListener('DOMContentLoaded', APP.getWeather);

APP.run();