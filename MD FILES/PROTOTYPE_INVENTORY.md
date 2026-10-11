# PROTOTYPE_INVENTORY.md

Inventory of the SDU Staff Training and Management System (ISCMS) prototype, rebuilt from the code currently in this repository.

- Data is browser-only. There is no backend: records are seed arrays in JS plus `localStorage` / `sessionStorage`.
- There are **three working roles**: **Unit Director** (`director/`), **Office Head** (`officehead/`), and **Staff** (`staff/`). The active role is stored in `sessionStorage['iscms_session_role']`. The `secretary/` folder is leftover and unreachable (see section 6).
- **No 1-to-5 rating can be created from the UI.** The only evaluation that can be saved from a reachable page is the event feedback evaluation, and that **applies to Conducted trainings only** (Attended trainings are never evaluated). The old Office-Head rating form is gone and the 1-to-5 writer module (`js/evaluation_data.js`) is not called by anything reachable.
- Required/optional below reflect the HTML `required` attribute **and** the JS validation actually performed.
- Dropdown option lists are quoted exactly as they appear in the markup.

---

## 1. Roles and sidebar pages

Sidebar links are repeated inside each HTML file. Some are added at runtime by `js/iscms_role.js`:

- `iscmsInjectDirectorNavExtras()` inserts **My Trainings**, **Training Evaluations**, and one collapsible **Catalogs** group before the Profile link (only if not already present).
- The **Catalogs** group (Director/Secretary sidebar) expands to **Training Categories**, **Knowledge Categories**, and **Competencies**. It opens automatically when the current page is one of those three (`iscmsSetupCatalogNavGroups()`).
- On the Director pages that already contain those links statically (`training_categories.html`, `knowledge_categories.html`, `skill_categories.html`, `my_trainings.html`, `training_evaluations.html`), the group is in the HTML; on the others it is injected.

### Director (`director/`)

Effective sidebar: Dashboard, Directories, Find Staff by Competency, Training Assignments, My Trainings, Training Evaluations, Partners, Reports, Pending Approvals, Profile, plus the **Catalogs** group (Training Categories, Knowledge Categories, Competencies).

| Page | What the user can do |
|------|----------------------|
| Dashboard (`dashboard.html`) | Overview cards, Training Role Breakdown, Needs Attention, office staff list, Training Category Coverage; approve/reject pending account requests (modals). |
| Directories (`directories.html`) | Browse office cards, staff records and per-staff training detail ("View Staff Info"); "Assign Training" from a staff row. |
| Find Staff by Competency (`find_staff_by_skill.html`) | Filter staff by competency (and knowledge); row details modal; select rows and Assign → `training_assignments.html?staff=...`. |
| Partners (`partner_organizations.html`) | Partner directory; add/edit partners; view partner detail and contribution breakdown. |
| Reports (`reports.html`) | "Report Action History" and recycle-bin view (one-time recycle demo seed). |
| Pending Approvals (`pending_approvals.html`, heading "Account Management") | Pending account approvals, Approved Accounts History, Rejected Accounts History; approve/reject with reason. |
| Training Assignments (`training_assignments.html`) | Create a training assignment (offices + staff + roles), Assignment Board (incomplete/complete), details, delete → recycle bin. |
| My Trainings (`my_trainings.html`) | Unit Director's own training records and uploaded certificates (own records only). |
| Training Evaluations (`training_evaluations.html`) | Create/edit event feedback evaluations for **Conducted** trainings (all offices). |
| Training Categories / Knowledge Categories / Competencies (inside Catalogs) | Add, rename, deactivate/reactivate training categories, knowledge categories, and competencies. |
| Profile (`profile.html`) | Activity summary; edit contact details; change password (simulated); notification preferences. |
| Log Out | Clears session role and goes to `../login_and_signup/login.html`. |

### Office Head (`officehead/`)

Effective sidebar: Dashboard, Directories, Staff Competencies, Partners, My Trainings, **Training Evaluations**, **My Competencies**, Reports, Profile.

