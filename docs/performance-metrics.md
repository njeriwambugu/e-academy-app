# Performance metrics: Overview vs Insights

The parent Reports screen shows a learner's performance twice, on two tabs. This
document explains what each one measures, how it is computed, and why the numbers
can differ.

If you only read one thing:

> Both tabs now fold over **the same atom — the mark a learner actually got on an
> assignment.** They agree exactly when they cover the same subjects and the same
> span of time. Where they differ, it is because of the **time window** or an
> **off-chart subject**, and nothing else.

---

## 1. Architecture: ability in, marks out

```
subjectStudentScores[subject][student].latestScore      ability — GENERATOR INPUT
        │                                                (never reported directly)
        ▼
getStudentAssignmentScore()          mock-data.js:1483   ability ± seeded jitter
        │                                                → a mark, or null
        ▼
        ├──────────────────────────────┬─────────────────────────────┐
        ▼                              ▼                             ▼
getStudentSubjectAverage()      getStudentAssignmentRecords()   buildClassData()
   mock-data.js:1263                mock-data.js                 mock-data.js:1284
        │                              │                             │
        ▼                              ▼                             ▼
  OVERVIEW tab                   INSIGHTS tab               teacher / admin views
```

`subjectStudentScores` holds a learner's **ability** per subject. It is the value
the assignment generator varies around — it is *not* a reported score, and only
`subjectAbility()` (`mock-data.js:1254`) may read it.

Everything displayed anywhere is derived from the marks those assignments actually
produced. This matters: the Overview used to report the stored ability directly
while Insights reported a noisy re-derivation of that same number, so the two
could never reconcile. Now they are two folds over one dataset.

### Overview tab — "Performance Average", "Strongest Learning Area"

- **Subject list:** the grade band's curriculum (`SUBJECT_OFFERING_BY_BAND`).
  5 learning areas for pre-primary and lower primary, 8 above that.
- **Per subject:** `getStudentSubjectAverage()` — the mean of every assignment the
  learner was marked on, **all-time**.
- **Overall:** unweighted mean of those subject means.
- **Time scope:** all-time. The Insights period selector does not affect this tab.

### Insights tab — "Performance This Term", "Best Learning Area"

- **Subject list:** `subjectIdsForClass()` — subjects a teacher is **recorded as
  teaching** that class.
- **Per subject:** the mean of that subject's marks **inside the selected window**.
- **Overall:** unweighted mean of those subject means.
- **Time scope:** the period selector. **Default is Term** (`app.js:799`).

---

## 2. The three reasons they can still differ

### 2.1 The time window

The dominant one, and entirely by design. Overview is all-time; Insights is
filtered. The gap closes as the window widens, and reaches zero:

```
Timothy Kamau    Overview  75%   (fixed — ignores the selector)

                 Insights  Month  65%
                           Term   74%
                           Year   75%
                           All    75%   ← identical
```

A single month can leave a learner with a handful of marks across two subjects.
That is why the default is **Term**, not Month, and why the card is titled
"Performance This Term" rather than "Overall Performance" — the two figures answer
different questions and should not read as a contradiction.

### 2.2 Off-chart subjects

The Overview reads the **curriculum**; Insights reads **staffing**. Junior
secondary classes are taught real subjects the 8-code chart cannot render:

| class | off-chart subjects |
|---|---|
| Grade 8 South | `COMP`, `PTECH` |
| Grade 9 North | `COMP`, `BIO` |

Insights count them, the Overview cannot, so those learners' two figures cover
different subject sets. **This is the only remaining structural gap**, and it is
deliberate — `BIO`'s ability base is set low on purpose (`makeScores("BIO", 38)`)
so Grade 9's all-subject average visibly falls below its teacher-taught average.

For every class whose staffed subjects match its curriculum, the two tabs produce
the **identical** number, and an invariant enforces it (§5).

### 2.3 Only marked work counts

`categorizeAssignment()` (`mock-data.js`) puts each assignment in one of five
buckets. Only two carry a mark:

| bucket | marked? | counts? |
|---|---|---|
| `done` | yes | yes |
| `retake` | yes | yes |
| `ongoing` / `pending` / `overdue` | no | no |

This applies equally to both tabs, so it does not make them disagree — but it does
mean a subject with no marked work yet is **absent from both**, not zero.

---

## 3. Worked example

Bethany Kamau, Grade 4 North.

**Overview** — mean of marked work per curriculum subject:

```
MAT 84   ENG 58   KIS 59   CAS —   CRE 75   SS 88   SCI 77   AGRI 88
                            ↑ no marked work yet, excluded
mean = 529 / 7 = 75.57  ->  76%
```

**Insights, all-time** — the same fold, from the staffing subject list:

