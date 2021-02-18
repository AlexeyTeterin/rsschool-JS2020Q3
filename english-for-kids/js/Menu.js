import CATEGORIES from './categories.js';
import { createElement } from './utils.js';

export default class Menu {
  constructor() {
    this.menuUl = createElement('ul', 'menu');
  }

  render() {
    this.renderHomeLink();
    CATEGORIES.forEach((category) => this.renderMenuListItem(category));
    return this.menuUl;
  }

  renderHomeLink() {
    this.homeLink = createElement('li', 'home-link', '', 'home-link');
    this.menuUl.append(this.homeLink);
  }

  renderMenuListItem(title) {
    const menuLi = createElement('li', null, title);

    menuLi.dataset.category = title;
    menuLi.style.setProperty('background-image', `url(./assets/img/${title}.svg)`);
    this.menuUl.append(menuLi);
  }
}
