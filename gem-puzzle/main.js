class Game {
  properties = {
    rows: 4,
    timer: 0,
    playing: false,
    movesCounter: 0,
  }
  header = null;
  gameBoard = null;
  chipsNumbers = null;
  chips = [];
  pauseBtn = null;
  modal = null;

  init() {
    // create header
    this.header = document.createElement('header');
    this.header.append(document.createElement('time'));
    this.header.append(document.createElement('moves'));
    this.pauseBtn = document.createElement('pause');
    this.header.append(this.pauseBtn);
    document.body.append(this.header);
    this.updateHeader();

    // pause button
    this.pauseBtn.textContent = this.properties.playing ? 'Pause' : 'Play';
    this.pauseBtn.addEventListener('click', () => this.setTimer(this.properties.playing ? 'off' : 'on'));

    // create game board
    this.gameBoard = document.createElement('div');
    this.gameBoard.classList.add('game-board');
    this.gameBoard.style.setProperty('grid-template-columns',
      `repeat(${this.properties.rows}, 1fr)`)
    document.body.append(this.gameBoard);

    // generate random chips
    this.chipsNumbers = this.randomizeChips();
    this.createChips();
    this.fillChips(this.chipsNumbers);
    this.getChips();
  }

  setTimer(switcher) {
    const tick = () => {
      this.properties.timer += 1;
      this.updateHeader();
    }

    if (switcher === 'on') {
      this.properties.playing = true;
      this.pauseBtn.textContent = 'Pause';
      window.timer = window.setInterval(tick, 1000);
    } else if (switcher === 'off') {
      this.properties.playing = false;
      this.pauseBtn.textContent = 'Play';
      window.clearInterval(timer);
    }
  }

  createChips() {
    this.chipsNumbers.forEach(() => {
      const chip = document.createElement('div');
      chip.classList.add('chip');
      this.gameBoard.append(chip);
      this.chips.push(chip);
    })

    // chips movement event listener
    this.chips.forEach((chip) =>
      chip.addEventListener('click', () => {
        if (!this.properties.playing) this.setTimer('on');
        this.moveChips(chip);
      }));
  }

  getChips() {
    this.chips = Array.from(document.querySelectorAll('.chip'));
    this.chips.forEach((chip, index) => this.chipsNumbers[index] = chip.textContent);
  }

  fillChips(numbers) {
    this.chipsNumbers = numbers || [];
    this.chips.forEach((chip, index) => {
      chip.textContent = this.chipsNumbers[index];
      chip.classList = 'chip';
      if (chip.textContent === '') chip.classList.add('chip-empty');
    });
  }

  saveGame() {
    localStorage.savedGame = JSON.stringify(this);
    localStorage.savedGameRows = this.properties.rows;
  }

  loadGame() {
    try {
      const savedGame = JSON.parse(localStorage.savedGame);
      this.fillChips(savedGame.chipsNumbers);
      this.properties.rows = +localStorage.savedGameRows;
      this.properties.movesCounter = savedGame.properties.movesCounter;
      this.properties.timer = savedGame.properties.timer;
      this.updateHeader();
    } catch (error) {
      alert('No any saved game found');
    }
    if (window.timer) this.setTimer('off');
  }

  randomizeChips() {
    const nums = [];
    const numOfChips = this.properties.rows ** 2 - 1;
    let generateRandom = () => Math.ceil(Math.random() * numOfChips);
    for (let i = 0; i < numOfChips; i++) {
      let random = generateRandom();
      while (nums.includes(random)) random = generateRandom();
      nums.push(random);
    };
    nums.push('');
    return nums;
  }

  moveChips(chip) {
    const chipPos = this.chips.indexOf(chip);
    const clickedChip = document.querySelectorAll('.chip')[chipPos];
    const emptyChip = document.querySelector('.chip-empty');
    const temp = emptyChip.innerHTML;
    const positionDifference = this.chips.indexOf(emptyChip) - chipPos;
    let chipIsMovable = () => [1, this.properties.rows].includes((Math.abs(positionDifference)));
    const params = {
      [`${this.properties.rows}`]: '(0, 100%)',
      '1': '(100%, 0)',
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
      clickedChip.style.setProperty('transform', `translate(0)`);
      this.getChips();
    }, 150);
  }

  updateHeader(n) {
    const {
      timer
    } = this.properties;
    let minutes = Math.floor(timer / 60);
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    let seconds = timer % 60;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    document.querySelector('time').innerHTML = `Time: ${minutes}:${seconds}`;
    document.querySelector('moves').innerHTML = n ? `Moves: ${++this.properties.movesCounter}` : `Moves: ${this.properties.movesCounter}`;
  }
}

const game = new Game();
game.init();