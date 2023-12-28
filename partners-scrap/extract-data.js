const puppeteer = require('puppeteer');

async function scrapePartnerInformation(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'load' });
  
  await page.waitForTimeout(5000);




  // Extract Website, Email, Phone Number, Address
  const partnerInfo = await page.evaluate( async () =>  {
       
      const partnerInfo2 = {}



    // Extract partner name
    const partnerNameElement = document.querySelector('h1[data-test-id="title"]');
    partnerInfo2['Partner Name'] = partnerNameElement ? partnerNameElement.innerText : 'NA';

    // Extract Products
    const productsElement = document.querySelector('span[data-test-id="contact-detail-products-data"]');
    partnerInfo2['Products'] = productsElement ? productsElement.innerText : 'NA';


    // Extract Supported Languages
    const languagesElement = document.querySelector('span[data-test-id="contact-detail-languages-data"]');
    partnerInfo2['Supported Languages'] = languagesElement ? languagesElement.innerText : 'NA';

    // Extract Countries
    const countriesElement = document.querySelector('span[data-test-id="contact-detail-country-data"]');
    partnerInfo2['Countries'] = countriesElement ? countriesElement.innerText : 'NA';

    // Extract Specialization
    const specializationElement = document.querySelector('p[data-test-id="specializations-data"]');
    partnerInfo2['Specialization'] = specializationElement ? specializationElement.innerText : 'NA';



    const addressElement = document.querySelector('a[aria-label="Partner address"]');
    if (addressElement) {
      partnerInfo2['Address'] = addressElement.href;
    } else {
      partnerInfo2['Address'] = 'NA';
    }

    const phoneElement = document.querySelector('a[aria-label="Partner phone number"]');
    if (phoneElement) {
      partnerInfo2['Phone Number'] = phoneElement.href;
    } else {
      partnerInfo2['Phone Number'] = 'NA';
    }

    const emailElement = document.querySelector('a[aria-label="Partner email address"]');
    if (emailElement) {
      partnerInfo2['Email'] = emailElement.href;
    } else {
      partnerInfo2['Email'] = 'NA';
    }

    const websiteElement = document.querySelector('a.detail-links[aria-label="Partner website"]');
    if (websiteElement) {
      partnerInfo2['Website'] = websiteElement.href;
    } else {
      partnerInfo2['Website'] = 'NA';
    }




    return partnerInfo2;
  });


    // Extract Partner Type
    const partnerTypeElement = await page.$$eval('h2.contact-detail-titles', (titles) => {
      const typeElement = titles.find((title) => title.innerText.includes('type'));
      return typeElement ? typeElement.nextElementSibling.querySelector('span').innerText : 'NA';
    });
    partnerInfo['Partner Type'] = partnerTypeElement;


  // Merge partnerInfo into partnerInfo
  console.log(partnerInfo)

  await browser.close();

  return partnerInfo;
}



// Example usage
const sourceUrl = 'https://cloud.google.com/find-a-partner/partner/tata-consultancy-services';
scrapePartnerInformation(sourceUrl).then((result) => {
  console.log(result);
});
