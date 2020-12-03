/* eslint-disable class-methods-use-this */
/* eslint-disable import/extensions */
import CATEGORIES from './categories.js';
import CARDS from './cards.js';

class Game {
  gamePanel = document.querySelector('.game-panel');

  gameField = document.querySelector('.game-field');

  menu = document.querySelector('.menu');

  menuBtn = document.querySelector('.menu-btn');

  overlay = document.querySelector('.overlay');

  playMode = {
    isActive: false,
    gameStarted: false,
    gameFinished: false,
    category: null,
    cards: null,
    currentCard: null,
    currentIndex: 0,
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
      this.playMode.gameStarted = false;
    },
  };

  scores = null;

  init() {
    this.createMenu();
    this.loadCategories();
    this.runCategoryListeners();
    this.toggleFlipCardsListener();
    this.runLogoListener();
    this.runMenuBtnListener();
    this.runStatsBtnListener();
    this.runToggleModeListener();
    this.runPlayModeHandler();
    this.runSortingListener();
    this.runTrainingClicksCounter();
    this.loadScores();
  }

  loadScores() {
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

    console.table(this.scores);
  }

  clearGameField() {
    this.gameField.innerHTML = null;
  }

  loadCategories() {
    this.gameField.classList.add('hidden');
    this.clearGamePanel();
    this.sleep(500)
      .then(() => {
        this.clearGameField();
        CATEGORIES.forEach((cat) => {
          const categoryCard = document.createElement('div');
          const cardImage = document.createElement('div');
          const cardTitle = document.createElement('div');
          categoryCard.classList.add('category-card');
          categoryCard.dataset.category = cat;
          cardImage.classList.add('card__image');
          cardImage.style.setProperty('background-image', `url(./assets/img/${cat}.svg)`);
          cardTitle.classList.add('card__title');
          cardTitle.textContent = cat;
          categoryCard.append(cardImage, cardTitle);
          this.gameField.append(categoryCard);
        });
      })
      .then(() => {
        this.gameField.classList.remove('hidden');
        this.highlightMenuItem();
        this.scrollTop();
      });
  }

  loadCardsOf(category) {
    this.playMode.category = category;
    this.gameField.classList.add('hidden');
    this.clearGamePanel();
    this.sleep(500).then(() => {
      this.clearGameField();
      this.playMode.reset();
      const cards = CARDS.filter((card) => card.category === category);
      cards.forEach((card) => {
        this.createFlipping(card);
      });
      this.scrollTop();
    }).then(() => {
      this.toggleFlipCardsTitles();
      this.highlightMenuItem(category);
      this.gameField.classList.remove('hidden');
      if (this.playMode.isActive) this.startGame();
    });
  }

  loadStats() {
    const getData = (card) => {
      const columns = [];
      columns[0] = card.category;
      columns[1] = card.word;
      columns[2] = card.translation;
      columns[3] = card.correct;
      columns[4] = card.wrong;
      columns[5] = card.trained;
      columns[6] = `${((card.correct / (card.correct + card.wrong)) * 100 || 0).toFixed(1)} %`;
      return columns;
    };
    const statsField = document.createElement('div');
    statsField.classList.add('stats-field');
    const headRow = document.createElement('div');
    headRow.classList.add('row', 'head-row');
    const headColumns = ['category', 'word', 'translation', 'correct', 'wrong', 'trained', '% correct'];

    this.gameField.classList.add('hidden');
    this.sleep(500)
      .then(() => {
        this.clearGameField();
        this.gameField.append(statsField);
        headColumns.forEach((headColumn) => {
          const div = document.createElement('div');
          div.id = headColumn;
          div.classList.add('sorter');
          div.textContent = headColumn;
          headRow.append(div);
        });
        statsField.append(headRow);

        Object.keys(this.scores).forEach((word) => {
          const row = document.createElement('div');
          row.id = word;
          row.classList.add('row');
          const columns = getData(this.scores[word]);
          columns.forEach((column) => {
            const div = document.createElement('div');
            div.textContent = column;
            row.append(div);
          });
          statsField.append(row);
        });
      })
      .then(() => this.gameField.classList.remove('hidden'));
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
      const tryGetInt = (str) => parseInt(str, 10) || str;
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
    CATEGORIES.forEach((cat) => {
      const menuLi = document.createElement('li');
      menuLi.dataset.category = cat;
      menuLi.textContent = cat;
      menuLi.style.setProperty('background-image', `url(./assets/img/${cat}.svg)`);
      this.menu.append(menuLi);
    });
  }

  createFlipping(card) {
    const createCardImage = () => {
      const cardImage = document.createElement('div');
      cardImage.classList.add('card__image');
      cardImage.style.setProperty('background-image', `url(./assets/img/${card.category}_${card.word}.svg)`);
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
      el.classList.toggle('hidden', this.playMode.isActive);
    });
    document.querySelectorAll('.card__rotate-btn').forEach((el) => {
      if (!el.parentElement.classList.contains('card__front') && !el.parentElement.classList.contains('card__back')) return;
      el.classList.toggle('hidden', this.playMode.isActive);
    });
  }

  toggleFlipCardsListener() {
    if (!this.playMode.isActive) {
      this.gameField.addEventListener('click', this.handleCardFlip);
      this.gameField.addEventListener('mouseout', this.handleCardBackFlip);
    } else {
      this.gameField.removeEventListener('click', this.handleCardFlip);
      this.gameField.removeEventListener('mouseout', this.handleCardBackFlip);
    }
    this.toggleFlipCardsTitles();
  }

  runTrainingClicksCounter() {
    this.gameField.addEventListener('click', (event) => {
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

  runLogoListener() {
    document.querySelector('.logo').addEventListener('click', () => {
      // if (this.playMode.isActive) this.clearGamePanel();
      this.loadCategories();
    });
  }

  runMenuBtnListener() {
    this.menuBtn.addEventListener('click', () => this.toggleMenu());
    this.overlay.addEventListener('click', () => this.toggleMenu());
  }

  runStatsBtnListener() {
    document.querySelector('.stats-btn').addEventListener('click', () => {
      this.loadStats();
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
    this.gameField.addEventListener('click', (event) => {
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
        clickedCard.classList.add('disabled');
        this.playSound('./assets/audio/answerIsCorrect.wav');
        this.showResultInStars();
        this.saveScores('correct');
        if (hasNextCard()) {
          setNextCard();
          this.playCard(this.playMode.currentCard);
        } else { // game finished
          this.finishGame();
          console.log('game finished!');
        }
      }

      if (!answerIsCorrect) {
        setWrongAnswer();
        this.playSound('./assets/audio/answerIsWrong.wav');
        this.showResultInStars();
        this.saveScores('wrong');
      }
    });
  }

  saveScores(answer) {
    if (answer === 'correct') this.scores[this.playMode.currentCard.word].correct += 1;
    if (answer === 'wrong') this.scores[this.playMode.currentCard.word].wrong += 1;

    localStorage.setItem('englishForKidsScores', JSON.stringify(this.scores));
    console.log(JSON.stringify(this.scores));
  }

  showResultInStars() {
    const {
      currentIndex,
    } = this.playMode;
    const star = document.querySelectorAll('.star')[currentIndex];
    const answer = this.playMode.results[currentIndex];
    star.classList.remove('star-empty');
    star.classList.toggle('star-true', answer);
  }

  startGame() {
    if (!document.querySelector('.replay-btn')) this.createReplayBtn();
    const cards = Array.from(this.gameField.querySelectorAll('.flip-card')).map((card) => card.dataset);

    this.playMode.cards = this.shuffle(cards);
    [this.playMode.currentCard] = this.playMode.cards;
    this.createStars();
  }

  stopGame() {
    this.gamePanel.innerHTML = null;
    this.playMode.reset();
  }

  finishGame() {
    const win = !this.playMode.results.includes(false);
    const playFinalSound = () => {
      if (win) this.playSound('./assets/audio/finish_true.ogg');
      else this.playSound('./assets/audio/finish_false.ogg');
    };
    const createFinalMessage = () => {
      const src = win ? './assets/img/finish_win.png' : './assets/img/finish_loose.png';
      const mistakes = this.playMode.results.filter((el) => el === false).length;
      const message = document.createElement('div');
      message.classList.add('finish-message');
      message.style.setProperty('background-image', `url(${src})`);
      message.innerText = win ? 'You win!' : `${mistakes} mistake`;
      if (mistakes > 1) message.innerText += 's';
      return message;
    };

    this.gameField.classList.add('hidden');
    this.sleep(500)
      .then(() => {
        playFinalSound();
        this.clearGameField();
        this.gameField.append(createFinalMessage());
        this.gameField.classList.remove('hidden');
      })
      .then(() => this.sleep(5000))
      .then(() => this.loadCategories());
  }

  playCard(card) {
    const playSound = (src) => new Audio(src).play();
    this.sleep(1000).then(() => playSound(card.sound));
  }

  createStars() {
    let counter = this.playMode.cards.length;
    if (counter) document.querySelector('.replay-btn').classList.remove('hidden');
    while (counter > 0) {
      const star = document.createElement('div');
      star.classList.add('star', 'star-empty');
      this.gamePanel.append(star);
      counter -= 1;
    }
  }

  createReplayBtn() {
    const replayBtn = document.createElement('div');
    replayBtn.classList.add('replay-btn', 'play-btn', 'hidden');
    this.gamePanel.append(replayBtn);

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
    this.gameField.classList.toggle('narrow', this.playMode.isActive);
    if (this.playMode.isActive) this.startGame();
    else this.stopGame();
  }

  clearGamePanel() {
    const replayBtn = this.gamePanel.querySelector('.replay-btn');
    const stars = this.gamePanel.querySelectorAll('.star');

    this.gamePanel.classList.add('hidden-content');
    this.sleep(500)
      .then(() => {
        if (replayBtn) replayBtn.remove();
        if (stars) stars.forEach((star) => star.remove());
      })
      .then(() => this.gamePanel.classList.remove('hidden-content'));
  }

  toggleMenu() {
    this.menu.classList.toggle('show');
    this.menuBtn.classList.toggle('jump-to-menu');
    this.overlay.classList.toggle('hidden');

    this.toggleScroll();
  }

  toggleScroll() {
    const stopScroll = () => {
      const x = window.scrollX;
      const y = window.scrollY;
      window.onscroll = () => window.scrollTo(x, y);
    };

    if (this.menu.classList.contains('show')) {
      stopScroll();
    } else {
      window.onscroll = () => {};
    }
  }

  highlightMenuItem(category) {
    const menuItems = Array.from(this.menu.getElementsByTagName('li'));
    menuItems.forEach((li) => li.classList.remove('active'));
    if (category) {
      const selectedMenuItem = menuItems.filter((li) => li.dataset.category === category)[0];
      selectedMenuItem.classList.add('active');
    }
  }

  playSound(src) {
    const sound = new Audio(src);
    sound.play();
    console.log(src);
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
