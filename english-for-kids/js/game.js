import CATEGORIES from './categories.js';
import CARDS from './cards.js';
import {
  createElement, scrollTop, shuffle, sleep,
} from './utils.js';
import Menu from './Menu.js';
import Burger from './Burger.js';
import Logo from './Logo.js';
import Controls from './Controls.js';
import FlipCard from './FlipCard.js';
import Footer from './Footer.js';
import PlayMode from './PlayMode.js';
import CategoryCard from './CategoryCard.js';
import Modal from './Modal.js';
import handleStatsSorting from './sorting.js';

export default class Game {
  scores = null;

  elements = {
    gamePanel: document.querySelector('.game-panel'),
    gameField: document.querySelector('.game-field'),
    menu: new Menu(),
    logo: new Logo('English for kids'),
    controls: new Controls(),
    burger: new Burger(),
    footer: new Footer(),
    overlay: document.querySelector('.overlay'),
  }

  playMode = new PlayMode();

  init() {
    this.sound = new Audio();
    this.renderHeader();
    this.renderFooter();
    this.loadCategories();
    this.runHeaderListeners();
    this.runGameFieldListeners();
    this.runStatsPageListeners();
    this.runPlayModeHandler();
    this.parseOrCreateScores();
  }

  renderHeader() {
    const headerEl = document.querySelector('header');
    const navEl = createElement('nav');

    headerEl.prepend(navEl, this.elements.logo, this.elements.controls);
    navEl.append(this.elements.burger, this.elements.menu);
  }

  renderFooter() {
    document.body.append(this.elements.footer);
  }

  renderCategoryName(category) {
    const isDifficultWords = Array.isArray(category);
    const categoryName = isDifficultWords ? 'Difficult words' : category;
    const categoryHeader = createElement('div', 'category-header', categoryName);

    this.elements.gameField.prepend(categoryHeader);
  }

  loadCategories() {
    this.elements.gameField.classList.add('hidden');
    this.clearGamePanel();
    sleep(500)
      .then(() => {
        this.clearGameField();
        CATEGORIES
          .forEach((category) => this.elements.gameField
            .append(new CategoryCard(category)));
      })
      .then(() => {
        this.elements.gameField.classList.remove('hidden');
        this.highlightMenuItem();
        scrollTop();
      });
  }

  loadCardsOf(category) {
    const weakCardsRecieved = Array.isArray(category);
    let cards;
    if (weakCardsRecieved) {
      cards = [];
      category.forEach((weakCard) => {
        cards.push(CARDS.filter((card) => card.word === weakCard.word)[0]);
      });
    } else {
      cards = CARDS.filter((card) => card.category === category);
    }

    this.elements.gameField.classList.add('hidden');
    this.clearGamePanel();
    sleep(500)
      .then(() => {
        this.clearGameField();
        this.renderCategoryName(category);
        this.playMode.reset();
        cards.forEach((card) => this.renderFlipCard(card));
        this.toggleFlipCardsTitles();
        scrollTop();
      })
      .then(() => {
        this.highlightMenuItem(weakCardsRecieved ? '' : category);
        this.elements.gameField.classList.remove('hidden');
        if (this.playMode.isActive) this.startGame();
      });
  }

  loadStats() {
    const getStats = (card) => {
      const correctPercentage = `${((card.correct / (card.correct + card.wrong)) * 100 || 0).toFixed(1)} %`;
      return [
        card.category, card.word, card.translation,
        card.correct, card.wrong, card.trained, correctPercentage,
      ];
    };
    const headColumns = ['category', 'word', 'translation', 'correct', 'wrong', 'trained', '% correct'];
    const statsField = createElement('div', 'stats-field');
    const headRow = createElement('div', ['row', 'head-row']);
    const resetBtn = createElement('button', 'reset-btn', 'Reset');
    const repeatBtn = createElement('button', 'repeat-btn', 'Repeat difficult words');
    const buttons = createElement('div', 'buttons');
    buttons.append(repeatBtn, resetBtn);

    this.elements.gameField.classList.add('hidden');
    sleep(500)
      .then(() => {
        this.stopGame();
        this.clearGameField();
        this.elements.gameField.append(statsField);
        statsField.append(buttons);
        headColumns.forEach((headColumn) => {
          const div = createElement('div', 'sorter', headColumn, headColumn);
          headRow.append(div);
        });
        statsField.append(headRow);

        Object.keys(this.scores).forEach((word) => {
          const row = createElement('div', 'row', '', word);
          const columns = getStats(this.scores[word]);
          columns.forEach((column) => {
            const div = createElement('div', null, column);
            row.append(div);
          });
          statsField.append(row);
        });
      })
      .then(() => this.elements.gameField.classList.remove('hidden'))
      .then(() => scrollTop());
  }

