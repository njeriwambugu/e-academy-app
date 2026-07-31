# Insights logic

Every insight the parent portal shows and the exact rule behind it.

The engine is `shared/scripts/data/insights-engine.js`. It is **rule-based and
deterministic** — no AI, no randomness, no free-form text. Every number traces to
a mark a learner actually received, and every sentence is a template filled from
those numbers. The same learner on the same period always produces the same
cards.

Rendering lives in `shared/scripts/ui/insight-cards.js`, which only maps an
insight `type` to an icon and draws the grid. It owns no logic.

---

## 1. The inputs

Everything folds over **assignment marks**. See the data-model section of the
[README](../README.md) for how a mark is produced.

```js
calculateInsightCards(studentId, period)
```

`period` carries `{ label, start, end }`. The engine forces
`{ source: "assignments" }` onto it, so subject averages always come from
individual marks inside the window — never from a stored per-subject figure.

**Only marked work counts.** `categorizeAssignment()` puts every assignment in one
of five buckets; two of them carry a mark:

| bucket | marked? | in averages? |
|---|---|---|
| `done` | yes | yes |
| `retake` | yes | yes |
| `ongoing` | no | no |
| `pending` | no | no |
| `overdue` | no | no |

A subject with no marked work yet is **absent** from the insights, not zero.

### Period windows

Built in `parent/scripts/app.js` (`insightPeriodRange`), anchored to the learner's
latest real activity rather than the wall clock, so a data snapshot from an
earlier school month still produces a sensible "this month".

| Option | Window |
|---|---|
| Month | the calendar month of the latest activity |
| Term | a 4-month block (Jan–Apr, May–Aug, Sep–Dec) |
| Year | the calendar year |

**Default is Term.** A single month can leave a learner with a handful of marks
across two subjects, and the hero card is a headline percentage — it should not be
computed from five data points.

---

## 2. Thresholds

All bands live in `shared/scripts/constants/academic.js`. Nothing else may define
a grading cutoff.

```js
PERFORMANCE_THRESHOLDS = { outstanding: 95, excellent: 85, onTrack: 70, urgentSupport: 50 }
COMPLETION_THRESHOLDS  = { excellent: 90, onTrack: 70 }
```

| Helper | Rule |
|---|---|
| `performanceTone(avg)` | `≥85` → `good`, `≥70` → `info`, else `focus` |
| `needsUrgentSupport(avg)` | `< 50` |

`outstanding` and `excellent` are deliberately separate. `outstanding` (95) gates
only the "Excellent" hero card, which is meant to be rare. `excellent` (85) drives
the green tone band on every card in all three portals, so moving one must not
move the other — a 90% average is still presented as `good`, it just is not
*called* excellent.

Tone drives the card's colour and icon tint: `good` (green), `info` (blue),
`focus` (amber), `attention` (red).

---

## 3. The cards

Cards are emitted in this order. Several are **conditional** — the panel shows
only what is true for that learner, so a parent never sees an empty state or a
duplicated signal.

### 3.1 Hero — `overall`

Always present. Two variants:

| Condition | Title | Tone |
|---|---|---|
| average **≥ 95** | `Excellent This {Period}` | `good` |
| otherwise | `Performance This {Period}` | `performanceTone(avg)` |

> **Reachability.** The highest overall average anywhere in the current dataset is
> **84**, across all learners and all three periods. The Excellent variant
> therefore never renders with this data — and it did not render at the previous
> `> 85` cutoff either. The branch is correct and will fire the moment a learner
> reaches 95; it is the mock data that has no top-band learner. Raise a learner's
> per-subject ability in `subjectStudentScores` if you need to see the card.

```
stat = round(mean of each subject's mean mark in the window)
```

**Each subject counts equally**, regardless of how many assignments back it. This
is deliberate: a report card averages subject grades equally, and Maths having 17
assignments should not make it count eight times more than Social Studies with 2.
Do not "fix" this by weighting — it would make the Overview and Insights tabs
disagree by construction and break an invariant.

The title names its window because the Overview tab carries an all-time
"Performance Average". They measure different things, and titling this one
"Overall Performance" read as a contradiction rather than a different question.

### 3.2 Best Learning Area — `best-subject`

Present when there is at least one subject. Highest subject mean in the window.

```
tone = average ≥ 70 ? "good" : "focus"
```

Scoped in its wording to the period's marked work, for the same reason as the
hero: the Overview tab's "Strongest Learning Area" is an all-time standing.

### 3.3 Focus area — `focus-subject`

Present when the learner takes **more than one** subject. Always shows the
lowest-scoring area — "which area needs the most practice" is useful even for a
learner doing well everywhere — but a healthy score is never called "weakest":

| Band | Title | Tone |
|---|---|---|
| `< 50` | `{Subject} Needs Attention` | `attention` |
| `50–69` | `Focus Learning Area` | `focus` |
| `≥ 70` | `Most Room to Grow` | `info` |

