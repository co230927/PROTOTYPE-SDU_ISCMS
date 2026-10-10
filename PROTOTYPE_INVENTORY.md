# PROTOTYPE_INVENTORY.md

Inventory of the SDU Staff Training and Management System (ISCMS) prototype, based only on what the code in this repository does.

- Data is browser-only. There is no backend: records are seed arrays in JS plus `localStorage`/`sessionStorage`.
- There are three working roles: **Unit Director** (`director/`), **Office Head** (`officehead/`), and **Staff** (`staff/`). The active role is stored in `sessionStorage['iscms_session_role']`. The `secretary/` folder is leftover and unreachable (see the leftover section).
- Required/optional below reflect the HTML `required` attribute **and** the JS validation actually performed.
- Dropdown option lists are quoted exactly as they appear in the markup.

---

## 1. Roles and sidebar pages

Sidebar links are repeated inside each HTML file. The Director sidebar is additionally extended at runtime by `js/iscms_role.js` → `iscmsInjectDirectorNavExtras()` (it inserts My Trainings, Training Evaluations, Training Categories, Knowledge Categories, Competencies before the Profile link if not already present).

### Director (`director/`)

| Page | What the user can do |
|------|----------------------|
| Dashboard (`dashboard.html`) | View welcome/overview cards (Accounts, Trainings, Expiring soon), Training Role Breakdown, Needs Attention, office staff list, Training Category Coverage; approve/reject pending account requests (modals). |
| Directories (`directories.html`) | Browse office cards, staff records and per-staff training detail ("View Staff Info"). |
| Find Staff by Competency (`find_staff_by_skill.html`) | Filter staff by competency (and knowledge); open a row details modal; select rows and Assign → `training_assignments.html?staff=...`. |
| Partners (`partner_organizations.html`) | Partner directory; add/edit partners; view partner detail and contribution breakdown. |
| Reports (`reports.html`) | "Report Action History" and trash/recycle-bin view (with a one-time recycle demo seed). |
| Pending Approvals (`pending_approvals.html`, heading "Account Management") | Pending account approvals, Approved Accounts History, Rejected Accounts History; approve/reject with reason. |
| Training Assignments (`training_assignments.html`) | Create a training assignment (offices + staff + roles), view the Assignment Board (incomplete/complete), assignment details, delete → recycle bin. |
| My Trainings (`my_trainings.html`, injected) | Unit Director's own training records and uploaded certificates. |
| Training Evaluations (`training_evaluations.html`, injected) | Create/edit event feedback evaluations for "Conducted" trainings. |
| Training Categories (`training_categories.html`) | Add, rename, deactivate/reactivate training categories. |
| Knowledge Categories (`knowledge_categories.html`) | Add, rename, deactivate/reactivate knowledge categories. |
| Competencies (`skill_categories.html`) | Add, rename, deactivate/reactivate competencies. |
| Profile (`profile.html`) | Activity summary; edit contact details; change password (simulated); notification preferences. |
| Log Out | Clears session role and goes to `../login_and_signup/login.html`. |

### Office Head (`officehead/`)

| Page | What the user can do |
|------|----------------------|
| Dashboard (`dashboard.html`) | ACCA-centric overview (Accounts, Trainings, ACCA Staff, Attended/Conducted, Role Breakdown, Needs Attention, Top Performers, Category Coverage); approve/reject account request modals. |
| Directories (`directories.html`) | ACCA staff directory scoped to the office; opens the shared staff-details view (records, training history, certificates). No inline rating form. |
| Staff Competencies (`staff_skills.html`) | ACCA-only competency directory; filter by competency; row details modal; Assign/Assign selected → `my_trainings.html?staff=...`. |
| Partners (`partner_organizations.html`) | Partner directory; can add/edit only partners whose `office` is ACCA; other partners are view-only. |
| My Trainings (`my_trainings.html`) | Own joined trainings, assigned trainings (from Director and from own office assignments), uploaded files; assign training to ACCA staff. |
| Reports (`reports.html`) | "Report Action History" and recycle-bin view (with a one-time recycle demo seed). |
| Profile (`profile.html`) | Activity summary; edit contact details; change password (simulated); notification preferences. |
| Log Out | Ends the session. |

### Staff (`staff/`)

