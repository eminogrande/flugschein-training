/*
 * Headless-Chromium smoke test over CDP. Zero dependencies.
 * Skips (does not fail) when no Chrome/Chromium binary is available.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PAGE = pathToFileURL(path.join(root, 'index.html')).href;

const CANDIDATES = [
  process.env.CHROME_BIN,
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/snap/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
];

const chromeBin = CANDIDATES.find((p) => p && existsSync(p));
const skip = chromeBin ? false : 'no Chrome/Chromium binary found';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitFor(fn, timeout = 15000, label = 'condition') {
  const started = Date.now();
  for (;;) {
    const value = await fn();
    if (value) return value;
    if (Date.now() - started > timeout) throw new Error(`timeout waiting for ${label}`);
    await sleep(100);
  }
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.waiting = new Map();
    this.errors = [];
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.waiting.has(msg.id)) {
        const { resolve, reject } = this.waiting.get(msg.id);
        this.waiting.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
        return;
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        this.errors.push(msg.params?.exceptionDetails?.text || 'exception');
      }
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params?.type === 'error') {
        this.errors.push(msg.params.args.map((a) => a.value ?? a.description).join(' '));
      }
    });
  }

  static connect(url) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      ws.addEventListener('open', () => resolve(new Cdp(ws)), { once: true });
      ws.addEventListener('error', () => reject(new Error('websocket error')), { once: true });
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.waiting.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(`eval failed: ${res.exceptionDetails.text} :: ${expression}`);
    }
    return res.result.value;
  }

  close() {
    try { this.ws.close(); } catch { /* already gone */ }
  }
}

