export const shuffle = (array) => {
  const len = document.querySelectorAll('.flip-card').length;
  const random = () => Math.floor(Math.random() * len);
  const indexes = [];
  const result = [];
  let index = random();
  for (let i = len; i > 0; i -= 1) {
    while (indexes.includes(index)) index = random();
    indexes.push(index);
    result.push(array[index]);
  }
  return result;
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

export const scrollTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

export const getCardStats = (card) => {
  const correctPercentage = `${((card.correct / (card.correct + card.wrong)) * 100 || 0).toFixed(1)} %`;
  return [
    card.category, card.word, card.translation,
    card.correct, card.wrong, card.trained, correctPercentage,
  ];
};
