const fs = require('fs');
const XLSX = require('xlsx');


async function processExcel(filePath) {

  const workbook = XLSX.readFile(filePath);

  const sheetName = workbook.SheetNames[0];

  const sheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const resultsForStoreAndOnlyPerniaspopupshop = [];

  let processedRows = 0
 
  newCategories = {};

  const jsonData2 = JSON.parse(fs.readFileSync('op-img-vs-categories.json', 'utf-8'));

  const newRows = [];

  for (const row of data) {

    const link = row['IMAGE 1'].trim(); // Adjust the column name accordingly
    // console.log("MAIN LINK: ", link);

    if(!(link.trim().length > 0)) continue;

    if(jsonData2[link]){

      processedRows += 1;

      row["CATEGORY 2"] = jsonData2[link]

      console.log(processedRows);
    
    }


  }




 // Create and write the results to a CSV file
  
  const json2csv = require('json2csv').parse;

  const jsonData = data;

  // Find the object with the greatest number of keys
  const maxKeysObject = jsonData.reduce((prev, current) => (Object.keys(current).length > Object.keys(prev).length) ? current : prev, {});

  // Extract keys from the object with the greatest number of keys
  const fields = Object.keys(maxKeysObject);

  // Convert JSON to CSV
  const csv = json2csv(jsonData, { fields });

  // Write the CSV to a file
  fs.writeFileSync('op-all-categories-new.csv', csv, 'utf8');

  console.log('CSV file has been saved');

}

// Replace 'your_excel_file.xlsx' with the path to your Excel file
processExcel('new-category-format.xlsx');
