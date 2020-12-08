/* eslint-disable import/extensions */
import CATEGORIES from './categories.js';
import CARDS from './cards.js';

export default class Game {
  scores = null;

  elements = {
    gamePanel: document.querySelector('.game-panel'),
    gameField: document.querySelector('.game-field'),
    menu: document.querySelector('.menu'),
    menuBtn: document.querySelector('.menu-btn'),
    overlay: document.querySelector('.overlay'),
  }

  playMode = {
    isActive: false,
    gameStarted: false,
    gameFinished: false,
    cards: null,
    currentCard: null,
    currentIndex: 0,
    mistakes: 0,
    results: [],
    setCorrectAnswer: () => {
      const {
        results,
        currentIndex,
      } = this.playMode;
      if (results[currentIndex] !== false) results[currentIndex] = true;
    },
    setWrongAnswer: () => {
      const {
        results,
        currentIndex,
      } = this.playMode;
      if (!results[currentIndex]) results[currentIndex] = false;
    },
    hasNextCard: () => this.playMode.cards[this.playMode.currentIndex + 1],
    setNextCard: () => {
      this.playMode.currentIndex += 1;
      const {
        cards,
        currentIndex,
      } = this.playMode;
      this.playMode.currentCard = cards[currentIndex];
    },
    reset: () => {
      this.playMode.results = [];
      this.playMode.cards = [];
      this.playMode.currentIndex = 0;
      this.playMode.mistakes = 0;
      this.playMode.gameStarted = false;
    },
  };

  init() {
    this.sound = new Audio();
    this.createMenu();
    this.loadCategories();
    this.runHeaderListeners();
    this.runGameFieldListeners();
    this.runStatsPageListeners();
    this.runPlayModeHandler();
    this.parseOrCreateScores();
  }

  createMenu() {
    const homeLink = Game.createElement('li', 'home-link', '', 'home-link');
    this.elements.menu.append(homeLink);

    CATEGORIES.forEach((cat) => {
      const menuLi = Game.createElement('li', null, cat);
      menuLi.dataset.category = cat;
      menuLi.style.setProperty('background-image', `url(./assets/img/${cat}.svg)`);
      this.elements.menu.append(menuLi);
    });
  }

  showCategoryName(category) {
    const weakCardsRecieved = Array.isArray(category);
    let categoryName = category;
    if (weakCardsRecieved) categoryName = 'Difficult words';
    const categoryHeader = Game.createElement('div', 'category-header', categoryName);
    this.elements.gameField.prepend(categoryHeader);
  }

