# Staff Training and Management System (SDU-STMS)

## 1. What this project is

Staff Training and Management System (SDU-STMS) is a front-end prototype for a Staff Training and Management System. It uses static HTML pages, CSS stylesheets, seeded JavaScript data, and browser storage to simulate staff training management.

It does **not** have a backend server, real authentication, database, server-side permissions, or real file uploads.

The main technologies are:

- HTML for page structure
- CSS for layout and visual design
- Native browser JavaScript for interaction and rendering
- `sessionStorage` and `localStorage` for prototype state

There are no budget or finance features, and there is no inbox or direct messaging. The only communication feature is one-way notifications.

## 2. How the site starts

[index.html](index.html) redirects to [login_and_signup/login.html](login_and_signup/login.html). The login page is the normal entry point.

## 3. Login and signup behavior

The login form reads the email field and routes known demo accounts. The password is not checked.

| Demo email               | Destination                 | Stored role   |
| ------------------------ | --------------------------- | ------------- |
| `director@adzu.edu.ph`   | `director/dashboard.html`   | `director`    |
| `officehead@adzu.edu.ph` | `officehead/dashboard.html` | `office_head` |
| `staff@adzu.edu.ph`      | `staff/staff.html`          | `staff`       |

The Secretary can no longer log in: [login_and_signup/login.html](login_and_signup/login.html) has no secretary email branch, and it only ever stores `director`, `office_head`, or `staff`. The `secretary/` folder is leftover and unreachable from the UI.

Signup collects a name, email, password, and office. It displays an approval modal, but it does not create a persistent account or add a record to an approval database. Signup does not collect a role.

The active role is stored in `sessionStorage` under `iscms_session_role`.

Logout removes `iscms_session_role`. Role pages redirect to login when the stored role is missing or does not match the page folder: Director pages require `director`, Office Head pages require `office_head`, and Staff pages require `staff`. This is a client-side prototype check, not server-side authentication or authorization.

## 4. User roles and scope

There are three working roles: Unit Director, Office Head, and Staff.

### Unit Director

The Unit Director is the system-wide administrator. The main area is [director/dashboard.html](director/dashboard.html).

Director navigation includes:

- Dashboard
- Directories
- Find Staff by Competency
- Partner Organizations
- Reports
- Pending Approvals
- Training Assignments
- My Trainings
- Training Evaluations
- Training Categories
- Knowledge Categories
- Competencies
- Profile

My Trainings, Training Evaluations, Training Categories, Knowledge Categories, and Competencies are injected by [js/iscms_role.js](js/iscms_role.js) before the Profile link.

The Unit Director also has a personal **My Trainings** page ([director/my_trainings.html](director/my_trainings.html), backed by [js/director_trainings_mgmt.js](js/director_trainings_mgmt.js)) for her own training records and uploaded certificate files.

### Office Head

The Office Head manages one office. The current prototype is hard-coded to the ACCA office and Carlos Miguel V. Tingson.

Pages are located in [officehead](officehead):

- `dashboard.html`
- `directories.html`
- `staff_skills.html`
- `partner_organizations.html`
- `my_trainings.html`
- `reports.html`
- `profile.html`

Each Office Head page sets `window.ISCMS_OFFICE_HEAD_CODE = 'ACCA'`.

On the Partner Organizations page, Office Heads can add records for ACCA and edit ACCA-associated records. Records assigned to another lead implementing office remain view-only. Contributions and agreement details remain visible for all partner records.

### Staff

The Staff UI is a fixed demo persona: Elena Mae R. Castro from ACCA.

Pages are located in [staff](staff):

- `staff.html`
- `staff_trainings.html`
- `my_skills.html`
- `staff_reports.html`
- `staff_profile.html`

## 5. Page capabilities

### Unit Director pages

