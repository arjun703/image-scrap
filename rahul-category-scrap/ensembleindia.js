
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

  const resultsForStoreAndOnlyPerniaspopupshop = [];

  let processedLink = 0;

const launchOptions = {
  timeout: 7000, // Set the timeout to 7 seconds
};

    const browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    
    await page.setViewport({width: 4080, height: 1024});


  for (const row of data) {

    const link = row['MAIN STORE LINK']; // Adjust the column name accordingly
    // console.log("MAIN LINK: ", link);

    if(!link.includes('ensembleindia')) continue

    if(link.trim().length == 0) continue

    try {

      // const browser = await puppeteer.launch({ headless: false });
       // await page.goto(link);
        await page.goto(link, { waitUntil: 'load' });

        categories = ''
          // Count the number of images found
        categories = await page.evaluate(() => {
            
            extractedCategories = '';

            const catWrapper = document.querySelector('.filter-style')

            if(catWrapper){
              
              allSpans  = Array.from(catWrapper.querySelectorAll('.text'))

              if(allSpans.length > 0)

                return allSpans.map(spanElem => spanElem.innerText).join(', ')

            }

            return extractedCategories

          });

          processedLink++;

          console.log(`index: ${processedLink}, categories: ${categories}`)

          row['categories'] = categories;

          resultsForStoreAndOnlyPerniaspopupshop.push(row);

    } catch (error) {
    
      console.error(`Error fetching HTML from ${link}: ${error.message}`);
        
    }

  }

  // Create and write the results to a CSV file
  
  const json2csv = require('json2csv').parse;

  const jsonData = resultsForStoreAndOnlyPerniaspopupshop;

  // Find the object with the greatest number of keys
  const maxKeysObject = jsonData.reduce((prev, current) => (Object.keys(current).length > Object.keys(prev).length) ? current : prev, {});

  // Extract keys from the object with the greatest number of keys
  const fields = Object.keys(maxKeysObject);

  // Convert JSON to CSV
  const csv = json2csv(jsonData, { fields });

  // Write the CSV to a file
  fs.writeFileSync('op-all-ensembleindia.csv', csv, 'utf8');

  console.log('CSV file has been saved');

}

// Replace 'your_excel_file.xlsx' with the path to your Excel file
processExcel('urls-excel.xlsx');
