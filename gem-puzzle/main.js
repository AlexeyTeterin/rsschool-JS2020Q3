class Game {
  constructor() {
    this.properties = {
      rows: 4,
      time: null,
      moves: 0,
    }
    this.gameBoard = null;
  }
  init() {
    this.gameBoard = document.createElement('div');
    this.gameBoard.classList.add('game-board');
    this.gameBoard.style.setProperty('grid-template-columns',
      `repeat(${this.properties.rows}, 1fr)`)
    document.body.append(this.gameBoard);
  }
}

const game = new Game();
game.init();