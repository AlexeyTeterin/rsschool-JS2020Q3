import { CARDS } from './CARDS.js';

const getRandom = (maxNumber) => Math.floor(Math.random() * maxNumber);

export const shuffleCards = (cards) => {
  const indexes = [];
  const shuffledCards = [];
  let randomIndex = getRandom(cards.length);
  for (let i = cards.length; i > 0; i -= 1) {
    while (indexes.includes(randomIndex)) randomIndex = getRandom(cards.length);
    indexes.push(randomIndex);
    shuffledCards.push(cards[randomIndex]);
  }
  return shuffledCards;
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

export const createElement = (tag, className, textContent, id) => {
  const element = document.createElement(tag);

  if (Array.isArray(className)) {
    className.forEach((name) => element.classList.add(name));
  } else if (className) {
    element.classList.add(className);
  }

  element.textContent = textContent;

  if (id) element.id = id;

  return element;
};

export const getCardStats = (card) => {
  const correctPercentage = `${((card.correct / (card.correct + card.wrong)) * 100 || 0).toFixed(1)} %`;
  return [
    card.category, card.word, card.translation,
    card.correct, card.wrong, card.trained, correctPercentage,
  ];
};

export const getDifficultCards = (scores) => {
  const difficultCards = [];

  Object.keys(scores)
    .forEach((el) => {
      const scoredCard = scores[el];
      scoredCard.sound = CARDS.find((card) => card.word === scoredCard.word).sound;
      if (scoredCard.wrong > 0) difficultCards.push(scoredCard);
    });
  difficultCards
    .sort((a, b) => {
      const percentage = (card) => card.wrong / (card.correct + card.wrong);
      if (percentage(a) < percentage(b)) return 1;
      if (percentage(a) > percentage(b)) return -1;
      return 0;
    })
    .splice(8);

  return difficultCards;
};

export const scrollTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

export const toggleScrollLock = (isScrollable) => {
  const stopScroll = () => {
    const { scrollX, scrollY } = window;
    window.onscroll = () => window.scrollTo(scrollX, scrollY);
  };

  if (isScrollable) {
    stopScroll();
  } else {
    window.onscroll = () => {};
  }
};

export const isFlipCard = (node) => {
  const classes = ['card__front', 'card__back'];
  return classes.some((className) => node.classList.contains(className));
};
