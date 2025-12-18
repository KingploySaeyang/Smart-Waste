const path = require("path");
const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  page.on('console', msg => {
    console.log('CONSOLE:', msg.type(), msg.text());
  });
  page.on('pageerror', err => {
    console.log('PAGEERROR:', err.message);
  });
  const target = 'file:///' + path.join(__dirname, '..', 'User', 'map.html').replace(/\\/g,'/');
  await page.goto(target, {waitUntil: 'networkidle2'});
  await page.waitForTimeout(2000);
  await page.screenshot({path: path.join(__dirname, 'map-debug.png'), fullPage: true});
  await browser.close();
})();
