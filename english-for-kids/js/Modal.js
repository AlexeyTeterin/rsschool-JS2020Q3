import { createElement } from './utils.js';

export default class Modal {
  constructor() {
    this.modalOverlay = createElement('div', ['modal-overlay', 'hidden']);
  }

  render() {
    const modal = createElement('div', 'modal');
    const text = createElement('p', null, 'Are you sure you want to reset stats?');
    const yesBtn = createElement('button', 'yes-btn', 'Yes');
    const noBtn = createElement('button', 'no-btn', 'No');

    modal.append(text, yesBtn, noBtn);
    this.modalOverlay.append(modal);
    document.querySelector('header').append(this.modalOverlay);

    setTimeout(() => this.modalOverlay.classList.remove('hidden'), 0);

    return this.modalOverlay;
  }
}
