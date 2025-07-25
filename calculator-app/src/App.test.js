import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders calculator display', () => {
  render(<App />);
  const display = document.querySelector('.display-value');
  expect(display).toBeInTheDocument();
  expect(display).toHaveTextContent('0');
});

test('renders all number buttons', () => {
  render(<App />);
  const buttons = screen.getAllByRole('button');
  
  // Check that we have buttons for numbers 0-9
  for (let i = 0; i <= 9; i++) {
    const numberButtons = screen.getAllByText(i.toString());
    expect(numberButtons.length).toBeGreaterThan(0);
  }
});

test('renders operation buttons', () => {
  render(<App />);
  expect(screen.getByText('+')).toBeInTheDocument();
  expect(screen.getByText('−')).toBeInTheDocument();
  expect(screen.getByText('×')).toBeInTheDocument();
  expect(screen.getByText('÷')).toBeInTheDocument();
  expect(screen.getByText('=')).toBeInTheDocument();
});

test('renders function buttons', () => {
  render(<App />);
  expect(screen.getByText('AC')).toBeInTheDocument();
  expect(screen.getByText('±')).toBeInTheDocument();
  expect(screen.getByText('%')).toBeInTheDocument();
  expect(screen.getByText('.')).toBeInTheDocument();
});

test('clicking number buttons updates display', () => {
  render(<App />);
  const numberButton = screen.getByRole('button', { name: '5' });
  fireEvent.click(numberButton);
  
  const display = document.querySelector('.display-value');
  expect(display).toHaveTextContent('5');
});

test('basic addition calculation', () => {
  render(<App />);
  
  // Click 2
  fireEvent.click(screen.getByRole('button', { name: '2' }));
  
  // Click +
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  
  // Click 3
  fireEvent.click(screen.getByRole('button', { name: '3' }));
  
  // Click =
  fireEvent.click(screen.getByRole('button', { name: '=' }));
  
  const display = document.querySelector('.display-value');
  expect(display).toHaveTextContent('5');
});

test('clear function works', () => {
  render(<App />);
  
  // Enter a number
  fireEvent.click(screen.getByRole('button', { name: '5' }));
  
  // Click AC (All Clear)
  fireEvent.click(screen.getByRole('button', { name: 'AC' }));
  
  // Should display 0
  const display = document.querySelector('.display-value');
  expect(display).toHaveTextContent('0');
});