- Dashboard: pending counts, training breakdowns, office cards, partner expiry alerts, staff summaries, notifications, and exports.
- Directories: office selection, staff lists, training history, staff details, printing, and exports.
- Find Staff by Competency: search staff by competency and knowledge, open a row details modal, and use **Assign** / **Assign selected** to jump to Training Assignments with the chosen staff pre-selected.
- Partner Organizations: manage system-wide partner records, choose a Lead Implementing Office, store multiple MOA/MOU and related-document filenames, show expiry warnings, view contributions by yearly, quarterly, or semestral period, and store Signed By details.
- Pending Approvals: review demo registration requests, approve or reject them, and enter rejection reasons.
- Training Assignments: create system-wide assignments with title, category, deadline, nature, scope, venue, required skills, offices, staff, and roles. Includes assignment details, printing, CSV export, and Recycle Bin actions.
- My Trainings: manage the Unit Director's own training records, upload certificate files, and view the Uploaded Files tab.
- Training Evaluations: add and edit event feedback for trainings recorded as **Conducted** (see section 7).
- Training Categories: add, rename, deactivate, and reactivate categories used by training forms.
- Knowledge Categories: add, rename, deactivate, and reactivate knowledge values.
- Competencies: add, rename, deactivate, and reactivate competency values used for tagging. Inactive competencies remain on existing records but are omitted from new selections.
- Profile: edit display name, email, contact, employment status, job function, notification preferences, and simulated password state.

### Office Head pages

- Dashboard: ACCA staff counts, Attended and Conducted training-record counts, office training information, role breakdowns, alerts, and exports.
- Directories: ACCA staff directory, details, training history, and exports.
- Staff Competencies: filter ACCA staff competencies, open a row details modal, and use **Assign** / **Assign selected** to jump to My Trainings with the chosen staff pre-selected.
- Partner Organizations: add records for ACCA, edit ACCA-associated records, view other offices' partner records, manage agreement filename metadata, expiry details, and contribution summaries.
- My Trainings: manage personal training records, use role/category/nature filters, view Director assignments, assign trainings to ACCA staff (role options include Participant, Facilitator, Organizer, Speaker, Host/Emcee, and Documenter), upload certificate metadata, manage uploaded file records, and export or print training lists.
- Reports: view action history, print or export CSV, and use the prototype Recycle Bin.
- Profile: edit profile fields, notification preferences, and simulated password state.

### Staff pages

- Dashboard: upcoming, incoming, completed, Attended, and Conducted training counts; role counts; competencies; training/category breakdowns; needs-attention cards; and notification bell.
- My Trainings: manage personal training records, filter by role/category/nature, view assigned trainings, complete or cancel assignments, upload certificates, and export or print.
- My Competencies: view mapped competencies and knowledge.
- Reports: view activity history, print or export CSV, and manage the Staff Recycle Bin.
- Profile: edit profile fields, view competencies and knowledge, training history, and notification settings.

## 6. Training, proof, and status flow

Training data comes from [js/training_events_data.js](js/training_events_data.js), page-specific records, and browser storage. Staff and Office Head assigned-training views retain seeded `TRAINING_EVENTS_SEED` records and also read recipient-matched custom assignments from `iscms_director_assignments_v1` and `iscms_office_head_staff_assignments_v1_<office>`. The Office Head view also keeps its manager view of assignments created for staff in that office. A legacy `pendingTrainings` list continues to seed Office Head assignments.

Assignment status values are `pending`, `awaiting_proof` (shown as "awaiting certificate"), `completed`, `cancelled`, and the derived `overdue`. A legacy `proof_pending` value is still readable in stored records but is no longer written.

The status flow is:

1. A Unit Director creates an assignment, or an Office Head assigns training to staff in that office.
2. Director assignments are saved under `iscms_director_assignments_v1`; Office Head assignments are saved under `iscms_office_head_staff_assignments_v1_<office>`. Staff views include assignments addressed to the Staff persona.
3. An assignment starts as `pending`.
4. Completing the activity changes the record to `awaiting_proof` ("awaiting certificate").
5. Uploading a certificate changes it directly to `completed`. There is **no proof review step** in the working flow — the certificate upload itself completes the training.
6. An assignment can be `cancelled` instead of completed.
7. An incomplete assignment becomes `overdue` seven days after its deadline. This calculation applies to seeded and custom assignments.

