# ESOMA Academy — unified app (admin + teacher + parent)

One folder holding all three front-end portals for the ESOMA Academy school
system. Plain HTML/CSS/ES-modules — **no build step**. Serve over HTTP
(WAMP from `c:\wamp64\www\`, or Live Server); ES modules do not work from
`file://`.

- Admin portal: `admin/index.html`
- Teacher portal: `teacher/index.html`
- Parent portal: `parent/index.html`

Each role is launched independently — there is no shared login/landing page.

## One shared layer, three independent UIs

All three portals read from **one single data file** so that wiring up a
real backend later means changing one file, not three diverging copies:

- `shared/scripts/data/mock-data.js` is that one file — teachers, classes,
  subjects, students, and per-subject scores, plus every row/object shape
  each portal's UI needs derived from those same records right in this file
  (admin's table rows, parent's kid cards/reports). There is no per-app data
  file anywhere else in this folder — admin, teacher, and parent all import
  directly from here. Every student a parent, teacher, or admin sees is the
  *same* record, so nothing can drift out of sync between portals.
  Presentation-only constants that have no canonical equivalent (filters,
  themes, avatar art, notification copy, plan/license countdowns) live in
  their own clearly-marked section of this same file, since they belong to
  one role's UI only.
- `shared/scripts/modal.js` is the one modal engine all three portals load
  (a classic global script, not an ES module — loaded first in every
  `index.html` so `window.Modals` exists before the role's own entry script
  runs).
- `shared/scripts/utils/` holds generic, dependency-free helpers used by more
  than one portal: `table-utils.js` (pagination), `ui-state.js` (button
  loading state), `string-utils.js` (`escapeHTML`, `normalizeName`,
  `titleCaseSubject`).

Routing/state, page rendering, and CSS are **not** shared — each role
genuinely shows different views, so those stay independent per portal:

```text
e-academy-app-v1/
  shared/
    scripts/
      data/mock-data.js     # canonical store
      modal.js                # shared modal engine
      utils/                   # table-utils.js, ui-state.js, string-utils.js
  admin/
    index.html, assets/, styles/
    scripts/                  # app.js, router.js, state.js, storage.js,
                                # legacy.js, ui/*, utils/ui.js, components/
  teacher/
    index.html, assets/, styles/
    scripts/                  # teacher-app.js, data/student-profile.js, ui/*
  parent/
    index.html, assets/, styles/
    scripts/                  # app.js
```

## Running

1. Start WAMP with this project folder under `c:\wamp64\www\`.
2. Open whichever portal you need:
   - `http://localhost/e-academy-admin-main/e-academy-app-v1/admin/`
   - `http://localhost/e-academy-admin-main/e-academy-app-v1/teacher/`
   - `http://localhost/e-academy-admin-main/e-academy-app-v1/parent/`

This folder was consolidated from three previously-separate app folders
(root admin, `e-academy-teacher-main/`, `e-academy-parent-v1/`), which are
left untouched alongside it for reference.
# e-academy-app
