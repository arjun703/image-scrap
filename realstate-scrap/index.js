// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const json2csv = require('json2csv').parse;

// const launchOptions = {
//     headless: false,
//     timeout: 7000, // Set the timeout to 7 seconds
//   };


// async function fetchAllLinks(baseLink, numberOfPages){

//   const listingPagesLinksArray = [];

//   for (let i = 1; i <= numberOfPages; i++) {
//     const pageLink = `${baseLink}list-${i}`;
//     listingPagesLinksArray.push(pageLink);
//   }

//   if(!(listingPagesLinksArray.length)) return false;

//     // Process links in batches of 20
//   const batchSize = 30;

//   let allLinksOfIndividualPages = [];

//   links = listingPagesLinksArray;

//   for (let i = 0; i < links.length; i += batchSize) {
  
//     const batchLinks = links.slice(i, i + batchSize);

//     const promises = batchLinks.map(async (link) => {

//       try {

//         const page = await browser.newPage();

//         await page.setViewport({ width: 1280, height: 1024 });

//         await page.goto(link, { waitUntil: 'load' });

//         const linksOfIndividualPagesInThisListingPage = await page.evaluate( async () =>  {
        
//           if(document.querySelector('.details-link.residential-card__details-link'))
//             return Array.from(document.querySelectorAll('.details-link.residential-card__details-link')).map(detailsLink => detailsLink.href)
        
//           return false;
        
//         })

//         if(linksOfIndividualPagesInThisListingPage)

//           allLinksOfIndividualPages = [...allLinksOfIndividualPages, ...linksOfIndividualPagesInThisListingPage]

//       }catch (error) {
    
//         erroneous.push(link)
    
//         console.error(`Error fetching HTML from ${link}: ${error.message}`);
    
//       }
//     })

//     await Promise.all(promises);

//   }

//   return allLinksOfIndividualPages;

// }


// async function fetchNumberOfPages(baseURL){

//   const browser = await puppeteer.launch(launchOptions);


//   baseURL = "https://nowsecure.nl"

//   const page = await browser.newPage();

//   await page.setViewport({ width: 1280, height: 1024 });
//   await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');

//   await page.goto(baseURL, { waitUntil: 'load' });

//   await page.waitForTimeout(10000); // Adjust this time based on the website's behavior

//   const numberOfPages = await page.evaluate( async () =>  {

//       // Select the navigation with aria-label="Pagination Navigation"
//     const paginationNav = document.querySelector('[aria-label="Pagination Navigation"]');

//         // Check if the navigation element is found
//     if (paginationNav) {
//       // Get the last <a> child of the navigation
//       const lastAnchor = paginationNav.querySelector('a:last-child');

//       // Check if the <a> element is found
//       if (lastAnchor) {
//         // Fetch the inner text of the <a> element
//         const innerText = lastAnchor.innerText;

//         return parseInt(innerText);

//       } else {

//         return false;

//       }
//     } else {

//       return false;

//     }

//   })
         
//   // await page.close();

//   // await browser.close()

//   return numberOfPages;    



// }

// async function fetchAllRealStateData(allLinksOfIndividualPages){

// }

// async function fetchRealStates(baseURL){

//   const numberOfPages = await fetchNumberOfPages(baseURL);

//   console.log("num pages", numberOfPages);

//   if(!numberOfPages) return;

//   const allLinksOfIndividualPages = await fetchAllLinks(baseURL, numberOfPages);

//   console.log(allLinksOfIndividualPages)

//   const allRealStateDataForThisBaseURL = await fetchAllRealStateData(allLinksOfIndividualPages)



// }

// const baseURL = "https://www.realestate.com.au/buy/in-nsw/";

// // Call the function
// fetchRealStates(baseURL);



const puppeteer = require('puppeteer-extra') 
 
// Add stealth plugin and use defaults 
const pluginStealth = require('puppeteer-extra-plugin-stealth') 
const {executablePath} = require('puppeteer'); 
 
// Use stealth 
puppeteer.use(pluginStealth()) 
 
// Launch pupputeer-stealth 
puppeteer.launch({ headless:false, executablePath: executablePath() }).then(async browser => { 
  // Create a new page 
  const page = await browser.newPage(); 
 
  // Setting page view 
  await page.setViewport({ width: 1280, height: 720 }); 
 
  // Go to the website 
  await page.goto('https://nowsecure.nl/'); 
 
  // Wait for security check 
  await page.waitForTimeout(10000); 
 
  await page.screenshot({ path: 'image.png', fullPage: true }); 
 
  // await browser.close(); 
});
