import CATEGORIES from './categories.js';
import CARDS from './cards.js';
import {
  createElement, getCardStats, scrollTop, shuffle, sleep,
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
    this.renderCategories();
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

  renderCategoryName() {
    const categoryHeader = createElement('div', 'category-header', this.state.category);

    this.elements.gameField.prepend(categoryHeader);
  }

  renderCategories() {
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

  renderStats() {
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
          const columns = getCardStats(this.scores[word]);
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
    if (answer === 'correct') this.scores[this.state.currentCard.word].correct += 1;
    if (answer === 'wrong') this.scores[this.state.currentCard.word].wrong += 1;

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
    const toggleBodyClass = () => document.body.classList.toggle('play-mode', this.state.isPlayMode);

    this.state.isPlayMode = !this.state.isPlayMode;
    toggleBodyClass();
    this.toggleFlipCardsTitles();
    this.toggleGamePanel();

    if (!this.state.isPlayMode) this.enableAllCards();
  }

  enableAllCards() {
    this.elements.gameField.querySelectorAll('.disabled').forEach((card) => card.classList.remove('disabled'));
  }

  startGame() {
    const flipCardsLoaded = document.querySelector('.flip-card');

    if (!document.querySelector('.replay-btn')) this.createReplayBtn();
    const cards = Array.from(this.elements.gameField.querySelectorAll('.flip-card')).map((card) => card.dataset);

    this.state.cards = shuffle(cards);
    [this.state.currentCard] = this.state.cards;

    if (flipCardsLoaded) document.querySelector('.replay-btn').classList.remove('hidden');
  }

  stopGame() {
    this.elements.gamePanel.innerHTML = null;
    this.state.reset();
  }

  async finishGame() {
    const win = !this.state.results.includes(false);
    const playFinalSound = () => {
      if (win) new Audio('./assets/audio/finish_true.ogg').play();
      else new Audio('./assets/audio/finish_false.ogg').play();
    };
    const createFinalMessage = () => {
      const {
        mistakes,
      } = this.state;
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
        if (document.querySelector('.finish-message')) this.renderCategories();
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
        this.state.gameStarted = true;
        replayBtn.classList.add('hidden');
        sleep(200).then(() => replayBtn.classList.remove('play-btn'));
        sleep(1000).then(() => replayBtn.classList.remove('hidden'));
      }
      this.playCard(this.state.currentCard);
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
    if (isTitleClick) this.renderCategories();
  }

  handleControlsClick(event) {
    const { target } = event;
    const isStatsBtnClick = target.classList.contains('stats-btn');
    const isToggleModeClick = target.id === 'checkbox';

    if (isStatsBtnClick) {
      this.renderStats();
      this.setMenuSelection(null);
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
      } = this.state;
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
              this.playCard(this.state.currentCard);
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
            this.state.mistakes += 1;
            this.saveScores('wrong');
          });
      }
    });
  }

  handleMenuLiClick(event) {
    const menuLi = event.target;

    if (menuLi.classList.contains('home-link')) {
      this.renderCategories();
      this.toggleMenu();
    }

    if (menuLi.dataset.category) {
      this.state.setActiveCards(CARDS, menuLi.dataset.category);
      this.renderFlipCards();
      this.toggleMenu();
    }
  }

  handleCardFlip(event) {
    const {
      target,
    } = event;

    if (this.state.isPlayMode) return;

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

  handleTrainingClicks(event) {
    if (this.state.isPlayMode) return;
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
      const difficultCards = [];
      Object.keys(this.scores)
        .forEach((el) => {
          const card = this.scores[el];
          if (card.wrong > 0) difficultCards.push(card);
        });
      difficultCards
        .sort((a, b) => {
          const percentage = (card) => card.wrong / (card.correct + card.wrong);
          if (percentage(a) < percentage(b)) return 1;
          if (percentage(a) > percentage(b)) return -1;
          return 0;
        })
        .splice(8);
      this.state.setActiveCards(difficultCards);
      this.renderFlipCards();
    }
  }

  handleModalButtonsClicks(event) {
    const isYesBtnClick = event.target.classList.contains('yes-btn');
    if (isYesBtnClick) {
      localStorage.removeItem('englishForKidsScores');
      this.parseOrCreateScores();
      this.renderStats();
    }
    this.elements.modal.classList.add('hidden');
    sleep(250).then(() => this.elements.modal.remove());
  }

  setMenuSelection(category) {
    const menuItems = Array.from(this.elements.menu.children);
    menuItems.forEach((li) => li.classList.remove('active'));

    if (category) {
      const selectedMenuItem = menuItems.filter((li) => li.dataset.category === category)[0];
      selectedMenuItem.classList.add('active');
    }
  }
}
