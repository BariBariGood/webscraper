const dotenv = require('dotenv');
const fs = require('fs');

const puppeteer = require('puppeteer');
const sqlite = require('sqlite3');
const sequelize = require('sequelize');

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

  await page.waitForSelector(selectors.login.input);
  await page.type(selectors.login.input, process.env.PASSWORD);
  await page.waitForSelector(selectors.login.button_next);
  await page.click(selectors.login.button_next);
}

async function fetchTweets() {
  await page.waitForSelector(selectors.explore.tweet_list);
  const result = [];
  const interval = setInterval(async () => {
    const tweets = await page.evaluate(() => {
      const tweetList = document.querySelector(selectors.explore.tweet_list);
      const tweets = document.querySelectorAll(selectors.explore.tweet);
      tweetList.scrollBy(0, 100);
      return tweets;
    });
    result.concat(tweets);
  }, 500);
  setTimeout(() => {
    clearInterval(interval);
  }, 5000);
  return result;
}

async function scrape() {
  await page.goto('https://twitter.com/search?q=crypto&src=typed_query');
  // const tweets = await fetchTweets();
  // console.log(tweets);
}

(async () => {
  await initBrowser();
  await initPage();
  await login();
  await scrape();
})();