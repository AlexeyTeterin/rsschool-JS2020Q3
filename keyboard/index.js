import KEYBOARD from './keyboard.js';

document.body.appendChild(document.createElement('textarea'));
const textarea = document.querySelector('textarea');
textarea.classList.add('use-keyboard');
textarea.setAttribute('placeholder', 'Type your text here...');

// Creating new instance of KEYBOARD class
const keyboard = new KEYBOARD();
keyboard.init();

// Event listeners
window.addEventListener('DOMContentLoaded', () => textarea.focus());
textarea.addEventListener('focusin', () => keyboard.showKeyboard());

// Speech recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const speechBtn = document.querySelector('.mic');
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'en-US';

let p = document.createElement('p');
// const words = document.querySelector('.words');
textarea.appendChild(p);

recognition.addEventListener('result', e => {
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('');

  const poopScript = transcript.replace(/poop|poo|shit|dump/gi, '💩');
  p.textContent = poopScript;

  if (e.results[0].isFinal) {
    p = document.createElement('p');
    textarea.appendChild(p);
  }
});

// recognition.addEventListener('end', recognition.start);
speechBtn.addEventListener('click', () => {
  if (Array.from(speechBtn.classList).includes('keyboard__key--active')) {
    recognition.start();
    console.log('start recognition...');
  } else {
    recognition.stop();
    console.log('stop recognition');
  }
});

export default textarea;
