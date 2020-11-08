const MENU = {
  main: `<ul class="menu-ul">
      <li class="menu-li btn-newGame">New game</li>
      <li class="menu-li btn-saveGame">Save game</li>
      <li class="menu-li btn-loadGame">Load game</li>
      <li class="menu-li btn-scores">Scores</li>
      <li class="menu-li btn-settings">Settings</li>
      </ul>`,
  settings: `<h1>Settings</h1>
      <p>Field size:</p>
      <ul>
      <li class='rows'>3x3</li>
      <li class='rows'>4x4</li>
      <li class='rows'>5x5</li>
      <li class='rows'>6x6</li>
      <li class='rows'>7x7</li>
      <li class='rows'>8x8</li>
      </ul>
      <div class="btn-goBack">go back</div>`,
};
class Game {
  properties = {
    rows: 4,
    timer: 0,
    playing: false,
    movesCounter: 0,
  }

  header = {
    time: null,
    moves: null,
    pauseBtn: null,
  }

  gameBoard = null

  chipsNumbers = null

  chips = []

  menu = null

  settings = null

  init() {
    // create header with elements
    this.header = document.createElement('header');
    // time
    this.header.time = document.createElement('time');
    this.header.append(this.header.time);
    // moves
    this.header.moves = document.createElement('div');
    this.header.moves.classList.add('moves');
    this.header.append(this.header.moves);
    // pauseBtn
    this.header.pauseBtn = document.createElement('div');
    this.header.pauseBtn.classList.add('pause');
    this.header.pauseBtn.textContent = this.properties.playing ? 'Pause game' : 'Resume game';
    this.header.pauseBtn.addEventListener('click', () => {
      if (this.chipsNumbers) this.setTimer(this.properties.playing ? 'off' : 'on');
    });
    if (!this.chipsNumbers) this.header.pauseBtn.textContent = '';
    this.header.append(this.header.pauseBtn);
    // append header to body
    document.body.append(this.header);
    this.updateHeader(0, 0);

    // create game board
    this.gameBoard = document.createElement('div');
    this.gameBoard.classList.add('game-board');
    this.gameBoard.style.setProperty('grid-template-columns',
      `repeat(${this.properties.rows}, 1fr)`);
    document.body.append(this.gameBoard);
    // generate random chips
    this.chipsNumbers = this.randomizeChips();
    // create chips boxes
    this.createChips();

    // create menu
    this.menu = document.createElement('div');
    this.menu.classList.add('menu', 'hidden', 'hidden-content');
    this.gameBoard.append(this.menu);
    this.showMenu();
  }

  newGame() {
    // generate random chips
    this.chipsNumbers = this.randomizeChips();
    // create chips boxes
    this.createChips();
    // fill chips with numbers
    this.fillChips(this.chipsNumbers);
    // save chips to game state
    this.getChips();
    // clear timer & moves
    this.updateHeader(0, 0);
  }

  hideMenu() {
    this.menu.classList.add('hidden');
  }

  showMenu() {
    this.menu.innerHTML = MENU.main;
    this.menu.classList = 'menu';

    // event listeners
    document.querySelector('.btn-settings').addEventListener('click', () => this.showSettings());
    document.querySelector('.btn-newGame').addEventListener('click', () => {
      this.newGame();
      this.hideMenu();
    });
  }

  showSettings() {
    this.menu.classList.add('hidden-content');

    setTimeout(() => {
      this.menu.innerHTML = MENU.settings;
      this.menu.classList.add('menu-settings');
      this.menu.classList.remove('hidden-content');
      document.querySelector('.btn-goBack').addEventListener('click', () => this.goBack());
      const rows = document.querySelectorAll('.rows');

      // show selection on current rows number
      rows.forEach((option) => {
        if (this.properties.rows.toString() === option.textContent.slice(0, 1)) option.classList.add('selected');
      });

      // select another rows number
      rows.forEach((option) => {
        option.addEventListener('click', () => {
          document.querySelector('.selected').classList.remove('selected');
          option.classList.add('selected');

          this.properties.rows = parseInt(option.textContent.slice(0, 1), 10);
          this.gameBoard.style.setProperty('grid-template-columns',
            `repeat(${this.properties.rows}, 1fr)`);
          this.chipsNumbers = this.randomizeChips();
          this.createChips();
        });
      });
    }, 250);
  }

  goBack() {
    this.menu.classList.add('hidden-content');
    setTimeout(() => {
      this.showMenu();
    }, 250);
  }