  parseOrCreateScores() {
    function createScoreforCard(card) {
      return {
        word: card.word,
        correct: 0,
        wrong: 0,
        category: card.category,
        trained: 0,
        translation: card.translation,
      };
    }
    this.scores = JSON.parse(localStorage.getItem('englishForKidsScores')) || {};

    CARDS.forEach((card) => {
      if (this.scores[card.word]) return;
      this.scores[card.word] = createScoreforCard(card);
    });
  }

  saveScores(answer) {
    if (answer === 'correct') this.scores[this.playMode.currentCard.word].correct += 1;
    if (answer === 'wrong') this.scores[this.playMode.currentCard.word].wrong += 1;

    localStorage.setItem('englishForKidsScores', JSON.stringify(this.scores));
  }

  clearGameField() {
    this.elements.gameField.innerHTML = null;
  }

  clearGamePanel() {
    const replayBtn = this.elements.gamePanel.querySelector('.replay-btn');
    const stars = this.elements.gamePanel.querySelectorAll('.star');

    this.elements.gamePanel.classList.add('hidden-content');
    sleep(500)
      .then(() => {
        if (replayBtn) replayBtn.remove();
        if (stars) stars.forEach((star) => star.remove());
      })
      .then(() => this.elements.gamePanel.classList.remove('hidden-content'));
  }

  renderFlipCard(card) {
    this.elements.gameField.append(new FlipCard(card));
  }

  toggleFlipCardsTitles() {
    const notAFlipCard = (el) => !el.parentElement.classList.contains('card__front') && !el.parentElement.classList.contains('card__back');

    document.querySelectorAll('.card__title').forEach((el) => {
      if (notAFlipCard(el)) return;
      el.classList.toggle('hidden', this.playMode.isActive);
    });
    document.querySelectorAll('.card__rotate-btn').forEach((el) => {
      if (notAFlipCard(el)) return;
      el.classList.toggle('hidden', this.playMode.isActive);
    });
  }

  togglePlayMode() {
    const toggleBodyClass = () => document.body.classList.toggle('play-mode', this.playMode.isActive);

    this.playMode.isActive = !this.playMode.isActive;
    toggleBodyClass();
    this.toggleFlipCardsTitles();
    this.toggleGamePanel();

    if (!this.playMode.isActive) this.enableAllCards();
  }

  enableAllCards() {
    this.elements.gameField.querySelectorAll('.disabled').forEach((card) => card.classList.remove('disabled'));
  }

  startGame() {
    const flipCardsLoaded = document.querySelector('.flip-card');

    if (!document.querySelector('.replay-btn')) this.createReplayBtn();
    const cards = Array.from(this.elements.gameField.querySelectorAll('.flip-card')).map((card) => card.dataset);

    this.playMode.cards = shuffle(cards);
    [this.playMode.currentCard] = this.playMode.cards;

    if (flipCardsLoaded) document.querySelector('.replay-btn').classList.remove('hidden');
  }

  stopGame() {
    this.elements.gamePanel.innerHTML = null;
    this.playMode.reset();
  }

  async finishGame() {
    const win = !this.playMode.results.includes(false);
    const playFinalSound = () => {
      if (win) new Audio('./assets/audio/finish_true.ogg').play();
      else new Audio('./assets/audio/finish_false.ogg').play();
    };
    const createFinalMessage = () => {
      const {
        mistakes,
      } = this.playMode;
      const src = win ? './assets/img/finish_win.png' : './assets/img/finish_loose.png';
      const message = createElement('div', 'finish-message');
      message.innerText = win ? 'You win!' : `${mistakes} mistake`;
      if (mistakes > 1) message.innerText += 's';
      const img = new Image();
      img.src = src;

      img.onload = () => {
        message.style.setProperty('background-image', `url(${src})`);
        message.style.setProperty('opacity', 1);
      };
      return message;
    };
    const finalMessage = await createFinalMessage();

    this.elements.gameField.classList.add('hidden');
    sleep(1000)
      .then(() => playFinalSound())
      .then(() => {
        this.clearGameField();
        this.elements.gameField.append(finalMessage);
        this.elements.gameField.classList.remove('hidden');
      })
      .then(() => sleep(5000))
      .then(() => {
        if (document.querySelector('.finish-message')) this.loadCategories();
      });
  }

