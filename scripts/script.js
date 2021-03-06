const container = document.querySelector('.container');
const buttons = document.querySelectorAll('button');
const pickerInput = document.querySelector('#color-picker');

let currentColorMode = 'black'; // defaults currentColorMode to black on start
let gridItems;
let currentRainbowColor = 'violet'; // defaults the nextRainbowColor to red in rainbow mode
let currentDrawMode = 'mouseenter'; // defaults drawing mode to hover

const setColorMode = function setCurrentColorMode(color) {
  currentColorMode = color;
};

const setDrawMode = function setCurrentDrawMode(newDrawMode) {
  gridItems.forEach(item => {
    item.removeEventListener(currentDrawMode, updateColor);
  });
  let buttonText;
  if (newDrawMode === 'click') {
    if (container.classList.contains('disabled')) {
      toggleOnOff();
    }
    buttonText = 'Hover-to-Draw';
    document.querySelector('#toggle-on-off').setAttribute('disabled', '');
  } else {
    buttonText = 'Click-to-Draw';
    document.querySelector('#toggle-on-off').removeAttribute('disabled');
  }
  document.querySelector(
    '#toggle-draw-mode'
  ).textContent = `${buttonText} Mode`;
  currentDrawMode = newDrawMode;
  draw();
};

const createGrid = function createGridFromUserInput(itemsPerSide = 16) {
  let totalItems;
  if (itemsPerSide >= 100) {
    totalItems = 10000;
  } else {
    totalItems = itemsPerSide * itemsPerSide;
  }
  for (let i = 0; i < totalItems; i += 1) {
    const item = document.createElement('div');
    item.classList.add('grid-item');
    container.style.setProperty('--items-per-side', itemsPerSide);
    container.append(item);
    gridItems = document.querySelectorAll('.grid-item');
  }
};

const draw = function drawUsingCurrentDrawAndColorMode() {
  gridItems.forEach(item => {
    item.addEventListener(currentDrawMode, updateColor);
  });
};

function updateColor(e) {
  if (!container.classList.contains('disabled')) {
    if (typeof currentColorMode === 'function') {
      currentColorMode(e.target);
    } else {
      e.target.style.background = currentColorMode;
    }
  }
}

const randomColor = function generateRandomColor(item) {
  const currentItem = item;
  currentItem.style.background = `#${Math.floor(
    Math.random() * 16777215
  ).toString(16)}`;
};

const rainbowColor = function generateColorsInRainbowOrder(item) {
  const currentItem = item;
  const rainbowArray = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'indigo',
    'violet',
  ];
  const lastIndex = rainbowArray.length - 1;
  if (currentRainbowColor === rainbowArray[lastIndex]) {
    // eslint-disable-next-line prefer-destructuring
    currentRainbowColor = rainbowArray[0];
  } else {
    const nextIndex = rainbowArray.indexOf(currentRainbowColor) + 1;
    currentRainbowColor = rainbowArray[nextIndex];
  }
  currentItem.style.background = currentRainbowColor;
};

//* darkens grid item by 10% on each pass
const darkenGridItem = function darkenGridItemGradually(item) {
  const currentItem = item;
  const currentBrightness = +getComputedStyle(currentItem).getPropertyValue(
    '--brightness-level'
  );
  const nextBrightness = currentBrightness - 0.1;
  if (currentBrightness > 0) {
    currentItem.style.setProperty('--brightness-level', nextBrightness);
  }
};

//* lightens grid item by 10% on each pass
const lightenGridItem = function lightenGridItemGradually(item) {
  const currentItem = item;
  const currentBackgroundColor = getComputedStyle(currentItem).getPropertyValue(
    'background-color'
  );
  // if current color is black, set to white with 0% brightness
  // black cannot be lightened with brightness
  if (currentBackgroundColor === 'rgb(0, 0, 0)') {
    currentItem.style.setProperty('--brightness-level', 0);
    currentItem.style.background = 'white';
  }

  const currentBrightness = +getComputedStyle(currentItem).getPropertyValue(
    '--brightness-level'
  );
  const nextBrightness = currentBrightness + 0.1;

  currentItem.style.setProperty('--brightness-level', nextBrightness);
};

const erase = function eraseColorAndBrightness(item) {
  const currentItem = item;
  currentItem.style.background = 'white';
  currentItem.style.setProperty('--brightness-level', 1);
};

const clear = function clearEverything() {
  const currentGridLineStatus = Array.from(gridItems).every(item =>
    item.classList.contains('grid-lines')
  );
  const currentItemsPerSide = Math.sqrt(gridItems.length);
  const newItemsPerSide = askUser(currentItemsPerSide);
  if (newItemsPerSide) {
    if (!container.classList.contains('disabled')) {
      toggleOnOff();
    }
    gridItems.forEach(item => item.remove());
    createGrid(newItemsPerSide);
    if (currentGridLineStatus) {
      gridItems.forEach(item => item.classList.add('grid-lines'));
    }
    draw();
  }
};

const toggleOnOff = function toggleDisabledClassOnContainer() {
  if (currentDrawMode === 'mouseenter') {
    const buttonText = container.classList.contains('disabled') ? 'Off' : 'On';
    document.querySelector('#toggle-on-off').textContent = `Turn ${buttonText}`;
    container.classList.toggle('disabled');
  }
};

const askUser = function askUserForNewGridSize(currentItemsPerSide) {
  // eslint-disable-next-line no-alert
  let itemsPerSide = prompt(
    'How many squares should each side of the grid be?'
  );
  const numRegex = /^-?\d+$/;
  const whiteSpace = /\s/g;
  if (itemsPerSide === null) {
    return null;
  }
  itemsPerSide = itemsPerSide.replace(whiteSpace, '');
  if (numRegex.test(itemsPerSide)) {
    itemsPerSide = Math.round(+itemsPerSide);
    if (itemsPerSide < 1) {
      return 1;
    }
    return itemsPerSide;
  }
  return currentItemsPerSide;
};

container.addEventListener('click', () => toggleOnOff());

pickerInput.addEventListener('change', e => setColorMode(e.target.value));

buttons.forEach(button =>
  button.addEventListener('click', e => {
    switch (e.target.id) {
      case 'black':
        setColorMode('black');
        break;
      case 'pick':
        pickerInput.focus();
        pickerInput.click();
        break;
      case 'random':
        setColorMode(randomColor);
        break;
      case 'rainbow':
        setColorMode(rainbowColor);
        break;
      case 'darken':
        setColorMode(darkenGridItem);
        break;
      case 'lighten':
        setColorMode(lightenGridItem);
        break;
      case 'erase':
        setColorMode(erase);
        break;
      case 'toggle-draw-mode':
        switch (currentDrawMode) {
          case 'click':
            setDrawMode('mouseenter');
            break;
          case 'mouseenter':
            setDrawMode('click');
            break;
          // no default
        }
        break;
      case 'clear':
        clear();
        break;
      case 'toggle-grid':
        gridItems.forEach(item => item.classList.toggle('grid-lines'));
        break;
      case 'toggle-on-off':
        toggleOnOff();
        break;
      // no default
    }
  })
);

document.addEventListener('DOMContentLoaded', () => {
  createGrid();
  gridItems.forEach(item => item.classList.add('grid-lines'));
  draw();
});
