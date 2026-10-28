# Prompt log

What was asked for, in order, and what it changed. Kept short so a later reader can see the intent behind the tree without reading a transcript.

```mermaid
sequenceDiagram
  participant U as Requester
  participant A as Agent
  U->>A: public repo, app files only, no history
  A->>A: import tested tree, create repo, push main
  U->>A: flashcards with Leitner, keep quiz, no deps
  A->>A: flashcards.js + card screen + tests
  U->>A: honest limits + study plan
  A->>A: README scope, proof table, DECISIONS
  U->>A: CI with card tests, Pages on main, ready PR
  A->>A: test suite green, pages.yml, PR
```

## 1. "Build the public app release"

> Create a public repo `eminogrande/flugschein-training`, clean initial main from the tested app only.

Result: new repo, one import commit `cfd1164` from the tested tree at `e62eb815`, app and test files only. The private `flugschein` repo stayed private; no research or email files came across, no git history was shared.

Constraint taken from the brief: do not merge, do not deploy to production. Both held.

## 2. "Add a minimal Flashcards mode using the existing 90 questions"

> Card flip, Again/Know, simple localStorage Leitner scheduling, reset, accessible keyboard use. Keep the quiz working; no backend, dependencies or accounts.

Result: `flashcards.js` holds the scheduling as pure functions; `#screen-cards` holds the UI; `app.js` owns the session and the keyboard map. Quiz code untouched. Storage falling over is handled rather than assumed away.

Judgement calls written up in [DECISIONS](DECISIONS.md): separate mode instead of merging into the quiz loop (D4), Leitner over SM-2 (D5), memory fallback (D6).

## 3. "Document honestly"

> 90 questions are enough to start but not enough alone; give a spaced-repetition + subject-quiz + mixed-mock plan; say real TCAA items and pass mark are not verified.

Result: README opens with the limit before the feature list, states that item count, format and pass mark are unverified and that 75 % is a heuristic, then gives the six-day plan with its rules. Limit section repeats it, so a skimmer still meets it.

## 4. "README must be polished" with links, Mermaid and proof

> Top links to CHANGELOG and PROMPTLOG, Mermaid architecture and user-flow charts with `file:line`, file navigation, proof table, version/date/who status. Same Mermaid treatment for DECISIONS, CHANGELOG, PROMPTLOG.

Result: all present. Every `file:line` range was read back from the files after the last edit, not guessed. The proof table names the test that backs each claim so a reader can re-run it.

## 5. "Keep/add cloud CI tests including flashcard behaviour"

Result: `test.yml` kept as-is (all branches, all PRs). Added 9 scheduling unit tests and 12 browser tests; extracted the CDP harness so both browser suites share it. Suite runs in ~7 s locally, all 40 tests green.

## 6. "Pages workflow deploying the static root on main pushes"

Result: `.github/workflows/pages.yml` — `push: branches: [main]` plus dispatch, `pages: write` and `id-token: write`, `_site` staged from the five app files with `.nojekyll`, deploy via `actions/deploy-pages`. Pages source still has to be switched to "GitHub Actions" in repo settings.

## 7. What was deliberately not done

- No merge, no production deploy, no local ZIP.
- No framework, bundler, `npm install`, account, analytics or network call.
- No change to the question bank. Ten per subject is documented as thin rather than topped up with filler.
- No claim that the questions are real exam items.
