/*
 * Leitner scheduling unit tests — no browser, no DOM.
 * Drives flashcards.js through module.exports.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const fc = require(path.join(root, 'flashcards.js'));

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 0, 1, 9, 0, 0);
const BANK = [{ id: 'a-1' }, { id: 'a-2' }, { id: 'a-3' }];

test('a fresh bank queues every card and schedules nothing', () => {
  const store = fc.memoryStore();
  const state = fc.read(store);
  assert.deepEqual(fc.queue(BANK, state, NOW), ['a-1', 'a-2', 'a-3']);
  const s = fc.stats(BANK, state, NOW);
  assert.equal(s.seen, 0);
  assert.equal(s.fresh, 3);
});

test('know promotes one box and pushes the due date out by the interval', () => {
  const state = {};
  fc.grade(state, 'a-1', 'know', NOW);
  assert.equal(state['a-1'].box, 2);
  assert.equal(state['a-1'].due, NOW + fc.INTERVALS[1] * DAY);
  assert.equal(state['a-1'].reps, 1);
});

test('know never climbs past the last box', () => {
  const state = { 'a-1': { box: 5, due: NOW, reps: 9, lapses: 0 } };
  fc.grade(state, 'a-1', 'know', NOW);
  assert.equal(state['a-1'].box, fc.MAX_BOX);
  assert.equal(state['a-1'].due, NOW + fc.INTERVALS[fc.MAX_BOX - 1] * DAY);
});

test('again drops the card to box 1 and makes it due at once', () => {
  const state = { 'a-2': { box: 4, due: NOW, reps: 3, lapses: 1 } };
  fc.grade(state, 'a-2', 'again', NOW);
  assert.equal(state['a-2'].box, 1);
  assert.equal(state['a-2'].due, NOW);
  assert.equal(state['a-2'].lapses, 2);
});

test('queue holds back future cards, orders due by box, then adds new ones', () => {
  const state = {
    'a-1': { box: 3, due: NOW - 1000, reps: 2, lapses: 0 },
    'a-2': { box: 1, due: NOW - 500, reps: 0, lapses: 1 },
    'a-3': { box: 2, due: NOW + 5 * DAY, reps: 1, lapses: 0 }
  };
  assert.deepEqual(fc.queue(BANK, state, NOW), ['a-2', 'a-1']);
  const more = BANK.concat([{ id: 'a-4' }]);
  assert.deepEqual(fc.queue(more, state, NOW), ['a-2', 'a-1', 'a-4']);
});

test('state survives a store round trip and sanitises bad values', () => {
  const store = fc.memoryStore();
  const state = {};
  fc.grade(state, 'a-1', 'know', NOW);
  fc.write(store, state);
  assert.deepEqual(fc.read(store), state);

  store.setItem(fc.KEY, JSON.stringify({
    ok: { box: '2', due: '123', reps: '1', lapses: '0' },
    high: { box: 99, due: 1 },
    low: { box: -4, due: 1 },
    junk: 'nope'
  }));
  const read = fc.read(store);
  assert.equal(read.ok.box, 2);
  assert.equal(read.high.box, fc.MAX_BOX);
  assert.equal(read.low.box, 1);
  assert.equal(read.junk, undefined);
});

test('corrupt JSON reads as empty and clear wipes the key', () => {
  const store = fc.memoryStore();
  store.setItem(fc.KEY, '{not json');
  assert.deepEqual(fc.read(store), {});
  store.setItem(fc.KEY, '{}');
  fc.clear(store);
  assert.equal(store.getItem(fc.KEY), null);
});

test('stats splits due, fresh and learned', () => {
  const state = {
    'a-1': { box: 5, due: NOW - 1, reps: 4, lapses: 0 },
    'a-2': { box: 2, due: NOW + DAY, reps: 1, lapses: 0 }
  };
  const s = fc.stats(BANK, state, NOW);
  assert.deepEqual(s, { total: 3, seen: 2, due: 1, fresh: 1, learned: 1 });
});

test('a blocked localStorage still yields a working in-memory store', () => {
  const blocked = {
    getItem() { throw new Error('blocked'); },
    setItem() { throw new Error('blocked'); },
    removeItem() { throw new Error('blocked'); }
  };
  const store = fc.pickStore(blocked);
  assert.doesNotThrow(() => store.setItem('x', '1'));
  assert.equal(store.getItem('x'), '1');
});
