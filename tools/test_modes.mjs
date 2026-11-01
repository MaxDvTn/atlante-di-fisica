// Automated test for Theory / Practice mode switching
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const ROOT = process.cwd();
const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

// Static file server
const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  const filePath = path.join(ROOT, reqPath);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
console.log(`Test server running on http://127.0.0.1:${port}`);

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', resp => {
    if (!resp.ok() && !resp.url().includes('_vercel/insights')) {
      console.log('Resource failed to load:', resp.url(), resp.status());
    }
  });

  console.log('Navigating to kinematics/#0...');
  await page.goto(`http://127.0.0.1:${port}/kinematics/#0`, { waitUntil: 'networkidle0' });
  await page.waitForFunction('window.__atlas');

  // Wait a bit for practice.js dynamic import
  await page.waitForSelector('.page-modes', { timeout: 5000 });

  console.log('Checking initial state (Theory mode)...');
  const initial = await page.evaluate(() => {
    const modes = document.querySelector('.page-modes');
    const theoryBtn = document.querySelector('.mode-btn[data-mode="theory"]');
    const practiceBtn = document.querySelector('.mode-btn[data-mode="practice"]');
    const theoryContent = document.querySelector('.mode-content.mode-theory');
    const practiceContent = document.querySelector('.mode-content.mode-practice');

    return {
      hasModes: !!modes,
      theoryActive: theoryBtn?.classList.contains('active'),
      practiceActive: practiceBtn?.classList.contains('active'),
      theoryHidden: theoryContent?.hasAttribute('hidden'),
      practiceHidden: practiceContent?.hasAttribute('hidden'),
      questionCount: practiceContent?.querySelectorAll('.q').length || 0,
    };
  });

  if (!initial.hasModes) throw new Error('Tabs navigation (.page-modes) not found');
  if (!initial.theoryActive) throw new Error('Theory button is not active by default');
  if (initial.practiceActive) throw new Error('Practice button is active by default (expected inactive)');
  if (initial.theoryHidden) throw new Error('Theory content is hidden');
  if (!initial.practiceHidden) throw new Error('Practice content is NOT hidden by default');
  if (initial.questionCount === 0) throw new Error('No practice questions rendered in practice container');
  console.log('✓ Initial state verified: Theory is active, Practice is hidden with', initial.questionCount, 'questions');

  console.log('Switching to Practice mode...');
  await page.click('.mode-btn[data-mode="practice"]');
  const practiceState = await page.evaluate(() => {
    const theoryBtn = document.querySelector('.mode-btn[data-mode="theory"]');
    const practiceBtn = document.querySelector('.mode-btn[data-mode="practice"]');
    const theoryContent = document.querySelector('.mode-content.mode-theory');
    const practiceContent = document.querySelector('.mode-content.mode-practice');
    return {
      theoryActive: theoryBtn?.classList.contains('active'),
      practiceActive: practiceBtn?.classList.contains('active'),
      theoryHidden: theoryContent?.hasAttribute('hidden'),
      practiceHidden: practiceContent?.hasAttribute('hidden'),
    };
  });

  if (practiceState.theoryActive) throw new Error('Theory button remained active');
  if (!practiceState.practiceActive) throw new Error('Practice button failed to become active');
  if (!practiceState.theoryHidden) throw new Error('Theory content was not hidden');
  if (practiceState.practiceHidden) throw new Error('Practice content remained hidden');
  console.log('✓ Practice mode active: Theory is hidden, Practice is displayed');

  console.log('Testing interaction with a practice question...');
  await page.click('#sheet .practice .q[data-q="0"] button[data-c="2"]');
  const answered = await page.evaluate(() => {
    const q = document.querySelector('#sheet .practice .q[data-q="0"]');
    const why = q.querySelector('.why');
    return {
      isDone: q.classList.contains('done'),
      whyVisible: why && !why.hidden,
      isRight: q.querySelector('button[data-c="2"]').classList.contains('right'),
    };
  });

  if (!answered.isDone) throw new Error('Question not marked as done');
  if (!answered.whyVisible) throw new Error('Explanation .why is not visible');
  if (!answered.isRight) throw new Error('Answer was not marked as right');
  console.log('✓ Question interaction verified: answer checked and explanation shown');

  console.log('Switching back to Theory mode...');
  await page.click('.mode-btn[data-mode="theory"]');
  const backToTheory = await page.evaluate(() => {
    return {
      theoryActive: document.querySelector('.mode-btn[data-mode="theory"]')?.classList.contains('active'),
      theoryVisible: !document.querySelector('.mode-content.mode-theory')?.hasAttribute('hidden'),
      practiceHidden: document.querySelector('.mode-content.mode-practice')?.hasAttribute('hidden'),
    };
  });
  if (!backToTheory.theoryActive || !backToTheory.theoryVisible || !backToTheory.practiceHidden) {
    throw new Error('Failed to return cleanly to Theory mode');
  }
  console.log('✓ Returned to Theory mode cleanly');

  console.log('Testing page navigation (switch to practice on page 0, navigate to page 1)...');
  await page.click('.mode-btn[data-mode="practice"]');
  // Navigate to page 1
  await page.evaluate(() => window.__atlas.goto(1));
  await page.waitForFunction(() => document.getElementById('pagenum').textContent.startsWith('2 /'));
  await new Promise(r => setTimeout(r, 200));

  const page1State = await page.evaluate(() => {
    return {
      theoryActive: document.querySelector('.mode-btn[data-mode="theory"]')?.classList.contains('active'),
      theoryVisible: !document.querySelector('.mode-content.mode-theory')?.hasAttribute('hidden'),
      practiceHidden: document.querySelector('.mode-content.mode-practice')?.hasAttribute('hidden'),
    };
  });

  if (!page1State.theoryActive || !page1State.theoryVisible || !page1State.practiceHidden) {
    throw new Error('New page did not default to Theory mode');
  }
  console.log('✓ Page 1 starts in Theory mode as expected');

  if (errors.length) {
    throw new Error('Page errors detected: ' + errors.join('; '));
  }

  console.log('ALL MODE TESTS PASSED SUCCESSFULLY! ✓');
} finally {
  await browser.close();
  server.close();
}