```
SS    88   from  2 marked
AGRI  88   from  3 marked
MAT   84   from 17 marked
SCI   77   from  8 marked
CRE   75   from  6 marked
KIS   59   from  8 marked
ENG   58   from  8 marked
mean = 529 / 7 = 75.57  ->  76%
```

Identical, because Grade 4 North has no off-chart subjects. Narrow the window to
Term and Insights reads 75%; to Month, 70% — that movement is §2.1, not an error.

Note `SS` rests on 2 marked assignments while `MAT` rests on 17.

### A note on weighting

Both figures weight every subject **equally**, regardless of how many assignments
back it. This is deliberate: a report card averages subject grades equally, and
Maths having 17 assignments should not make it count eight times more than Social
Studies with 2. The small-sample noise above is a *window-size* problem, addressed
by defaulting to Term. **Do not "fix" it by weighting subject means by assignment
count** — that would make the two tabs disagree by construction and break the
invariant in §5.

---

## 4. Data model rules

Each of these exists because breaking it caused a real, silent bug.

**Ability is not a score.** Only `subjectAbility()` may read
`subjectStudentScores`. Anything reporting a figure must go through
`getStudentSubjectAverage()` or the assignment records. Reading ability directly is
what made the two tabs irreconcilable.

**Absence is `null`, not `0`.** `getStudentSubjectAverage()` returns `null` when
nothing has been marked. The one exception is
`getStudentPerformanceProfile().scores`, whose consumers already filter on `> 0`
and do arithmetic on the map — the conversion happens at that single boundary and
nowhere else. Note the related hazard: `subjectAbility()` returns `0` for an
unknown subject and `clampAssignmentScore` floors at 35, so a timetabled subject
with no ability entry would report a fabricated ~35%. Five subjects (`CHEM`,
`PHY`, `GEO`, `LIT`, `PE`) have no entries; an invariant fails if any is
timetabled.

**Curriculum and staffing are separate tables and must stay consistent.**
`SUBJECT_OFFERING_BY_BAND` says what a band offers; `teachers[].assignments` says
who teaches it. Adding a class without staffing every curriculum subject silently
truncates that class's insights — this once left Grade 1 North with one staffed
subject out of five.

**Seed on the whole tuple.** Per-learner variation must be seeded on
`(subject, student)` or `(student, assignment)` — never one axis alone. The
generator once keyed off the student's array index, identical in every subject, so
all 33 learners shared one subject ranking.

**Assignment dates must span real history.** `deployedAt()` spreads deployment
across eight weeks; `dueDaysFor()` gives each assignment a 2–12 day window. When
everything sat inside one 7-day window, nothing could ever be overdue and
Month/Term/Year filtered identical data.

**Mind the layering.** Reported figures now fold over marks, so categorisation runs
during the *eager* class-data build at module load. Two consequences:

- `MOCK_TODAY` (`mock-data.js:1183`) is taken from `DEPLOY_ANCHOR`, not scanned
  from the built data — scanning would be circular. An invariant asserts the
  anchor really is the newest deploy date.
- `getStudentSubjectAverage()` and its cache sit **above** `buildClassData()`,
  their first caller, and reach assignments through `assignmentsFor()`
  (`mock-data.js:1230`) rather than `getClassMock()`. A `const` cache declared
  below its first use is in the temporal dead zone and throws at import.

---

## 5. Invariants

```bash
node shared/scripts/data/mock-data.invariants.js
```

19 assertions about the shape of the dataset. Not behaviour tests — they check the
data is coherent, because mock-data failures are silent: nothing crashes, the
numbers just go wrong. Each names the defect it guards against.

The load-bearing one:

> **overview and all-time insights agree where subject sets match** — for every
> learner whose class carries no off-chart subjects, the two tabs must produce the
> identical number.

That is what keeps §1 true. Reverting the derivation so the Overview reads ability
again fails it immediately, naming every affected learner.

The rest cover staffing coverage, fabricated-score sources, seeded determinism,
assignment date sanity, naming consistency, and referential integrity. Every check
has been verified to actually fail when its bug is reintroduced.

Run it after touching `mock-data.js`, and especially after adding a class,
teacher, or subject.

---

## 6. If you need them to agree exactly

They already do, for any class without off-chart subjects, when Insights is set to
Year or All. To close the two remaining gaps:

- **The window** — not a defect. Both tabs name their scope in the UI. Removing it
  would mean deleting the period selector, which is the feature.
- **Off-chart subjects** — either widen the chart beyond its 8 codes to include
  `COMP`, `PTECH` and `BIO`, or stop timetabling them. Note that removing `BIO`
  from Grade 9 would destroy a deliberate teacher-comparison scenario; read the
  comment on `makeScores("BIO", 38)` before touching it.
