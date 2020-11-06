class Game {
  constructor() {
    this.properties = {
      rows: 4,
      time: null,
      moves: 0,
    }
    this.gameBoard = null;
    this.chipsNumbers = null;
    this.chips = null;
  }
  init() {

    // create game board
    this.gameBoard = document.createElement('div');
    this.gameBoard.classList.add('game-board');
    this.gameBoard.style.setProperty('grid-template-columns',
      `repeat(${this.properties.rows}, 1fr)`)
    document.body.append(this.gameBoard);

    // generate random chips
    this.chipsNumbers = this.shuffleChips();
    this.chipsNumbers.forEach((num) => {
      const chip = document.createElement('div');
      chip.classList.add('chip');
      chip.textContent = num;
      this.gameBoard.append(chip);
    });

    // add last empty chip
    const emptyChip = document.createElement('div');
    emptyChip.classList.add('chip', 'chip-empty');
    emptyChip.textContent = '';
    this.gameBoard.append(emptyChip);
    this.getChips();

    // moving chips event listener
    this.chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        this.moveChips(chip);
      })
    })
  }

  getChips() {
    this.chips = Array.from(document.querySelectorAll('.chip'));
  }

  shuffleChips() {
    const nums = [];
    const numOfChips = this.properties.rows ** 2 - 1;
    let generateRandom = () => Math.ceil(Math.random() * numOfChips);
    for (let i = 0; i < numOfChips; i++) {
      let random = generateRandom();
      while (nums.includes(random)) random = generateRandom();
      nums.push(random);
    };
    return nums;
  }

  fillGameBoard() {
    this.chips.forEach((chip) => {

    })
  }

  moveChips(chip) {
    const chipPos = this.chips.indexOf(chip);
    const clickedChip = document.querySelectorAll('.chip')[chipPos];
    const emptyChip = document.querySelector('.chip-empty');
    const temp = emptyChip.innerHTML;
    const positionDifference = this.chips.indexOf(emptyChip) - chipPos;
    const chipIsMovable = () => [1, this.properties.rows].includes(Math.abs(positionDifference));

    if (chipIsMovable()) {
      const params = {
        [`${this.properties.rows}`]: '(0, 100%)',
        '1': '(100%, 0)',
        [`-${this.properties.rows}`]: '(0, -100%)',
        '-1': '(-100%, 0)',
      };

      clickedChip.style.setProperty('transform', `translate${params[positionDifference]}`);
      emptyChip.style.setProperty('visibility', 'hidden');

      setTimeout(() => {
        emptyChip.innerHTML = chip.innerHTML;
        emptyChip.classList.remove('chip-empty');
        clickedChip.innerHTML = temp;
        clickedChip.classList.add('chip-empty');
        emptyChip.style.setProperty('visibility', 'visible');
        clickedChip.style.setProperty('transform', `translate(0)`);
        this.getChips();
      }, 150);

    }
  }
}

const game = new Game();
game.init();