import { parent, parentStudents as students, avatarThemes, notifications, reports, subjectLabels } from "../../shared/scripts/data/mock-data.js";
import { calculateInsightCards } from "../../shared/scripts/data/insights-engine.js";
import { createPager } from "../../shared/scripts/utils/table-utils.js";
import { buildPerformanceChartSVG, buildSubjectKeyHTML, hasAnyScore, mountPerformancePanel } from "../../shared/scripts/ui/performance-chart.js";
import { renderInsightCards } from "../../shared/scripts/ui/insight-cards.js";
import { createLoginGate } from "../../shared/scripts/ui/login-gate.js";
import { $, $$ } from "../../shared/scripts/utils/dom.js";
import { dateOnly } from "../../shared/scripts/utils/date.js";
import { open as openModal, close as closeModal } from "../../shared/scripts/modal.js";
import { PORTAL_STORAGE_KEYS } from "../../shared/scripts/constants/storage.js";
import { addNavigationRipple, syncBottomNavigation } from "../../shared/scripts/ui/bottom-navigation.js";
import { setButtonLoading } from "../../shared/scripts/utils/ui-state.js";

(function () {
  "use strict";

  /* mock data now comes from the one shared canonical store */

  const MOCK = { parent, students, avatarThemes, notifications, reports };
  const PARENT = MOCK.parent;
  const STUDENTS = MOCK.students;
  const AVATAR_THEMES = MOCK.avatarThemes;

  const DEFAULT_THEME = { c1: "#dbe7ff", c2: "#eef3fb", soft: "#eef3fb", ink: "#26325d", accent: "#5f7bb1" };


  function themeOf(student) {
    return AVATAR_THEMES[student.avatar] || DEFAULT_THEME;
  }

  function themeVars(student) {
    const t = themeOf(student);
    return `--kc1:${t.c1};--kc2:${t.c2};--kc-soft:${t.soft};--kc-ink:${t.ink};--kc-accent:${t.accent}`;
  }

  function licenseTone(daysLeft) {
    if (daysLeft <= 7) return "danger";
    if (daysLeft <= 30) return "warn";
    return "ok";
  }

  function avatarSrc(student) {
    return `assets/avatars/${student.avatar || "0"}-default.png`;
  }

  function avatarHtml(student) {
    return `<span class="parent-student-avatar" style="${themeVars(student)}" aria-hidden="true">
      <img src="${avatarSrc(student)}" alt="" loading="lazy">
    </span>`;
  }

  function renderStats() {//stat tiles
    const activeLicenses = STUDENTS.filter((k) => k.daysLeft > 0).length;
    const pending = STUDENTS.reduce((sum, k) => sum + k.pending, 0);
    const retakes = STUDENTS.reduce((sum, k) => sum + k.retakes, 0);

    $("#parentActiveLicenses").textContent = activeLicenses;
    $("#parentPendingAssignments").textContent = pending;
    $("#parentPendingRetakes").textContent = retakes;
  }

  function chipsHtml(student) {//students card
    return `
      <span class="parent-student-chip done" title="Assignments done"><i class="learner-dot" aria-hidden="true"></i>${student.done}<em class="chip-word">done</em></span>
      <span class="parent-student-chip ongoing" title="Assignments ongoing"><i class="learner-dot" aria-hidden="true"></i>${student.ongoing}<em class="chip-word">ongoing</em></span>
      <span class="parent-student-chip pending" title="Assignments pending"><i class="learner-dot" aria-hidden="true"></i>${student.pending}<em class="chip-word">pending</em></span>
      <span class="parent-student-chip retake" title="Retakes pending"><i class="learner-dot" aria-hidden="true"></i>${student.retakes}<em class="chip-word">retakes</em></span>`;
  }

  function studentCardHtml(student) {
    const tone = licenseTone(student.daysLeft);
    // an expired plan doesn't hide the card, it locks the actions that lead into paid learning content, while Pay stays available every day.
    const locked = student.daysLeft <= 0;

    return `
      <article class="parent-student-card ${locked ? "is-locked" : ""}" style="${themeVars(student)}" data-student="${student.id}" data-avatar="${student.avatar}">
        <span class="parent-student-class-pill">${student.cls}</span>
        <div class="parent-student-name-row">
          <h3 class="parent-student-name${locked ? "" : " parent-student-name-clickable"}"
            ${locked ? "" : `data-student-learn="${student.id}" role="link" tabindex="0"`}>${student.name}</h3>
          <button type="button" class="parent-student-name-edit" data-student-edit="${student.id}" aria-label="Edit ${student.name}'s account" ${locked ? "disabled" : ""}>
            <img src="assets/icons/person-edit.svg" alt="" aria-hidden="true">
          </button>
        </div>
        ${avatarHtml(student)}
        <div class="parent-student-chips" aria-label="Assignment snapshot">${chipsHtml(student)}</div>
        <button type="button" class="parent-student-learn-btn" data-student-learn="${student.id}" ${locked ? "disabled" : ""}>
          <span>Learn</span>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
          </svg>
        </button>
        <span class="parent-student-license ${tone}">${student.plan.toUpperCase()}: ${student.daysLeft} Days Left</span>
        <button type="button" class="pay-btn parent-student-pay-btn" data-student-pay="${student.id}">
          <img src="assets/icons/mpesa.webp" alt="" class="pay-img" aria-hidden="true">
          <span>Pay</span>
        </button>
      </article>`;
  }

  function studentPillHtml(student) {
    return `
      <button type="button" class="parent-student-pill" style="${themeVars(student)}" data-student-manage="${student.id}"
        data-avatar="${student.avatar}" aria-label="Manage ${student.name}'s account">
        ${avatarHtml(student)}
        <span class="parent-student-pill-name">${student.name}</span>
        <i class="pill-leaf pill-leaf-1" aria-hidden="true"></i>
        <i class="pill-leaf pill-leaf-2" aria-hidden="true"></i>
        <i class="pill-leaf pill-leaf-3" aria-hidden="true"></i>
      </button>`;
  }

  function renderStudentGrids(filterText) {
    const dashGrid = $("#parentStudentsGrid");
    const accountsList = $("#parentStudentsAccountsList");
    const noMatch = $("#parentStudentsNoMatch");

    const query = (filterText || "").trim().toLowerCase();
    const dashStudents = query
      ? STUDENTS.filter((k) => k.name.toLowerCase().includes(query))
      : STUDENTS;

    if (dashGrid) dashGrid.innerHTML = dashStudents.map(studentCardHtml).join("");
    if (noMatch) noMatch.hidden = dashStudents.length > 0;
    if (accountsList) accountsList.innerHTML = STUDENTS.map(studentPillHtml).join("");
  }


  const COUNT_CHIP_DOT_TONE = { done: "completed", ongoing: "ongoing", pending: "not-started", retake: "retake" };

  function countCell(value, tone, label) {//summary table
    const zero = !value;
    return `
      <span class="count-chip ${tone}${zero ? " is-zero" : ""}">
        <i class="learner-dot ${COUNT_CHIP_DOT_TONE[tone] || ""}" aria-hidden="true"></i>
        <span class="sr-only">${label}</span>
        <strong class="count-chip-value">${value || 0}</strong>
      </span>`;
  }

  function studentCellMarkup(student) {
    const locked = student.daysLeft <= 0;
    return `
      <span class="parent-student-cell">
        ${avatarHtml(student)}
        <strong class="${locked ? "" : "parent-student-name-clickable"}"
          ${locked ? "" : `data-student-learn="${student.id}" role="link" tabindex="0"`}>${student.name}</strong>
      </span>`;
  }

  const summaryPager = createPager({
    container: "#parentSummaryPagination",
    pageSize: 5,
    onPageChange: () => renderSummaryTable(),
  });

  
  // one table everywhere - mobile keeps Learner/Ongoing/Not Started and drops
  // the Completed and Retakes columns via CSS (see the max-width:880px rule).
  function renderSummaryTable() {
    const body = $("#parentSummaryBody");
    if (!body) return;

    const pageRows = summaryPager.paginate(STUDENTS);

    body.innerHTML = pageRows.map((student) => `
      <tr>
        <td>${studentCellMarkup(student)}</td>
        <td class="col-done">${countCell(student.done, "done", "Completed")}</td>
        <td class="col-ongoing">${countCell(student.ongoing, "ongoing", "Ongoing")}</td>
        <td class="col-pending">${countCell(student.pending, "pending", "Not Started")}</td>
        <td class="col-retake">${countCell(student.retakes, "retake", "Retakes")}</td>
      </tr>`).join("");

    summaryPager.renderControls();
  }

  const VIEWS = {//navigation
    dashboard: $("#parentDashboardView"),
    students: $("#parentStudentsView"),
    reports: $("#parentReportsView"),
    learn: $("#parentLearnView"),
    notifications: $("#parentNotificationsView"),
    manage: $("#parentManageView"),
    profile: $("#parentProfileView"),
    help: $("#parentHelpView"),
    assignment: $("#parentAssignmentView"),
    licenses: $("#parentLicensesView"),
  };

  const CRUMBS = {
    dashboard: "Dashboard",
    students: "Students Accounts",
    reports: "Reports",
    learn: "Learning Page",
    notifications: "Notifications",
    manage: "Manage Account",
    profile: "My Profile",
    help: "Help Desk",
    assignment: "Assignment Details",
    licenses: "Licenses",
  };

  const TRAIL = {
    manage: ["students"],
    learn: ["dashboard"],
    assignment: ["reports"],
  };

  function setBreadcrumb(name, label) {
    const crumbEl = $("#parentBreadcrumb");
    if (!crumbEl) return;
    const parents = TRAIL[name] || [];
    crumbEl.innerHTML =
      parents
        .map((p) => `<button type="button" class="crumb" data-crumb="${p}">${CRUMBS[p]}</button><span class="breadcrumb-sep">/</span>`)
        .join("") +
      `<span class="current">${label || CRUMBS[name] || name}</span>`;
  }

  let currentNav = "dashboard";

 
  function showFloatingBack(target, label) {//shared back btn
    const btn = $("#parentFloatingBack");
    if (!btn) return;
    btn.dataset.backTo = target;
    const labelEl = btn.querySelector(".back-label");
    if (labelEl) labelEl.textContent = label || "Back";
    btn.hidden = false;
  }

  function hideFloatingBack() {
    const btn = $("#parentFloatingBack");
    if (btn) btn.hidden = true;
  }

  function bindFloatingBack() {
    $("#parentFloatingBack")?.addEventListener("click", (event) => {
      goToNav(event.currentTarget.dataset.backTo || "dashboard");
    });
  }

  const bottomNav = $("#parentBottomNav");
  const bottomNavFloatIcon = $("#parentBottomNav .nav-float-icon");

  function syncBottomNav(nav) {
    const active = $(`#parentBottomNav [data-parent-nav="${nav}"]`);
    // A view outside the nav must not leave the raised bubble hovering.
    syncBottomNavigation({
      root: bottomNav,
      active,
      floatIcon: bottomNavFloatIcon,
      inactiveClass: "no-active",
    });
  }

  function addNavRipple(button, event) {
    addNavigationRipple(button, event);
  }

  let skeletonTimer = null;

  // brief shimmer on every page switch - purely presentational since data here is mock/instant with a real API, replace this with setSkeleton(true) before the fetch and setSkeleton(false) after
  function flashSkeleton(duration = 480) {
    const app = $("#parentApp");
    if (!app) return;
    window.clearTimeout(skeletonTimer);
    app.classList.add("sk-loading");
    skeletonTimer = window.setTimeout(() => app.classList.remove("sk-loading"), duration);
  }

  function goToNav(name, crumbLabel) {
    if (!VIEWS[name]) return;
    if (name === "profile") fillParentProfile(); // sidebar, dropdown and crumbs all land here
    currentNav = name;
    flashSkeleton();
    hideFloatingBack(); // each view that needs it re-shows it with its own target

    Object.entries(VIEWS).forEach(([key, el]) => {
      if (!el) return;
      const isActive = key === name;
      el.classList.toggle("active", isActive);
      el.classList.remove("view-entering");
      if (isActive) {
        void el.offsetWidth; // restart the enter animation
        el.classList.add("view-entering");
      }
    });

    // learn/notifications live outside the nav keep nav highlights only for real nav destinations
    $$("[data-parent-nav]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.parentNav === name);
    });

    setBreadcrumb(name, crumbLabel);

    syncBottomNav(name);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function bindNav() {
    $$("[data-parent-nav]").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        if (btn.closest("#parentBottomNav")) addNavRipple(btn, event);
        goToNav(btn.dataset.parentNav);
      });
    });

    $("#parentBreadcrumb")?.addEventListener("click", (event) => {
      const crumb = event.target.closest("[data-crumb]");
      if (crumb) goToNav(crumb.dataset.crumb);
    });
  }

  function bindSegments() {//segments(dash)
    const segments = $$("#parentDashSegments .segment");
    const panels = $$("#parentDashboardView .dash-panel");

    segments.forEach((segment) => {
      segment.addEventListener("click", () => {
        segments.forEach((s) => s.classList.toggle("active", s === segment));
        panels.forEach((panel) => {
          panel.classList.toggle("active", panel.dataset.dashContent === segment.dataset.dashPanel);
        });
      });
    });
  }

  function bindProfileDropdown() {//p down
    const btn = $("#parentProfileBtn");
    const dropdown = $("#parentProfileDropdown");
    if (!btn || !dropdown) return;

    function close() {
      dropdown.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("open");
      btn.setAttribute("aria-expanded", dropdown.classList.contains("open") ? "true" : "false");
    });

    document.addEventListener("click", close);
    dropdown.addEventListener("click", (e) => e.stopPropagation());

    $("#parentProfileMenuBtn")?.addEventListener("click", close);
    $("#parentHelpDeskBtn")?.addEventListener("click", close);
    $("#parentLicensesMenuBtn")?.addEventListener("click", close);
  }


  const NOTIFS = Array.isArray(MOCK.notifications) ? MOCK.notifications.slice() : [];//notification

  const bells = [
    { btn: $("#parentNotifyBtn"), count: $("#parentNotifyCount") },
    { btn: $("#parentNotifyBtnDesktop"), count: $("#parentNotifyCountDesktop") },
  ];

  function unreadCount() {
    return NOTIFS.filter((n) => !n.read).length;
  }

  function updateBellBadge() {
    const unread = unreadCount();
    bells.forEach(({ btn, count }) => {
      if (!btn) return;
      if (count) {
        count.textContent = unread > 9 ? "9+" : String(unread);
        count.hidden = unread === 0;
      }
      if (unread === 0) btn.classList.remove("has-new");
    });
    const badge = $("#parentNotifBadge");
    if (badge) badge.textContent = `${unread} new`;
  }

  function animateBells() {
    bells.forEach(({ btn }) => {
      if (!btn) return;
      btn.classList.remove("has-new");
      void btn.offsetWidth;
      btn.classList.add("has-new");
    });
  }

  // a new notification lands = badge count + bell swing(attention)
  function pushNotification(notif) {
    NOTIFS.unshift({ read: false, ...notif });
    updateBellBadge();
    animateBells();
  }

  const NOTIF_STATUS_TONE = {
    "Resolved": "resolved",
    "Under Review": "review",
    "Pending": "pending",
  };

  function studentById(id) {
    return STUDENTS.find((k) => String(k.id) === String(id));
  }

  // assignment-deployed/due-soon notifications (n.title), parent-reported question-issue ones (n.question/n.status) same list two shapes, rendered differently.
  function notifItemHTML(n) {
    const student = studentById(n.studentId);

    if (n.title) {
      const tone = n.title === "Assignment Due Tomorrow" ? "due-soon" : "assignment";
      return `
        <article class="notif-item ${tone} ${n.read ? "" : "unread"}">
          <span class="notif-icon" aria-hidden="true">
            <img src="assets/icons/assignment.svg" alt="">
          </span>
          <div class="notif-copy">
            <div class="notif-top">
              <strong class="notif-question">${n.title}</strong>
            </div>
            <p class="notif-message">${n.message}</p>
            <div class="notif-meta">
              ${student ? `<span>${student.name}</span><i aria-hidden="true"></i>` : ""}
              <span>${n.time}</span>
            </div>
          </div>
        </article>`;
    }

    const tone = NOTIF_STATUS_TONE[n.status] || "review";
    return `
      <article class="notif-item ${tone} ${n.read ? "" : "unread"}">
        <span class="notif-icon" aria-hidden="true">
          <img src="assets/icons/review.svg" alt="">
        </span>
        <div class="notif-copy">
          <div class="notif-top">
            <strong class="notif-question">${n.question}</strong>
            <span class="notif-status ${tone}">${n.status}</span>
          </div>
          <p class="notif-message">${n.message}</p>
          <div class="notif-meta">
            ${student ? `<span>${student.name}</span><i aria-hidden="true"></i>` : ""}
            <span>${n.time}</span>
          </div>
        </div>
      </article>`;
  }

  function renderNotifList() {
    const list = $("#parentNotifList");
    const empty = $("#parentNotifEmpty");
    if (!list) return;

    list.innerHTML = NOTIFS.map(notifItemHTML).join("");

    if (empty) empty.hidden = NOTIFS.length > 0;
  }

  // opening the page shows unread highlights, then marks everything read
  function openNotifications() {
    renderNotifList();
    goToNav("notifications");
    NOTIFS.forEach((n) => { n.read = true; });
    updateBellBadge();
  }

  function bindBells() {
    bells.forEach(({ btn }) => {
      btn?.addEventListener("click", openNotifications);
    });

    // demo: an admin reply lands shortly after load so the bell shows off
    setTimeout(() => {
      pushNotification({
        id: `n${Date.now()}`,
        studentId: 1028,
        question: "Kiswahili - Sarufi Practice 1, Q5",
        status: "Resolved",
        message: "Admin reviewed your report: the question wording was fixed and Kelvin's attempt was reset.",
        time: "Just now",
      });
    }, 4000);
  }

  function setSkeleton(on) {//loading(pskeleton)
    $("#parentApp")?.classList.toggle("sk-loading", on !== false);
  }

  // real notifications will call push Notification when the backend is set;
  // setSkeleton(true/false) wraps future data fetches
  window.parentPortal = { pushNotification, openNotifications, setSkeleton };

  function bindLearn() {//childs learning page(esomastudents.com/user=?)
    const openLearn = (studentIdValue) => {
      const student = studentById(studentIdValue);
      if (!student) return;

      const backTarget = ["students", "manage"].includes(currentNav) ? currentNav : "dashboard";
      const title = $("#parentLearnTitle");
      if (title) title.textContent = `${student.name}'s Learning Page`;
      goToNav("learn", `${student.name}'s Learning`);
      showFloatingBack(backTarget);
    };

    document.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-student-learn]");
      if (!btn) return;
      openLearn(btn.dataset.studentLearn);
    });

    // the student name doubles as a link to the same place (not a real <button> or <a>), so it needs its own Enter/Space activation.
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const el = event.target.closest?.(".parent-student-name-clickable[data-student-learn]");
      if (!el) return;
      event.preventDefault();
      openLearn(el.dataset.studentLearn);
    });
  }

  function bindDashboardPay() {
    $("#parentStudentsGrid")?.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-student-pay]");
      if (!btn) return;
      const student = studentById(btn.dataset.studentPay);
      if (student) openPayModal(student);
    });
  }

  let manageStudent = null;//manage child

  function fillManage(student) {
    $("#manageStudentName").textContent = student.name;

    // identity card carries the student's theme so its jungle watermark tints - aesthetics bhana
    $("#parentManageView .manage-identity")?.setAttribute("style", themeVars(student));

    const avatar = $("#manageAvatar");
    if (avatar) {
      avatar.setAttribute("style", themeVars(student));
      avatar.innerHTML = `<img src="${avatarSrc(student)}" alt="">`;
    }

    $("#manageNickname").textContent = student.name;
    $("#manageGender").textContent = student.gender || "NONE";
    $("#manageGrade").textContent = student.grade || "-";
    $("#manageSchool").textContent = student.school || "-";
    $("#manageTown").textContent = student.town || "-";

    const license = $("#manageLicense");
    if (license) {
      license.textContent = `${student.plan.toUpperCase()}: ${student.daysLeft} Days Left`;
      license.className = `parent-student-license ${licenseTone(student.daysLeft)}`;
    }

    $("#managePayName").textContent = student.name;
    const reportsBtn = $("#manageReportsBtn");
    if (reportsBtn) reportsBtn.textContent = `${student.name}'s Reports`;
  }

  function openManage(student) {
    const fromProfile = currentNav === "profile";
    manageStudent = student;
    fillManage(student);
    TRAIL.manage = [fromProfile ? "profile" : "students"];
    goToNav("manage", student.name);
    showFloatingBack(fromProfile ? "profile" : "students", fromProfile ? "Back to My Profile" : "Change Child Account");
  }

  function bindManage() {
    document.addEventListener("click", (event) => {
      // account pills & the pencil(edit btn) on dashboard cards both land here
      const trigger = event.target.closest("[data-student-manage], [data-student-edit]");
      if (!trigger) return;
      const student = studentById(trigger.dataset.studentManage || trigger.dataset.studentEdit);
      if (student) openManage(student);
    });

    $("#manageReportsBtn")?.addEventListener("click", () => {
      // nav first: the skeleton flash masks the swap, and the reports
      goToNav("reports");
      if (manageStudent) selectReportStudent(manageStudent);
    });
  }

  function refreshAfterEdit() {//edit profile / school modals (mock save) 
    fillManage(manageStudent);
    renderStudentGrids($("#parentStudentSearch")?.value);
    renderSummaryTable();
  }

  function bindEditModals() {
    $("#manageEditProfileBtn")?.addEventListener("click", () => {
      if (!manageStudent) return;
      $("#parentProfileEditNote").textContent = `Update ${manageStudent.name}'s profile.`;
      $("#editNickname").value = manageStudent.name;
      $("#editGender").value = manageStudent.gender || "NONE";
      $("#editGrade").value = manageStudent.grade || "GRADE_1";
      openModal("parentProfileEditModal");
    });

    $("#editProfileSave")?.addEventListener("click", () => {
      if (!manageStudent) return;
      const nickname = $("#editNickname").value.trim();
      if (nickname) manageStudent.name = nickname;
      manageStudent.gender = $("#editGender").value;
      manageStudent.grade = $("#editGrade").value;
      refreshAfterEdit();
      closeModal("parentProfileEditModal");
    });

    $("#manageEditSchoolBtn")?.addEventListener("click", () => {
      if (!manageStudent) return;
      $("#parentSchoolEditNote").textContent = `Update ${manageStudent.name}'s school information.`;
      $("#editSchool").value = manageStudent.school || "";
      $("#editTown").value = manageStudent.town || "";
      openModal("parentSchoolEditModal");
    });

    $("#editSchoolSave")?.addEventListener("click", () => {
      if (!manageStudent) return;
      const school = $("#editSchool").value.trim();
      const town = $("#editTown").value.trim();
      if (school) manageStudent.school = school;
      if (town) manageStudent.town = town;
      refreshAfterEdit();
      closeModal("parentSchoolEditModal");
    });
  }

  let payStudent = null;//pay modal (mock STK push - UI only)

  function resetPayModal() {
    $("#parentPayFields").hidden = false;
    $("#parentPaySuccess").hidden = true;
    $("#parentPayActions").hidden = false;
    $("#parentPayDoneActions").hidden = true;
    $("#parentPayError").hidden = true;
  }

  function applyPayPlan(btn) {
    if (!btn) return;
    $$(".pay-plan-btn", $("#parentPayPlanSelect")).forEach((b) => b.classList.toggle("active", b === btn));
    $("#parentPayAmount").value = btn.dataset.amount;
  }

  function openPayModal(student) {
    if (!student) return;
    payStudent = student;
    resetPayModal();
    $("#parentPayStudentName").textContent = student.name;
    applyPayPlan($("#parentPayPlanSelect .pay-plan-btn[data-plan=\"monthly\"]"));
    $("#parentPayPhone").value = PARENT.contact || "";
    openModal("parentPayModal");
  }

  // single backend integration point for payments. Replace the body with the real
  // call (e.g. fetch("/api/payments/mpesa/stk-push", {method:"POST", body})) and
  // the flow below keeps working - it already handles pending and failure.
  function requestMpesaPushAPI(payload) {
    console.info("requestMpesaPushAPI", payload);
    return new Promise((resolve) => window.setTimeout(() => resolve({ ok: true }), 250));
  }

  function bindPayModal() {
    $("#managePayBtn")?.addEventListener("click", () => openPayModal(manageStudent));

    $("#parentPayPlanSelect")?.addEventListener("click", (event) => {
      const btn = event.target.closest(".pay-plan-btn");
      if (btn) applyPayPlan(btn);
    });

    $("#parentPaySend")?.addEventListener("click", (event) => {
      const sendBtn = event.currentTarget;
      const amount = Number($("#parentPayAmount").value);
      const phone = ($("#parentPayPhone").value || "").replace(/\s+/g, "");
      const errorEl = $("#parentPayError");
      const valid = amount > 0 && /^(?:\+?254|0)?[17]\d{8}$/.test(phone);

      if (!valid) {
        errorEl.textContent = "Enter a valid amount and phone number.";
        errorEl.hidden = false;
        return;
      }

      errorEl.hidden = true;
      setButtonLoading(sendBtn, true);

      // the push is only confirmed once the server accepts it - showing success
      // before that told parents a payment was sent when it may never have been
      requestMpesaPushAPI({
        studentId: payStudent?.id || null,
        plan: $("#parentPayPlanSelect .pay-plan-btn.active")?.dataset.plan || null,
        amount,
        phone,
      })
        .then((result) => {
          if (!result?.ok) throw new Error("push rejected");
          $("#parentPayFields").hidden = true;
          $("#parentPayActions").hidden = true;
          $("#parentPaySuccessNote").textContent =
            `STK push sent to ${phone}. Enter your M-Pesa PIN on your phone to complete KES ${amount} for ${payStudent?.name || "your child"}.`;
          $("#parentPaySuccess").hidden = false;
          $("#parentPayDoneActions").hidden = false;
        })
        .catch(() => {
          errorEl.textContent = "We could not reach M-Pesa. Try again.";
          errorEl.hidden = false;
        })
        .finally(() => setButtonLoading(sendBtn, false));
    });

    $("#parentPayOk")?.addEventListener("click", () => {
      closeModal("parentPayModal");
    });
  }



  function bindHelpDesk() {//customer service/help
    $("#parentHelpDeskBtn")?.addEventListener("click", () => goToNav("help"));
    $("#parentHelpDeskSideBtn")?.addEventListener("click", () => goToNav("help"));
  }


  function bindPasswordToggles() {//password reveal tggls
    $$("[data-pw-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = $(`#${btn.dataset.pwToggle}`);
        if (!input) return;
        const reveal = input.type === "password";
        input.type = reveal ? "text" : "password";
        btn.setAttribute("aria-pressed", String(reveal));
        btn.setAttribute("aria-label", `${reveal ? "Hide" : "Show"} password`);
        btn.querySelector(".pw-eye").hidden = reveal;
        btn.querySelector(".pw-eye-off").hidden = !reveal;
      });
    });
  }

  function renderProfileStudents() {//learner strip at the bottom of the profile card
    const strip = $("#parentProfileStudents");
    if (!strip) return;
    strip.innerHTML = STUDENTS.map((student) => `
      <li>
        <button class="parent-profile-student" type="button" data-student-manage="${student.id}"
          aria-label="Manage ${student.name}'s account">
          ${avatarHtml(student)}
          <span class="parent-profile-student-name">${student.name}</span>
          <span class="parent-profile-student-meta">${student.cls}</span>
        </button>
      </li>`).join("");
  }

  function fillParentProfile() {//parents profile
    $("#parentProfileName").textContent = PARENT.fullName || PARENT.name;
    $("#parentProfileContact").value = PARENT.contact || "";
    $("#parentProfileEmail").value = PARENT.email || "";
    $("#parentProfileSaved").hidden = true;
    renderProfileStudents();
  }

  function resetPasswordModal() {
    $("#parentPasswordFields").hidden = false;
    $("#pwSuccess").hidden = true;
    $("#pwActions").hidden = false;
    $("#pwDoneActions").hidden = true;
    $("#pwError").hidden = true;
    ["#pwCurrent", "#pwNew", "#pwConfirm"].forEach((sel) => { const el = $(sel); if (el) el.value = ""; });
  }

  function bindParentProfile() {
    $("#parentProfileMenuBtn")?.addEventListener("click", () => {
      fillParentProfile();
      goToNav("profile");
    });

    $("#parentProfileSaveBtn")?.addEventListener("click", () => {
      PARENT.contact = $("#parentProfileContact").value.trim();
      PARENT.email = $("#parentProfileEmail").value.trim();
      $("#parentProfileSaved").hidden = false;
    });

    $("#parentChangePasswordBtn")?.addEventListener("click", () => {
      resetPasswordModal();
      openModal("parentPasswordModal");
    });

    $("#pwSaveBtn")?.addEventListener("click", () => {
      const next = $("#pwNew").value;
      const confirm = $("#pwConfirm").value;
      const valid = $("#pwCurrent").value.length > 0 && next.length >= 6 && next === confirm;
      if (!valid) {
        $("#pwError").hidden = false;
        return;
      }
      // UI only - real password change goes to the backend later
      $("#parentPasswordFields").hidden = true;
      $("#pwActions").hidden = true;
      $("#pwSuccess").hidden = false;
      $("#pwDoneActions").hidden = false;
    });

    $("#pwOkBtn")?.addEventListener("click", () => closeModal("parentPasswordModal"));
  }

  const REPORTS = MOCK.reports || {};//reports & analytics
  let reportStudent = STUDENTS[0] || null;
  // Term, not month. A single month of this data can leave a learner with only
  // a handful of scored assignments across two subjects, and the hero card is a
  // headline percentage — it should not be computed from five data points.
  let reportInsightPeriod = "term";
  let insightRenderToken = 0;

  const assignmentsPager = createPager({
    container: "#reportAssignmentsPagination",
    pageSize: 5,
    onPageChange: () => renderReport(),
  });

  
  function renderReportTabs() {//another aesthetic aka  carousel or whatever
    const tabs = $("#reportStudentTabs");
    if (!tabs) return;
    tabs.innerHTML = STUDENTS.map((student) => {
      const active = reportStudent && student.id === reportStudent.id;
      return `
      <button type="button" class="parent-student-card parent-student-id-card report-student-card ${active ? "active" : ""}"
        style="${themeVars(student)}" data-report-student="${student.id}" data-avatar="${student.avatar}"
        role="tab" aria-selected="${active}">
        <img class="parent-student-id-img" src="${avatarSrc(student)}" alt="" loading="lazy">
        <span class="parent-student-id-foot">
          <span class="parent-student-id-name">${student.name}</span>
          <span class="parent-student-id-class">${student.cls}</span>
        </span>
      </button>`;
    }).join("");

    const dots = $("#reportStudentDots");//tu-dots sliders
    if (dots) {
      dots.innerHTML = STUDENTS.map((student) => `
        <button type="button" class="report-dot ${reportStudent && student.id === reportStudent.id ? "active" : ""}"
          data-report-student="${student.id}" tabindex="-1"></button>`).join("");
    }
  }

  function applyReportStudentSelection(student) {
    reportStudent = student;
    assignmentsPager.reset();
    renderReportTabs();
    renderReport();
  }

  function selectReportStudent(student) {
    applyReportStudentSelection(student);

    //  bring the chosen student's card into view on phones
    if (window.matchMedia("(max-width: 640px)").matches) {
      $(`#reportStudentTabs [data-report-student="${student.id}"]`)
        ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }

  function formatReportPeriodDate(date) {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  function latestReportActivityDate(report) {
    const dates = (report?.assignments || [])
      .map((assignment) => new Date(String(assignment.last || "").replace(" ", "T")))
      .filter((date) => !Number.isNaN(date.getTime()));
    return dates.length ? new Date(Math.max(...dates.map((date) => date.getTime()))) : null;
  }

  // available period is anchored to the latest real assignment in this learner's report. This avoids a misleading "this month" choice when the
  // data snapshot belongs to an earlier school month.
  // `label` travels with the range so the insight cards can name the window
  // they cover. Without it the hero card reads "Overall Performance", which is
  // indistinguishable from the all-time "Performance Average" in the Overview
  // tab even though the two deliberately measure different things.
  function insightPeriodRange(report, period) {
    const latest = latestReportActivityDate(report);
    if (!latest || period === "all") return null;

    const year = latest.getFullYear();
    const month = latest.getMonth();
    if (period === "month") {
      return { label: "Month", start: dateOnly(new Date(year, month, 1)), end: dateOnly(new Date(year, month + 1, 0)) };
    }

    if (period === "term") {
      const termStartMonth = month <= 3 ? 0 : month <= 7 ? 4 : 8;
      return { label: "Term", start: dateOnly(new Date(year, termStartMonth, 1)), end: dateOnly(new Date(year, termStartMonth + 4, 0)) };
    }

    return { label: "Year", start: `${year}-01-01`, end: `${year}-12-31` };
  }

  function refreshInsightPeriodLabels(report) {
    const select = $("#reportInsightsPeriod");
    const latest = latestReportActivityDate(report);
    if (!select || !latest) return;

    const month = latest.getMonth();
    const term = month <= 3 ? 1 : month <= 7 ? 2 : 3;
    const setLabel = (value, label) => {
      const option = select.querySelector(`option[value="${value}"]`);
      if (option) option.textContent = label;
    };

    setLabel("month", formatReportPeriodDate(latest));
    setLabel("term", `Term ${term} · ${latest.getFullYear()}`);
    setLabel("year", `${latest.getFullYear()} academic year`);
  }

  // this filter deliberately scopes the insight cards only, legacy assignment table and comparison chart use a separate, all-time data source
  function renderInsightSkeleton(container) {
    container.setAttribute("aria-busy", "true");
    container.innerHTML = `
      <div class="insight-card-grid insight-skeleton-grid" aria-hidden="true">
        ${Array.from({ length: 5 }, (_, index) => `
          <div class="insight-skeleton-card ${index === 0 ? "is-featured" : ""}">
            <span class="insight-skeleton-icon"></span>
            <span class="insight-skeleton-line is-title"></span>
            <span class="insight-skeleton-line is-copy"></span>
            <span class="insight-skeleton-pill"></span>
          </div>`).join("")}
      </div>`;
  }

  function renderInsights(student, report) {
    const el = $("#reportInsights");
    if (!el) return;
    const renderToken = ++insightRenderToken;
    refreshInsightPeriodLabels(report);
    renderInsightSkeleton(el);

    // keep tha skeleton visible long enough to make a selection feel responsive, without delaying the underlying report calculation.
    window.setTimeout(() => {
      if (renderToken !== insightRenderToken) return;
      const cards = calculateInsightCards(student.id, insightPeriodRange(report, reportInsightPeriod));
      renderInsightCards(el, cards);
      el.removeAttribute("aria-busy");
    }, 160);
  }

  function renderReport() {
    if (!reportStudent) return;
    const report = REPORTS[reportStudent.id];
    if (!report) return;

    $("#reportStudentTitle").textContent = `${reportStudent.name}'s School Assignment Reports and Analytics`;
    $$('[data-report-stat="engagement"]').forEach((el) => { el.textContent = report.engagement; });
    $$('[data-report-stat="average"]').forEach((el) => { el.textContent = report.average; });
    $$('[data-report-stat="bestSubject"]').forEach((el) => { el.textContent = report.bestSubject; });

    renderInsights(reportStudent, report);

    const indexedAssignments = report.assignments.map((row, idx) => ({ ...row, _idx: idx }));
    const pageRows = assignmentsPager.paginate(indexedAssignments);

    $("#reportAssignmentsBody").innerHTML = pageRows.map((row) => {
      const [date, time = ""] = row.last.split(" ");
      const hasScore = row.score != null;
      const scoreTone = !hasScore ? "zero" : row.score >= 70 ? "done" : row.score >= 40 ? "ongoing" : "retake";
      const scoreLabel = hasScore ? `${row.score}%` : "Not started";
      return `
      <tr>
        <td><button type="button" class="assignment-link-btn" data-assign-idx="${row._idx}">${row.title}</button></td>
        <td class="report-subject-col">${row.subject}</td>
        <td><span class="count-chip ${scoreTone}">${scoreLabel}</span></td>
        <td>
          <span class="report-when">
            <span class="when-date">${date}</span>
            <span class="when-time">${time.slice(0, 5)}</span>
          </span>
        </td>
      </tr>`;
    }).join("");
    assignmentsPager.renderControls();

    renderReportChart(report);
  }

  // The comparison chart's markup is not present in this view — #profileChart,
  // #profileChartTitle and #subjectKey were removed from index.html while these
  // calls stayed behind, so renderReport() threw on the first of them. That
  // aborted the rest of renderReport AND the remainder of the boot sequence
  // that calls it, taking renderLicenses/bindLicenses/bindStudentSearch/
  // updateBellBadge/syncBottomNav and the skeleton clear down with it.
  //
  // Guarded rather than deleted: the chart is still wanted here, and this keeps
  // the wiring ready for when the markup comes back. With no container present
  // it does nothing, which is exactly what the current markup renders.
  function renderReportChart(report) {
    const chartEl = $("#profileChart");
    const titleEl = $("#profileChartTitle");
    const keyEl = $("#subjectKey");
    if (!chartEl && !titleEl && !keyEl) return;

    if (titleEl) titleEl.textContent = `${reportStudent.name}'s Overall Performance`;

    // same shared chart admin/teacher use
    const { subjects, student, classAvg } = report.chart;
    const scoresByCode = {};
    const classAvgByCode = {};
    subjects.forEach(([code], i) => {
      scoresByCode[code] = student[i];
      classAvgByCode[code] = classAvg[i];
    });
    const labels = subjects.map(([code]) => code);//just show the subjects for empty data
    if (chartEl) {
      chartEl.innerHTML = hasAnyScore(labels, scoresByCode)
        ? buildPerformanceChartSVG({
          labels,
          scores: scoresByCode,
          classAverage: classAvgByCode,
          ariaLabel: `${reportStudent.name}'s scores and class average by learning area`,
        })
        : "";
    }

    if (keyEl) {
      const filteredSubjectLabels = Object.fromEntries(
        Object.entries(subjectLabels).filter(([code]) => labels.includes(code))
      );
      keyEl.innerHTML = buildSubjectKeyHTML(filteredSubjectLabels);
    }
  }

  function openAssignmentDetail(row) {
    if (!row || !reportStudent) return;

    const outOf = 10;
    const hasScore = row.score != null;
    const gotten = hasScore ? Math.round((row.score / 100) * outOf) : 0;

    $("#assignName").textContent = row.title;
    $("#assignArea").textContent = row.subject;
    $("#assignClass").textContent = reportStudent.cls;
    $("#assignTeacher").textContent = row.teacher || "Class Teacher";
    $("#assignScore").textContent = hasScore
      ? `${gotten} Out of ${outOf} (${row.score.toFixed(2)}%)`
      : "Not attempted yet";
    $("#assignLast").textContent = row.last;

    goToNav("assignment", row.title);
    showFloatingBack("reports");
  }

  function bindAssignmentDetail() {
    $("#reportAssignmentsBody")?.addEventListener("click", (event) => {
      const link = event.target.closest("[data-assign-idx]");
      if (!link) return;
      const report = REPORTS[reportStudent?.id];
      const row = report?.assignments[Number(link.dataset.assignIdx)];
      if (row) openAssignmentDetail(row);
    });
  }

  function bindReports() {
    const pickStudent = (event) => {
      const tab = event.target.closest("[data-report-student]");
      if (!tab) return;
      const student = studentById(tab.dataset.reportStudent);
      if (student) selectReportStudent(student);
    };
    $("#reportStudentTabs")?.addEventListener("click", pickStudent);
    $("#reportStudentDots")?.addEventListener("click", pickStudent);
    $("#reportInsightsPeriod")?.addEventListener("change", (event) => {
      reportInsightPeriod = event.target.value;
      if (reportStudent) renderInsights(reportStudent, REPORTS[reportStudent.id]);
    });

    const segments = $$("#reportSegments .segment");
    const panels = $$("#parentReportsView .report-panel");
    segments.forEach((segment) => {
      segment.addEventListener("click", () => {
        segments.forEach((s) => s.classList.toggle("active", s === segment));
        panels.forEach((panel) => {
          panel.classList.toggle("active", panel.dataset.reportContent === segment.dataset.reportPanel);
        });
      });
    });
  }


  function licenseRowHtml(student) {//licenses page
    const tone = licenseTone(student.daysLeft);
    return `
      <article class="license-row" style="${themeVars(student)}">
        ${avatarHtml(student)}
        <div class="license-row-info">
          <strong>${student.name}</strong>
          <span>${student.cls}</span>
        </div>
        <span class="parent-student-license ${tone}">${student.plan.toUpperCase()}: ${student.daysLeft} Days Left</span>
        <button type="button" class="pay-btn license-row-pay" data-student-pay="${student.id}">
          <img src="assets/icons/mpesa.webp" alt="" class="pay-img">
          <span>Pay</span>
        </button>
      </article>`;
  }

  function renderLicenses() {
    const list = $("#parentLicenseList");
    if (list) list.innerHTML = STUDENTS.map(licenseRowHtml).join("");

    const schoolName = $("#licenseSchoolName");
    if (schoolName && STUDENTS[0]?.school) schoolName.textContent = STUDENTS[0].school;
  }

  function bindLicenses() {
    $("#parentLicensesMenuBtn")?.addEventListener("click", () => goToNav("licenses"));

    $("#parentLicenseList")?.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-student-pay]");
      if (!btn) return;
      const student = studentById(btn.dataset.studentPay);
      if (student) openPayModal(student);
    });
  }


  function bindStudentSearch() {
    $("#parentStudentSearch")?.addEventListener("input", (event) => {
      renderStudentGrids(event.target.value);
    });
  }

  /* demo login gate....shared/scripts/ui/login-gate.js; no real auth backend, any submission succeeds. thats will be on your end */

  const parentLoginGate = createLoginGate({
    storageKey: PORTAL_STORAGE_KEYS.parent,
    appShellSelector: "#parentApp",
    logoutSelectors: ["#parentLogoutBtn", "#parentMobileLogoutBtn"],
  });

  parentLoginGate.bind();

  mountPerformancePanel($("#profilePerformancePanel"));

  $("#parentDashboardName").textContent = PARENT.name;
  $("#parentSideProfileName").textContent = PARENT.fullName || PARENT.name;
  renderStats();
  renderStudentGrids();
  renderSummaryTable();
  bindNav();
  bindFloatingBack();
  bindSegments();
  bindProfileDropdown();
  bindBells();
  bindLearn();
  bindManage();
  bindEditModals();
  bindPayModal();
  bindDashboardPay();
  bindHelpDesk();
  bindParentProfile();
  bindPasswordToggles();
  bindReports();
  bindAssignmentDetail();
  renderReportTabs();
  renderReport();
  renderLicenses();
  bindLicenses();
  bindStudentSearch();
  updateBellBadge();
  syncBottomNav("dashboard");

  // NB: mock data is instant, so flash the skeletons briefly on boot with a real API: setSkeleton(true) before the fetch, false after
  setSkeleton(true);
  window.setTimeout(() => setSkeleton(false), 900);
})();
