const dotenv = require('dotenv');
const fs = require('fs');

const puppeteer = require('puppeteer');

// initialize dotenv
dotenv.config();

// initialize selectors.json
const selectors = JSON.parse(fs.readFileSync("./selectors.json"));

// globals
let browser;
let page;

// initialize browser
async function initBrowser() {
  browser = await puppeteer.launch({
    headless: false
  });
}

// initialize page
async function initPage() {
  page = await browser.newPage();
  await page.goto('https://twitter.com/i/flow/login');
}

// log in
async function login() {
  await page.waitForSelector(selectors.login.input);
  await page.type(selectors.login.input, process.env.EMAIL);
  await page.waitForSelector(selectors.login.button_first);
  await page.click(selectors.login.button_first);

  await page.waitForSelector(selectors.login.input);
  await page.type(selectors.login.input, process.env.USERNAME);
  await page.waitForSelector(selectors.login.button_next);
  await page.click(selectors.login.button_next);

  // await page.waitForSelector(selectors.login.input);
  // await page.type(selectors.login.input, process.env.PASSWORD);
  // await page.waitForSelector(selectors.login.button_next);
  // await page.click(selectors.login.button_next);
}

(async () => {
  await initBrowser();
  await initPage();
  await login();
})();