| Page | What the user can do |
|------|----------------------|
| Dashboard (`staff.html`) | Personal stats: Trainings, My Competencies, Attended/Conducted, Events, Training Breakdown, Needs Attention, Category Coverage. |
| My Trainings (`staff_trainings.html`) | Own joined training records; assigned trainings with Complete/Cancelled and certificate upload; Uploaded Files tab. |
| My Competencies (`my_skills.html`) | View own competencies and knowledge. |
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
| `requiredSkillsCheckboxes` | Competencies (director label) / Required Skills (staff & office head) | Optional | Checkboxes, values = active skill ids |
| `knowledgeCheckboxes` | Knowledge | Optional | Checkboxes, values = active knowledge ids (**Director page only**) |
| role checkboxes `name="roles"` | Roles | Yes (≥1) | `Participant`, `Facilitator`, `Organizer`, `Speaker`, `Host/Emcee`, `Documenter` |
| `trainingDescription` | Description | Optional | Textarea |

Certificate upload modal (`#modalUploadProof` / `#uploadProofModal`): `uploadProofFiles` / `proofFiles` (file, `multiple`), `uploadProofNote` / `proofNote` (textarea, optional).

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
| `requiredSkillsGrid` | Required Skills | Optional | Checkboxes (active skill ids) |
| `officeSelector` | Offices included | Yes (≥1) | Buttons: `SDU` (key `SDU_ONLY`), `ACCA`, `ACES`, `ACLG`, `APC`, `CCES`, `ALTEC` |
| `staffSelectionGrid` | Staff members | Yes (≥1) | Cards per selected office; per-card role select `ROLE_OPTIONS = Participant, Facilitator, Speaker, Organizer, Host/Emcee, Documenter` |

Also has filters (Search, Office filter, board Search) and a Delete confirmation that moves the assignment to the recycle bin.

### Assign-to-staff modal (Office Head)
`officehead/my_trainings.html`, form `#officeStaffAssignmentForm`:

| Field (id) | Required | Options |
|------------|----------|---------|
| `assignmentTrainingTitle` | Yes | Text |
| `assignmentDeadline` | Yes | Date |
| `assignmentRole` | Yes (default Participant) | `Participant`, `Facilitator`, `Organizer`, `Speaker`, `Host/Emcee`, `Documenter` |
| `assignedStaff` (checkboxes) | Yes (≥1) | ACCA staff except the Office Head himself |

### Skill evaluation / rating (`js/evaluation_data.js`) — no active UI
No 1-to-5 rating can be created from the working UI. The former Office Head inline rating form (skill select, 1–5 rating select, comment input, Save button) was removed from the staff-details view in `js/staff_data.js`, and the `rate_office_heads.html` form is not reachable (see the leftover section).

The module `js/evaluation_data.js` and the storage key `iscms_evaluations_v1` remain in the code. They still define the stored fields (`staffName`, `skillId`, `skillName`, `rating` 1–5, `comment`, `trainingTitle`, `date`, `ratedBy`, `office`, `subjectRole`), the `addEvaluation` / `addOfficeHeadEvaluation` writer functions, and the `RATING_LABELS` display map (`1 Needs Improvement`, `2 Below Average`, `3 Satisfactory`, `4 Proficient`, `5 Excellent`). Nothing reachable in the current UI calls the writers, so no new records are written to `iscms_evaluations_v1`.

### Event evaluation (Director)
`director/training_evaluations.html`, form `#evaluationForm`:

| Field (id) | Required | Options |
|------------|----------|---------|
| `evalTrainingSelect` | Yes | Conducted trainings (from `staffTrainings`, `officeHeadTrainings`, `iscms_director_trainings_v1`, and seeded training events; only `recordType === 'Conducted'`) |
| `evalParticipants` | Yes | Number (`min=0`, step 1) |
| `evalLevel` | Optional | `Not set`, `Demonstrated`, `Partially Demonstrated`, `Not Demonstrated` |
| `evalSummary` | Yes | Textarea |
| `evalRoleFeedback` | Optional | Textarea |

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
| `partnerOffice` | — | `SDU`, `ACCA`, `ACES`, `ACLG`, `APC`, `CCES`, `ALTEC` (disabled/fixed to ACCA on the Office Head page) |
| `partnerSignedBy` | Yes | Name and role of signatory |
| `partnerMouFile` | Optional | File (`multiple`); only filenames are stored |

Contribution breakdown filter (`contribPeriodFilter`): `Yearly`, `Quarterly` (default selected), `Semestral`.

### Competency form (Director)
`director/skill_categories.html`: `newSkillName` text input + "Add competency" button (`SkillCategories.addSkill`). Rename uses a JS `prompt()`. Deactivate/Reactivate buttons per row.

