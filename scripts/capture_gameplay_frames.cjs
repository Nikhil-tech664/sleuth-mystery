const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const PORT = 4199;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.join(__dirname, '..', 'promo', 'gameplay_frames');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function startServer() {
  const distDir = path.join(__dirname, '..', 'dist');
  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    let filePath = path.join(distDir, reqPath === '/' ? 'index.html' : reqPath);
    if (!fs.existsSync(filePath)) filePath = path.join(distDir, 'index.html');
    
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.woff2': 'font/woff2'
    };
    
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  }).listen(PORT);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  const server = startServer();
  console.log(`Local server listening on http://localhost:${PORT}`);

  try {
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    console.log('Browser launched.');

    // Helper to setup page with tutorial marked seen
    async function setupPage(width, height) {
      const page = await browser.newPage();
      await page.setViewport({ width, height, deviceScaleFactor: 1 });
      await page.evaluateOnNewDocument(() => {
        localStorage.setItem('sleuth_tutorial_seen_v1', 'true');
        localStorage.setItem('sleuth_quickstart_dismissed_v1', 'true');
      });
      await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle2' });
      await sleep(500);
      await page.evaluate(() => {
        localStorage.setItem('sleuth_tutorial_seen_v1', 'true');
        localStorage.setItem('sleuth_quickstart_dismissed_v1', 'true');
        // Dismiss any open tutorial modal directly
        const btns = Array.from(document.querySelectorAll('button'));
        const closeX = btns.find(b => b.className.includes('top-4 right-4') || b.querySelector('svg.lucide-x'));
        if (closeX) closeX.click();
      });
      await sleep(600);
      return page;
    }

    // ===================================================
    // CAPTURE DESKTOP (1920 x 1080)
    // ===================================================
    console.log('--- CAPTURING DESKTOP (1920x1080) ---');
    const pD = await setupPage(1920, 1080);

    // Frame 1: Desk Overview & Briefing
    await pD.screenshot({ path: path.join(OUT_DIR, 'desktop_1_desk.png') });
    console.log('Saved desktop_1_desk.png');

    // Frame 2: Cross-examine Dr. Finch under polygraph
    await pD.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const polyBtn = btns.find(b => b.innerText.includes('Cross-Examine') || b.innerText.includes('Polygraph'));
      if (polyBtn) polyBtn.click();
    });
    await sleep(900);
    // Click Q1 to get dialogue response
    await pD.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q1 = btns.find(b => b.innerText.includes('Q1:') || b.innerText.includes('blackout'));
      if (q1) q1.click();
    });
    await sleep(600);
    await pD.screenshot({ path: path.join(OUT_DIR, 'desktop_2_interrogation.png') });
    console.log('Saved desktop_2_interrogation.png');

    // Close Interrogation
    await pD.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const closeBtn = btns.find(b => b.innerText.includes('Conclude Interrogation') || b.getAttribute('aria-label') === 'Close');
      if (closeBtn) closeBtn.click();
    });
    await sleep(500);

    // Frame 3: Logic Grid with marks
    await pD.evaluate(() => {
      const dossier = document.querySelector('.manila-dossier') || document.querySelector('.leather-blotter');
      if (dossier) dossier.scrollIntoView({ behavior: 'instant', block: 'center' });

      const cellBtns = Array.from(document.querySelectorAll('button[title*="Tap to toggle"]'));
      if (cellBtns.length >= 6) {
        cellBtns[0].click(); // X
        cellBtns[1].click(); // X
        cellBtns[2].click(); // X
        cellBtns[3].click(); cellBtns[3].click(); // Check!
        cellBtns[4].click(); // X
        cellBtns[5].click(); // X
      }
    });
    await sleep(600);
    await pD.screenshot({ path: path.join(OUT_DIR, 'desktop_3_logic_grid.png') });
    console.log('Saved desktop_3_logic_grid.png');

    // Frame 4: Forensics Lab
    await pD.evaluate(() => {
      window.scrollTo(0, 0);
      const btns = Array.from(document.querySelectorAll('button'));
      const fTab = btns.find(b => b.innerText.includes('Forensic Lab') || b.innerText.includes('Forensics Lab'));
      if (fTab) fTab.click();
    });
    await sleep(1000);
    await pD.screenshot({ path: path.join(OUT_DIR, 'desktop_4_forensics.png') });
    console.log('Saved desktop_4_forensics.png');

    // Return to Desk
    await pD.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const dTab = btns.find(b => b.innerText.includes('Active Desk') || b.innerText.includes('Desk'));
      if (dTab) dTab.click();
    });
    await sleep(500);

    // Frame 5: Accusation Modal (Select Dr. Finch, Candlestick, Grand Library)
    await pD.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const accBtn = btns.find(b => b.innerText.includes('FILE ACCU') || b.innerText.includes('File Accusation'));
      if (accBtn) accBtn.click();
    });
    await sleep(600);

    // Select correct solution
    await pD.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const finch = btns.find(b => b.innerText.includes('Finch'));
      if (finch) finch.click();
      const candle = btns.find(b => b.innerText.includes('Heavy Silver Candlestick') || b.innerText.includes('Candlestick'));
      if (candle) candle.click();
      const lib = btns.find(b => b.innerText.includes('Grand Library') || b.innerText.includes('Library'));
      if (lib) lib.click();
    });
    await sleep(500);
    await pD.screenshot({ path: path.join(OUT_DIR, 'desktop_5_accusation.png') });
    console.log('Saved desktop_5_accusation.png');

    // Submit Accusation -> Confession Modal with Iron Cell Bars & Heartbeat!
    await pD.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const submitBtn = btns.find(b => b.innerText.includes('STAMP & ISSUE') || b.innerText.includes('Submit Warrant'));
      if (submitBtn) submitBtn.click();
    });
    await sleep(2800); // Wait for iron cell door to slide shut and typewriter confession to write
    await pD.screenshot({ path: path.join(OUT_DIR, 'desktop_6_confession.png') });
    console.log('Saved desktop_6_confession.png');

    // Click "Seal Confession & Claim Case Trophy" -> opens SolvedModal
    await pD.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const sealBtn = btns.find(b => b.innerText.includes('Seal Confession') || b.innerText.includes('Claim Case Trophy'));
      if (sealBtn) sealBtn.click();
    });
    await sleep(1000);

    // Open The Daily Chronicle Newspaper via Special Files
    await pD.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const specBtn = btns.find(b => b.innerText.includes('Special Files'));
      if (specBtn) specBtn.click();
    });
    await sleep(400);
    await pD.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const newsBtn = btns.find(b => b.innerText.includes('Daily Chronicle'));
      if (newsBtn) newsBtn.click();
    });
    await sleep(1800);
    await pD.screenshot({ path: path.join(OUT_DIR, 'desktop_7_newspaper.png') });
    console.log('Saved desktop_7_newspaper.png');

    await pD.close();

    // ===================================================
    // CAPTURE VERTICAL MOBILE (1080 x 1920)
    // ===================================================
    console.log('--- CAPTURING VERTICAL MOBILE (1080x1920) ---');
    const pM = await setupPage(1080, 1920);

    // Mobile Frame 1: Incident Briefing & Hook
    await pM.screenshot({ path: path.join(OUT_DIR, 'mobile_1_hook.png') });
    console.log('Saved mobile_1_hook.png');

    // Mobile Frame 2: Interrogation
    await pM.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const polyBtn = btns.find(b => b.innerText.includes('Cross-Examine') || b.innerText.includes('Polygraph'));
      if (polyBtn) polyBtn.click();
    });
    await sleep(900);
    await pM.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q1 = btns.find(b => b.innerText.includes('Q1:') || b.innerText.includes('blackout'));
      if (q1) q1.click();
    });
    await sleep(600);
    await pM.screenshot({ path: path.join(OUT_DIR, 'mobile_2_interrogation.png') });
    console.log('Saved mobile_2_interrogation.png');

    // Close Interrogation
    await pM.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const closeBtn = btns.find(b => b.innerText.includes('Conclude Interrogation') || b.getAttribute('aria-label') === 'Close');
      if (closeBtn) closeBtn.click();
    });
    await sleep(500);

    // Mobile Frame 3: Logic Grid
    await pM.evaluate(() => {
      const dossier = document.querySelector('.manila-dossier') || document.querySelector('.leather-blotter');
      if (dossier) dossier.scrollIntoView({ behavior: 'instant', block: 'center' });

      const cellBtns = Array.from(document.querySelectorAll('button[title*="Tap to toggle"]'));
      if (cellBtns.length >= 6) {
        cellBtns[0].click();
        cellBtns[1].click();
        cellBtns[2].click();
        cellBtns[3].click(); cellBtns[3].click();
        cellBtns[4].click();
        cellBtns[5].click();
      }
    });
    await sleep(600);
    await pM.screenshot({ path: path.join(OUT_DIR, 'mobile_3_logic_grid.png') });
    console.log('Saved mobile_3_logic_grid.png');

    // Mobile Frame 4: Accusation Modal
    await pM.evaluate(() => {
      window.scrollTo(0, 0);
      const btns = Array.from(document.querySelectorAll('button'));
      const accBtn = btns.find(b => b.innerText.includes('FILE ACCU') || b.innerText.includes('File Accusation'));
      if (accBtn) accBtn.click();
    });
    await sleep(600);
    await pM.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const finch = btns.find(b => b.innerText.includes('Finch'));
      if (finch) finch.click();
      const candle = btns.find(b => b.innerText.includes('Heavy Silver Candlestick') || b.innerText.includes('Candlestick'));
      if (candle) candle.click();
      const lib = btns.find(b => b.innerText.includes('Grand Library') || b.innerText.includes('Library'));
      if (lib) lib.click();
    });
    await sleep(500);
    await pM.screenshot({ path: path.join(OUT_DIR, 'mobile_4_accuse.png') });
    console.log('Saved mobile_4_accuse.png');

    // Mobile Frame 5: Confession & Prison Bars
    await pM.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const submitBtn = btns.find(b => b.innerText.includes('STAMP & ISSUE') || b.innerText.includes('Submit Warrant'));
      if (submitBtn) submitBtn.click();
    });
    await sleep(2800);
    await pM.screenshot({ path: path.join(OUT_DIR, 'mobile_5_confession.png') });
    console.log('Saved mobile_5_confession.png');

    // Mobile Frame 6: Newspaper Modal
    await pM.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const sealBtn = btns.find(b => b.innerText.includes('Seal Confession') || b.innerText.includes('Claim Case Trophy'));
      if (sealBtn) sealBtn.click();
    });
    await sleep(1000);

    // Open The Daily Chronicle Newspaper via Special Files
    await pM.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const specBtn = btns.find(b => b.innerText.includes('Special Files'));
      if (specBtn) specBtn.click();
    });
    await sleep(400);
    await pM.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const newsBtn = btns.find(b => b.innerText.includes('Daily Chronicle'));
      if (newsBtn) newsBtn.click();
    });
    await sleep(1800);
    await pM.screenshot({ path: path.join(OUT_DIR, 'mobile_6_newspaper.png') });
    console.log('Saved mobile_6_newspaper.png');

    await pM.close();
    await browser.close();
    server.close();
    console.log('ALL GAMEPLAY FRAMES CAPTURED FLAWLESSLY!');
  } catch (err) {
    console.error('Frame capture failed:', err);
    server.close();
    process.exit(1);
  }
}

run();
