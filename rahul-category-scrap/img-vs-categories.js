const fs = require('fs');
const XLSX = require('xlsx');


async function processExcel(filePath) {

  console.log("hello")

  const workbook = XLSX.readFile(filePath);

  const sheetName = workbook.SheetNames[0];

  const sheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const resultsForStoreAndOnlyPerniaspopupshop = [];

  let processedRows = 0
 
  imageURLvsCategories = {};



  for (const row of data) {

    const link = row['IMAGE 1']; // Adjust the column name accordingly
    // console.log("MAIN LINK: ", link);

    if(!(link.trim().length > 0)) continue;

    categories = row['categories']

    processedRows += 1;

    imageURLvsCategories[link] = categories;

    console.log(processedRows);

  }

  // Write the CSV to a file
  fs.writeFileSync('op-img-vs-categories.json', JSON.stringify(imageURLvsCategories), 'utf8');

  console.log('JSON file has been saved');

}

// Replace 'your_excel_file.xlsx' with the path to your Excel file
processExcel('categories-old.xlsx');