### Knowledge category form (Director)
`director/knowledge_categories.html`: `newKnowledgeName` text input + "Add knowledge" button (`KnowledgeCategories.addKnowledge`). Rename via `prompt()`; deactivate/reactivate per row.

### Training category form (Director)
`director/training_categories.html`: `newCategoryName` text input + "Add category" button (`TrainingCategories.add`). Rename via `prompt()`; deactivate/reactivate per row. Default categories: `Community Organizing`, `Project Management`, `Peace Education & Advocacy`, `Environmental Stewardship`, `Cultural Heritage & Arts`, `Health & Livelihood`, `Leadership & Governance`, `Data & Digital Literacy`, `Other`.

### Notification composer (`js/notifications.js`, modal `#iscmsAnnouncementModal`, form `#iscmsAnnouncementForm`)
| Field (id) | Required | Options / notes |
|------------|----------|-----------------|
| `iscmsAnnouncementAudience` (Recipients) | Yes | Office Head: `Director` (`leadership`), `Staff in my office` (`office_staff`). Others: `All Staff` (`all_staff`), `All Office Heads` (`all_heads`), `Staff in a specific office` (`office_staff`), `Office Head of a specific office` (`office_head`) |
| `iscmsAnnouncementOffice` (Office) | Conditional | Offices `SDU` (key `SDU_ONLY`), `ACCA`, `ACES`, `ACLG`, `APC`, `CCES`, `ALTEC`; hidden for Office Head (fixed to own office) |
| `iscmsAnnouncementPerson` (Specific recipient) | No | `Everyone in selected group` + matching people |
| `iscmsAnnouncementTitle` (Title) | Yes | `maxlength=100` |
| `iscmsAnnouncementMessage` (Message) | Yes | Textarea, `maxlength=1000` |

### Registration / signup and login (`login_and_signup/login.html`)
Signup panel `#signupPanel` (JS-validated, no `required` attributes):

| Field (id) | Label | Required (JS) | Options |
|------------|-------|---------------|---------|
| `signupName` | FULL NAME | Yes | Text |
| `signupEmail` | EMAIL | Yes | Email |
| `signupPassword` | PASSWORD | Yes | Password |
| `signupOffice` | OFFICE | Yes | `SDU — Social Development Unit`, `ACCA`, `ACES`, `ACLG`, `APC`, `CCES`, `ALTEC` |

Signup only shows the "Awaiting director approval" modal; it stores nothing and does not create an account. Login panel has `emailInput` and `passwordInput`; login compares the email to fixed addresses and redirects:

- `director@adzu.edu.ph` → sets role `director` → `../director/dashboard.html`
- `staff@adzu.edu.ph` → sets role `staff` → `../staff/staff.html`
- `officehead@adzu.edu.ph` → sets role `office_head` → `../officehead/dashboard.html`
- empty → alert; anything else → "Invalid account" alert.

### Account approval/rejection modals
Director and Office Head dashboards and `director/pending_approvals.html` include Approve/Reject modals for pending account requests sourced from `pendingRequests` (`js/staff_data.js`). Reject uses `rejectionReasonInput` (textarea). Approving/rejecting sends an `account_status` notification via `addIscmsNotification`.

---

## 3. Assignment status values and what moves a record between them

Source: `js/assignment_status.js` (map key `iscms_assignment_status_v1`, value = assignment id → status). Known values: `pending`, `awaiting_proof`, `proof_pending` (legacy, readable but no longer written), `completed`, `cancelled`, plus derived `overdue`.

Transitions:

- **Initial:** an assigned person starts as `pending` (`baseStatus` defaults to `'pending'`).
- **pending → awaiting_proof:** the assignee marks the assignment complete. Office Head: `markAssignedComplete()` in `js/office_head_trainings_mgmt.js`; Staff: `markAssignedComplete()` in `staff/staff_trainings.js`. Calls `IscmsAssignmentStatus.markAwaitingProof(id)`.
- **awaiting_proof → completed:** certificate upload by the assignee — `submitProofUpload()` in `office_head_trainings_mgmt.js` / `staff_trainings.js` calls `markCompleted(id)`. The certificate upload completes the training directly; there is no live proof-review step.
- **→ cancelled:** `cancelAssigned()` (Office Head and Staff pages) writes `'cancelled'`.
- **→ overdue (derived, not stored by the transition):** `applyOverdueStatus()` returns `overdue` when the status is not `completed`/`cancelled` and the current date is more than **7 days after the deadline** (`deadline + 7 days`).
- `effectiveStatus(base, id)` resolution order: stored override wins; `completed` stays `completed`; otherwise the derived overdue rule is applied; the base defaults to `pending`.
- `markProofPending()` writes the legacy `proof_pending` value; it is exported but not called by any current flow.
- `markCompletedByProofAccept()` (`js/assignment_status.js`) and `IscmsReviewProof.performAccept()` (`js/staff_data.js`) still exist, but they are only used by the leftover `director/review.html`; the reviewer-accepts-proof path is not a live flow.
- Post-pending set (`isPostPendingStatus`): `awaiting_proof`, `proof_pending`, `completed`.

