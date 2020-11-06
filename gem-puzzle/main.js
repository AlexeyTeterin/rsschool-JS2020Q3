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
    const emptyChip = document.createElement('div');
    emptyChip.classList.add('chip-empty');
    emptyChip.textContent = 'empty';
    this.gameBoard.append(emptyChip);

    this.chips = document.querySelectorAll('.chip');
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
}

const game = new Game();
game.init();