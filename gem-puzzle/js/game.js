/* eslint-disable import/extensions */
import NPuzzleSolver from './solver.js';

export default class Game {
  properties = {
    rows: 4,
    timer: 0,
    formattedTime: 0,
    playing: false,
    movesCounter: 0,
    sound: true,
    image: true,
    chipIsMoving: false,
    win: false,
  }

  mainMenuElements = {
    newGame: 'New Game',
    showSaveMenu: 'Save Game',
    showLoadMenu: 'Load Game',
    showScores: 'Scores',
    showSettings: 'Settings',
    showSolution: 'Show solution',
  }

  sounds = {
    chip: 'assets/audio/chip.wav',
    win: 'assets/audio/win.mp3',
    shake: 'assets/audio/shake.wav',
  }

  init() {
    // create header with elements
    this.header = document.createElement('header');
    // time
    this.header.time = document.createElement('time');
    this.header.append(this.header.time);
    // moves
    this.header.moves = document.createElement('div');
    this.header.moves.classList.add('moves');
    this.header.append(this.header.moves);
    // pauseBtn
    this.header.pauseBtn = document.createElement('div');
    this.header.pauseBtn.classList.add('pause', 'hidden');
    this.header.pauseBtn.addEventListener('click', () => {
      if (this.chipsNumbers) this.setTimer(this.properties.playing ? 'off' : 'on');
    });
    this.header.append(this.header.pauseBtn);
    document.body.append(this.header);
    this.updateHeader(0, 0);

    // load scores
    this.loadScores();

    // create game board
    this.gameBoard = document.createElement('div');
    this.gameBoard.classList.add('game-board');
    this.gameBoard.style.setProperty('grid-template-columns',
      `repeat(${this.properties.rows}, 1fr)`);
    document.body.append(this.gameBoard);

    // create hint field
    this.footer = document.createElement('footer');
    this.hint = document.createElement('div');
    this.hint.classList.add('hint');
    this.hint.textContent = 'Start new game or load saved one';
    this.soundIcon = document.createElement('div');
    this.soundIcon.classList.add('sound-icon');
    this.footer.append(this.hint, this.soundIcon);
    document.body.append(this.footer);

    // generate random chips
    this.chipsNumbers = this.randomizeChips();
    // create chips boxes
    this.createChips();
    this.setBG();

    // create menu
    this.menu = document.createElement('div');
    this.menu.classList.add('menu', 'hidden', 'hidden-content');
    this.gameBoard.append(this.menu);

    // event listeners for menu & hint link
    this.menu.addEventListener('click', (e) => this.clickHandler(e));
    this.hint.addEventListener('click', (e) => this.clickHandler(e));
    // chips movement event listener
    this.gameBoard.addEventListener('click', (event) => {
      if (event.target.className !== 'chip') return;
      this.moveChips(event.target);
    });
    // drag'n'drop listeners
    this.gameBoard.addEventListener('dragstart', (event) => event.target.classList.add('dragging'));
    this.gameBoard.addEventListener('dragend', (event) => event.target.classList.remove('dragging'));
    this.gameBoard.addEventListener('drop', () => this.moveChips(document.querySelector('.dragging')));
    // sound icon event listener
    this.soundIcon.addEventListener('click', () => {
      this.properties.sound = !this.properties.sound;
      this.soundIcon.classList.toggle('sound-icon-off');
      const switcherShowed = document.querySelector('#menuSoundSwitcher');
      if (switcherShowed) switcherShowed.checked = this.properties.sound;
    });

    this.showMenu();
  }

  newGame() {
    this.setTimer('off');

    // generate new chips layout
    this.chipsNumbers = this.randomizeChips();
    this.createChips();
    this.fillChips(this.chipsNumbers);
    this.getChips();

    // check solution and recursive call if no solution found
    if (!this.solve()) this.newGame();

    // start game
    this.updateHeader(0, 0);
    this.checkResult();
    this.setTimer('on');
    this.clearHint();
    this.setBG();

    this.hideMenu();
  }

