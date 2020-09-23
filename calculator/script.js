class Calculator {
  constructor(PREV_OPERAND, CURR_OPERAND) {
    this.PREV_OPERAND = PREV_OPERAND;
    this.CURR_OPERAND = CURR_OPERAND;
    this.clear();
  }

  clear() {
    this.currOperand = '';
    this.prevOperand = '';
    this.operation = undefined;
    this.equalsPressed = false;
    this.hideAlert();
  }

  delete() {
    this.currOperand = this.currOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (this.equalsPressed) {
      this.currOperand = '';
      this.equalsPressed = false;
    }
    if (number === '.' && this.currOperand.includes('.')) return;
    if (this.currOperand === '0') this.currOperand = number.toString();
    else this.currOperand = this.currOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.operation !== undefined && this.prevOperand !== '' && this.currOperand !== '') this.compute();
    if (operation === 'xy') operation = '^';

    this.operation = operation;

    if (this.currOperand === '') {
      this.prevOperand = this.prevOperand.slice(0, -1) + operation.toString();
    } else {
      if (operation === '√') {
        this.compute();
      } else {
        this.prevOperand = `${this.currOperand.toString()} ${operation.toString()}`;
        this.currOperand = '';
      }
    }

  }

  compute() {
    if (this.prevOperand === this.operation) this.prevOperand = 0;
    switch (this.operation) {
      case '+':
        if (this.prevOperand === '') return;
        this.currOperand =
          parseFloat(this.prevOperand) + parseFloat(this.currOperand || 0);
        break;
      case '-':
        if (this.prevOperand === '') return;
        this.currOperand = parseFloat(this.prevOperand) - parseFloat(this.currOperand || 0);
        break;
      case '/':
        if (this.prevOperand === '') return;
        this.currOperand = parseFloat(this.prevOperand) / parseFloat(this.currOperand || 1);
        break;
      case '*':
        if (this.prevOperand === '') return;
        this.currOperand = parseFloat(this.prevOperand) * parseFloat(this.currOperand || this.prevOperand);
        break;
      case '^':
        if (this.prevOperand === '') return;
        this.currOperand = parseFloat(this.prevOperand) ** parseFloat(this.currOperand);
        break;
      case '√':
        if (parseFloat(this.currOperand) < 0) {
          this.showAlert('Извлечение корня возможно только из положительных чисел!');
          break;
        }
        this.currOperand = Math.sqrt(parseFloat(this.currOperand));
        break;
      default:
        break;
    }
    this.currOperand = parseFloat(this.currOperand.toFixed(10));
    this.prevOperand = '';
  }

  showAlert(text) {
    ALERT.innerText = text;
    ALERT.classList.remove('hidden');
  }

  hideAlert() {
    ALERT.classList.add('hidden');
  }

  updateDisplay() {
    this.CURR_OPERAND.innerText = this.currOperand;
    this.PREV_OPERAND.innerText = this.prevOperand;
  }
}

const NUM_BUTTONS = document.querySelectorAll('.calc__num');
const OPERATION_BUTTONS = document.querySelectorAll('.calc__operation');
const EQUALS_BUTTON = document.querySelector('.calc__equals');
const DELETE_BUTTON = document.querySelector('.calc__del');
const AC_BUTTON = document.querySelector('.calc__ac');
const PREV_OPERAND = document.querySelector('.prev-operand');
const CURR_OPERAND = document.querySelector('.curr-operand');
const ALERT = document.querySelector('.alert');

const CALCULATOR = new Calculator(PREV_OPERAND, CURR_OPERAND);

NUM_BUTTONS.forEach((btn) => {
  btn.addEventListener('click', () => {
    CALCULATOR.hideAlert();
    CALCULATOR.appendNumber(btn.innerText);
    CALCULATOR.updateDisplay();
  });
});

AC_BUTTON.addEventListener('click', () => {
  CALCULATOR.clear();
  CALCULATOR.updateDisplay();
});

DELETE_BUTTON.addEventListener('click', () => {
  CALCULATOR.hideAlert();
  CALCULATOR.delete();
  CALCULATOR.updateDisplay();
});

OPERATION_BUTTONS.forEach((btn) => {
  btn.addEventListener('click', () => {
    CALCULATOR.hideAlert();
    CALCULATOR.chooseOperation(btn.innerText);
    CALCULATOR.updateDisplay();
  });
});

EQUALS_BUTTON.addEventListener('click', () => {
  CALCULATOR.hideAlert();
  CALCULATOR.compute();
  CALCULATOR.updateDisplay();
  CALCULATOR.equalsPressed = true;
});