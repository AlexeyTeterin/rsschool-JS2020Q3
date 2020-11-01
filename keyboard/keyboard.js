import textarea from './main.js';
import layouts from './layouts.js'

export default class KEYBOARD {
  constructor() {}

  elements = {
    info: '',
    main: null,
    keysContainer: null,
    keys: [],
    layouts: layouts,
  };

  properties = {
    value: '',
    capsLock: false,
    shift: false,
    english: null,
    sound: false,
    micOn: false,
    control: false,
  };

  init() {
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    this.elements.main.classList.add('keyboard', 'goDown');

    this.elements.keysContainer.className = 'keyboard__keys hidden';
    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    this.elements.info = document.body.appendChild(document.createElement('div'));
    this.elements.info.classList.add('info');
    this.elements.info.innerHTML = 'Keyboard works properly in Windows. Press <strong>&nbspShift + Ctrl </strong>&nbsp or <strong>&nbspShift + Alt </strong>&nbspto change language.';
    document.body.prepend(this.elements.info);

    if (localStorage.capsLock === 'true') {
      this.toggleCapsLock();
      document.querySelector('#Caps').classList.add('keyboard__key--active');
    }

    if (localStorage.sound === 'true') {
      this.toggleSound();
      document.querySelector('#sound').classList.add('keyboard__key--active');
    }

    this.langTrigger();
    this.phisycalInput();
  }

