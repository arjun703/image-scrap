

const puppeteer = require('puppeteer');
const fs = require('fs');
const XLSX = require('xlsx');

async function fetchHTML(url) {
  try {
    // const browser = await puppeteer.launch({ headless: false });
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'load' });

    await page.setViewport({width: 4080, height: 1024});

    let count = 0;

    let maxCount = 3;

    let maxImages = 6;

    let imageCount = 0;

    while (count < maxCount && imageCount < maxImages ) {
      // Scroll down to trigger lazy loading
      // Scroll down to trigger lazy loading

      // Count the number of images found
      imageCount = await page.evaluate(() => {
        return document.querySelectorAll('.hidden img.object-contain').length;
      });

      if(imageCount < 6){



	      count++;

	      // Scroll down to trigger lazy loading
	      await page.evaluate(async () => {
	        window.scrollBy(0, 100);
	      });

	      // Wait for a short period, allowing images to load
	      await page.waitForTimeout(1000); // Adjust this time based on the website's behavior


      }

      // console.log(`Found ${imageCount} images after scrolling.`);

      // If you want to limit the number of scrolls, you can add a condition here
    }

	let imageURLs  = [];

     imageURLs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.hidden img.object-contain')).map(imgNode => imgNode.getAttribute('src'));
      });


    await browser.close();
    return imageURLs;
  } catch (error) {
    console.error(`Error fetching HTML from ${url}: ${error.message}`);
    return null;
  }
}


async function processExcel(filePath) {

	console.log("hello")

  const workbook = XLSX.readFile(filePath);

  const sheetName = workbook.SheetNames[0];

  const sheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(sheet);

  const resultsForStoreAndOnlyPerniaspopupshop = [];

  let processedLink = 0;


  let ogaanImages = 0;

  for (const row of data) {

    const link = row['MAIN STORE LINK']; // Adjust the column name accordingly
    // console.log("MAIN LINK: ", link);


    if(!link.includes('azafashions')) continue

    const imageUrls = await fetchHTML(link);

    if (Array.isArray(imageUrls)) {
      
      processedLink++;


      console.log(`index: ${processedLink}, numImages; ${imageUrls.length}`)

      imageUrls.forEach((url, index) => {
          let key = `IMAGE ${index+1}`

          row[key] = url;

      });

       resultsForStoreAndOnlyPerniaspopupshop.push(row);

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
  fs.writeFileSync('op-all-azafashions.csv', csv, 'utf8');

  console.log('CSV file has been saved');

}

// Replace 'your_excel_file.xlsx' with the path to your Excel file
processExcel('links-mostly-complete.xlsx');
