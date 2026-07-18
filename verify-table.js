const { chromium } = require('playwright');

const BASE = 'http://localhost:50208';
const shotDir = 'D:/DTEC/PROJECT/CDSV/cdvs-frontend/.verify-shots';
require('fs').mkdirSync(shotDir, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(String(err)));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.locator('input').nth(0).fill('admin@mock.local');
  await page.locator('input').nth(1).fill('admin123');
  await page.locator('input').nth(1).press('Enter');
  await page.waitForTimeout(2000);
  console.log('URL after login:', page.url());
  await page.screenshot({ path: `${shotDir}/02-after-login.png` });

  await page.goto(`${BASE}/#/dashboard/list`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  console.log('URL for department list:', page.url());
  await page.screenshot({ path: `${shotDir}/03-department-list.png` });

  const wrapper = page.locator('.p-table__wrapper').first();
  const wrapperCount = await wrapper.count();
  console.log('p-table__wrapper found:', wrapperCount);

  if (wrapperCount > 0) {
    const box = await wrapper.boundingBox();
    console.log('wrapper box:', box);
    const scrollInfo = await wrapper.evaluate(el => ({
      scrollWidth: el.scrollWidth, clientWidth: el.clientWidth,
      scrollHeight: el.scrollHeight, clientHeight: el.clientHeight,
      overflow: getComputedStyle(el).overflow,
      maxHeight: getComputedStyle(el).maxHeight,
    }));
    console.log('scrollInfo:', scrollInfo);

    // Scroll horizontally to the far right to check right-frozen action column + left-frozen columns.
    await wrapper.evaluate(el => { el.scrollLeft = el.scrollWidth; });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${shotDir}/04-scrolled-horizontal-right.png` });

    // Scroll back to left edge.
    await wrapper.evaluate(el => { el.scrollLeft = 0; });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${shotDir}/05-scrolled-horizontal-left.png` });

    // Scroll partway to check both frozen sides visible at once with body content sliding beneath.
    await wrapper.evaluate(el => { el.scrollLeft = el.scrollWidth / 2; });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${shotDir}/06-scrolled-horizontal-mid.png` });

    // Scroll vertically down within the wrapper to check header stays pinned.
    await wrapper.evaluate(el => { el.scrollLeft = 0; el.scrollTop = 200; });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${shotDir}/07-scrolled-vertical.png` });
  }

  console.log('Console/page errors:', errors.length ? errors : 'none');
  await browser.close();
})().catch(e => { console.error('SCRIPT_FAIL', e); process.exit(1); });