async function launch() {
  const profile = mkdtempSync(path.join(tmpdir(), 'ppl-smoke-'));
  const proc = spawn(chromeBin, [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--allow-file-access-from-files',
    'about:blank'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  const cleanup = () => {
    try { proc.kill('SIGKILL'); } catch { /* gone */ }
    try { rmSync(profile, { recursive: true, force: true }); } catch { /* gone */ }
  };

  const portFile = path.join(profile, 'DevToolsActivePort');
  const wsPort = await waitFor(() => {
    if (!existsSync(portFile)) return null;
    const raw = readFileSync(portFile, 'utf8').split('\n')[0].trim();
    return raw ? Number(raw) : null;
  }, 20000, 'devtools port');

  const list = await waitFor(async () => {
    try {
      const r = await fetch(`http://127.0.0.1:${wsPort}/json/list`);
      const targets = await r.json();
      return targets.find((t) => t.type === 'page') || null;
    } catch {
      return null;
    }
  }, 15000, 'page target');

  return { proc, cdp: await Cdp.connect(list.webSocketDebuggerUrl), cleanup };
}

test('headless smoke: full round over file://', { skip, timeout: 240000 }, async (t) => {
  const { cdp, cleanup } = await launch();
  t.after(cleanup);

  await cdp.send('Runtime.enable');
  await cdp.send('Page.enable');

  // questions.js is CJS; the bank is read out of the page below.
  await cdp.send('Page.navigate', { url: PAGE });
  await waitFor(() => cdp.evaluate('document.readyState === "complete"'), 20000, 'page load');
  await waitFor(() => cdp.evaluate('document.querySelectorAll("#subject-chips input").length > 0'), 10000, 'chips');

  await t.test('start screen lists all nine subjects as chips', async () => {
    const labels = await cdp.evaluate(
      'Array.from(document.querySelectorAll("#subject-chips span")).map(s => s.textContent)'
    );
    assert.equal(labels.length, 9);
    assert.deepEqual(labels, [
      'Air Law',
      'Aircraft General Knowledge',
      'Flight Performance, Planning and Loading',
      'Human Performance',
      'Meteorology',
      'Navigation',
      'Operational Procedures',
      'Radiotelephony',
      'Principles of Flight'
    ]);
  });

  await t.test('empty subject selection is rejected', async () => {
    await cdp.evaluate('document.getElementById("select-none").click()');
    await cdp.evaluate('document.getElementById("start-btn").click()');
    const err = await cdp.evaluate('document.getElementById("start-error").hidden ? "" : document.getElementById("start-error").textContent');
    assert.match(err, /at least one subject/i);
  });

  await t.test('starting shows one question with four options', async () => {
    await cdp.evaluate('document.getElementById("select-all").click()');
    await cdp.evaluate('document.getElementById("start-btn").click()');
    const state = await cdp.evaluate(`(() => ({
      quizVisible: !document.getElementById("screen-quiz").hidden,
      startHidden: document.getElementById("screen-start").hidden,
      options: document.querySelectorAll(".opt").length,
      progress: document.getElementById("progress-text").textContent
    }))()`);
    assert.equal(state.quizVisible, true);
    assert.equal(state.startHidden, true);
    assert.equal(state.options, 4);
    assert.match(state.progress, /^Question 1 of \d+$/);
  });

  const bank = await cdp.evaluate('window.QUESTION_BANK');

  await t.test('answers give instant verdict and explanation, then advance', async () => {
    const total = await cdp.evaluate('document.querySelectorAll(".opt").length && Number(document.getElementById("progress-text").textContent.match(/of (\\d+)/)[1])');

    for (let n = 0; n < total; n += 1) {
      const text = await cdp.evaluate('document.getElementById("q-text").textContent');
      const item = bank.find((q) => q.question === text);
      assert.ok(item, `question rendered but not in the bank: ${text}`);
      await cdp.evaluate(`document.querySelector('.opt[data-index="${item.answer}"]').click()`);

      const feedback = await cdp.evaluate(`(() => ({
        hidden: document.getElementById("feedback").hidden,
        verdict: document.getElementById("verdict").textContent,
        explain: document.getElementById("explain").textContent,
        nextVisible: !document.getElementById("next-btn").hidden,
        disabled: Array.from(document.querySelectorAll(".opt")).every(b => b.disabled),
        correctMarked: document.querySelectorAll('.opt[data-state="correct"]').length
      }))()`);
      assert.equal(feedback.hidden, false);
      assert.match(feedback.verdict, /^Correct/);
      assert.ok(feedback.explain.length > 10);
      assert.equal(feedback.nextVisible, true);
      assert.equal(feedback.disabled, true, 'options lock after answering');
      assert.equal(feedback.correctMarked, 1);

      await cdp.evaluate('document.getElementById("next-btn").click()');
    }

    const results = await cdp.evaluate(`(() => ({
      visible: !document.getElementById("screen-results").hidden,
      score: document.getElementById("res-score").textContent,
      reviewHasItem: document.querySelectorAll(".review-item").length,
      heading: document.getElementById("review-h").textContent,
      bottomButton: document.getElementById("again-btn-2").hidden,
      passTone: document.getElementById("res-score").dataset.pass
    }))()`);
    assert.equal(results.visible, true, 'round ends on the results screen');
    assert.match(results.score, new RegExp(`^${total} / ${total}`));
    assert.equal(results.reviewHasItem, 0, 'all-correct round has no review items');
    assert.equal(results.heading, 'Review incorrect answers');
    assert.equal(results.bottomButton, true, 'no second restart button when nothing to review');
    assert.equal(results.passTone, 'yes');
  });

  await t.test('restart returns to a fresh start screen', async () => {
    await cdp.evaluate('document.getElementById("again-btn").click()');
    const state = await cdp.evaluate(`({
      startVisible: !document.getElementById("screen-start").hidden,
      resultsHidden: document.getElementById("screen-results").hidden,
      checked: document.querySelectorAll("#subject-chips input:checked").length
    })`);
    assert.equal(state.startVisible, true);
    assert.equal(state.resultsHidden, true);
    assert.equal(state.checked, 9);
  });

  await t.test('a wrong answer is reviewed at the end', async () => {
    await cdp.evaluate('document.getElementById("start-btn").click()');
    const text = await cdp.evaluate('document.getElementById("q-text").textContent');
    const item = bank.find((q) => q.question === text);
    const wrongIndex = (item.answer + 1) % 4;
    await cdp.evaluate(`document.querySelector('.opt[data-index="${wrongIndex}"]').click()`);
    const verdict = await cdp.evaluate('document.getElementById("verdict").textContent');
    assert.match(verdict, /^Incorrect/);
    await cdp.evaluate('document.getElementById("quit-btn").click()');
    const review = await cdp.evaluate(`(() => ({
      items: document.querySelectorAll(".review-item").length,
      hasCorrect: !!document.querySelector(".review-row.is-good"),
      score: document.getElementById("res-score").textContent
    }))()`);
    assert.equal(review.items, 1);
    assert.equal(review.hasCorrect, true);
    assert.match(review.score, /^0 \/ 1/);
  });

  await t.test('no horizontal scroll at 320px and 375px', async () => {
    for (const width of [320, 375]) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width, height: 780, deviceScaleFactor: 1, mobile: true
      });
      await sleep(120);
      const overflow = await cdp.evaluate(`({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth
      })`);
      assert.ok(overflow.scroll <= overflow.client + 1, `overflow at ${width}px: ${overflow.scroll} > ${overflow.client}`);
    }
    await cdp.send('Emulation.clearDeviceMetricsOverride');
  });

  await t.test('no console or runtime errors during the run', () => {
    assert.deepEqual(cdp.errors, []);
  });

  cdp.close();
});
