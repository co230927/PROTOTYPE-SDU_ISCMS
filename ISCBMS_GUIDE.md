# Staff Training and Management System Guide

## 1. What this project is

Staff Training and Management System is a front-end prototype for a Staff Training and Management System. It uses static HTML pages, CSS stylesheets, seeded JavaScript data, and browser storage to simulate staff training management.

It does **not** have a backend server, real authentication, database, server-side permissions, or real file uploads.

The main technologies are:

- HTML for page structure
- CSS for layout and visual design
- Native browser JavaScript for interaction and rendering
- `sessionStorage` and `localStorage` for prototype state

## 2. How the site starts

[index.html](index.html) redirects to [login_and_signup/login.html](login_and_signup/login.html). The login page is the normal entry point.

## 3. Login and signup behavior

The login form reads the email field and routes known demo accounts. The password is not checked.

| Demo email               | Destination                 | Stored role   |
| ------------------------ | --------------------------- | ------------- |
| `director@adzu.edu.ph`   | `director/dashboard.html`   | `director`    |
| `secretary@adzu.edu.ph`  | `secretary/dashboard.html`  | `secretary`   |
| `officehead@adzu.edu.ph` | `officehead/dashboard.html` | `office_head` |
| `staff@adzu.edu.ph`      | `staff/staff.html`          | `staff`       |

The Secretary now logs in through [secretary/dashboard.html](secretary/dashboard.html), giving the role its own landing dashboard. The Secretary's shared management pages continue to reuse the existing `director/` pages.

Signup collects a name, email, password, and office. It displays an approval modal, but it does not create a persistent account or add a record to an approval database. Signup does not collect a role.

The active role is stored in `sessionStorage` under `iscms_session_role`.

Logout removes `iscms_session_role`. Role pages redirect to login when the stored role is missing or does not match the page folder. Director pages accept either `director` or `secretary`; Secretary pages require `secretary`, Office Head pages require `office_head`, and Staff pages require `staff`. This is a client-side prototype check, not server-side authentication or authorization.

## 4. User roles and scope

### Director

The Director is the system-wide administrator. The main area is [director/dashboard.html](director/dashboard.html).

Director navigation includes:

- Dashboard
- Directories
- Find Staff by Competency
- Partner Organizations
- Reports
- Pending Approvals
- Training Assignments
- Review
- Profile
- Training Categories
- Knowledge Categories
- Competencies
- Rate Office Heads

Training Categories, Knowledge Categories, Competencies, and Rate Office Heads are injected by [js/iscms_role.js](js/iscms_role.js). On Secretary pages, these injected links point to the matching pages under `director/`.

### Secretary

The Secretary has the same broad system-wide monitoring and approval views as the Director. Secretary-specific navigation and shared-page access are handled by [js/iscms_role.js](js/iscms_role.js); the Secretary may open `director/` pages.

The main Secretary pages are:

- [secretary/dashboard.html](secretary/dashboard.html)
- [secretary/profile.html](secretary/profile.html)

Most Secretary actions use the existing `director/` pages.

### Office Head

The Office Head manages one office. The current prototype is hard-coded to the ACCA office and Carlos Miguel V. Tingson.

Pages are located in [officehead](officehead):

- `dashboard.html`
- `directories.html`
- `staff_skills.html`
- `partner_organizations.html`
- `my_trainings.html`
- `my_evaluation.html`
- `reports.html`
- `profile.html`

Each Office Head page sets `window.ISCMS_OFFICE_HEAD_CODE = 'ACCA'`.

The My Evaluation link is injected by [js/iscms_role.js](js/iscms_role.js), rather than being part of every Office Head page's static sidebar markup.

### Staff

The Staff UI is also a fixed demo persona: Elena Mae R. Castro from ACCA.

Pages are located in [staff](staff):

- `staff.html`
- `staff_trainings.html`
- `my_skills.html`
- `staff_reports.html`
- `staff_profile.html`

## 5. Page capabilities

### Director and Secretary pages

- Dashboard: pending counts, training breakdowns, office cards, partner expiry alerts, staff summaries, notifications, and exports.
- Directories: office selection, staff lists, training history, staff details, removal UI, printing, and exports.
- Find Staff by Competency: search staff by competency and view office/competency matches.
- Partner Organizations: add and edit partner records, store MOU filename, show expiry warnings, view contributions by yearly, quarterly, or semestral period, and store SDU Office and Signed By fields.
- Pending Approvals: review demo registration requests, approve or reject them, and enter rejection reasons.
- Training Assignments: create system-wide assignments with title, category, deadline, nature, scope, venue, required skills, offices, staff, and roles. Includes assignment details, printing, CSV export, and Recycle Bin actions.
- Review: filter, inspect, accept, or reject submitted training proofs.
- Training Categories: add, rename, deactivate, and reactivate categories used by training forms.
- Competencies: add, rename, deactivate, and reactivate competency values used for tagging and evaluations. Inactive competencies remain on existing records but are omitted from new selections.
- Rate Office Heads: rate Office Heads on a 1–5 scale with comments and view rating history.
- Profile: edit display name, email, contact, employment status, job function, notification preferences, and simulated password state.

