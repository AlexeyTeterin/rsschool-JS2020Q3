import { createElement } from './utils.js';

export default class FlipCard {
  constructor(card) {
    this.flipCard = createElement('div', 'flip-card');
    this.flipCard.dataset.word = card.word;
    this.flipCard.dataset.sound = card.sound;
    this.cardEl = createElement('div', 'card');

    this.renderFront(card);
    this.renderBack(card);
    this.flipCard.append(this.cardEl);

    return this.flipCard;
  }

  createImage(card) {
    this.image = createElement('div', 'card__image');
    this.image.style.setProperty('background-image', `url(./assets/img/${card.category}_${card.word}.svg)`);
    return this.image;
  }

  renderFront(card) {
    const front = createElement('div', 'card__front');
    const title = createElement('div', 'card__title', card.word);
    const rotateBtn = createElement('div', 'card__rotate-btn');

    front.append(this.createImage(card), title, rotateBtn);
    this.cardEl.append(front);
  }

  renderBack(card) {
    const back = createElement('div', 'card__back');
    const translation = createElement('div', 'card__title', card.translation);

    back.append(this.createImage(card), translation);
    this.cardEl.append(back);
  }
}
