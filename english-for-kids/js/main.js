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

const CARDS = [
  {
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

  loadCategories() {
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
  }
  
  addCategoryListeners() {
    this.gameField.addEventListener('click', (event) => {
      const card = event.target.parentNode;
      if (!card.classList.contains('category-card')) return;
      const category = card.dataset.category;
      this.loadCardsOf(category);
    })
  }
  
  delay(ms) {
    
  }
  
  loadCardsOf(category) {
    this.gameField.classList.add('hidden');
    
    this.gameField.innerHTML = null;
    const words = CARDS.filter((card) => card.category === category);
    console.log(words);
    
  }  
}

const game = new Game();
game.loadCategories();
game.addCategoryListeners();