### Office Head pages

- Dashboard: ACCA staff counts, Attended and Conducted training-record counts, office training information, role breakdowns, alerts, and exports. Legacy records without a record type count as Attended.
- Directories: ACCA staff directory, details, training history, removal UI, and exports.
- Staff Competencies: filter ACCA staff competencies and rate staff proficiency.
- Partner Organizations: view partner information and contribution summaries.
- My Trainings: manage personal training records, use role/category/nature filters, view Director assignments, assign trainings to ACCA staff, upload proof metadata, manage uploaded file records, and export or print training lists.
- My Evaluation: view the Office Head's own evaluations and rating trend.
- Reports: view action history, print or export CSV, and use the prototype Recycle Bin.
- Profile: edit profile fields, notification preferences, and simulated password state.

### Staff pages

- Dashboard: upcoming, incoming, completed, Attended, and Conducted training counts; role counts; competencies; training/category breakdowns; needs-attention cards; and notification bell. Legacy records without a record type count as Attended.
- My Trainings: manage personal training records, filter by role/category/nature, view assigned trainings, upload proofs, rate skills after completion, and export or print.
- My Competencies: view mapped competencies and rating trends.
- Reports: view activity history, print or export CSV, and manage the Staff Recycle Bin.
- Profile: edit profile fields and view skills, evaluations, training history, and notification settings.

## 6. Training, proof, and status flow

Training data comes from [js/training_events_data.js](js/training_events_data.js), page-specific records, and browser storage. Staff and Office Head assigned-training views retain seeded `TRAINING_EVENTS_SEED` records and also read recipient-matched custom assignments from `iscms_director_assignments_v1` and `iscms_office_head_staff_assignments_v1_<office>`. The Office Head view also retains its manager view of assignments created for staff in that office. A legacy `pendingTrainings` list continues to seed Office Head assignments.

The seeded assignment/proof flow is:

1. A Director or Secretary creates an assignment, or an Office Head assigns training to staff in that office.
2. Director/Secretary assignments are saved under `iscms_director_assignments_v1`; Office Head assignments are saved under `iscms_office_head_staff_assignments_v1_<office>`. Staff views include assignments addressed to the Staff persona. The Office Head view includes Director assignments addressed to the Office Head and the existing office-created assignment list.
3. Completing the activity changes the record to `awaiting_proof`.
4. Uploading proof changes it to `proof_pending`.
5. The Director or Secretary reviews the proof in Review.
6. Accepted proof changes the assignment to `completed`.
7. Rejected proof can create a rejection notice and Recycle Bin record. The rejection notice is stored, but the Staff notification builder does not read that notice key, so it is not surfaced in the Staff notification panel.
8. An incomplete assignment becomes `overdue` seven days after its deadline. This status calculation applies to seeded and custom assignments.

Proof uploads are simulated. The browser stores filenames and file sizes, not file contents.

The shared [js/assignment_status.js](js/assignment_status.js) status helper persists status changes for seeded and custom assignments without replacing custom rows when syncing seeded status. The UI remains a browser-only prototype: records are local to the browser, uploads store filenames and sizes only, and there is no server-side workflow.

The Director/Office Head Recycle Bin uses `iscms_recycle_bin_v1`. Restoring a deleted Director assignment can return it to the Assignment Board. Staff-removal and proof entries can be removed from the bin, but their restore actions do not restore the underlying person or proof. Staff Reports has a separate bin for action-history rows. Directory “Remove Staff” currently removes a row only from the in-memory `officeData` array; it is not persisted and is not connected to account offboarding or the Recycle Bin.

## 7. Skills and evaluations

Skills are defined in [js/skills_data.js](js/skills_data.js). The module contains:

- A skill catalog
- Staff-to-skill mappings
- System-wide skill matching
- Office-scoped skill matching
- Staff skill lists

Evaluation data is managed by [js/evaluation_data.js](js/evaluation_data.js). It supports:

- Staff competency ratings
- Office Head ratings
- Numeric ratings from 1 to 5
- Qualitative labels for ratings: `Needs Improvement`, `Below Average`, `Satisfactory`, `Proficient`, and `Excellent`
- Comments
- Training and date references
- Average and latest-rating trend summaries

The shared helper `getRatingLabel(rating)` in [js/evaluation_data.js](js/evaluation_data.js) maps each numeric score to its label. Evaluation views display ratings in the form `4 — Proficient / 5`, including individual trend entries, average summaries, and the latest Office Head rating.

## 8. Partner institutions

Partner data is defined in [js/partners_data.js](js/partners_data.js) and edited through [director/partner_organizations.html](director/partner_organizations.html).

Partner records can include:

- Organization name and type
- Contact person, email, and phone
- MOU filename
- MOU expiry date
- SDU Office
- Signed By
- Contribution rows

The page shows expired and expiring-soon indicators. MOU files are represented by filenames only.

Partner contribution rows remain as period-level mock summaries (training count, staff reached, and in-kind value). They are stored with partner records and are not automatically connected to individual training records.

