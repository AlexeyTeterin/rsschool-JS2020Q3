document.body.appendChild(document.createElement('textarea'));
const textarea = document.querySelector('textarea');
textarea.classList.add('use-keyboard');
textarea.setAttribute('placeholder', 'Type your text here...');

const KEYBOARD = {
  elements: {
    info: '',
    main: null,
    keysContainer: null,
    keys: [],
    layouts: {
      ru: [
        'ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
        'tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\',
        'caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter',
        'lshift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'uarr', 'shift',
        'lctrl', 'lang', 'lalt', ' ', 'alt', 'ctrl', 'larr', 'darr', 'rarr',
      ],
      en: [
        '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
        'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
        'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'enter',
        'lshift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'uarr', 'shift',
        'lctrl', 'lang', 'lalt', ' ', 'alt', 'ctrl', 'larr', 'darr', 'rarr',
      ],
      ruShifted: [
        'Ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+', 'backspace',
        'tab', 'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ', '/',
        'caps', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', 'enter',
        'lshift', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', ',', 'uarr', 'shift',
        'lctrl', 'lang', 'lalt', ' ', 'alt', 'ctrl', 'larr', 'darr', 'rarr',
      ],
      enShifted: [
        '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'backspace',
        'tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|',
        'caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'enter',
        'lshift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'uarr', 'shift',
        'lctrl', 'lang', 'lalt', ' ', 'alt', 'ctrl', 'larr', 'darr', 'rarr',
      ],
      whichCodes: [
        192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 8,
        9, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220,
        20, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 13,
        999, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191,
      ],
    },
  },

  properties: {
    value: '',
    capsLock: null,
    shift: false,
    english: null,
  },

  init() {
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    this.elements.main.classList.add('keyboard', 'hidden');
    this.elements.keysContainer.className = 'keyboard__keys';
    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    this.elements.info = document.body.appendChild(document.createElement('div'));
    this.elements.info.classList.add('info');
    this.elements.info.textContent = 'Keyboard works properly in Windows. Press Shift + Ctrl to change language.';
    document.body.appendChild(this.elements.info);

    if (localStorage.capsLock === 'true') {
      this.toggleCapsLock();
      document.querySelector('#Caps').classList.toggle('keyboard__key--active', this.properties.capsLock);
    }

    this.langTrigger();

    this.phisycalInput();
  },

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
            if (textarea.selectionStart === 0
              && textarea.selectionEnd === textarea.selectionStart) {
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
          });
          break;

        case 'lshift':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'Shift';
          keyElement.id = 'ShiftLeft';

          keyElement.addEventListener('mousedown', () => {
            this.shiftPress();
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
          });
          keyElement.addEventListener('mouseup', () => {
            this.shiftUnpress();
          });
          break;

        case 'ctrl':
          keyElement.textContent = 'Ctrl';
          keyElement.id = 'ControlRight';
          break;

        case 'lctrl':
          keyElement.textContent = 'Ctrl';
          keyElement.id = 'ControlLeft';
          break;

        case 'lang':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = this.properties.english ? 'EN' : 'RU';
          keyElement.id = 'lang';
          keyElement.addEventListener('mousedown', () => {
            this.toggleLang();
          });
          break;

        case 'lalt':
          keyElement.textContent = 'Alt';
          keyElement.id = 'AltLeft';
          break;

        case 'alt':
          keyElement.textContent = 'Alt';
          keyElement.id = 'AltRight';
          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'Enter';

          keyElement.addEventListener('click', () => {
            textarea.setRangeText('\n', textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;

        case ' ':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.textContent = ' ';
          keyElement.id = 'Space';

          keyElement.addEventListener('click', () => {
            textarea.setRangeText(' ', textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;

        case 'darr':
          keyElement.textContent = '↓';
          keyElement.id = 'ArrowDown';

          keyElement.addEventListener('click', () => {
            textarea.setRangeText('↓', textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;

        case 'uarr':
          keyElement.textContent = '↑';
          keyElement.id = 'ArrowUp';

          keyElement.addEventListener('click', () => {
            textarea.setRangeText('↑', textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;

        case 'larr':
          keyElement.textContent = '←';
          keyElement.id = 'ArrowLeft';

          keyElement.addEventListener('click', () => {
            textarea.setRangeText('←', textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;

        case 'rarr':
          keyElement.textContent = '→';
          keyElement.id = 'ArrowRight';

          keyElement.addEventListener('click', () => {
            textarea.setRangeText('→', textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('click', () => {
            textarea.setRangeText(keyElement.textContent, textarea.selectionStart, textarea.selectionEnd, 'end');
          });
          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },

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
    KEYBOARD.elements.keys.forEach((key) => {
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
          break;

        case 'Backspace':
          break;

        case 'CapsLock':
          document.querySelector('#Caps').classList.toggle('keyboard__key--active', !KEYBOARD.properties.capsLock);
          KEYBOARD.toggleCapsLock();
          break;

        case 'Shift':
          if (KEYBOARD.properties.ctrl === true) {
            KEYBOARD.toggleLang();
          }
          KEYBOARD.shiftPress();
          break;

        case 'Tab':
          event.preventDefault();
          textarea
            .setRangeText('\t', textarea.selectionStart, textarea.selectionEnd, 'end');
          break;

        case 'ArrowUp':
          event.preventDefault();
          textarea
            .setRangeText('↑', textarea.selectionStart, textarea.selectionEnd, 'end');
          break;

        case 'ArrowDown':
          event.preventDefault();
          textarea
            .setRangeText('↓', textarea.selectionStart, textarea.selectionEnd, 'end');
          break;

        case 'ArrowRight':
          event.preventDefault();
          textarea
            .setRangeText('→', textarea.selectionStart, textarea.selectionEnd, 'end');
          break;

        case 'ArrowLeft':
          event.preventDefault();
          textarea
            .setRangeText('←', textarea.selectionStart, textarea.selectionEnd, 'end');
          break;

        default:
          event.preventDefault();
          if (event.key.length === 1) {
            switch (capsLock || shift) {
              case true:
                textarea
                  .setRangeText(inputChar.toUpperCase(), textarea.selectionStart, textarea.selectionEnd, 'end');
                break;

              default:
                textarea
                  .setRangeText(inputChar, textarea.selectionStart, textarea.selectionEnd, 'end');
                break;
            }
          }
          break;
      }
    };

    document.onkeyup = (event) => {
      const pos = whichCodes.indexOf(event.which);

      let counter = -1;
      document.querySelectorAll('.keyboard__key').forEach((key) => {
        counter += 1;
        if (key.innerText === event.code || event.code === key.id || pos === counter) {
          key.classList.remove('red');
        }
        if (event.key === 'Shift') {
          KEYBOARD.shiftUnpress();
        }
      });
    };
  },

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    localStorage.capsLock = this.properties.capsLock;

    this.elements.keys.forEach((key) => {
      const resultKey = key;
      if (key.textContent.length === 1) {
        resultKey.textContent = this.properties
          .capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
      return resultKey;
    });

    this.phisycalInput();
  },

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
  },

  langTrigger() {
    let counter = 0;
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Shift' && (counter === 5 || counter === 0)) {
        counter += 3;
      }
      if (event.key === 'Control' && (counter === 3 || counter === 0)) {
        counter += 5;
      }
      if (counter === 8) {
        this.toggleLang();
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.key === 'Shift' && (counter === 3 || counter === 8)) {
        counter -= 3;
      }
      if (event.key === 'Control' && (counter === 5 || counter === 8)) {
        counter -= 5;
      }
    });
  },

  shiftPress() {
    const {
      en,
      ruShifted,
      enShifted,
    } = this.elements.layouts;
    const {
      keys,
    } = this.elements;
    const {
      english,
    } = this.properties;

    for (let index = 0; index < keys.length; index += 1) {
      const buttonIsSymbol = en[index].length === 1;
      // Change only symbol buttons
      if (buttonIsSymbol) {
        if (english) {
          keys[index].textContent = enShifted[index];
        } else {
          keys[index].textContent = ruShifted[index];
        }
      }
    }
    this.properties.shift = true;
    this.phisycalInput();
  },

  shiftUnpress() {
    const {
      ru,
      en,
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
          keys[index].textContent = capsLock ? en[index].toUpperCase() : en[index];
        }
        if (!english) {
          keys[index].textContent = capsLock ? ru[index].toUpperCase() : ru[index];
        }
      }
    }
    this.properties.shift = false;

    this.phisycalInput();
  },
};

window.addEventListener('DOMContentLoaded', () => {
  KEYBOARD.init();
  textarea.focus();
});
