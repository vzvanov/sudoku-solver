import { getDependentIndexesByCellIndex } from "./cells.js";

const getWFCModel = (cells) => {
  const wfcModel = [];
  cells.forEach((cell) => {
    const availableOptions = [];
    if (cell.available) {
      cell.options.forEach((option) => {
        if (option.available) availableOptions.push(option.value);
      });
    }
    wfcModel[cell.index] = { value: cell.value, options: availableOptions }
  })
  return wfcModel;
}

const takeStep = (index, model, depth) => {
  if (index > depth) {
    return 'finish';
  };

  let cell = model[index];
  if (cell.value) {
    index++;
    let state = takeStep(index, model, depth);
    if (state === 'finish') return 'finish';
    if (state === 'stepBack') return 'stepBack';
  }

  const indexes = getDependentIndexesByCellIndex(index);
  const copy = getCopyDependents(indexes, model);
  const options = [...cell.options];
  for (let i = 0; i < options.length; i++) {
    const value = options[i];
    cell.value = value;
    cell.options = [];
    changeWFCModel(value, model, indexes);
    let state = modelAnalysis(model, indexes);
    if (state === 'collapse') {
      restoreModelFromCopy(copy, model);
      cell = model[index];
      continue;  //go to next option
    };
    index++; //go to next step
    state = takeStep(index, model, depth);
    if (state === 'finish') return 'finish';
    if (state === 'stepBack') {
      index--;  //go to step back
      restoreModelFromCopy(copy, model);
      cell = model[index];
    }
  }
  return 'stepBack';
}

const getCopyDependents = (indexes, model) => {
  const copy = new Map();
  indexes.forEach((index) => {
    const cell = makeObjectCopy(model[index]);
    copy.set(index, cell)
  });
  return copy;
}

const restoreModelFromCopy = (copy, model) => {
  copy.forEach((cell, key) => {
    model[key] = makeObjectCopy(cell);
  });
}

const makeObjectCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
}

const changeWFCModel = (value, model, indexes) => {
  for (let i = 0; i < indexes.length; i++) {
    const cell = model[indexes[i]];
    if (cell.value) continue;
    cell.options = cell.options.filter((option) => option !== value);
  }
}

const modelAnalysis = (model, indexes) => {
  for (let i = 0; i < indexes.length; i++) {
    const index = indexes[i];
    const cell = model[index];
    if (cell.value) continue;
    if (cell.options.length) continue;
    return 'collapse'; // this is the collapse of the wave function
  }
  return 'continue';
}

export { getWFCModel, takeStep };