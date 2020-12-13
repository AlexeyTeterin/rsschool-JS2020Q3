const SLIDER_CARDS = Array.from(document.getElementsByClassName('card'));
const SLIDER_BTNS = Array.from(document.getElementsByClassName('arrow'));
const POPUP = document.getElementById('popup');
const POPUP_FIELDS = document.getElementsByClassName('field');
const POPUP_CLOSE_BTN = document.getElementById('popup__close-btn');

const APP = {
  PETS: [],

  init() {
    const request = new XMLHttpRequest();
    request.open('GET', 'our-pets/pets.json');
    request.responseType = 'json';
    request.send();

    request.onload = () => {
      const pets = request.response;
      pets.forEach((pet) => this.PETS.push(pet));
    };
  },

  // Random number (1 - 8) generator
  generateRandom() {
    return Math.floor(Math.random() * 8);
  },

  // Randomly shuffle cards
  shuffleCards() {
    const threePets = [];
    const newThreePets = [];

    // getting current pets
    SLIDER_CARDS.forEach((card) => {
      this.PETS.forEach((pet, index) => {
        if (pet.name === card.children[1].innerText) {
          threePets.push(index);
        }
      });
    });

    // generate new three pets
    SLIDER_CARDS.forEach((card) => {
      const CARD__PHOTO = card.children[0].children[0];
      const CARD__NAME = card.children[1];
      let random = this.generateRandom();

      while (threePets.includes(random) || newThreePets.includes(random)) {
        random = this.generateRandom();
      }
      newThreePets.push(random);

      card.style.setProperty('opacity', '0');

      setTimeout(() => {
        CARD__PHOTO.setAttribute('src', this.PETS[random].img.slice(3));
        CARD__PHOTO.setAttribute('alt', this.PETS[random].name);
        CARD__NAME.innerText = this.PETS[random].name;
        card.style.setProperty('opacity', '1');
      }, 100);
    });
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
          FIELD.children[0].setAttribute('src', currentPet.img.slice(3));
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

  stopScroll() {
    const x = window.scrollX;
    const y = window.scrollY;
    window.onscroll = () => window.scrollTo(x, y);
  },
};

APP.init();

// Click on arrows calls cards shuffling
SLIDER_BTNS.forEach((btn) => {
  btn.addEventListener('click', () => {
    APP.shuffleCards();
  });
});

// Click on card opens popup window
SLIDER_CARDS.forEach((card) => {
  card.addEventListener('click', () => {
    APP.showPetInfo(card.children[1].innerText);
  });
});

// Click on close button hides popup
POPUP_CLOSE_BTN.addEventListener('click', () => {
  APP.hidePetInfo();
});

// Click on popup's background hides popup
POPUP.addEventListener('click', (event) => {
  if (event.target.id !== 'popup');
  else APP.hidePetInfo();
});
