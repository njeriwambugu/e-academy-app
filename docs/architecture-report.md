# Architecture Report — Admin / Teacher / Parent

**Status: Tiers A, B and C1 executed. Tier D not done.** See §10 for the outcome and
the evidence. Everything below §10 is the original analysis, kept as written so the
reasoning behind each change stays on record.

Every finding was measured against the code, not estimated.

## Executive summary blah blah blagh

Much of the intended sharing already exists: one canonical `mock-data.js`, a shared
insights engine, shared pager/chart/login-gate/bottom-nav, and shared style sheets.
The remaining problems are concentrated, not diffuse, and three of them are large:

| # | Finding | Size |
|---|---|---|
| 1 | 4 admin UI modules imported but **never called**; `legacy.js` holds live duplicates | 636 lines dead |
| 2 | `admin/styles/main.css` is a **full copy** of the shared stylesheets; admin loads no shared CSS | 5,206 lines |
| 3 | Unused inline SVG constants in `insight-cards.js` | ~37 KB |
| 4 | One entity has three names: `kid` / `student` / `learner` | 517 references |
| 5 | Three different modal mechanisms | 3 dashboards |
| 6 | Small helpers duplicated locally instead of shared | 5 functions |

Findings 1–3 are **deletions**, which is the safest category of change. Finding 4 is
the only one that touches a large number of lines, and it is mechanical.

---

## 1. Duplicated mock datasets

**There are none.** This was checked directly and is worth recording as a negative
result, because it is the thing the brief most expected to find.

`shared/scripts/data/mock-data.js` (2,142 lines) is the single canonical source.
Every dashboard imports from it. A scan for hardcoded data arrays in the three
dashboards returns only two, and neither is domain data:

| Location | Array | Verdict |
|---|---|---|
| `admin/scripts/legacy.js:113` | `managedModals` | DOM element ids, not data — keep |
| `teacher/scripts/teacher-app.js:93` | `MONTHS` | date labels — candidate for `shared/constants` |

Two derived projections exist and are correct: `kids` (parent shape) and
`studentRows` (admin shape) are both computed *from* `students` inside
`mock-data.js`, so they cannot drift.

The one caveat: `admin/scripts/legacy.js:53-57` takes **mutable working copies**
(`initialClasses.map(...)`) because admin's UI edits records. That is deliberate and
must be preserved — admin is the only dashboard that writes.

---

## 2. Duplicated functions

### 2a. The big one — dead admin modules

`admin/scripts/legacy.js` imports seven `init*UI` factories. **Only three are ever
called.**

```
initBulkImportUI        called (legacy.js:1281)
initBulkImportParseUI   called (legacy.js:1233)
initBulkImportActions   called (legacy.js:1252)

initDashboardUI         imported, NEVER CALLED
initClassDetailUI       imported, NEVER CALLED
initStudentProfileUI    imported, NEVER CALLED
initTeachersUI          imported, NEVER CALLED
```

The four uncalled modules total **636 lines**, and `legacy.js` contains its own live
copy of every function inside them:

| Function | Dead copy | Live copy |
|---|---|---|
| `renderTabs`, `renderCards`, `getVisibleClasses`, `updateStats` | `ui/dashboard.js` | `legacy.js` |
| `renderDetailTable`, `renderStudentSummary`, `getVisibleTeachers`, `getVisibleStudents` | `ui/class-detail.js` | `legacy.js` |
| `renderProfile`, `renderPerformanceChart`, `renderSubjectKey`, `renderAssignmentSummary`, `getBestSubject`, `getAssignmentValue` | `ui/student-profile.js` | `legacy.js` |
| `renderTeachersTable`, `openTeacherManagementEditModal`, `openDeleteTeacherModal` | `ui/teachers.js` | `legacy.js` |

Diffing the two copies shows only whitespace and line-wrapping differences — they
have not drifted in behaviour. This is a half-finished extraction: the modules were
written but never wired up.

**Two options, and they are opposite.** This is the one decision I need from you
(see §7).

### 2b. Genuinely shared already — no action

These look duplicated by name but are thin local wrappers over shared code, differing
only in selectors. Leave them:

- `syncBottomNav` / `addNavRipple` (parent + teacher) → both delegate to
  `shared/scripts/ui/bottom-navigation.js`
- `teacher/scripts/data/student-profile.js` → already a 3-line re-export of
  `shared/scripts/domain/student-profile.js`
