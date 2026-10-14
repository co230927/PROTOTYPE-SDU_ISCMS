# PROTOTYPE_VS_PAPER_CHECK.md

Comparison of the prototype code against three parts of `MD FILES/CHAPTER_3_V2.md`:

- **3.2.2 Software Functionalities** — the 20 modules (Groups A to G).
- **3.3.1 Process Models** — every sub-process 1.1 to 6.6.
- **3.4.2 User Interface** — the ten interface figures.

Method: each item was checked against the HTML pages under `director/`, `officehead/`, `staff/`, `login_and_signup/`, and the scripts under `js/`. Nothing was changed. The prototype is a browser-only, `localStorage`/`sessionStorage` demo, so "present" means the flow/screen exists in code, not that it is server-backed.

---

## PARTIAL and MISSING items (summary)

**PARTIAL**

- 3.2.2 — Secure Account Management System with RBAC: registration has no role selector (only office).
- 3.2.2 — Notification Module: partner-expiry automatic notice is not sent to the notification store.
- 3.2.2 — Staff Competency and Knowledge Profile: auto-populated only, no manual entry.
- 3.2.2 — Partner Institution Records: Staff has no partner view page (paper says viewable by all roles).
- 3.2.2 — Contribution Log: static mock period totals only, no description/per-event entry.
- 3.3.1 — Sub-process 1.1 Registration: no role selection; signup is not persisted and creates no Pending account.
- 3.3.1 — Sub-process 5.3 Expiry Monitoring: expiring-soon is computed for display but not raised through sub-process 6.6.
- 3.3.1 — Sub-process 6.4 Action History: sample/demo rows, not a live create/edit/delete log.
- 3.3.1 — Sub-process 6.6 Notifications: partner-expiry automatic notice missing (account, assignment, certificate present).

**MISSING**

- None.

---

## 3.2.2 Software Functionalities (20 modules)

### Group A: Access and Account Management
- Secure Account Management System with Role-Based Access Control (RBAC) — **PARTIAL**: registration collects name, email, password, and office but no role (`login_and_signup/login.html`, `#signupPanel`); login (`login.html`) routes fixed demo emails, and approvals (`director/pending_approvals.html`, dashboard modals, `js/staff_data.js` `pendingRequests`) are in-memory.
- User-Friendly Interface — **PRESENT**: role-adaptive nav in `js/iscms_role.js` + `css/layout_fixes.css`.
- Catalog Management — **PRESENT**: `director/training_categories.html`, `director/knowledge_categories.html`, `director/skill_categories.html` (`js/training_categories_data.js`, `js/skills_data.js`).

### Group B: Training Management
- Training Input Module — **PRESENT**: `staff/staff_trainings.html`, `officehead/my_trainings.html`, `director/my_trainings.html` (`#addTrainingModal`/`#trainingForm`).
- Participation Role Classification — **PRESENT**: role checkboxes on the same forms; role breakdown on dashboards (`js/staff_data.js`).
- Training Assignment Module — **PRESENT**: `director/training_assignments.html` and `officehead/my_trainings.html` assign-to-staff modal; statuses in `js/assignment_status.js`.
- Certificate Upload Module — **PRESENT**: certificate modal on Staff/Office Head training pages (`#modalUploadProof`/`#uploadProofModal`), completes assignment via `markCompleted`.
- Staff Dashboard — **PRESENT**: `staff/staff.html` + `staff/staff_dashboard.js`.

### Group C: Monitoring and Analytics
- Central Monitoring Dashboard — **PRESENT**: `director/dashboard.html`.
- Office Head Oversight Function — **PRESENT**: `officehead/dashboard.html`.
- Filter Module — **PRESENT**: `#globalTimeFilter` (full year / 1st Semester / 2nd Semester, i.e., academic-year halves) plus category/role filters on dashboards, directories, and training lists (`js/staff_data.js`).

### Group D: Communication and Reporting
- Notification Module — **PARTIAL**: composer and automatic account/assignment/certificate notices exist (`js/notifications.js`, `js/staff_data.js`, `js/office_head_trainings_mgmt.js`, `staff/staff_trainings.js`); partner expiry is only computed for display (`getExpiringSoonPartners`), not stored as a notice.
- Data Export and Printing Module — **PRESENT**: CSV/print on `director/reports.html`, `officehead/reports.html`, `staff/staff_reports.html`, directories, and dashboards.

