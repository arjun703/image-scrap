const puppeteer = require('puppeteer');
const fs = require('fs');
const json2csv = require('json2csv').parse;

async function fetchLabourers(filePath) {
  const allLabourers = [];
  let processedLink = 0;

  const launchOptions = {
    headless: true,
    timeout: 7000, // Set the timeout to 7 seconds
  };

  let links = JSON.parse(fs.readFileSync('op/java-links.json', 'utf-8'));

  const browser = await puppeteer.launch(launchOptions);

  links = links.slice(20000, 31000);

  const erroneous = [];

  // Process links in batches of 20
  const batchSize = 50;
  for (let i = 0; i < links.length; i += batchSize) {
    const batchLinks = links.slice(i, i + batchSize);

    const promises = batchLinks.map(async (link) => {
      try {


        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 1024 });

        await page.goto(link, { waitUntil: 'load' });

        const labourer = await page.evaluate(() => {
          const labourer = {};
          Array.from(document.querySelectorAll('.field-data .field')).forEach((field) => {
            labourer[field.querySelector('.label').innerText.trim()] = field.querySelector('.value').innerText.trim();
          });
          labourer['link'] = window.location.href;
          return labourer;
        });

        processedLink++;
        console.log(`Labourers: ${allLabourers.length+20000}`);
        allLabourers.push(labourer);
        await page.close();

      } catch (error) {
        erroneous.push(link)
        console.error(`Error fetching HTML from ${link}: ${error.message}`);
      }
    });

    await Promise.all(promises);
  }

  await browser.close();

  // Step 1: Extract all unique keys
  const allKeys = Array.from(new Set(allLabourers.flatMap(obj => Object.keys(obj))));

  // Step 2: Create a new array with all keys present in each object
  const newArray = allLabourers.map(obj => {
    const newObj = {};
    allKeys.forEach(key => {
      newObj[key] = obj[key] || ''; // Use empty string if the key doesn't exist in the original object
    });
    return newObj;
  });

  // Find the object with the greatest number of keys
  const maxKeysObject = newArray.reduce((prev, current) => (Object.keys(current).length > Object.keys(prev).length) ? current : prev, {});

  // Extract keys from the object with the greatest number of keys
  const fields = Object.keys(maxKeysObject);

  // Convert JSON to CSV
  const csv = json2csv(newArray, { fields });

  // Write the CSV to a file
  fs.writeFileSync('./op/java-labourers-3.csv', csv, 'utf8');
  fs.writeFileSync('./op/erroneous-java-labourers-3.json', JSON.stringify(erroneous), 'utf8');

  console.log('CSV file has been saved');
}

// Call the function
fetchLabourers();
