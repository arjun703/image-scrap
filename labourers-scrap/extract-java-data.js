const puppeteer = require('puppeteer');
const fs = require('fs');


async function fetchLabourers(filePath) {

  const allLabourers = [];

  let processedLink = 0;

	const launchOptions = {
		headless:true,
	  timeout: 7000, // Set the timeout to 7 seconds
	};


	const links = JSON.parse(fs.readFileSync('op/china-links.json', 'utf-8'));

    const browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    
    await page.setViewport({width: 1280, height: 1024});


  for (const link of links) {

    try {

        await page.goto(link, { waitUntil: 'load' });

        
        labourer = await page.evaluate(() => {
            
			const labourer = {}

            Array.from(document.querySelectorAll('.field-data .field')).forEach(field=>{

            	labourer[field.querySelector('.label').innerText.trim()] = field.querySelector('.value').innerText.trim()

            })

            labourer['link'] = window.location.href  

            return labourer

          })

          processedLink++;

          console.log(`index: ${processedLink}, javaLabourers: ${allLabourers.length}`)

          allLabourers.push(labourer);

    } catch (error) {
    
      console.error(`Error fetching HTML from ${link}: ${error.message}`);
        
    }

  }


  inputArray = allLabourers

	// Step 1: Extract all unique keys
	const allKeys = Array.from(new Set(inputArray.flatMap(obj => Object.keys(obj))));

	// Step 2: Create a new array with all keys present in each object
	const newArray = inputArray.map(obj => {
	    const newObj = {};
	    allKeys.forEach(key => {
	        newObj[key] = obj[key] || ''; // Use empty string if the key doesn't exist in the original object
	    });
	    return newObj;
	});


  // Create and write the results to a CSV file
  
  const json2csv = require('json2csv').parse;

  const jsonData = newArray;

  // Find the object with the greatest number of keys
  const maxKeysObject = jsonData.reduce((prev, current) => (Object.keys(current).length > Object.keys(prev).length) ? current : prev, {});

  // Extract keys from the object with the greatest number of keys
  const fields = Object.keys(maxKeysObject);

  // Convert JSON to CSV
  const csv = json2csv(jsonData, { fields });

  // Write the CSV to a file
  fs.writeFileSync('./op/china-labourers.csv', csv, 'utf8');

  console.log('CSV file has been saved');

}

// Replace 'your_excel_file.xlsx' with the path to your Excel file
fetchLabourers()