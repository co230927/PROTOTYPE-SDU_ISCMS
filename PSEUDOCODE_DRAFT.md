# ISCMS Pseudocode Draft

Plain-language description of what the code actually does for ten core flows.
This is a prototype: data lives in the browser (session storage and local storage) plus a set of hard-coded seed records. No server or database is involved.

---

## 1. Login and role routing

Files: `login_and_signup/login.html`, `js/iscms_role.js`

Roles involved: Director, Office Head, Staff (and a Secretary alias treated like a Director).

### Login

Input: an email address and a password typed into the login form.

Process:
1. When Login is clicked, read the email field and convert it to lower case with surrounding spaces removed.
2. IF the email equals `director@adzu.edu.ph`, store the session role "director" and go to the director dashboard.
3. ELSE IF the email equals `staff@adzu.edu.ph`, store the session role "staff" and go to the staff page.
4. ELSE IF the email equals `officehead@adzu.edu.ph`, store the session role "office_head" and go to the office head dashboard.
5. ELSE IF the email is empty, show a message asking for an email.
6. ELSE show a message saying the account is invalid and list the three accepted emails.
7. The password field is read by the form but is never checked against anything.

### Sign up

Input: full name, email, password, and an office chosen from a fixed list.

Process:
1. When Sign up is clicked, check each field in turn.
2. IF the name is empty, ask for the full name and stop.
3. ELSE IF the email is empty, ask for the email and stop.
4. ELSE IF the password is empty, ask for a password and stop.
5. ELSE IF no office is selected, ask for the office and stop.
6. ELSE show an "Awaiting director approval" message box.
7. When that box is dismissed, clear all sign-up fields, reset the office picker, and return to the login view.
8. The sign-up does not save the account or create a pending request anywhere; the approval message is informational only.

### Enter key behaviour

Process:
1. When Enter is pressed and the approval box is not showing, click Login if the login panel is visible, otherwise click Sign up.

### Role context helpers (`iscms_role.js`)

Input: the folder name in the current page address, and the stored session role.

Process:
1. Store, read, and remove the session role using a single browser session key.
2. Determine the "page role" from the second-to-last folder in the address (for example the `director` folder means the director role).
3. IF the folder is director, the role must be director; if secretary, must be secretary; if officehead, must be office_head; if staff, must be staff; any other folder is always allowed.
4. IF the stored role does not match the page role, redirect the browser to the login page.
5. On page load, apply role styling: IF the role is secretary, change the sidebar heading text to SECRETARY; add role body classes; and insert extra sidebar links for director/secretary pages (My Trainings, Training Evaluations, Training Categories, Knowledge Categories, Competencies).
6. Inject the notifications script into the page.
7. IF a logout link is clicked, remove the stored session role.

Output: the browser lands on the correct dashboard, the sidebar is styled for the role, and role-specific navigation and notifications are loaded. Users on the wrong role page are sent back to login.

---

## 2. Account approval or rejection

Files: `director/pending_approvals.html`, `js/staff_data.js`

Roles involved: Director (approver), prospective Staff or Office Head (requester).

Input: a list of pending registration requests. In the prototype this is a fixed seed of two people (Juan Dela Cruz for ACCA, Maria Clara for ACES). The pending table shows name, email, requested office, a fixed "2 days ago" time, and Approve / Reject buttons.

### Approve

Process:
1. Clicking Approve opens a confirmation box showing the person's name.
2. IF Confirm Approval is pressed and the request exists and the notification helper is available:
   a. Determine whether the requester's name matches a known office head.
   b. Create an "Account approved" notification. IF the requester is an office head, send it to the office head role; ELSE send it to the staff role, addressed to the requested office and the person's name, from "SDU Administration".
3. Remove the request row from the table and close the box.
4. No account record is created and no approved-account history entry is written by this action.

### Reject

Process:
1. Clicking Reject opens a box with a reason text field.
2. IF Submit Rejection is pressed:
   a. Read and trim the reason.
   b. IF the reason is empty, show "Please provide a reason." and stop.
   c. ELSE IF the request exists and the notification helper is available, create an "Account rejected" notification including the reason, routed to office head or staff the same way as approval.
3. Remove the request row and close the box.

### Approved accounts history

Process:
1. Read the chosen office filter (All Offices or a single office).
2. For each office, list staff from the seeded staff data with a fixed "Approved" status and a fixed date.
3. Each row offers Assign (goes to the training assignments page) and Remove (removes only the on-screen row).