  loadCategories() {
    this.elements.gameField.classList.add('hidden');
    this.clearGamePanel();
    this.sleep(500)
      .then(() => {
        this.clearGameField();
        CATEGORIES.forEach((cat) => {
          const categoryCard = Game.createElement('div', 'category-card');
          categoryCard.dataset.category = cat;
          const cardTitle = Game.createElement('div', 'card__title', cat);
          const cardImage = Game.createElement('div', 'card__image');
          cardImage.style.setProperty('background-image', `url(./assets/img/${cat}.svg)`);
          categoryCard.append(cardImage, cardTitle);
          this.elements.gameField.append(categoryCard);
        });
      })
      .then(() => {
        this.elements.gameField.classList.remove('hidden');
        this.highlightMenuItem();
        Game.scrollTop();
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
    this.sleep(500)
      .then(() => {
        this.clearGameField();
        this.showCategoryName(category);
        this.playMode.reset();
        cards.forEach((card) => this.createFlipping(card));
        this.toggleFlipCardsTitles();
        Game.scrollTop();
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
    const statsField = Game.createElement('div', 'stats-field');
    const headRow = Game.createElement('div', ['row', 'head-row']);
    const resetBtn = Game.createElement('button', 'reset-btn', 'Reset');
    const repeatBtn = Game.createElement('button', 'repeat-btn', 'Repeat difficult words');
    const buttons = Game.createElement('div', 'buttons');
    buttons.append(repeatBtn, resetBtn);

    this.elements.gameField.classList.add('hidden');
    this.sleep(500)
      .then(() => {
        this.stopGame();
        this.clearGameField();
        this.elements.gameField.append(statsField);
        statsField.append(buttons);
        headColumns.forEach((headColumn) => {
          const div = Game.createElement('div', 'sorter', headColumn, headColumn);
          headRow.append(div);
        });
        statsField.append(headRow);

        Object.keys(this.scores).forEach((word) => {
          const row = Game.createElement('div', 'row', '', word);
          const columns = getStats(this.scores[word]);
          columns.forEach((column) => {
            const div = Game.createElement('div', null, column);
            row.append(div);
          });
          statsField.append(row);
        });
      })
      .then(() => this.elements.gameField.classList.remove('hidden'))
      .then(() => Game.scrollTop());
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
    this.sleep(500)
      .then(() => {
        if (replayBtn) replayBtn.remove();
        if (stars) stars.forEach((star) => star.remove());
      })
      .then(() => this.elements.gamePanel.classList.remove('hidden-content'));
  }

  createFlipping(card) {
    const cardImage = Game.createElement('div', 'card__image');
    cardImage.style.setProperty('background-image', `url(./assets/img/${card.category}_${card.word}.svg)`);

    const flipCard = Game.createElement('div', 'flip-card');
    flipCard.dataset.word = card.word;
    flipCard.dataset.sound = card.sound;

    const cardElement = Game.createElement('div', 'card');

    const front = Game.createElement('div', 'card__front');
    const back = Game.createElement('div', 'card__back');

    const cardTitle = Game.createElement('div', 'card__title', card.word);
    const cardTranslation = Game.createElement('div', 'card__title', card.translation);
    const rotateBtn = Game.createElement('div', 'card__rotate-btn');

    front.append(cardImage.cloneNode(), cardTitle, rotateBtn);
    back.append(cardImage, cardTranslation);
    cardElement.append(front, back);
    flipCard.append(cardElement);

    this.elements.gameField.append(flipCard);
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

    this.playMode.cards = this.shuffle(cards);
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
      const message = Game.createElement('div', 'finish-message');
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
    this.sleep(1000)
      .then(() => playFinalSound())
      .then(() => {
        this.clearGameField();
        this.elements.gameField.append(finalMessage);
        this.elements.gameField.classList.remove('hidden');
      })
      .then(() => this.sleep(5000))
      .then(() => {
        if (document.querySelector('.finish-message')) this.loadCategories();
      });
  }

  playCard(card) {
    this.sleep(1000).then(() => this.playSound(card.sound));
  }

  createStar(answer) {
    const star = Game.createElement('div', 'star');
    if (answer) star.classList.add('star-true');
    this.elements.gamePanel.firstChild.insertAdjacentElement('beforebegin', star);
    this.sleep(0)
      .then(() => star.style.setProperty('height', '1.5rem'))
      .then(() => this.sleep(100))
      .then(() => star.style.setProperty('opacity', 1));
  }

  createReplayBtn() {
    const replayBtn = Game.createElement('div', ['replay-btn', 'play-btn', 'hidden']);
    this.elements.gamePanel.append(replayBtn);

    replayBtn.addEventListener('click', () => {
      if (replayBtn.classList.contains('play-btn')) {
        this.playMode.gameStarted = true;
        replayBtn.classList.add('hidden');
        this.sleep(200).then(() => replayBtn.classList.remove('play-btn'));
        this.sleep(1000).then(() => replayBtn.classList.remove('hidden'));
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
    this.elements.menuBtn.classList.toggle('jump-to-menu');
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

  runHeaderListeners() {
    // logo
    document.querySelector('.logo__title').addEventListener('click', () => {
      this.loadCategories();
    });
    // menu
    this.elements.menu.addEventListener('click', (event) => this.handleMenuLiClick(event));
    // menu button
    this.elements.menuBtn.addEventListener('click', () => this.toggleMenu());
    // overlay
    this.elements.overlay.addEventListener('click', () => this.toggleMenu());
    // toggle mode button
    document.querySelector('#toggle-mode').addEventListener('click', () => this.togglePlayMode());
    // stats button
    document.querySelector('.stats-btn').addEventListener('click', () => {
      this.loadStats();
      this.highlightMenuItem();
    });
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
      this.handleStatsPageButtonsClicks(event);
      this.handleStatsSorting(event);
    });
    this.elements.gameField.addEventListener('mouseout', (e) => this.handleCardBackFlip(e));
  }

  runStatsPageListeners() {
    this.elements.gameField.addEventListener('click', (event) => this.handleStatsPageButtonsClicks(event));
    document.querySelector('.modal-overlay').addEventListener('click', (event) => this.handleModalButtonsClicks(event));
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
        this.sleep(0)
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
        this.sleep(0)
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
    const card = event.target.parentNode;
    if (!card.classList.contains('category-card')) return;
    this.loadCardsOf(card.dataset.category);
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

  handleStatsPageButtonsClicks(event) {
    const modal = document.querySelector('.modal-overlay');

    if (event.target.classList.contains('reset-btn')) modal.classList.remove('hidden');

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
    const modal = document.querySelector('.modal-overlay');
    if (event.target.classList.contains('yes-btn')) {
      modal.classList.add('hidden');
      localStorage.removeItem('englishForKidsScores');
      this.parseOrCreateScores();
      this.loadStats();
    }
    if (event.target.classList.contains('no-btn')) {
      modal.classList.add('hidden');
    }
    if (event.target === modal) {
      modal.classList.add('hidden');
    }
  }

  handleStatsSorting(event) {
    const clickOnHeadRow = event.target.parentElement.classList.contains('head-row');
    if (!clickOnHeadRow) return;

    const headColumns = ['category', 'word', 'translation', 'correct', 'wrong', 'trained', '% correct'];
    const sorterColumn = event.target.id;
    const wasSorted = document.querySelector('.sorted');
    const i = headColumns.indexOf(sorterColumn);
    const rows = this.elements.gameField.querySelectorAll('.row');
    const rowsSortedDown = Array.from(rows).slice(1).sort((a, b) => {
      const tryGetInt = (str) => {
        if (Number.isNaN(parseInt(str, 10))) return str;
        return parseInt(str, 10);
      };
      const first = tryGetInt(a.childNodes[i].textContent);
      const second = tryGetInt(b.childNodes[i].textContent);
      if (second < first) return -1;
      if (second > first) return 1;
      return 0;
    });
    const sortStats = (direction) => {
      let order;
      if (direction === 'down') order = rowsSortedDown;
      if (direction === 'up') order = rowsSortedDown.reverse();
      event.target.classList.add('sorted', direction);
      rows.forEach((row) => row.style.setProperty('order', order.indexOf(row)));
    };
    const unSortStats = () => {
      event.target.classList.remove('sorted', 'up', 'down');
      rows.forEach((row) => row.style.removeProperty('order'));
    };
    const targetIsSorted = event.target.classList.contains('sorted');
    const targetIsSortedDown = event.target.classList.contains('down');

    if (!targetIsSorted) {
      if (wasSorted) wasSorted.classList.remove('sorted', 'up', 'down');
      sortStats('up');
    }
    if (targetIsSorted) {
      if (!targetIsSortedDown) {
        unSortStats();
        sortStats('down');
      } else unSortStats();
    }
  }

  highlightMenuItem(category) {
    const menuItems = Array.from(this.elements.menu.getElementsByTagName('li'));
    menuItems.forEach((li) => li.classList.remove('active'));
    if (category) {
      const selectedMenuItem = menuItems.filter((li) => li.dataset.category === category)[0];
      selectedMenuItem.classList.add('active');
    }
  }

  shuffle(array) {
    const len = this.elements.gameField.querySelectorAll('.flip-card').length;
    const random = () => Math.floor(Math.random() * len);
    const indexes = [];
    const result = [];
    let index = random();
    for (let i = len; i > 0; i -= 1) {
      while (indexes.includes(index)) index = random();
      indexes.push(index);
      result.push(array[index]);
    }
    return result;
  }

  sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

  static createElement(tag, classNames, text, id) {
    const element = document.createElement(tag);
    if (Array.isArray(classNames)) classNames.forEach((name) => element.classList.add(name));
    else element.classList.add(classNames);
    element.textContent = text;
    if (id) element.id = id;
    return element;
  }

  static scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
