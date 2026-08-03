# Backend integration

Where the real API plugs in, and what still needs a decision. Everything below is
front-end state today; nothing talks to a network.

## 1. Seams that already exist

Each of these is a single function whose body can be replaced with a real call.
Everything around it — pending state, success state, failure copy — already works.

| Seam | File | Replace with |
| --- | --- | --- |
| Deploy an assignment | `teacher/scripts/teacher-app.js:903` → `deployAssignmentAPI(payload)` | `POST /api/assignments/deploy` |
| M-Pesa STK push | `parent/scripts/app.js` → `requestMpesaPushAPI(payload)` | `POST /api/payments/mpesa/stk-push` |
| Sign in | `shared/scripts/ui/login-gate.js` → `createLoginGate({ authenticate })` | `POST /api/auth/login` → `{ ok, message?, token? }` |

`authenticate` is optional; when it is not passed every submit is accepted, which
is the current demo behaviour. Returning `{ ok: false, message }` renders the
error inline (`.login-error`), so no markup change is needed per portal.

## 2. Data layer

All read data comes from `shared/scripts/data/mock-data.js`, imported directly by
seven modules. The store is deterministic — every figure derives from the learner
list, teacher assignments and a stable hash, with no `Math.random`.

Two consumers already sit at the right level of abstraction and should be the
template for the API client:

- `shared/scripts/domain/student-profile.js` — one call returns a fully shaped profile.
- `shared/scripts/data/insights-engine.js` — takes ids and a period, not raw rows.

`shared/scripts/data/mock-data.invariants.js` (`node scripts/data/mock-data.invariants.js`
from `shared/`) asserts 19 rules about the shape of that data — subjects are staffed,
scores exist only where work was attempted, averages agree across the two code
paths that compute them. Keep it running against fixtures once the API lands; it
catches the class of bug the UI silently renders.

## 3. What the server has to own

- **Ids.** `shared/scripts/utils/id-gen.js` `maxId(list) + 1` assigns ids client-side
  in the admin add/import flows. The server must return the created record instead.
- **Today's date.** `MOCK_TODAY` is pinned to the newest deploy date so overdue and
  upcoming work both exist in the demo. Real data should use the server clock;
  `isPastDue()` is the only reader.
- **Session.** `localStorage` holds a boolean per portal (`PORTAL_STORAGE_KEYS`).
  No token, no expiry, no refresh. Logout only clears the flag.
- **Mutations.** Admin add/edit/delete for classes, learners and teachers mutate
  local arrays (`admin/scripts/legacy.js` working copies). Each needs a request and
  a re-fetch; counts are already derived, not stored, so a refresh is enough.
- **Pagination.** `createPager` slices in memory. Server-side paging changes the
  pager contract (`total` and page from the response, not from the array).

## 4. Rules the UI relies on

- A class roster is the source of truth for counts: `getClassStudentCount()`, class
  stats, and assignment `completed/total` all count learners, never a stored number.
- A learner's chart shows the subjects **staffed for their class**
  (`getOfferedSubjectCodesForClass`). A subject with no teacher for that class is not
  offered, so no marks appear for it.
- Unknown ids must 404 rather than resolve to something: the teacher routes now send
  the user back with a message instead of opening a profile shell
  (`handleRoute` in `teacher/scripts/teacher-app.js`).
- Profile markup ships with `—` placeholders, not sample names, so an unrendered
  view can never look like real learner data.
