class Calculator {
  constructor(PREV_OPERAND, CURR_OPERAND) {
    this.PREV_OPERAND = PREV_OPERAND;
    this.CURR_OPERAND = CURR_OPERAND;
  }

  clear() {
    this.CURR_OPERAND = '';
    this.PREV_OPERAND = '';
    this.operation = undefined;
  }

  delete() {

  }

  appendNumber(number) {

  }

  chooseOperation(operation) {

  }

  compute() {

  }

  updateDisplay() {

  }
}

const NUM_BUTTONS = document.querySelectorAll('.calc__num');
const OPERATION_BUTTONS = document.querySelectorAll('.calc__operation');
const EQUALS_BUTTON = document.querySelector('.calc__equals');
const DELETE_BUTTON = document.querySelector('.calc__del');
const AC_BUTTON = document.querySelector('.calc__ac');
const PREV_OPERAND = document.querySelector('.prev-operand');
const CURR_OPERAND = document.querySelector('.curr-operand');