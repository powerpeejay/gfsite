import puppeteer from 'puppeteer';
import { mkdir, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREENSHOT_DIR = join(__dirname, 'temporary screenshots');

async function takeScreenshot() {
  const url = process.argv[2] || 'http://localhost:3000';
  const label = process.argv[3] || '';

  // Ensure screenshot directory exists
  await mkdir(SCREENSHOT_DIR, { recursive: true });

  // Find next screenshot number
  let files = [];
  try {
    files = await readdir(SCREENSHOT_DIR);
  } catch {}
  const nums = files
    .filter(f => f.startsWith('screenshot-') && f.endsWith('.png'))
    .map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0', 10))
    .filter(n => !isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;

  const filename = label
    ? `screenshot-${next}-${label}.png`
    : `screenshot-${next}.png`;
  const filepath = join(SCREENSHOT_DIR, filename);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // Scroll through the page to trigger Intersection Observer animations
  await page.evaluate(async () => {
    const distance = 300;
    const delay = 100;
    const scrollHeight = document.body.scrollHeight;
    let current = 0;
    while (current < scrollHeight) {
      window.scrollBy(0, distance);
      current += distance;
      await new Promise(r => setTimeout(r, delay));
    }
    // Scroll back to top for the screenshot
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 300));
  });

  // Wait for animations to settle
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`Screenshot saved: ${filepath}`);

  await browser.close();
}

takeScreenshot().catch(err => {
  console.error('Screenshot failed:', err.message);
  process.exit(1);
});
