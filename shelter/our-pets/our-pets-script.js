const PETS = [];
const VISIBLE_PETS = document.querySelectorAll('.pet-card');
const ALL_48_PETS = [];
const PAGE = document.querySelector('.position');
const PAGE_NEXT = document.querySelector('.arrow-right');
const PAGE_PREV = document.querySelector('.arrow-left');
const PAGE_END = document.querySelector('.arrow-end');
const PAGE_START = document.querySelector('.arrow-start');
let numOfPages;

const request = new XMLHttpRequest();
request.open('GET', 'pets.json');
request.responseType = 'json';
request.send();

request.onload = () => {
  const pets = request.response;
  for (const pet of pets) {
    PETS.push(pet);
  }
}

generate48pets = () => {
  const pets_48_indexes = [];

  generate8pets = () => {
    const newEightPets = [];
    generateRandom = () => Math.floor(Math.random() * 8);

    for (let i = 0; i < 8; i += 1) {
      let random = generateRandom();

      while (newEightPets.includes(random) ||
        (newEightPets.length < 4 &&
          pets_48_indexes.slice(pets_48_indexes.length - 2).includes(random)))
        random = generateRandom();
      newEightPets.push(random);
    }
    return newEightPets;
  }

  for (let i = 0; i < 6; i += 1) {
    pets_48_indexes.push(...generate8pets());
  }

  return pets_48_indexes;
}

fillCards = (offset) => {

  if (offset === undefined) offset = 0;

  VISIBLE_PETS.forEach((card, index) => {
    const card__photo = card.children[0].children[0];
    const card__name = card.children[1];
    const selectedPet = PETS[ALL_48_PETS[index + (48 / numOfPages) * offset]];

    if (selectedPet !== undefined) {
      card__photo.setAttribute('src', selectedPet.img);
      card__photo.setAttribute('alt', selectedPet.name);
      card__name.innerText = selectedPet.name;
    }
  })
}

turnBtn = (button_name, position) => {
  if (position === 'on') button_name.removeAttribute('disabled');
  if (position === 'off') button_name.setAttribute('disabled', '');
  else return;
}

getNumOfPages = () => {
  if (window.innerWidth >= 768) numOfPages = 8;
  if (window.innerWidth >= 1280) numOfPages = 6;
  if (window.innerWidth < 768) numOfPages = 16;

  if (parseInt(PAGE.textContent) >= numOfPages) {
    PAGE.textContent = numOfPages;
    turnBtn(PAGE_NEXT, 'off');
    turnBtn(PAGE_END, 'off');
  }
  if (parseInt(PAGE.textContent) < numOfPages) {
    turnBtn(PAGE_NEXT, 'on');
    turnBtn(PAGE_END, 'on');
  }

  fillCards(parseInt(PAGE.textContent) - 1);
}

nextPage = (index) => {
  PAGE.textContent = parseInt(PAGE.textContent) + 1;

  if (index !== undefined) PAGE.textContent = index;

  if (PAGE.textContent > 1) {
    turnBtn(PAGE_PREV, 'on');
    turnBtn(PAGE_START, 'on');
  }

  if (PAGE.textContent === numOfPages.toString()) {
    turnBtn(PAGE_NEXT, 'off');
    turnBtn(PAGE_END, 'off');
  }

  fillCards(parseInt(PAGE.textContent) - 1);
}

prevPage = (index) => {
  PAGE.textContent = parseInt(PAGE.textContent) - 1;

  if (index !== undefined) PAGE.textContent = index;

  if (PAGE.textContent < numOfPages) {
    turnBtn(PAGE_NEXT, 'on');
    turnBtn(PAGE_END, 'on');
  }
  if (PAGE.textContent === '1') {
    turnBtn(PAGE_PREV, 'off');
    turnBtn(PAGE_START, 'off');
  }

  fillCards(parseInt(PAGE.textContent) - 1);
}

window.addEventListener('load', () => {
  ALL_48_PETS.push(...generate48pets());
  getNumOfPages();
})

window.addEventListener('resize', () => {
  getNumOfPages();
})

PAGE_NEXT.addEventListener('click', () => {
  nextPage();
})
PAGE_PREV.addEventListener('click', () => {
  prevPage();
})

PAGE_END.addEventListener('click', () => {
  nextPage(numOfPages);
})

PAGE_START.addEventListener('click', () => {
  prevPage(1);
})