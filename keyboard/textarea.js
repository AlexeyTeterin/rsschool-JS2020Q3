// Create textarea
document.body.appendChild(document.createElement('textarea'));
const textarea = document.querySelector('textarea');
textarea.classList.add('use-keyboard');
textarea.setAttribute('placeholder', 'Type your text here...');

export default textarea;