| Page | What the user can do |
|------|----------------------|
| Dashboard (`dashboard.html`) | ACCA-centric overview (Accounts, Trainings, ACCA Staff, Attended/Conducted, Role Breakdown, Needs Attention, Top Performers, Category Coverage). Has a visible **"Assign Training"** button that goes to `my_trainings.html?assign=1` (opens the assign-to-staff modal). |
| Directories (`directories.html`) | ACCA staff directory scoped to the office; staff-details view (records, training history, certificates). |
| Staff Competencies (`staff_skills.html`) | ACCA-only competency directory; filter by competency; row details modal; Assign/Assign selected → `my_trainings.html?staff=...`. |
| Partners (`partner_organizations.html`) | Partner directory; can add/edit only partners whose `office` is ACCA; others are view-only. |
| My Trainings (`my_trainings.html`) | Three tabs: **My Trainings** (own joined records), **Assigned Trainings** (assignments issued to the Office Head; Complete/Cancelled; upload certificate), **Assigned to my staff** (assignments the Office Head created for ACCA staff, with status), and **Uploaded files**. Has the "Assign Training" modal. |
| Training Evaluations (`training_evaluations.html`) | Create/edit event feedback evaluations for **Conducted** trainings that belong to ACCA and ACCA staff; saves to the same key as the Director page. |
| My Competencies (`my_skills.html`) | Detailed cards for the Office Head's own mapped competencies/knowledge, built from `officeHeadTrainings` tags. |
| Reports (`reports.html`) | "Report Action History" and recycle-bin view (one-time recycle demo seed). |
| Profile (`profile.html`) | Activity summary; edit contact details; change password (simulated); notification preferences. |
| Log Out | Ends the session. |

### Staff (`staff/`)

Effective sidebar: Dashboard, My Trainings, **Evaluations**, My Competencies, Reports, Profile.

| Page | What the user can do |
|------|----------------------|
| Dashboard (`staff.html`) | Personal stats: Trainings, My Competencies, Attended/Conducted, Events, Training Breakdown, Needs Attention, Category Coverage. |
| My Trainings (`staff_trainings.html`) | Own training records; assigned trainings with Complete/Cancelled and certificate upload; Uploaded Files tab. |
| Evaluations (`my_evaluations.html`) | **Read-only.** Lists the staff member's Conducted trainings (`staffTrainings`) with the saved evaluation for each (participants responded, feedback summary, per-role feedback, level). Shows "No feedback recorded yet" if a Conducted training has no evaluation. |
| My Competencies (`my_skills.html`) | Summary badges plus detailed cards for the Staff member's mapped competencies/knowledge, built from `staffTrainings` tags (Attended/Conducted counts, sessions bar, latest session date, expandable list). |
| Reports (`staff_reports.html`) | Action History; clear all reports (moves them to a staff recycle bin); restore/delete permanently from the bin. |
| Profile (`staff_profile.html`) | View competencies/knowledge; edit contact details; change password (simulated). |
| Log Out | Ends the session. |

---

## 2. Forms and modals

### Training record form
Used by `staff/staff_trainings.html`, `officehead/my_trainings.html`, `director/my_trainings.html` (modal `#addTrainingModal`, form `#trainingForm`). Fields:

| Field (id) | Label | Required | Options / notes |
|------------|-------|----------|-----------------|
| `trainingName` | Training/Event Name | Yes | Text |
| `trainingVenue` | Venue | Yes | Text |
| `trainingStartDate` | Start Date | Yes | Date |
| `trainingEndDate` | End Date | Yes | Date; JS rejects end < start |
| `trainingNature` | Nature | Yes | `Internal`, `External` |
| `trainingScope` | Scope | Yes | `Local`, `Regional`, `National`, `International` |
| `trainingCategory` | Category | Yes | Populated from active `TrainingCategories` |
| `trainingRecordType` | Record type | Yes | `Attended`, `Conducted` |
| `requiredSkillsCheckboxes` (name `requiredSkills`) | Competencies (Director) / Required Skills (Staff, Office Head) | Optional | Checkboxes, values = active skill ids |
| `knowledgeCheckboxes` (name `knowledge`) | Knowledge | Optional | Checkboxes, values = active knowledge ids (Director and Office Head pages) |
| role checkboxes (`name="roles"`) | Roles | Yes (≥1) | `Participant`, `Facilitator`, `Organizer`, `Speaker`, `Host/Emcee`, `Documenter` |
| `trainingDescription` | Description | Optional | Textarea |

Certificate upload modal (`#modalUploadProof` / `#uploadProofModal`): `uploadProofFiles` / `proofFiles` (file, `multiple`), `uploadProofNote` / `proofNote` (textarea, optional).

