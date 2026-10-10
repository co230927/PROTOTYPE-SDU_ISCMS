# PSEUDOCODE_DRAFT.md

Plain-language pseudocode describing what the current prototype actually does, written without code syntax.

Context: this is a browser-only prototype. All records live in the browser (session storage and local storage) plus fixed seed data in the JavaScript files. There is no server, database, real login, or real file upload. Three working roles exist: Unit Director, Office Head, Staff. The Secretary folder is leftover and unreachable. Each fixed persona also has seeded demo content so the evaluation and competency pages are populated on a fresh load.

At the end there is a list of things that could not be determined from the code.

---

## 1. Login and role routing

Purpose: let a person enter the demo, send them to the correct role area, and keep each page limited to its role. Stores the active role for the session.

Roles involved: Unit Director, Office Head, Staff. (Secretary is not reachable from login.)

Input: an email and password on the login panel; name, email, password, and office on the sign-up panel; the folder name in the page address; the stored session role.

Process (login):
1. When Login is pressed, read the email, convert it to lower case, and remove surrounding spaces.
2. IF the email is empty, show a message asking for an email.
3. ELSE IF the email equals the Director demo address, save the role as Director and open the Director dashboard.
4. ELSE IF the email equals the Staff demo address, save the role as Staff and open the Staff page.
5. ELSE IF the email equals the Office Head demo address, save the role as Office Head and open the Office Head dashboard.
6. ELSE show an "invalid account" message that lists the three accepted addresses.
7. The password text is collected by the form but is never compared to anything.

Process (sign up):
1. When Sign up is pressed, check each field in order.
2. IF the full name is empty, alert and stop.
3. ELSE IF the email is empty, alert and stop.
4. ELSE IF the password is empty, alert and stop.
5. ELSE IF no office is chosen, alert and stop.
6. ELSE show the "Awaiting director approval" message box.
7. When that box is dismissed, clear the fields, reset the office choice, and return to the login view.
8. No account is saved and no pending request is created anywhere.

Process (role enforcement and page chrome):
1. On each page load, work out the page role from the second-to-last folder in the address.
2. IF the folder is the Director or Secretary area and the stored role is not Director/Secretary, redirect to the login page.
3. ELSE IF the folder is the Office Head area and the stored role is not Office Head, redirect to login.
4. ELSE IF the folder is the Staff area and the stored role is not Staff, redirect to login.
5. ELSE allow the page.
6. On a valid page, apply role styling (for example, change the sidebar title to SECRETARY when acting as Secretary) and load the notifications script.
7. IF a Log Out link is clicked, remove the stored role.

Output: the person lands on the dashboard for the chosen role; a page whose folder does not match the stored role sends the person back to login; the sidebar is styled for the role.

---

## 2. Account approval or rejection

Purpose: let the Director (and equivalent dashboard modals) approve or reject demo registration requests and notify the requester. It changes only the on-screen list.

Roles involved: Director (approver), plus Office Head dashboards that show the same approve/reject modals; requesters would be Staff or Office Head.

Input: a fixed seed list of pending requests, each with a name, an email, and a requested office (the prototype seeds two people). For rejection, a typed reason.

Process (approve):
1. Clicking Approve opens a confirmation box naming the person.
2. IF Confirm Approval is pressed AND that request exists AND the notification helper is available:
   a. Work out whether the person is a known Office Head.
   b. IF the person is an Office Head, address the "account approved" notice to the Office Head role; ELSE address it to the Staff role.
   c. Include the requested office and the person's name, and mark the sender as SDU Administration.
3. Remove the request row and close the box.
4. No account is created and no approved-history entry is written by this action.

Process (reject):
1. Clicking Reject opens a box with a reason field.
2. IF Submit Rejection is pressed:
   a. Read and trim the reason.
   b. IF the reason is empty, show "Please provide a reason." and stop.
   c. ELSE IF the request exists AND the notification helper is available, send an "account rejected" notice with the reason, addressed to the Office Head or Staff role as in approval.
   d. Remove the request row and close the box.

Process (history panels on the same page):
1. The Approved Accounts History lists seeded staff per chosen office with a fixed "Approved" status and date; each row has Assign (goes to Training Assignments) and Remove (removes only the on-screen row).
2. The Rejected Accounts History shows a fixed local list with View/Hide and a Clear button that removes only the on-screen row.

