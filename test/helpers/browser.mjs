/*
 * Tiny CDP harness shared by the browser tests. Zero dependencies.
 * Resolves a Chrome binary, or exports a skip reason when there is none.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
export const PAGE = pathToFileURL(path.join(root, 'index.html')).href;

const CANDIDATES = [
  process.env.CHROME_BIN,
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/snap/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
];

export const chromeBin = CANDIDATES.find((p) => p && existsSync(p));
export const skip = chromeBin ? false : 'no Chrome/Chromium binary found';

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function waitFor(fn, timeout = 15000, label = 'condition') {
  const started = Date.now();
  for (;;) {
    const value = await fn();
    if (value) return value;
    if (Date.now() - started > timeout) throw new Error(`timeout waiting for ${label}`);
    await sleep(100);
  }
}

export class Cdp {
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

export async function launch() {
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

/* Navigate and wait until questions.js has populated the bank. */
export async function openApp(cdp) {
  await cdp.send('Runtime.enable');
  await cdp.send('Page.enable');
  await cdp.send('Page.navigate', { url: PAGE });
  await waitFor(() => cdp.evaluate('document.readyState === "complete"'), 20000, 'page load');
  await waitFor(() => cdp.evaluate('window.QUESTION_BANK && window.QUESTION_BANK.length > 0'), 10000, 'bank');
}
