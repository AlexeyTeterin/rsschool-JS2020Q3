class Game {
  constructor() {
    this.properties = {
      rows: 4,
      time: null,
      moves: 0,
    }
    this.gameBoard = null;
    this.chipsNumbers = null;
    this.chips = [];
  }
  init() {
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

    // moving chips event listener
    this.chips.forEach((chip) =>
      chip.addEventListener('click', () => this.moveChips(chip)));
  }

  createChips() {
    this.chipsNumbers.forEach(() => {
      const chip = document.createElement('div');
      chip.classList.add('chip');
      this.gameBoard.append(chip);
      this.chips.push(chip);
    })
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
    localStorage.savedGame = JSON.stringify(this.chipsNumbers);
    localStorage.savedGameRows = this.properties.rows;
  }

  loadGame() {
    try {
      this.fillChips(JSON.parse(localStorage.savedGame));
      this.properties.rows = +localStorage.savedGameRows;
    } catch (error) {
      alert('No any saved game found');
    }
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

    console.log(Math.abs(positionDifference));
    console.log(chipIsMovable());
    if (!chipIsMovable()) return;

    clickedChip.style.setProperty('transform', `translate${params[positionDifference]}`);

    setTimeout(() => {
      emptyChip.innerHTML = chip.innerHTML;
      emptyChip.classList.remove('chip-empty');
      clickedChip.innerHTML = temp;
      clickedChip.classList.add('chip-empty');
      clickedChip.style.setProperty('transform', `translate(0)`);
      this.getChips();
    }, 150);
  }
}

const game = new Game();
game.init();