Output: the chosen request disappears from the pending list and a notification is sent; the history panels display their seeded or fixed data.

---

## 3. Create a training record for Staff, Office Head and Director

Purpose: each role records its own training events, optionally tags them with competencies and knowledge, and can attach certificate files. Each role keeps its own training store.

Roles involved: Staff, Office Head, Unit Director (each only their own records).

Input (shared form): training name, venue, start date, end date, nature, scope, category, record type (Attended or Conducted), optional competency tags, optional knowledge tags (Director and Office Head forms), one or more role tags, and an optional description. For the certificate box: one or more files and an optional note.

Process:
1. On page load, read that role's saved training records from browser storage.
2. Merge in any baseline seed records that are not already present by name.
3. Fill the category dropdown; fill the competency checkboxes, and for Director and Office Head fill the knowledge checkboxes too. (The Director and Office Head forms load the skills catalog; the Staff form has competency checkboxes only, with no knowledge box.)
4. Render the table and apply the role, category, nature, and record-type filters.
5. When Add is pressed, clear the form (including the competency/knowledge checkboxes) and mark "add" mode. When Edit is pressed on a row, fill the form and re-check that record's competency and knowledge tags, and mark "edit" mode.
6. On Save, read all values, the checked role tags, the checked competency tags, and the checked knowledge tags.
7. IF any required field is missing OR no role tag is checked, show a message and stop.
8. ELSE IF the end date is earlier than the start date, show a message and stop.
9. ELSE IF editing an existing record, overwrite that record's fields including its competency and knowledge tags.
10. ELSE create a new record with a generated id, its competency and knowledge tags, and a created timestamp, and add it to the list.
11. Save the list to that role's browser storage, redraw the table, close the form, and reset it.
12. IF Delete is chosen and confirmed, remove the record and save.
13. IF a certificate is uploaded, and no file is selected, alert and stop; ELSE store an upload bundle (training, file names, file sizes, note) separately from the training rows.
14. A record's status is shown from its dates: Upcoming if today is before the start, Completed if today is after the end, otherwise Ongoing.

Seeded baseline content: the shared seed for the two fixed personas marks their first two records as Conducted and adds competency and knowledge tags from their mapped catalogs. Elena (Staff) gets competencies community organizing, facilitation, stakeholder engagement, and peace education, plus knowledge of program ethics, stakeholder mapping, and learning design. Carlos (Office Head) gets competencies leadership, public speaking, facilitation, and project management, plus knowledge of community development, policy analysis, and participatory learning. Because these tags live in the seed, they also flow into each role's baseline records. The Staff form itself can only set competency tags; the seeded knowledge tags on the Staff persona therefore come from the seed, not from the form.

Output: a new or updated record appears in that role's My Trainings table and can carry competency/knowledge tags and certificate file bundles; deleting removes it.

Notes on storage: Staff records go to the staff training store; Office Head records to the office-head training store; Director records to the director training store (the Director baseline is empty, so the Director starts with no seeded records); uploaded certificate bundles are kept in separate per-role stores.

---

## 4. Certificate upload that completes an assigned training

Purpose: an assignee first marks an assignment complete, then uploads a certificate, which changes the assignment to completed and notifies leadership.

Roles involved: Staff and Office Head (uploaders); Director/Secretary and the relevant Office Head (recipients).

Input: the person's assignments (from seeded events, Director assignments, and Office Head staff assignments filtered to that person), a chosen set of files, and an optional note.

Process:
1. Split the person's assignments into pending (status pending or overdue) and completed (status awaiting proof, proof pending, or completed).
2. IF the Complete button is pressed on a pending row, move it to the completed bucket, set its status to awaiting proof, save the status, and tell the assignment-status helper.
3. IF the Upload certificate button is pressed on an awaiting-proof row, open the upload box.
4. IF the upload is submitted with no file, alert and stop.
5. ELSE store an upload bundle (training, file names, file sizes, note) in that person's uploaded-certificates store.
6. Set the assignment status to completed and tell the assignment-status helper.
7. Send a "certificate uploaded" notice to the Director/Secretary role and to the Office Head role for the person's office.
8. Close the box and refresh the uploaded-files view.

