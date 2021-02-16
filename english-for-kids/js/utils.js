export const shuffle = (array) => {
  const len = this.elements.gameField.querySelectorAll('.flip-card').length;
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

export const createElement = (tag, classes, textContent, id) => {
  const element = document.createElement(tag);
  if (Array.isArray(classes)) classes.forEach((name) => element.classList.add(name));
  else element.classList.add(classes);
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