  setBG(e) {
    const {
      rows,
    } = this.properties;
    if (e && e.target !== this.clickedChip) return;

    if (!this.properties.image) {
      this.chips.forEach((chip) => {
        chip.style.removeProperty('background-image');
        chip.style.removeProperty('background-position');
        chip.style.removeProperty('background-size');
      });
      return;
    }

    this.chips.forEach((chip, index) => {
      chip.style.setProperty('background-size', `${(rows + 1) * 100}%`);

      const id = +chip.textContent || index + 1;
      const step = 100 / rows;

      const posY = Math.floor((id - 1) / rows) * step;
      const posX = ((id - 1) % rows) * step;

      if (!chip.classList.contains('chip-empty')) {
        chip.style.setProperty('background-image', 'url(./assets/img/mountain.jpg)');
        chip.style.setProperty('background-position', `${posX}% ${posY}%`);
      } else {
        chip.style.removeProperty('background-image');
      }
    });
  }

  saveGame(src) {
    if (!src) {
      localStorage.savedGame = JSON.stringify(this);
    } else {
      localStorage.setItem(`savedGame${src}`, JSON.stringify(this));
    }
  }

  loadGame(src) {
    this.setTimer('off');
    let source = src;
    if (!src) source = '';
    const savedGame = JSON.parse(localStorage.getItem(`savedGame${source}`));
    try {
      Object.keys(this.properties).forEach((key) => {
        this.properties[key] = savedGame.properties[key];
      });
      this.gameBoard.style.setProperty('grid-template-columns',
        `repeat(${this.properties.rows}, 1fr)`);
      this.chipsNumbers = savedGame.chipsNumbers;
      this.sound = savedGame.sound;
      this.createChips();
      this.fillChips(savedGame.chipsNumbers);
      this.updateHeader();
    } catch (error) {
      throw new Error('Can`t load this game');
    }
    this.soundIcon.classList.toggle('sound-icon-off', !this.properties.sound);
    this.setTimer('on');
    this.clearHint();
    this.hideMenu();
  }

  hideMenu() {
    this.menu.classList.add('hidden');
  }

  showMenu() {
    this.menu.innerHTML = null;
    const ul = document.createElement('ul');
    const list = Object.keys(this.mainMenuElements);
    list.forEach((key) => {
      const li = document.createElement('li');
      li.setAttribute('data-action', key);
      li.classList.add(key);
      li.innerText = this.mainMenuElements[key];
      ul.append(li);
    });
    this.menu.append(ul);
    this.menu.classList = 'menu';
    if (this.chips[0].textContent === this.chips[1].textContent) document.querySelector('.showSolution').remove();
    // alert saved game
    if (localStorage.savedGame && this.header.pauseBtn.classList.contains('hidden')) {
      const savedGameAlert = document.createElement('div');
      savedGameAlert.classList.add('saved-game-alert');
      savedGameAlert.innerHTML = 'You have unfinished game, <span data-action="loadGame" class="pulsate">continue</span>?';
      this.menu.prepend(savedGameAlert);
    }
  }

  showSettings() {
    this.menu.classList.add('hidden-content');

    setTimeout(() => {
      this.menu.innerHTML = null;
      const p = document.createElement('p');
      p.innerText = 'Field size:';
      const ul = document.createElement('ul');
      ul.classList.add('rows');
      this.menu.append(p, ul);
      for (let i = 3; i < 9; i += 1) {
        const li = document.createElement('li');
        li.textContent = `${i}x${i}`;
        li.setAttribute('data-rows', i);
        ul.append(li);
      }
      this.menu.classList.add('menu-settings');
      this.createMenuHeader('Settings');

      // append sound switcher and goBack button
      this.menu
        .append(this.createSoundSwitcher(), this.createImageSwitcher(), this.createGoBackBtn());
      const rows = document.querySelector('.rows');

      // show selection on current rows number
      rows.childNodes.forEach((option) => {
        if (this.properties.rows === parseInt(option.dataset.rows, 10)) option.classList.add('selected');
      });

      // select another rows number
      rows.childNodes.forEach((option) => {
        option.addEventListener('click', () => {
          // clear header
          this.header.pauseBtn.classList.add('hidden');
          this.updateHeader(0, 0);
          // update hint
          this.hint.textContent = 'Start new game or load saved one';
          // selection styling
          document.querySelector('.selected').classList.remove('selected');
          option.classList.add('selected');
          // create new empty game board
          this.properties.rows = parseInt(option.textContent.slice(0, 1), 10);
          this.gameBoard.style.setProperty('grid-template-columns',
            `repeat(${this.properties.rows}, 1fr)`);
          this.chipsNumbers = this.randomizeChips();
          this.createChips();
          this.setBG();
        });
      });

      this.menu.classList.remove('hidden-content');
    }, 250);
  }

