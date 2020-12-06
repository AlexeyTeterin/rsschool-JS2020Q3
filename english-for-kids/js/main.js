/* eslint-disable class-methods-use-this */
/* eslint-disable import/extensions */
import CATEGORIES from './categories.js';
import CARDS from './cards.js';

class Game {
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
    this.createMenu();
    this.loadCategories();
    this.runCategoryListeners();
    this.toggleFlipCardsListener();
    this.runLogoListener();
    this.runMenuBtnListener();
    this.runStatsBtnsListener();
    this.runToggleModeListener();
    this.runPlayModeHandler();
    this.runSortingListener();
    this.runTrainingClicksCounter();
    this.parseOrCreateScores();
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

  clearGameField() {
    this.elements.gameField.innerHTML = null;
  }

  loadCategories() {
    this.elements.gameField.classList.add('hidden');
    this.clearGamePanel();
    this.sleep(500)
      .then(() => {
        this.clearGameField();
        CATEGORIES.forEach((cat) => {
          const categoryCard = this.createElement('div', 'category-card');
          categoryCard.dataset.category = cat;
          const cardTitle = this.createElement('div', 'card__title', cat);
          const cardImage = this.createElement('div', 'card__image');
          cardImage.style.setProperty('background-image', `url(./assets/img/${cat}.svg)`);
          categoryCard.append(cardImage, cardTitle);
          this.elements.gameField.append(categoryCard);
        });
      })
      .then(() => {
        this.elements.gameField.classList.remove('hidden');
        this.highlightMenuItem();
        this.scrollTop();
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
        this.playMode.reset();
        cards.forEach((card) => this.createFlipping(card));
        this.toggleFlipCardsTitles();
        this.scrollTop();
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
    const statsField = this.createElement('div', 'stats-field');
    const headRow = this.createElement('div', ['row', 'head-row']);
    const resetBtn = this.createElement('button', 'reset-btn', 'Reset');
    const repeatBtn = this.createElement('button', 'repeat-btn', 'Repeat difficult words');
    const buttons = this.createElement('div', 'buttons');
    buttons.append(repeatBtn, resetBtn);

    this.elements.gameField.classList.add('hidden');
    this.sleep(500)
      .then(() => {
        this.stopGame();
        this.clearGameField();
        this.elements.gameField.append(statsField);
        statsField.append(buttons);
        headColumns.forEach((headColumn) => {
          const div = this.createElement('div', 'sorter', headColumn, headColumn);
          headRow.append(div);
        });
        statsField.append(headRow);

        Object.keys(this.scores).forEach((word) => {
          const row = this.createElement('div', 'row', '', word);
          const columns = getStats(this.scores[word]);
          columns.forEach((column) => {
            const div = this.createElement('div', null, column);
            row.append(div);
          });
          statsField.append(row);
        });
      })
      .then(() => this.elements.gameField.classList.remove('hidden'))
      .then(() => this.scrollTop());
  }

  runSortingListener() {
    document.addEventListener('click', this.sorter);
  }

  sorter(event) {
    if (!event.target.parentElement.classList.contains('head-row')) return;

    const headColumns = ['category', 'word', 'translation', 'correct', 'wrong', 'trained', '% correct'];
    const sorter = event.target.id;
    const wasSorted = document.querySelector('.sorted');
    const i = headColumns.indexOf(sorter);
    const rows = document.querySelectorAll('.row');

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
    const sort = (direction) => {
      let order;
      if (direction === 'down') order = rowsSortedDown;
      if (direction === 'up') order = rowsSortedDown.reverse();
      event.target.classList.add('sorted', direction);
      rows.forEach((row) => row.style.setProperty('order', order.indexOf(row)));
    };
    const unSort = () => {
      event.target.classList.remove('sorted', 'up', 'down');
      rows.forEach((row) => row.style.removeProperty('order'));
    };
    const targetIsSorted = event.target.classList.contains('sorted');
    const targetIsSortedDown = event.target.classList.contains('down');

    if (!targetIsSorted) {
      if (wasSorted) wasSorted.classList.remove('sorted', 'up', 'down');
      sort('up');
    }
    if (targetIsSorted) {
      if (!targetIsSortedDown) {
        unSort();
        sort('down');
      } else unSort();
    }
  }

  createMenu() {
    const homeLink = this.createElement('li', 'home-link', '', 'home-link');
    this.elements.menu.append(homeLink);

    CATEGORIES.forEach((cat) => {
      const menuLi = this.createElement('li', null, cat);
      menuLi.dataset.category = cat;
      menuLi.style.setProperty('background-image', `url(./assets/img/${cat}.svg)`);
      this.elements.menu.append(menuLi);
    });
  }

  createFlipping(card) {
    const cardImage = this.createElement('div', 'card__image');
    cardImage.style.setProperty('background-image', `url(./assets/img/${card.category}_${card.word}.svg)`);

    const flipCard = this.createElement('div', 'flip-card');
    flipCard.dataset.word = card.word;
    flipCard.dataset.sound = card.sound;
    // flipCard.dataset.category = card.category;

    const cardElement = this.createElement('div', 'card');

    const front = this.createElement('div', 'card__front');
    const back = this.createElement('div', 'card__back');

    const cardTitle = this.createElement('div', 'card__title', card.word);
    const cardTranslation = this.createElement('div', 'card__title', card.translation);
    const rotateBtn = this.createElement('div', 'card__rotate-btn');

    front.append(cardImage.cloneNode(), cardTitle, rotateBtn);
    back.append(cardImage, cardTranslation);
    cardElement.append(front, back);
    flipCard.append(cardElement);

    this.elements.gameField.append(flipCard);
  }

  toggleFlipCardsTitles() {
    document.querySelectorAll('.card__title').forEach((el) => {
      if (!el.parentElement.classList.contains('card__front') && !el.parentElement.classList.contains('card__back')) return;
      el.classList.toggle('hidden', this.playMode.isActive);
    });
    document.querySelectorAll('.card__rotate-btn').forEach((el) => {
      if (!el.parentElement.classList.contains('card__front') && !el.parentElement.classList.contains('card__back')) return;
      el.classList.toggle('hidden', this.playMode.isActive);
    });
  }

  toggleFlipCardsListener() {
    if (!this.playMode.isActive) {
      this.elements.gameField.addEventListener('click', this.handleCardFlip);
      this.elements.gameField.addEventListener('mouseout', this.handleCardBackFlip);
    } else {
      this.elements.gameField.removeEventListener('click', this.handleCardFlip);
      this.elements.gameField.removeEventListener('mouseout', this.handleCardBackFlip);
    }
    this.toggleFlipCardsTitles();
  }

  runTrainingClicksCounter() {
    this.elements.gameField.addEventListener('click', (event) => {
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
    });
  }

  handleCardFlip(event) {
    const {
      target,
    } = event;
    if (target.parentElement.classList.contains('card__front')) {
      if (target.classList.contains('card__rotate-btn')) {
        target.parentElement.parentElement.classList.add('rotate');
        return;
      }
      const flipCard = target.parentElement.parentElement.parentElement;
      new Audio(flipCard.dataset.sound).play();
    }
  }

  handleCardBackFlip(event) {
    const rotatedCard = document.querySelector('.rotate');
    const {
      relatedTarget,
    } = event;
    if (!relatedTarget) return;
    if (!relatedTarget.classList.contains('game-field')) return;
    if (rotatedCard) rotatedCard.classList.remove('rotate');
  }

  runCategoryListeners() {
    this.elements.gameField.addEventListener('click', (event) => {
      const card = event.target.parentNode;
      if (!card.classList.contains('category-card')) return;
      this.loadCardsOf(card.dataset.category);
    });
    this.elements.menu.addEventListener('click', (event) => {
      const menuLi = event.target;
      if (!menuLi.dataset.category) return;
      this.loadCardsOf(menuLi.dataset.category);
      this.toggleMenu();
    });
  }

  runLogoListener() {
    document.querySelector('.logo').addEventListener('click', () => {
      this.loadCategories();
    });
    document.querySelector('.home-link').addEventListener('click', () => {
      this.loadCategories();
      this.toggleMenu();
    });
  }

  runMenuBtnListener() {
    this.elements.menuBtn.addEventListener('click', () => this.toggleMenu());
    this.elements.overlay.addEventListener('click', () => this.toggleMenu());
  }

  runStatsBtnsListener() {
    const modal = document.querySelector('.modal-overlay');

    // stats button in header
    document.querySelector('.stats-btn').addEventListener('click', () => {
      this.loadStats();
      this.highlightMenuItem();
    });

    // reset & repeat buttons on stats page
    this.elements.gameField.addEventListener('click', (event) => {
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
    });

    // yes/no buttons in modal
    document.querySelector('.modal-overlay').addEventListener('click', (event) => {
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
    });
  }

  runToggleModeListener() {
    document.querySelector('#toggle-mode').addEventListener('click', () => this.togglePlayMode());
  }

  togglePlayMode() {
    const toggleBodyClass = () => document.body.classList.toggle('play-mode', this.playMode.isActive);

    this.playMode.isActive = !this.playMode.isActive;
    toggleBodyClass();
    this.toggleFlipCardsListener();
    this.toggleGamePanel();

    if (!this.playMode.isActive) this.enableAllCards();
  }

  enableAllCards() {
    document.querySelectorAll('.disabled').forEach((card) => card.classList.remove('disabled'));
  }

  runPlayModeHandler() {
    this.elements.gameField.addEventListener('click', (event) => {
      const {
        gameStarted,
        setCorrectAnswer,
        setWrongAnswer,
        hasNextCard,
        setNextCard,
      } = this.playMode;
      const clickedCard = event.target.parentElement.parentElement.parentElement;
      const clickOutsideCard = !clickedCard.classList.contains('flip-card');
      const cardDisabled = clickedCard.classList.contains('disabled');
      if (!gameStarted || cardDisabled || clickOutsideCard || !this.playMode.currentCard) return;

      const answerIsCorrect = clickedCard.dataset.word === this.playMode.currentCard.word;

      if (answerIsCorrect) {
        setCorrectAnswer();
        this.createStar(true);
        clickedCard.classList.add('disabled');
        this.playSound('./assets/audio/answerIsCorrect.wav');
        this.saveScores('correct');
        if (hasNextCard()) {
          setNextCard();
          this.playCard(this.playMode.currentCard);
        } else { // game finished
          this.finishGame();
        }
      }

      if (!answerIsCorrect) {
        setWrongAnswer();
        this.playMode.mistakes += 1;
        this.createStar(false);
        this.playSound('./assets/audio/answerIsWrong.wav');
        this.saveScores('wrong');
      }
    });
  }

  saveScores(answer) {
    if (answer === 'correct') this.scores[this.playMode.currentCard.word].correct += 1;
    if (answer === 'wrong') this.scores[this.playMode.currentCard.word].wrong += 1;

    localStorage.setItem('englishForKidsScores', JSON.stringify(this.scores));
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

  finishGame() {
    const win = !this.playMode.results.includes(false);
    const playFinalSound = () => {
      if (win) this.playSound('./assets/audio/finish_true.ogg');
      else this.playSound('./assets/audio/finish_false.ogg');
    };
    const createFinalMessage = async () => {
      const {
        mistakes,
      } = this.playMode;
      const src = win ? './assets/img/finish_win.png' : './assets/img/finish_loose.png';
      const message = this.createElement('div', 'finish-message');
      const img = this.createElement('img');
      img.src = src;

      img.onload = () => {
        message.style.setProperty('background-image', `url(${src})`);
        message.innerText = win ? 'You win!' : `${mistakes} mistake`;
        if (mistakes > 1) message.innerText += 's';
      };
      await img.onload();
      return message;
    };

    this.elements.gameField.classList.add('hidden');
    this.sleep(1000)
      .then(async () => {
        this.clearGameField();
        const msg = await createFinalMessage();
        this.elements.gameField.append(msg);
      })
      .then(() => {
        playFinalSound();
        this.elements.gameField.classList.remove('hidden');
      })
      .then(() => this.sleep(5000))
      .then(() => {
        if (document.querySelector('.finish-message')) this.loadCategories();
      });
  }

  playCard(card) {
    const playSound = (src) => new Audio(src).play();
    this.sleep(1000).then(() => playSound(card.sound));
  }

  createStar(answer) {
    const star = this.createElement('div', 'star');
    if (answer) star.classList.add('star-true');
    // if (!answer) star.classList.remove('star-true');
    this.elements.gamePanel.firstChild.insertAdjacentElement('beforebegin', star);
    this.sleep(0)
      .then(() => star.style.setProperty('height', '1.5rem'))
      .then(() => this.sleep(100))
      .then(() => star.style.setProperty('opacity', 1));
  }

  createReplayBtn() {
    const replayBtn = this.createElement('div', ['replay-btn', 'play-btn', 'hidden']);
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

  highlightMenuItem(category) {
    const menuItems = Array.from(this.elements.menu.getElementsByTagName('li'));
    menuItems.forEach((li) => li.classList.remove('active'));
    if (category) {
      const selectedMenuItem = menuItems.filter((li) => li.dataset.category === category)[0];
      selectedMenuItem.classList.add('active');
    }
  }

  playSound(src) {
    const sound = new Audio(src);
    sound.play();
  }

  shuffle(array) {
    const len = document.querySelectorAll('.flip-card').length;
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

  createElement(tag, classNames, text, id) {
    const element = document.createElement(tag);
    if (Array.isArray(classNames)) classNames.forEach((name) => element.classList.add(name));
    else element.classList.add(classNames);
    element.textContent = text;
    if (id) element.id = id;
    return element;
  }

  scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));
}

const game = new Game();
game.init();
