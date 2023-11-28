

const puppeteer = require('puppeteer');
const fs = require('fs');
const XLSX = require('xlsx');
const cheerio = require('cheerio');

async function fetchHTML(url, page) {
  try {

    console.log(url)

    await page.goto(url, { waitUntil: 'load' });

    await page.setViewport({width: 4080, height: 1024});

    let count = 0;

    let maxCount = 15;

    let maxImages = 6;

    let imageCount = 0;

    while (count < maxCount && imageCount < maxImages ) {
      // Scroll down to trigger lazy loading
      // Scroll down to trigger lazy loading

      // Count the number of images found
      imageCount = await page.evaluate(() => {
        return document.querySelectorAll('._aagv img').length;
      });

      if(imageCount < 6){



        count++;

        // Scroll down to trigger lazy loading
        await page.evaluate(async () => {
          window.scrollBy(0, 100);
        });

        // Wait for a short period, allowing images to load
        await page.waitForTimeout(700); // Adjust this time based on the website's behavior


      }

      // console.log(`Found ${imageCount} images after scrolling.`);

      // If you want to limit the number of scrolls, you can add a condition here
    }

  let imageURLs  = [];

     imageURLs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('._aagv img')).map(imgNode => imgNode.getAttribute('src'));
      });


    return imageURLs;
  } catch (error) {
    console.error(`Error fetching HTML from ${url}: ${error.message}`);
    return null;
  }
}


async function processExcel(filePath) {

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/accounts/login/');
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', 'Fawcdtgk789');
  await page.type('input[name="password"]', 'Fawcdtgk789!');
  await page.click('button[type="submit"]');
  // Add a wait for some selector on the home page to load to ensure the next step works correctly
  // await browser.close();
  console.log("logged in to instagram")
  console.log("hello")

  const workbook = XLSX.readFile(filePath);

  const sheetName = workbook.SheetNames[0];

  const sheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const resultsForStoreAndOnlyPerniaspopupshop = [];

  let processedLink = 0;

  let ogaanImages = 0;

  for (const row of data) {

    let link = row['MAIN STORE LINK']; // Adjust the column name accordingly
    // console.log("MAIN LINK: ", link);

  
    if(!link.includes('Not Applicable')) continue

    link = row['INSTAGRAM URL'];

    if(link.trim().length == 0) continue;  


    const imageUrls = await fetchHTML(link, page);

    if (Array.isArray(imageUrls)) {
      
      processedLink++;

      console.log(`index: ${processedLink}, numImages; ${imageUrls.length}`)

      imageUrls.forEach((url, index) => {
          let key = `IMAGE ${index+1}`

          row[key] = url;

          if(index > 5) return

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
  fs.writeFileSync('op-all-instagram-logged-in.csv', csv, 'utf8');

  console.log('CSV file has been saved');

}

// Replace 'your_excel_file.xlsx' with the path to your Excel file
processExcel('links-mostly-complete.xlsx');


