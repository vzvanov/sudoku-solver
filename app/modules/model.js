import { getSudoku } from "./sudoku.js";
import { ROW_LENGTH, SECTION_LENGTH, NUMBER_OF_CELLS, CELL_NAME_TEMPLATE, SELECT_NAME_TEMPLATE, DELIMITER, OPTION_NAME_TEMPLATE } from "./constants.js";
import { getDependentIndexesByCellIndex } from "./cells.js";

// index - start with 0
const generateFieldModel = (index) => {
  const stringVariant = getSudoku(index);
  if (!stringVariant) return getEmptyCells();
  const version = getVariant(stringVariant);
  if (!version) return getEmptyCells();
  return getVersionCells(version);
}

const getVariant = (stringVariant) => {
  const temp = stringVariant.split(",");
  const version = temp.map((item) => +item);
  return version;
}

const getVersionCells = (version) => {
  const cells = new Map();
  version.forEach((value, index) => {
    const id = getCellId(index);
    cells.set(id, generateCell(index, id, value, true));
  });

  return cells;
}

const getEmptyCells = () => {
  const cells = new Map();
  for (let number = 0; number < NUMBER_OF_CELLS; number++) {
    const id = getCellId(number);
    cells.set(id, generateCell(number, id, 0, false));
  }
  return cells;
}

const generateCell = (index, id, value, notVariable) => {
  const row = Math.ceil((index + 1) / ROW_LENGTH);
  const column = (index + 1) - ((row - 1) * ROW_LENGTH);

  const sectionRow = Math.ceil(row / SECTION_LENGTH);
  const sectionColumn = Math.ceil(column / SECTION_LENGTH);
  const section = (sectionRow - 1) * SECTION_LENGTH + sectionColumn;

  const available = (value === 0);
  const options = new Map();
  for (let i = 0; i < ROW_LENGTH; i++) {
    const numberId = getOptionId(index, i);
    let optionValue = i + 1;
    options.set(numberId, { value: optionValue, available: available });
  }

  const cell = {
    id, value, index, row, column, section, options, available, notVariable, manually: false
  }
  return cell;
}

const calculateModel = (cells) => {
  cells.forEach((cell) => {
    changeModel(cell, cells);
  });
}

const changeModel = (cell, cells, oldValue) => {
  const indexes = getDependentIndexesByCellIndex(cell.index);
  const optionIndex = cell.value - 1;
  const oldOptionIndex = oldValue ? oldValue - 1 : -1;
  indexes.forEach((index) => {
    const currentCell = cells.get(getCellId(index));

    const optionId = getOptionId(currentCell.index, optionIndex);
    const option = currentCell.options.get(optionId);
    if (option) option.available = false;

    const oldOptionId = getOptionId(currentCell.index, oldOptionIndex);
    const oldOption = currentCell.options.get(oldOptionId);
    if (oldOption) oldOption.available = true;
  });
}

const getCellId = (index) => {
  return `${CELL_NAME_TEMPLATE}${DELIMITER}${index}`;
}

const getOptionId = (numberCell, number) => {
  return `${OPTION_NAME_TEMPLATE}${DELIMITER}${numberCell}${DELIMITER}${number}`;
}

const getSelectId = (numberCell) => {
  return `${SELECT_NAME_TEMPLATE}${DELIMITER}${numberCell}`;
}

export { generateFieldModel, calculateModel, changeModel, getCellId, getOptionId, getSelectId };