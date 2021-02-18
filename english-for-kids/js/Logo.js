import { createElement } from './utils.js';

export default class Logo {
  constructor(title) {
    this.logo = createElement('div', 'logo');
    this.h1 = createElement('h1', 'logo__title', title);
  }

  render() {
    this.logo.append(this.h1);
    return this.logo;
  }
}
