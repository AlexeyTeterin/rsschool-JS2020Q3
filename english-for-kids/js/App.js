import { CARDS, CATEGORIES } from './CARDS.js';
import {
  createElement, scrollTop, shuffleCards, sleep, getDifficultCards, toggleScrollLock, isFlipCard,
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
import handleStatsHeaderClick from './sortStats.js';

export default class App {
  elements = {
    gamePanel: document.querySelector('.game-panel'),
    gameField: document.querySelector('.game-field'),
    overlay: document.querySelector('.overlay'),
    logo: new Logo('English for kids').render(),
    menu: new Menu().render(),
    burger: new Burger().render(),
    controls: new Controls().render(),
    footer: new Footer().render(),
    replayBtn: null,
  }

  state = new State();

  init() {
    this.sound = new Audio();
    this.state.loadScores(CARDS);

    this.renderHeader();
    this.renderCategoryCards();

    this.runHeaderListeners();
    this.runGameFieldListeners();
  }

  renderHeader() {
    const headerEl = document.querySelector('header');
    const navEl = createElement('nav');

    headerEl.prepend(navEl, this.elements.logo, this.elements.controls);
    navEl.append(this.elements.burger, this.elements.menu);
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
            .append(new CategoryCard(category).render()));
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
        cards.forEach((card) => gameField.append(new FlipCard(card).render()));
        this.toggleFlipCardsTitles();
        scrollTop();
      })
      .then(() => {
        this.setMenuSelection(this.state.category);
        gameField.classList.remove('hidden');
        if (this.state.isPlayMode) {
          this.renderReplayBtn();
          this.startGame();
        }
      });
  }

  renderReplayBtn() {
    const isFlipCardsLoaded = document.querySelector('.flip-card');

    this.elements.replayBtn = createElement('div', ['replay-btn', 'play-btn', 'hidden']);
    this.elements.gamePanel.append(this.elements.replayBtn);
    if (isFlipCardsLoaded) this.elements.replayBtn.classList.remove('hidden');

    this.elements.replayBtn.addEventListener('click', this.handleReplayBtnClick.bind(this));
  }

  renderStar(answer) {
    const star = createElement('div', 'star');
    if (answer) star.classList.add('star-true');
    this.elements.gamePanel.firstChild.insertAdjacentElement('beforebegin', star);
    sleep(0)
      .then(() => star.style.setProperty('height', '1.5rem'))
      .then(() => sleep(100))
      .then(() => star.style.setProperty('opacity', 1));
  }

  renderStatsPanel() {
    const { gameField } = this.elements;

    this.stopGame();
    gameField.classList.add('hidden');
    sleep(500).then(() => {
      const statsPanel = new StatsPanel(this.state.scores).render();
      this.clearGameField();
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

  clearGameField() {
    this.elements.gameField.innerHTML = null;
  }

  clearGamePanel() {
    const { gamePanel, replayBtn } = this.elements;
    const stars = gamePanel.querySelectorAll('.star');

    gamePanel.classList.add('hidden-content');
    sleep(500).then(() => {
      if (replayBtn) replayBtn.remove();
      if (stars) stars.forEach((star) => star.remove());
      gamePanel.classList.remove('hidden-content');
    });
  }

  toggleFlipCardsTitles() {
    const { gameField } = this.elements;
    const cardTitles = gameField.querySelectorAll('.card__title');
    const rotateButtons = gameField.querySelectorAll('.card__rotate-btn');
    const needsHide = this.state.isPlayMode;
    const toggleHidden = (node, boolean) => {
      if (isFlipCard(node.parentElement)) {
        node.classList.toggle('hidden', boolean);
      }
    };

    cardTitles.forEach((title) => toggleHidden(title, needsHide));
    rotateButtons.forEach((btn) => toggleHidden(btn, needsHide));
  }

  togglePlayMode() {
    const { isPlayMode } = this.state;

    this.state.isPlayMode = !isPlayMode;
    document.body.classList.toggle('play-mode', !isPlayMode);

    this.toggleFlipCardsTitles();
    this.toggleGamePanel();

    if (!this.state.isPlayMode) {
      this.setAllCardsActive();
    }
  }

  setAllCardsActive() {
    this.elements.gameField.querySelectorAll('.disabled')
      .forEach((disabledCard) => disabledCard.classList.remove('disabled'));
  }

  startGame() {
    const { gameField } = this.elements;
    const flipCards = Array.from(gameField.querySelectorAll('.flip-card'));
    const cards = flipCards.map((card) => card.dataset);

    this.state.cards = shuffleCards(cards);
    [this.state.currentCard] = this.state.cards;
  }

  stopGame() {
    this.elements.gamePanel.innerHTML = null;
    this.state.reset();
  }

  renderFinalMessage() {
    const { winSound, looseSound } = this.state.sounds;
    const { gameField } = this.elements;
    const isAllCorrect = !this.state.results.includes(false);
    const finalSound = isAllCorrect ? winSound : looseSound;
    const finalMessage = new FinalMessage(this.state).render();

    gameField.classList.add('hidden');
    sleep(1000)
      .then(() => {
        new Audio(finalSound).play();
        this.clearGameField();
        gameField.append(finalMessage);
        gameField.classList.remove('hidden');
      })
      .then(() => sleep(5000))
      .then(() => {
        const isFinalMessageActive = document.querySelector('.finish-message');
        if (isFinalMessageActive) this.renderCategoryCards();
      });
  }

  handleReplayBtnClick() {
    const { replayBtn } = this.elements;
    const { gameStarted } = this.state;

    if (!gameStarted) {
      this.state.gameStarted = true;
      replayBtn.classList.add('hidden');
      sleep(200).then(() => replayBtn.classList.remove('play-btn'));
      sleep(1000).then(() => replayBtn.classList.remove('hidden'));
    }
    this.playCardAudio(this.state.currentCard.sound);
  }

  toggleGamePanel() {
    document.querySelector('.game-panel').classList.toggle('hidden', !this.state.isPlayMode);
    this.elements.gameField.classList.toggle('narrow', this.state.isPlayMode);
    if (this.state.isPlayMode) {
      this.renderReplayBtn();
      this.startGame();
    } else {
      this.stopGame();
    }
  }

  toggleMenu() {
    const isScrollable = () => this.elements.menu.classList.contains('show');

    this.elements.menu.classList.toggle('show');
    this.elements.burger.classList.toggle('jump-to-menu');
    this.elements.overlay.classList.toggle('hidden');
    toggleScrollLock(isScrollable());
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
    gameField.addEventListener('click', this.handlePlayModeAnswers.bind(this));
    gameField.addEventListener('click', handleStatsHeaderClick);
  }

  handleCorrectAnswer(targetCard) {
    new Audio('./assets/audio/answerIsCorrect.wav').play();
    this.renderStar(true);
    this.state.setCorrectAnswer();
    targetCard.classList.add('disabled');
    this.state.saveScore('correct');
    if (this.state.hasNextCard()) {
      this.state.setNextCard();
      this.playCardAudio(this.state.currentCard.sound);
    } else {
      this.renderFinalMessage();
    }
  }

  handleWrongAnswer() {
    new Audio('./assets/audio/answerIsWrong.wav').play();
    this.renderStar(false);
    this.state.setWrongAnswer();
    this.state.mistakes += 1;
    this.state.saveScore('wrong');
  }

  handlePlayModeAnswers(event) {
    const { gameStarted, currentCard } = this.state;
    const target = event.target.parentElement.parentElement.parentElement;
    const isFlipCardClick = target.classList.contains('flip-card');
    const isFlipCardInactive = target.classList.contains('disabled');
    const isCorrectAnswer = () => target.dataset.word === currentCard.word;

    if (!gameStarted || !isFlipCardClick || isFlipCardInactive) return;

    if (isCorrectAnswer()) this.handleCorrectAnswer(target);
    if (!isCorrectAnswer()) this.handleWrongAnswer();
  }

  handleMenuLiClick(event) {
    const { target } = event;
    const isHomeLinkClick = target.id === 'home-link';
    const isMenuLinkClick = target.dataset.category !== null;

    if (isHomeLinkClick) {
      this.renderCategoryCards();
      this.toggleMenu();
    } else if (isMenuLinkClick) {
      this.state.setActiveCards(CARDS, target.dataset.category);
      this.renderFlipCards();
      this.toggleMenu();
    }
  }

  handleFlipCardClick(event) {
    const { target } = event;
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
    const isCardMouseOut = () => relatedTarget.classList.contains('game-field');

    if (this.state.isPlayMode || !relatedTarget || !isCardMouseOut()) return;

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

    this.state.scores[word].trained += 1;
    this.state.saveScore();
  }

  handleStatsPanelBtnsClick(event) {
    const isResetBtnClick = event.target.classList.contains('reset-btn');
    const isRepeatBtnClick = event.target.classList.contains('repeat-btn');

    if (isResetBtnClick) this.renderModal();

    if (isRepeatBtnClick) {
      const difficultCards = getDifficultCards(this.state.scores);
      this.state.setActiveCards(difficultCards);
      this.renderFlipCards();
    }
  }

  handleModalButtonsClicks(event) {
    const isYesBtnClick = event.target.classList.contains('yes-btn');

    if (isYesBtnClick) {
      localStorage.removeItem('englishForKidsScores');
      this.state.loadScores(CARDS);
      this.renderStatsPanel();
    }

    this.elements.modal.classList.add('hidden');
    sleep(250).then(() => this.elements.modal.remove());
  }

  setMenuSelection(category) {
    const menuLinks = Array.from(this.elements.menu.children);

    menuLinks.forEach((li) => li.classList.remove('active'));

    if (category) {
      const selectedLi = menuLinks.filter((li) => li.dataset.category === category)[0];
      if (selectedLi) selectedLi.classList.add('active');
    }
  }
}
