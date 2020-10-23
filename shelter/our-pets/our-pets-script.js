const VISIBLE_PETS = document.querySelectorAll('.pet-card');
const PAGE = document.querySelector('.position');
const PAGE_NEXT = document.querySelector('.arrow-right');
const PAGE_PREV = document.querySelector('.arrow-left');
const PAGE_END = document.querySelector('.arrow-end');
const PAGE_START = document.querySelector('.arrow-start');
const POPUP = document.getElementById('popup');
const POPUP_FIELDS = document.getElementsByClassName('field');
const POPUP_CLOSE_BTN = document.getElementById('popup__close-btn');

const APP = {
  numOfPages: 6,
  PETS: [],
  ALL_48_PETS: [],

  init() {
    const request = new XMLHttpRequest();
    request.open('GET', 'pets.json');
    request.responseType = 'json';
    request.send();
    request.onload = () => {
      const pets = request.response;
      pets.forEach((pet) => this.PETS.push(pet));
    };
  },

  generateRandom() {
    return Math.floor(Math.random() * 8);
  },

  generate48pets() {
    const PETS_48_INDEXES = [];

    function generate8pets() {
      const newEightPets = [];

      for (let i = 0; i < 8; i += 1) {
        let random = APP.generateRandom();

        while (newEightPets.includes(random) ||
          (newEightPets.length < 3 &&
            PETS_48_INDEXES.slice(PETS_48_INDEXES.length - 4).includes(random))) {
          random = APP.generateRandom();
        }
        newEightPets.push(random);
      }
      return newEightPets;
    }

    for (let i = 0; i < 6; i += 1) {
      PETS_48_INDEXES.push(...generate8pets());
    }

    return PETS_48_INDEXES;
  },

  turnBtn(button, position) {
    if (position === 'on') button.removeAttribute('disabled');
    if (position === 'off') button.setAttribute('disabled', '');
    else;
  },

  fillCards(offset) {
    let page = offset;
    if (offset === undefined) page = 0;

    VISIBLE_PETS.forEach((card, index) => {
      const CARD__PHOTO = card.children[0].children[0];
      const CARD__NAME = card.children[1];
      const selectedPet = APP.PETS[APP.ALL_48_PETS[index + (48 / APP.numOfPages) * page]];

      if (selectedPet !== undefined) {
        card.classList.add('hidden');

        setTimeout(() => {
          CARD__PHOTO.setAttribute('src', selectedPet.img);
          CARD__PHOTO.setAttribute('alt', selectedPet.name);
          CARD__NAME.innerText = selectedPet.name;
          card.classList.remove('hidden');
        }, 100);
      }
    });
  },

  getNumOfPages() {
    if (window.innerWidth >= 768) this.numOfPages = 8;
    if (window.innerWidth >= 1280) this.numOfPages = 6;
    if (window.innerWidth < 768) this.numOfPages = 16;

    if (parseInt(PAGE.textContent, 10) >= this.numOfPages) {
      PAGE.textContent = APP.numOfPages;
      this.turnBtn(PAGE_NEXT, 'off');
      this.turnBtn(PAGE_END, 'off');
    }
    if (parseInt(PAGE.textContent, 10) < this.numOfPages) {
      this.turnBtn(PAGE_NEXT, 'on');
      this.turnBtn(PAGE_END, 'on');
    }

    this.fillCards(parseInt(PAGE.textContent, 10) - 1);
  },

  nextPage(index) {
    PAGE.textContent = parseInt(PAGE.textContent, 10) + 1;

    if (index !== undefined) PAGE.textContent = index;

    if (PAGE.textContent > 1) {
      this.turnBtn(PAGE_PREV, 'on');
      this.turnBtn(PAGE_START, 'on');
    }

    if (PAGE.textContent === APP.numOfPages.toString()) {
      this.turnBtn(PAGE_NEXT, 'off');
      this.turnBtn(PAGE_END, 'off');
    }

    this.fillCards(parseInt(PAGE.textContent, 10) - 1);
  },

  prevPage(index) {
    PAGE.textContent = parseInt(PAGE.textContent, 10) - 1;

    if (index !== undefined) PAGE.textContent = index;

    if (PAGE.textContent < APP.numOfPages) {
      this.turnBtn(PAGE_NEXT, 'on');
      this.turnBtn(PAGE_END, 'on');
    }
    if (PAGE.textContent === '1') {
      this.turnBtn(PAGE_PREV, 'off');
      this.turnBtn(PAGE_START, 'off');
    }

    this.fillCards(parseInt(PAGE.textContent, 10) - 1);
  },

  stopScroll() {
    const x = window.scrollX;
    const y = window.scrollY;
    window.onscroll = () => window.scrollTo(x, y);
  },

  // Hide popup window
  hidePetInfo() {
    POPUP.classList.add('hidden');
    window.onscroll = () => {};
  },

  // Show popup window
  showPetInfo(petName) {
    let currentPet = {};

    this.stopScroll();

    this.PETS.forEach((pet) => {
      if (pet.name === petName) {
        currentPet = pet;
      }
    });

    Array.from(POPUP_FIELDS).forEach((field) => {
      const FIELD = field;
      switch (FIELD.id) {
        case 'photo':
          FIELD.children[0].setAttribute('src', currentPet.img);
          FIELD.children[0].setAttribute('alt', currentPet.name);
          break;
        case 'name':
        case 'description':
          FIELD.innerHTML = currentPet[field.id];
          break;
        case 'breed':
          FIELD.innerHTML = `${currentPet.type} - ${currentPet.breed}`;
          break;
        default:
          FIELD.innerHTML = `<b>${field.id.charAt(0).toUpperCase()}${field.id.slice(1)}: </b>`;
          if (typeof currentPet[field.id] === 'object') FIELD.innerHTML += currentPet[field.id].join(', ');
          else FIELD.innerHTML += currentPet[field.id];
          break;
      }
      return FIELD;
    });

    POPUP.classList.remove('hidden');
  },
};

APP.init();

window.addEventListener('load', () => {
  APP.ALL_48_PETS.push(...APP.generate48pets());
  APP.getNumOfPages();
  setTimeout(() => {
    document.querySelector('.pets').classList.remove('hidden');
  }, 250);
});

window.addEventListener('resize', () => {
  APP.getNumOfPages();
});

PAGE_NEXT.addEventListener('click', () => {
  APP.nextPage();
});
PAGE_PREV.addEventListener('click', () => {
  APP.prevPage();
});

PAGE_END.addEventListener('click', () => {
  APP.nextPage(APP.numOfPages);
});

PAGE_START.addEventListener('click', () => {
  APP.prevPage(1);
});

// Click on card calls for popup window
VISIBLE_PETS.forEach((card) => {
  card.addEventListener('click', () => {
    APP.showPetInfo(card.children[1].innerText);
  });
});

// Click on close button
POPUP_CLOSE_BTN.addEventListener('click', () => {
  APP.hidePetInfo();
});

// Click on popup's background
POPUP.addEventListener('click', (event) => {
  if (event.target.id !== 'popup');
  else APP.hidePetInfo();
});