  createKeys() {
    const fragment = document.createDocumentFragment();
    let keyLayout = [];

    // Load stored language
    if (localStorage.english === 'false') {
      this.properties.english = false;
      keyLayout = this.elements.layouts.ru;
    } else {
      this.properties.english = true;
      keyLayout = this.elements.layouts.en;
    }

    // Create keys
    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['backspace', '\\', 'enter', 'shift'].indexOf(key) !== -1;

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');
      keyElement.addEventListener('click', () => {
        textarea.focus();
      });

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'Backspace';

          keyElement.addEventListener('click', () => {
            this.soundClick('./audio/switch-4.wav');
            if (textarea.selectionStart === 0 &&
              textarea.selectionEnd === textarea.selectionStart) {
              return;
            }
            if (textarea.selectionEnd === textarea.selectionStart) {
              textarea.setRangeText('', textarea.selectionStart - 1, textarea.selectionEnd, 'end');
            } else {
              textarea.setRangeText('', textarea.selectionStart, textarea.selectionEnd, 'end');
            }
          });
          break;

        case 'tab':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'Tab';

          keyElement.addEventListener('click', (e) => {
            e.preventDefault();
            this.soundClick('./audio/switch-4.wav');
            textarea.setRangeText('\t', textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;

        case 'caps':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          keyElement.textContent = 'CapsLock';
          keyElement.id = 'Caps';

          keyElement.addEventListener('click', () => {
            this.toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
            this.soundClick('./audio/switch-4.wav');
          });
          break;

        case 'lshift':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'Shift';
          keyElement.id = 'ShiftLeft';

          keyElement.addEventListener('mousedown', () => {
            this.shiftPress();
            this.soundClick('./audio/switch-4.wav');
          });
          keyElement.addEventListener('mouseup', () => {
            this.shiftUnpress();
          });
          break;

        case 'shift':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'Shift';
          keyElement.id = 'ShiftRight';

          keyElement.addEventListener('mousedown', () => {
            this.shiftPress();
            this.soundClick('./audio/switch-4.wav');
          });
          keyElement.addEventListener('mouseup', () => {
            this.shiftUnpress();
          });
          break;

        case 'ctrl':
          keyElement.textContent = 'Ctrl';
          keyElement.id = 'ControlRight';
          keyElement.addEventListener('click', () => {
            this.soundClick('./audio/switch-10.mp3');
          });
          break;

        case 'lctrl':
          keyElement.textContent = 'Ctrl';
          keyElement.id = 'ControlLeft';
          keyElement.addEventListener('click', () => {
            this.soundClick('./audio/switch-10.mp3');
          });
          break;

        case 'lang':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = this.properties.english ? 'EN' : 'RU';
          keyElement.id = 'lang';
          keyElement.addEventListener('mousedown', () => {
            this.soundClick('./audio/switch-10.mp3');
            this.toggleLang();
          });
          break;

        case 'lalt':
          keyElement.textContent = 'Alt';
          keyElement.id = 'AltLeft';
          keyElement.addEventListener('click', () => {
            this.soundClick('./audio/switch-10.mp3');
          });
          break;

        case 'alt':
          keyElement.textContent = 'Alt';
          keyElement.id = 'AltRight';
          keyElement.addEventListener('click', () => {
            this.soundClick('./audio/switch-10.mp3');
          });
          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'Enter';

          keyElement.addEventListener('click', () => {
            this.soundClick('./audio/switch-4.wav');
            textarea.setRangeText('\n', textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;

        case ' ':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.textContent = ' ';
          keyElement.id = 'Space';

          keyElement.addEventListener('click', () => {
            this.soundClick('./audio/switch-10.mp3');
            textarea.setRangeText(' ', textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;

        case 'darr':
          keyElement.textContent = '↓';
          keyElement.id = 'ArrowDown';

          keyElement.addEventListener('click', () => {
            this.soundClick('./audio/switch-10.mp3');
            // textarea.setRangeText('↓', textarea.selectionStart, textarea.selectionEnd, 'end');
            this.setCursorPos('end');
          });
          break;

        case 'uarr':
          keyElement.textContent = '↑';
          keyElement.id = 'ArrowUp';

          keyElement.addEventListener('click', () => {
            this.soundClick('./audio/switch-10.mp3');
            this.setCursorPos('start');
          });
          break;

        case 'larr':
          keyElement.textContent = '←';
          keyElement.id = 'ArrowLeft';

          keyElement.addEventListener('click', () => {
            this.soundClick('./audio/switch-10.mp3');
            // textarea.setRangeText('←', textarea.selectionStart, textarea.selectionEnd, 'end');
            this.setCursorPos('left');
          });
          break;

        case 'rarr':
          keyElement.textContent = '→';
          keyElement.id = 'ArrowRight';

          keyElement.addEventListener('click', () => {
            this.soundClick('./audio/switch-10.mp3');
            // textarea.setRangeText('→', textarea.selectionStart, textarea.selectionEnd, 'end');
            this.setCursorPos('right');
          });
          break;

        case 'on/off':
          keyElement.classList.add('keyboard__key--dark', 'off', 'keyboard__key--activatable', 'keyboard__key--active');
          keyElement.id = 'off';
          keyElement.append(document.createElement('img'));
          keyElement.children[0].src = './img/on-off-icon.svg';
          keyElement.children[0].alt = 'OFF';

          keyElement.addEventListener('click', () => {
            this.soundClick('./audio/switch-10.mp3');
            this.hideKeyboard();
            keyElement.classList.remove('keyboard__key--active');
          });
          break;

        case 'sound':
          keyElement.classList.add('keyboard__key--dark', 'sound', 'keyboard__key--activatable');
          keyElement.id = 'sound';
          keyElement.append(document.createElement('img'));
          keyElement.children[0].src = './img/sound-off.svg';
          keyElement.children[0].alt = 'sound';

          keyElement.addEventListener('click', () => {
            this.toggleSound();
            this.soundClick('./audio/switch-10.mp3');
          });
          break;

        case 'mic':
          keyElement.classList.add('keyboard__key--dark', 'mic', 'keyboard__key--activatable');
          keyElement.id = 'mic';
          keyElement.append(document.createElement('img'));
          keyElement.children[0].src = './img/mic.svg';
          keyElement.children[0].alt = 'mic';

          keyElement.addEventListener('click', () => {
            this.toggleMic();
            this.soundClick('./audio/switch-10.mp3');
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('click', () => {
            textarea.setRangeText(keyElement.textContent, textarea.selectionStart, textarea.selectionEnd, 'end');
            this.soundClick('./audio/switch-10.mp3');
          });
          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  }

  hideKeyboard() {
    this.elements.keysContainer.classList.add('hidden');
    textarea.blur();
    setTimeout(() => {
      this.elements.main.classList.add('goDown');
    }, 200);
  }

  showKeyboard() {
    this.elements.keysContainer.classList.remove('hidden');
    this.elements.main.classList.remove('goDown');
    document.querySelector('#off').classList.add('keyboard__key--active');
  }

  setCursorPos(pos) {
    if ('selectionStart' in textarea) {
      switch (pos) {
        case 'left':
          textarea.selectionStart -= 1;
          break;

        case 'right':
          textarea.selectionStart += 1;
          break;

        case 'start':
          textarea.selectionStart = 0;
          break;

        default:
          textarea.selectionStart = textarea.textLength;
          break;
      }
      textarea.selectionEnd = textarea.selectionStart;
    }
  }

  // Input from real keyboard
  phisycalInput() {
    const {
      whichCodes,
    } = this.elements.layouts;
    const {
      capsLock,
      shift,
    } = this.properties;
    const keySet = [];
    this.elements.keys.forEach((key) => {
      keySet.push(key.textContent);
    });

    document.onkeydown = (event) => {
      const pos = whichCodes.indexOf(event.which);
      const inputChar = pos > -1 ? keySet[pos].toLowerCase() : event.key;
      let counter = -1;

      document.querySelectorAll('.keyboard__key').forEach((key) => {
        counter += 1;
        if (key.innerText === event.code || event.code === key.id || pos === counter) {
          key.classList.add('red');
        }
      });

      switch (event.key) {
        case 'Enter':
        case 'Backspace':
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowRight':
        case 'ArrowLeft':
        case 'CapsLock':
          break;

        case 'Control':
          // this.properties.control = true;
          break;

        case 'Shift':
          this.shiftPress();
          break;

        case 'Tab':
          event.preventDefault();
          textarea
            .setRangeText('\t', textarea.selectionStart, textarea.selectionEnd, 'end');
          break;

        default:
          event.preventDefault();
          if (event.key.length === 1) {
            if (capsLock === shift) {
              textarea
                .setRangeText(inputChar, textarea.selectionStart, textarea.selectionEnd, 'end');
            } else {
              textarea
                .setRangeText(inputChar.toUpperCase(), textarea.selectionStart, textarea.selectionEnd, 'end');
            }
          }
          break;
      }
    };

    document.onkeyup = (event) => {
      const pos = whichCodes.indexOf(event.which);
      let counter = -1;

      switch (event.key) {
        case 'Enter':
        case 'Tab':
        case 'Shift':
        case 'Backspace':
          this.soundClick('./audio/switch-4.wav');
          break;

        case 'CapsLock':
          this.soundClick('./audio/switch-4.wav');
          document.querySelector('#Caps').classList.toggle('keyboard__key--active', !this.properties.capsLock);
          this.toggleCapsLock();
          break;

        case 'Control':
          this.properties.control = false;
          break;

        default:
          this.soundClick('./audio/switch-10.mp3');
          break;
      }

      document.querySelectorAll('.keyboard__key').forEach((key) => {
        counter += 1;
        if (key.innerText === event.code || event.code === key.id || pos === counter) {
          key.classList.remove('red');
        }
        if (event.key === 'Shift') {
          this.shiftUnpress();
        }
      });
    };
  }

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    localStorage.capsLock = this.properties.capsLock;

    if (localStorage.capsLock) {
      this.shiftUnpress();
    } else {
      this.shiftPress();
    }

    this.phisycalInput();
  }

  toggleSound() {
    const {
      sound,
    } = this.properties;
    const soundBtn = document.querySelector('#sound');
    if (sound) {
      soundBtn.classList.remove('keyboard__key--active');
      soundBtn.children[0].src = './img/sound-off.svg';
    } else {
      soundBtn.classList.add('keyboard__key--active');
      soundBtn.children[0].src = './img/sound-on.svg';
    }
    this.properties.sound = !sound;
    localStorage.sound = !sound;
  }

  toggleMic() {
    const {
      micOn,
    } = this.properties;
    const micBtn = document.querySelector('#mic');
    if (micOn) {
      micBtn.classList.remove('keyboard__key--active', 'pressed');
    } else {
      micBtn.classList.add('keyboard__key--active', 'pressed');
    }
    this.properties.micOn = !micOn;
  }

  soundClick(sound) {
    const audio = new Audio(sound);
    if (this.properties.sound) {
      audio.play();
    }
  }

  toggleLang() {
    const {
      ru,
      ruShifted,
      en,
      enShifted,
    } = this.elements.layouts;
    const {
      capsLock,
      shift,
      english,
    } = this.properties;
    const {
      keys,
    } = this.elements;
    const langButtonText = document.getElementById('lang').textContent;

    for (let index = 0; index < keys.length; index += 1) {
      const buttonIsSymbol = en[index].length === 1;
      // Change only symbol buttons
      if (buttonIsSymbol) {
        if (english) {
          if (capsLock) {
            keys[index].textContent = shift ? ruShifted[index] : ru[index].toUpperCase();
          } else {
            keys[index].textContent = shift ? ruShifted[index] : ru[index];
          }
        }
        if (!english) {
          if (capsLock) {
            keys[index].textContent = shift ? enShifted[index] : en[index].toUpperCase();
          } else {
            keys[index].textContent = shift ? enShifted[index] : en[index];
          }
        }
      }
    }

    if (langButtonText === 'EN') {
      document.getElementById('lang').textContent = 'RU';
    } else document.getElementById('lang').textContent = 'EN';

    localStorage.setItem('english', !this.properties.english);
    this.properties.english = !this.properties.english;

    this.phisycalInput();
  }

  langTrigger() {
    let counter = 0;

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Shift' && (counter === 5 || counter === 0)) {
        counter += 3;
      }
      if (['Control', 'Alt'].includes(event.key) && (counter === 3 || counter === 0)) {
        counter += 5;
      }
      if (counter === 8) this.toggleLang();
    });

    document.addEventListener('keyup', (event) => {
      if (event.key === 'Shift' && (counter === 3 || counter === 8)) {
        counter -= 3;
      }
      if (['Control', 'Alt'].includes(event.key) && (counter === 5 || counter === 8)) {
        counter -= 5;
      }
    });
  }

  shiftPress() {
    const {
      en,
      ru,
      ruShifted,
      enShifted,
    } = this.elements.layouts;
    const {
      keys,
    } = this.elements;
    const {
      english,
      capsLock,
    } = this.properties;

    for (let index = 0; index < keys.length; index += 1) {
      const buttonIsSymbol = en[index].length === 1;
      // Change only symbol buttons
      if (buttonIsSymbol) {
        if (english) {
          keys[index].textContent = capsLock ? en[index] : enShifted[index];
        } else if (!english) {
          keys[index].textContent = capsLock ? ru[index] : ruShifted[index];
        }
      }
    }

    this.properties.shift = true;
    this.phisycalInput();
  }

  shiftUnpress() {
    const {
      ru,
      en,
      ruShifted,
      enShifted,
    } = this.elements.layouts;
    const {
      keys,
    } = this.elements;
    const {
      capsLock,
      english,
    } = this.properties;

    for (let index = 0; index < keys.length; index += 1) {
      const buttonIsSymbol = en[index].length === 1;
      // Change only symbol buttons
      if (buttonIsSymbol) {
        if (english) {
          keys[index].textContent = capsLock ? enShifted[index] : en[index];
        }
        if (!english) {
          keys[index].textContent = capsLock ? ruShifted[index] : ru[index];
        }
      }
    }

    this.properties.shift = false;
    this.phisycalInput();
  }
}