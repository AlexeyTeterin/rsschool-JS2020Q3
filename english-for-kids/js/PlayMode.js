export default class PlayMode {
  constructor() {
    this.isActive = false;
    this.gameStarted = false;
    this.gameFinished = false;
    this.cards = null;
    this.currentCard = null;
    this.currentIndex = 0;
    this.mistakes = 0;
    this.results = [];
  }

  setCorrectAnswer = () => {
    const { results, currentIndex } = this;
    if (results[currentIndex] !== false) results[currentIndex] = true;
  };

  setWrongAnswer = () => {
    const { results, currentIndex } = this;
    if (!results[currentIndex]) results[currentIndex] = false;
  };

  hasNextCard = () => this.cards[this.currentIndex + 1];

  setNextCard = () => {
    this.currentIndex += 1;
    const { cards, currentIndex } = this;
    this.currentCard = cards[currentIndex];
  };

  reset = () => {
    this.results = [];
    this.cards = [];
    this.currentIndex = 0;
    this.mistakes = 0;
    this.gameStarted = false;
  };
}