  showSaveMenu() {
    this.menu.classList.add('hidden-content');

    setTimeout(() => {
      // this.menu.innerHTML = MENU.savedGames;
      this.menu.innerHTML = null;
      this.menu.classList.add('menu-saved-games');
      this.createMenuHeader('Save game:');

      const slots = this.createSlots(1, 5);

      slots.forEach((el, index) => {
        const slot = el;
        const localSaved = JSON.parse(localStorage.getItem(`savedGame${index + 1}`));
        if (localSaved) {
          slot.textContent = this.stringifySavedGame(localSaved, index + 1);
        }
      });

      // save current game to slot on click
      slots.forEach((slot, index) => {
        slot.addEventListener('click', () => {
          this.saveGame(index + 1);
          this.showSaveMenu();
        });
      });

      this.menu.classList.remove('hidden-content');
    }, 250);
  }

  showLoadMenu() {
    this.menu.classList.add('hidden-content');

    setTimeout(() => {
      // this.menu.innerHTML = MENU.savedGames;
      this.menu.innerHTML = null;
      this.menu.classList.add('menu-saved-games');
      this.createMenuHeader('Load game:');

      const slots = this.createSlots(0, 5);

      slots.forEach((el, i) => {
        const index = i === 0 ? '' : i;
        const slot = el;
        const localSaved = JSON.parse(localStorage.getItem(`savedGame${index}`));
        if (localSaved) {
          slot.textContent = this.stringifySavedGame(localSaved, index);
          if (index === '') {
            slot.textContent = slot.textContent.replace('.', 'Autosaved: ');
            slot.classList.add('italic');
          }
        }

        // load game on slot click
        slot.addEventListener('click', () => {
          if (localSaved) this.loadGame(index);
          else this.shake(slot);
        });
        return slot;
      });

      this.menu.classList.remove('hidden-content');
    }, 250);
  }

  showScores() {
    this.menu.classList.add('hidden-content');
    setTimeout(() => {
      this.menu.innerText = '';

      const scoresHeader = document.createElement('h1');
      scoresHeader.innerText = 'Scores:';

      const scoresList = document.createElement('ul');
      scoresList.classList.add('scores');
      for (let i = 0; i < 10; i += 1) {
        const li = document.createElement('li');
        if (this.scores.length > 0) {
          const currScore = this.scores[i];
          if (currScore) li.textContent = `${i + 1}. ${currScore.date} - ${this.formatTime(currScore.time)} s, ${currScore.moves} moves (${currScore.rows}x${currScore.rows})`;
          else li.textContent = `${i + 1}. ---`;
        } else li.textContent = `${i + 1}. ---`;
        scoresList.append(li);
      }

      this.menu.append(scoresHeader, scoresList, this.createGoBackBtn());

      this.menu.classList.remove('hidden-content');
    }, 250);
  }

  showCongrats() {
    this.menu.innerHTML = null;
    this.menu.classList = 'menu';
    this.properties.win = true;
    this.header.pauseBtn.classList.add('hidden');
    this.playSound('win');
    setTimeout(() => {
      const congratsHeader = document.createElement('h1');
      congratsHeader.innerText = 'Well done!';

      const congratsText = document.createElement('div');
      congratsText.innerText = `You solved this puzzle in ${this.properties.formattedTime} and ${this.properties.movesCounter} moves`;
      congratsText.classList.add('congrats');

      this.menu.append(congratsHeader, congratsText, this.createGoBackBtn());
    }, 250);
  }

