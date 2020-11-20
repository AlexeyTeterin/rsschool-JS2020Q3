import {CATEGORIES} from './categories.js';
import {CARDS} from './cards.js';

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

  playSound(src) {
    const audio = new Audio();
    audio.src = src;
    audio.play();
  }

  addFlipCardsListener() {
    this.gameField.addEventListener('click', (event) => {
      const target = event.target;
      if (target.parentElement.classList.contains('card__front')) {
        if (target.classList.contains('card__rotate-btn')) {
          target.parentElement.parentElement.classList.add('rotate');
          return;
        }
        const flipCard = target.parentElement.parentElement.parentElement;
        this.playSound(flipCard.dataset.sound);
      }

    })

    document.querySelectorAll('.flip-card').forEach((card) => {
      card.addEventListener('mouseleave', (event) => {
        const target = event.target.children[0];
        target.classList.remove('rotate');
      });
    })
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

  createCardImage(card) {
    const cardImage = document.createElement('div');
    cardImage.classList.add('card__image');
    cardImage.style.setProperty('background-image', `url("./assets/img/${card.category}_${card.word}.svg")`);
    return cardImage;
  }

  createFlipping(card) {
    const flipCard = document.createElement('div');
    flipCard.classList.add('flip-card');
    // flipCard.dataset.category = card.category;
    flipCard.dataset.word = card.word;
    flipCard.dataset.sound = card.sound;

    const cardElement = document.createElement('div');
    cardElement.classList.add('card');

    const front = document.createElement('div');
    front.classList.add('card__front');
    const back = document.createElement('div');
    back.classList.add('card__back');

    const cardTitle = document.createElement('div');
    cardTitle.classList.add('card__title');
    cardTitle.textContent = card.word;
    const cardTranslation = document.createElement('div');
    cardTranslation.classList.add('card__title');
    cardTranslation.textContent = card.translation;
    const rotateBtn = document.createElement('div');
    rotateBtn.classList.add('card__rotate-btn');

    front.append(this.createCardImage(card), cardTitle, rotateBtn);
    back.append(this.createCardImage(card), cardTranslation);
    cardElement.append(front, back);
    flipCard.append(cardElement);

    return flipCard;
  }

  loadCardsOf(category) {
    this.gameField.classList.add('hidden');
    this.sleep(500).then(() => {
      this.clearGameField();
      const cards = CARDS.filter((card) => card.category === category);
      console.log(cards);
      cards.forEach((card) => {
        this.gameField.append(this.createFlipping(card));
      })
    }).then(() => {
      this.gameField.classList.remove('hidden');
      this.addFlipCardsListener();
    })
  }
}

const game = new Game();
game.loadCategories();
game.addCategoryListeners();
game.addLogoListener();