### Rejected accounts history

Process:
1. A fixed local list of three rejected accounts is displayed with name, office, reason, and date.
2. A View/Hide button expands or collapses this section.
3. Clear removes only the on-screen row.

Output: the director sees pending requests, approved history, and rejected history; approving or rejecting sends a notification and removes the request from view, but does not persist an account decision.

---

## 3. Create a training record

Files: `director/my_trainings.html`, `js/director_trainings_mgmt.js`

Roles involved: Unit Director (owner of the records).

Input fields on the Add/Edit Training form: training name, venue, start date, end date, nature (Internal/External), scope (Local/Regional/National/International), category, record type (Attended/Conducted), optional competencies, optional knowledge items, one or more roles (Participant, Facilitator, Organizer, Speaker, Host/Emcee, Documenter), and an optional description.

Process:
1. On page load, load saved director trainings from browser storage, merge in any baseline records that are not already present, load previously uploaded certificate files, fill the category and competencies checkboxes, and render the table.
2. Clicking Add New Training clears the form and marks "Add" mode.
3. Clicking Edit on a row fills the form with that record and marks "Edit" mode.
4. On Save:
   a. Read all field values, the checked roles, competencies, and knowledge items.
   b. IF any required field is missing OR no role is checked, show a message and stop.
   c. IF the end date is earlier than the start date, show a message and stop.
   d. IF editing an existing record, overwrite that record's fields.
   e. ELSE create a new record with a generated id and a created timestamp and add it to the list.
   f. Save the list to browser storage, redraw the table, and close the form.
5. Filters (role, category, nature, record type) narrow the table; the count of matches is shown.
6. Each row offers View more (details), Edit, Delete, and (for director only) Upload certificate.
7. Upload certificate opens a box where one or more files can be attached with an optional note; the files are stored separately from the training records. Uploaded files can later be renamed or removed, and the list of uploaded file bundles can be viewed on a separate tab.
8. Delete removes the record after confirmation.
9. Print and Export Excel produce a report of the filtered records.

Status of a record is derived from its dates: IF today is before the start date the status is Upcoming; IF today is after the end date it is Completed; ELSE it is Ongoing.

Output: a new or updated training record is saved in the browser, appears in the director's table, and can carry certificate files.

---

## 4. Certificate upload that completes an assigned training

Files: `js/office_head_trainings_mgmt.js`, `staff/staff_trainings.js`, `js/assignment_status.js`

Roles involved: Staff or Office Head (uploads certificate), Director/Secretary and relevant Office Head (receive notice).

### Staff view

Input: assignments that come from the seeded training events, director assignments, and office head assignments, filtered to the signed-in staff member (in the prototype, Elena Mae R. Castro of ACCA).

Process:
1. Separate the person's assignments into pending (status pending or overdue) and completed (status awaiting proof, proof pending, or completed).
2. IF a pending row's Complete button is clicked:
   a. Move that item to the completed list and set its status to awaiting proof.
   b. Save the status and tell the assignment-status helper it is awaiting proof.
3. IF a completed row's Upload certificate button is clicked, open a box with a multiple-file selector and a note field.
4. When the upload is submitted:
   a. IF no file is selected, show a message and stop.
   b. ELSE create an upload bundle recording the training, the files, and the note; add it to the staff's uploaded certificates.
   c. Set the assignment status to completed and inform the assignment-status helper.
   d. Send a "Certificate uploaded" notification to the director/secretary and to the office head for the person's office.
   e. Close the box.

### Office Head view

Input: assignments for the signed-in office head, gathered from seeded events, director assignments, and the office's own staff assignments.

Process:
1. Same pending/completed split and same Complete then Upload certificate sequence.
2. When the upload is submitted, the same four steps happen (store bundle, mark completed, notify director/secretary, notify office head), and the office head's own upload copies are shown in an uploaded-files tab.

### Assignment status helper

Process:
1. Store a map of assignment id to status in browser storage.
2. When a status changes, also write that status into the seeded events, the director assignments, and any office head assignment lists so every view agrees.
3. Provide statuses: pending, awaiting proof (also reads legacy proof pending), completed, cancelled.
4. "Mark completed by proof accept" lets a reviewer's acceptance of a certificate finish every matching assignment for that person and training title (matched across seeded events, director assignments, and office head assignments).

