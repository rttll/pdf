'use strict';

const { Storage } = require('@google-cloud/storage');
const projectId = 'the-wedding-expo';
const bucketName = 'weddingexpomapreports';
const puppeteer = require('puppeteer');

let dev, keyFilename, storageArgs, storage, bucket;
const ORIGIN = 'https://admin.weddingexpo.co';
const formats = {
  Letter: '8.5x11',
  Legal: '8.5x14',
  Tabloid: '11x17',
};

exports.pdf = (req, res) => {
  dev =
    req.headers.origin.indexOf('localhost') > -1 &&
    req.query.url.indexOf('localhost') > -1;
  res.set('Access-Control-Allow-Origin', dev ? '*' : ORIGIN);

  if (req.headers.origin != ORIGIN && !dev) {
    res.status(404).send('Not found');
  } else if (typeof req.query.url === 'undefined') {
    res.send('Need URL');
  } else {
    req.setTimeout(300000);
    let params = req.query;
    if (storage === undefined) {
      setupStorage();
    }
    // for (let k in params) {
    //   console.log(`${k}: ${params[k]}`)
    // }
    initReports(res, params);
  }
};

function setupStorage() {
  // Get storage keyfile in dev.
  if (dev) {
    const path = require('path');
    const fs = require('fs');
    const dir = path.join(__dirname, 'service-accounts/storage');
    let files = fs.readdirSync(dir);
    let file = files.filter((file) => file !== '.DS_Store')[0];
    keyFilename = `${dir}/${file}`;
  }
  storageArgs = process.env.PRODUCTION
    ? { projectId }
    : { projectId, keyFilename };
  storage = new Storage(storageArgs);
  bucket = storage.bucket(bucketName);
}

async function initReports(res, params) {
  let headless = true;
  // let headless = false; // testing, yo

  const browser = await puppeteer
    .launch({
      args: ['--no-sandbox'],
      headless: headless,
      timeout: 120000,
    })
    .then(
      function (browser) {
        getNext(res, params, browser, headless);
      },
      function (err) {
        console.log(err);
      }
    );
}

function getNext(res, params, browser, headless = true) {
  let url = params.url,
    timestamp = params.timestamp,
    area = params.area,
    filter = params.filter,
    reportName = params.reportName;
  let jpgParams = {};
  let file = {
    options:
      params.fileExtension === 'pdf'
        ? { landscape: true, format: params.format || 'Letter' }
        : { type: 'jpeg', quality: 100 }, // yes, "jpeg"
    fn: params.fileExtension === 'pdf' ? 'pdf' : 'screenshot',
  };
  let current_url =
    url +
    '?area=' +
    area +
    '&filter=' +
    filter +
    '&format=' +
    params.format +
    '&timestamp=' +
    timestamp;
  console.log(current_url);
  let page = browser
    .newPage()
    .then(function (page) {
      page.setViewport({
        width: 2880 / 2,
        height: 1800 / 2,
        deviceScaleFactor: 3,
      });
      page.goto(current_url, { waitUntil: 'load' });
      page.waitForSelector('#map-loaded').then(function (resp) {
        if (headless) {
          page.emulateMedia('screen'); // printBackground not working, so using this.
          page[file.fn](file.options).then(function (buffer) {
            let file = bucket.file(
              'map-report-' +
                timestamp +
                '/' +
                reportName +
                '-' +
                filter +
                '.' +
                params.fileExtension
            );
            file.save(buffer, function (err) {
              if (err) {
                console.log("couldn't save file, ", err);
                res.send('Error, couldn\t save file: ' + err);
              } else {
                res
                  .status(200)
                  .json({ reportName, reportName, area: area, filter: filter });
                browser.close();
              }
            });
          });
        } else {
          res
            .status(200)
            .json({ reportName, reportName, area: area, filter: filter });
        }
      });
    })
    .catch((err) => {
      res.send('Error: ' + err);
    });
}
