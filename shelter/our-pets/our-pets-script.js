const PETS = [];
const VISIBLE_PETS = document.querySelector('.pets');
const ALL_48_PETS = [];

const request = new XMLHttpRequest();
request.open('GET', 'pets.json');
request.responseType = 'json';
request.send();

request.onload = () => {
  const pets = request.response;
  for (const pet of pets) {
    PETS.push(pet);
  }
  for (let i = 0; i < 6; i += 1) {
    ALL_48_PETS.push(...pets);
  }
}

