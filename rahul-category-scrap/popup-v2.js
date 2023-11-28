
const puppeteer = require('puppeteer');
const fs = require('fs');
const XLSX = require('xlsx');
const cheerio = require('cheerio');

const processData = async (row) => {

const launchOptions = {
  timeout: 7000, // Set the timeout to 7 seconds
};

  const browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    
    await page.setViewport({width: 4080, height: 1024});

  const link = row['MAIN STORE LINK'];

  if (!link.includes('popupshop')) return null;
  if (link.trim().length === 0) return null;

  try {
    

    await page.goto(link, { waitUntil: 'load' });

    const categories = await page.evaluate(() => {
      const catWrapper = document.querySelector('#CheckboxListOptions-category_product');

      if (catWrapper) {
        return Array.from(catWrapper.querySelectorAll('span.PslCheckboxText'))
          .map(spanElem => spanElem.innerText)
          .join(', ');
      }

      return '';
    });


    console.log(categories)
    row['categories'] = categories;
    browser.close()
    return row;
  } catch (error) {
        browser.close()

    console.error(`Error fetching HTML from ${link}: ${error.message}`);
    return null;
  }
};

async function processExcel(filePath) {

  console.log("hello")

  const workbook = XLSX.readFile(filePath);

  const sheetName = workbook.SheetNames[0];

  const sheet = workbook.Sheets[sheetName];

  let data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const resultsForStoreAndOnlyPerniaspopupshop = [];

  let processedLink = 0;

  




  const processPromises = data.map(row => processData(row));

  // Create and write the results to a CSV file
  

    Promise.all(processPromises)
      .then((results) => {
        const validResults = results.filter(result => result !== null);
        resultsForStoreAndOnlyPerniaspopupshop.push(...validResults);
        console.log('All promises completed.');

        const json2csv = require('json2csv').parse;

        const jsonData = resultsForStoreAndOnlyPerniaspopupshop;

        // Find the object with the greatest number of keys
        const maxKeysObject = jsonData.reduce((prev, current) => (Object.keys(current).length > Object.keys(prev).length) ? current : prev, {});

        // Extract keys from the object with the greatest number of keys
        const fields = Object.keys(maxKeysObject);

        // Convert JSON to CSV
        const csv = json2csv(jsonData, { fields });

        // Write the CSV to a file
        fs.writeFileSync('op-all-popup.csv', csv, 'utf8');

        console.log('CSV file has been saved');


      })
      .catch((error) => {
        console.error(`Error in Promise.all: ${error.message}`);
      });



}

// Replace 'your_excel_file.xlsx' with the path to your Excel file
processExcel('urls-excel.xlsx');
