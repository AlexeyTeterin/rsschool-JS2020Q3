const request = new XMLHttpRequest();
request.open('GET', 'pets.json');
request.responseType = 'json';
request.send();

const PETS = [];

request.onload = () => {
  const pets = request.response;
  for (const pet of pets) {
    PETS.push(pet);
  }
}