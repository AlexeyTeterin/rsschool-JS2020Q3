/* eslint-disable import/extensions */
import CATEGORIES from './categories.js';
import CARDS from './cards.js';

class Game {
  gameField = document.querySelector('.game-field');

  menu = document.querySelector('.menu');

  menuBtn = document.querySelector('.menu-btn');

  overlay = document.querySelector('.overlay');

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

  loadCardsOf(category) {
    this.gameField.classList.add('hidden');
    this.sleep(500).then(() => {
      this.clearGameField();
      const cards = CARDS.filter((card) => card.category === category);
      // console.log(cards);
      cards.forEach((card) => {
        this.createFlipping(card);
      });
    }).then(() => {
      this.gameField.classList.remove('hidden');
      // this.addFlipCardsListener();
    });
  }

  createMenu() {
    CATEGORIES.forEach((cat) => {
      const menuLi = document.createElement('li');
      menuLi.dataset.category = cat;
      menuLi.textContent = cat;
      menuLi.style.setProperty('background-image', `url(./assets/img/_${cat}.svg)`)
      this.menu.append(menuLi);
    });
  }

  createFlipping(card) {
    const createCardImage = () => {
      const cardImage = document.createElement('div');
      cardImage.classList.add('card__image');
      cardImage.style.setProperty('background-image', `url("./assets/img/${card.category}_${card.word}.svg")`);
      return cardImage;
    };

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

    front.append(createCardImage(card), cardTitle, rotateBtn);
    back.append(createCardImage(card), cardTranslation);
    cardElement.append(front, back);
    flipCard.append(cardElement);

    this.gameField.append(flipCard);
  }

  addFlipCardsListener() {
    const playSound = (src) => new Audio(src).play();

    this.gameField.addEventListener('click', (event) => {
      const {
        target,
      } = event;
      if (target.parentElement.classList.contains('card__front')) {
        if (target.classList.contains('card__rotate-btn')) {
          target.parentElement.parentElement.classList.add('rotate');
          return;
        }
        const flipCard = target.parentElement.parentElement.parentElement;
        playSound(flipCard.dataset.sound);
      }
    });

    this.gameField.addEventListener('mouseout', (event) => {
      const rotatedCard = event.target.parentElement.parentElement;
      const relatedTarget = event.relatedTarget;
      const relatedTargetIsGameField = relatedTarget.classList.contains('game-field');
      const relatedTargetIsFlipCard = relatedTarget.classList.contains('flip-card');
      if (!rotatedCard.parentElement.classList.contains('flip-card')) return;
      if (!relatedTargetIsGameField && !relatedTargetIsFlipCard) return;
      rotatedCard.classList.remove('rotate');
    })
  }

  addCategoryListeners() {
    this.gameField.addEventListener('click', (event) => {
      const card = event.target.parentNode;
      if (!card.classList.contains('category-card')) return;
      this.loadCardsOf(card.dataset.category);
    });
    this.menu.addEventListener('click', (event) => {
      const menuLi = event.target;
      if (!menuLi.dataset.category) return;
      this.loadCardsOf(menuLi.dataset.category);
      this.toggleMenu();
    })
  }

  addLogoListener() {
    document.querySelector('.logo').addEventListener('click', () => this.loadCategories());
  }

  addMenuBtnListener() {
    this.menuBtn.addEventListener('click', () => this.toggleMenu());
    this.overlay.addEventListener('click', () => this.toggleMenu());
  }

  toggleMenu() {
    this.menu.classList.toggle('show');
    this.menuBtn.classList.toggle('jump-to-menu');
    this.overlay.classList.toggle('hidden');
  }

  sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));
}

const game = new Game();
game.createMenu();
game.loadCategories();
game.addCategoryListeners();
game.addFlipCardsListener();
game.addLogoListener();
game.addMenuBtnListener();
