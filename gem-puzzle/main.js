const MENU = {
  savedGames: `<ul>
      <li class='slot autosaved'>Autosaved - empty</li>
      <li class='slot'>1. ---</li>
      <li class='slot'>2. ---</li>
      <li class='slot'>3. ---</li>
      <li class='slot'>4. ---</li>
      <li class='slot'>5. ---</li>
      </ul>`,
};
class Game {
  properties = {
    rows: 4,
    timer: 0,
    formattedTime: 0,
    playing: false,
    movesCounter: 0,
    sound: true,
    chhipIsMoving: false,
  }

  mainMenuElements = {
    newGame: 'New Game',
    showSaveMenu: 'Save Game',
    showLoadMenu: 'Load Game',
    showScores: 'Scores',
    showSettings: 'Settings',
  }

  sounds = {
    chip: './assets/audio/chip.wav',
    win: './assets/audio/win.mp3',
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
    // append header to body
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
    // chips movement event listener (using event delegation)
    this.gameBoard.addEventListener('click', (event) => {
      if (event.target.className !== 'chip') return;
      if (!this.properties.playing) this.setTimer('on');
      this.moveChips(event.target);
    });
    // generate random chips
    this.chipsNumbers = this.randomizeChips();
    // create chips boxes
    this.createChips();

    // create menu
    this.menu = document.createElement('div');
    this.menu.classList.add('menu', 'hidden', 'hidden-content');
    this.gameBoard.append(this.menu);
    this.showMenu();
  }

