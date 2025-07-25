import React, { useState } from 'react';
import './App.css';

function App() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const toggleSign = () => {
    if (display !== '0') {
      setDisplay(display.charAt(0) === '-' ? display.slice(1) : '-' + display);
    }
  };

  const percentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  return (
    <div className="App">
      <div className="calculator">
        <div className="calculator-display">
          <div className="display-value">{display}</div>
        </div>
        
        <div className="calculator-keypad">
          <div className="row">
            <button className="btn btn-function" onClick={clear}>AC</button>
            <button className="btn btn-function" onClick={toggleSign}>±</button>
            <button className="btn btn-function" onClick={percentage}>%</button>
            <button className="btn btn-operator" onClick={() => performOperation('/')}>÷</button>
          </div>
          
          <div className="row">
            <button className="btn btn-number" onClick={() => inputNumber(7)}>7</button>
            <button className="btn btn-number" onClick={() => inputNumber(8)}>8</button>
            <button className="btn btn-number" onClick={() => inputNumber(9)}>9</button>
            <button className="btn btn-operator" onClick={() => performOperation('*')}>×</button>
          </div>
          
          <div className="row">
            <button className="btn btn-number" onClick={() => inputNumber(4)}>4</button>
            <button className="btn btn-number" onClick={() => inputNumber(5)}>5</button>
            <button className="btn btn-number" onClick={() => inputNumber(6)}>6</button>
            <button className="btn btn-operator" onClick={() => performOperation('-')}>−</button>
          </div>
          
          <div className="row">
            <button className="btn btn-number" onClick={() => inputNumber(1)}>1</button>
            <button className="btn btn-number" onClick={() => inputNumber(2)}>2</button>
            <button className="btn btn-number" onClick={() => inputNumber(3)}>3</button>
            <button className="btn btn-operator" onClick={() => performOperation('+')}>+</button>
          </div>
          
          <div className="row">
            <button className="btn btn-number btn-zero" onClick={() => inputNumber(0)}>0</button>
            <button className="btn btn-number" onClick={inputDecimal}>.</button>
            <button className="btn btn-operator btn-equals" onClick={handleEquals}>=</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