  solve() {
    const arr = this.chipsNumbers.slice().map((el) => parseInt(el, 10) || '');
    const {
      rows,
    } = this.properties;
    const result = [];
    // let counter = 0;
    do result.push(arr.splice(0, rows));
    while (arr.length > 0);

    const solver = new NPuzzleSolver(result);
    const solution = solver.solve();

    return solution;
  }

  showSolution() {
    const solution = this.solve();

    this.menu.classList.add('hidden-content');
    setTimeout(() => {
      if (!solution) {
        this.menu.innerHTML = null;
        this.createMenuHeader('This game has NO solution');
        this.menu.append(this.createGoBackBtn());
      } else {
        while (Game.hasDupsInside(solution) >= 0) solution.splice(Game.hasDupsInside(solution), 2);
        const steps = [];
        solution.forEach((step) => {
          steps.push(step.number);
        });

        this.menu.innerHTML = null;
        this.createMenuHeader(`Found solution in ${steps.length} steps: `);
        const p = document.createElement('p');
        p.classList.add('solution');
        p.textContent = `${steps.join('-')}`;
        const play = document.createElement('div');
        play.classList.add('btn-play');
        play.textContent = 'Autoplay this solution';
        play.addEventListener('click', () => this.autoPlay(steps));
        this.menu.append(p, play, this.createGoBackBtn());
      }

      this.menu.classList.remove('hidden-content');
    }, 250);
  }

