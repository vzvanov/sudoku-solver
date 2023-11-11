import { getWFCModel, takeStep } from "./modules/wfc.js";
import { generateFieldModel } from "./modules/model.js"
import { ROW_LENGTH, OPTION_NAME_TEMPLATE, NUMBER_OF_CELLS, SELECT_NAME_TEMPLATE, CELL_NAME_TEMPLATE } from "./modules/constants.js";
import { calculateModel, changeModel, getCellId, getOptionId, getSelectId } from "./modules/model.js"
import { getDependentIndexesByCellIndex } from "./modules/cells.js";
import { isValidValue } from "./modules/controller.js";

const VARIANT = -3;
const CACHE = new Map();

window.addEventListener('load', () => {
  CACHE.set("cells", generateFieldModel(VARIANT));
  calculateModel(CACHE.get("cells"));
  createFild();
  console.log(CACHE.get("cells"));
});

//--------------------------------------------------
// VIEW
//--------------------------------------------------

const FIELD = document.getElementById("field");

FIELD.onclick = function (e) {
  e.stopImmediatePropagation();

  const optionId = e.target.id;
  const data = getCellDataByOptionId(optionId);
  if (!data) return;
  const cell = CACHE.get('cells').get(data.cellId);
  if (!cell) return;
  const option = cell.options.get(data.optionId);
  if (!option) return;
  if (!option.available) return;

  handlingOptionsClick(cell, option);
}

FIELD.onchange = function (e) {
  e.stopImmediatePropagation();
  const id = e.target.id;
  if (id[0] === SELECT_NAME_TEMPLATE) handlingSelectChange(id, +e.target.value);
}

const handlingOptionsClick = (cell, option) => {
  const value = option.value;
  const isValid = isValidValue(CACHE.get("cells"), cell, value);

  if (isValid) {
    cell.value = value;
    cell.manually = true;
    const currentElement = document.getElementById(cell.id);
    setSelectElement(cell, currentElement);
    changeModel(cell, CACHE.get("cells"));
    changeView(cell);
    return;
  };

  alert(value + ' - not valid.');
}

const handlingSelectChange = (id, value) => {
  let idCell = id.replace(SELECT_NAME_TEMPLATE, CELL_NAME_TEMPLATE);
  const cell = CACHE.get('cells').get(idCell);
  const oldValue = cell.value;

  cell.value = 0;
  if (value === 0) {
    changeModel(cell, CACHE.get('cells'), oldValue);
    setOptions(idCell, cell.index);
    changeView(cell);
    return;
  };

  const isValid = isValidValue(CACHE.get("cells"), cell, value);
  if (isValid) {
    cell.value = value;
    cell.manually = true;
    changeModel(cell, CACHE.get('cells'), oldValue);
    changeView(cell);
    return;
  };
  cell.value = oldValue;
  setValueElement(id, oldValue);
  alert(value + ' - not valid.');
}

const changeView = (cell) => {
  const cells = CACHE.get("cells");
  const indexes = getDependentIndexesByCellIndex(cell.index);
  indexes.forEach((index) => {
    if (index === cell.index) return;
    const currentCell = cells.get(getCellId(index));
    currentCell.options.forEach((option, key) => {
      const optionElement = document.getElementById(key);
      if (optionElement) {
        let text = '';
        if (option.available) {
          text = option.value;
          optionElement.classList.add('cell__option');
          optionElement.classList.remove("option-notAvailable");
        } else {
          optionElement.classList.add('option-notAvailable');
          optionElement.classList.remove("cell__option");
        }
        optionElement.innerText = text;
      }
    });
  });
}

const createFild = () => {
  const rightSectorBorder = [2, 5, 11, 14, 20, 23, 29, 32, 38, 41, 47, 50, 56, 59, 65, 68, 74, 77];
  const topSectorBorder = [27, 28, 29, 30, 31, 32, 33, 34, 35, 54, 55, 56, 57, 58, 59, 60, 61, 62];
  const rightCellBorder = [0, 9, 18, 27, 36, 45, 54, 63, 72, 1, 10, 19, 28, 37, 46, 55, 64, 73,
    3, 12, 21, 30, 39, 48, 57, 66, 75, 4, 13, 22, 31, 40, 49, 58, 67, 76,
    6, 15, 24, 33, 42, 51, 60, 69, 78, 7, 16, 25, 34, 43, 52, 61, 70, 79];
  const topCellBorder = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
    63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80];

  CACHE.get('cells').forEach((cell) => {
    const cellElement = document.createElement("div");
    cellElement.setAttribute("id", cell.id);
    cellElement.classList.add("cellElement");
    if (rightSectorBorder.includes(cell.index)) cellElement.classList.add("section-right");
    if (topSectorBorder.includes(cell.index)) cellElement.classList.add("section-top");
    if (rightCellBorder.includes(cell.index)) cellElement.classList.add("row-right");
    if (topCellBorder.includes(cell.index)) cellElement.classList.add("row-top");
    FIELD.appendChild(cellElement);

    if (cell.value) {
      setSelectElement(cell, cellElement);
    } else {
      setOptionsElements(cellElement, cell.index);
    }
  })
}