Side effect: `setStatus` also syncs the status into `iscms_director_assignments_v1` (`assignedPersons`) and any `iscms_office_head_staff_assignments_v1_*` rows.

---

## 4. localStorage and sessionStorage keys

### sessionStorage
| Key | Stores | Written by |
|-----|--------|------------|
| `iscms_session_role` | Current role string (`director`, `staff`, `office_head`) | `login.html` (director/staff/office_head); removed on logout by `js/iscms_role.js`. The leftover `secretary/dashboard.html` writes `secretary`, but there is no login path that reaches it. |

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
| `iscms_director_trainings_v1` | Unit Director's own training records array | `js/director_trainings_mgmt.js` |
| `iscms_director_uploaded_proofs_v1` | Director's uploaded certificate bundles | `js/director_trainings_mgmt.js` |
| `officeHeadTrainings` | Office Head's own training records | `js/office_head_trainings_mgmt.js` |
| `officeHeadAssignedStatusMap_<OFFICE>_<name>` | Scoped map assignment id → status | `js/office_head_trainings_mgmt.js` via `getScopedStorageKey` |
| `officeHeadUploadedProofs_<OFFICE>_<name>` | Scoped uploaded proof bundles | `js/office_head_trainings_mgmt.js` |
| `iscms_office_head_staff_assignments_v1_<officeCode>` | Office Head assignments to own staff | `js/office_head_trainings_mgmt.js` (`OFFICE_HEAD_STAFF_ASSIGNMENTS_KEY`) |
| `staffTrainings` | Staff (Elena Mae R. Castro) own training records | `staff/staff_trainings.js` |
| `staffUploadedProofs` | Staff uploaded proof bundles | `staff/staff_trainings.js` |
| `staffAssignedStatusMap` | Staff assignment id → status map | `staff/staff_trainings.js` |
| `staffActionHistory` | Staff report action history array | `staff/staff_reports.js` |
| `staffRecycleBin` | Staff deleted reports | `staff/staff_reports.js` |
| `iscms_director_assignments_v1` | Director training assignments (Assignment Board) | `js/recycle_bin_store.js`, `js/director_trainings...`/`training_assignments.html`, synced by `assignment_status.js` |
| `iscms_recycle_bin_v1` | Director recycle bin entries (`{id,actionType,deletedAt,summary,payload}`) | `js/recycle_bin_store.js` |
| `iscms_assignment_status_v1` | Assignment id → status map | `js/assignment_status.js` |
| `iscms_notifications_v1` | Notification rows (id, type, title, message, createdAt, sender, recipientRole, recipientOffice, recipientName) | `js/notifications.js` |
| `iscms_evaluations_v1` | Skill evaluation/rating records | `js/evaluation_data.js` |
| `iscms_training_evaluations_v1` | Event feedback evaluations for conducted trainings | `director/training_evaluations.html` |
| `iscms_partners_v1` | Partner organization records | `js/partners_data.js` |
| `iscms_review_proof_queue_v1` | Training proof review queue (leftover; only the unreachable `director/review.html` uses it) | `js/staff_data.js` (`IscmsReviewProof`) |
| `iscms_review_proof_history_v1` | Training proof review history (leftover; same as above) | `js/staff_data.js` (`IscmsReviewProof`) |
| `iscms_recycle_demo_v1` | One-time "seed recycle demo" flag (`"1"`) | `director/reports.html`, `officehead/reports.html` |
| `iscms_oh_joined_trainings_v1` | Office Head joined trainings | `js/office_head_my_trainings.js` (file is not referenced by any page) |
| `iscms_oh_assigned_pending_v1`, `iscms_oh_assigned_completed_v1` | Legacy office-head assigned keys; only `removeItem` calls exist | `js/office_head_my_trainings.js` |

---

## 5. Which role can create, edit, or view each kind of record

