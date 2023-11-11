const getRowIndexes = (index) => {
  const rows = getRows();
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.includes(index)) return row;
  }
  return [];
}

const getRows = () => {
  const indexesByRows = [];
  indexesByRows.push([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  indexesByRows.push([9, 10, 11, 12, 13, 14, 15, 16, 17]);
  indexesByRows.push([18, 19, 20, 21, 22, 23, 24, 25, 26]);
  indexesByRows.push([27, 28, 29, 30, 31, 32, 33, 34, 35]);
  indexesByRows.push([36, 37, 38, 39, 40, 41, 42, 43, 44]);
  indexesByRows.push([45, 46, 47, 48, 49, 50, 51, 52, 53]);
  indexesByRows.push([54, 55, 56, 57, 58, 59, 60, 61, 62]);
  indexesByRows.push([63, 64, 65, 66, 67, 68, 69, 70, 71]);
  indexesByRows.push([72, 73, 74, 75, 76, 77, 78, 79, 80]);
  return indexesByRows;
}

const getColumnIndexes = (index) => {
  const columns = getColumns();
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.includes(index)) return column;
  }
  return [];
}

const getColumns = () => {
  const indexesByColumns = [];
  indexesByColumns.push([0, 9, 18, 27, 36, 45, 54, 63, 72]);
  indexesByColumns.push([1, 10, 19, 28, 37, 46, 55, 64, 73]);
  indexesByColumns.push([2, 11, 20, 29, 38, 47, 56, 65, 74]);
  indexesByColumns.push([3, 12, 21, 30, 39, 48, 57, 66, 75]);
  indexesByColumns.push([4, 13, 22, 31, 40, 49, 58, 67, 76]);
  indexesByColumns.push([5, 14, 23, 32, 41, 50, 59, 68, 77]);
  indexesByColumns.push([6, 15, 24, 33, 42, 51, 60, 69, 78]);
  indexesByColumns.push([7, 16, 25, 34, 43, 52, 61, 70, 79]);
  indexesByColumns.push([8, 17, 26, 35, 44, 53, 62, 71, 80]);
  return indexesByColumns;
}

const getSectionIndexes = (index) => {
  const sections = getSections();
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.includes(index)) return section;
  }
  return [];
}

const getSections = () => {
  const indexesBySections = [];
  indexesBySections.push([0, 1, 2, 9, 10, 11, 18, 19, 20]);
  indexesBySections.push([3, 4, 5, 12, 13, 14, 21, 22, 23]);
  indexesBySections.push([6, 7, 8, 15, 16, 17, 24, 25, 26]);
  indexesBySections.push([27, 28, 29, 36, 37, 38, 45, 46, 47]);
  indexesBySections.push([30, 31, 32, 39, 40, 41, 48, 49, 50]);
  indexesBySections.push([33, 34, 35, 42, 43, 44, 51, 52, 53]);
  indexesBySections.push([54, 55, 56, 63, 64, 65, 72, 73, 74]);
  indexesBySections.push([57, 58, 59, 66, 67, 68, 75, 76, 77]);
  indexesBySections.push([60, 61, 62, 69, 70, 71, 78, 79, 80]);
  return indexesBySections;
}

const getDependentIndexesByCellIndex = (index) => {
  const rowsIndexes = getRowIndexes(index);
  const columnsIndexes = getColumnIndexes(index);
  const sectionsIndexes = getSectionIndexes(index);
  const setIndexes = new Set([...rowsIndexes, ...columnsIndexes, ...sectionsIndexes]);
  const indexes = Array.from(setIndexes);
  return indexes;
}

export { getDependentIndexesByCellIndex };