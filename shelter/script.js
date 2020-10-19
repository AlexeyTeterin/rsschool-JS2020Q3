const SLIDER_CARDS = Array.from(document.getElementsByClassName('card'));
const SLIDER_BTNS = Array.from(document.getElementsByClassName('arrow'));
const PETS = [];
const POPUP = document.getElementById('popup');
const POPUP_FIELDS = document.getElementsByClassName('field');
const POPUP_CLOSE_BTN = document.getElementById('popup__close-btn');

const request = new XMLHttpRequest();
request.open('GET', '/our-pets/pets.json');
request.responseType = 'json';
request.send();

request.onload = () => {
  const pets = request.response;
  for (const pet of pets) {
    PETS.push(pet);
  }
}

shuffleCards = () => {
  const threePets = [];
  const newThreePets = [];
  generateRandom = () => Math.floor(Math.random() * 8);

  // getting current pets
  SLIDER_CARDS.forEach((card) => {
    PETS.forEach((pet, index) => {
      if (pet.name === card.children[1].innerText) {
        threePets.push(index);
      }
    })
  })

  // generate new three pets
  SLIDER_CARDS.forEach((card) => {
    const card__photo = card.children[0].children[0];
    const card__name = card.children[1];
    let random = generateRandom();

    while (threePets.includes(random) || newThreePets.includes(random)) random = generateRandom();
    newThreePets.push(random);

    card.style.setProperty('opacity', '0');

    setTimeout(() => {
      card__photo.setAttribute('src', PETS[random].img);
      card__photo.setAttribute('alt', PETS[random].name);
      card__name.innerText = PETS[random].name;
    }, 100)

    setTimeout(() => {
      card.style.setProperty('opacity', '1');
    }, 200)
  })
}

SLIDER_BTNS.forEach((btn) => {
  btn.addEventListener('click', () => {
    shuffleCards();
  })
})

// Hide popup window
hidePetInfo = () => {
  POPUP.classList.add('hidden');
}

// Show popup window
showPetInfo = (petName) => {
  let currentPet = {};

  PETS.forEach((pet) => {
    if (pet.name === petName) {
      currentPet = pet;
    }
  })
  console.log(currentPet);

  Array.from(POPUP_FIELDS).forEach((field) => {
    switch (field.id) {
      case 'photo':
        field.children[0].setAttribute('src', currentPet.img);
        field.children[0].setAttribute('alt', currentPet.name);
        break;
      case 'name':
      case 'breed':
      case 'description':
        field.innerHTML = currentPet[field.id];
        break;
      default:
        field.innerHTML = '<b>' + field.id.charAt(0).toUpperCase() + field.id.slice(1) + ': </b>';
        if (typeof currentPet[field.id] === 'object')
          field.innerHTML += currentPet[field.id].join(', ');
        else
          field.innerHTML += currentPet[field.id];
        break;
    }
  })

  POPUP.style.setProperty('height', document.querySelector('body').scrollHeight + 'px');
  POPUP.classList.remove('hidden');
}

// Selecting card to show its info
SLIDER_CARDS.forEach((card) => {
  card.addEventListener('click', () => {
    showPetInfo(card.children[1].innerText);
  })
})

POPUP_CLOSE_BTN.addEventListener('click', () => {
  hidePetInfo();
})

POPUP.addEventListener('click', (event) => {
  if (event.target.id !== 'popup') return;
  else hidePetInfo();
})