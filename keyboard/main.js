import KEYBOARD from './keyboard.js';

// Create textarea
document.body.appendChild(document.createElement('textarea'));
const textarea = document.querySelector('textarea');
textarea.classList.add('use-keyboard');
textarea.setAttribute('placeholder', 'Type your text here...');

// Creating new instance of KEYBOARD
const keyboard = new KEYBOARD();
keyboard.init();

// Speech recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechBtn = document.querySelector('.mic');
const recognition = new SpeechRecognition();
recognition.interimResults = true;

// Event listeners
window.addEventListener('DOMContentLoaded', () => textarea.focus());
textarea.addEventListener('focusin', () => keyboard.showKeyboard());
recognition.addEventListener('result', (e) => {
  const transcript = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join('');

  if (e.results[0].isFinal) {
    textarea.setRangeText(transcript, textarea.selectionStart, textarea.selectionEnd, 'end');
    textarea.setRangeText('\n', textarea.selectionStart, textarea.selectionEnd, 'end');
  }
});
recognition.addEventListener('end', () => {
  if (Array.from(speechBtn.classList).includes('pressed')) recognition.start();
});
speechBtn.addEventListener('click', () => {
  if (Array.from(speechBtn.classList).includes('pressed')) {
    recognition.lang = keyboard.properties.english ? 'en-US' : 'ru-RU';
    recognition.start();
  } else {
    recognition.stop();
  }
});

export default textarea;
