import { createElement } from './utils.js';

export default class Controls {
  constructor() {
    this.controls = createElement('div', 'controls');

    this.renderGameModeToggle();
    this.renderStatsBtn();

    return this.controls;
  }

  renderGameModeToggle() {
    this.checkbox = createElement('input', null, null, 'checkbox');
    this.label = createElement('label', null, null, 'toggle-mode');
    this.knob = createElement('div', null, null, 'knob');
    this.play = createElement('div', null, 'Play', 'play');
    this.train = createElement('div', null, 'Train', 'train');

    this.checkbox.setAttribute('type', 'checkbox');
    this.label.setAttribute('for', 'checkbox');

    this.label.append(this.knob, this.play, this.train);
    this.controls.append(this.checkbox, this.label);
  }

  renderStatsBtn() {
    this.statsBtn = createElement('button', 'stats-btn', 'Stats');

    this.controls.append(this.statsBtn);
  }
}