- `createPager` → genuinely shared, used at 6 call sites across teacher and parent

### 2c. Small helpers defined locally that belong in shared

| Function | Current location | Target |
|---|---|---|
| `formatDate` | `teacher/scripts/teacher-app.js:98` | `shared/utils/date.js` |
| `initials` | `teacher/scripts/teacher-app.js:107` | `shared/utils/string-utils.js` |
| `dateOnly` | `parent/scripts/app.js:855` | `shared/utils/date.js` |
| `firstName` | `mock-data.js:1419` | merge with below |
| `firstNameOf` | `domain/student-profile.js:20` | `shared/utils/string-utils.js` |

The last two are the same function under two names in the shared tree itself.

### 2d. `setBreadcrumb` — looks duplicated, is not

Three definitions with **three different signatures**:

```js
parent/scripts/app.js:225     setBreadcrumb(name, label)
teacher/scripts/teacher-app.js:1334  setBreadcrumb(trail)      // array
admin/scripts/legacy.js:200   setBreadcrumb(items)             // array, different shape
```

Unifying these means changing every call site in all three dashboards. **High risk,
low reward — recommend leaving alone.**

---

## 3. Inconsistent variable names

One entity, three names. Counts are whole-word matches across `.js`:

| Term | admin | teacher | parent | shared |
|---|---|---|---|---|
| `student` / `students` | 248 | 95 | 2 | 171 |
| `kid` / `kids` | 0 | 0 | **196** | 26 |
| `learner` / `learners` | 0 | 11 | 8 | 48 |

Plus `KIDS` (16, parent) and `kidById` (7, parent).

The split is clean: **admin and teacher say `student`, parent says `kid`, and
user-facing copy says "learner"** (all the insight card text). The shared tree mixes
all three.

