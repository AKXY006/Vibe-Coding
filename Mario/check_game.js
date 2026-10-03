import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  const consoleErrors = [];
  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log('Navigating to game...');
  await page.goto('http://localhost:5175/');
  await page.waitForSelector('button.play-btn');

  console.log('Taking menu screenshot...');
  await page.screenshot({ path: 'menu.png' });

  console.log('Clicking START ADVENTURE...');
  await page.click('button.play-btn');

  console.log('Waiting for game to load...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('Taking game screenshot...');
  await page.screenshot({ path: 'game.png' });

  console.log('Console errors encountered:', consoleErrors);

  await browser.close();
})();
