import { createElement } from './utils.js';

export default class CategoryCard {
  constructor(category) {
    this.category = category;
    this.categoryCard = createElement('div', 'category-card');
    this.categoryCard.dataset.category = category;
  }

  render() {
    this.renderImage(this.category);
    this.renderTitle(this.category);

    return this.categoryCard;
  }

  renderImage(category) {
    const cardImage = createElement('div', 'card__image');
    cardImage.style.setProperty('background-image', `url(./assets/img/${category}.svg)`);

    this.categoryCard.append(cardImage);
  }

  renderTitle(category) {
    const cardTitle = createElement('div', 'card__title', category);

    this.categoryCard.append(cardTitle);
  }
}