### Group E: Competencies and Knowledge Tracking and Matching
- Competency and Knowledge Tagging Module — **PRESENT**: tagging in the training forms (`js/skills_data.js` + form checkboxes).
- Staff Competency and Knowledge Profile — **PARTIAL**: built only from training tags on `staff/my_skills.html` and `officehead/my_skills.html`; no manual add/edit.
- Find Staff by Competency Function — **PRESENT**: `director/find_staff_by_skill.html`, `officehead/staff_skills.html`.

### Group F: Partner Institution Management
- Partner Institution Records — **PARTIAL**: CRUD on `director/partner_organizations.html` and `officehead/partner_organizations.html` (office-scoped), but no Staff partner page even though the paper says viewable by all roles.
- MOU/Agreement Tracking — **PRESENT**: agreement filenames + expiry on both partner pages (`js/partners_data.js`).
- Contribution Log — **PARTIAL**: period-filtered mock totals only ("Mock contribution totals by period"); no description or per-event/date-range entry form.

### Group G: Evaluation
- Conducted-Training Evaluation — **PRESENT**: `director/training_evaluations.html`, `officehead/training_evaluations.html`, `staff/my_evaluations.html` (overall rating 4 Excellent / 3 Very Good / 2 Good / 1 Poor).

---

## 3.3.1 Process Models (sub-processes)

### Process 1.0: Account and Catalog Management
- Sub-process 1.1 Registration — **PARTIAL**: `login_and_signup/login.html` `#signupPanel` collects name, email, password, office; no role selector, and signup stores nothing (only shows the approval modal).
- Sub-process 1.2 Login and Role Routing — **PRESENT**: `login_and_signup/login.html` (fixed demo emails set `iscms_session_role`).
- Sub-process 1.3 Account Approval or Rejection — **PRESENT**: `director/pending_approvals.html`, Director/Office Head dashboard modals, `js/staff_data.js` (`pendingRequests`, rejection reason).
- Sub-process 1.4 Profile Maintenance — **PRESENT**: `director/profile.html`, `officehead/profile.html`, `staff/staff_profile.html` (`js/iscms_profile_fields.js`).
- Sub-process 1.5 Catalog Management — **PRESENT**: the three catalog pages; deactivated entries hidden from dropdowns (notes on each page).

### Process 2.0: Training Record Management
- Sub-process 2.1 Record Input — **PRESENT**: the training form on `staff/staff_trainings.html`, `officehead/my_trainings.html`, `director/my_trainings.html`.
- Sub-process 2.2 Certificate Upload — **PRESENT**: certificate modal (`#modalUploadProof`/`#uploadProofModal`, `uploadProofFiles`/`proofFiles` + note).
- Sub-process 2.3 Record View and Edit — **PRESENT**: own-records lists and edit modals on the same pages (`js/director_trainings_mgmt.js`, `js/office_head_trainings_mgmt.js`, `staff/staff_trainings.js`).

### Process 3.0: Training Assignment
- Sub-process 3.1 Find Staff by Competency — **PRESENT**: `director/find_staff_by_skill.html`, `officehead/staff_skills.html`.
- Sub-process 3.2 Assignment Creation — **PRESENT**: `director/training_assignments.html` (`#assignmentForm`) and `officehead/my_trainings.html` (`#officeStaffAssignmentForm`); Office Head has no approval step.
- Sub-process 3.3 Assignment Notification — **PRESENT**: `addIscmsNotification({ type: 'assignment', ... })` in `director/training_assignments.html` and `js/office_head_trainings_mgmt.js`.
- Sub-process 3.4 Status Update — **PRESENT**: `js/assignment_status.js` (pending → awaiting_proof → completed; cancelled; derived overdue at deadline + 7 days).

### Process 4.0: Training Evaluation
- Sub-process 4.1 Select Conducted Training — **PRESENT**: `#evalTrainingSelect` lists `recordType === 'Conducted'` rows on both evaluation pages.
- Sub-process 4.2 Record Evaluation — **PRESENT**: participants, feedback summary, per-role feedback, optional overall rating; one evaluation per training key.
- Sub-process 4.3 View Feedback — **PRESENT**: Director/Office Head tables and read-only `staff/my_evaluations.html`.

### Process 5.0: Partner Institution Management
- Sub-process 5.1 Partner Record Create or Edit — **PRESENT**: partner form on `director/partner_organizations.html`, `officehead/partner_organizations.html`.
- Sub-process 5.2 Agreement Files — **PRESENT**: `mouFiles`/`mouFile` fields on the partner forms.
- Sub-process 5.3 Expiry Monitoring — **PARTIAL**: `getExpiringSoonPartners`/`daysUntil` in `js/partners_data.js` drive display flags on the partner pages and dashboards, but no alert is registered through sub-process 6.6.
- Sub-process 5.4 Contribution Summary — **PRESENT**: `#contribPeriodFilter` (Yearly / Quarterly / Semestral) with mock totals on the partner pages.

