/* ═══════════════════════════════════════════
   THEME TOGGLE
   ═══════════════════════════════════════════ */
const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
  const html    = document.documentElement;
  const current = html.getAttribute("data-theme") || "light";
  const next    = current === "dark" ? "light" : "dark";

  // Add transition class for smooth swap, remove after animation
  html.classList.add("theme-transitioning");
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  setTimeout(() => html.classList.remove("theme-transitioning"), 300);
});

/* ═══════════════════════════════════════════
   SVG ICON LIBRARY  (inline, no emoji)
   ═══════════════════════════════════════════ */
const ICONS = {
  file:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  pages:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  words:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>`,
  chars:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
  chevron:  `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="chevron"><polyline points="6 9 12 15 18 9"/></svg>`,
  check:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`,
  x:        `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  alert:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  info:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  strength: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  weak:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  improve:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  edit:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  bot:      `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>`,
  dot:      `<svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor" aria-hidden="true"><circle cx="3" cy="3" r="3"/></svg>`,
  trash:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,
};

/* ═══════════════════════════════════════════
   ESCAPE HELPER
   ═══════════════════════════════════════════ */
function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ═══════════════════════════════════════════
   FILE DROP ZONE BEHAVIOUR
   ═══════════════════════════════════════════ */
const fileDrop     = document.getElementById("file-drop");
const fileInput    = document.getElementById("resume-upload");
const fileDropText = document.getElementById("file-drop-text");

fileInput.addEventListener("change", () => updateFileLabel(fileInput.files[0]));

fileDrop.addEventListener("dragover", (e) => { e.preventDefault(); fileDrop.classList.add("dragover"); });
fileDrop.addEventListener("dragleave", () => fileDrop.classList.remove("dragover"));
fileDrop.addEventListener("drop", (e) => {
  e.preventDefault();
  fileDrop.classList.remove("dragover");
  const f = e.dataTransfer.files[0];
  if (f) {
    const dt = new DataTransfer();
    dt.items.add(f);
    fileInput.files = dt.files;
    updateFileLabel(f);
  }
});

function updateFileLabel(file) {
  if (!file) return;
  fileDrop.classList.add("has-file");
  fileDropText.textContent = file.name;
}

/* ═══════════════════════════════════════════
   FORM SUBMIT
   ═══════════════════════════════════════════ */
const form          = document.getElementById("review-form");
const resultsSection= document.getElementById("results");
const resultsContent= document.getElementById("results-content");
const submitBtn     = document.getElementById("submit-btn");
const submitLabel   = document.getElementById("submit-label");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file           = fileInput.files[0];
  const jobDescription = document.getElementById("job-description").value.trim();
  if (!file || !jobDescription) return;

  const formData = new FormData();
  formData.append("resume", file);
  formData.append("jobDescription", jobDescription);

  // Loading state
  submitBtn.disabled = true;
  submitLabel.textContent = "Analyzing…";
  resultsSection.classList.remove("hidden");
  resultsContent.innerHTML = `
    <div class="loading-card">
      <div class="spinner" aria-hidden="true"></div>
      <span>Extracting resume text and generating AI feedback — this may take a few seconds.</span>
    </div>`;

  try {
    const response = await fetch("/api/review", { method: "POST", body: formData });

    const ct = response.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const txt = await response.text();
      throw new Error(`Unexpected server response (${response.status}). Make sure the server is running.\n\n${txt.slice(0, 200)}`);
    }

    const data = await response.json();

    if (!response.ok) {
      showError(data.error || "Something went wrong.");
    } else {
      renderResults(data);
    }

  } catch (err) {
    showError(err.message);
  } finally {
    submitBtn.disabled = false;
    submitLabel.textContent = "Analyze Resume";
  }
});

function showError(msg) {
  resultsContent.innerHTML = `
    <div class="error-card">
      ${ICONS.alert}
      <span>${esc(msg)}</span>
    </div>`;
}

/* ═══════════════════════════════════════════
   RENDER RESULTS
   ═══════════════════════════════════════════ */
