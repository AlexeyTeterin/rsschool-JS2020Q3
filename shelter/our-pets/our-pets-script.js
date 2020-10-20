const PETS = [];

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

// const LOGO1 = document.querySelectorAll('.logo');