Status is persisted by the shared [js/assignment_status.js](js/assignment_status.js) helper under `iscms_assignment_status_v1` and synced back into the assignment rows.

Certificate uploads are simulated. The browser stores filenames and file sizes, not file contents.

The Director/Office Head Recycle Bin uses `iscms_recycle_bin_v1`. Restoring a deleted Director assignment can return it to the Assignment Board. Staff-removal entries can be removed from the bin, but their restore actions do not restore the underlying person. Staff Reports has a separate bin for action-history rows.

## 7. Skills and evaluations

Competencies and knowledge are two separate catalogs, both shared across all offices:

- **Competencies** (`iscms_skill_categories_v1`) are defined in [js/skills_data.js](js/skills_data.js). The module also contains staff-to-competency mappings, system-wide matching, office-scoped matching, and staff competency lists.
- **Knowledge categories** (`iscms_knowledge_categories_v1`) are also defined in [js/skills_data.js](js/skills_data.js) as a distinct catalog with its own staff mappings.

The Unit Director manages both catalogs from [director/skill_categories.html](director/skill_categories.html) and [director/knowledge_categories.html](director/knowledge_categories.html). The catalogs feed dropdowns and tagging on other pages (training forms, Find Staff by Competency, My Competencies).

Evaluations are **event feedback for conducted trainings only**, created on [director/training_evaluations.html](director/training_evaluations.html). A training appears in the evaluation form only when its record type is `Conducted`, drawn from Staff records (`staffTrainings`), Office Head records (`officeHeadTrainings`), the Unit Director's own records (`iscms_director_trainings_v1`), and seeded training events.

Each evaluation records:

- `evalTrainingSelect` — the conducted training (required)
- `evalParticipants` — participants responded (required number)
- `evalSummary` — feedback summary (required)
- `evalRoleFeedback` — per-role feedback, e.g. Speaker or Facilitator (optional)
- `evalLevel` — optional level: `Not set`, `Demonstrated`, `Partially Demonstrated`, `Not Demonstrated`

No numeric 1-to-5 rating is available from the UI. The legacy rating module [js/evaluation_data.js](js/evaluation_data.js) still defines a numeric scale and labels, but there is no working form in the current UI that creates a 1-to-5 rating.

## 8. Partner institutions

Partner data is defined in [js/partners_data.js](js/partners_data.js) and stored in browser storage under `iscms_partners_v1`. The Unit Director manages records system-wide through [director/partner_organizations.html](director/partner_organizations.html). Office Heads use [officehead/partner_organizations.html](officehead/partner_organizations.html) to add records for their own office and edit records whose Lead Implementing Office matches their office; other records remain view-only.

Partner records can include:

- Organization name and type
- Contact person, email, and phone
- Lead Implementing Office
- MOA/MOU and related document filenames (`mouFiles`); the existing `mouFile` property remains as the legacy first filename
- MOU expiry date
- Signed By
- Contribution rows

Both pages show expired and expiring-soon indicators. The Lead Implementing Office is selected from the existing office list; the Office Head form is fixed to that user's office. Multiple agreement and related-document files can be selected, but the prototype stores filenames only, not file contents.

Partner contribution rows remain as period-level mock summaries (training count, staff reached, and in-kind value). Editing a partner preserves its existing contribution rows; new partners receive the existing starter contribution row. These figures are informational metadata only and are not a budget feature.

## 9. Reports, print, and export

Director, Office Head, and Staff report pages show action-history views and include Print and CSV export controls. Director and Office Head report rows are mostly hard-coded sample data; Staff history is demo activity, not a complete audit log of system actions.

Other pages also provide print/export actions, including directories, training lists, and dashboards. Export is generated in the browser; no report file is sent to a server.

## 10. Notifications

Notifications only exist as one-way browser announcements stored in `localStorage` under `iscms_notifications_v1`. There is no inbox, no direct messaging, and no two-way conversation feature. The shared notification module provides the bell, recipient filtering, and send form across roles.

