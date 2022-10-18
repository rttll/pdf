const functions = require('@google-cloud/functions-framework');
const puppeteer = require('puppeteer');

functions.http('pdf', async (req, res) => {
  const url = 'http://localhost:3000';

  let headless = true;
  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: headless,
      timeout: 3000,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }

  browser.newPage().then(async (page) => {
    page.setViewport({
      width: 2880 / 2,
      height: 1800 / 2,
      deviceScaleFactor: 3,
    });
    // page.emulateMediaType('screen');
    try {
      await page.goto(url, { waitUntil: 'load' });
      const buffer = await page.pdf({
        printBackground: true,
      });
      // console.log(typeof buffer, buffer);
      const fs = require('fs');
      fs.writeFileSync('foo.pdf', buffer, (a, b) => {
        console.log('saved to file', a, b);
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
    res.status(200).send('foo');
  });
});