  newGame() {
    this.setTimer('off');
    // generate random chips
    this.chipsNumbers = this.randomizeChips();
    // create chips boxes
    this.createChips();
    // fill chips with numbers
    this.fillChips(this.chipsNumbers);
    // save chips to game state
    this.getChips();
    // clear timer & moves
    this.updateHeader(0, 0);
    // check if puzzle solved on start
    this.checkResult();
    this.hideMenu();
    // start timer
    this.setTimer('on');
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
      li.innerText = this.mainMenuElements[key];
      ul.append(li);
    });
    this.menu.append(ul);

    this.menu.classList = 'menu';

    // alert saved game
    if (localStorage.savedGame && this.header.pauseBtn.classList.contains('hidden')) {
      const savedGameAlert = document.createElement('div');
      savedGameAlert.classList.add('saved-game-alert');
      savedGameAlert.innerHTML = 'You have unfinished game, <span data-action="loadGame" class="pulsate">continue</span>?';
      this.menu.prepend(savedGameAlert);
    }

    // event listeners
    this.menu.addEventListener('click', (event) => {
      const {
        action,
      } = event.target.dataset;
      if (action) this[action]();
    });
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
      // create sound switcher
      const sound = document.createElement('div');
      sound.classList.add('sound');
      sound.innerHTML = 'Chip sounds: &nbsp';
      const switcher = document.createElement('input');
      switcher.classList.add('toggle');
      switcher.type = 'checkbox';
      switcher.checked = this.properties.sound;
      switcher.addEventListener('click', () => {
        this.properties.sound = !!switcher.checked;
      });
      sound.append(switcher);
      this.menu.append(sound);

      this.menu.append(this.createGoBackBtn());
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
          // selection styling
          document.querySelector('.selected').classList.remove('selected');
          option.classList.add('selected');
          // create new empty game board
          this.properties.rows = parseInt(option.textContent.slice(0, 1), 10);
          this.gameBoard.style.setProperty('grid-template-columns',
            `repeat(${this.properties.rows}, 1fr)`);
          this.chipsNumbers = this.randomizeChips();
          this.createChips();
        });
      });

      this.menu.classList.remove('hidden-content');
    }, 250);
  }

  showSaveMenu() {
    this.menu.classList.add('hidden-content');

    setTimeout(() => {
      this.menu.innerHTML = MENU.savedGames;
      this.menu.classList.add('menu-saved-games');
      this.createMenuHeader('Save game:');
      this.menu.append(this.createGoBackBtn());

      const slots = document.querySelectorAll('.slot');
      document.querySelector('.autosaved').remove();

      slots.forEach((el, index) => {
        const slot = el;
        const localSaved = JSON.parse(localStorage.getItem(`savedGame${index}`));
        if (localSaved) {
          const {
            rows,
            movesCounter,
            timer,
          } = localSaved.properties;
          slot.textContent = `${index}. ${this.formatTime(timer)} s,  ${movesCounter} moves (${rows}x${rows})`;
        }
      });

      slots.forEach((slot, index) => {
        slot.addEventListener('click', () => {
          this.saveGame(index);
          this.showSaveMenu();
        });
      });

      this.menu.classList.remove('hidden-content');
    }, 250);
  }

  showLoadMenu() {
    this.menu.classList.add('hidden-content');

    setTimeout(() => {
      this.menu.innerHTML = MENU.savedGames;
      this.menu.classList.add('menu-saved-games');
      this.createMenuHeader('Load game:');
      this.menu.append(this.createGoBackBtn());

      const slots = document.querySelectorAll('.slot');

      slots.forEach((el, i) => {
        const index = i || '';
        const slot = el;
        const localSaved = JSON.parse(localStorage.getItem(`savedGame${index}`));
        if (localSaved) {
          const {
            rows,
            movesCounter,
            timer,
          } = localSaved.properties;
          slot.textContent = `${index}. ${this.formatTime(timer)} s,  ${movesCounter} moves (${rows}x${rows})`;
          if (index === '') slot.textContent = slot.textContent.replace('.', 'Autosaved: ');
        }
        slot.addEventListener('click', () => {
          if (localSaved) this.loadGame(index);
          else {
            setTimeout(() => {
              slot.classList.add('shake');
            }, 0);
            setTimeout(() => {
              slot.classList.remove('shake');
            }, 500);
          }
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
    this.menu.innerText = '';
    this.menu.classList = 'menu';
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

  createMenuHeader(text) {
    const menuHeader = document.createElement('h1');
    menuHeader.textContent = text;
    this.menu.prepend(menuHeader);
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
  }

  getChips() {
    this.chips = Array.from(document.querySelectorAll('.chip'));
    this.chips.forEach((chip, index) => {
      this.chipsNumbers[index] = chip.textContent;
    });
  }

  fillChips(numbers) {
    this.chipsNumbers = numbers || [];
    this.chips.forEach((el, index) => {
      const chip = el;
      chip.textContent = this.chipsNumbers[index];
      chip.classList = 'chip';
      if (chip.textContent === '') chip.classList.add('chip-empty');
      return chip;
    });
  }

  moveChips(chip) {
    const {
      rows,
    } = this.properties;
    const chipPos = this.chips.indexOf(chip);
    const clickedChip = document.querySelectorAll('.chip')[chipPos];
    const emptyChip = document.querySelector('.chip-empty');
    const temp = emptyChip.innerHTML;
    const positionDifference = this.chips.indexOf(emptyChip) - chipPos;
    const chipIsMovable = () => {
      if (Math.abs(positionDifference) === rows && !this.properties.chipIsMoving) return true;
      if (Math.abs(positionDifference) === 1 && !this.properties.chipIsMoving) {
        if (clickedChip.offsetTop === emptyChip.offsetTop) return true;
      }
      return false;
    };
    const params = {
      [`${rows}`]: '(0, 100%)',
      1: '(100%, 0)',
      [`-${rows}`]: '(0, -100%)',
      '-1': '(-100%, 0)',
    };

    // shaking blocked chips
    if (!chipIsMovable()) {
      setTimeout(() => {
        clickedChip.classList.add('shake');
      }, 0);
      setTimeout(() => {
        clickedChip.classList.remove('shake');
      }, 500);
      return;
    }

    // moving chip if it's unblocked
    this.playSound('chip');
    clickedChip.style.setProperty('transform', `translate${params[positionDifference]}`);
    this.properties.chipIsMoving = true;
    setTimeout(() => {
      emptyChip.innerHTML = chip.innerHTML;
      emptyChip.classList.remove('chip-empty');
      clickedChip.innerHTML = temp;
      clickedChip.classList.add('chip-empty');
      clickedChip.style.setProperty('transform', 'translate(0)');
      this.getChips();
      this.checkResult();
      this.properties.chipIsMoving = false;
    }, 125);

    this.updateHeader(1);
  }

  playSound(which) {
    if (!this.properties.sound) return;
    const sound = new Audio();
    sound.src = this.sounds[which];
    sound.play();
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
    // this.checkResult();
    this.setTimer('on');
    this.hideMenu();
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
      window.timer = window.setInterval(tick, 1000);
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

  formatTime(time) {
    let minutes = Math.floor(time / 60);
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    let seconds = time % 60;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    this.properties.formattedTime = `${minutes}:${seconds}`;
    return `${minutes}:${seconds}`;
  }
}

const game = new Game();
game.init();
