import { createElement } from './utils.js';

export default class Footer {
  constructor() {
    this.container = createElement('footer');

    this.renderRSlogo();
    this.renderCopyright();

    return this.container;
  }

  renderRSlogo() {
    this.logo = createElement('a', 'rsschool-logo');
    this.logo.setAttribute('href', 'https://rs.school/js/');
    this.logo.setAttribute('target', 'blank');

    this.img = createElement('img');
    this.img.src = './assets/img/rs_school_js.svg';
    this.img.alt = 'rsschool';
    this.img.width = '76';

    this.logo.append(this.img);
    this.container.append(this.logo);
  }

  renderCopyright() {
    this.copy = createElement('span');
    this.copy.innerHTML = '&copy; 2020 Alexey Teterin <a href="https://github.com/AlexeyTeterin" target="blank"><img src="./assets/img/GitHub-Mark-32px.png" alt="github" width="16" class="github-logo"></a>';

    this.container.append(this.copy);
  }
}