### Process 6.0: Monitoring, Reports, and Notifications
- Sub-process 6.1 Role-Based Dashboards — **PRESENT**: `director/dashboard.html`, `officehead/dashboard.html`, `staff/staff.html`.
- Sub-process 6.2 Directories and Filters — **PRESENT**: `director/directories.html`, `officehead/directories.html` with time/office/category filters.
- Sub-process 6.3 Competency and Knowledge Profile — **PRESENT**: computed on `staff/my_skills.html`, `officehead/my_skills.html` (`js/skills_data.js`).
- Sub-process 6.4 Action History — **PARTIAL**: `director/reports.html`, `officehead/reports.html` show mostly hard-coded sample rows and `staff/staff_reports.js` falls back to `generateSampleActionHistory()`; there is no live create/edit/delete logger.
- Sub-process 6.5 Export and Print — **PRESENT**: CSV/print controls on the report pages, directories, dashboards, and training lists.
- Sub-process 6.6 Notifications — **PARTIAL**: automatic `account_status`, `assignment`, and `certificate_uploaded` notices and manual `announcement` sends exist (`js/notifications.js`); the automatic `partner expiry` notice is not sent to the store.

---

## 3.4.2 User Interface (ten figures)

- Figure 3.4.2.1 Login and Registration Page — **PRESENT**: `login_and_signup/login.html`.
- Figure 3.4.2.2 Unit Director Central Monitoring Dashboard — **PRESENT**: `director/dashboard.html`.
- Figure 3.4.2.3 Training Assignment Board — **PRESENT**: `director/training_assignments.html`.
- Figure 3.4.2.4 Pending Approvals / Account Management Interface — **PRESENT**: `director/pending_approvals.html` (also dashboard approve/reject modals).
- Figure 3.4.2.5 Find Staff by Competency Interface — **PRESENT**: `director/find_staff_by_skill.html`.
- Figure 3.4.2.6 Partner Institutions Page — **PRESENT**: `director/partner_organizations.html`.
- Figure 3.4.2.7 Training Evaluations Interface — **PRESENT**: `director/training_evaluations.html`.
- Figure 3.4.2.8 Category Management Interface — **PRESENT**: `director/training_categories.html` (with `knowledge_categories.html` and `skill_categories.html`).
- Figure 3.4.2.9 Office Head Dashboard — **PRESENT**: `officehead/dashboard.html`.
- Figure 3.4.2.10 Staff Dashboard — **PRESENT**: `staff/staff.html`.

---

## Exact page and role to open for each 3.4.2 figure

Sign in on `login_and_signup/login.html` with the matching demo email (or open the page while that role is in `sessionStorage`), then open the page below.

| Figure | Exact page to open | Role to sign in as |
| :--- | :--- | :--- |
| 3.4.2.1 Login and Registration Page | `login_and_signup/login.html` | None (public entry point; no session role) |
| 3.4.2.2 Unit Director Central Monitoring Dashboard | `director/dashboard.html` | Unit Director (`director@adzu.edu.ph`) |
| 3.4.2.3 Training Assignment Board | `director/training_assignments.html` | Unit Director (`director@adzu.edu.ph`) |
| 3.4.2.4 Pending Approvals / Account Management Interface | `director/pending_approvals.html` | Unit Director (`director@adzu.edu.ph`) |
| 3.4.2.5 Find Staff by Competency Interface | `director/find_staff_by_skill.html` | Unit Director (`director@adzu.edu.ph`) |
| 3.4.2.6 Partner Institutions Page | `director/partner_organizations.html` | Unit Director (`director@adzu.edu.ph`) |
| 3.4.2.7 Training Evaluations Interface | `director/training_evaluations.html` | Unit Director (`director@adzu.edu.ph`) |
| 3.4.2.8 Category Management Interface | `director/training_categories.html` | Unit Director (`director@adzu.edu.ph`) |
| 3.4.2.9 Office Head Dashboard | `officehead/dashboard.html` | Office Head (`officehead@adzu.edu.ph`) |
| 3.4.2.10 Staff Dashboard | `staff/staff.html` | Staff (`staff@adzu.edu.ph`) |
