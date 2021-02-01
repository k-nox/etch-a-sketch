const container = document.querySelector('.container');
const clearButton = document.querySelector('#clear');
const eraseButton = document.querySelector('#erase');
const blackButton = document.querySelector('#black');
const randomButton = document.querySelector('#random');
const pickerButton = document.querySelector('#pick');
const pickerInput = document.querySelector('#color-picker');

// TODO: create buttons to incrementally darken or lighten a square by 10%

// TODO: allow user to toggle gridlines on and off

// TODO: allow user to select grid size from a slider instead of a prompt

// TODO: toggle drawing capability with click on container

// TODO: consider adding a "rainbow" option where colors are in ROYGBIV order

// TODO: alternative random colors? one for cool colors, one for warm, one for truly random?

let currentColor = 'black';
let gridItem;

//* random hex color:
const randomColor = function generateRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

//* creates grid from user input; defaults to 16x16
const createGrid = function createGridFromUserInput(divsPerSide = 16) {
  let totalDivs;
  if (divsPerSide >= 100) {
    totalDivs = 10000;
  } else {
    totalDivs = divsPerSide * divsPerSide;
  }
  for (let i = 0; i < totalDivs; i += 1) {
    const div = document.createElement('div');
    div.classList.add('grid-item');
    container.style.setProperty('--divs-per-side', divsPerSide);
    container.append(div);
    gridItem = document.querySelectorAll('.grid-item');
  }
};

const changeColor = function changeDivColorOnHover(element) {
  const div = element;
  if (currentColor === randomColor) {
    div.style.background = randomColor();
  }
  div.style.background = currentColor;
};

//* enables hover functionality; defaults to black
const hover = function changeColorOnHover() {
  gridItem.forEach(item => {
    item.addEventListener('mouseenter', function update() {
      changeColor(this);
    });
  });
};

const askUser = function askUserForDivs() {
  // eslint-disable-next-line no-alert
  const divs = prompt('How many squares should each side of the grid take up?');
  if (!divs) {
    return 16;
  }
  return divs;
};

const clearBoard = function resetAllDivsToBlank() {
  gridItem.forEach(item => item.remove());
};

//* clears board and resets grid to user-defined size on button click
clearButton.addEventListener('click', () => {
  clearBoard();
  createGrid(askUser());
  hover();
});

eraseButton.addEventListener('click', () => (currentColor = 'white'));
blackButton.addEventListener('click', () => (currentColor = 'black'));
randomButton.addEventListener('click', () => (currentColor = randomColor));

pickerInput.addEventListener('input', e => (currentColor = e.target.value));
pickerInput.addEventListener('change', e => (currentColor = e.target.value));

pickerButton.addEventListener('click', () => {
  pickerInput.focus();
  pickerInput.click();
});

document.addEventListener('DOMContentLoaded', () => {
  createGrid();
  hover();
});