| Record type | Create | Edit | View |
|-------------|--------|------|------|
| Training record ("My Trainings") | Director (own, `director/my_trainings.html`); Office Head (own, `officehead/my_trainings.html`); Staff (own, `staff/staff_trainings.html`) | Same role that created it (own records only) | Owning role; Director directory views (scoped) |
| Training assignment | Director (`training_assignments.html`, any office/staff); Office Head (own ACCA staff, `my_trainings` modal) | Director (board; delete → recycle bin); Office Head can mark Complete/Cancelled for own office assignments | Director (Assignment Board + details); assignees (Office Head/Staff) in My Trainings → Assigned Trainings |
| Skill evaluation / rating (`iscms_evaluations_v1`) | None in the working UI — no reachable form creates a 1-to-5 rating | — (module `js/evaluation_data.js` provides `addEvaluation`, but nothing reachable calls it) | Key and module remain in the code, but nothing reachable writes to `iscms_evaluations_v1` |
| Event feedback evaluation (`iscms_training_evaluations_v1`) | Director (`training_evaluations.html`) | Director (same modal re-opens existing) | Director (same page) |
| Partner record (`iscms_partners_v1`) | Director (any office); Office Head (ACCA-office partners only) | Director (any); Office Head (ACCA-office only) | Director and Office Head (others read-only for Office Head); Staff via dashboard? No — only Director/Office Head pages load `partners_data.js` |
| Competency | Director (`skill_categories.html`) | Director (rename/deactivate/reactivate) | All roles (catalog/dropdowns, staff tagging) |
| Knowledge category | Director (`knowledge_categories.html`) | Director | All roles (dropdowns, director training form) |
| Training category | Director (`training_categories.html`) | Director | All roles (dropdowns) |
| Notification | Director, Office Head (composer; Office Head limited to Director / own staff) | No edit; `add` de-dupes by id | Recipients filtered by role/office/name (`iscmsNotificationPanel`). The composer code still lists `secretary` as an allowed role, but no login reaches it. |
| Registration/signup | Anyone (login page; no persistence) | — | Director/Office Head dashboards and `pending_approvals.html` approve/reject (from `pendingRequests`) |

---

## 6. Leftover pages and code that are not reachable from the UI

These still exist in the repository but are not part of the working flow and are not linked from the reachable role pages:

- `secretary/` (`secretary/dashboard.html`, `secretary/profile.html`): leftover role area. `login.html` has no secretary branch, so the Secretary can no longer log in and nothing links into this folder from the working pages.
- `director/review.html`: proof review queue (accept/reject, history). The certificate-upload flow completes trainings directly, and no working navigation links to it.
- `director/rate_office_heads.html`: numeric 1-to-5 rating of Office Heads. Not linked anywhere, and no such rating is available from the UI.
- `officehead/my_evaluation.html`: Office Head's own evaluation/rating history. Not linked anywhere.
- `js/office_head_my_trainings.js`: alternate/legacy My Trainings implementation. No HTML loads it (`officehead/my_trainings.html` loads `js/office_head_trainings_mgmt.js`), so its keys `iscms_oh_joined_trainings_v1`, `iscms_oh_assigned_pending_v1`, and `iscms_oh_assigned_completed_v1` are never exercised.
- Proof review queue code in `js/staff_data.js` (`IscmsReviewProof`, keys `iscms_review_proof_queue_v1` / `iscms_review_proof_history_v1`) plus `IscmsAssignmentStatus.markCompletedByProofAccept()`. Only `director/review.html` uses them; they are not part of the live status flow.

---

## 7. Could not determine

1. **Dashboard pending-account source and persistence.** The Director and Office Head dashboards show Approve/Reject account modals, but the pending list comes from the seed `pendingRequests` array and approvals are not written to `localStorage`; `pending_approvals.html` keeps its history in memory. The intended persistence could not be confirmed.
2. **Legacy `proof_pending` data.** `iscms_assignment_status_v1` may still contain stored `proof_pending` values from earlier builds; the code reads but no longer writes this value. Whether any browser currently holds such values is unknown.
3. **Leftover `secretary` references.** `js/iscms_role.js` and `js/notifications.js` still include `secretary` in role lists/titles, but there is no login path to the role. Whether this is meant for future reinstatement is unclear.
4. **Leftover review/rating code intent.** `director/review.html`, `director/rate_office_heads.html`, `officehead/my_evaluation.html`, and the `IscmsReviewProof` helpers remain but are unreachable; the code does not state whether they are kept for future re-enablement or are simply stale.
