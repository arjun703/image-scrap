

const puppeteer = require('puppeteer');
const fs = require('fs');
const XLSX = require('xlsx');
const cheerio = require("cheerio");
var https = require("https");


function parseHtml(html) {
  // Write the CSV to a file
  fs.writeFileSync('insta-response.html', html, 'utf8');

  console.log('insta response file has been saved');


    const $ = cheerio.load(html);

    // Replace '._aagv img' with the appropriate selector for your case
    const imageSources = Array.from($("._aagv img")).map((imgNode) =>
        $(imgNode).attr("src")
    );

    return imageSources;
}


async function fetchHTML(url) {


    return new Promise((resolve, reject) => {
        const options = {
            method: "GET",
            hostname: "api.scrapingant.com",
            port: null,
            path: `/v2/general?url=${url}&x-api-key=b9bc5a9272804a059f26bb0b485ac2fa`,
            headers: {
                "useQueryString": true,
            },
        };

        const req = https.request(options, (res) => {
            const chunks = [];

            res.on("data", (chunk) => {
                chunks.push(chunk);
            });

            res.on("end", () => {
                const body = Buffer.concat(chunks);
                const result = parseHtml(body.toString());
                resolve(result);
            });
        });

        req.on("error", (error) => {
            reject(error);
        });

        req.end();
    });


}


async function processExcel(filePath) {

	console.log("hello")

  // const workbook = XLSX.readFile(filePath);

  // const sheetName = workbook.SheetNames[0];

  // const sheet = workbook.Sheets[sheetName];

  // const data = XLSX.utils.sheet_to_json(sheet);

  const resultsForStoreAndOnlyPerniaspopupshop = [];

  let processedLink = 0;


  let ogaanImages = 0;

  // for (const row of data) {

  //   let link = row['MAIN STORE LINK']; // Adjust the column name accordingly
  //   // console.log("MAIN LINK: ", link);

  //   if(!link.includes('Not Applicable')) continue

  //   link = row['INSTAGRAM URL'];

  //   if(link.trim().length == 0) continue;	

    link = "https://www.instagram.com/sanjanaray03/?hl=en"

    const imageUrls = await fetchHTML(link);

    // break;

    if (Array.isArray(imageUrls)) {
      
      processedLink++;

      // if(processedLink >= 3) break;

      console.log(`index: ${processedLink}, numImages; ${imageUrls.length}`)

      imageUrls.forEach((url, index) => {
          

          let key = `IMAGE ${0+1}`

          row[key] = url;



      });

       resultsForStoreAndOnlyPerniaspopupshop.push(row);

    // }



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
  fs.writeFileSync('op-all-instagram.csv', csv, 'utf8');

  console.log('CSV file has been saved');

}

// Replace 'your_excel_file.xlsx' with the path to your Excel file
processExcel('links-mostly-complete.xlsx');
