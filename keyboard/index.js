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

export default textarea;
