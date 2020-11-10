const MENU = {
  main: `<ul class="menu-ul">
      <li class="menu-li btn-newGame">New game</li>
      <li class="menu-li btn-saveGame">Save game</li>
      <li class="menu-li btn-loadGame">Load game</li>
      <li class="menu-li btn-scores">Scores</li>
      <li class="menu-li btn-settings">Settings</li>
      </ul>`,
  settings: `<p>Field size:</p>
      <ul><li class='rows'>2x2</li>
      <li class='rows'>3x3</li>
      <li class='rows'>4x4</li>
      <li class='rows'>5x5</li>
      <li class='rows'>6x6</li>
      <li class='rows'>7x7</li>
      <li class='rows'>8x8</li>
      </ul>
      <div class='sound'>Sound:&nbsp<input type="checkbox" class="toggle" checked></div>
      
      <div class="btn-goBack">go back</div>`,
  savedGames: `<ul>
      <li class='slot autosaved'>1. Autosaved</li>
      <li class='slot'>1. ---</li>
      <li class='slot'>2. ---</li>
      <li class='slot'>3. ---</li>
      <li class='slot'>4. ---</li>
      <li class='slot'>5. ---</li>
      </ul>
      <div class="btn-goBack">go back</div>`,
};
class Game {
  properties = {
    rows: 4,
    timer: 0,
    formattedTime: 0,
    playing: false,
    movesCounter: 0,
  }

  header = {
    time: null,
    moves: null,
    pauseBtn: null,
  }

  gameBoard = null

  chipsNumbers = null

  chips = []

  menu = null

  settings = null

  scores = []

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
    this.header.pauseBtn.classList.add('pause');
    this.header.pauseBtn.textContent = this.properties.playing ? 'Pause game' : 'Resume game';
    this.header.pauseBtn.addEventListener('click', () => {
      if (this.chipsNumbers) this.setTimer(this.properties.playing ? 'off' : 'on');
    });
    if (!this.chipsNumbers) this.header.pauseBtn.textContent = '';
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
    // generate random chips
    this.chipsNumbers = this.randomizeChips();
    // create chips boxes
    this.createChips();

    // create menu
    this.menu = document.createElement('div');
    this.menu.classList.add('menu', 'hidden', 'hidden-content');
    this.gameBoard.append(this.menu);
    this.showMenu();

