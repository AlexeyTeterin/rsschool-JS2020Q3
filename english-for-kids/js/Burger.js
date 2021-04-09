import { createElement } from './utils.js';

export default class Burger {
  burger = createElement('div', 'menu-btn');

  render() {
    this.renderBars(3);
    return this.burger;
  }

  renderBars = (number) => {
    let numberOfBars = number;

    while (numberOfBars > 0) {
      const bar = createElement('span', 'bar');
      this.burger.append(bar);
      numberOfBars -= 1;
    }
  }
}