At 70+ the copy says outright that nothing here is a weak area and this is simply
the lowest of a strong set.

The card also names **the weakest strand inside that subject**, so a parent knows
what to actually practise rather than only which subject to worry about.

### 3.4 Performance Momentum — `momentum`

Present unless there is not enough history (`trend === "no-data"`, i.e. fewer than
two marked assignments).

`calculatePerformanceTrend()` takes the last **6** marked assignments in the
window, oldest to newest, splits them in half and compares the means:

```
delta = mean(second half) − mean(first half)

delta >  3   → improving   stat "+N pts"   good
delta < −3   → declining   stat "−N pts"   attention
otherwise    → stable      stat "Steady"   info
```

The ±3 dead band stops normal variation reading as a trend.

**Icon and artwork match the message**, so the three states read as one family:

| State | `type` | Icon | Artwork |
|---|---|---|---|
| improving | `monthlyImprovement` | trend line rising | `monthlyImprovement.webp` |
| declining | `performanceDecline` | trend line falling | `performanceDecline.webp` |
| steady | `performanceStable` | trend line **level** | `performanceMomentum.webp` |

The steady state previously used a sparkles icon and had **no artwork rule at
all** — so a learner holding steady got a blank card face and a symbol that said
"something nice happened", which is not what a flat result means.

### 3.5 Pending Assignments — `pending`

Present only when `pending > 0`. Work not yet started whose deadline has **not**
passed.

```
tone = pending ≥ 3 ? "attention" : "focus"
```

### 3.6 Retake Assignments — `retake`

Present only when `retake > 0`. Always `attention`. This is the single retake
signal — absent when there are none, so parents never see an empty action.

### 3.7 Learning Consistency — `streak`

Present when the longest streak is at least 1 day. The longest run of
**consecutive calendar days** on which the learner engaged with any assignment,
computed from real assignment dates in the window.

---

## 4. Pending vs overdue

Whether a learner submitted is hash-seeded — nothing in the dataset records real
submissions. But once work is **not** submitted, whether it is `pending` or
`overdue` is purely a deadline question, so that split reads the assignment's
stored `due` date against `MOCK_TODAY`:

```js
notSubmitted = isPastDue(assignment) ? "overdue" : "pending"
```

The size of the not-submitted bucket is unchanged by this (still 2 in 10), so
every average, completion rate and engagement figure built on the other buckets is
untouched.

Due dates vary per assignment (2–12 days, seeded from the assignment id) rather
than a flat +7. A flat window on this dataset's deploy range would put every
deadline in the future and leave nothing ever overdue.

---

## 5. Other engine outputs

`calculateInsightCards()` is what the parent portal renders. The engine also
exposes narrative forms used elsewhere or available for future surfaces:

| Function | Returns |
|---|---|
| `generateInsights(studentId)` | severity-tagged `{ type, title, message, priority }` list |
| `generateRecommendations(studentId)` | IF/THEN actions — extra practice, clear pending work, action retakes, rebalance study time |
| `buildPerformanceReport(studentId)` | the full structured report: summary, strengths, needsAttention, progress, assignments, consistency, subjects, strands, insights, recommendations |

**Note the difference in scope.** These three call `calculateSubjectAverages()`
*without* a period, which routes to the all-time subject breakdown. Only
`calculateInsightCards()` forces `source: "assignments"`. That is intentional —
they answer "how is this learner doing overall", not "what happened this term".

`calculateMonthlyImprovement()` is the one figure derived from a formula rather
than stored data: the dataset carries no month-by-month history, so a 6-month
series is interpolated deterministically from the learner's real current average,
seeded per student. It is stable and explainable, not randomised per render, and
mirrors the modelling `mock-data.js` already uses for the class-level
"Performance Overview for the Last 6 Months" chart.

---

## 6. Not included, on purpose

**Attendance.** No attendance data exists in the dataset. Inventing a figure would
break the "real data only" rule, so there is no attendance card.

**Overdue.** Overdue work is computed and counted, but has no card of its own. If
you want one, it belongs beside the pending card and should follow the same
conditional pattern (absent when zero).

---

## 7. Adding a card

1. Compute the number in `insights-engine.js` from assignment records. Never read
   `subjectStudentScores` directly — that is generator input.
2. Push a `card(id, type, title, description, stat, tone)`. Make it conditional if
   an empty version would be meaningless.
3. Map `type` → an icon in `insight-cards.js`. Match the existing convention:
   `viewBox="0 0 24 24"`, `stroke="currentColor"`, round caps — the badge sets
   `color` per tone and a full-colour icon will ignore it.
4. Optionally add a motion class in `ICON_ANIMATION_CLASS`.
5. Run `node shared/scripts/data/mock-data.invariants.js`.

Take thresholds from `constants/academic.js`. Do not introduce a new cutoff
without adding it there.