  playCard(card) {
    sleep(1000).then(() => this.playSound(card.sound));
  }

  createStar(answer) {
    const star = createElement('div', 'star');
    if (answer) star.classList.add('star-true');
    this.elements.gamePanel.firstChild.insertAdjacentElement('beforebegin', star);
    sleep(0)
      .then(() => star.style.setProperty('height', '1.5rem'))
      .then(() => sleep(100))
      .then(() => star.style.setProperty('opacity', 1));
  }

  createReplayBtn() {
    const replayBtn = createElement('div', ['replay-btn', 'play-btn', 'hidden']);
    this.elements.gamePanel.append(replayBtn);

    replayBtn.addEventListener('click', () => {
      if (replayBtn.classList.contains('play-btn')) {
        this.playMode.gameStarted = true;
        replayBtn.classList.add('hidden');
        sleep(200).then(() => replayBtn.classList.remove('play-btn'));
        sleep(1000).then(() => replayBtn.classList.remove('hidden'));
      }
      this.playCard(this.playMode.currentCard);
    });
  }

  toggleGamePanel() {
    document.querySelector('.game-panel').classList.toggle('hidden', !this.playMode.isActive);
    this.elements.gameField.classList.toggle('narrow', this.playMode.isActive);
    if (this.playMode.isActive) this.startGame();
    else this.stopGame();
  }

  toggleMenu() {
    this.elements.menu.classList.toggle('show');
    this.elements.burger.classList.toggle('jump-to-menu');
    this.elements.overlay.classList.toggle('hidden');
    this.toggleScroll();
  }

  toggleScroll() {
    const stopScroll = () => {
      const x = window.scrollX;
      const y = window.scrollY;
      window.onscroll = () => window.scrollTo(x, y);
    };

    if (this.elements.menu.classList.contains('show')) {
      stopScroll();
    } else {
      window.onscroll = () => {};
    }
  }

  handleLogoClick(event) {
    const { target } = event;
    const isTitleClick = target.classList.contains('logo__title');
    if (isTitleClick) this.loadCategories();
  }

  handleControlsClick(event) {
    const { target } = event;
    const isStatsBtnClick = target.classList.contains('stats-btn');
    const isToggleModeClick = target.id === 'checkbox';

    if (isStatsBtnClick) {
      this.loadStats();
      this.highlightMenuItem();
    }
    if (isToggleModeClick) {
      this.togglePlayMode();
    }
  }

  runHeaderListeners() {
    this.elements.logo.addEventListener('click', this.handleLogoClick.bind(this));

    this.elements.menu.addEventListener('click', this.handleMenuLiClick.bind(this));

    this.elements.burger.addEventListener('click', this.toggleMenu.bind(this));

    this.elements.overlay.addEventListener('click', this.toggleMenu.bind(this));

    this.elements.controls.addEventListener('click', this.handleControlsClick.bind(this));
  }

  playSound(src) {
    if (src) this.sound.src = src;
    this.sound.play();
  }

  runGameFieldListeners() {
    this.elements.gameField.addEventListener('click', () => this.playSound(), { once: true });
    this.elements.gameField.addEventListener('click', (event) => {
      this.handleCardFlip(event);
      this.handleTrainingClicks(event);
      this.handleCategoryCardClick(event);
    });
    this.elements.gameField.addEventListener('click', handleStatsSorting);

    this.elements.gameField.addEventListener('mouseout', (e) => this.handleCardBackFlip(e));
  }

  runStatsPageListeners() {
    this.elements.gameField.addEventListener('click', (event) => this.handleStatsPageButtonsClicks(event));
  }

