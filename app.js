/* PPL(A) Practice — plain-file quiz runner. No dependencies, no network. */
(function () {
  'use strict';

  var bank = window.QUESTION_BANK || [];
  var subjects = window.SUBJECTS || [];

  var el = {
    start: document.getElementById('screen-start'),
    quiz: document.getElementById('screen-quiz'),
    results: document.getElementById('screen-results'),
    form: document.getElementById('start-form'),
    chips: document.getElementById('subject-chips'),
    all: document.getElementById('select-all'),
    none: document.getElementById('select-none'),
    shuffle: document.getElementById('shuffle'),
    error: document.getElementById('start-error'),
    progressText: document.getElementById('progress-text'),
    scoreText: document.getElementById('score-text'),
    progressFill: document.getElementById('progress-fill'),
    qSubject: document.getElementById('q-subject'),
    qText: document.getElementById('q-text'),
    options: document.getElementById('options'),
    feedback: document.getElementById('feedback'),
    verdict: document.getElementById('verdict'),
    explain: document.getElementById('explain'),
    source: document.getElementById('source'),
    next: document.getElementById('next-btn'),
    quit: document.getElementById('quit-btn'),
    resScore: document.getElementById('res-score'),
    resLine: document.getElementById('res-line'),
    review: document.getElementById('review'),
    reviewHeading: document.getElementById('review-h'),
    again: document.getElementById('again-btn'),
    again2: document.getElementById('again-btn-2'),
    cards: document.getElementById('screen-cards'),
    cardsSummary: document.getElementById('cards-summary'),
    startCards: document.getElementById('start-cards'),
    resetCards: document.getElementById('reset-cards'),
    cardsProgress: document.getElementById('cards-progress'),
    cardsLeft: document.getElementById('cards-box'),
    cardsFill: document.getElementById('cards-fill'),
    cardsStatus: document.getElementById('cards-status'),
    cardSubject: document.getElementById('card-subject'),
    cardFlip: document.getElementById('card-flip'),
    cardFront: document.getElementById('card-front'),
    cardBack: document.getElementById('card-back'),
    cardQ: document.getElementById('card-q'),
    cardA: document.getElementById('card-a'),
    cardExplain: document.getElementById('card-explain'),
    cardSource: document.getElementById('card-source'),
    cardAgain: document.getElementById('card-again'),
    cardKnow: document.getElementById('card-know'),
    cardBackBtn: document.getElementById('card-back-btn')
  };

  var round = [];
  var index = 0;
  var score = 0;
  var wrong = [];
  var answered = false;

  /* ---------------- start screen ---------------- */

  function buildSubjects() {
    subjects.forEach(function (name) {
      var label = document.createElement('label');
      label.className = 'chip';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.name = 'subject';
      input.value = name;
      input.checked = true;
      var span = document.createElement('span');
      span.textContent = name;
      label.appendChild(input);
      label.appendChild(span);
      el.chips.appendChild(label);
    });
  }

  function setAllChips(checked) {
    var boxes = el.chips.querySelectorAll('input');
    for (var i = 0; i < boxes.length; i += 1) boxes[i].checked = checked;
  }

  function chosenSubjects() {
    var out = [];
    var boxes = el.chips.querySelectorAll('input:checked');
    for (var i = 0; i < boxes.length; i += 1) out.push(boxes[i].value);
    return out;
  }

  function shuffle(list) {
    for (var i = list.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = list[i];
      list[i] = list[j];
      list[j] = tmp;
    }
    return list;
  }

  function fail(message) {
    el.error.textContent = message;
    el.error.hidden = false;
  }

  function startRound(event) {
    event.preventDefault();
    el.error.hidden = true;

    var picked = chosenSubjects();
    if (!picked.length) {
      fail('Pick at least one subject to practise.');
      return;
    }

    var pool = bank.filter(function (q) {
      return picked.indexOf(q.subject) !== -1;
    });

    if (!pool.length) {
      fail('The selected subjects have no questions yet — try another subject.');
      return;
    }

    var mode = document.querySelector('input[name="count"]:checked');
    var wanted = mode && mode.value !== 'all' ? parseInt(mode.value, 10) : pool.length;

    pool = el.shuffle.checked ? shuffle(pool) : pool.slice();
    round = pool.slice(0, wanted);
    index = 0;
    score = 0;
    wrong = [];

    el.start.hidden = true;
    el.results.hidden = true;
    el.quiz.hidden = false;
    render();
  }

  /* ---------------- quiz ---------------- */

  function render() {
    var q = round[index];
    if (!q) {
      showResults();
      return;
    }
    answered = false;

    el.progressText.textContent = 'Question ' + (index + 1) + ' of ' + round.length;
    el.scoreText.textContent = 'Score ' + score;
    el.progressFill.style.width = ((index / round.length) * 100).toFixed(1) + '%';

    el.qSubject.textContent = q.subject;
    el.qText.textContent = q.question;

    el.options.textContent = '';
    q.options.forEach(function (text, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opt';
      btn.dataset.index = String(i);

      var letter = document.createElement('span');
      letter.className = 'letter';
      letter.setAttribute('aria-hidden', 'true');
      letter.textContent = String.fromCharCode(65 + i);

      var body = document.createElement('span');
      body.className = 'text';
      body.textContent = text;

      btn.appendChild(letter);
      btn.appendChild(body);
      btn.addEventListener('click', function () { answer(i); });
      el.options.appendChild(btn);
    });

    el.feedback.hidden = true;
    el.verdict.textContent = '';
    el.explain.textContent = '';
    el.source.textContent = '';
    el.next.hidden = true;
    el.next.textContent = index === round.length - 1 ? 'See results' : 'Next question';

    el.qText.setAttribute('tabindex', '-1');
    el.qText.focus({ preventScroll: false });
    window.scrollTo(0, 0);
  }

  function answer(picked) {
    if (answered) return;
    answered = true;

    var q = round[index];
    var correct = picked === q.answer;
    var buttons = el.options.querySelectorAll('.opt');

    for (var i = 0; i < buttons.length; i += 1) {
      var btn = buttons[i];
      var at = Number(btn.dataset.index);
      btn.disabled = true;
      var letter = btn.querySelector('.letter');
      if (at === q.answer) {
        btn.dataset.state = 'correct';
        letter.textContent = '✓';
      } else if (at === picked) {
        btn.dataset.state = 'wrong';
        letter.textContent = '✗';
      } else {
        btn.dataset.state = 'muted';
      }
    }

    if (correct) {
      score += 1;
      el.verdict.textContent = 'Correct';
      el.verdict.className = 'verdict is-good';
    } else {
      wrong.push({ q: q, picked: picked });
      el.verdict.textContent = 'Incorrect — correct answer is ' + String.fromCharCode(65 + q.answer);
      el.verdict.className = 'verdict is-bad';
    }

    el.explain.textContent = q.explanation;
    el.source.textContent = q.source;
    el.feedback.hidden = false;
    el.scoreText.textContent = 'Score ' + score;
    el.progressFill.style.width = (((index + 1) / round.length) * 100).toFixed(1) + '%';
    el.next.hidden = false;
    el.next.focus();
  }

  function next() {
    index += 1;
    if (index >= round.length) showResults();
    else render();
  }

  /* ---------------- results ---------------- */

  function endEarly() {
    round = round.slice(0, index + 1);
    showResults();
  }

  function showResults() {
    el.quiz.hidden = true;
    el.results.hidden = false;

    var total = round.length;
    var pct = total ? Math.round((score / total) * 100) : 0;
    el.resScore.textContent = score + ' / ' + total + '  (' + pct + '%)';

    var line;
    if (!total) line = 'No questions answered.';
    else if (pct === 100) line = 'Clean sheet. Move the same standard up a gear.';
    else if (pct >= 75) line = 'Above the 75% pass mark — rehearse the misses below.';
    else line = 'Below the 75% pass mark — read every explanation, then run it again.';
    el.resLine.textContent = line;
    el.resScore.dataset.pass = total ? (pct >= 75 ? 'yes' : 'no') : 'none';

    el.review.textContent = '';
    if (!wrong.length) {
      var none = document.createElement('p');
      none.className = 'lede';
      none.textContent = 'Nothing to review — no incorrect answers.';
      el.review.appendChild(none);
      el.again2.hidden = true;
      el.reviewHeading.textContent = 'Review incorrect answers';
    } else {
      el.reviewHeading.textContent = 'Review ' + wrong.length + ' incorrect answer' + (wrong.length === 1 ? '' : 's');
      wrong.forEach(function (item) {
        var wrap = document.createElement('div');
        wrap.className = 'review-item';

        var qp = document.createElement('p');
        qp.className = 'review-q';
        qp.textContent = item.q.question;

        var bad = document.createElement('p');
        bad.className = 'review-row is-bad';
        bad.innerHTML = '<span class="lbl">You: </span>';
        bad.appendChild(document.createTextNode(item.q.options[item.picked]));

        var good = document.createElement('p');
        good.className = 'review-row is-good';
        good.innerHTML = '<span class="lbl">Correct: </span>';
        good.appendChild(document.createTextNode(item.q.options[item.q.answer]));

        var exp = document.createElement('p');
        exp.className = 'review-exp';
        exp.textContent = item.q.explanation;

        wrap.appendChild(qp);
        wrap.appendChild(bad);
        wrap.appendChild(good);
        wrap.appendChild(exp);
        el.review.appendChild(wrap);
      });
      el.again2.hidden = wrong.length < 2;
    }

    el.results.querySelector('h1').setAttribute('tabindex', '-1');
    el.results.querySelector('h1').focus();
    window.scrollTo(0, 0);
  }

  function reset() {
    round = [];
    index = 0;
    score = 0;
    wrong = [];
    answered = false;
    el.quiz.hidden = true;
    el.results.hidden = true;
    el.start.hidden = false;
    el.error.hidden = true;
    window.scrollTo(0, 0);
    document.getElementById('start-h').focus();
  }

  /* ---------------- flashcards ---------------- */

  var fc = window.FLASHCARDS;
  var fcStore = fc.pickStore(window.localStorage);
  var cardState = fc.read(fcStore);
  var cardQueue = [];
  var cardRounds = 0;
  var cardDone = 0;
  var cardFlipped = false;
  var cardCurrent = null;

  function renderCardSummary() {
    var s = fc.stats(bank, cardState, Date.now());
    var text;
    if (!s.seen) text = 'No flashcard progress yet — every card starts in box 1.';
    else {
      text = s.due + ' due now · ' + s.fresh + ' not seen · ' + s.learned + ' in boxes 4–5';
      if (!s.due && !s.fresh) text += ' · nothing due, come back later or reset';
    }
    el.cardsSummary.textContent = text;
    el.resetCards.hidden = !s.seen;
  }

  function cardStatus(message) {
    el.cardsStatus.textContent = message;
  }

  function paintCardProgress() {
    el.cardsProgress.textContent = 'Card ' + (cardDone + 1);
    el.cardsLeft.textContent = cardQueue.length + ' left';
    var pct = cardRounds ? Math.min(100, (cardDone / cardRounds) * 100) : 0;
    el.cardsFill.style.width = pct.toFixed(1) + '%';
  }

  function startCards() {
    cardQueue = fc.queue(bank, cardState, Date.now());
    if (!cardQueue.length) {
      renderCardSummary();
      cardStatus('Nothing is due right now. Reset progress to run every card again.');
      return;
    }
    cardRounds = cardQueue.length;
    cardDone = 0;
    cardCurrent = null;
    el.start.hidden = true;
    el.quiz.hidden = true;
    el.results.hidden = true;
    el.cards.hidden = false;
    window.scrollTo(0, 0);
    showCard();
  }

  function showCard() {
    var id = cardQueue[0];
    var q = bank.filter(function (item) { return item.id === id; })[0];
    if (!q) { cardQueue.shift(); if (cardQueue.length) showCard(); else finishCards(); return; }

    cardCurrent = q;
    cardFlipped = false;

    el.cardSubject.textContent = q.subject;
    el.cardQ.textContent = q.question;
    el.cardA.textContent = q.options[q.answer];
    el.cardExplain.textContent = q.explanation;
    el.cardSource.textContent = q.source;

    el.cardFront.hidden = false;
    el.cardBack.hidden = true;
    el.cardFlip.setAttribute('aria-expanded', 'false');
    el.cardAgain.disabled = true;
    el.cardKnow.disabled = true;
    paintCardProgress();
    cardStatus('Question. Press Space or click the card to flip.');
    el.cardFlip.focus();
  }

  function flipCard() {
    if (!cardCurrent || cardFlipped) return;
    cardFlipped = true;
    el.cardFront.hidden = true;
    el.cardBack.hidden = false;
    el.cardFlip.setAttribute('aria-expanded', 'true');
    el.cardAgain.disabled = false;
    el.cardKnow.disabled = false;
    cardStatus('Answer shown. Press 1 for again or 2 for know.');
  }

  function gradeCard(result) {
    if (!cardCurrent || !cardFlipped) return;
    var id = cardCurrent.id;
    fc.grade(cardState, id, result, Date.now());
    fc.write(fcStore, cardState);

    cardQueue.shift();
    cardDone += 1;
    var box = cardState[id].box;

    if (result === 'again') {
      cardQueue.push(id);
      cardRounds += 1;
      cardStatus('Again — this card returns in this session, back in box 1.');
    } else {
      var days = fc.INTERVALS[box - 1];
      cardStatus('Know — now in box ' + box + '. It comes back in ' + days + ' day' + (days === 1 ? '' : 's') + '.');
    }
    cardCurrent = null;
    renderCardSummary();

    if (cardQueue.length) showCard();
    else finishCards();
  }

  function finishCards() {
    var graded = cardDone;
    el.cards.hidden = true;
    el.start.hidden = false;
    el.cardsFill.style.width = '100%';
    renderCardSummary();
    el.cardsSummary.textContent += ' · last session: ' + graded + ' card' + (graded === 1 ? '' : 's') + ' graded';
    document.getElementById('cards-h').setAttribute('tabindex', '-1');
    document.getElementById('cards-h').focus();
  }

  function leaveCards() {
    cardQueue = [];
    cardCurrent = null;
    el.cards.hidden = true;
    el.start.hidden = false;
    renderCardSummary();
    window.scrollTo(0, 0);
    document.getElementById('start-h').focus();
  }

  function resetCards() {
    fc.clear(fcStore);
    cardState = {};
    cardQueue = [];
    cardCurrent = null;
    renderCardSummary();
    cardStatus('Flashcard progress cleared. All 90 cards are back in box 1.');
  }

  /* ---------------- wiring ---------------- */

  buildSubjects();
  el.form.addEventListener('submit', startRound);
  el.all.addEventListener('click', function () { setAllChips(true); });
  el.none.addEventListener('click', function () { setAllChips(false); });
  el.next.addEventListener('click', next);
  el.quit.addEventListener('click', endEarly);
  el.again.addEventListener('click', reset);
  el.again2.addEventListener('click', reset);

  renderCardSummary();
  el.startCards.addEventListener('click', startCards);
  el.resetCards.addEventListener('click', resetCards);
  el.cardFlip.addEventListener('click', flipCard);
  el.cardAgain.addEventListener('click', function () { gradeCard('again'); });
  el.cardKnow.addEventListener('click', function () { gradeCard('know'); });
  el.cardBackBtn.addEventListener('click', leaveCards);

  /* arrows / number keys answer, Enter advances */
  document.addEventListener('keydown', function (e) {
    if (el.quiz.hidden) return;
    if (e.target && e.target.tagName === 'BUTTON' && e.key === 'Enter') return;
    var n = parseInt(e.key, 10);
    if (!answered && n >= 1 && n <= 4) {
      var btn = el.options.querySelector('.opt[data-index="' + (n - 1) + '"]');
      if (btn) { btn.click(); e.preventDefault(); }
    }
  });

  /* flashcards: Space flips, 1 again, 2 know, Esc leaves */
  document.addEventListener('keydown', function (e) {
    if (el.cards.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); leaveCards(); return; }
    if (e.key === ' ' || e.key === 'Spacebar') {
      if (e.target === el.cardFlip) return; /* the button's own click handles it */
      e.preventDefault();
      flipCard();
      return;
    }
    if (e.key === 'Enter' && e.target === el.cardFlip) return;
    if (e.key === '1' && cardFlipped) { e.preventDefault(); gradeCard('again'); }
    if (e.key === '2' && cardFlipped) { e.preventDefault(); gradeCard('know'); }
  });
})();
