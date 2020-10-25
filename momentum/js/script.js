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
const BGbtn = document.querySelector('.bg-btn');
const QuoteBtn = document.querySelector('.quote-btn');
const figure = document.querySelector('figure');
const blockquote = document.querySelector('blockquote');
const figcaption = document.querySelector('figcaption');

const APP = {
  base: 'https://raw.githubusercontent.com/irinainina/ready-projects/momentum/momentum/assets/images/',
  images: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg',
    '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg',
    '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'],
  i: 0,
  today_24_images: [],

  run() {
    this.showTime();
    this.showDate();
    this.getName();
    this.getGoal();
    this.getCity();
    this.getWeather();
    this.setToday_24_Images();
    this.setBGGreet();
  },

  generateRandom() {
    return Math.ceil(Math.random() * 20) - 1;
  },

  setToday_24_Images() {
    const setToday6Images = () => {
      const images = [];
      for (let j = 0; j < 6; j += 1) {
        let random = APP.generateRandom();
        while (images.includes(APP.images[random])) {
          random = APP.generateRandom();
        }
        images.push(APP.images[random]);
      }
      return images;
    };

    const today6images = setToday6Images();
    const dayPart = ['night/', 'morning/', 'day/', 'evening/'];
    for (let k = 0; k < 4; k += 1) {
      today6images.forEach((img) => {
        const currentImg = `${dayPart[k]}${img}`;
        APP.today_24_images.push(currentImg);
      });
    }
  },

  viewBgImage(data) {
    const body = document.querySelector('body');
    const src = data;
    const img = document.createElement('img');
    img.src = src;
    img.onload = () => {
      body.style.backgroundImage = `url(${src})`;
    };
  },

  getImage(hour) {
    let index = hour;
    APP.i += 1;
    if (APP.i === 24) APP.i = 0;
    if (typeof index !== 'number') index = APP.i;
    console.log(`index = ${index}`);

    const imageSrc = `${APP.base}${APP.today_24_images[index]}`;
    console.log(imageSrc);
    APP.viewBgImage(imageSrc);
    BGbtn.disabled = true;
    setTimeout(() => {
      BGbtn.disabled = false;
      return true;
    }, 500);
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
    const weekDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday'][today.getDay()];
    const month = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'][today.getMonth()];

    // Output Date
    DATE.innerHTML = `${weekDay}, ${month} ${day}`;
  },

  setBGGreet() {
    const today = new Date();
    const hour = today.getHours();
    let timer = (60 - today.getMinutes()) * 60000 - today.getSeconds() * 1000;
    if (timer <= 0) timer = 1000 * 60 * 60;
    APP.i = hour;

    if (hour < 6) {
      GREETING.textContent = 'Good night,';
    } else if (hour < 12) {
      GREETING.textContent = 'Good morning,';
    } else if (hour < 18) {
      GREETING.textContent = 'Good afternoon,';
    } else {
      GREETING.textContent = 'Good evening,';
    }

    APP.getImage(hour);
    setTimeout(this.setBGGreet, timer);
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
    } else if (event.target.innerText.trim() !== '') {
      localStorage.setItem('name', event.target.innerText);
    } else APP.getName();
  },

  getGoal() {
    if (localStorage.getItem('goal') === null) {
      GOAL.textContent = '...';
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

  clearField(field) {
    const content = field.target;
    content.textContent = '';
    return content;
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
    } else if (event.target.innerText.trim() !== '') {
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
      weatherDescription.textContent = 'Incorrect city name!';
      weatherWind.textContent = '';
      weatherHumidity.textContent = '';
    }
  },

  async getQuote() {
    const url = 'https://programming-quotes-api.herokuapp.com/quotes/random';
    const res = await fetch(url);
    const data = await res.json();

    figure.style.setProperty('opacity', '0');

    if (data.en !== undefined) {
      setTimeout(() => {
        blockquote.textContent = data.en;
        figcaption.textContent = data.author;
        figure.style.setProperty('opacity', '1');
      }, 250);
    }
  },
};

// Event listeners
NAME.addEventListener('keypress', APP.setName);
NAME.addEventListener('click', APP.clearField);
NAME.addEventListener('blur', APP.setName);
GOAL.addEventListener('keypress', APP.setGoal);
GOAL.addEventListener('click', APP.clearField);
GOAL.addEventListener('blur', APP.setGoal);
WEATHER.addEventListener('keypress', APP.setCity);
WEATHER.addEventListener('click', APP.clearField);
WEATHER.addEventListener('blur', APP.setCity);
document.addEventListener('DOMContentLoaded', APP.getWeather);
BGbtn.addEventListener('click', APP.getImage);
document.addEventListener('DOMContentLoaded', APP.getQuote);
QuoteBtn.addEventListener('click', APP.getQuote);

APP.run();
