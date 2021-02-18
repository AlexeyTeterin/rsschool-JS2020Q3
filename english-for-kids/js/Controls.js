import { createElement } from './utils.js';

export default class Controls {
  constructor() {
    this.controls = createElement('div', 'controls');
  }

  render() {
    this.renderGameModeToggle();
    this.renderStatsBtn();
    return this.controls;
  }

  renderGameModeToggle() {
    this.checkbox = createElement('input', null, null, 'checkbox');
    this.toggle = createElement('label', null, null, 'toggle-mode');
    const knob = createElement('div', null, null, 'knob');
    const play = createElement('div', null, 'Play', 'play');
    const train = createElement('div', null, 'Train', 'train');

    this.checkbox.setAttribute('type', 'checkbox');
    this.toggle.setAttribute('for', 'checkbox');

    this.toggle.append(knob, play, train);
    this.controls.append(this.checkbox, this.toggle);
  }

  renderStatsBtn() {
    this.controls.statsBtn = createElement('button', 'stats-btn', 'Stats');

    this.controls.append(this.controls.statsBtn);
  }
}
