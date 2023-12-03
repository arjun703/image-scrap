const puppeteer = require('puppeteer');
const fs = require('fs');

// Function to scrape data from the current page
const scrapePage = async (page) => {
    const links = await page.$$eval('a.table-row', anchors => {
        return anchors.map(anchor => anchor.href);
    });
    return links;
};

    let allLinks = [];


// Function to click the "Next" button
const clickNextButton = async (page) => {
    const nextButton = await page.$('button.button-next');
    links = []
    if (nextButton) {
        await nextButton.click();

        const maxRetryAttempts = 3

        let triedAttempts = 0;

        while(triedAttempts <= maxRetryAttempts){

            triedAttempts++


            console.log(triedAttempts);
            
            console.log("hello")
            await page.waitForTimeout(2000);

            links = await page.$$eval('a.table-row', anchors => {
                return anchors.map(anchor => anchor.href);
            });


            if(!(allLinks.includes(links[0]))) break;

            links = []

        }   


        return [false, links.length >0 ];
    } else {
        return [true, false]; // No "Next" button found
    }
};

// Function to save data to a JSON file
const saveToJson = (data) => {
    fs.writeFileSync('./op/india-links.json', JSON.stringify(data, null, 2));
};

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const url = 'https://www.nationaalarchief.nl/onderzoeken/index/nt00345?activeTab=nt&sortering=prs_achternaam&volgorde=asc'
    await page.setViewport({ width: 1200, height: 800 });

    // Replace 'your_url_here' with the starting URL
    await page.goto(url, { waitUntil: 'load' });
                await page.waitForTimeout(10000);

    push = true

    totalNextButtonClicks = 0

    while (true) {
        

        try{

            if(push){
                
                const linksOnPage = await scrapePage(page);
            
                allLinks = allLinks.concat(linksOnPage);
            
            }

            const [exitLoop, push2] = await clickNextButton(page);

            push = push2

            totalNextButtonClicks += 1

            console.log('exitloop', exitLoop, 'push: ', push, 'totalNextButtonClicks', totalNextButtonClicks,'all', allLinks.length);

            saveToJson(allLinks);

            if (exitLoop) {
                break; // Exit the loop if there's no "Next" button
            }
       

        }catch(error){
            console.log(error)
        }
    }

    await browser.close();
})();