How the assignment-status helper behaves:
1. It keeps one map of assignment id to status in browser storage.
2. When a status changes, it also writes that status into the seeded events, the Director assignments, and any Office Head staff assignments so every view agrees.
3. A separate proof-accept helper can also mark assignments completed by matching a person's name and training title across the three stores; this is only used by the leftover review page, not by the live flow.

Output: the assignment is completed, the uploaded certificate bundle is stored, and the Director/Secretary and Office Head are notified. Certificate uploads are simulated: only file names and sizes are stored, not file contents.

---

## 5. Overdue calculation, 7 days after the deadline

Purpose: decide when a not-yet-finished assignment should be shown as overdue.

Roles involved: none directly; this is a rule used by every assignment view.

Input: a base status, an assignment id (which contains an event id and a person index), and a deadline.

Process:
1. IF the status is already completed or cancelled, OR there is no assignment id, return the status unchanged.
2. Derive the event id by removing the trailing dash-and-number from the assignment id.
3. Find the deadline: first from the seeded training events by event id.
4. IF not found, look in the saved Director assignments by event id.
5. IF still not found, look in the Office Head staff assignments by the full assignment id.
6. IF no deadline is found, return the status unchanged.
7. Turn the deadline into a date at midnight and add exactly seven days to get the overdue moment.
8. IF the current time is later than that overdue moment, return "overdue".
9. ELSE return the original status.
10. The effective-status function first checks for a stored override: IF the override is completed, return completed; IF there is any other override, apply the overdue rule to it; ELSE apply the overdue rule to the base status (which defaults to pending).

Output: an assignment becomes "overdue" only once a full seven days have passed after its deadline; completed and cancelled items are never marked overdue.

---

## 6. Director creates an assignment for staff in any office

Purpose: let the Director assign one training to selected staff across any offices, with a role per person, and put it on the Assignment Board.

Roles involved: Unit Director (creator); Staff and Office Heads (recipients).

Input: training name, description, category, deadline, nature, scope, venue, optional required competencies, one or more selected offices, and one or more selected staff each with a chosen role.

Process:
1. When offices are toggled on, show staff cards for the staff of those offices.
2. Each staff card shows that person's past trainings counted by role, can be selected by clicking, and offers a role choice for this assignment. A name search narrows the cards; Select all and Deselect all act on the visible cards; an optional date range narrows the past-training summary shown on the cards.
3. When Assign and Notify Staff is pressed, read the name and deadline.
4. IF the name is empty, the deadline is empty, no office is selected, or no staff is selected, show a message and stop.
5. ELSE build the list of assigned persons from the chosen staff, each with a role (default Participant) and status pending.
6. Build a new assignment holding the training details, the chosen offices, the required competencies, and the assigned persons, with status pending, and place it at the top of the list.
7. Save the assignment through the recycle-bin store (the Director assignments store).
8. For each assigned person, send a "training assignment" notice to the Staff role, or to the Office Head role if that person is the office's head, addressed to that person's office.
9. Show a success toast, collapse the form, and redraw the board.
10. IF the page was opened from the competency page with staff names in the address, preselect those staff and their offices, expand the form, and redraw.
11. The board is split into incomplete (at least one person not finished) and completed (all finished). Rows open details or delete; deleting moves the assignment into the recycle bin instead of erasing it.

Output: a new assignment is stored, appears on the board, and each recipient and leadership get a notification.

---

## 7. Office Head assigns training to own staff

Purpose: let the Office Head assign a training to staff in their own office, and see the status of each assignment they issued.

Roles involved: Office Head (creator); own-office Staff (recipients); Director/Secretary (notified).