## 9. Reports, print, and export

Director, Office Head, and Staff report pages show action-history views and include Print and CSV export controls. Director and Office Head report rows are mostly hard-coded sample data; Staff history is demo activity, not a complete audit log of system actions.

Other pages also provide print/export actions, including directories, training lists, and dashboards. Export is generated in the browser; no report file is sent to a server.

## 10. Notifications

Notifications are one-way browser announcements stored in `localStorage` under `iscms_notifications_v1`. The shared notification module provides the bell, recipient filtering, and send form across roles.

- Director and Secretary can send to Staff or Office Heads, including all recipients or a selected office/person.
- Office Heads can send to Director/Secretary or Staff in their own office.
- Staff are view-only.
- Automatic notices cover training assignments and approaching deadlines, account decisions, proof uploads, and proof results.
- Staff notification rendering imports matching proof-rejection records from `iscms_staff_proof_rejection_notices_v1`.

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

- [js/staff_data.js](js/staff_data.js): staff, offices, requests, proofs, and shared helpers.
- [js/notifications.js](js/notifications.js): shared one-way announcements, recipient filtering, automatic notices, send form, and notification bell.
- [js/training_events_data.js](js/training_events_data.js): seeded training events and assignments.
- [js/assignment_status.js](js/assignment_status.js): assignment status persistence and overdue calculation.
- [js/skills_data.js](js/skills_data.js): skills and matching.
- [js/partners_data.js](js/partners_data.js): partner records and expiry calculations.
- [js/evaluation_data.js](js/evaluation_data.js): ratings and trends.
- [js/iscms_role.js](js/iscms_role.js): role/session behavior and navigation injection.
- [js/recycle_bin_store.js](js/recycle_bin_store.js): shared prototype Recycle Bin behavior.
- [js/office_head_trainings_mgmt.js](js/office_head_trainings_mgmt.js): Office Head records, assignments, and proof metadata.
- [js/office_head_my_trainings.js](js/office_head_my_trainings.js): alternate/legacy My Trainings implementation; [officehead/my_trainings.html](officehead/my_trainings.html) currently loads `office_head_trainings_mgmt.js`.
- [staff/staff_dashboard.js](staff/staff_dashboard.js): Staff dashboard rendering.
- [staff/staff_trainings.js](staff/staff_trainings.js): Staff training, proof, and skill-rating behavior.

## 12. Browser storage

### Session storage

- `iscms_session_role`: current demo role.

### Local storage

Important keys include:

- `iscms_assignment_status_v1`
- `iscms_notifications_v1`
- `iscms_evaluations_v1`
- `iscms_profile_extras_v1`
- `iscms_training_categories_v1`
- `iscms_skill_categories_v1`
- `iscms_partners_v1`
- `iscms_recycle_bin_v1`
- `iscms_director_assignments_v1`
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
- `iscms_staff_proof_rejection_notices_v1`

This is a representative list of important keys, not a complete inventory. Storage is browser-specific. Clearing site data resets much of the prototype state.

## 13. Known prototype limitations

- There is no real authentication or password validation.
- There is no backend database or server-side authorization.
- Any HTML page can be opened directly regardless of the stored role.
- Logout links navigate to login but do not clear `iscms_session_role`.
- Signup data is not persisted after the approval modal closes.
- Password changes are simulated.
- Staff and Office Head are fixed demo personas, currently ACCA-specific.
- Approval actions and some directory actions are primarily UI/state simulations.
- Recycle Bin restoration does not reconnect every underlying queue or directory record.
- Staff, Office Head, and Director reports use separate histories and storage behavior.
- Removing a person in the Director or Office Head directory changes the in-memory seeded list only; reloading restores that person, and the removal is not connected to the Recycle Bin.
- Director and Office Head share a Recycle Bin store, while Staff uses a separate store. Restoring deleted users or proof records removes the Recycle Bin entry but does not restore the underlying directory, review queue, or proof data.
- Several seeded counts and dates remain static while other values are calculated dynamically.
- Some pages contain duplicate script tags because the prototype grew through parallel feature additions.
- Assignment and proof workflows still have separate underlying data stores, although notification delivery uses one shared store.
- Admin-created assignments and Office Head-created assignments are not consistently propagated into Staff's assigned-training view.
- Partner, profile, evaluation, and training changes are local to the current browser.
- File upload controls store metadata only; they do not upload files.

## 14. Beginner summary

Think of the system this way:

- HTML builds the screens.
- CSS makes the screens look consistent.
- JavaScript supplies the data and behavior.
- `sessionStorage` remembers the demo role for the current browser session.
- `localStorage` simulates saved records on the current device.
- Director and Secretary manage system-wide activity.
- Office Head manages ACCA office activity.
- Staff manages a fixed ACCA staff persona.
- Trainings, proofs, skills, partners, evaluations, reports, and notifications are simulated in the browser.

The prototype demonstrates the intended user experience and feature flow, but it is not yet a production system with secure identity, shared data, or real file storage.