    // alert saved game
    if (localStorage.savedGame !== undefined) {
      const savedGameAlert = document.createElement('div');
      savedGameAlert.classList.add('saved-game-alert');
      savedGameAlert.innerHTML = 'You have unfinished game, <span class="load-game">continue</span>?';
      this.menu.prepend(savedGameAlert);
      document.querySelector('.load-game').addEventListener('click', () => this.loadGame());
    }
  }

  newGame() {
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
    // start timer
    this.setTimer('on');
    // check if puzzle solved on start
    this.checkResult();
  }

  hideMenu() {
    this.menu.classList.add('hidden');
  }

  showMenu() {
    this.menu.innerHTML = MENU.main;
    this.menu.classList = 'menu';

    // event listeners
    document.querySelector('.btn-settings').addEventListener('click', () => this.showSettings());
    document.querySelector('.btn-newGame').addEventListener('click', () => {
      this.newGame();
      this.hideMenu();
    });
    document.querySelector('.btn-saveGame').addEventListener('click', () => this.showSaveMenu());
    document.querySelector('.btn-loadGame').addEventListener('click', () => this.showLoadMenu());
    document.querySelector('.btn-scores').addEventListener('click', () => this.showScores());
  }

  showSettings() {
    this.menu.classList.add('hidden-content');

    setTimeout(() => {
      this.menu.innerHTML = MENU.settings;
      this.createMenuHeader('Settings');
      this.menu.classList.add('menu-settings');
      document.querySelector('.btn-goBack').addEventListener('click', () => this.goBack());
      const rows = document.querySelectorAll('.rows');

      // show selection on current rows number
      rows.forEach((option) => {
        if (this.properties.rows.toString() === option.textContent.slice(0, 1)) option.classList.add('selected');
      });

      // select another rows number
      rows.forEach((option) => {
        option.addEventListener('click', () => {
          document.querySelector('.selected').classList.remove('selected');
          option.classList.add('selected');

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
      this.createMenuHeader('Save game:');
      this.menu.classList.add('menu-saved-games');
      document.querySelector('.btn-goBack').addEventListener('click', () => this.goBack());
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
          slot.textContent = `${index}. ${timer} s,  ${movesCounter} moves (${rows}x${rows})`;
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
      this.createMenuHeader('Load game:');
      this.menu.classList.add('menu-saved-games');
      document.querySelector('.btn-goBack').addEventListener('click', () => this.goBack());
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
          slot.textContent = `${index}. ${timer} s,  ${movesCounter} moves (${rows}x${rows})`;
          if (index === '') slot.textContent = slot.textContent.replace('.', 'Autosaved: ');
        }
        slot.addEventListener('click', () => {
          if (localSaved) this.loadGame(index);
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
          if (currScore) li.textContent = `${i + 1}. ${currScore.date} - ${currScore.time} s, ${currScore.moves} moves (${currScore.rows}x${currScore.rows})`;
          else li.textContent = `${i + 1}. ---`;
        }
        scoresList.append(li);
      }

      this.menu.append(scoresHeader, scoresList, this.createGoBackBtn());

      this.menu.classList.remove('hidden-content');
    }, 250);
  }

  showCongrats() {
    this.menu.innerText = '';
    this.menu.classList = 'menu';
    setTimeout(() => {
      const congratsHeader = document.createElement('h1');
      congratsHeader.innerText = 'Well done!';

      const congratsText = document.createElement('div');
      congratsText.innerText = `You solved this puzzle in ${this.properties.formattedTime} and ${this.properties.movesCounter} moves`;

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
    goBackBtn.innerText = 'go back';
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

    // chips movement event listener
    this.chips.forEach((chip) => chip.addEventListener('click', () => {
      if (!this.properties.playing) this.setTimer('on');
      this.moveChips(chip);
    }));
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
    const chipPos = this.chips.indexOf(chip);
    const clickedChip = document.querySelectorAll('.chip')[chipPos];
    const emptyChip = document.querySelector('.chip-empty');
    const temp = emptyChip.innerHTML;
    const positionDifference = this.chips.indexOf(emptyChip) - chipPos;
    const chipIsMovable = () => [1, this.properties.rows].includes((Math.abs(positionDifference)));
    const params = {
      [`${this.properties.rows}`]: '(0, 100%)',
      1: '(100%, 0)',
      [`-${this.properties.rows}`]: '(0, -100%)',
      '-1': '(-100%, 0)',
    };

    if (!chipIsMovable()) return;

    clickedChip.style.setProperty('transform', `translate${params[positionDifference]}`);

    this.updateHeader(1);

    setTimeout(() => {
      emptyChip.innerHTML = chip.innerHTML;
      emptyChip.classList.remove('chip-empty');
      clickedChip.innerHTML = temp;
      clickedChip.classList.add('chip-empty');
      clickedChip.style.setProperty('transform', 'translate(0)');
      this.getChips();
      this.checkResult();
    }, 150);
  }

  saveGame(src) {
    if (!src) {
      localStorage.savedGame = JSON.stringify(this);
      // localStorage.savedGameRows = this.properties.rows;
    } else {
      localStorage.setItem(`savedGame${src}`, JSON.stringify(this));
    }
  }

  loadGame(src) {
    let source = src;
    if (!src) source = '';
    const localSaved = localStorage.getItem(`savedGame${source}`);
    try {
      const savedGame = JSON.parse(localSaved);
      this.properties.rows = +savedGame.properties.rows;
      this.gameBoard.style.setProperty('grid-template-columns',
        `repeat(${this.properties.rows}, 1fr)`);
      this.chipsNumbers = savedGame.chipsNumbers;
      this.createChips();
      this.fillChips(savedGame.chipsNumbers);
      this.properties.movesCounter = savedGame.properties.movesCounter;
      this.properties.timer = savedGame.properties.timer;
      this.updateHeader();
    } catch (error) {
      throw new Error('No any saved game found');
    }
    this.setTimer('on');

    this.hideMenu();
  }

  setTimer(switcher) {
    const tick = () => {
      this.properties.timer += 1;
      this.updateHeader();
      this.saveGame();
    };

    if (switcher === 'on') {
      this.properties.playing = true;
      this.header.pauseBtn.textContent = 'Pause game';
      this.hideMenu();
      window.timer = window.setInterval(tick, 1000);
    } else if (switcher === 'off') {
      this.properties.playing = false;
      this.header.pauseBtn.textContent = 'Resume game';
      this.showMenu();
      window.clearInterval(window.timer);
    }
  }

  checkResult() {
    const result = [];
    for (let i = 1; i < this.properties.rows ** 2; i += 1) result.push(i);
    result.push('');
    console.table(result.join(), this.chipsNumbers.join());
    if (result.join() === this.chipsNumbers.join()) {
      this.setTimer('off');
      this.showCongrats();
      console.log('Victory!!!');
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
    return `Time: ${minutes}:${seconds}`;
  }
}

const game = new Game();
game.init();
