/*
 * Leitner scheduling for the flashcard mode — pure functions, no DOM.
 * ---------------------------------------------------------------------------
 * Five boxes. "Again" drops a card to box 1 and it returns later in the same
 * session; "Know" promotes it one box and pushes the due date out. State lives
 * in localStorage under one key, { id: { box, due, reps, lapses } }.
 *
 * Kept separate from app.js so the scheduling can be tested without a browser.
 */
(function (root) {
  'use strict';

  var KEY = 'ppl.flashcards.v1';
  var MAX_BOX = 5;
  var DAY = 24 * 60 * 60 * 1000;
  /* Days until a card in box n is due again. Box 1 is "later today". */
  var INTERVALS = [0, 1, 3, 7, 16];

  function memoryStore() {
    var data = {};
    return {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null; },
      setItem: function (k, v) { data[k] = String(v); },
      removeItem: function (k) { delete data[k]; }
    };
  }

  /* localStorage can throw (privacy mode, some file:// setups); fall back. */
  function pickStore(candidate) {
    var store = candidate;
    try {
      var probe = '__ppl_probe__';
      store.setItem(probe, '1');
      store.removeItem(probe);
      return store;
    } catch (err) {
      return memoryStore();
    }
  }

  function clampBox(n) {
    var box = Math.round(Number(n));
    if (!isFinite(box) || box < 1) return 1;
    return box > MAX_BOX ? MAX_BOX : box;
  }

  function sanitize(raw) {
    var out = {};
    if (!raw || typeof raw !== 'object') return out;
    Object.keys(raw).forEach(function (id) {
      var card = raw[id];
      if (!card || typeof card !== 'object') return;
      out[id] = {
        box: clampBox(card.box),
        due: Number(card.due) || 0,
        reps: Math.max(0, Math.round(Number(card.reps) || 0)),
        lapses: Math.max(0, Math.round(Number(card.lapses) || 0))
      };
    });
    return out;
  }

  function read(store) {
    try {
      return sanitize(JSON.parse(store.getItem(KEY) || '{}'));
    } catch (err) {
      return {};
    }
  }

  function write(store, state) {
    try {
      store.setItem(KEY, JSON.stringify(state));
    } catch (err) {
      /* quota or blocked storage: the session still works in memory */
    }
  }

  /* Grade one card. Returns the updated state object (same reference). */
  function grade(state, id, result, now) {
    var at = Number(now) || Date.now();
    var card = state[id] || { box: 1, due: at, reps: 0, lapses: 0 };
    if (result === 'know') {
      card.box = clampBox(card.box + 1);
      card.reps += 1;
    } else {
      card.box = 1;
      card.lapses += 1;
    }
    card.due = at + INTERVALS[card.box - 1] * DAY;
    state[id] = card;
    return state;
  }

  /*
   * Order the next session: cards that are due (lowest box first, so the
   * shakiest come round soonest), then never-seen cards. Cards already
   * scheduled into the future stay out.
   */
  function queue(bank, state, now) {
    var at = Number(now) || Date.now();
    var due = [];
    var fresh = [];
    bank.forEach(function (q) {
      var card = state[q.id];
      if (!card) fresh.push(q.id);
      else if (card.due <= at) due.push({ id: q.id, box: card.box });
    });
    due.sort(function (a, b) { return a.box - b.box; });
    return due.map(function (d) { return d.id; }).concat(fresh);
  }

  function stats(bank, state, now) {
    var at = Number(now) || Date.now();
    var seen = 0;
    var due = 0;
    var learned = 0;
    bank.forEach(function (q) {
      var card = state[q.id];
      if (!card) return;
      seen += 1;
      if (card.due <= at) due += 1;
      if (card.box >= 4) learned += 1;
    });
    return { total: bank.length, seen: seen, due: due, fresh: bank.length - seen, learned: learned };
  }

  function clear(store) {
    try { store.removeItem(KEY); } catch (err) { /* nothing to clear */ }
    return {};
  }

  var api = {
    KEY: KEY,
    MAX_BOX: MAX_BOX,
    INTERVALS: INTERVALS,
    memoryStore: memoryStore,
    pickStore: pickStore,
    read: read,
    write: write,
    grade: grade,
    queue: queue,
    stats: stats,
    clear: clear
  };

  root.FLASHCARDS = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
