class CalcController {
  constructor() {
    this.audio = new Audio("click.mp3");
    this.audioOnOff = false;
    this.lastOperator = "";
    this.lastNumber = "";

    this.operation = [];
    this.locale = "pt-BR";
    this.displayCalcEl = document.querySelector("#display");
    this.timeEl = document.querySelector("#hora");
    this.dateEl = document.querySelector("#data");
    this.currentDate;
    this.initialize();
    this.initButtonsEvents();
    this.initKeyBoard();
  }

  //copiado numero de fora colocar na calculadora
  pasteFromClipBoard() {
    document.addEventListener("paste", (e) => {
      let text = e.clipboardData.getData("Text");
      this.displayCalc = parseFloat(text);
    });
  }

  //copiando os numeros da calculadora
  copyToClipBoard() {
    let input = document.createElement("input");

    input.value = this.displayCalc;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }

  initialize() {
    this.setdisplayDateTime();

    setInterval(() => {
      this.setdisplayDateTime();
    }, 1000);

    this.setLastNumberToDisplay();
    this.pasteFromClipBoard();

    document.querySelectorAll(".btn-ac").forEach((btn) => {
      btn.addEventListener("dblclick", (e) => {
        this.toggleAudio();
      });
    });
  }

  toggleAudio() {
    this.audioOnOff = !this.audioOnOff;
  }

  playAudio() {
    if (this.audioOnOff) {
      this.audio.currentTime = 0;
      this.audio.play();
    }
  }

  initKeyBoard() {
    document.addEventListener("keyup", (e) => {
      this.playAudio();
      switch (e.key) {
        case "escape":
          this.clearAll();
          break;

        case "Backspace":
          this.clearEntry();
          break;

        case "+":
        case "-":
        case "/":
        case "*":
        case "%":
          this.addOperation(e.key);
          break;

        case "Enter":
        case "=":
          this.calc();
          break;

        case ".":
        case ",":
          this.addDont();
          break;

        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.addOperation(parseInt(e.key));
          break;

        case "c":
          if (e.ctrlKey) this.copyToClipBoard();
          break;
      }
    });
  }

  /* metodo criando para trabalhar com varios eventos */
  addEventListenerAll(element, events, fn) {
    events.split(" ").forEach((event) => {
      element.addEventListener(event, fn, false);
    });
  }

  clearAll() {
    this.operation = [];
    this.lastNumber = "";
    this.lastOperator = "";
    this.setLastNumberToDisplay();
  }

  clearEntry() {
    this.operation.pop();
    this.setLastNumberToDisplay();
  }

  getLastOperation() {
    return this.operation[this.operation.length - 1];
  }

  setLastOperation(value) {
    this.operation[this.operation.length - 1] = value;
  }
  isOperator(value) {
    return ["+", "-", "*", "%", "/"].indexOf(value) > -1;
  }
  pushOperation(value) {
    this.operation.push(value);

    if (this.operation.length > 3) {
      this.calc();
    }
  }
  getResult() {
    try {
      return eval(this.operation.join(""));
    } catch (e) {
      setTimeout(() => {
        this.setError();
      }, 1);
    }
  }

  calc() {
    let last = "";

    this.lastOperator = this.getLastItem();

    if (this.operation.length < 3) {
      let firstItem = this.operation[0];

      this.operation = [firstItem, this.lastOperator, this.lastNumber];
    }

    if (this.operation.length > 3) {
      last = this.operation.pop();

      this.lastNumber = this.getResult();
    } else if (this.operation.length == 3) {
      this.lastNumber = this.getLastItem(false);
    }

    let result = this.getResult();

    if (last == "%") {
      result /= 100;

      this.operation = [result];
    } else {
      this.operation = [result];

      if (last) this.operation.push(last);
    }

    this.setLastNumberToDisplay();
  }