function renderResults(data) {
  const { score, matched, missing, extraction, jobWordCount, aiFeedback } = data;
  const { pageCount, wordCount, charCount, preview, fullText } = extraction;

  const tier      = score >= 70 ? "high" : score >= 40 ? "mid" : "low";
  const tierLabel = score >= 70 ? "Strong Match" : score >= 40 ? "Partial Match" : "Low Match";
  const tierDesc  = score >= 70
    ? "Your resume aligns well with this role."
    : score >= 40
    ? "Some alignment — key gaps remain."
    : "Significant gaps against the job requirements.";

  const safeFullText = esc(fullText);

  resultsContent.innerHTML = `

    <!-- ── Extraction ── -->
    <div class="r-card">
      <div class="r-card-title">
        ${ICONS.file}
        Resume Text Extracted
      </div>
      <div class="extraction-meta">
        <span class="meta-chip">${ICONS.pages} ${pageCount} page${pageCount !== 1 ? "s" : ""}</span>
        <span class="meta-chip">${ICONS.words} ${wordCount.toLocaleString()} words</span>
        <span class="meta-chip">${ICONS.chars} ${charCount.toLocaleString()} chars</span>
      </div>
      <div class="extraction-preview">${esc(preview).replace(/\n/g, "<br>")}</div>
      <details class="toggle-details">
        <summary>${ICONS.chevron} Show full extracted text</summary>
        <pre class="full-text">${safeFullText}</pre>
      </details>
    </div>

    <!-- ── Score ── -->
    <div class="r-card">
      <div class="score-card">
        <div class="score-ring ${tier}">
          <span class="score-num">${score}</span>
          <span class="score-pct">/ 100</span>
        </div>
        <div class="score-info">
          <div class="score-label">${tierLabel}</div>
          <div class="score-desc">${tierDesc}</div>
          <div class="score-bar-track">
            <div class="score-bar-fill ${tier}" style="width:${score}%"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Keywords ── -->
    <div class="keyword-grid">
      <div class="r-card">
        <div class="r-card-title">
          ${ICONS.check}
          Matched
          <span class="keyword-count">(${matched.length})</span>
        </div>
        <div class="tag-list">
          ${matched.length
            ? matched.map(k => `<span class="tag tag-matched">${esc(k)}</span>`).join("")
            : `<span class="no-items">None found</span>`}
        </div>
      </div>
      <div class="r-card">
        <div class="r-card-title">
          ${ICONS.x}
          Missing
          <span class="keyword-count">(${missing.length})</span>
        </div>
        <div class="tag-list">
          ${missing.length
            ? missing.map(k => `<span class="tag tag-missing">${esc(k)}</span>`).join("")
            : `<span class="no-items">None — great coverage!</span>`}
        </div>
        ${missing.length ? `
        <div class="tip-row">
          ${ICONS.info}
          <span>Consider adding these to your resume if you have the relevant experience.</span>
        </div>` : ""}
      </div>
    </div>

    <!-- ── AI Feedback ── -->
    ${renderAiFeedback(aiFeedback)}
  `;
}

/* ═══════════════════════════════════════════
   RENDER AI FEEDBACK
   ═══════════════════════════════════════════ */
function renderAiFeedback(ai) {
  if (!ai) return "";

  if (ai.error) {
    return `
      <div class="error-card">
        ${ICONS.alert}
        <span>AI feedback unavailable: ${esc(ai.error)}</span>
      </div>`;
  }

  const list = (items, icon) =>
    Array.isArray(items) && items.length
      ? `<ul class="ai-list">${items.map(i => `<li>${icon}<span>${esc(i)}</span></li>`).join("")}</ul>`
      : `<p class="no-items">None provided.</p>`;

  const bullet = ai.rewrittenBullet || {};
  const bulletBlock = (bullet.original || bullet.rewritten) ? `
    <div class="ai-divider"></div>
    <div class="ai-subsection">
      <div class="ai-sub-title">${ICONS.edit} Rewritten Bullet Point</div>
      <div class="rewrite-block">
        <div class="rewrite-row rewrite-before">
          <div class="rewrite-label">${ICONS.trash} Before</div>
          <p>${esc(bullet.original)}</p>
        </div>
        <div class="rewrite-row rewrite-after">
          <div class="rewrite-label">${ICONS.check} After</div>
          <p>${esc(bullet.rewritten)}</p>
        </div>
      </div>
    </div>` : "";

  return `
    <div class="r-card">
      <div class="ai-header">
        ${ICONS.bot}
        <span class="ai-header-title">AI Feedback</span>
        <span class="ai-model-badge">Groq · OSS 120B</span>
      </div>

      ${ai.overallFeedback
        ? `<div class="ai-summary">${esc(ai.overallFeedback)}</div>`
        : ""}

      <div class="ai-subsection">
        <div class="ai-sub-title">${ICONS.strength} Strengths</div>
        ${list(ai.strengths, ICONS.check)}
      </div>

      <div class="ai-divider"></div>

      <div class="ai-subsection">
        <div class="ai-sub-title">${ICONS.weak} Weaknesses</div>
        ${list(ai.weaknesses, ICONS.dot)}
      </div>

      <div class="ai-divider"></div>

      <div class="ai-subsection">
        <div class="ai-sub-title">${ICONS.improve} How to Improve</div>
        ${list(ai.improvements, ICONS.dot)}
      </div>

      ${bulletBlock}
    </div>
  `;
}
