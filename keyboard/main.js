import KEYBOARD from './keyboard.js';
import textarea from './textarea.js';

// Creating new instance of KEYBOARD
const keyboard = new KEYBOARD();
keyboard.init();

// Speech recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechBtn = document.querySelector('.mic');
const recognition = new SpeechRecognition();
recognition.interimResults = true;
const modal = document.body.appendChild(document.createElement('div'));
modal.classList.add('modal', 'hidden');

// Event listeners
document.addEventListener('DOMContentLoaded', () => textarea.focus());
textarea.onfocus = () => keyboard.showKeyboard();
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
    modal.innerText = keyboard.properties.english ? 'Recognizing your speech...' : 'Распознавание речи...';
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
    recognition.stop();
  }
});