  autoPlay(steps) {
    if (!steps) return;
    const isIos = /iPad|iPod|iPhone/i
      .test(navigator.platform);
    let timeout = 200;
    const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));
    this.hideMenu();
    this.setTimer('on');
    steps.forEach((step, index) => {
      if (isIos) timeout += 200;
      const remainingMoves = steps.length - index - 1;
      // increasing timeout for next move
      sleep(timeout += 300).then(() => {
        if (this.properties.win) return;
        const chip = this.chips.filter((el) => el.textContent === step.toString())[0];
        // clear timers on menu call
        if (!this.properties.playing) {
          let maxId = setTimeout(() => {});
          while (maxId) {
            clearTimeout(maxId);
            maxId -= 1;
          }
          // add 'continue autoplay' link to footer
          this.hint.innerHTML = 'Autoplay stopped, <span id="autoplay" class="hint-link">continue</span>?';
          document.querySelector('#autoplay').addEventListener('click', () => this.autoPlay(steps.slice(steps.length - remainingMoves - 1)));
          return;
        }
        // move chip and show progress in footer
        try {
          this.moveChips(chip);
          this.hint.textContent = `Autoplay in progress, ${remainingMoves} moves remaining...`;
          if (remainingMoves === 0) this.hint.textContent = 'Autoplay finished';
        } catch (error) {
          this.hint.textContent = 'Autoplay stopped';
        }
      });
    });
  }

  loadScores() {
    try {
      const localScores = JSON.parse(localStorage.getItem('GemScores'));
      this.scores = localScores || [];
    } catch (error) {
      this.scores = [];
    }
  }

  goBack() {
    this.menu.classList.add('hidden-content');
    setTimeout(() => {
      if (this.properties.win) {
        this.clearChips();
      }
      this.showMenu();
    }, 250);
  }

  createGoBackBtn() {
    const goBackBtn = document.createElement('div');
    goBackBtn.classList.add('btn-goBack');
    // goBackBtn.innerText = 'go back';
    goBackBtn.addEventListener('click', () => this.goBack());
    return goBackBtn;
  }

  createSoundSwitcher() {
    const soundSw = document.createElement('div');
    soundSw.classList.add('sound');
    soundSw.innerHTML = 'Chip sounds: &nbsp';
    const switcher = document.createElement('input');
    switcher.classList.add('toggle');
    switcher.id = 'menuSoundSwitcher';
    switcher.type = 'checkbox';
    switcher.checked = this.properties.sound;
    switcher.addEventListener('click', () => {
      this.properties.sound = !!switcher.checked;
      this.soundIcon.classList.toggle('sound-icon-off');
    });
    soundSw.append(switcher);
    return soundSw;
  }

  createImageSwitcher() {
    const imageSw = document.createElement('div');
    imageSw.classList.add('sound');
    imageSw.innerHTML = 'Background image: &nbsp';
    const switcher = document.createElement('input');
    switcher.classList.add('toggle');
    switcher.id = 'menuSoundSwitcher';
    switcher.type = 'checkbox';
    switcher.checked = this.properties.image;
    switcher.addEventListener('click', () => {
      this.properties.image = !!switcher.checked;
      this.setBG();
    });
    imageSw.append(switcher);
    return imageSw;
  }

  createMenuHeader(text) {
    const menuHeader = document.createElement('h1');
    menuHeader.textContent = text;
    this.menu.prepend(menuHeader);
  }

  createSlots(first, last) {
    const ul = document.createElement('ul');
    ul.classList.add('slots');
    for (let i = first; i <= last; i += 1) {
      const li = document.createElement('li');
      li.textContent = `${i}. ---`;
      setTimeout(ul.append(li));
    }
    this.menu.append(ul, this.createGoBackBtn());

    return document.querySelector('.slots').childNodes;
  }

  clearChips() {
    this.chips.map((el) => {
      const chip = el;
      chip.textContent = '';
      return chip;
    });
  }

  randomizeChips() {
    const nums = [];
    const numOfChips = this.properties.rows ** 2 - 1;
    const generateRandom = () => Math.ceil(Math.random() * numOfChips);

    for (let i = 0; i < numOfChips; i += 1) {
      let random = generateRandom();
      while (nums.includes(random)) random = generateRandom();
      nums.push(random);
    }
    nums.push('');

    return nums;
  }

  createChips() {
    // clear existing chips
    document.querySelectorAll('.chip').forEach((chip) => chip.remove());
    this.chips = [];

    this.chipsNumbers.forEach(() => {
      const chip = document.createElement('div');
      chip.classList.add('chip');
      this.gameBoard.append(chip);
      this.chips.push(chip);
    });

    // this.chips.forEach((chip) => chip.addEventListener('transitionend', (e) => this.setBG(e)));
  }

  getChips() {
    this.chips = Array.from(document.querySelectorAll('.chip'));
    this.chips.forEach((chip, index) => {
      this.chipsNumbers[index] = chip.textContent;
    });

    // draggable and dragover allow and refuse
    document.querySelectorAll('.chip').forEach((chip) => {
      chip.removeAttribute('ondragover');
      if (chip.textContent === '') {
        chip.setAttribute('ondragover', 'return false');
      } else if (!this.chipIsMovable(chip)) {
        chip.setAttribute('draggable', 'false');
      } else if (this.chipIsMovable(chip)) {
        chip.setAttribute('draggable', 'true');
      }
    });
  }

  fillChips(numbers) {
    this.chipsNumbers = numbers || [];
    this.chips.forEach((el, index) => {
      const chip = el;
      chip.textContent = this.chipsNumbers[index];
      chip.classList = 'chip';
      if (chip.textContent === '') {
        chip.classList.add('chip-empty');
      }
      return chip;
    });
  }

  chipIsMovable(chip) {
    const {
      rows,
    } = this.properties;
    const chipPos = this.chips.indexOf(chip);
    const emptyChip = document.querySelector('.chip-empty');
    const positionDifference = this.chips.indexOf(emptyChip) - chipPos;

    if (Math.abs(positionDifference) === rows && !this.properties.chipIsMoving) return true;
    if (Math.abs(positionDifference) === 1 && !this.properties.chipIsMoving) {
      if (chip.offsetTop === emptyChip.offsetTop) return true;
    }
    return false;
  }

  moveChips(chip) {
    const {
      rows,
    } = this.properties;
    const chipPos = this.chips.indexOf(chip);
    const clickedChip = chip;
    const emptyChip = document.querySelector('.chip-empty');
    const temp = emptyChip.innerHTML;
    const positionDifference = this.chips.indexOf(emptyChip) - chipPos;
    const params = {
      [`${rows}`]: '(0, 100%)',
      1: '(100%, 0)',
      [`-${rows}`]: '(0, -100%)',
      '-1': '(-100%, 0)',
    };

    // shaking blocked chips
    if (!this.chipIsMovable(chip)) {
      this.shake(chip);
      return;
    }

    // moving chip if it's unblocked
    clickedChip.style.setProperty('transform', `translate${params[positionDifference]}`);
    this.properties.chipIsMoving = true;
    clickedChip.setAttribute('draggable', 'false');
    this.playSound('chip');

    const handleTransEnd = (e) => {
      if (e.propertyName !== 'transform') return;
      emptyChip.innerHTML = chip.innerHTML;
      emptyChip.classList.remove('chip-empty');
      clickedChip.innerHTML = temp;
      clickedChip.style.setProperty('transform', 'translate(0)');
      this.properties.chipIsMoving = false;
      clickedChip.classList.add('chip-empty');
      this.getChips();
      this.checkResult();
      this.setBG();
      clickedChip.removeEventListener('transitionend', handleTransEnd);
    };

    clickedChip.addEventListener('transitionend', handleTransEnd);

    this.updateHeader(1);
  }

  playSound(which) {
    if (!this.properties.sound) return;
    const sound = new Audio();
    sound.src = this.sounds[which];
    sound.play();
  }

  setTimer(switcher) {
    this.header.pauseBtn.classList.remove('hidden');

    const tick = () => {
      this.properties.timer += 1;
      this.updateHeader();
      this.saveGame();
    };

    if (switcher === 'on') {
      this.properties.playing = true;
      this.header.pauseBtn.innerHTML = '<span class="hidden">Menu</span> &#9776;';
      this.header.pauseBtn.classList.remove('pulsate');
      this.hideMenu();
      this.properties.win = false;
      window.timer = window.setInterval(tick, 1000);
      this.clearHint();
    } else if (switcher === 'off') {
      this.properties.playing = false;
      this.header.pauseBtn.classList.add('pulsate');
      this.header.pauseBtn.textContent = 'Resume game';
      this.showMenu();
      window.clearInterval(window.timer);
    }
  }

  checkResult() {
    const result = [];
    for (let i = 1; i < this.properties.rows ** 2; i += 1) result.push(i);
    result.push('');
    if (result.join() === this.chipsNumbers.join()) {
      localStorage.removeItem('savedGame');
      this.header.pauseBtn.classList.add('hidden');
      this.setTimer('off');
      this.showCongrats();
      const today = new Date();
      const currScore = {
        date: `${today.getFullYear()}/${today.getMonth()}/${today.getDate()}`,
        rows: this.properties.rows,
        moves: this.properties.movesCounter,
        time: this.properties.timer,
      };
      this.scores.push(currScore);
      this.scores.sort((a, b) => a.time - b.time);
      if (this.scores.length > 10) this.scores.pop();
      localStorage.GemScores = JSON.stringify(this.scores);
    }
  }

  updateHeader(moves, time = this.properties.timer) {
    if (time === 0) this.properties.timer = 0;
    this.header.time.innerText = this.formatTime(time);

    if (moves === 0) this.properties.movesCounter = 0;
    if (moves === 1) this.properties.movesCounter += 1;
    document.querySelector('.moves').innerHTML = `Moves: ${this.properties.movesCounter}`;
  }

  clearHint() {
    this.hint.innerHTML = '';
  }

  stringifySavedGame(game, index) {
    const {
      rows,
      movesCounter,
      timer,
    } = game.properties;
    return `${index}. ${this.formatTime(timer)} s, ${movesCounter} moves (${rows}x${rows})`;
  }

  formatTime(time) {
    let minutes = Math.floor(time / 60);
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    let seconds = time % 60;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    this.properties.formattedTime = `${minutes}:${seconds}`;
    return `${minutes}:${seconds}`;
  }

  static hasDupsInside(arr) {
    for (let i = 0; i < arr.length - 1; i += 1) {
      if (arr[i].number === arr[i + 1].number) {
        return i;
      }
    }
    return -1;
  }

  shake(el) {
    this.playSound('shake');
    setTimeout(() => {
      el.classList.add('shake');
    }, 0);
    setTimeout(() => {
      el.classList.remove('shake');
    }, 500);
  }

  clickHandler(event) {
    const {
      action,
    } = event.target.dataset;
    if (action) this[action]();
  }
}