The Office Head page now also loads `js/skills_data.js` and populates both `#requiredSkillsCheckboxes` and `#knowledgeCheckboxes`; its init, add, edit, and save handlers populate, restore, and store `requiredSkills` and `knowledge` on the record, mirroring the Director form. So the Director, Office Head, and Staff forms can all tag competencies, and the Director and Office Head forms can also tag knowledge. (The Staff form has competency checkboxes only.)

### Training assignment form (Director)
`director/training_assignments.html`, form `#assignmentForm`:

| Field (id) | Label | Required | Options / notes |
|------------|-------|----------|-----------------|
| `f_name` | Training Name | Yes | Text |
| `f_desc` | Description / Objectives | Optional | Textarea |
| `f_cat` | Category | Yes (by flow) | Populated from active training categories |
| `f_deadline` | Deadline | Yes | Date |
| `f_nature` | Nature | — | `Internal`, `External` |
| `f_scope` | Scope | — | `Local`, `Regional`, `National`, `International` |
| `f_venue` | Venue | Optional | Text |
| `requiredSkillsGrid` (name `requiredSkills`) | Required Skills | Optional | Checkboxes (active skill ids) |
| `officeSelector` | Offices included | Yes (≥1) | Buttons: `SDU` (key `SDU_ONLY`), `ACCA`, `ACES`, `ACLG`, `APC`, `CCES`, `ALTEC` |
| `staffSelectionGrid` | Staff members | Yes (≥1) | Cards per selected office; per-card role select `ROLE_OPTIONS = Participant, Facilitator, Speaker, Organizer, Host/Emcee, Documenter` |

Also has filters (`boardSearch`, `boardOfficeFilter`) and a Delete confirmation that moves the assignment to the recycle bin.

### Assign-to-staff modal (Office Head)
`officehead/my_trainings.html`, form `#officeStaffAssignmentForm`:

| Field (id) | Required | Options |
|------------|----------|---------|
| `assignmentTrainingTitle` | Yes | Text |
| `assignmentDeadline` | Yes | Date |
| `assignmentRole` | Yes (default Participant) | `Participant`, `Facilitator`, `Organizer`, `Speaker`, `Host/Emcee`, `Documenter` |
| `assignedStaff` (checkboxes) | Yes (≥1) | ACCA staff except the Office Head himself |

Query-string handling on the same page: `?staff=<names>` pre-checks matching staff and closes the modal if none match; `?assign=1` opens the modal unconditionally. The Office Head Dashboard "Assign Training" button uses `my_trainings.html?assign=1`.

### "Assigned to my staff" tab (Office Head)
`officehead/my_trainings.html` tab `data-tab="staffassign"`, table `#staffAssignmentsBody`. No form: it is rendered read-only by `renderStaffAssignments()` in `js/office_head_trainings_mgmt.js`. Columns: STAFF, TRAINING, ROLE, DEADLINE, STATUS, DESCRIPTION. Source: `iscms_office_head_staff_assignments_v1_<office>`. The Status column maps stored/computed status to `Pending`, `Awaiting certificate`, `Completed`, `Cancelled`, or `Overdue` (via `IscmsAssignmentStatus.effectiveStatus`).

