import CATEGORIES from './categories.js';
import CARDS from './cards.js';
import {
  createElement, scrollTop, shuffle, sleep, getDifficultCards,
} from './utils.js';
import Menu from './Menu.js';
import Burger from './Burger.js';
import Logo from './Logo.js';
import Controls from './Controls.js';
import FlipCard from './FlipCard.js';
import Footer from './Footer.js';
import State from './State.js';
import CategoryCard from './CategoryCard.js';
import Modal from './Modal.js';
import StatsPanel from './StatsPanel.js';
import FinalMessage from './FinalMessage.js';

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

  state = new State();

  init() {
    this.sound = new Audio();
    this.renderHeader();
    this.renderFooter();
    this.renderCategoryCards();
    this.runHeaderListeners();
    this.runGameFieldListeners();
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

  renderCategoryName() {
    const categoryHeader = createElement('div', 'category-header', this.state.category);

    this.elements.gameField.prepend(categoryHeader);
  }

  renderCategoryCards() {
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
        this.setMenuSelection(null);
        scrollTop();
      });
  }

  renderFlipCards() {
    const { gameField } = this.elements;
    const { cards } = this.state;

    gameField.classList.add('hidden');
    this.clearGamePanel();
    sleep(500)
      .then(() => {
        this.clearGameField();
        this.renderCategoryName();
        this.state.reset();
        cards.forEach((card) => gameField.append(new FlipCard(card)));
        this.toggleFlipCardsTitles();
        scrollTop();
      })
      .then(() => {
        this.setMenuSelection(this.state.category);
        gameField.classList.remove('hidden');
        if (this.state.isPlayMode) this.startGame();
      });
  }

  renderStatsPanel() {
    const { gameField } = this.elements;

    this.stopGame();
    gameField.classList.add('hidden');
    sleep(500).then(() => {
      this.clearGameField();
      const statsPanel = new StatsPanel(this.scores);
      gameField.append(statsPanel);
      statsPanel.addEventListener('click', this.handleStatsPanelBtnsClick.bind(this));
      gameField.classList.remove('hidden');
      scrollTop();
    });
  }

  renderModal() {
    this.elements.modal = new Modal();

    this.elements.modal.addEventListener('click', this.handleModalButtonsClicks.bind(this));
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
    if (answer === 'correct') this.scores[this.state.currentCard.word].correct += 1;
    if (answer === 'wrong') this.scores[this.state.currentCard.word].wrong += 1;

    localStorage.setItem('englishForKidsScores', JSON.stringify(this.scores));
  }

  clearGameField() {
    this.elements.gameField.innerHTML = null;
  }

  clearGamePanel() {
    const { gamePanel } = this.elements;
    const replayBtn = gamePanel.querySelector('.replay-btn');
    const stars = gamePanel.querySelectorAll('.star');

    gamePanel.classList.add('hidden-content');
    sleep(500).then(() => {
      if (replayBtn) replayBtn.remove();
      if (stars) stars.forEach((star) => star.remove());
      gamePanel.classList.remove('hidden-content');
    });
  }

  toggleFlipCardsTitles() {
    const notAFlipCard = (el) => !el.parentElement.classList.contains('card__front') && !el.parentElement.classList.contains('card__back');

    document.querySelectorAll('.card__title').forEach((el) => {
      if (notAFlipCard(el)) return;
      el.classList.toggle('hidden', this.state.isPlayMode);
    });
    document.querySelectorAll('.card__rotate-btn').forEach((el) => {
      if (notAFlipCard(el)) return;
      el.classList.toggle('hidden', this.state.isPlayMode);
    });
  }

  togglePlayMode() {
    const { isPlayMode } = this.state;
    const { gameField } = this.elements;

    this.state.isPlayMode = !isPlayMode;
    document.body.classList.toggle('play-mode', isPlayMode);

    this.toggleFlipCardsTitles();
    this.toggleGamePanel();

    if (this.state.isPlayMode) {
      gameField.addEventListener('click', this.handlePlayModeAnswers.bind(this));
    } else {
      this.setAllCardsActive();
      gameField.removeEventListener('click', this.handlePlayModeAnswers.bind(this));
    }
  }

  setAllCardsActive() {
    this.elements.gameField.querySelectorAll('.disabled').forEach((card) => card.classList.remove('disabled'));
  }

  startGame() {
    const flipCardsLoaded = document.querySelector('.flip-card');

    if (!document.querySelector('.replay-btn')) this.renderReplayBtn();
    const cards = Array.from(this.elements.gameField.querySelectorAll('.flip-card')).map((card) => card.dataset);

    this.state.cards = shuffle(cards);
    [this.state.currentCard] = this.state.cards;

    if (flipCardsLoaded) document.querySelector('.replay-btn').classList.remove('hidden');
  }

  stopGame() {
    this.elements.gamePanel.innerHTML = null;
    this.state.reset();
  }

  finishGame() {
    const win = !this.state.results.includes(false);
    const finalSound = win ? './assets/audio/finish_true.ogg' : './assets/audio/finish_false.ogg';
    const finalMessage = new FinalMessage(this.state);

    this.elements.gameField.classList.add('hidden');
    sleep(1000)
      .then(() => {
        new Audio(finalSound).play();
        this.clearGameField();
        this.elements.gameField.append(finalMessage);
        this.elements.gameField.classList.remove('hidden');
      })
      .then(() => sleep(5000))
      .then(() => {
        const isFinalMessageActive = document.querySelector('.finish-message');
        if (isFinalMessageActive) this.renderCategoryCards();
      });
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

  renderReplayBtn() {
    const replayBtn = createElement('div', ['replay-btn', 'play-btn', 'hidden']);
    this.elements.gamePanel.append(replayBtn);

    replayBtn.addEventListener('click', () => {
      if (replayBtn.classList.contains('play-btn')) {
        this.state.gameStarted = true;
        replayBtn.classList.add('hidden');
        sleep(200).then(() => replayBtn.classList.remove('play-btn'));
        sleep(1000).then(() => replayBtn.classList.remove('hidden'));
      }
      this.playCardAudio(this.state.currentCard.sound);
    });
  }

  toggleGamePanel() {
    document.querySelector('.game-panel').classList.toggle('hidden', !this.state.isPlayMode);
    this.elements.gameField.classList.toggle('narrow', this.state.isPlayMode);
    if (this.state.isPlayMode) this.startGame();
    else this.stopGame();
  }

  toggleMenu() {
    this.elements.menu.classList.toggle('show');
    this.elements.burger.classList.toggle('jump-to-menu');
    this.elements.overlay.classList.toggle('hidden');
    this.toggleScrollLock();
  }

  toggleScrollLock() {
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
    if (isTitleClick) this.renderCategoryCards();
  }

  handleControlsClick(event) {
    const { target } = event;
    const isStatsBtnClick = target.classList.contains('stats-btn');
    const isToggleModeClick = target.id === 'checkbox';

    if (isStatsBtnClick) {
      this.renderStatsPanel();
      this.setMenuSelection(null);
    }
    if (isToggleModeClick) {
      this.togglePlayMode();
    }
  }

  playCardAudio(src) {
    if (src) this.sound.src = src;
    sleep(1000).then(() => this.sound.play());
  }

  runHeaderListeners() {
    const {
      logo, menu, burger, overlay, controls,
    } = this.elements;

    logo.addEventListener('click', this.handleLogoClick.bind(this));
    menu.addEventListener('click', this.handleMenuLiClick.bind(this));
    burger.addEventListener('click', this.toggleMenu.bind(this));
    overlay.addEventListener('click', this.toggleMenu.bind(this));
    controls.addEventListener('click', this.handleControlsClick.bind(this));
  }

  runGameFieldListeners() {
    const { gameField } = this.elements;

    gameField.addEventListener('click', this.handleFlipCardClick.bind(this));
    gameField.addEventListener('click', this.countTrainingClicks.bind(this));
    gameField.addEventListener('click', this.handleCategoryCardClick.bind(this));
    gameField.addEventListener('mouseout', this.handleFlipCardMouseOut.bind(this));
  }

  handleCorrectAnswer(targetCard) {
    new Audio('./assets/audio/answerIsCorrect.wav').play();
    this.createStar(true);
    this.state.setCorrectAnswer();
    targetCard.classList.add('disabled');
    this.saveScores('correct');
    if (this.state.hasNextCard()) {
      this.state.setNextCard();
      this.playCardAudio(this.state.currentCard.sound);
    } else {
      this.finishGame();
    }
  }

  handleWrongAnswer() {
    new Audio('./assets/audio/answerIsWrong.wav').play();
    this.createStar(false);
    this.state.setWrongAnswer();
    this.state.mistakes += 1;
    this.saveScores('wrong');
  }

  handlePlayModeAnswers(event) {
    const { gameStarted, currentCard } = this.state;
    const target = event.target.parentElement.parentElement.parentElement;
    const isFlipCardClick = target.classList.contains('flip-card');
    const isFlipCardInactive = target.classList.contains('disabled');

    if (!gameStarted || !isFlipCardClick || isFlipCardInactive) return;

    const isCorrectAnswer = target.dataset.word === currentCard.word;
    if (isCorrectAnswer) this.handleCorrectAnswer(target);
    if (!isCorrectAnswer) this.handleWrongAnswer();
  }

  handleMenuLiClick(event) {
    const menuLi = event.target;

    if (menuLi.classList.contains('home-link')) {
      this.renderCategoryCards();
      this.toggleMenu();
    }

    if (menuLi.dataset.category) {
      this.state.setActiveCards(CARDS, menuLi.dataset.category);
      this.renderFlipCards();
      this.toggleMenu();
    }
  }

  handleFlipCardClick(event) {
    const { target } = event;
    console.log(target);
    const flipCard = target.parentElement.parentElement.parentElement;
    const isRotateBtnClick = target.classList.contains('card__rotate-btn');
    const isCardFrontClick = target.parentElement.classList.contains('card__front');

    if (this.state.isPlayMode) return;

    if (isRotateBtnClick) {
      target.parentElement.parentElement.classList.add('rotate');
    } else if (isCardFrontClick) {
      new Audio(flipCard.dataset.sound).play();
    }
  }

  handleFlipCardMouseOut(event) {
    const { relatedTarget } = event;
    const rotatedCard = this.elements.gameField.querySelector('.rotate');

    if (this.state.isPlayMode) return;
    if (!relatedTarget) return;
    if (!relatedTarget.classList.contains('game-field')) return;

    if (rotatedCard) rotatedCard.classList.remove('rotate');
  }

  handleCategoryCardClick(event) {
    const target = event.target.parentNode;
    const isCategoryCardClick = target.classList.contains('category-card');

    if (!isCategoryCardClick) return;
    this.state.setActiveCards(CARDS, target.dataset.category);
    this.renderFlipCards();
  }

  countTrainingClicks(event) {
    const target = event.target.parentElement.parentElement.parentElement;
    const isFlipCardClick = target.classList.contains('flip-card');
    const { word } = target.dataset;

    if (this.state.isPlayMode || !isFlipCardClick) return;

    this.scores[word].trained += 1;
    this.saveScores();
  }

  handleStatsPanelBtnsClick(event) {
    const isResetBtnClick = event.target.classList.contains('reset-btn');
    const isRepeatBtnClick = event.target.classList.contains('repeat-btn');

    if (isResetBtnClick) this.renderModal();

    if (isRepeatBtnClick) {
      const difficultCards = getDifficultCards(this.scores);
      console.log(difficultCards);
      this.state.setActiveCards(difficultCards);
      this.renderFlipCards();
    }
  }

  handleModalButtonsClicks(event) {
    const isYesBtnClick = event.target.classList.contains('yes-btn');
    if (isYesBtnClick) {
      localStorage.removeItem('englishForKidsScores');
      this.parseOrCreateScores();
      this.renderStatsPanel();
    }
    this.elements.modal.classList.add('hidden');
    sleep(250).then(() => this.elements.modal.remove());
  }

  setMenuSelection(category) {
    const menuItems = Array.from(this.elements.menu.children);
    menuItems.forEach((li) => li.classList.remove('active'));

    if (category) {
      const selectedLi = menuItems.filter((li) => li.dataset.category === category)[0];
      if (selectedLi) selectedLi.classList.add('active');
    }
  }
}