const setSelectElement = (cell, cellElement) => {
  clearElement(cellElement);
  const selectElement = getSelectElement(cell);
  cellElement.appendChild(selectElement);
  cellElement.classList.add("cell-selector-1");
  cellElement.classList.remove("cell-selector-2");
}

const clearElement = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

const getSelectElement = (item) => {
  const select = document.createElement("select");
  select.setAttribute("id", getSelectId(item.index));
  if (!item.available) select.setAttribute("disabled", true);

  for (let j = 0; j <= ROW_LENGTH; j++) {
    const option = new Option((j === 0) ? '' : j, j);
    if (j && j === item.value) {
      option.setAttribute("selected", true);
    }
    select.appendChild(option);
  }
  return select;
}

const setOptions = (id, index) => {
  const currentElement = document.getElementById(id);
  if (!currentElement) return;
  clearElement(currentElement);
  currentElement.classList.add("cell-selector-2");
  currentElement.classList.remove("cell-selector-1");
  setOptionsElements(currentElement, index);
}

const setOptionsElements = (cellElement, index) => {
  clearElement(cellElement);
  const cell = CACHE.get('cells').get(cellElement.id);
  for (let i = 0; i < ROW_LENGTH; i++) {
    const optionId = getOptionId(index, i);
    const optionElement = document.createElement("div");
    optionElement.setAttribute("id", optionId);
    optionElement.classList.add("cell__option");
    const option = cell.options.get(optionId);
    let text = '';
    if (option.available) {
      text = option.value;
    } else {
      optionElement.classList.add('option-notAvailable');
      optionElement.classList.remove("cell__option");
    }
    optionElement.innerText = text;

    cellElement.appendChild(optionElement);
    cellElement.classList.add("cell-selector-2");
    cellElement.classList.remove("cell-selector-1");
  }
}

const setValueElement = (id, value, className) => {
  const cellElement = document.getElementById(id);
  if (cellElement) cellElement.value = value;
  if (className) cellElement.classList.add(className);
}

const getCellDataByOptionId = (optionID) => {
  const temp = optionID.split('-');
  if (temp[0] === OPTION_NAME_TEMPLATE) {
    const index = +temp[1];
    const cellId = getCellId(index);
    const optionId = getOptionId(index, temp[2])
    return { index, cellId, optionId };
  }
  return undefined;
}

const setColors = () => {
  CACHE.get('cells').forEach((cell) => {
    const cellElement = document.getElementById(cell.id);
    if (cell.manually) {
      cellElement.classList.add("cell-constant");
    } else {
      cellElement.classList.add("cell-found");
    }
  })
}

const viewWFCModel = (wfcModel) => {
  const cells = CACHE.get('cells');
  for (let index = 0; index < wfcModel.length; index++) {
    let current = wfcModel[index];
    let cell = cells.get(getCellId(index));
    if (current.value) {
      cell.value = current.value;
      cell.available = false;
      cell.options.forEach((option) => {
        option.available = false;
      });
    } else {
      cell.options.forEach((option) => {
        option.available = current.options.includes(option.value);
      });
    }
  }
  clearElement(FIELD);
  createFild();
}

//--------------------------------------------------
// BUTTONS EVENTS
//--------------------------------------------------

const buttonSolve = document.getElementById("buttonSolve");

const solve = () => {
  findSolution();
  setColors();
}

buttonSolve.addEventListener('click', solve);

//--------------------------------------------------
// SOLVER
//--------------------------------------------------

const findSolution = () => {
  const wfcModel = getWFCModel(CACHE.get('cells'));
  let index = 0;
  const depth = NUMBER_OF_CELLS - 1;
  let state = takeStep(index, wfcModel, depth);
  if (state === 'stepBack') alert('There is no solution');
  viewWFCModel(wfcModel);
}
