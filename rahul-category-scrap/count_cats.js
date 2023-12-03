
const puppeteer = require('puppeteer');
const fs = require('fs');
const XLSX = require('xlsx');
const cheerio = require('cheerio');


async function processExcel(filePath) {

  console.log("hello")

  const workbook = XLSX.readFile(filePath);

  const sheetName = workbook.SheetNames[0];

  const sheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const emptyCategories = [];
  let totalCats = 0;

  totalRows = data.length;

  var maxNumCat = 0

  let allCategories = [];

  for (const row of data) {

    var cats = row['categories'].trim(); // Adjust the column name accordingly

    // console.log(cats)

    numCats =  cats ? cats.split(',').length : 0;

    splittedCats = cats.split(',')

    // console.log(numCats, cats)

    totalCats += numCats

    if(numCats > maxNumCat)
      maxNumCat=numCats


    if(numCats == 0)
      emptyCategories.push(row['MAIN STORE LINK']);
    else
      allCategories = [...allCategories, ...splittedCats]



  }

  allCategories = allCategories.map(cat=>cat.trim())

    // Use a Set to get unique categories
    var uniqueCatsSet = new Set(allCategories);

    // Convert the Set back to an array
    var uniqueCatsArray = Array.from(uniqueCatsSet);

        console.log(allCategories)

  console.log('total comma separated categories: ', allCategories.length);

  console.log('total unique comma separated categories: ', uniqueCatsArray.length);
  console.log('total rows', totalRows)

  console.log('Average number of categories per row', Math.floor(totalCats/totalRows))

  console.log('max number of categories fetched for a store', maxNumCat)
  
  console.log('min number of categories fetched for a store', 0)

  console.log('stores with no categories: ', emptyCategories.length)
  
  // Write the CSV to a file
  fs.writeFileSync('op-all-empty-cats.json', JSON.stringify(emptyCategories,null, 2), 'utf8');

  console.log('json file has been saved');

}

// Replace 'your_excel_file.xlsx' with the path to your Excel file
processExcel('merged-cats.xlsx');
