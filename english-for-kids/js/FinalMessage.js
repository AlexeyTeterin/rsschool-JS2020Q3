import { createElement } from './utils.js';

export default class FinalMessage {
  constructor(state) {
    const isWon = !state.results.includes(false);
    const { mistakes } = state;
    const src = isWon ? './assets/img/finish_win.png' : './assets/img/finish_loose.png';
    const message = createElement('div', 'finish-message');
    message.innerText = isWon ? 'You win!' : `${mistakes} mistake`;
    if (mistakes > 1) message.innerText += 's';
    const img = new Image();
    img.src = src;

    img.onload = () => {
      message.style.setProperty('background-image', `url(${src})`);
      message.style.setProperty('opacity', 1);
    };
    return message;
  }
}
