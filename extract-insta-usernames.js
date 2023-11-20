

const fs = require('fs');
const XLSX = require('xlsx');



async function processExcel(filePath) {

	console.log("hello")

  const workbook = XLSX.readFile(filePath);

  const sheetName = workbook.SheetNames[0];

  const sheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(sheet);

  const instaUsernames = [];

  for (const row of data) {

    let link = row['MAIN STORE LINK']; // Adjust the column name accordingly
    // console.log("MAIN LINK: ", link);

    if(!link.includes('Not Applicable')) continue

    link = row['INSTAGRAM URL'];

    if(link.trim().length == 0) continue;	


    

    const match = link.match(/instagram\.com\/([^\/?]+)/i);
    
    // Check if a match was found, and return the username (or null if not found)
    const  username =  match ? match[1] : null;
  
    instaUsernames.push(username)


  }

  // Write the CSV to a file
  fs.writeFileSync('insta-usernames.json', JSON.stringify(instaUsernames), 'utf8');

  console.log('CSV file has been saved');

}

// Replace 'your_excel_file.xlsx' with the path to your Excel file
processExcel('links-mostly-complete.xlsx');