Recommendation: `student` for code identifiers (it already dominates, and matches the
data model's `students` array), "learner" for **display copy only**. Renaming parent's
`kid` → `student` touches ~196 references in one file.

Note `kids` is also an exported symbol of `mock-data.js` and a distinct *shape*, not
just a different name for the same object. Renaming it means renaming the export and
its consumers.

---

## 4. Inconsistent DOM IDs

**Casing is already consistent** — camelCase across all three dashboards
(admin 146/147, teacher 108/108, parent 134/134). The single exception is one
lowercase `search` id in admin.

The real inconsistency is **prefixing**:

| Dashboard | Prefixed ids | Unprefixed |
|---|---|---|
| parent | 77 (`parent*`) | 51 |
| teacher | 59 (`teacher*`) | 30 |
| admin | 30 (`teacher*`/`student*`) | **103** |

Teacher and parent namespace their ids; admin mostly does not. Since each dashboard
is a separate page, this causes no collisions today — it is a consistency issue only.

**Recommendation: do not rename DOM ids.** Every id is coupled to
`getElementById`/`querySelector` calls and to CSS selectors. The churn is large and
the benefit is cosmetic. This is the change most likely to silently break behaviour.

---

## 5. Components that can be shared

| Component | Now | Proposal |
|---|---|---|
| **Modal control** | 3 mechanisms: admin passes `managedModals` to the global; parent calls `window.Modals?.open()`; teacher has its own `openModal`/`closeModal` in `ui/modals.js` | `shared/scripts/modal.js` has **zero exports** — it attaches to `window`. Convert to a real ES module and have all three import it |
| **Status badge** | `active ? "Active" : "Pending"` inline at 8 sites across admin, teacher | `shared/ui/status-badge.js` |
| **Assignment status** | `shared/constants/assignment-status.js` exists but only teacher imports it | adopt in admin + parent |
| **Empty state / table** | `emptyState`, `emptyTable` in `admin/utils/ui.js` only | move to `shared/ui/` |
| **Icon set** | `iconChart`, `iconEdit`, `iconTrash`, `iconDelete` in `admin/utils/ui.js`; insight icons in `shared/ui/insight-cards.js` | one `shared/ui/icons.js` |
| **Pagination** | shared `createPager`, used by teacher + parent | admin has **no pagination at all** — that is a missing feature, not duplication. Out of scope |

### Dead code in `shared/scripts/ui/insight-cards.js`

Four large inline SVG constants are defined and never referenced:
`GRAPH_ICON_SVG`, `CLOCK_ICON_SVG`, `CHECKMARK_ICON_SVG`, `EDUCATION_ICON_SVG` —
**37,720 bytes**. The file is 128 lines, nearly all of it these strings. Safe deletion.

---

## 6. CSS: admin is fully duplicated

```
admin/index.html   -> styles/main.css                                    ONLY
teacher/index.html -> shared base + components + utilities + tmain + responsive
parent/index.html  -> shared base + components + utilities + pmain + pskeleton + responsive
```

`admin/styles/main.css` declares **209 classes. All 209 exist in the shared sheets.**
Sampled rules (`.app`, `.tab`, `.modal`) are byte-identical after whitespace
normalisation. The shared sheets were extracted from admin's stylesheet and admin was
never switched over.

This is the single largest duplication in the project (5,206 lines), but also the
highest-risk to change: admin's sheet is a superset, and CSS cascade order matters.

---

## 7. Proposed folder structure

Deliberately close to what exists — the current layout is sound:

```
shared/scripts/
  constants/     academic.js  assignment-status.js  storage.js  calendar.js(new)
  data/          mock-data.js  insights-engine.js  mock-data.invariants.js
  domain/        student-profile.js  performance.js(new)
  ui/            insight-cards.js  performance-chart.js  login-gate.js
                 bottom-navigation.js  modal.js(moved)  icons.js(new)
                 status-badge.js(new)  empty-state.js(new)
  utils/         collections.js  dom.js  duration.js  id-gen.js  string-utils.js
                 table-utils.js  timing.js  ui-state.js  date.js(new)

admin/scripts/   app.js  router.js  state.js  storage.js
  ui/            dashboard.js  class-detail.js  student-profile.js  teachers.js
                 bulk-import*.js
teacher/scripts/ teacher-app.js  ui/  data/
parent/scripts/  app.js
```

---

## 8. Planned changes, in risk order

### Tier A — deletions, zero behaviour change (recommended, do first)

| # | Change | Risk |
|---|---|---|
| A1 | Delete the 4 unused SVG constants in `insight-cards.js` (37 KB) | none — unreferenced |
| A2 | Resolve the dead admin modules (see decision below) | none if deleted |
| A3 | Remove the unused `initDashboardUI`/`initClassDetailUI`/`initStudentProfileUI`/`initTeachersUI` imports from `legacy.js` | none |

### Tier B — pure moves, mechanical

| # | Change | Risk |
|---|---|---|
| B1 | `formatDate`, `dateOnly` → `shared/utils/date.js` | low |
| B2 | `initials` → `shared/utils/string-utils.js`; merge `firstName`/`firstNameOf` | low |
| B3 | `MONTHS` → `shared/constants/calendar.js` | low |
| B4 | `emptyState`, `emptyTable`, icon helpers → `shared/ui/` | low — admin-only consumers today |

### Tier C — behaviour-preserving but touches live paths

| # | Change | Risk |
|---|---|---|
| C1 | Convert `shared/scripts/modal.js` from `window.Modals` global to an ES module; migrate all three | **medium** — parent uses optional chaining `window.Modals?.`, implying it tolerates absence. Must verify load order |
| C2 | Extract status badge to `shared/ui/status-badge.js`, adopt at 8 sites | medium |
| C3 | Adopt `assignment-status.js` constants in admin + parent | medium |

### Tier D — large, mechanical, cosmetic benefit only

| # | Change | Risk |
|---|---|---|
| D1 | Rename parent `kid` → `student` (~196 refs, plus the `kids` export) | **high churn**, low reward |
| D2 | Switch admin to the shared stylesheets, delete `main.css` | **high** — cascade order, 5,206 lines |

### Not recommended

- **Renaming DOM ids** — coupled to JS selectors *and* CSS; pure churn, real breakage risk.
- **Unifying `setBreadcrumb`** — three genuinely different contracts.
- **Adding pagination to admin** — a feature, not a refactor; out of scope.

---

## The one decision I need

**The four dead admin modules cut two opposite ways:**

**Option 1 — delete them (636 lines).** `legacy.js` stays the single admin
implementation. Honest about what actually runs. But it abandons the extraction work
and leaves `legacy.js` at 1,459 lines.

**Option 2 — wire them up, delete legacy's copies.** Completes the extraction and
shrinks `legacy.js` substantially. But it swaps live code for code **that has never
executed** — the modules take `elements` and callback parameters that no one has ever
passed. Every admin screen would need re-verification by hand.

I recommend **Option 1 now, Option 2 later as its own deliberate task**, because the
brief says preserve every existing behaviour, and Option 2 cannot guarantee that
without a manual pass over every admin screen.

---

## 9. How I will verify nothing changes

The mock-data layer has 19 invariants (`node shared/scripts/data/mock-data.invariants.js`)
which will run before and after every tier.

For UI behaviour, which has no test coverage, I will capture a before/after snapshot:

1. **Import graph** — every module still resolves, no new cycles.
2. **Public surface diff** — exported symbols per module, before vs after.
3. **DOM contract** — every `id` referenced by JS still exists in the HTML, and every
   `id` in the HTML is still reachable. This is the check that catches accidental
   breakage in Tier C/D.
4. **Event listener census** — count and target of every `addEventListener` per
   dashboard, before vs after.
5. **Rendered output** — for a fixed learner, dump the HTML each render function
   produces before and after, and diff.

Tier D2 (CSS) additionally needs a visual check, since no automated diff covers cascade
order.

---

## Recommendation

Proceed with **Tier A and Tier B** — they are deletions and pure moves, they remove
~700 lines of dead code plus 37 KB of dead assets, and they carry essentially no risk.

Then decide on Tier C, which is where the real consistency win is (the modal
mechanism), but which touches live event wiring.

Hold Tier D unless you specifically want it; both items are large, and neither changes
what a user sees.

---

## 10. Outcome

### Executed

**Tier A — deletions**
- Removed 4 unused inline SVG constants from `shared/scripts/ui/insight-cards.js`
  (`GRAPH_ICON_SVG`, `CLOCK_ICON_SVG`, `CHECKMARK_ICON_SVG`, `EDUCATION_ICON_SVG`) —
  37,728 bytes.
- Deleted `admin/scripts/ui/dashboard.js`, `class-detail.js`, `student-profile.js`
  and `teachers.js` (636 lines) and their never-called imports from `legacy.js`.
  Chose deletion over wiring them up, per §"The one decision".

**Tier B — shared helpers**
- New `shared/scripts/utils/date.js` — `formatDate`, `dateOnly`,
  `MONTH_ABBREVIATIONS`. Teacher and parent both import it.
- `initials` and `firstName` added to `shared/scripts/utils/string-utils.js`.
- Merged `firstName` (mock-data) and `firstNameOf` (domain/student-profile) into one
  helper. The two differed only for null input, where the domain copy returned the
  literal string `"undefined"`; the surviving version is the safer one.

**Tier C1 — one modal engine**
- `shared/scripts/modal.js` converted from an IIFE attaching `window.Modals` into a
  real ES module with named exports (`window.Modals` kept as a compatibility shim).
- All 3 dashboards' `<script src=".../modal.js">` became `type="module"`. Load order
  is unchanged: module scripts execute in document order after parsing, so modal.js
  still evaluates before each app entry point.
- Migrated every consumer off the global: admin (`Modals.configure`), parent
  (8 call sites), login-gate (3), teacher's `ui/modals.js`.
- Deleted teacher's fallback `openModal`/`closeModal` pair. They existed only for
  "if the shared engine hasn't loaded yet", which an import makes impossible.

**Bug found while validating the harness — fixed**

`renderReport()` in `parent/scripts/app.js` referenced `#profileChartTitle`,
`#profileChart` and `#subjectKey`, none of which exist in any HTML file. The first
of them threw a `TypeError` on every call. Because `renderReport()` is called at the
end of the parent boot sequence, everything after it was silently skipped:
`renderLicenses`, `bindLicenses`, `bindKidSearch`, `updateBellBadge`,
`syncBottomNav` and the skeleton clear.

The chart markup was removed from `index.html` while the calls stayed behind. The
calls are now guarded and extracted into `renderReportChart()` — no appearance
change, since the current markup renders no chart either way, and the wiring stays
ready for the markup returning.

### Not executed

- **Tier D1** (rename parent `kid` → `student`) — large churn, no user-visible effect.
- **Tier D2** (switch admin to the shared stylesheets) — 5,206 lines, cascade-order risk.
- Renaming DOM ids, unifying `setBreadcrumb`, adding pagination to admin — all
  argued against in §8.

### Evidence

Static contract diff, before vs after (`snapshot.mjs`):

```
js modules        39 -> 36     (4 deleted, 1 added)
unresolved imports 0 ->  0
DOM ids ref'd     325 -> 325   none added, none removed
DOM ids missing    12 ->  12   not worsened
event listeners   156 -> 145
```

The listener drop is **entirely** from the two deleted dead modules —
`ui/dashboard.js` (−4) and `ui/teachers.js` (−7). Their init functions were never
called, so those listeners never attached at runtime. Every other file is unchanged.
No live listener was lost.

Real-browser smoke test against WAMP (Playwright/Chromium), all three dashboards
loaded and signed in:

```
admin    window.Modals [close,closeAll,configure,open,showTransient]   0 JS errors
teacher  window.Modals [close,closeAll,configure,open,showTransient]   0 JS errors
parent   window.Modals [close,closeAll,configure,open,showTransient]   0 JS errors
```

Admin logs 3 × 404 for `students.gif`, `teachers.gif`, `subjects.gif` — missing image
assets referenced from static markup, pre-existing and unrelated.

Parent boot now completes past the point that used to throw:

```
bottomNavIndex  "1"      syncBottomNav ran
bellBadgeText   "9+"     updateBellBadge ran
skeletonCleared true     the skeleton timeout ran
reports view    75.00% / Creative Arts and Sports / 5 assignment rows, 0 page errors
```

`node shared/scripts/data/mock-data.invariants.js` — all 19 hold, before and after.

---

## 11. Tier D outcome

### D1 — `kid` → `student` rename: DONE

Scope was fully contained: `.kid-*` CSS existed only in `parent/styles/`, and
admin/teacher had zero `kid` references. Four files plus the `mock-data.js`
export.

**User-facing copy was deliberately left alone.** `"Swipe to see all your kids"`
is visible text and six `aria-label="Kids overview"`-style labels are read by
screen readers. A parent portal saying "your kids" is correct copy, not an
inconsistency, so the rename covers identifiers, CSS classes, DOM ids and data
attributes only.

Two defects were caught during execution and fixed:

1. **Protecting HTML text nodes (`>...<`) must not be applied to JavaScript.**
   Arrow functions and comparisons contain `>` and `<`, so the pattern silently
   shielded real code — `kidById(n.kidId)` survived the rename. Protection is now
   attribute-only for `.js`. Interpolations inside protected copy
   (`aria-label="Edit ${kid.name}"`) also needed renaming, or they throw
   `ReferenceError`.

2. **`.student-avatar`, `.student-card`, `.student-card-grid`, `.student-chip`
   and `.student-name` already exist in the shared stylesheets** for admin and
   teacher. Parent loads those, so the renamed cards inherited foreign rules —
   the avatar image rendered at 75.94px instead of 79.11px. Parent's cards are a
   different component, so they are now namespaced `parent-student-*`, which also
   matches parent's existing `parent*` id convention.

`parentStudents` is the export name: `students` would collide with mock-data's
own canonical `students` array, and the parent projection is genuinely a distinct
shape.

### D2 — admin onto the shared stylesheets: REVERTED

**`admin/styles/main.css` is a fork, not a duplicate.** All 209 of its classes
exist in the shared sheets, which is what made it look like duplication — but the
rules behind those names have diverged. Swapping admin onto the shared bundle
changed **88.75% of pixels** (37% of them by more than 32 levels): the sidebar
disappears, stat tiles become gradient pills, and class cards restyle entirely.

Only 17 rules are genuinely admin-only (the `.view.loading` skeleton and its two
keyframes); the rest resolve to shared rules with extended selector lists. But
the shared bundle also carries 617 rules admin never had, and those are what
restyle the page.

Consolidating this is a **design decision requiring sign-off**, not a refactor,
and it directly contradicts "do not change the appearance". Reverted; admin still
loads `main.css`, with a comment at the link explaining why.

### Verification

Pixel-compared against a pre-D1 build served in parallel at `/eab`, so both were
captured under identical conditions:

```
parent  current vs pre-D1 build   0 pixels differ
teacher current vs baseline       0 pixels differ
admin   after D2 revert           0 pixels differ
```

`node shared/scripts/data/mock-data.invariants.js` — all 19 hold.
Browser smoke test — admin/teacher/parent all load, sign in, 0 JS errors
(admin's 3 console entries are pre-existing 404s for missing `.gif` assets).

Two residual diffs in the multi-page screenshot suite were shown to be capture
nondeterminism, not regressions: teacher's is absent when captured on its own
(0 pixels), and parent's 0.10% is byte-identical to the same measurement taken on
the pre-D1 control build.
