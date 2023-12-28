const puppeteer = require('puppeteer');
const fs = require('fs');

const maxSize = 15;
const maxRetryAttempts = 60;
const waitTimeout = 100;
const saveThreshold = 500;

const queue = [];
const previousLinks = ['-1'];

const addToQueue = (item) => {
  queue.push(item);
  if (queue.length > maxSize) {
    queue.shift();
  }
};

const scrapePage = async (page) => {
  return page.$$eval('app-partner-card a:nth-last-child(-n+12)', anchors => {
    return anchors.slice(-12).map(anchor => anchor.href);
  });
};

const clickNextButton = async (page) => {
  const nextButton = await page.$('.mat-mdc-button');
  if (nextButton) {
    await nextButton.click();

    let triedAttempts = 0;
    while (triedAttempts <= maxRetryAttempts) {
      triedAttempts++;
      await page.waitForTimeout(waitTimeout);
      const links = await scrapePage(page);
      if (previousLinks[0] !== links[0]) {
        addToQueue(allLinks.length);
              // console.log(links)

        previousLinks[0] = links[0];
        allLinks = allLinks.concat(links);
        return true;
      }
    }
  } else {
    addToQueue(allLinks.length);
  }
  return false;
};

const saveToJson = (data) => {
  fs.writeFileSync('./op/partners-links-optimized-2.json', JSON.stringify(data, null, 2));
};

let allLinks = [];

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const url = 'https://cloud.google.com/find-a-partner/';
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(5000);

  let totalNextButtonClicks = 0;
  let fileSavedWhenAllLinks = 0;

  while (true) {
    try {
      totalNextButtonClicks++;
      await clickNextButton(page)

      console.log('allLinks', allLinks.length, 'totalNextButtonClicks', totalNextButtonClicks);
        // console.log(queue)

      if (queue.length === maxSize && queue.every(value => value === queue[0])) {
        saveToJson(allLinks);
        console.log('No next button found');
        break;
      }

      if ((allLinks.length - fileSavedWhenAllLinks) > saveThreshold) {
        console.log('Saving to file');
        saveToJson(allLinks);
        fileSavedWhenAllLinks = allLinks.length;
      }
    } catch (error) {
      console.log(error);
    }
  }

  await browser.close();
};

main();