Input: training title, deadline, role, and one or more selected staff (the office's staff excluding the Office Head). The Office Head dashboard "Assign Training" button opens this using an assign flag in the address.

Process:
1. On the dashboard, the Assign Training button goes to the My Trainings page with an assign flag, which opens the assign-to-staff modal automatically. (Arriving with staff names in the address instead pre-checks those staff.)
2. The modal lists the office's staff as checkboxes (excluding the Office Head).
3. When the modal form is submitted:
   a. IF the title is empty, the deadline is empty, or no staff is selected, show a message and stop.
   b. ELSE create one assignment record per selected staff member in the office-scoped Office Head staff-assignment store, each with status pending.
   c. Send an "Office training assignment" notice to the Director/Secretary naming the selected staff.
   d. Send a "new training assignment" notice to each selected staff member.
   e. Close the modal, tell the user notices were sent, and refresh the assigned lists.
4. The "Assigned to my staff" tab reads the office-scoped Office Head staff-assignment store and lists, for each assignment, the staff name, training, role, deadline, description, and a status.
5. For each row, the status comes from the stored value plus the assignment-status helper's effective status, then is labelled Pending, Awaiting certificate, Completed, Cancelled, or Overdue.

Output: one assignment per selected staff member is stored, notifications go to those staff and to leadership, and the "Assigned to my staff" tab shows each person's current status.

---

## 8. Find staff by competency and assign from the results

Purpose: find staff who hold a competency (or knowledge) and send the chosen people into the assignment form.

Roles involved: Unit Director (any office) and Office Head (own office only).

Input: a chosen competency from the catalog. The Director can also choose a knowledge item.

Process (Director page):
1. Fill the drop-down with every competency and every knowledge item.
2. When an item is chosen, look up staff who hold it; each match gets the office from the seeded staff data and their competency badges, sorted by name.
3. IF the Director's own training records are tagged with that item AND the Director is not already listed, add the Unit Director (office SDU) with their tags, then re-sort.
4. Show a count; IF none, show a "no matching staff" row.
5. Render a table with a selection checkbox, name, office, all-competency badges, and an Assign button per row. Clicking a row opens a details box (name, office, competencies, knowledge, training history).
6. IF Assign on a row is pressed, go to the assignment form carrying that one name. IF Assign selected is pressed with no ticks, alert and stop; ELSE carry all ticked names.

Process (Office Head page):
1. Fill the drop-down with competencies only.
2. IF a competency is chosen, list staff in the Office Head's own office who hold it; ELSE list all staff in the office with their competency badges.
3. Render a table with a selection checkbox, name, badges, and an Assign button per row. Clicking a row opens a details box.
4. IF Assign on a row is pressed, go to the Office Head's My Trainings page carrying that one name. IF Assign selected is pressed with no ticks, alert and stop; ELSE carry all ticked names.

Output: a filtered staff list whose Assign action opens the correct assignment form with the chosen staff preselected.

---

## 9. Save a training evaluation for a conducted training, Director and Office Head

Purpose: record event feedback for conducted trainings only; both roles use their own page but the same evaluation store.

Roles involved: Unit Director (any office) and Office Head (own office and staff only). Staff do not create evaluations.

Input: the training chosen from the conducted list, participants responded, an optional level, a feedback summary, and optional per-role feedback.

Process:
1. Collect conducted trainings from Staff records, Office Head records, Director records, and seeded events. Keep only records whose record type is Conducted, and key each one by title, office, and date, removing duplicates.
2. On the Director page, use all conducted trainings found.
3. On the Office Head page, keep only records whose office matches the Office Head's own office (person-based sources by office, and seeded events whose office list includes the own office); do not append evaluations that do not match an own-office conducted training.
4. IF the stored evaluation list is empty, use the seeded fallback evaluation instead of an empty list. The seeded fallback is a single evaluation for the Staff persona's first conducted training (participants responded 12; a feedback summary; role feedback; level Demonstrated); it is shown read-only until anything is saved to the evaluation store, after which the stored list is used.
5. Load the evaluations and match them to conducted trainings by the same title/office/date key, then render the table.
6. Clicking Add evaluation opens a blank form with the training drop-down enabled. Clicking Edit on a row opens the form filled with that training's evaluation and locks the training drop-down.
7. IF there are no conducted trainings, show an informational message and stop.
8. On Save, read the chosen training. IF no training matches, show an error and stop.
9. IF participants is empty OR the feedback summary is empty, show an error and stop.
10. ELSE IF an evaluation already exists for that key, update its participants, summary, role feedback, level, and updated date.
11. ELSE add a new evaluation with a generated id, the training key, title, office, date, the entered values, and created/updated dates.
12. Save the evaluations to the shared evaluation store, close the form, redraw the table, and show a saved message.

Important: there is no 1-to-5 rating anywhere in this flow. The "level" is a text choice (Demonstrated, Partially Demonstrated, Not Demonstrated, or Not set), and "participants responded" is a count, not a rating.

Output: the evaluation is stored against its conducted training and shown in the table; saving the same training again updates the existing evaluation. On a fresh load (before anything is saved) the read-only seeded fallback is shown instead.

---

## 10. Staff views feedback on their conducted trainings

Purpose: let a staff member read the feedback recorded for their own conducted trainings. This page is read-only.

Roles involved: Staff (viewer only).

Input: the staff member's own training records and the saved evaluations.

Process:
1. Read the staff member's own training records; IF none are stored, use the seeded baseline records for that persona instead.
2. Keep only records whose record type is Conducted.
3. Key each one by title, office (the staff member's office), and date.
4. Load saved evaluations and index them by the same key; IF the evaluation store is empty, use the single seeded fallback evaluation.
5. Render a table with the training title and date.
6. IF a matching evaluation exists, show participants responded, feedback summary, per-role feedback, and the level; ELSE show "No feedback recorded yet".
7. IF there are no conducted trainings at all, show "No conducted trainings yet."

Output: a read-only list of the staff member's conducted trainings with the saved (or seeded fallback) feedback, or the "no feedback yet" message. Nothing is saved or edited from this page.

---

## 11. Build the competency and knowledge summary for a staff member

Purpose: show, for each competency and knowledge area the staff member is mapped to, how much their own trainings used it. The Office Head has the equivalent page for their own records.

Roles involved: Staff (the person whose summary is shown).

Input: the staff member's own training records and the mapped competency/knowledge catalogs.

Process:
1. Read the staff member's training records from their own training store; IF none are stored, use the seeded baseline records for that persona instead (these carry the seeded competency and knowledge tags).
2. Get the competencies and the knowledge areas mapped to that person from the catalogs.
3. Render the summary badges at the top, grouped into Competencies and Knowledge areas.
4. For each mapped item, find the person's trainings whose tags include that item's id (competency tags for a competency; knowledge tags for a knowledge area).
5. For those matches, count how many are Attended and how many are Conducted, count the total sessions, and find the latest session date by comparing the training dates.
6. Work out the largest session count across all cards, then set each card's experience bar width in proportion to that largest value (a card with sessions but a tiny share still gets a small visible bar).
7. Render one card per mapped item showing its name, its category, a Competency or Knowledge label, the Attended/Conducted/session counts, the bar, the latest session date, and an expandable list of the matching trainings (title, date, role, record type).
8. IF an item has no matching trainings, show zero counts and a "no trainings tagged with this yet" note.

Output: the badges summary plus one card per mapped competency and knowledge area, each reflecting the person's own training tags. The seeded baseline records carry both competency and knowledge tags, so on a fresh load the cards show real counts. A record the person adds from the Staff form contributes competency tags (the Staff form has no knowledge box); the Office Head form can contribute both.

---

## 12. Partner record save, Office Head limited to own office, and expiry check

Purpose: store partner organizations and their MOU documents, mark expired or expiring agreements, and limit the Office Head to their own office's partners.

Roles involved: Unit Director (all partners); Office Head (only partners whose lead office is their own office).

Input: organization name, type, contact person, email, phone, MOU expiry date, lead implementing office, signed-by name, and MOU/related document files (file names only). For viewing, a period filter (Yearly, Quarterly, Semestral).

Process (load and save):
1. On read, IF a saved partner list exists and is not empty, use it (defaulting each partner's office to SDU when missing); ELSE use the six built-in seed partners.
2. On save, write the whole list to browser storage.

Process (save a partner):
1. When the form is submitted, collect the field values and the chosen document file names (defaulting to a draft name when none are chosen) and start an empty contributions list.
2. IF an edit id is present: find the existing record; IF missing, stop. IF acting as Office Head and the record's office is not the own office, stop. Replace the record while keeping its existing contributions.
3. ELSE create a new record with a generated id, a default zero-value contribution row, and add it to the top of the list.
4. Save the list, close the form, redraw the table, and IF the edited record was open in the detail view, reopen its detail.

Process (expiry check):
1. Compute days until expiry as the expiry date at midnight minus today at midnight, rounded up to whole days.
2. IF the expiry has passed, show "Expired".
3. ELSE IF the expiry is within 90 days, show "Expires in N days".
4. ELSE show the formatted expiry date as the healthy state.

Output: a partner record is added or updated in the browser; every listing flags expired and soon-to-expire agreements; the Office Head can only add or edit records whose lead office matches their own office, while other records stay view-only.

---

## 13. Notification routing and the notification composer

Purpose: show each signed-in person only the notices addressed to them, generate automatic assignment and deadline notices, and let privileged roles send announcements.

Roles involved: Director, Office Head (senders); Director, Secretary, Office Head, Staff (recipients). Staff are receive-only.

Input: notification records (type, title, message, sender, recipient role, optional recipient office, optional recipient name) created by other actions or by the composer; and the current user's role, office, and name.

Process (storage and adding):
1. Keep all notifications in one browser store, newest first, capped at the most recent 500.
2. When adding a record, require a recipient role (or the director/secretary group) and a message; ignore anything missing those. Skip a record whose id already exists. Fill in default type, title, timestamp, and sender when not given.

Process (who sees what):
1. Determine the current role from the page: Office Head when the page is in the office-head area or sets an office-head code; Staff in the staff area; Secretary in the secretary area; otherwise the stored session role; otherwise Director in the director area.
2. Determine the current identity: Staff is the fixed staff persona; Office Head is taken from the office-head list for the current office; otherwise Director or Secretary in SDU.
3. A notice matches the user when the recipient role equals the user's role (or the recipient role is the director/secretary group and the user is Director or Secretary), AND, if a recipient office is set, it equals the user's office, AND the recipient name is empty (a broadcast) or equals the user's name.
4. When showing the list, first generate automatic notices: for every assignment (seeded events, Director assignments, and the user's office-head assignments) addressed to the user, add a "training assignment" notice; and IF the deadline is zero to seven days ahead (including today), add a "training deadline approaching" notice. Duplicate ids prevent repeats.

Process (display and composer):
1. Render a bell in the page header with a badge count of matching notices, and a panel listing each notice's title, message, sender, and time; clicking the bell toggles the panel.
2. A Send Notification button (shown for Director, Secretary, and Office Head) opens a composer.
3. IF the user is Director or Secretary, the audience can be All Staff, All Office Heads, Staff in a specific office (optionally one named person), or the Office Head of a specific office (optionally one named person).
4. IF the user is an Office Head, the audience can be the Director (leadership) or Staff in their own office (optionally one named person).
5. When the composer is submitted, IF the title or message is empty, do nothing; ELSE map the audience to a recipient role, office, and name, store the announcement from the sender, close the composer, refresh the list, and confirm the notice was sent.

Output: each person sees only the notices addressed to their role, office, and name, plus automatic assignment and deadline alerts; Director/Secretary/Office Head can send targeted announcements. Delivery is same-browser only and is not a two-way messaging or inbox feature.

---

## Could not determine

1. How a real registration ever reaches the pending-approvals list. The sign-up form only shows an informational message and saves nothing; pending requests are a fixed seed of two people. The link between registering and being approved is not implemented.
2. Whether approving or rejecting an account is meant to create or record an account. Approval/rejection only sends a notice and removes the on-screen row; approved history comes from static staff data and rejected history is a hard-coded, unrelated list.
3. How passwords are meant to be used. The password input is collected but never checked, stored, or used for routing, and password changes on the profile pages are simulated.
4. How an Office Head's own office is chosen. Each office-head page hard-codes a single office code, so behaviour for multiple office heads sharing one page is unclear.
5. The exact business rule for completing an assigned training. The live flow requires pressing Complete (moving it to awaiting proof) before an upload is allowed; whether real users should do both steps, or whether uploading alone should complete it, is ambiguous.
6. The relationship between uploading a certificate (which completes the assignment directly) and the separate proof review that can also complete assignments. The review path is only used by a leftover page, so the intended order is not stated.
7. Whether "overdue" should be excluded from the pending list or shown separately. The code keeps overdue items inside the pending bucket and only changes the displayed status, and items with no deadline are never marked overdue.
8. The meaning of some stored status values. A legacy "proof pending" value is still read but never written, and it is not confirmed which status names are the intended final set.
9. Whether the seeded demo content (two Conducted records and competency/knowledge tags per persona, plus the one seeded evaluation) is meant to be replaced by real event data, or kept as a permanent sample. The seed is static and the fallback evaluation is read-only until something is saved.
10. Whether an Office Head is intended to be able to edit an evaluation originally created by the Director, since both roles write to the same evaluation store.
11. Any true multi-user behaviour. Identities, offices, and recipients are largely fixed seeds and all state is per-browser, so cross-user routing and delivery cannot be fully verified from the code alone.
