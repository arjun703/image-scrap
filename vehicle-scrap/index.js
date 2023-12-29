const fs = require('fs');

const puppeteer = require('puppeteer');


async function login(username, password) {
    
    const browser = await puppeteer.launch({headless:true});
    
    const page = await browser.newPage();

    // Navigate to the login page
    await page.goto('https://usd.webshopmanager.com/admin?view=cms.file.list');

    // Fill in the login form
    await page.type('#login_login', username);
    
    await page.type('#login_password', password);

    // Click the login button
    await page.click('input[name="login_action"]');

    // Save a screenshot for debugging
    await page.screenshot({ path: 'login-screenshot.png' });

    await browser.close();

}

let page;
let nextPage
     processedFolders = [];
const allDownloadLinks = [];

async function downloadFilesRecursive(url) {

    const browser = await puppeteer.launch({headless:true});
    
     page = await browser.newPage();

    // Navigate to the login page
    await page.goto('https://usd.webshopmanager.com/admin?view=cms.file.list');
    
    // await page.goto("https://usd.webshopmanager.com/admin?view=cms.file.list&folder=11378");

    // Fill in the login form
    await page.type('#login_login', 'searchalytics');
    
    await page.type('#login_password', 'WaffleHouse4404!');

    // Click the login button
    await page.click('input[name="login_action"]');

    // Save a screenshot for debugging
    await page.screenshot({ path: 'login-screenshot.png' });

    await processFolder();

    nextPage = false

    async function processFolder() {


        // console.log("waiting")

        // console.log("waited")

        // Extract information from the current page
        let rows = await page.$$('tbody.list tr');

        // console.log(rows)

    for (let i = 0; i < rows.length; i++) {

        const row = rows[i];


            // console.log("hello row")
            
            // if(nextPage){ 
            //     nextPage = false

            //      const rowData = await page.evaluate(row2 => {
            //             // Extract and return information from the row2
            //             const cells = Array.from(row2.cells).map(cell => cell.textContent.trim());
            //             return cells;
            //         }, row);

            //          // console.log('Row Content:', rowData);

            //     // await page.waitForTimeout(500);

            // }


            const fileType = await row.$eval('td:nth-last-child(2)', cell => cell.textContent.trim());

            // console.log(fileType)

            if (fileType === 'folder') {
                    
                // console.log("processed folders", processedFolders)

                // console.log("hello2")

                const folderLink = await row.$('td:nth-last-child(4) a');

                // console.log(folderLink)

                // return

                if (folderLink) {
                    
                    const href = await page.evaluate(link => link.href, folderLink);
                    
                    if(processedFolders.includes(href)) continue

                    // console.log('Folder Link Href:', href);

                    await folderLink.click();

                    await page.waitForNavigation({ waitUntil: 'load' });
    
                    await processFolder();
            
                    await page.goBack();

                    // reload the page and process

                    // console.log("hello reassigning at first")

                    rows = await page.$$('tbody.list tr');

                    // await page.waitForNavigation({ waitUntil: 'load' });

                }
            
            } else {
                
                // console.log("hello3")

                const fileLink = await row.$('td:first-child a[target="_blank"]');
                
                if (fileLink) {
                
                    const fileUrl = await page.evaluate(link => link.href, fileLink);
                    
                    allDownloadLinks.push(fileUrl)

                    // console.log('Downloading file:', fileUrl);
                    // Implement file download logic here
                }
        
            }
        
        }

        // console.log("hello4")

        nextPage = true


       const nextImg = await page.$('img[src="/images/ui/icons/next.png"]');
        
        if (nextImg) {
            // Click on the <img> element to go to the next page
            await nextImg.click();

            await page.waitForNavigation({ waitUntil: 'load' });

            await processFolder();
            
            await page.goBack();


            // Wait for some time if needed to ensure the new page is loaded
        }


        console.log("all download links length" , allDownloadLinks.length)

        jsonData = allDownloadLinks
                // Convert the JSON data to a string with indentation of 2 spaces
         jsonString = JSON.stringify(jsonData, null, 2);

        // Write the string to a file
        fs.writeFileSync('output.json', jsonString, 'utf-8');


    }

}

// Replace 'your_url_here' with the actual URL of your HTML table
downloadFilesRecursive('https://usd.webshopmanager.com/admin?view=cms.file.list');