import { createElement } from './utils.js';

export default class FinalMessage {
  constructor(state) {
    this.state = state;
  }

  render() {
    const { mistakes, images, results } = this.state;
    const isAllCorrect = !results.includes(false);
    const src = isAllCorrect ? images.winImg : images.looseImg;
    const message = createElement('div', 'finish-message');
    const img = new Image();

    message.innerText = isAllCorrect ? 'You win!' : `${mistakes} mistake`;
    message.innerText += (mistakes > 1) ? 's' : '';
    img.src = src;
    img.onload = () => {
      message.style.setProperty('background-image', `url(${src})`);
      message.style.setProperty('opacity', 1);
    };

    return message;
  }
}
