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
    again2: document.getElementById('again-btn-2')
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

  /* ---------------- wiring ---------------- */

  buildSubjects();
  el.form.addEventListener('submit', startRound);
  el.all.addEventListener('click', function () { setAllChips(true); });
  el.none.addEventListener('click', function () { setAllChips(false); });
  el.next.addEventListener('click', next);
  el.quit.addEventListener('click', endEarly);
  el.again.addEventListener('click', reset);
  el.again2.addEventListener('click', reset);

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
})();