  getLastItem(isOperator = true) {
    let lastItem;

    for (let i = this.operation.length - 1; i >= 0; i--) {
      if (this.isOperator(this.operation[i]) == isOperator) {
        lastItem = this.operation[i];

        break;
      }
    }

    if (!lastItem) {
      lastItem = isOperator ? this.lastOperator : this.lastNumber;
    }

    return lastItem;
  }

  setLastNumberToDisplay() {
    let lastNumber;

    for (let i = this.operation.length - 1; i >= 0; i--) {
      if (!this.isOperator(this.operation[i])) {
        lastNumber = this.operation[i];

        break;
      }
    }
    if (!lastNumber) lastNumber = 0;
    this.displayCalc = lastNumber;
  }

  addOperation(value) {
    if (isNaN(this.getLastOperation())) {
      if (this.isOperator(value)) {
        this.setLastOperation(value);
      } else {
        this.pushOperation(value);
        // Atualizado o display
        this.setLastNumberToDisplay();
      }
    } else {
      if (this.isOperator(value)) {
        this.pushOperation(value);
      } else {
        let newValue = this.getLastOperation().toString() + value.toString();
        this.setLastOperation(newValue);

        // colocar o ultimo numero da calculadora
        this.setLastNumberToDisplay();
      }
    }
  }

  setError() {
    this.displayCalc = "Error";
  }
  addDont() {
    let lastOperation = this.getLastOperation();

    if (
      typeof lastOperation === "string" &&
      lastOperation.split("").indexOf(".") > -1
    )
      return;

    if (this.isOperator(lastOperation) || !lastOperation) {
      this.pushOperation("0.");
    } else {
      this.setLastOperation(lastOperation.toString() + ".");
    }
    this.setLastNumberToDisplay();
  }

  execBtn(value) {
    this.playAudio();
    switch (value) {
      case "ac":
        this.clearAll();
        break;

      case "ce":
        this.clearEntry();
        break;

      case "soma":
        this.addOperation("+");
        break;

      case "subtracao":
        this.addOperation("-");
        break;

      case "divisao":
        this.addOperation("/");
        break;

      case "multiplicacao":
        this.addOperation("*");
        break;

      case "porcento":
        this.addOperation("%");
        break;

      case "igual":
        this.calc();
        break;

      case "ponto":
        this.addDont();
        break;

      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.addOperation(parseInt(value));
        break;

      default:
        this.setError();
        break;
    }
  }

  initButtonsEvents() {
    let buttons = document.querySelectorAll("#buttons > g, #parts > g");

    buttons.forEach((btn, index) => {
      this.addEventListenerAll(btn, "click drag", (e) => {
        /* Remover o btn- e pegar o numero */
        let textBtn = btn.className.baseVal.replace("btn-", "");

        this.execBtn(textBtn);
      });
      /* mudar o cursor para pointer */
      this.addEventListenerAll(btn, "mouseover mouseup mousedown", (e) => {
        btn.style.cursor = "pointer";
      });
    });
  }

  setdisplayDateTime() {
    this.displayTime = this.currentDate.toLocaleTimeString(this.locale);
    this.displayDate = this.currentDate.toLocaleDateString(this.locale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  /* Horas de calculadora */
  get displayTime() {
    return this.dateEl.innerHTML;
  }

  set displayTime(value) {
    return (this.dateEl.innerHTML = value);
  }

  /* data da calculadora */
  get displayDate() {
    return this.timeEl.innerHTML;
  }
  set displayDate(value) {
    return (this.timeEl.innerHTML = value);
  }

  /* Display da calculadora */
  get displayCalc() {
    return this.displayCalcEl.innerHTML;
  }
  set displayCalc(value) {
    if (value.toString().length > 10) {
      this.setError();
      return false;
    }
    return (this.displayCalcEl.innerHTML = value);
  }

  /* Ligando ao displayTime e displayDate */
  get currentDate() {
    return new Date();
  }
  set currentDate(value) {
    return (this._currentDate = value);
  }
}
