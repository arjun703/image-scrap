

const fs = require('fs');
const XLSX = require('xlsx');



async function processExcel(filePath) {






  // Parse the JSON data
  try {

    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];

const mostlyCompleteData = XLSX.utils.sheet_to_json(sheet, { defval: '' });


  // //   Specify the path to your JSON file
  // const filePath2 = 'merged.json';


  //   const workbook2 = XLSX.readFile(filePath);

  //   const sheetName2 = workbook.SheetNames[0];

  //   const sheet2 = workbook.Sheets[sheetNamee];

  //   const mergedDataRough = XLSX.utils.sheet_to_json(sheete);

    const storeURLvsImages = [];


    for (const row of mostlyCompleteData) {


      // console.log("MAIN LINK: ", link);
      link = row['MAIN STORE LINK']; // Adjust the column name accordingly
      
      if(link.includes('Not Applicable')){

        link = row['INSTAGRAM URL'];

      } 

        console.log(link);

      if(link.trim().length == 0) continue; 


      const imageURLs = [row['IMAGE 1'], row['IMAGE 2'], row['IMAGE 3'], row['IMAGE 4'], row['IMAGE 5'], row['IMAGE 6']]

      storeURLvsImages[link] = imageURLs


      
 

    }



    // Write the CSV to a file
    fs.writeFileSync('storeURLvsImages.json', JSON.stringify(storeURLvsImages), 'utf8');

    console.log('CSV file has been saved');

  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }

}

// Replace 'your_excel_file.xlsx' with the path to your Excel file
processExcel('merged-single-sheet.xlsx');