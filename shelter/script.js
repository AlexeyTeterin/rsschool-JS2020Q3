const SLIDER_CARDS = Array.from(document.getElementsByClassName('card'));
const SLIDER_BTNS = Array.from(document.getElementsByClassName('arrow'));
const PETS = [];

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
    card__photo.setAttribute('src', PETS[random].img);
    card__photo.setAttribute('alt', PETS[random].name);
    card__name.innerText = PETS[random].name;
  })
}

SLIDER_BTNS.forEach((btn) => {
  btn.addEventListener('click', () => {
    shuffleCards();
  })
})