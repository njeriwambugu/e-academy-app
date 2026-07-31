# ESOMA Academy — unified front end (admin · teacher · parent)

Three school portals in one repository, sharing a single data model and a single
set of calculations while keeping their own independent presentation.

Plain HTML/CSS/ES modules — **no build step, no dependencies**. Serve over HTTP
(WAMP from `c:\wamp64\www\`, or Live Server). ES modules will not load from
`file://`.

| Portal | Entry point |
|---|---|
| Admin | `admin/index.html` |
| Teacher | `teacher/index.html` |
| Parent | `parent/index.html` |

Each role launches independently; there is no shared landing page. The login gate
is a demo — any submission succeeds and the session is remembered in
`localStorage`.

---

## Quick start

```
http://localhost/e-academy-app-v1/parent/index.html
```

After pulling changes, **hard-refresh once** (`Ctrl+Shift+R`). There is no build
step, so the browser caches modules aggressively and a stale module silently
breaks the page it belongs to — most visibly as a login screen that reloads back
to itself.

Check the dataset is coherent after touching anything under `shared/scripts/data/`:

```bash
node shared/scripts/data/mock-data.invariants.js
#   all 19 mock-data invariants hold
```

---

## Architecture

The rule is **one source of truth per fact.** Everything a portal displays is
derived; nothing is stored in two places.

```text
shared/scripts/
  data/
    mock-data.js              canonical dataset — the only data file
    insights-engine.js        all performance calculations
    mock-data.invariants.js   19 assertions about dataset shape (run with node)
  domain/
    student-profile.js        one learner-profile computation, used by all portals
  constants/
    academic.js               grading thresholds
    assignment-status.js      assignment status vocabulary
    storage.js                localStorage keys
  ui/
    insight-cards.js          insight card rendering + icon map
    performance-chart.js      subject vs class-average chart
    login-gate.js             shared demo login
    bottom-navigation.js      mobile nav behaviour
  utils/
    collections.js  date.js  dom.js  duration.js  id-gen.js
    string-utils.js  table-utils.js  timing.js  ui-state.js
  modal.js                    the one modal engine (ES module)
shared/styles/                base · components · utilities · responsive

admin/    index.html  styles/main.css
          scripts/{app,router,state,storage,legacy}.js  scripts/ui/bulk-import*
teacher/  index.html  styles/tmain.css  scripts/teacher-app.js  scripts/{data,ui}/
parent/   index.html  styles/{pmain,pskeleton}.css  scripts/app.js

docs/
  performance-metrics.md      Overview vs Insights — why the two numbers differ
  insights-logic.md           every insight card and the rule behind it
  architecture-report.md      duplication audit + refactor record
```

### What is shared

**Data.** `mock-data.js` is the only dataset — teachers, classes, subjects,
students, per-subject ability, assignments. Every portal imports from it, so the
same learner is the same record everywhere and cannot drift. Presentation-only
constants with no canonical equivalent (filters, themes, avatar art, plan and
licence countdowns) live in their own marked section of the same file.

**Calculations.** `insights-engine.js` and `domain/student-profile.js` own every
derived number. Portals render; they do not compute.

**Primitives.** The modal engine, pager, chart, login gate, bottom navigation and
the `utils/` helpers.

### What is deliberately not shared

Routing, view rendering and CSS. The three roles genuinely show different screens.
Admin additionally keeps its own stylesheet — see the note in `admin/index.html`
and §11 of the architecture report.

---

## The data model

```
subjectStudentScores        a learner's ABILITY per subject   ← generator input only
        │
        ▼
getStudentAssignmentScore   ability ± seeded variance         → a mark, or null
        │
   ┌────┴──────────────────┬───────────────────────────┐
   ▼                       ▼                           ▼
getStudentSubjectAverage  getStudentAssignmentRecords  buildClassData
   │                       │                           │
   ▼                       ▼                           ▼
Overview tab            Insights tab            teacher / admin views
```

**The assignment mark is the atom.** Every reported figure — subject averages,
completion, streaks, best and weakest area, class averages — folds over marks.
`subjectStudentScores` is the input the generator varies around; only
`subjectAbility()` may read it directly.

This matters because the Overview tab used to report the stored ability while the
Insights tab reported a jittered re-derivation of that same number, so the two
could never reconcile. They now agree exactly when they cover the same subjects
over the same span. See [docs/performance-metrics.md](docs/performance-metrics.md).

### Rules that keep it honest

Each exists because breaking it caused a real, silent bug.

- **Absence is `null`, never `0`.** `subjectAbility()` returns `0` for an unknown
  subject and `clampAssignmentScore` floors at 35, so a timetabled subject with no
  ability data would report a fabricated ~35%. An invariant fails if that happens.
- **Curriculum and staffing must stay consistent.** `SUBJECT_OFFERING_BY_BAND`
  says what a grade band offers; `teachers[].assignments` says who teaches it. A
  class missing a teacher for a curriculum subject silently truncates that class's
  insights.
- **Seed on the whole tuple.** Per-learner variation is seeded on
  `(subject, student)` or `(student, assignment)` — never one axis alone. Keying
  off a student's array index once gave all 33 learners an identical subject
  ranking.
- **Dates must span real history.** Assignments deploy across eight weeks with
  per-assignment due windows. When everything sat inside one 7-day window nothing
  could ever be overdue and Month/Term/Year filtered identical data.
- **Mind the layering.** Reported figures fold over marks, so categorisation runs
  during the eager class-data build at module load. `MOCK_TODAY` is taken from
  `DEPLOY_ANCHOR` rather than scanned from built data, and
  `getStudentSubjectAverage` sits above `buildClassData`, its first caller.

---

## Conventions

**Naming.** `student` in code, everywhere. Parent's user-facing copy still says
"kids" — a parent portal addressing a parent naturally does, and that is correct
copy, not an inconsistency.

**CSS.** Parent's private components are namespaced `parent-student-*`. Bare
`.student-card`, `.student-avatar`, `.student-name`, `.student-chip` and
`.student-card-grid` already belong to admin and teacher in the shared
stylesheets; a portal-specific component must not reuse them.

**DOM ids.** camelCase throughout. Teacher and parent prefix theirs (`teacher*`,
`parent*`).

**Modals.** Import the engine, never reach for `window.Modals`:

```js
import { open as openModal, close as closeModal } from "../../shared/scripts/modal.js";
```

The global still exists as a compatibility shim, but an import is guaranteed to
have evaluated before the importing module's body runs — which the global was not.

---

## Verifying a change

There is no test runner. What exists:

| Check | Command | Covers |
|---|---|---|
| Dataset invariants | `node shared/scripts/data/mock-data.invariants.js` | staffing coverage, fabricated scores, determinism, date sanity, naming, referential integrity |
| Manual smoke | open each portal and sign in | JS errors, modal behaviour, navigation |

Run the invariants after **any** change to `mock-data.js`, and especially after
adding a class, teacher or subject — those are the changes that break coverage
silently.

---

## Known gaps

- **Admin has no pagination.** Teacher and parent share `createPager`; admin
  renders full tables.
- **Admin logs 3 console 404s** for `students.gif`, `teachers.gif` and
  `subjects.gif` — referenced from static markup, assets never added.
- **`admin/scripts/legacy.js` is ~1,400 lines.** Four extracted UI modules were
  deleted because they were imported but never called; re-extracting them is a
  deliberate task, not a side effect of tidying imports.
- **Grade 8 and Grade 9 carry off-chart subjects** (`COMP`, `PTECH`, `BIO`) the
  8-code performance chart cannot render, so those learners' Overview and Insights
  figures legitimately cover different subject sets. `BIO`'s low base is
  intentional — read the comment on `makeScores("BIO", 38)` before changing it.
- **Five catalogue subjects have no score data** (`CHEM`, `PHY`, `GEO`, `LIT`,
  `PE`). They are unassigned; timetabling one fails an invariant.