Output: uploading a certificate on an awaiting-proof assignment changes that assignment to completed and notifies the Director/Secretary and Office Head.

---

## 5. Overdue calculation, 7 days after the deadline

File: `js/assignment_status.js`

Roles involved: none directly; this is a status rule used by every assignment view.

Input: a base status, an assignment id (which encodes an event id plus a person index as "eventId-number"), and a stored deadline.

Process:
1. IF the status is already completed or cancelled, OR there is no assignment id, return the status unchanged.
2. Derive the event id by removing the trailing dash-and-number from the assignment id.
3. Find the deadline, in this order:
   a. From the seeded training events, by event id.
   b. IF not found, from the saved director assignments, by event id.
   c. IF still not found, from the office head staff assignments, by the full assignment id.
4. IF no deadline is found, return the status unchanged.
5. Convert the deadline to a date at midnight and add exactly 7 days (7 × 24 hours) to get the overdue moment.
6. IF the current time is later than that overdue moment, return "overdue".
7. ELSE return the original status.
8. The effective-status function first checks for a stored override: IF the override is completed, return completed; IF there is any other override, apply the overdue rule to it; ELSE apply the overdue rule to the base status.

Output: an assignment becomes "overdue" only once a full 7 days have passed after its deadline; completed or cancelled items are never marked overdue.

---

## 6. Create an assignment

Files: `director/training_assignments.html` (Director) and the Office Head assign modal in `officehead/my_trainings.html`

Roles involved: Director (assigns across offices), Office Head (assigns own office staff), Staff and Office Heads (recipients).

### Director assignment form

Input: training name, description/objectives, category, deadline, nature, scope, venue, optional required skills, one or more selected offices, and one or more selected staff (each with a chosen role).