### Event evaluation form (`iscms_training_evaluations_v1`) — Conducted trainings only
Director: `director/training_evaluations.html`. Office Head: `officehead/training_evaluations.html` (same layout, scoped to the Office Head's own office `ACCA` / ACCA staff). Both forms are `#evaluationForm`, modal `#evaluationModal`:

| Field (id) | Required | Options |
|------------|----------|---------|
| `evalTrainingSelect` | Yes | Conducted trainings. Director sources: `staffTrainings`, `officeHeadTrainings`, `iscms_director_trainings_v1`, and seeded training events. Office Head sources: the same, filtered to its own office. Only `recordType === 'Conducted'` rows are listed. |
| `evalParticipants` | Yes | Number (`min=0`, step 1) — a participant count, not a rating |
| `evalLevel` | Optional | `Not set`, `Demonstrated`, `Partially Demonstrated`, `Not Demonstrated` |
| `evalSummary` | Yes | Textarea |
| `evalRoleFeedback` | Optional | Textarea |

Both pages read and write the same key `iscms_training_evaluations_v1`. The Office Head page displays only evaluations whose `trainingKey` matches one of its own-office Conducted trainings (it does not append orphan rows), so Director/SDU evaluations are not shown there. On a fresh load the Office Head page falls back to the seeded staff/head records and the seed evaluation when `iscms_training_evaluations_v1` is empty (see "Seeded baseline data" below).

### Staff "My Evaluations" (read-only)
`staff/my_evaluations.html`. No form. Table `#myEvaluationsBody` with columns TRAINING TITLE, DATE, PARTICIPANTS RESPONDED, FEEDBACK SUMMARY, PER-ROLE FEEDBACK, LEVEL. Reads `staffTrainings` (host page's storage key) filtered to `recordType === 'Conducted'`, matches each against `iscms_training_evaluations_v1` by the same `title|office|date` key, and prints "No feedback recorded yet" when there is no saved evaluation. On a fresh load it falls back to the seeded staff trainings and the seed evaluation (see "Seeded baseline data" below) when its stores are empty.

### "My Competencies & Knowledge" detail cards (Staff + Office Head)
`staff/my_skills.html` (reads `staffTrainings`) and `officehead/my_skills.html` (reads `officeHeadTrainings`). No form. Each page keeps the existing badges summary at the top (`#mySkillsWrap`), then renders a card grid (`#mySkillCards`) with one card per mapped competency/knowledge. Each card shows: name, category, a Competency/Knowledge tag, Attended count, Conducted count, a Sessions count with a proportional bar, the latest session date, and an expandable `<details>` list of the matching trainings (Training, Date, Role, Record type). A training counts for a competency when its `requiredSkills` contains the id; a knowledge area counts when its `knowledge` contains the id. The seeded baseline records for both personas carry competency and knowledge tags (see "Seeded baseline data" below), so the cards show real counts on a fresh load.

### Seeded baseline data (fresh-load content)
`js/staff_data.js` seeds the demo training records (through `generateCompletedTrainings`). The two fixed personas each get **two records marked `Conducted`**, and both carry competency and knowledge tags using only ids present in their mapped catalogs:

- **Elena Mae R. Castro** (Staff): competencies `community-organizing`, `facilitation`, `stakeholder-engagement`, `peace-education`; knowledge `program-ethics`, `stakeholder-mapping`, `learning-design`.
- **Carlos Miguel V. Tingson** (Office Head): competencies `leadership`, `public-speaking`, `facilitation`, `project-management`; knowledge `community-development`, `policy-analysis`, `participatory-learning`.

Two helpers in `js/staff_data.js` expose this seed to pages:
- `iscmsBuildSeedTrainings(personName, officeCode)` returns the persona's baseline records, including `recordType`, `requiredSkills`, and `knowledge`.
- `iscmsSeedTrainingEvaluations()` returns **one** seed evaluation (participants responded 12; a feedback summary; role feedback; level `Demonstrated`) keyed to Elena's first Conducted record.

`staff/my_skills.html`, `staff/my_evaluations.html`, `officehead/my_skills.html`, and `officehead/training_evaluations.html` fall back to these helpers when their storage keys are empty, so those pages show real content on a fresh load. The seed evaluation is a **read-only fallback**: it is shown until anything is saved to `iscms_training_evaluations_v1`, after which the stored list is used instead.

### No 1-to-5 rating (explicit)
No reachable form creates a 1-to-5 rating. The rating UI (Office-Head inline rating form) was removed from the staff-details view, and `director/rate_office_heads.html` is not linked. The module `js/evaluation_data.js` and the key `iscms_evaluations_v1` remain and still define `{staffName, skillId, skillName, rating 1–5, comment, trainingTitle, date, ratedBy, office, subjectRole}` plus `addEvaluation` / `addOfficeHeadEvaluation` and `RATING_LABELS` (`1 Needs Improvement`, `2 Below Average`, `3 Satisfactory`, `4 Proficient`, `5 Excellent`), but nothing reachable calls the writers. `officehead/my_evaluation.html` (which read a 1–5 trend) is also unreachable.

### Partner record form
`director/partner_organizations.html` and `officehead/partner_organizations.html` (modal `#partnerFormModal`, form `#partnerForm`):

| Field (id) | Required | Options / notes |
|------------|----------|-----------------|
| `partnerEditId` | — | Hidden; set when editing |
| `partnerName` | Yes | Organization name |
| `partnerType` | — | `Local Government`, `National Government`, `NGO`, `Academic Institution`, `Humanitarian`, `Faith-Based`, `Private Sector` |
| `partnerContact` | Yes | Contact person |
| `partnerEmail` | Yes | Email |
| `partnerPhone` | Optional | Text |
| `partnerExpiry` | Yes | MOU expiry date |
| `partnerOffice` | — | `SDU`, `ACCA`, `ACES`, `ACLG`, `APC`, `CCES`, `ALTEC` (fixed to ACCA on the Office Head page) |
| `partnerSignedBy` | Yes | Name and role of signatory |
| `partnerMouFile` | Optional | File (`multiple`); only filenames are stored |

Contribution breakdown filter (`contribPeriodFilter`): `Yearly`, `Quarterly` (default selected), `Semestral`.

### Competency form (Director)
`director/skill_categories.html`: `newSkillName` text input + "Add competency" (`SkillCategories.addSkill`). Rename uses `prompt()`; deactivate/reactivate per row.

### Knowledge category form (Director)
`director/knowledge_categories.html`: `newKnowledgeName` text input + "Add knowledge" (`KnowledgeCategories.addKnowledge`). Rename via `prompt()`; deactivate/reactivate per row.

### Training category form (Director)
`director/training_categories.html`: `newCategoryName` text input + "Add category" (`TrainingCategories.add`). Rename via `prompt()`; deactivate/reactivate per row. Default categories: `Community Organizing`, `Project Management`, `Peace Education & Advocacy`, `Environmental Stewardship`, `Cultural Heritage & Arts`, `Health & Livelihood`, `Leadership & Governance`, `Data & Digital Literacy`, `Other`.

### Profile forms (Director / Office Head / Staff)
`director/profile.html`, `officehead/profile.html`, `staff/staff_profile.html`:

| Field (id) | Notes |
|------------|-------|
| `profileDisplayName` | Text (initially disabled until Edit) |
| `profileEmail` | Email |
| `profileContact` | Tel |
| `profileEmploymentStatus` | Options: `Regular/Permanent`, `Probationary`, `Contractual/Fixed-Term` |
| `profileJobFunction` | Director: `Unit Director`; Office Head: `Director-Office Head`; Staff: `Program Officer`, `Admin Officer` |
| `pwCurrent`, `pwNew`, `pwConfirm` | Password change (simulated; no real change) |
| `prefEmailAlerts`, `prefSystemAlerts` | Notification preferences (checkboxes) |

Saved to `iscms_<role>_profile_v1` as `{displayName, email, contact, notifyEmail, notifySystem}`; employment/job function saved to `iscms_profile_extras_v1` keyed `"<role>::<displayName>"`.

### Notification composer (`js/notifications.js`, modal `#iscmsAnnouncementModal`, form `#iscmsAnnouncementForm`)

| Field (id) | Required | Options / notes |
|------------|----------|-----------------|
| `iscmsAnnouncementAudience` | Yes | Office Head: `Director` (`leadership`), `Staff in my office` (`office_staff`). Others: `All Staff` (`all_staff`), `All Office Heads` (`all_heads`), `Staff in a specific office` (`office_staff`), `Office Head of a specific office` (`office_head`) |
| `iscmsAnnouncementOffice` | Conditional | Offices `SDU` (key `SDU_ONLY`), `ACCA`, `ACES`, `ACLG`, `APC`, `CCES`, `ALTEC`; hidden/fixed for Office Head |
| `iscmsAnnouncementPerson` | No | `Everyone in selected group` + matching people |
| `iscmsAnnouncementTitle` | Yes | `maxlength=100` |
| `iscmsAnnouncementMessage` | Yes | Textarea, `maxlength=1000` |

### Registration / signup and login (`login_and_signup/login.html`)
Signup panel `#signupPanel` (JS-validated, no `required` attributes):

| Field (id) | Label | Required (JS) | Options |
|------------|-------|---------------|---------|
| `signupName` | FULL NAME | Yes | Text |
| `signupEmail` | EMAIL | Yes | Email |
| `signupPassword` | PASSWORD | Yes | Password |
| `signupOffice` | OFFICE | Yes | `SDU — Social Development Unit`, `ACCA`, `ACES`, `ACLG`, `APC`, `CCES`, `ALTEC` |

Signup only shows the "Awaiting director approval" modal; it stores nothing and creates no account. Login panel has `emailInput` and `passwordInput`; login compares the email to fixed addresses and redirects:

- `director@adzu.edu.ph` → role `director` → `../director/dashboard.html`
- `staff@adzu.edu.ph` → role `staff` → `../staff/staff.html`
- `officehead@adzu.edu.ph` → role `office_head` → `../officehead/dashboard.html`
- empty → alert; anything else → "Invalid account" alert.

### Account approval/rejection modals
Director and Office Head dashboards and `director/pending_approvals.html` include Approve/Reject modals for pending account requests sourced from `pendingRequests` (`js/staff_data.js`). Reject uses `rejectionReasonInput` (textarea). Approving/rejecting sends an `account_status` notification via `addIscmsNotification`.

---

## 3. Assignment status values and what moves a record between them

Source: `js/assignment_status.js` (map key `iscms_assignment_status_v1`, value = assignment id → status). Known values: `pending`, `awaiting_proof`, `proof_pending` (legacy, readable but no longer written), `completed`, `cancelled`, plus derived `overdue`. These are the values shown in the Office Head "Assigned to my staff" tab.

Transitions:

- **Initial:** an assigned person starts as `pending` (`baseStatus` defaults to `'pending'`).
- **pending → awaiting_proof:** the assignee marks the assignment complete. Office Head: `markAssignedComplete()` in `js/office_head_trainings_mgmt.js`; Staff: `markAssignedComplete()` in `staff/staff_trainings.js`. Calls `IscmsAssignmentStatus.markAwaitingProof(id)`. Shown as "Awaiting certificate".
- **awaiting_proof → completed:** certificate upload by the assignee — `submitProofUpload()` calls `markCompleted(id)`. The upload completes the training directly.
- **→ cancelled:** `cancelAssigned()` (Office Head and Staff pages) writes `'cancelled'`.
- **→ overdue (derived):** `applyOverdueStatus()` returns `overdue` when the status is not `completed`/`cancelled` and the current date is more than **7 days after the deadline** (`deadline + 7 days`).
- `effectiveStatus(base, id)` resolution: stored override wins; `completed` stays `completed`; otherwise the derived overdue rule is applied; the base defaults to `pending`.
- `markProofPending()` writes legacy `proof_pending`; exported but not called by any current flow.
- `markCompletedByProofAccept()` (`js/assignment_status.js`) and `IscmsReviewProof.performAccept()` (`js/staff_data.js`) still exist but are only used by the leftover `director/review.html`; the reviewer-accepts-proof path is not a live flow.
- Post-pending set (`isPostPendingStatus`): `awaiting_proof`, `proof_pending`, `completed`.

Side effect: `setStatus` also syncs the status into `iscms_director_assignments_v1` (`assignedPersons`) and any `iscms_office_head_staff_assignments_v1_*` rows.

---

## 4. localStorage and sessionStorage keys

### sessionStorage
| Key | Stores | Written by |
|-----|--------|------------|
| `iscms_session_role` | Current role string (`director`, `staff`, `office_head`) | `login.html`; removed on logout by `js/iscms_role.js`. The leftover `secretary/dashboard.html` writes `secretary`, but no login path reaches it. |

### localStorage
| Key | Stores | Written / managed by |
|-----|--------|----------------------|
| `iscms_training_categories_v1` | Array of `{id,name,active,createdAt[,deactivatedAt]}` training categories | `js/training_categories_data.js` |
| `iscms_skill_categories_v1` | Competency catalog `{id,name,category,active,...}` | `js/skills_data.js` (`SkillCategories`) |
| `iscms_knowledge_categories_v1` | Knowledge catalog `{id,name,category,active,...}` | `js/skills_data.js` (`KnowledgeCategories`) |
| `iscms_profile_extras_v1` | Map `"<role>::<displayName>" → {employmentStatus, jobFunction}` | `js/iscms_profile_fields.js` |
| `iscms_director_profile_v1` | Director profile `{displayName,email,contact,notifyEmail,notifySystem}` | `director/profile.html` |
| `iscms_office_head_profile_v1` | Office Head profile (same shape) | `officehead/profile.html` |
| `iscms_staff_profile_v1` | Staff profile (same shape) | `staff/staff_profile.html` |
| `iscms_director_trainings_v1` | Unit Director's own training records | `js/director_trainings_mgmt.js`; read by `director/training_evaluations.html` and `director/find_staff_by_skill.html` |
| `iscms_director_uploaded_proofs_v1` | Director's uploaded certificate bundles | `js/director_trainings_mgmt.js` |
| `officeHeadTrainings` | Office Head's own training records | `js/office_head_trainings_mgmt.js`; read by `officehead/my_skills.html`, `officehead/dashboard.html`, `officehead/training_evaluations.html` |
| `officeHeadAssignedStatusMap_<OFFICE>_<name>` | Scoped map assignment id → status | `js/office_head_trainings_mgmt.js` (`getScopedStorageKey`) |
| `officeHeadUploadedProofs_<OFFICE>_<name>` | Scoped uploaded proof bundles | `js/office_head_trainings_mgmt.js` |
| `iscms_office_head_staff_assignments_v1_<officeCode>` | Office Head assignments to own staff (shown in "Assigned to my staff") | `js/office_head_trainings_mgmt.js` (`OFFICE_HEAD_STAFF_ASSIGNMENTS_KEY`); read by `staff_trainings.js`, `notifications.js`, `assignment_status.js` |
| `staffTrainings` | Staff (Elena Mae R. Castro) own training records | `staff/staff_trainings.js`; read by `staff/my_skills.html`, `staff/my_evaluations.html`, `staff/staff_dashboard.js`, `officehead/dashboard.html`, `officehead/training_evaluations.html` |
| `staffUploadedProofs` | Staff uploaded proof bundles | `staff/staff_trainings.js` |
| `staffAssignedStatusMap` | Staff assignment id → status map | `staff/staff_trainings.js` |
| `staffActionHistory` | Staff report action history array | `staff/staff_reports.js` |
| `staffRecycleBin` | Staff deleted reports | `staff/staff_reports.js` |
| `iscms_director_assignments_v1` | Director training assignments (Assignment Board) | `training_assignments.html`, `js/recycle_bin_store.js`, synced by `js/assignment_status.js` |
| `iscms_recycle_bin_v1` | Director recycle bin entries `{id,actionType,deletedAt,summary,payload}` | `js/recycle_bin_store.js` |
| `iscms_assignment_status_v1` | Assignment id → status map | `js/assignment_status.js` |
| `iscms_notifications_v1` | Notification rows (id, type, title, message, createdAt, sender, recipientRole, recipientOffice, recipientName) | `js/notifications.js` |
| `iscms_evaluations_v1` | Skill evaluation / 1–5 rating records (no reachable writer) | `js/evaluation_data.js` |
| `iscms_training_evaluations_v1` | Event feedback evaluations for Conducted trainings | `director/training_evaluations.html` **and** `officehead/training_evaluations.html`; read by `staff/my_evaluations.html` |
| `iscms_partners_v1` | Partner organization records | `js/partners_data.js` |
| `iscms_review_proof_queue_v1` | Training proof review queue (leftover; only `director/review.html`) | `js/staff_data.js` (`IscmsReviewProof`) |
| `iscms_review_proof_history_v1` | Training proof review history (leftover) | `js/staff_data.js` (`IscmsReviewProof`) |
| `iscms_recycle_demo_v1` | One-time "seed recycle demo" flag (`"1"`) | `director/reports.html`, `officehead/reports.html` |
| `iscms_oh_joined_trainings_v1` | Office Head joined trainings | `js/office_head_my_trainings.js` (file not referenced by any page) |
| `iscms_oh_assigned_pending_v1`, `iscms_oh_assigned_completed_v1` | Legacy office-head assigned keys; only `removeItem` calls exist | `js/office_head_my_trainings.js` |

---

## 5. Which role can create, edit, or view each kind of record

| Record type | Create | Edit | View |
|-------------|--------|------|------|
| Training record ("My Trainings") | Director (own, `director/my_trainings.html`); Office Head (own, `officehead/my_trainings.html`); Staff (own, `staff/staff_trainings.html`) | Same role that created it (own records only) | Owning role; Director/Office-Head directory views (scoped) |
| Training assignment | Director (`training_assignments.html`, any office/staff); Office Head (own ACCA staff, `my_trainings` modal, or `?assign=1`) | Director (board; delete → recycle bin); Office Head can mark Complete/Cancelled and upload certificates for own-office assignments | Director (board + details); assignees (Office Head/Staff) in My Trainings → Assigned Trainings; Office Head also sees its issued assignments in "Assigned to my staff" |
| Event feedback evaluation (`iscms_training_evaluations_v1`) | Director (`training_evaluations.html`, any office) and Office Head (`officehead/training_evaluations.html`, own office only). **Conducted trainings only.** | Director (any evaluation shown on their page); Office Head (evaluations for its own-office Conducted trainings; same key) | Director (own page); Office Head (own page); Staff via read-only `staff/my_evaluations.html` |
| Skill evaluation / 1–5 rating (`iscms_evaluations_v1`) | None in the working UI — no reachable form creates a 1-to-5 rating | — | Key/module remain, but nothing reachable writes to it |
| Partner record (`iscms_partners_v1`) | Director (any office); Office Head (ACCA-office partners only) | Director (any); Office Head (ACCA-office only) | Director and Office Head pages (others read-only for Office Head) |
| Competency | Director (`skill_categories.html`) | Director (rename/deactivate/reactivate) | All roles (catalog/dropdowns, staff/head training tagging) |
| Knowledge category | Director (`knowledge_categories.html`) | Director | All roles (dropdowns; Director and Office Head training forms) |
| Training category | Director (`training_categories.html`) | Director | All roles (dropdowns) |
| Notification | Director, Office Head (composer; Office Head limited to Director / own staff) | No edit; `add` de-dupes by id | Recipients filtered by role/office/name (`iscmsNotificationPanel`) |
| Registration/signup | Anyone (login page; no persistence) | — | Director/Office Head dashboards and `pending_approvals.html` approve/reject (from `pendingRequests`) |

---

## 6. Leftover pages and code that are not reachable from the UI

These still exist but are not linked from the reachable role pages:

- `secretary/` (`secretary/dashboard.html`, `secretary/profile.html`): leftover role area. `login.html` has no secretary branch, so the Secretary cannot log in and nothing links into this folder from the working pages.
- `director/review.html`: proof review queue (accept/reject, history). The certificate-upload flow completes trainings directly, and no working navigation links to it.
- `director/rate_office_heads.html`: numeric 1-to-5 rating of Office Heads. Not linked anywhere, and no such rating is available from the UI.
- `officehead/my_evaluation.html`: Office Head's own 1-to-5 rating history. Not linked anywhere (the Office Head sidebar links to `training_evaluations.html` and `my_skills.html` instead).
- `js/office_head_my_trainings.js`: alternate/legacy My Trainings implementation. No HTML loads it (`officehead/my_trainings.html` loads `js/office_head_trainings_mgmt.js`), so its keys `iscms_oh_joined_trainings_v1`, `iscms_oh_assigned_pending_v1`, `iscms_oh_assigned_completed_v1` are never exercised.
- Proof review queue code in `js/staff_data.js` (`IscmsReviewProof`, keys `iscms_review_proof_queue_v1` / `iscms_review_proof_history_v1`) plus `IscmsAssignmentStatus.markCompletedByProofAccept()`. Only `director/review.html` uses them.

Note: `director/find_staff_by_skill.html` is reachable (Director "Find Staff by Competency" sidebar link), but its "Assign" flow is the only way it injects the staff query param; the Office Head equivalent is `officehead/staff_skills.html`.

---

## 7. Could not determine

1. **Dashboard pending-account source and persistence.** The Director and Office Head dashboards show Approve/Reject account modals, but the pending list comes from the seed `pendingRequests` array and approvals are not written to `localStorage`; `pending_approvals.html` keeps its history in memory. The intended persistence could not be confirmed.
2. **Legacy `proof_pending` data.** `iscms_assignment_status_v1` may still contain stored `proof_pending` values from earlier builds; the code reads but no longer writes this value. Whether any browser currently holds such values is unknown.
3. **Leftover `secretary` references.** `js/iscms_role.js` and `js/notifications.js` still include `secretary` in role lists/titles, but there is no login path to the role. Whether this is meant for future reinstatement is unclear.
4. **Leftover review/rating code intent.** `director/review.html`, `director/rate_office_heads.html`, `officehead/my_evaluation.html`, and the `IscmsReviewProof` helpers remain but are unreachable; the code does not state whether they are kept for future re-enablement.
5. **Shared evaluation key across roles.** Director and Office Head save to the same `iscms_training_evaluations_v1`. Whether an Office Head is intended to be able to edit an evaluation originally created by the Director (for the same ACCA Conducted training) is not stated in the code.
