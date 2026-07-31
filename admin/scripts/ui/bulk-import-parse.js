//Note: ignore this since you have your logic flow backend
export function initBulkImportParseUI({
  elements,
  helpers,
}) {
  const {
    dropZoneEl,
    bulkFileInput,
    importClearBtn,
    importPreviewWrap,
    importPreviewCount,
    importPreviewBody,
    importSubmitBtn,
  } = elements;

  const { escapeHTML } = helpers;

  let parsedImportRows = [];

  function getParsedRows() {
    return parsedImportRows;
  }

  function showImportError(msg) {
    parsedImportRows = [];
    if (importPreviewWrap) importPreviewWrap.hidden = true;
    if (importSubmitBtn) importSubmitBtn.disabled = true;

    const titleEl = dropZoneEl?.querySelector(".drop-title");
    if (titleEl) titleEl.textContent = "⚠ " + msg;
    dropZoneEl?.classList.add("drop-error");
  }

  function showImportPreview(rows) {
    if (!importPreviewWrap || !importPreviewCount || !importPreviewBody || !importSubmitBtn) return;
    importPreviewCount.textContent = `${rows.length} student${rows.length !== 1 ? "s" : ""} ready to import`;
    importPreviewBody.innerHTML =
      rows
        .slice(0, 12)
        .map(
          (row) => `
        <tr>
          <td>${escapeHTML(row.name)}</td>
          <td>${escapeHTML(row.nickname || "—")}</td>
          <td>${escapeHTML(row.guardian || "—")}</td>
          <td>${escapeHTML(row.contact || "—")}</td>
          <td>${escapeHTML(row.admissionNumber || "—")}</td>
        </tr>
      `,
        )
        .join("") +
      (rows.length > 12
        ? `<tr><td colspan="5" class="import-more-row">…and ${rows.length - 12} more</td></tr>`
        : "");

    importPreviewWrap.hidden = false;
    importSubmitBtn.disabled = false;
  }

  function resetImportModal() {
    parsedImportRows = [];
    if (importPreviewWrap) importPreviewWrap.hidden = true;
    if (importSubmitBtn) importSubmitBtn.disabled = true;
    if (bulkFileInput) bulkFileInput.value = "";

    const titleEl = dropZoneEl?.querySelector(".drop-title");
    if (titleEl) titleEl.textContent = "Drag & drop your file here";
    dropZoneEl?.classList.remove("drop-error", "drop-active");
  }

  function parseBulkFile(file) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showImportError("File is too large (max 5 MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
        if (!rows.length) {
          showImportError("The file appears to be empty.");
          return;
        }

        const header = rows[0].map((cell) => String(cell).toLowerCase().trim());
        const col = (key) => header.findIndex((h) => key.some((k) => h.includes(k)));
        const nameIdx = col(["student name", "name", "student"]);
        const nickIdx = col(["nickname", "nick"]);
        const guardIdx = col(["guardian", "parent"]);
        const contIdx = col(["contact", "phone", "mobile"]);
        const admIdx = col(["admission", "adm no", "adm. no", "number"]);
        const invIdx = col(["invite"]);
        const actIdx = col(["active", "status"]);

        const dataStart = nameIdx >= 0 ? 1 : 0;
        const nIdx = nameIdx >= 0 ? nameIdx : 0;

        parsedImportRows = rows
          .slice(dataStart)
          .filter((row) => String(row[nIdx] || "").trim())
          .map((row) => ({
            name: String(row[nIdx] || "").trim(),
            nickname: String(row[nickIdx] || "").trim(),
            guardian: String(row[guardIdx] || "").trim(),
            contact: String(row[contIdx] || "").trim(),
            admissionNumber: String(row[admIdx] || "").trim(),
            inviteStatus: /accepted/i.test(String(row[invIdx] || "")) ? "Accepted" : "Pending",
            active: /true|active|yes|1/i.test(String(row[actIdx] || "")),
          }));

        if (!parsedImportRows.length) {
          showImportError("No valid student rows found.");
          return;
        }
        showImportPreview(parsedImportRows);
      } catch (err) {
        showImportError("Could not read the file. Please check it is a valid .xlsx, .xls, or .csv.");
      }
    };

    reader.readAsArrayBuffer(file);
  }

  // Drop zone wiring
  if (dropZoneEl && bulkFileInput) {
    dropZoneEl.addEventListener("click", () => bulkFileInput.click());
    dropZoneEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        bulkFileInput.click();
      }
    });
    dropZoneEl.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZoneEl.classList.add("drop-active");
    });
    dropZoneEl.addEventListener("dragleave", () => dropZoneEl.classList.remove("drop-active"));
    dropZoneEl.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZoneEl.classList.remove("drop-active");
      const file = e.dataTransfer?.files?.[0];
      if (file) parseBulkFile(file);
    });

    bulkFileInput.addEventListener("change", () => {
      const file = bulkFileInput.files?.[0];
      if (file) parseBulkFile(file);
    });
  }

  importClearBtn?.addEventListener("click", resetImportModal);

  return {
    getParsedRows,
    resetImportModal,
  };
}