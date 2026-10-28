/*
 * Flashcard mode in headless Chromium: flip, Again/Know, persistence,
 * reset and keyboard use. Skips without a Chrome binary.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { launch, openApp, skip, sleep } from './helpers/browser.mjs';

const KEY = 'ppl.flashcards.v1';

async function startCards(cdp) {
  await cdp.evaluate('document.getElementById("start-cards").click()');
  await sleep(60);
}

test('flashcards: flip, grade, persist, reset, keyboard, quiz intact', { skip, timeout: 240000 }, async (t) => {
  const { cdp, cleanup } = await launch();
  t.after(cleanup);
  await openApp(cdp);
  await cdp.evaluate(`localStorage.removeItem('${KEY}')`);
  await cdp.evaluate('location.reload()');
  await sleep(400);
  await openApp(cdp);

  await t.test('the start screen offers flashcards and reports empty progress', async () => {
    const state = await cdp.evaluate(`(() => ({
      button: !!document.getElementById('start-cards'),
      summary: document.getElementById('cards-summary').textContent,
      resetHidden: document.getElementById('reset-cards').hidden
    }))()`);
    assert.equal(state.button, true);
    assert.match(state.summary, /No flashcard progress yet/);
    assert.equal(state.resetHidden, true);
  });

  await t.test('a card shows the question and hides the answer until flipped', async () => {
    await startCards(cdp);
    const state = await cdp.evaluate(`(() => ({
      visible: !document.getElementById('screen-cards').hidden,
      startHidden: document.getElementById('screen-start').hidden,
      question: document.getElementById('card-q').textContent,
      backHidden: document.getElementById('card-back').hidden,
      againDisabled: document.getElementById('card-again').disabled,
      knowDisabled: document.getElementById('card-know').disabled,
      expanded: document.getElementById('card-flip').getAttribute('aria-expanded'),
      subject: document.getElementById('card-subject').textContent,
      left: document.getElementById('cards-box').textContent
    }))()`);
    assert.equal(state.visible, true);
    assert.equal(state.startHidden, true);
    assert.ok(state.question.length > 10);
    assert.equal(state.backHidden, true);
    assert.equal(state.againDisabled, true, 'grading is locked until the card is flipped');
    assert.equal(state.knowDisabled, true);
    assert.equal(state.expanded, 'false');
    assert.ok(state.subject.length > 2);
    assert.match(state.left, /^90 left$/);
  });

  await t.test('Space flips and reveals the correct answer with its explanation', async () => {
    await cdp.evaluate(`document.getElementById('card-flip').blur()`);
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
    await sleep(60);

    const bank = await cdp.evaluate('window.QUESTION_BANK');
    const question = await cdp.evaluate('document.getElementById("card-q").textContent');
    const item = bank.find((q) => q.question === question);

    const state = await cdp.evaluate(`(() => ({
      backHidden: document.getElementById('card-back').hidden,
      expanded: document.getElementById('card-flip').getAttribute('aria-expanded'),
      answer: document.getElementById('card-a').textContent,
      explain: document.getElementById('card-explain').textContent,
      knowDisabled: document.getElementById('card-know').disabled
    }))()`);
    assert.equal(state.backHidden, false);
    assert.equal(state.expanded, 'true');
    assert.equal(state.answer, item.options[item.answer]);
    assert.ok(state.explain.length > 10);
    assert.equal(state.knowDisabled, false, 'grading unlocks after the flip');
  });

  await t.test('pressing 2 (know) stores progress and serves the next card', async () => {
    const before = await cdp.evaluate('document.getElementById("card-q").textContent');
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: '2', code: 'Digit2', windowsVirtualKeyCode: 50, text: '2' });
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: '2', code: 'Digit2', windowsVirtualKeyCode: 50 });
    await sleep(80);

    const after = await cdp.evaluate('document.getElementById("card-q").textContent');
    assert.notEqual(after, before, 'a new card is shown');
    const state = await cdp.evaluate(`(() => {
      const raw = JSON.parse(localStorage.getItem('${KEY}') || '{}');
      const ids = Object.keys(raw);
      return { ids, box: raw[ids[0]] && raw[ids[0]].box, stored: ids.length };
    })()`);
    assert.equal(state.stored, 1, 'exactly one graded card is persisted');
    assert.equal(state.box, 2);
  });

  await t.test('pressing 1 (again) keeps the card in this session at box 1', async () => {
    const question = await cdp.evaluate('document.getElementById("card-q").textContent');
    await cdp.evaluate('document.getElementById("card-flip").click()');
    await cdp.evaluate('document.getElementById("card-flip").blur()');
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: '1', code: 'Digit1', windowsVirtualKeyCode: 49, text: '1' });
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: '1', code: 'Digit1', windowsVirtualKeyCode: 49 });
    await sleep(80);

    const state = await cdp.evaluate(`(() => {
      const raw = JSON.parse(localStorage.getItem('${KEY}') || '{}');
      const card = Object.keys(raw).map((id) => raw[id]).find((c) => c.lapses > 0);
      return { lapsed: !!card, box: card && card.box, left: document.getElementById('cards-box').textContent };
    })()`);
    assert.equal(state.lapsed, true);
    assert.equal(state.box, 1);
    // one card graded away, one pushed back: 89 left again
    assert.match(state.left, /^89 left$/);
    assert.ok(question.length > 0);
  });

  await t.test('grading is locked again on the new card until it is flipped', async () => {
    const state = await cdp.evaluate(`(() => ({
      backHidden: document.getElementById('card-back').hidden,
      againDisabled: document.getElementById('card-again').disabled,
      focusIsCard: document.activeElement === document.getElementById('card-flip')
    }))()`);
    assert.equal(state.backHidden, true);
    assert.equal(state.againDisabled, true);
    assert.equal(state.focusIsCard, true, 'focus returns to the card');
  });

  await t.test('progress survives a reload', async () => {
    await cdp.evaluate('location.reload()');
    await sleep(400);
    await openApp(cdp);
    const summary = await cdp.evaluate('document.getElementById("cards-summary").textContent');
    assert.match(summary, /2 not seen|due now/);
    assert.match(summary, /1 not seen|due now/);
    assert.equal(await cdp.evaluate('document.getElementById("reset-cards").hidden'), false);
  });

  await t.test('reset clears the store and every card is offered again', async () => {
    await cdp.evaluate('document.getElementById("reset-cards").click()');
    const state = await cdp.evaluate(`(() => ({
      summary: document.getElementById('cards-summary').textContent,
      resetHidden: document.getElementById('reset-cards').hidden,
      raw: localStorage.getItem('${KEY}'),
      status: document.getElementById('cards-status').textContent
    }))()`);
    assert.match(state.summary, /No flashcard progress yet/);
    assert.equal(state.resetHidden, true);
    assert.equal(state.raw, null);
    assert.match(state.status, /cleared/i);

    await startCards(cdp);
    assert.match(await cdp.evaluate('document.getElementById("cards-box").textContent'), /^90 left$/);
    await cdp.evaluate('document.getElementById("card-back-btn").click()');
  });

  await t.test('Escape leaves the card screen', async () => {
    await startCards(cdp);
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await sleep(60);
    const state = await cdp.evaluate(`(() => ({
      cardsHidden: document.getElementById('screen-cards').hidden,
      startVisible: !document.getElementById('screen-start').hidden
    }))()`);
    assert.equal(state.cardsHidden, true);
    assert.equal(state.startVisible, true);
  });

  await t.test('the quiz still runs with the same options and scoring', async () => {
    await cdp.evaluate('document.getElementById("start-btn").click()');
    await sleep(60);
    const state = await cdp.evaluate(`(() => ({
      quizVisible: !document.getElementById('screen-quiz').hidden,
      options: document.querySelectorAll('.opt').length,
      progress: document.getElementById('progress-text').textContent
    }))()`);
    assert.equal(state.quizVisible, true);
    assert.equal(state.options, 4);
    assert.match(state.progress, /^Question 1 of \d+$/);

    await cdp.evaluate(`document.querySelector('.opt[data-index="0"]').click()`);
    assert.match(await cdp.evaluate('document.getElementById("verdict").textContent'), /Correct|Incorrect/);
  });

  await t.test('no horizontal scroll on a 320px card view', async () => {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 320, height: 780, deviceScaleFactor: 1, mobile: true });
    await cdp.evaluate('document.getElementById("quit-btn").click()');
    await startCards(cdp);
    await sleep(120);
    const overflow = await cdp.evaluate(`({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth
    })`);
    assert.ok(overflow.scroll <= overflow.client + 1, `overflow: ${overflow.scroll} > ${overflow.client}`);
    await cdp.send('Emulation.clearDeviceMetricsOverride');
  });

  await t.test('no console or runtime errors', () => {
    assert.deepEqual(cdp.errors, []);
  });

  cdp.close();
});