  runPlayModeHandler() {
    this.elements.gameField.addEventListener('click', (event) => {
      const {
        gameStarted,
        currentCard,
        setCorrectAnswer,
        setWrongAnswer,
        hasNextCard,
        setNextCard,
      } = this.playMode;
      const clickedCard = event.target.parentElement.parentElement.parentElement;
      const clickOutsideCard = !clickedCard.classList.contains('flip-card');
      const cardDisabled = clickedCard.classList.contains('disabled');

      if (!gameStarted || cardDisabled || clickOutsideCard) return;

      const answerIsCorrect = clickedCard.dataset.word === currentCard.word;
      if (answerIsCorrect) {
        sleep(0)
          .then(() => new Audio('./assets/audio/answerIsCorrect.wav').play())
          .then(() => {
            this.createStar(true);
            setCorrectAnswer();
            clickedCard.classList.add('disabled');
            this.saveScores('correct');
            if (hasNextCard()) {
              setNextCard();
              this.playCard(this.playMode.currentCard);
            } else {
              this.finishGame();
            }
          });
      }

      if (!answerIsCorrect) {
        sleep(0)
          .then(() => new Audio('./assets/audio/answerIsWrong.wav').play())
          .then(() => {
            this.createStar(false);
            setWrongAnswer();
            this.playMode.mistakes += 1;
            this.saveScores('wrong');
          });
      }
    });
  }

  handleMenuLiClick(event) {
    const menuLi = event.target;

    if (menuLi.classList.contains('home-link')) {
      this.loadCategories();
      this.toggleMenu();
    }

    if (menuLi.dataset.category) {
      this.loadCardsOf(menuLi.dataset.category);
      this.toggleMenu();
    }
  }

  handleCardFlip(event) {
    const {
      target,
    } = event;

    if (this.playMode.isActive) return;

    if (target.parentElement.classList.contains('card__front')) {
      if (target.classList.contains('card__rotate-btn')) {
        target.parentElement.parentElement.classList.add('rotate');
        return;
      }
      const flipCard = target.parentElement.parentElement.parentElement;
      this.playSound(flipCard.dataset.sound);
    }
  }

  handleCardBackFlip(event) {
    const {
      relatedTarget,
    } = event;
    const rotatedCard = this.elements.gameField.querySelector('.rotate');

    if (this.playMode.isActive) return;
    if (!relatedTarget) return;
    if (!relatedTarget.classList.contains('game-field')) return;

    if (rotatedCard) rotatedCard.classList.remove('rotate');
  }

  handleCategoryCardClick(event) {
    const target = event.target.parentNode;
    const isCategoryCardClick = target.classList.contains('category-card');

    if (!isCategoryCardClick) return;
    this.loadCardsOf(target.dataset.category);
  }

  handleTrainingClicks(event) {
    if (this.playMode.isActive) return;
    const flipCard = event.target.parentElement.parentElement.parentElement;
    const {
      word,
    } = flipCard.dataset;
    if (flipCard.classList.contains('flip-card')) {
      if (!this.scores[word]) this.scores[word] = word.word;
      this.scores[word].trained += 1;
      this.saveScores();
    }
  }

  renderModal() {
    this.elements.modal = new Modal();

    this.elements.modal.addEventListener('click', this.handleModalButtonsClicks.bind(this));
  }

  handleStatsPageButtonsClicks(event) {
    if (event.target.classList.contains('reset-btn')) this.renderModal();

    if (event.target.classList.contains('repeat-btn')) {
      const weakWords = [];
      Object.keys(this.scores)
        .forEach((el) => {
          const card = this.scores[el];
          if (card.wrong > 0) weakWords.push(card);
        });
      weakWords
        .sort((a, b) => {
          const percentage = (card) => card.wrong / (card.correct + card.wrong);
          if (percentage(a) < percentage(b)) return 1;
          if (percentage(a) > percentage(b)) return -1;
          return 0;
        })
        .splice(8);
      this.loadCardsOf(weakWords);
    }
  }

  handleModalButtonsClicks(event) {
    const isYesBtnClick = event.target.classList.contains('yes-btn');
    if (isYesBtnClick) {
      localStorage.removeItem('englishForKidsScores');
      this.parseOrCreateScores();
      this.loadStats();
    }
    this.elements.modal.classList.add('hidden');
    sleep(250).then(() => this.elements.modal.remove());
  }

  highlightMenuItem(category) {
    const menuItems = Array.from(this.elements.menu.getElementsByTagName('li'));
    menuItems.forEach((li) => li.classList.remove('active'));
    if (category) {
      const selectedMenuItem = menuItems.filter((li) => li.dataset.category === category)[0];
      selectedMenuItem.classList.add('active');
    }
  }
}
