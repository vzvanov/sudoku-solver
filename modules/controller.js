import { getDependentIndexesByCellIndex } from "./cells.js";
import { getCellId } from "./model.js"

const isValidValue = (cells, cell, value) => {
    const values = [];
    const indexes = getDependentIndexesByCellIndex(cell.index);
    indexes.forEach((number) => {
        const currentCell = cells.get(getCellId(number));
        values.push(currentCell.value);
    });

    const count = values.reduce((accumulator, item) => {
        if (item === value) return ++accumulator;
        return accumulator;
    }, 0)

    return count === 0;
}

export { isValidValue };