import { createElement } from './utils.js';

export default class FlipCard {
  constructor(card) {
    this.container = createElement('div', 'flip-card');
    this.container.dataset.word = card.word;
    this.container.dataset.sound = card.sound;
    this.cardEl = createElement('div', 'card');

    this.renderFront(card);
    this.renderBack(card);
    this.container.append(this.cardEl);

    return this.container;
  }

  createImage(card) {
    this.image = createElement('div', 'card__image');
    this.image.style.setProperty('background-image', `url(./assets/img/${card.category}_${card.word}.svg)`);
    return this.image;
  }

  renderFront(card) {
    this.front = createElement('div', 'card__front');
    this.cardTitle = createElement('div', 'card__title', card.word);
    this.rotateBtn = createElement('div', 'card__rotate-btn');

    this.front.append(this.createImage(card), this.cardTitle, this.rotateBtn);
    this.cardEl.append(this.front);
  }

  renderBack(card) {
    this.back = createElement('div', 'card__back');
    this.cardTranslation = createElement('div', 'card__title', card.translation);

    this.back.append(this.createImage(card), this.cardTranslation);
    this.cardEl.append(this.back);
  }
}
