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
    this.sounds = {
      winSound: './assets/audio/finish_true.ogg',
      looseSound: './assets/audio/finish_false.ogg',
    };
    this.images = {
      winImg: './assets/img/finish_win.png',
      looseImg: './assets/img/finish_loose.png',
    };
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

  loadScores(cards) {
    function createScoreForCard(card) {
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

    cards.forEach((card) => {
      if (this.scores[card.word]) return;
      this.scores[card.word] = createScoreForCard(card);
    });
  }

  saveScore(answer) {
    if (answer === 'correct') this.scores[this.currentCard.word].correct += 1;
    if (answer === 'wrong') this.scores[this.currentCard.word].wrong += 1;

    localStorage.setItem('englishForKidsScores', JSON.stringify(this.scores));
  }
}
