import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const { SUBJECTS, QUESTION_BANK } = require(path.join(root, 'questions.js'));

/* Nine TCAA PPL(A) knowledge areas, Civil Aviation (Personnel Licensing)
 * Regulations 2017, reg. 42(1). Fixed list, fixed order. */
const TCAA_SUBJECTS = [
  'Air Law',
  'Aircraft General Knowledge',
  'Flight Performance, Planning and Loading',
  'Human Performance',
  'Meteorology',
  'Navigation',
  'Operational Procedures',
  'Radiotelephony',
  'Principles of Flight'
];

const FINAL_TOTAL = 90;
const PER_SUBJECT = 10;
const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)+$/;

test('SUBJECTS exposes exactly the nine TCAA subjects, in order', () => {
  assert.equal(SUBJECTS.length, 9);
  assert.deepEqual(SUBJECTS, TCAA_SUBJECTS);
  assert.equal(new Set(SUBJECTS).size, 9, 'subjects must be unique');
});

test('QUESTION_BANK is an array', () => {
  assert.ok(Array.isArray(QUESTION_BANK));
});

test('question count is the final 90, ten in each of the nine subjects', () => {
  assert.equal(QUESTION_BANK.length, FINAL_TOTAL, `expected ${FINAL_TOTAL} questions`);
  TCAA_SUBJECTS.forEach((subject) => {
    const n = QUESTION_BANK.filter((q) => q.subject === subject).length;
    assert.equal(n, PER_SUBJECT, `${subject}: expected ${PER_SUBJECT} questions, got ${n}`);
  });
  const placeholders = QUESTION_BANK.filter((q) => q.placeholder === true);
  assert.equal(placeholders.length, 0, 'the full bank carries no placeholder items');
});

test('every question matches the schema', () => {
  QUESTION_BANK.forEach((q, i) => {
    const where = `bank[${i}] ${String(q && q.id)}`;
    assert.equal(typeof q, 'object', where);
    assert.equal(typeof q.id, 'string', `${where}: id must be a string`);
    assert.match(q.id, ID_RE, `${where}: id must be kebab-case`);
    assert.equal(typeof q.subject, 'string', `${where}: subject must be a string`);
    assert.ok(SUBJECTS.includes(q.subject), `${where}: unknown subject "${q.subject}"`);
    assert.equal(typeof q.question, 'string', `${where}: question must be a string`);
    assert.ok(q.question.trim().length > 10, `${where}: question too short`);
    assert.ok(Array.isArray(q.options), `${where}: options must be an array`);
    assert.equal(q.options.length, 4, `${where}: exactly 4 options required`);
    q.options.forEach((o, j) => {
      assert.equal(typeof o, 'string', `${where}: option ${j} must be a string`);
      assert.ok(o.trim().length > 0, `${where}: option ${j} is empty`);
    });
    assert.equal(new Set(q.options.map((o) => o.trim())).size, 4, `${where}: options must be distinct`);
    assert.equal(typeof q.answer, 'number', `${where}: answer must be a number`);
    assert.ok(Number.isInteger(q.answer), `${where}: answer must be an integer`);
    assert.ok(q.answer >= 0 && q.answer <= 3, `${where}: answer must be 0-3, got ${q.answer}`);
    assert.equal(typeof q.explanation, 'string', `${where}: explanation must be a string`);
    assert.ok(q.explanation.trim().length > 10, `${where}: explanation too short`);
    assert.equal(typeof q.source, 'string', `${where}: source must be a string`);
    assert.ok(q.source.trim().length > 3, `${where}: source too short`);
    if ('placeholder' in q) assert.equal(typeof q.placeholder, 'boolean', `${where}: placeholder must be boolean`);
  });
});

test('question ids are unique', () => {
  const ids = QUESTION_BANK.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length, `duplicate ids: ${ids.filter((id, i) => ids.indexOf(id) !== i)}`);
});

test('placeholder questions are visibly marked', () => {
  QUESTION_BANK.filter((q) => q.placeholder === true).forEach((q) => {
    assert.match(q.question, /^\[PLACEHOLDER\]/, `${q.id}: placeholder text must start with [PLACEHOLDER]`);
  });
});

test('answers are not clustered on one option index', () => {
  assert.ok(new Set(QUESTION_BANK.map((q) => q.answer)).size > 1, 'answers should vary across 0-3');
});

test('index.html wires the plain-file assets and no network URLs', () => {
  const html = readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /<script src="questions\.js"><\/script>/);
  assert.match(html, /<script src="flashcards\.js"><\/script>/);
  assert.match(html, /<script src="app\.js"><\/script>/);
  assert.match(html, /<link rel="stylesheet" href="styles\.css">/);
  assert.doesNotMatch(html, /https?:\/\/[^"']+\.(js|css)/, 'no remote assets');
  assert.match(html, /name="viewport"/, 'mobile viewport meta required');
  ['10', '25', 'all'].forEach((v) => {
    assert.match(html, new RegExp(`name="count" value="${v}"`), `count option ${v} missing`);
  });
});

test('app.js builds the subject selector from the bank subjects', () => {
  const app = readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.match(app, /window\.SUBJECTS/);
  assert.match(app, /subjects\.forEach/);
  assert.doesNotMatch(app, /\bfetch\(/, 'must stay file:// safe');
});