- The Unit Director can send to Staff or Office Heads, including all recipients or a selected office/person.
- Office Heads can send to the Director or to Staff in their own office.
- Staff are view-only.
- Automatic notices cover training assignments and approaching deadlines, account decisions, and certificate uploads.

This is same-browser prototype delivery: roles see notifications when using the same browser storage. It does not synchronize between devices or provide server-backed identity or delivery.

## 11. HTML, CSS, and JavaScript relationship

### HTML

HTML files create sidebars, headers, cards, tables, forms, modals, filters, and page sections.

Examples include [director/dashboard.html](director/dashboard.html), [officehead/my_trainings.html](officehead/my_trainings.html), and [staff/staff_trainings.html](staff/staff_trainings.html).

### CSS

[director/dashboard.css](director/dashboard.css) provides the main shared visual system. Staff and Office Head pages also use [staff/staff_dashboard.css](staff/staff_dashboard.css) and [officehead/office_dashboard.css](officehead/office_dashboard.css).

The CSS controls navigation, colors, spacing, typography, cards, tables, buttons, responsive layouts, and modal presentation.

### JavaScript

JavaScript loads sample data, reads browser storage, renders tables and cards, handles forms and modals, calculates statuses, filters records, and creates exports.

Important modules include:

- [js/staff_data.js](js/staff_data.js): staff, offices, requests, shared helpers, and the review-proof helper.
- [js/notifications.js](js/notifications.js): shared one-way announcements, recipient filtering, automatic notices, send form, and notification bell.
- [js/training_events_data.js](js/training_events_data.js): seeded training events and assignments.
- [js/assignment_status.js](js/assignment_status.js): assignment status persistence and overdue calculation.
- [js/skills_data.js](js/skills_data.js): competency and knowledge catalogs, staff mappings, and matching.
- [js/partners_data.js](js/partners_data.js): partner records and expiry calculations.
- [js/evaluation_data.js](js/evaluation_data.js): legacy rating/trend data module (no active UI form).
- [js/iscms_role.js](js/iscms_role.js): role/session behavior and navigation injection.
- [js/recycle_bin_store.js](js/recycle_bin_store.js): shared prototype Recycle Bin behavior.
- [js/office_head_trainings_mgmt.js](js/office_head_trainings_mgmt.js): Office Head records, assignments, and certificate metadata.
- [js/director_trainings_mgmt.js](js/director_trainings_mgmt.js): Unit Director own-training records and uploaded certificates.
- [staff/staff_dashboard.js](staff/staff_dashboard.js): Staff dashboard rendering.
- [staff/staff_trainings.js](staff/staff_trainings.js): Staff training, certificate, and assignment behavior.

## 12. Browser storage

### Session storage

- `iscms_session_role`: current demo role (`director`, `office_head`, or `staff`).

### Local storage

Important keys include:

- `iscms_assignment_status_v1`
- `iscms_notifications_v1`
- `iscms_evaluations_v1`
- `iscms_training_evaluations_v1`
- `iscms_profile_extras_v1`
- `iscms_training_categories_v1`
- `iscms_skill_categories_v1`
- `iscms_knowledge_categories_v1`
- `iscms_partners_v1`
- `iscms_recycle_bin_v1`
- `iscms_director_assignments_v1`
- `iscms_director_trainings_v1`
- `iscms_director_uploaded_proofs_v1`
- `iscms_director_profile_v1`
- `iscms_office_head_profile_v1`
- `iscms_staff_profile_v1`
- `officeHeadTrainings`
- `officeHeadAssignedStatusMap_<office>_<office-head>`
- `officeHeadUploadedProofs_<office>_<office-head>`
- `iscms_office_head_staff_assignments_v1_<office>`
- `staffTrainings`
- `staffAssignedStatusMap`
- `staffUploadedProofs`
- `staffActionHistory`
- `staffRecycleBin`
- `iscms_review_proof_queue_v1`
- `iscms_review_proof_history_v1`
- `iscms_recycle_demo_v1`
- `iscms_oh_joined_trainings_v1` (only used by the leftover `office_head_my_trainings.js`)
- `iscms_oh_assigned_pending_v1`, `iscms_oh_assigned_completed_v1` (legacy keys; only `removeItem` calls exist, in the leftover script)

