export default class State {
  constructor() {
    this.isPlayMode = false;
    this.gameStarted = false;
    this.gameFinished = false;
    this.cards = null;
    this.currentCard = null;
    this.currentIndex = 0;
    this.mistakes = 0;
    this.results = [];
    this.category = null;
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

  setActiveCards(cards, category) {
    const cardsOfCategory = cards.filter((card) => card.category === category);
    this.category = category || 'difficult words';
    this.cards = category ? cardsOfCategory : cards;
  }

  reset = () => {
    this.results = [];
    this.cards = [];
    this.currentIndex = 0;
    this.mistakes = 0;
    this.gameStarted = false;
  };
}
