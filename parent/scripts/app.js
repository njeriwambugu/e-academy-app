import { parent, kids, avatarThemes, notifications, reports, subjectLabels } from "../../shared/scripts/data/mock-data.js";
import { calculateInsightCards } from "../../shared/scripts/data/insights-engine.js";
import { createPager } from "../../shared/scripts/utils/table-utils.js";
import { buildPerformanceChartSVG, buildSubjectKeyHTML, hasAnyScore, mountPerformancePanel } from "../../shared/scripts/ui/performance-chart.js";
import { renderInsightCards } from "../../shared/scripts/ui/insight-cards.js";
import { createLoginGate } from "../../shared/scripts/ui/login-gate.js";
import { $, $$ } from "../../shared/scripts/utils/dom.js";

(function () {
  "use strict";

  /* mock data now comes from the one shared canonical store */

  const MOCK = { parent, kids, avatarThemes, notifications, reports };
  const PARENT = MOCK.parent;
  const KIDS = MOCK.kids;
  const AVATAR_THEMES = MOCK.avatarThemes;

  const DEFAULT_THEME = { c1: "#dbe7ff", c2: "#eef3fb", soft: "#eef3fb", ink: "#26325d", accent: "#5f7bb1" };


  function themeOf(kid) {
    return AVATAR_THEMES[kid.avatar] || DEFAULT_THEME;
  }

  function themeVars(kid) {
    const t = themeOf(kid);
    return `--kc1:${t.c1};--kc2:${t.c2};--kc-soft:${t.soft};--kc-ink:${t.ink};--kc-accent:${t.accent}`;
  }

  function licenseTone(daysLeft) {
    if (daysLeft <= 7) return "danger";
    if (daysLeft <= 30) return "warn";
    return "ok";
  }

  function avatarSrc(kid) {
    return `assets/avatars/${kid.avatar || "0"}-default.png`;
  }

  function avatarHtml(kid) {
    return `<span class="kid-avatar" style="${themeVars(kid)}" aria-hidden="true">
      <img src="${avatarSrc(kid)}" alt="" loading="lazy">
    </span>`;
  }

  function renderStats() {//stat tiles
    const activeLicenses = KIDS.filter((k) => k.daysLeft > 0).length;
    const pending = KIDS.reduce((sum, k) => sum + k.pending, 0);
    const retakes = KIDS.reduce((sum, k) => sum + k.retakes, 0);

    $("#parentActiveLicenses").textContent = activeLicenses;
    $("#parentPendingAssignments").textContent = pending;
    $("#parentPendingRetakes").textContent = retakes;
  }

  function chipsHtml(kid) {//kids card
    return `
      <span class="kid-chip done" title="Assignments done"><i class="learner-dot" aria-hidden="true"></i>${kid.done}<em class="chip-word">done</em></span>
      <span class="kid-chip ongoing" title="Assignments ongoing"><i class="learner-dot" aria-hidden="true"></i>${kid.ongoing}<em class="chip-word">ongoing</em></span>
      <span class="kid-chip pending" title="Assignments pending"><i class="learner-dot" aria-hidden="true"></i>${kid.pending}<em class="chip-word">pending</em></span>
      <span class="kid-chip retake" title="Retakes pending"><i class="learner-dot" aria-hidden="true"></i>${kid.retakes}<em class="chip-word">retakes</em></span>`;
  }

  function kidCardHtml(kid) {
    const tone = licenseTone(kid.daysLeft);
    // an expired plan doesn't hide the card — it locks the actions that lead
    // into paid learning content, while Pay stays available every day.
    const locked = kid.daysLeft <= 0;

    return `
      <article class="kid-card ${locked ? "is-locked" : ""}" style="${themeVars(kid)}" data-kid="${kid.id}" data-avatar="${kid.avatar}">
        <span class="kid-class-pill">${kid.cls}</span>
        <div class="kid-name-row">
          <h3 class="kid-name${locked ? "" : " kid-name-clickable"}"
            ${locked ? "" : `data-kid-learn="${kid.id}" role="link" tabindex="0"`}>${kid.name}</h3>
          <button type="button" class="kid-name-edit" data-kid-edit="${kid.id}" aria-label="Edit ${kid.name}'s account" ${locked ? "disabled" : ""}>
            <img src="assets/icons/person-edit.svg" alt="" aria-hidden="true">
          </button>
        </div>
        ${avatarHtml(kid)}
        <div class="kid-chips" aria-label="Assignment snapshot">${chipsHtml(kid)}</div>
        <button type="button" class="kid-learn-btn" data-kid-learn="${kid.id}" ${locked ? "disabled" : ""}>
          <span>Learn</span>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
          </svg>
        </button>
        <span class="kid-license ${tone}">${kid.plan.toUpperCase()}: ${kid.daysLeft} Days Left</span>
        <button type="button" class="pay-btn kid-pay-btn" data-kid-pay="${kid.id}">
          <img src="assets/icons/mpesa.png" alt="" class="pay-img" aria-hidden="true">
          <span>Pay</span>
        </button>
      </article>`;
  }

  /*pill row per kid - avatar far left, name far right mmmh aesthetics */
  function kidPillHtml(kid) {
    return `
      <button type="button" class="kid-pill" style="${themeVars(kid)}" data-kid-manage="${kid.id}"
        data-avatar="${kid.avatar}" aria-label="Manage ${kid.name}'s account">
        ${avatarHtml(kid)}
        <span class="kid-pill-name">${kid.name}</span>
        <i class="pill-leaf pill-leaf-1" aria-hidden="true"></i>
        <i class="pill-leaf pill-leaf-2" aria-hidden="true"></i>
        <i class="pill-leaf pill-leaf-3" aria-hidden="true"></i>
      </button>`;
  }

  function renderKidGrids(filterText) {
    const dashGrid = $("#parentKidsGrid");
    const accountsList = $("#parentKidsAccountsList");
    const noMatch = $("#parentKidsNoMatch");

    const query = (filterText || "").trim().toLowerCase();
    const dashKids = query
      ? KIDS.filter((k) => k.name.toLowerCase().includes(query))
      : KIDS;

    if (dashGrid) dashGrid.innerHTML = dashKids.map(kidCardHtml).join("");
    if (noMatch) noMatch.hidden = dashKids.length > 0;
    // accounts page always shows the full roster
    if (accountsList) accountsList.innerHTML = KIDS.map(kidPillHtml).join("");
  }


  // matches the tone names on the legend's .learner-dot chips above the
  // table, so the dot color here is literally the same swatch, not a
  // separate palette to keep in sync.
  const COUNT_CHIP_DOT_TONE = { done: "completed", ongoing: "ongoing", pending: "not-started", retake: "retake" };

  // desktop keeps a bare number (the column header already says what it
  // is) — pass visibleLabel to also show the word, used by the mobile card
  // list below where there's a full card width to work with instead of a
  // table column fighting the learner column for space.
  function countCell(value, tone, label, { visibleLabel = false } = {}) {//summary table
    const zero = !value;
    return `
      <span class="count-chip ${tone}${zero ? " is-zero" : ""}">
        <i class="learner-dot ${COUNT_CHIP_DOT_TONE[tone] || ""}" aria-hidden="true"></i>
        <span class="${visibleLabel ? "count-chip-label" : "sr-only"}">${label}</span>
        <strong class="count-chip-value">${value || 0}</strong>
      </span>`;
  }

  function kidCellMarkup(kid) {
    const locked = kid.daysLeft <= 0;
    return `
      <span class="kid-cell">
        ${avatarHtml(kid)}
        <strong class="${locked ? "" : "kid-name-clickable"}"
          ${locked ? "" : `data-kid-learn="${kid.id}" role="link" tabindex="0"`}>${kid.name}</strong>
      </span>`;
  }

  const summaryPager = createPager({
    container: "#parentSummaryPagination",
    pageSize: 5,
    onPageChange: () => renderSummaryTable(),
  });

  // one dataset, one pagination pass — renders the real desktop <table> and
  // the mobile card list from the exact same page of kids; CSS (not JS)
  // decides which one is actually visible at a given width.
  function renderSummaryTable() {
    const body = $("#parentSummaryBody");
    const cardList = $("#parentSummaryCards");
    if (!body && !cardList) return;

    const pageRows = summaryPager.paginate(KIDS);

    if (body) {
      body.innerHTML = pageRows.map((kid) => `
      <tr>
        <td>${kidCellMarkup(kid)}</td>
        <td>${countCell(kid.done, "done", "Completed")}</td>
        <td class="col-ongoing">${countCell(kid.ongoing, "ongoing", "Ongoing")}</td>
        <td class="col-pending">${countCell(kid.pending, "pending", "Not Started")}</td>
        <td>${countCell(kid.retakes, "retake", "Retakes")}</td>
      </tr>`).join("");
    }

    if (cardList) {
      cardList.innerHTML = pageRows.map((kid) => `
      <li class="summary-mobile-card">
        ${kidCellMarkup(kid)}
        <div class="summary-mobile-status">
          ${countCell(kid.done, "done", "Completed", { visibleLabel: true })}
          ${countCell(kid.ongoing, "ongoing", "Ongoing", { visibleLabel: true })}
          ${countCell(kid.pending, "pending", "Not Started", { visibleLabel: true })}
          ${countCell(kid.retakes, "retake", "Retakes", { visibleLabel: true })}
        </div>
      </li>`).join("");
    }

    summaryPager.renderControls();
  }

  const VIEWS = {//navigation
    dashboard: $("#parentDashboardView"),
    kids: $("#parentKidsView"),
    reports: $("#parentReportsView"),
    learn: $("#parentLearnView"),
    notifications: $("#parentNotificationsView"),
    manage: $("#parentManageView"),
    profile: $("#parentProfileView"),
    kiddetail: $("#parentKidDetailView"),
    help: $("#parentHelpView"),
    assignment: $("#parentAssignmentView"),
    licenses: $("#parentLicensesView"),
  };

  const CRUMBS = {
    dashboard: "Dashboard",
    kids: "Kids Accounts",
    reports: "Reports",
    learn: "Learning Page",
    notifications: "Notifications",
    manage: "Manage Account",
    profile: "My Profile",
    kiddetail: "Kid Details",
    help: "Help Desk",
    assignment: "Assignment Details",
    licenses: "Licenses",
  };

  // parent crumbs shown before the current page in the breadcrumb
  const TRAIL = {
    manage: ["kids"],
    learn: ["dashboard"],
    kiddetail: ["dashboard"],
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
    if (!bottomNav) return;

    //if page is not in bottom nav then don't leave the raised bubble hovering//discipline yeahhhh
    if (!active) {
      bottomNav.classList.add("no-active");
      return;
    }

    bottomNav.classList.remove("no-active");
    bottomNav.style.setProperty("--active-index", active.dataset.navIndex || "0");
    if (bottomNavFloatIcon) {
      bottomNavFloatIcon.innerHTML = active.querySelector(".nav-icon")?.innerHTML || "";
    }
  }

  function addNavRipple(button, event) {
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    ripple.className = "nav-ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
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

    // breadcrumb parents navigate back up the trail
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
      // restart the swing even if the class is already there(change it)
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

  function kidById(id) {
    return KIDS.find((k) => String(k.id) === String(id));
  }

  // assignment-deployed/due-soon notifications (n.title) vs. the older
  // parent-reported question-issue ones (n.question/n.status) — same list,
  // two shapes, rendered differently.
  function notifItemHTML(n) {
    const kid = kidById(n.kidId);

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
              ${kid ? `<span>${kid.name}</span><i aria-hidden="true"></i>` : ""}
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
            ${kid ? `<span>${kid.name}</span><i aria-hidden="true"></i>` : ""}
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
        kidId: 1028,
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

  function bindLearn() {//childs learning page(esomakids.com)
    const openLearn = (kidIdValue) => {
      const kid = kidById(kidIdValue);
      if (!kid) return;

      const backTarget = ["kids", "kiddetail"].includes(currentNav) ? currentNav : "dashboard";
      const title = $("#parentLearnTitle");
      if (title) title.textContent = `${kid.name}'s Learning Page`;
      goToNav("learn", `${kid.name}'s Learning`);
      showFloatingBack(backTarget);
    };

    document.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-kid-learn]");
      if (!btn) return;
      openLearn(btn.dataset.kidLearn);
    });

    // the kid name doubles as a link to the same place (not a real <button>
    // or <a>), so it needs its own Enter/Space activation.
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const el = event.target.closest?.(".kid-name-clickable[data-kid-learn]");
      if (!el) return;
      event.preventDefault();
      openLearn(el.dataset.kidLearn);
    });
  }

  function bindDashboardPay() {
    $("#parentKidsGrid")?.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-kid-pay]");
      if (!btn) return;
      const kid = kidById(btn.dataset.kidPay);
      if (kid) openPayModal(kid);
    });
  }

  let manageKid = null;//manage child

  function fillManage(kid) {
    $("#manageKidName").textContent = kid.name;

    // identity card carries the kid's theme so its jungle watermark tints - aesthetics bhana
    $("#parentManageView .manage-identity")?.setAttribute("style", themeVars(kid));

    const avatar = $("#manageAvatar");
    if (avatar) {
      avatar.setAttribute("style", themeVars(kid));
      avatar.innerHTML = `<img src="${avatarSrc(kid)}" alt="">`;
    }

    $("#manageNickname").textContent = kid.name;
    $("#manageGender").textContent = kid.gender || "NONE";
    $("#manageGrade").textContent = kid.grade || "-";
    $("#manageSchool").textContent = kid.school || "-";
    $("#manageTown").textContent = kid.town || "-";

    const license = $("#manageLicense");
    if (license) {
      license.textContent = `${kid.plan.toUpperCase()}: ${kid.daysLeft} Days Left`;
      license.className = `kid-license ${licenseTone(kid.daysLeft)}`;
    }

    $("#managePayName").textContent = kid.name;
    const reportsBtn = $("#manageReportsBtn");
    if (reportsBtn) reportsBtn.textContent = `${kid.name}'s Reports`;
  }

  function openManage(kid) {
    manageKid = kid;
    fillManage(kid);
    goToNav("manage", kid.name);
    showFloatingBack("kids", "Change Child Account");
  }

  function bindManage() {
    document.addEventListener("click", (event) => {
      // account pills AND the pencil(edit btn) on dashboard cards both land here
      const trigger = event.target.closest("[data-kid-manage], [data-kid-edit]");
      if (!trigger) return;
      const kid = kidById(trigger.dataset.kidManage || trigger.dataset.kidEdit);
      if (kid) openManage(kid);
    });

    $("#manageReportsBtn")?.addEventListener("click", () => {
      // nav first: the skeleton flash masks the swap, and the reports
      // view is already visible/laid out for the mobile carousel scroll
      goToNav("reports");
      if (manageKid) selectReportKid(manageKid);
    });
  }

  function refreshAfterEdit() {//edit profile / school modals (mock save) 
    fillManage(manageKid);
    renderKidGrids($("#parentKidSearch")?.value);
    renderSummaryTable();
  }

  function bindEditModals() {
    $("#manageEditProfileBtn")?.addEventListener("click", () => {
      if (!manageKid) return;
      $("#parentProfileEditNote").textContent = `Update ${manageKid.name}'s profile.`;
      $("#editNickname").value = manageKid.name;
      $("#editGender").value = manageKid.gender || "NONE";
      $("#editGrade").value = manageKid.grade || "GRADE_1";
      window.Modals?.open("parentProfileEditModal");
    });

    $("#editProfileSave")?.addEventListener("click", () => {
      if (!manageKid) return;
      const nickname = $("#editNickname").value.trim();
      if (nickname) manageKid.name = nickname;
      manageKid.gender = $("#editGender").value;
      manageKid.grade = $("#editGrade").value;
      refreshAfterEdit();
      window.Modals?.close("parentProfileEditModal");
    });

    $("#manageEditSchoolBtn")?.addEventListener("click", () => {
      if (!manageKid) return;
      $("#parentSchoolEditNote").textContent = `Update ${manageKid.name}'s school information.`;
      $("#editSchool").value = manageKid.school || "";
      $("#editTown").value = manageKid.town || "";
      window.Modals?.open("parentSchoolEditModal");
    });

    $("#editSchoolSave")?.addEventListener("click", () => {
      if (!manageKid) return;
      const school = $("#editSchool").value.trim();
      const town = $("#editTown").value.trim();
      if (school) manageKid.school = school;
      if (town) manageKid.town = town;
      refreshAfterEdit();
      window.Modals?.close("parentSchoolEditModal");
    });
  }

  let payKid = null;//pay modal (mock STK push - UI only)

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

  function openPayModal(kid) {
    if (!kid) return;
    payKid = kid;
    resetPayModal();
    $("#parentPayKidName").textContent = kid.name;
    applyPayPlan($("#parentPayPlanSelect .pay-plan-btn[data-plan=\"monthly\"]"));
    $("#parentPayPhone").value = PARENT.contact || "";
    window.Modals?.open("parentPayModal");
  }

  function bindPayModal() {
    $("#managePayBtn")?.addEventListener("click", () => openPayModal(manageKid));

    $("#parentPayPlanSelect")?.addEventListener("click", (event) => {
      const btn = event.target.closest(".pay-plan-btn");
      if (btn) applyPayPlan(btn);
    });

    $("#parentPaySend")?.addEventListener("click", () => {
      const amount = Number($("#parentPayAmount").value);
      const phone = ($("#parentPayPhone").value || "").replace(/\s+/g, "");
      const valid = amount > 0 && /^(?:\+?254|0)?[17]\d{8}$/.test(phone);

      if (!valid) {
        $("#parentPayError").hidden = false;
        return;
      }

      $("#parentPayError").hidden = true;
      $("#parentPayFields").hidden = true;
      $("#parentPayActions").hidden = true;
      $("#parentPaySuccessNote").textContent =
        `STK push sent to ${phone}. Enter your M-Pesa PIN on your phone to complete KES ${amount} for ${payKid?.name || "your child"}.`;
      $("#parentPaySuccess").hidden = false;
      $("#parentPayDoneActions").hidden = false;
    });

    $("#parentPayOk")?.addEventListener("click", () => {
      window.Modals?.close("parentPayModal");
    });
  }


  let detailKid = null;//child details

  function openKidDetail(kid) {
    detailKid = kid;

    const hero = $("#kidDetailHero");
    if (hero) hero.setAttribute("style", themeVars(kid));
    hero?.setAttribute("data-avatar", kid.avatar);

    $("#kidDetailImg").src = avatarSrc(kid);
    $("#kidDetailName").textContent = kid.name;
    $("#kidDetailClass").textContent = kid.cls;
    $("#kidDetailChips").innerHTML = chipsHtml(kid);

    const license = $("#kidDetailLicense");
    license.textContent = `${kid.plan.toUpperCase()}: ${kid.daysLeft} Days Left`;
    license.className = `kid-license ${licenseTone(kid.daysLeft)}`;

    $("#kidDetailLearnBtn").dataset.kidLearn = kid.id;
    $("#kidDetailPayName").textContent = kid.name;
    $("#kidDetailReportsBtn").textContent = `${kid.name}'s Reports`;

    goToNav("kiddetail", kid.name);
    showFloatingBack("dashboard");
  }

  function bindKidDetail() {
    document.addEventListener("click", (event) => {
      const card = event.target.closest("[data-kid-open]");
      if (!card) return;
      if (event.target.closest("[data-kid-edit]")) return; // pencil goes to manage just like yours'
      const kid = kidById(card.dataset.kidOpen);
      if (kid) openKidDetail(kid);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest?.("[data-kid-open]");
      if (!card) return;
      event.preventDefault();
      const kid = kidById(card.dataset.kidOpen);
      if (kid) openKidDetail(kid);
    });

    $("#kidDetailPayBtn")?.addEventListener("click", () => openPayModal(detailKid));
    $("#kidDetailManageBtn")?.addEventListener("click", () => { if (detailKid) openManage(detailKid); });
    $("#kidDetailReportsBtn")?.addEventListener("click", () => {
      if (!detailKid) return;
      goToNav("reports");
      selectReportKid(detailKid);
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

  function fillParentProfile() {//parents profile
    $("#parentProfileName").textContent = PARENT.fullName || PARENT.name;
    $("#parentProfileContact").value = PARENT.contact || "";
    $("#parentProfileEmail").value = PARENT.email || "";
    $("#parentProfileSaved").hidden = true;
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
      window.Modals?.open("parentPasswordModal");
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

    $("#pwOkBtn")?.addEventListener("click", () => window.Modals?.close("parentPasswordModal"));
  }

  const REPORTS = MOCK.reports || {};//reports & analytics
  let reportKid = KIDS[0] || null;

  const assignmentsPager = createPager({
    container: "#reportAssignmentsPagination",
    pageSize: 5,
    onPageChange: () => renderReport(),
  });

  
  function renderReportTabs() {//another aesthetic aka  carousel or whatever
    const tabs = $("#reportKidTabs");
    if (!tabs) return;
    tabs.innerHTML = KIDS.map((kid) => {
      const active = reportKid && kid.id === reportKid.id;
      return `
      <button type="button" class="kid-card kid-id-card report-kid-card ${active ? "active" : ""}"
        style="${themeVars(kid)}" data-report-kid="${kid.id}" data-avatar="${kid.avatar}"
        role="tab" aria-selected="${active}">
        <img class="kid-id-img" src="${avatarSrc(kid)}" alt="" loading="lazy">
        <span class="kid-id-foot">
          <span class="kid-id-name">${kid.name}</span>
          <span class="kid-id-class">${kid.cls}</span>
        </span>
      </button>`;
    }).join("");

    const dots = $("#reportKidDots");//tu-dots sliders
    if (dots) {
      dots.innerHTML = KIDS.map((kid) => `
        <button type="button" class="report-dot ${reportKid && kid.id === reportKid.id ? "active" : ""}"
          data-report-kid="${kid.id}" tabindex="-1"></button>`).join("");
    }
  }

  function applyReportKidSelection(kid) {
    reportKid = kid;
    assignmentsPager.reset();
    renderReportTabs();
    renderReport();
  }

  function selectReportKid(kid) {
    applyReportKidSelection(kid);

    //  bring the chosen kid's card into view on phones
    if (window.matchMedia("(max-width: 640px)").matches) {
      $(`#reportKidTabs [data-report-kid="${kid.id}"]`)
        ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }

  // animated insight-card dashboard — cards/numbers come from the shared,
  // rule-based insights engine (no AI, no invented data); this just renders
  // them. `report` isn't needed here anymore (the engine derives everything
  // from kid.id directly) but stays in the signature so the one call site
  // below doesn't need to change.
  function renderInsights(kid) {
    const el = $("#reportInsights");
    if (!el) return;
    const cards = calculateInsightCards(kid.id);
    renderInsightCards(el, cards);
  }

  function renderReport() {
    if (!reportKid) return;
    const report = REPORTS[reportKid.id];
    if (!report) return;

    $("#reportKidTitle").textContent = `${reportKid.name}'s School Assignment Reports and Analytics`;
    // both the Overview and Insights panels show these same three stats —
    // update every matching element (was two duplicate ids before, so only
    // the first, Overview's, ever got populated).
    $$('[data-report-stat="engagement"]').forEach((el) => { el.textContent = report.engagement; });
    $$('[data-report-stat="average"]').forEach((el) => { el.textContent = report.average; });
    $$('[data-report-stat="bestSubject"]').forEach((el) => { el.textContent = report.bestSubject; });

    renderInsights(reportKid, report);

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

    $("#profileChartTitle").textContent = `${reportKid.name}'s Overall Performance`;

    // same shared chart admin/teacher use — same structure, colors, and
    // learning-area order (subjectLabels), so the same student's chart looks
    // and reads identically everywhere.
    const { subjects, student, classAvg } = report.chart;
    const scoresByCode = {};
    const classAvgByCode = {};
    subjects.forEach(([code], i) => {
      scoresByCode[code] = student[i];
      classAvgByCode[code] = classAvg[i];
    });
    // report.chart.subjects is already this kid's real grade-band learning
    // areas (see mock-data.js's reports builder) — use that list, not the
    // fixed 8-code set, so a lower-grade kid's chart doesn't show phantom
    // bars for learning areas their grade doesn't take yet.
    const labels = subjects.map(([code]) => code);
    if (!hasAnyScore(labels, scoresByCode)) {
      $("#profileChart").innerHTML = "";
    } else {
      $("#profileChart").innerHTML = buildPerformanceChartSVG({
        labels,
        scores: scoresByCode,
        classAverage: classAvgByCode,
        ariaLabel: `${reportKid.name}'s scores and class average by learning area`,
      });
    }

    const filteredSubjectLabels = Object.fromEntries(
      Object.entries(subjectLabels).filter(([code]) => labels.includes(code))
    );
    $("#subjectKey").innerHTML = buildSubjectKeyHTML(filteredSubjectLabels);
  }

  function openAssignmentDetail(row) {
    if (!row || !reportKid) return;

    const outOf = 10;
    const hasScore = row.score != null;
    const gotten = hasScore ? Math.round((row.score / 100) * outOf) : 0;

    $("#assignName").textContent = row.title;
    $("#assignArea").textContent = row.subject;
    $("#assignClass").textContent = reportKid.cls;
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
      const report = REPORTS[reportKid?.id];
      const row = report?.assignments[Number(link.dataset.assignIdx)];
      if (row) openAssignmentDetail(row);
    });
  }

  function bindReports() {
    const pickKid = (event) => {
      const tab = event.target.closest("[data-report-kid]");
      if (!tab) return;
      const kid = kidById(tab.dataset.reportKid);
      if (kid) selectReportKid(kid);
    };
    $("#reportKidTabs")?.addEventListener("click", pickKid);
    $("#reportKidDots")?.addEventListener("click", pickKid);

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


  function licenseRowHtml(kid) {//licenses page
    const tone = licenseTone(kid.daysLeft);
    return `
      <article class="license-row" style="${themeVars(kid)}">
        ${avatarHtml(kid)}
        <div class="license-row-info">
          <strong>${kid.name}</strong>
          <span>${kid.cls}</span>
        </div>
        <span class="kid-license ${tone}">${kid.plan.toUpperCase()}: ${kid.daysLeft} Days Left</span>
        <button type="button" class="pay-btn license-row-pay" data-kid-pay="${kid.id}">
          <img src="assets/icons/mpesa.png" alt="" class="pay-img">
          <span>Pay</span>
        </button>
      </article>`;
  }

  function renderLicenses() {
    const list = $("#parentLicenseList");
    if (list) list.innerHTML = KIDS.map(licenseRowHtml).join("");

    const schoolName = $("#licenseSchoolName");
    if (schoolName && KIDS[0]?.school) schoolName.textContent = KIDS[0].school;
  }

  function bindLicenses() {
    $("#parentLicensesMenuBtn")?.addEventListener("click", () => goToNav("licenses"));

    $("#parentLicenseList")?.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-kid-pay]");
      if (!btn) return;
      const kid = kidById(btn.dataset.kidPay);
      if (kid) openPayModal(kid);
    });
  }


  function bindKidSearch() {
    $("#parentKidSearch")?.addEventListener("input", (event) => {
      renderKidGrids(event.target.value);
    });
  }

  /* demo login gate — shared/scripts/ui/login-gate.js; no real auth backend,
     any submission succeeds. */

  const parentLoginGate = createLoginGate({
    storageKey: "esomaParentLoggedIn",
    appShellSelector: "#parentApp",
    logoutSelectors: ["#parentLogoutBtn", "#parentMobileLogoutBtn"],
  });

  parentLoginGate.bind();

  mountPerformancePanel($("#profilePerformancePanel"));

  $("#parentDashboardName").textContent = PARENT.name;
  renderStats();
  renderKidGrids();
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
  bindKidDetail();
  bindHelpDesk();
  bindParentProfile();
  bindPasswordToggles();
  bindReports();
  bindAssignmentDetail();
  renderReportTabs();
  renderReport();
  renderLicenses();
  bindLicenses();
  bindKidSearch();
  updateBellBadge();
  syncBottomNav("dashboard");

  // mock data is instant, so flash the skeletons briefly on boot; with a real API: setSkeleton(true) before the fetch, false after
  setSkeleton(true);
  window.setTimeout(() => setSkeleton(false), 900);
})();
