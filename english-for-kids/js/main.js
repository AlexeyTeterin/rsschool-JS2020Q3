/* eslint-disable import/extensions */
import CATEGORIES from './categories.js';
import CARDS from './cards.js';

class Game {
  gamePanel = document.querySelector('.game-panel');

  gameField = document.querySelector('.game-field');

  menu = document.querySelector('.menu');

  menuBtn = document.querySelector('.menu-btn');

  overlay = document.querySelector('.overlay');

  playMode = false;

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
      this.toggleFlipCardsTitles();
      this.gameField.classList.remove('hidden');
      // this.addFlipCardsListener();
    });
  }

  createMenu() {
    CATEGORIES.forEach((cat) => {
      const menuLi = document.createElement('li');
      menuLi.dataset.category = cat;
      menuLi.textContent = cat;
      menuLi.style.setProperty('background-image', `url(./assets/img/_${cat}.svg)`);
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

  toggleFlipCardsTitles() {
    document.querySelectorAll('.card__title').forEach((el) => {
      if (!el.parentElement.classList.contains('card__front') && !el.parentElement.classList.contains('card__back')) return;
      el.classList.toggle('hidden', this.playMode);
      // this.sleep(250).then(el.classList.toggle('display-none', this.playMode));
    });
    document.querySelectorAll('.card__rotate-btn').forEach((el) => {
      if (!el.parentElement.classList.contains('card__front') && !el.parentElement.classList.contains('card__back')) return;
      el.classList.toggle('hidden', this.playMode);
      // this.sleep(250).then(el.classList.toggle('display-none', this.playMode));
    });
    document.querySelectorAll('.card__image').forEach((el) => {
      if (!el.parentElement.classList.contains('card__front') && !el.parentElement.classList.contains('card__back')) return;
      // el.classList.toggle('goDownImg', this.playMode);
      // el.classList.toggle('display-none', this.playMode);
    });
  }

  toggleFlipCardsListener() {
    if (!this.playMode) {
      this.gameField.addEventListener('click', this.handleCardFlip);
      this.gameField.addEventListener('mouseout', this.handleCardBackFlip);
    } else {
      this.gameField.removeEventListener('click', this.handleCardFlip);
      this.gameField.removeEventListener('mouseout', this.handleCardBackFlip);
    }
    this.toggleFlipCardsTitles();

    // this.gameField.addEventListener('mouseover', (e) => {
    //   e.stopPropagation();
    //   console.log(e.target)
    //   const rotatedCard = document.querySelector('.rotate');
    //   if (e.target.classList.contains('game-field') && rotatedCard) {
    //     rotatedCard.classList.remove('rotate');
    //   }
    // })
  }

  handleCardFlip(event) {
    const playSound = (src) => new Audio(src).play();
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
  }

  handleCardBackFlip(event) {
    const { relatedTarget } = event;
    console.log(relatedTarget);
    const relatedTargetIsGameField = relatedTarget.classList.contains('game-field');
    if (!relatedTargetIsGameField) return;
    document.querySelector('.rotate').classList.remove('rotate');
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
    });
  }

  addLogoListener() {
    document.querySelector('.logo').addEventListener('click', () => this.loadCategories());
  }

  addMenuBtnListener() {
    this.menuBtn.addEventListener('click', () => this.toggleMenu());
    this.overlay.addEventListener('click', () => this.toggleMenu());
  }

  addToggleModeListener() {
    const toggleBodyClass = () => document.body.classList.toggle('play-mode', this.playMode);

    document.querySelector('#toggle-mode').addEventListener('click', () => {
      this.playMode = !this.playMode;
      toggleBodyClass();
      this.toggleFlipCardsListener();
      this.toggleGamePanel();
    });
  }

  startGame() {
    if (!document.querySelector('.replay-btn')) this.createReplayBtn();
    this.createStars();
  }

  stopGame() {
    this.removeStars();
  }

  createStars() {
    let counter = 8;
    while (counter > 0) {
      const star = document.createElement('div');
      star.classList.add('star', 'star-empty');
      this.gamePanel.append(star);
      counter -= 1;
    }
  }

  createReplayBtn() {
    const replayBtn = document.createElement('div');
    replayBtn.classList.add('replay-btn');
    this.gamePanel.append(replayBtn);
  }

  removeStars() {
    this.gamePanel.querySelectorAll('.star').forEach((star) => star.remove());
  }

  toggleGamePanel() {
    document.querySelector('.game-panel').classList.toggle('hidden', !this.playMode);
    if (this.playMode) this.startGame();
    else this.stopGame();
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
game.toggleFlipCardsListener();
game.addLogoListener();
game.addMenuBtnListener();
game.addToggleModeListener();