  createChips() {
    // clear existing chips
    document.querySelectorAll('.chip').forEach((chip) => chip.remove());
    this.chips = [];

    this.chipsNumbers.forEach(() => {
      const chip = document.createElement('div');
      chip.classList.add('chip');
      this.gameBoard.append(chip);
      this.chips.push(chip);
    });

    // chips movement event listener
    this.chips.forEach((chip) => chip.addEventListener('click', () => {
      if (!this.properties.playing) this.setTimer('on');
      this.moveChips(chip);
    }));
  }

  getChips() {
    this.chips = Array.from(document.querySelectorAll('.chip'));
    this.chips.forEach((chip, index) => {
      this.chipsNumbers[index] = chip.textContent;
    });
  }

  fillChips(numbers) {
    this.chipsNumbers = numbers || [];
    this.chips.forEach((el, index) => {
      const chip = el;
      chip.textContent = this.chipsNumbers[index];
      chip.classList = 'chip';
      if (chip.textContent === '') chip.classList.add('chip-empty');
      return chip;
    });
  }

  saveGame() {
    localStorage.savedGame = JSON.stringify(this);
    localStorage.savedGameRows = this.properties.rows;
  }

  loadGame() {
    try {
      const savedGame = JSON.parse(localStorage.savedGame);
      this.properties.rows = +localStorage.savedGameRows;
      this.gameBoard.style.setProperty('grid-template-columns',
        `repeat(${this.properties.rows}, 1fr)`);
      this.chipsNumbers = savedGame.chipsNumbers;
      this.createChips();
      this.fillChips(savedGame.chipsNumbers);
      this.properties.movesCounter = savedGame.properties.movesCounter;
      this.properties.timer = savedGame.properties.timer;
      this.updateHeader();
    } catch (error) {
      console.log('No any saved game found');
    }
    if (window.timer) this.setTimer('off');

    this.hideMenu();
  }

  randomizeChips() {
    const nums = [];
    const numOfChips = this.properties.rows ** 2 - 1;
    const generateRandom = () => Math.ceil(Math.random() * numOfChips);
    for (let i = 0; i < numOfChips; i += 1) {
      let random = generateRandom();
      while (nums.includes(random)) random = generateRandom();
      nums.push(random);
    }
    nums.push('');
    return nums;
  }

  setTimer(switcher) {
    const tick = () => {
      this.properties.timer += 1;
      this.updateHeader();
    };

    if (switcher === 'on') {
      this.properties.playing = true;
      this.header.pauseBtn.textContent = 'Pause game';
      this.hideMenu();
      window.timer = window.setInterval(tick, 1000);
    } else if (switcher === 'off') {
      this.properties.playing = false;
      this.header.pauseBtn.textContent = 'Resume game';
      this.showMenu();
      window.clearInterval(window.timer);
    }
  }

  moveChips(chip) {
    const chipPos = this.chips.indexOf(chip);
    const clickedChip = document.querySelectorAll('.chip')[chipPos];
    const emptyChip = document.querySelector('.chip-empty');
    const temp = emptyChip.innerHTML;
    const positionDifference = this.chips.indexOf(emptyChip) - chipPos;
    const chipIsMovable = () => [1, this.properties.rows].includes((Math.abs(positionDifference)));
    const params = {
      [`${this.properties.rows}`]: '(0, 100%)',
      1: '(100%, 0)',
      [`-${this.properties.rows}`]: '(0, -100%)',
      '-1': '(-100%, 0)',
    };

    if (!chipIsMovable()) return;

    clickedChip.style.setProperty('transform', `translate${params[positionDifference]}`);

    this.updateHeader(1);

    setTimeout(() => {
      emptyChip.innerHTML = chip.innerHTML;
      emptyChip.classList.remove('chip-empty');
      clickedChip.innerHTML = temp;
      clickedChip.classList.add('chip-empty');
      clickedChip.style.setProperty('transform', 'translate(0)');
      this.getChips();
    }, 150);
  }

  updateHeader(moves, time = this.properties.timer) {
    if (time === 0) this.properties.timer = 0;
    let minutes = Math.floor(time / 60);
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    let seconds = time % 60;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    document.querySelector('time').innerHTML = `Time: ${minutes}:${seconds}`;

    if (moves === 0) this.properties.movesCounter = 0;
    if (moves === 1) this.properties.movesCounter += 1;
    document.querySelector('.moves').innerHTML = `Moves: ${this.properties.movesCounter}`;
  }
}

const game = new Game();
game.init();