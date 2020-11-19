const CATEGORIES = [
  'animals',
  'food',
  'nature',
  'human',
  'transport',
  'clothes',
  'emotions',
  'space',
];

const CARDS = [{
    category: 'animals',
    word: 'chicken',
    translation: 'цыпленок',
    sound: '',
  },
  {
    category: 'animals',
    word: 'dog',
    translation: 'собака',
    sound: '',
  },
  {
    category: 'animals',
    word: 'pig',
    translation: 'свинья',
    sound: '',
  },
  {
    category: 'animals',
    word: 'horse',
    translation: 'лошадь',
    sound: '',
  },
]

class Game {
  gameField = document.querySelector('.game-field');

  clearGameField() {
    this.gameField.innerHTML = null;
  }

  loadCategories() {
    this.gameField.classList.add('hidden');
    this.sleep(500).then(() => {
      this.clearGameField();
      CATEGORIES.forEach((cat) => {
        const categoryCard = document.createElement('div');
        const cardImage = document.createElement('div');
        const cardTitle = document.createElement('div');
        categoryCard.classList.add('category-card');
        categoryCard.dataset.category = cat;
        cardImage.classList.add('card__image');
        cardImage.style.setProperty('background-image', `url("./assets/img/_${cat}.svg")`);
        cardTitle.classList.add('card__title');
        cardTitle.textContent = cat;
        categoryCard.append(cardImage, cardTitle);
        this.gameField.append(categoryCard);
      });
    }).then(() => {
      this.gameField.classList.remove('hidden');
    });

  }

  addCategoryListeners() {
    this.gameField.addEventListener('click', (event) => {
      const card = event.target.parentNode;
      if (!card.classList.contains('category-card')) return;
      const category = card.dataset.category;
      this.loadCardsOf(category);
    })
  }

  addLogoListener() {
    document.querySelector('.logo').addEventListener('click', () => this.loadCategories());
  }

  sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

  loadCardsOf(category) {
    this.gameField.classList.add('hidden');
    this.sleep(500).then(() => {
      this.clearGameField();
      const cards = CARDS.filter((card) => card.category === category);
      console.log(cards);
      cards.forEach((card) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        const cardImage = document.createElement('div');
        cardImage.classList.add('card__image');
        cardImage.style.setProperty('background-image', `url("./assets/img/${card.word}.svg")`);
        const cardTitle = document.createElement('div');
        cardTitle.classList.add('card__title');
        cardTitle.textContent = card.word;
        cardElement.append(cardImage, cardTitle);
        this.gameField.append(cardElement);
      })
    }).then(() => {
      this.gameField.classList.remove('hidden');
    })

  }
}

const game = new Game();
game.loadCategories();
game.addCategoryListeners();
game.addLogoListener();
