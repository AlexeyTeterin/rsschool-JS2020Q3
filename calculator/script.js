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
  }

  delete() {

  }

  appendNumber(number) {
    if (number === '.' && this.currOperand.includes('.')) return;
    this.currOperand = this.currOperand.toString() + number.toString();
  }

  chooseOperation(operation) {

  }

  compute() {

  }

  updateDisplay() {
    this.CURR_OPERAND.innerText = this.currOperand;
  }
}

const NUM_BUTTONS = document.querySelectorAll('.calc__num');
const OPERATION_BUTTONS = document.querySelectorAll('.calc__operation');
const EQUALS_BUTTON = document.querySelector('.calc__equals');
const DELETE_BUTTON = document.querySelector('.calc__del');
const AC_BUTTON = document.querySelector('.calc__ac');
const PREV_OPERAND = document.querySelector('.prev-operand');
const CURR_OPERAND = document.querySelector('.curr-operand');

const CALCULATOR = new Calculator(PREV_OPERAND, CURR_OPERAND);

NUM_BUTTONS.forEach((btn) => {
  btn.addEventListener('click', () => {
    CALCULATOR.appendNumber(btn.innerText);
    CALCULATOR.updateDisplay();
  })
})