This is a representative list of important keys, not a complete inventory. Storage is browser-specific. Clearing site data resets much of the prototype state.

## 13. Leftover files not linked in the UI

These files still exist in the project but are not reachable through the current navigation and do not participate in the working flow:

- [director/review.html](director/review.html): proof review queue (accept/reject). With certificate upload now completing trainings directly, this review step is not part of the flow and nothing links to it.
- [director/rate_office_heads.html](director/rate_office_heads.html): numeric 1-to-5 rating of Office Heads. No sidebar or link points to it, and no such rating is available from the UI.
- [officehead/my_evaluation.html](officehead/my_evaluation.html): Office Head's own evaluation/rating history. Orphan page, not linked.
- `secretary/`: leftover folder ([secretary/dashboard.html](secretary/dashboard.html), [secretary/profile.html](secretary/profile.html)). There is no secretary login, and the folder is not linked from the working role pages.
- [js/office_head_my_trainings.js](js/office_head_my_trainings.js): alternate/legacy My Trainings implementation. No HTML page loads it; `officehead/my_trainings.html` uses `office_head_trainings_mgmt.js` instead.
- Proof review code in [js/staff_data.js](js/staff_data.js): the `IscmsReviewProof` queue/history helpers (`iscms_review_proof_queue_v1`, `iscms_review_proof_history_v1`) were used by [director/review.html](director/review.html) and are no longer part of the status flow.

## 14. Known prototype limitations

- There is no real authentication or password validation.
- There is no backend database or server-side authorization.
- The Secretary cannot log in, and the `secretary/` folder is leftover.
- Any HTML page can be opened directly by URL regardless of the stored role; role folders redirect when the session role does not match.
- Signup data is not persisted after the approval modal closes.
- Password changes are simulated.
- Staff and Office Head are fixed demo personas, currently ACCA-specific; the Unit Director is a single generic persona.
- Certificate uploads complete a training directly; the leftover proof review step is not used.
- No numeric 1-to-5 rating can be created from the UI.
- Approval actions and some directory actions are primarily UI/state simulations.
- Recycle Bin restoration does not reconnect every underlying queue or directory record.
- Staff, Office Head, and Director reports use separate histories and storage behavior.
- Removing a person in the Director or Office Head directory changes the in-memory seeded list only; reloading restores that person, and the removal is not connected to the Recycle Bin.
- Director and Office Head share a Recycle Bin store, while Staff uses a separate store. Restoring deleted users or proof records removes the Recycle Bin entry but does not restore the underlying directory or proof data.
- Several seeded counts and dates remain static while other values are calculated dynamically.
- Some pages contain duplicate script tags because the prototype grew through parallel feature additions.
- Assignment and proof workflows still have separate underlying data stores, although notification delivery uses one shared store.
- Director-created assignments and Office Head-created assignments are not consistently propagated into Staff's assigned-training view.
- Partner, profile, evaluation, and training changes are local to the current browser.
- File upload controls store metadata only; they do not upload files.
- Competencies and knowledge are stored locally per browser and are shared across offices only within that browser.

## 15. Beginner summary

Think of the system this way:

- HTML builds the screens.
- CSS makes the screens look consistent.
- JavaScript supplies the data and behavior.
- `sessionStorage` remembers the demo role for the current browser session.
- `localStorage` simulates saved records on the current device.
- The Unit Director manages system-wide activity and her own trainings.
- The Office Head manages ACCA office activity.
- Staff manages a fixed ACCA staff persona.
- Trainings, certificates, competencies, knowledge, partners, evaluations, reports, and notifications are simulated in the browser.

The prototype demonstrates the intended user experience and feature flow, but it is not yet a production system with secure identity, shared data, or real file storage.