Process:
1. When offices are toggled on, show a staff panel with cards for the staff of those offices.
2. Each staff card shows a count of that person's past trainings by role, can be selected by clicking, and lets a role be chosen for this assignment. A search box filters staff by name; Select all and Deselect all act on the currently visible staff. A date range can narrow the past-training summary shown on the cards.
3. When Assign & Notify Staff is pressed:
   a. Read the name and deadline.
   b. IF the name is empty, the deadline is empty, no office is selected, or no staff is selected, show a message and stop.
   c. Build the list of assigned persons from the selected staff, each with a role (default Participant) and status pending.
   d. Build a new assignment holding the training details, the list of offices, the required skills, and the assigned persons, with status pending.
   e. Add it to the top of the assignment list and save it through the recycle-bin store.
   f. For each assigned person, send a "Training assignment" notification addressed to staff (or to the office head role if that person is the office's head) for that person's office, from the Director (or Secretary).
   g. Show a success toast, collapse the form, and redraw the board.
4. The board is split into "incomplete" assignments (at least one person not completed) and "completed" assignments (all persons completed). Each row offers Details and Delete; delete moves the assignment into the recycle bin rather than erasing it, and a restore window of 30 days is mentioned.
5. IF the page was opened from the "Find Staff by Competency" page with names in the address, preselect those staff and their offices, expand the form, and redraw.

### Office Head assign modal

Input: training title, deadline, role, and one or more staff checkboxes (the modal lists staff in the office head's office, excluding the office head).

Process:
1. When the modal form is submitted:
   a. IF the title is empty, the deadline is empty, or no staff is selected, show a message and stop.
   b. ELSE create one assignment record per selected staff member, saved under an office-specific browser key.
   c. Send an "Office training assignment" notification to the director/secretary naming the assigned staff.
   d. Send a "New training assignment" notification to each selected staff member.
   e. Close the modal, tell the user notifications were sent, and refresh the assigned lists with status pending.

Output: a new assignment is stored, appears on the correct board or assigned list, and notifications go to each recipient and to leadership.

---

## 7. Find staff by competency

Files: `director/find_staff_by_skill.html`, `js/skills_data.js`

Roles involved: Director (searches and assigns).

Input: a competency selected from a combined list of the skill catalog and the knowledge catalog.

Process:
1. On page load, fill the drop-down with every skill and every knowledge item (the knowledge entries are labelled as Knowledge).
2. When a competency is chosen:
   a. Look up staff who hold that skill using the name-to-skills mapping; each match is given their office (found in the seeded staff data) and the list of their skills. Results are sorted by name.
   b. IF the Director's own training records are tagged with that skill or knowledge AND the Director is not already in the list, add the Unit Director (office SDU) with their competency and knowledge names, then re-sort.
   c. Show a count of matching staff; IF none, show a "no matching staff" row.
   d. Render a table with a selection checkbox, name, office, all-competency badges, and an Assign button per row.
3. Clicking a row (not the checkbox or button) opens a staff details box showing name, office, competencies, knowledge, and training history.
4. Clicking Assign on a row, or Assign selected for the ticked rows:
   a. IF no one is selected, show a message and stop.
   b. ELSE go to the training assignments page carrying the selected names, so the assignment form opens preselected.

### Competency and knowledge catalogs

Process:
1. On read, IF a saved catalog exists and is non-empty, use it; ELSE use the built-in default catalog (ten skills, ten knowledge items).
2. Add: IF the name is empty, fail; IF a catalog item with that name exists and is active, fail as duplicate; IF it exists but inactive, reactivate it; ELSE add it as active.
3. Rename: IF the new name is empty or already used by another item, fail; ELSE rename.
4. Deactivate: IF the item is not the only active item, mark it inactive; ELSE refuse (cannot remove the last active item).
5. Reactivate: mark the item active again.

Output: a list of matching staff for the chosen competency, with the option to send those staff into the assignment form; and a self-contained, browser-stored competency and knowledge catalog.

---

## 8. Save a training evaluation

File: `director/training_evaluations.html`

Roles involved: Director.

Input (form): the training to evaluate (chosen from conducted trainings only), participants responded (number, required), level (optional: Demonstrated / Partially Demonstrated / Not Demonstrated), feedback summary (required), and per-role feedback (optional).

Process:
1. On page load, collect all "Conducted" trainings from the staff trainings, the office head trainings, the director trainings, and the seeded events. Each is keyed by title, office, and date, and duplicates are removed. Attended trainings are excluded.
2. Load any previously saved evaluations and match them to the conducted trainings by key; saved evaluations that no longer match a conducted training are still listed.
3. Render a table with title, office, date, participants responded, feedback summary, a level pill, and an Edit button.
4. Clicking Add evaluation opens a blank form with the training drop-down enabled; clicking Edit on a row opens the form filled with that training's evaluation and locks the training drop-down. IF there are no conducted trainings, show an informational message and stop.
5. On Save:
   a. Read the chosen training key.
   b. IF no training matches the key, show "Select a conducted training." and stop.
   c. Read participants and summary.
   d. IF participants is empty or the summary is empty, show the required-fields message and stop.
   e. IF an evaluation already exists for that key, update its participants, summary, role feedback, level, and updated date.
   f. ELSE add a new evaluation with an id, the training key, title, office, date, the entered values, and created/updated dates.
   g. Save the evaluations to browser storage, close the form, redraw the table, and show "Evaluation saved."

Output: the evaluation is stored and shown against its conducted training; re-saving the same training updates the existing evaluation.

---

## 9. Partner record save and expiry check

Files: `js/partners_data.js`, `director/partner_organizations.html`, `officehead/partner_organizations.html`

Roles involved: Director (all partners), Office Head (only partners whose lead office is their own office).

### Loading and saving

Process:
1. On read, IF a saved partner list exists and is non-empty, use it and default each partner's lead office to SDU when missing; ELSE use the six built-in seed partners.
2. On save, write the whole list to browser storage.

### Save a partner record

Input (form): organization name, type, contact person, email, phone, MOU expiry date, lead implementing office, signed-by name, and MOU/related document files (only their file names are kept in this prototype).

Process:
1. When the form is submitted, collect the field values and the list of selected document file names (defaulting to a draft file name when none are chosen), and start an empty contributions list.
2. IF an edit id is present:
   a. Find the existing record; IF it is missing, stop.
   b. IF the current office head does not own that partner, stop (Office Head page).
   c. Replace the record, keeping its existing contributions.
3. ELSE create a new record with a generated id, a default zero-value contribution row, and add it to the top of the list.
4. Save the list, close the form, redraw the table, and IF the edited record was the one open in the detail view, reopen its detail.

### Expiry check

Process:
1. Compute days until expiry as the expiry date at midnight minus today at midnight, rounded up to whole days.
2. IF the expiry has passed (negative days), show "Expired".
3. ELSE IF the expiry is within 90 days, show "Expires in N days".
4. ELSE show the formatted expiry date with an "ok" style.
5. The data layer can also return the list of partners expiring within a given window (default 90 days) and the count of those partners.

Output: a partner record is added or updated in the browser, and every listing flags expired or soon-to-expire agreements.

---

## 10. Notification routing

File: `js/notifications.js`

Roles involved: Director, Secretary, Office Head, Staff.

Input: notification records, each with a type, title, message, sender, recipient role, optional recipient office, and optional recipient name. Records come from user actions elsewhere (approvals, assignments, certificate uploads, announcements) and from automatic generation.

Process:
1. Store all notifications in one browser key, keeping at most the most recent 500, newest first.
2. When adding a record, require a recipient role and a message; ignore anything missing those. Skip a record whose id already exists. Fill in default type, title, timestamp, and sender (the current user's name when not given).
3. Determine the current role: office head when the page sets an office head code or is under the officehead folder; staff under the staff folder; secretary under the secretary folder; otherwise the stored session role; otherwise director under the director folder.
4. Determine the current identity: staff is the fixed staff seed (Elena Mae R. Castro, ACCA); office head is taken from the office-head mapping for the current office, defaulting to a fixed name; otherwise Director or Secretary in SDU.
5. A notification matches the user when:
   a. The recipient role equals the user's role, OR the recipient role is "director_secretary" and the user is a Director or Secretary;
   b. AND, if a recipient office is set, it equals the user's office;
   c. AND the recipient name is empty (a broadcast) or equals the user's name.
6. Before showing the list, generate automatic notices: for every assignment (seeded events, director assignments, and the user's office head assignments) where the recipient name is the user, add a "Training assignment" notice; and IF the deadline is 0 to 7 days away (including today), add a "Training deadline approaching" notice. Duplicate ids prevent repeats.
7. Render a bell button in the page header with a badge showing the count of matching notifications, and a panel listing title, message, sender, and time; clicking the bell toggles the panel.
8. A "Send Notification" button (for Director, Secretary, and Office Head) opens a composer:
   a. A Director or Secretary can send to All Staff, All Office Heads, Staff in a specific office (optionally one named person), or the Office Head of a specific office (optionally one named person).
   b. An Office Head can send to the Director (leadership) or to Staff in their own office (optionally one named person).
   c. On Send, IF the title or message is empty, do nothing; ELSE map the chosen audience to a recipient role, office, and name, store the announcement from the sender, close the composer, refresh the list, and confirm "Notification sent."

Output: each signed-in user sees only the notifications addressed to their role, office, and name plus automatic assignment and deadline alerts; privileged users can send targeted announcements.

---

## Things I could not determine

- How a real registration ever reaches the pending-approvals list. The sign-up form only shows an informational message and saves nothing, while pending requests are a fixed seed of two people. The link between registering and being approved is not implemented.
- Whether approving or rejecting an account is meant to create, or record, an account. Approval/rejection only sends a notification and removes the on-screen row; the approved history comes from static staff data and the rejected history is a hard-coded, unrelated list. Neither the approved nor rejected list is updated by the approve/reject actions.
- How passwords are meant to be used. The password field is collected but never checked, stored, or used for routing.
- How an office head's own office is chosen. Each office head page hard-codes a single office code (for example ACCA), so the behaviour for multiple office heads logging in from one shared page is unclear.
- The exact business rule for completing an assigned training. In the prototype a person must first press Complete (moving it to awaiting proof) before an upload is allowed; whether real users are expected to do both steps, or whether uploading alone should complete it, is ambiguous.
- The full lifecycle of a certificate after upload. Uploading marks the assignment completed directly, yet a separate proof review (accept/reject) exists that can also mark assignments completed; the intended order between "upload completes" and "review accepts" is not fully specified.
- Whether "overdue" should be excluded from the pending list or shown separately. The code keeps overdue items inside the pending bucket and only changes the displayed status.
- The intended behaviour when an assignment has no deadline; the overdue rule simply leaves the status unchanged, and it is unclear whether such items should ever become overdue.
- The meaning of some seed/status values. Legacy "proof_pending" values are still read but never written, and it is not confirmed which of the several status names are the intended final set.
- Any true multi-user behaviour. Identities, offices, and recipients are largely hard-coded seeds, and all state is per-browser, so cross-user routing cannot be fully verified from the code alone.
- The unit of the 7-day overdue window. The code adds exactly 7 × 24 hours to the deadline at local midnight, so it is calendar-style days in practice, but no timezone handling is present and the intent is not documented.
