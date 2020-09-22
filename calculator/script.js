class Calculator {
  constructor(PREV_OPERAND, CURR_OPERAND) {
    this.PREV_OPERAND = PREV_OPERAND;
    this.CURR_OPERAND = CURR_OPERAND;
    this.clear();
  }

  clear() {
    this.currOperand = "";
    this.prevOperand = "";
    this.operation = undefined;
  }

  delete() {
    this.currOperand = this.currOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === "." && this.currOperand.includes(".")) return;
    if (this.currOperand === "0") this.currOperand = number.toString();
    else this.currOperand = this.currOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (
      this.operation !== undefined &&
      this.prevOperand !== "" &&
      this.currOperand !== ""
    )
      this.compute();
    this.operation = operation;
    if (this.currOperand === "") {
      this.prevOperand = this.prevOperand.slice(0, -1) + operation.toString();
    } else {
      this.prevOperand =
        this.currOperand.toString() + " " + operation.toString();
      this.currOperand = "";
    }
  }

  compute() {
    switch (this.operation) {
      case "+":
        this.currOperand =
          parseFloat(this.prevOperand) + parseFloat(this.currOperand);
        break;
      case "-":
        this.currOperand =
          parseFloat(this.prevOperand) - parseFloat(this.currOperand);
        break;
      case "/":
        this.currOperand =
          parseFloat(this.prevOperand) / parseFloat(this.currOperand);
        break;
      case "*":
        this.currOperand =
          parseFloat(this.prevOperand) * parseFloat(this.currOperand);
        break;
    }
    this.prevOperand = "";

    //TODO: вместить длинные числа
  }

  updateDisplay() {
    this.CURR_OPERAND.innerText = this.currOperand;
    this.PREV_OPERAND.innerText = this.prevOperand;
  }
}

const NUM_BUTTONS = document.querySelectorAll(".calc__num");
const OPERATION_BUTTONS = document.querySelectorAll(".calc__operation");
const EQUALS_BUTTON = document.querySelector(".calc__equals");
const DELETE_BUTTON = document.querySelector(".calc__del");
const AC_BUTTON = document.querySelector(".calc__ac");
const PREV_OPERAND = document.querySelector(".prev-operand");
const CURR_OPERAND = document.querySelector(".curr-operand");

const CALCULATOR = new Calculator(PREV_OPERAND, CURR_OPERAND);

NUM_BUTTONS.forEach((btn) => {
  btn.addEventListener("click", () => {
    CALCULATOR.appendNumber(btn.innerText);
    CALCULATOR.updateDisplay();
  });
});

AC_BUTTON.addEventListener("click", () => {
  CALCULATOR.clear();
  CALCULATOR.updateDisplay();
});

DELETE_BUTTON.addEventListener("click", () => {
  CALCULATOR.delete();
  CALCULATOR.updateDisplay();
});

OPERATION_BUTTONS.forEach((btn) => {
  btn.addEventListener("click", () => {
    CALCULATOR.chooseOperation(btn.innerText);
    CALCULATOR.updateDisplay();
  });
});

EQUALS_BUTTON.addEventListener("click", () => {
  CALCULATOR.compute();
  CALCULATOR.updateDisplay();
});