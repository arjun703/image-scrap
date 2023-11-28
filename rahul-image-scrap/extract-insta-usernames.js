

const fs = require('fs');
const XLSX = require('xlsx');



async function processExcel(filePath) {


// Specify the path to your JSON file
const filePath2 = 'organized-rem.json';

const notExistingUsernames = [];

// Read the JSON file
fs.readFile(filePath2, 'utf8', (err, data2) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse the JSON data
  try {
    const usernameAndImages = JSON.parse(data2);

    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(sheet);

    const instaPhotos = [];

    for (const row of data) {

      let link = row['MAIN STORE LINK']; // Adjust the column name accordingly
      // console.log("MAIN LINK: ", link);

      if(!link.includes('Not Applicable')) continue

      link = row['INSTAGRAM URL'];

      if(link.trim().length == 0) continue; 


      

      const match = link.match(/instagram\.com\/([^\/?]+)/i);
      
      // Check if a match was found, and return the username (or null if not found)
      const  username =  match ? match[1] : null;
    

      // Check if 'abcd' key exists
      if (usernameAndImages.hasOwnProperty(username)) {

        const imageUrls = usernameAndImages[username]

        imageUrls.forEach((url, index) => {
            
            let key = `IMAGE ${index+1}`

            row[key] = url;

        });


        instaPhotos.push(row)
      
      } else {
      
          notExistingUsernames.push(username);
        

      }

    }

   // Create and write the results to a CSV file
    
    const json2csv = require('json2csv').parse;

    const jsonData = instaPhotos;

    // Find the object with the greatest number of keys
    const maxKeysObject = jsonData.reduce((prev, current) => (Object.keys(current).length > Object.keys(prev).length) ? current : prev, {});

    // Extract keys from the object with the greatest number of keys
    const fields = Object.keys(maxKeysObject);

    // Convert JSON to CSV
    const csv = json2csv(jsonData, { fields });

    // Write the CSV to a file
    fs.writeFileSync('op-all-instagram-rem.csv', csv, 'utf8');

    console.log('CSV file has been saved');


    // Write the CSV to a file
    fs.writeFileSync('not-existing-username.json', JSON.stringify(notExistingUsernames), 'utf8');

    console.log('CSV file has been saved');




  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});



}

// Replace 'your_excel_file.xlsx' with the path to your Excel file
processExcel('links-mostly-complete.xlsx');