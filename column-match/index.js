const XLSX = require('xlsx');
const fs = require('fs');

// Function to read Excel file and get column names with positions
function getColumnNames(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const range = XLSX.utils.decode_range(sheet['!ref']);
  const columnNames = [];

  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = { c: col, r: range.s.r };
    const cellRef = XLSX.utils.encode_cell(cellAddress);
    const columnName = sheet[cellRef].v;
    columnNames.push({ name: columnName, position: col + 1 });
  }

  return columnNames;
}

// Function to compare two arrays of column names
function findMismatchedColumns(file1Columns, file2Columns) {
  const mismatchedColumns = [];

  for (let i = 0; i < file1Columns.length; i++) {
    if (file1Columns[i].name !== file2Columns[i].name) {
      mismatchedColumns.push({ file1: file1Columns[i], file2: file2Columns[i] });
    }
  }

  return mismatchedColumns;
}

// File paths
const filePath1 = 'merlin.xlsx';
const filePath2 = 'merlin-test.csv';

// Read column names from Excel files
const columnNames1 = getColumnNames(filePath1);
const columnNames2 = getColumnNames(filePath2);

// Compare column names
const mismatchedColumns = findMismatchedColumns(columnNames1, columnNames2);

if (mismatchedColumns.length === 0) {
  console.log('Both Excel files have the same column names at the same position.');
} else {
  console.log('The following columns have different names in the two Excel files:');
  console.table(mismatchedColumns);
}
