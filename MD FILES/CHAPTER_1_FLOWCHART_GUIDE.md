# CHAPTER_1_FLOWCHART_GUIDE.md

Drawing guide for the proposed-system process flows of Chapter 1, to be drawn as swimlane flowcharts in draw.io. Every step below matches the prototype one to one; behavior that exists only in the planned system (for example proof validation, budget, Secretary, messaging/inbox, numeric ratings, gap analysis, persisted registration) is left out.

Context copied from the paper's own flowwriting style in `MD FILES/PAPER PROPOSAL BEFORE THE DEFENSE/chapter_1.md` (Figure 1.2.2 to Figure 1.2.12): a titled flowchart per module, an off-page / terminal entry, process blocks for user actions, decision diamonds with Yes/No exits, and the role lanes named explicitly. The figure captions here follow the same style, `Figure 1.2.X: Proposed Process Flow for ...`.

Only three roles are used: Staff, Office Head, Unit Director. The System lane holds every automatic step.

---

## 1. Registration, login and account approval

**Caption:** Figure 1.2.1: Proposed Process Flow for Account Registration and Approval

**Swimlanes (top to bottom):** Staff, Office Head, Unit Director, System

**Steps**

| # | Lane | Shape | Step | Prototype page |
|---|------|-------|------|----------------|
| 1 | System | Start (oval) | A user opens the SDU-STMS login page | `login_and_signup/login.html` |
| 2 | Staff | Process (rectangle) | Open the registration form and enter name, email, password, and office | `login_and_signup/login.html` |
| 3 | System | Decision (diamond) | Are all registration fields filled? | `login_and_signup/login.html` |
| 4 | System | Process (rectangle) | Show the "Awaiting director approval" message and return to the login view | `login_and_signup/login.html` |
| 5 | Unit Director | Process (rectangle) | Review the pending account list | `director/pending_approvals.html` |
| 6 | Unit Director | Decision (diamond) | Approve the account? | `director/pending_approvals.html` |
| 7 | System | Process (rectangle) | Send an account_status notification (approved) | `director/pending_approvals.html` |
| 8 | System | Process (rectangle) | Send an account_status notification (rejected) with the reason | `director/pending_approvals.html` |
| 9 | Staff | Process (rectangle) | Log in by entering the institutional email and password | `login_and_signup/login.html` |
| 10 | System | Decision (diamond) | Is it a Staff account? | `login_and_signup/login.html` |
| 11 | System | Decision (diamond) | Is it an Office Head account? | `login_and_signup/login.html` |
| 12 | System | Decision (diamond) | Is it a Unit Director account? | `login_and_signup/login.html` |
| 13 | System | Process (rectangle) | Show the "Invalid account" alert | `login_and_signup/login.html` |
| 14 | Staff | End (oval) | Staff dashboard opens | `staff/staff.html` |
| 15 | Office Head | End (oval) | Office Head dashboard opens | `officehead/dashboard.html` |
| 16 | Unit Director | End (oval) | Unit Director dashboard opens | `director/dashboard.html` |

**Arrows**

- Step 1 -> Step 2
- Step 2 -> Step 3
- Step 3 -> Step 4 [Yes]
- Step 3 -> Step 2 [No]
- Step 4 -> Step 5
- Step 5 -> Step 6
- Step 6 -> Step 7 [Yes]
- Step 6 -> Step 8 [No]
- Step 7 -> Step 9
- Step 8 -> Step 9
- Step 9 -> Step 10
- Step 10 -> Step 14 [Yes]
- Step 10 -> Step 11 [No]
- Step 11 -> Step 15 [Yes]
- Step 11 -> Step 12 [No]
- Step 12 -> Step 16 [Yes]
- Step 12 -> Step 13 [No]
- Step 13 -> Step 9

**System-only notes**

- Step 1: the login page loads.
- Step 3: registration field validation is automatic (the alert is shown when a field is empty).
- Step 4: the pending-approval message is shown automatically.
- Step 7: the approved account_status notification is generated automatically.
- Step 8: the rejected account_status notification with the reason is generated automatically.
- Steps 10 to 12: role routing is automatic, based on the fixed demo email.
- Step 13: the invalid-account alert is shown automatically.

---

## 2. Training record and certificate upload

**Caption:** Figure 1.2.2: Proposed Process Flow for Training Record and Certificate Upload

**Swimlanes (top to bottom):** Staff, Office Head, Unit Director, System

**Steps**

| # | Lane | Shape | Step | Prototype page |
|---|------|-------|------|----------------|
| 1 | System | Start (oval) | A user opens their My Trainings page | `staff/staff_trainings.html`, `officehead/my_trainings.html`, `director/my_trainings.html` |
| 2 | Staff | Process (rectangle) | Encode a training record (title, venue, start and end date, nature, scope, category, record type, participation roles, competencies, knowledge) | `staff/staff_trainings.html` |
| 3 | Office Head | Process (rectangle) | Encode a training record (same fields) | `officehead/my_trainings.html` |
| 4 | Unit Director | Process (rectangle) | Encode a training record (same fields) | `director/my_trainings.html` |
| 5 | System | Decision (diamond) | Are the required fields complete and is the end date not before the start date? | `staff/staff_trainings.html`, `officehead/my_trainings.html`, `director/my_trainings.html` |
| 6 | System | Process (rectangle) | Show an inline validation error | `staff/staff_trainings.html`, `officehead/my_trainings.html`, `director/my_trainings.html` |
| 7 | System | Process (rectangle) | Save the training record to browser storage | `staff/staff_trainings.js`, `js/office_head_trainings_mgmt.js`, `js/director_trainings_mgmt.js` |
| 8 | Staff | Process (rectangle) | Upload certificate file(s) with an optional note for an assigned training | `staff/staff_trainings.html` |
| 9 | Office Head | Process (rectangle) | Upload certificate file(s) with an optional note for an assigned training | `officehead/my_trainings.html` |
| 10 | Unit Director | Process (rectangle) | Upload certificate file(s) with an optional note on own training records | `director/my_trainings.html` |
| 11 | System | Process (rectangle) | Store the certificate file names and sizes (metadata only) | `staff/staff_trainings.js`, `js/office_head_trainings_mgmt.js`, `js/director_trainings_mgmt.js` |
| 12 | Staff | End (oval) | The record and its certificates appear in the list and Uploaded Files tab | `staff/staff_trainings.html`, `officehead/my_trainings.html`, `director/my_trainings.html` |

**Arrows**

- Step 1 -> Step 2
- Step 1 -> Step 3
- Step 1 -> Step 4
- Step 2 -> Step 5
- Step 3 -> Step 5
- Step 4 -> Step 5
- Step 5 -> Step 7 [Yes]
- Step 5 -> Step 6 [No]
- Step 6 -> Step 2
- Step 6 -> Step 3
- Step 6 -> Step 4
- Step 7 -> Step 8
- Step 7 -> Step 9
- Step 7 -> Step 10
- Step 8 -> Step 11
- Step 9 -> Step 11
- Step 10 -> Step 11
- Step 11 -> Step 12

**System-only notes**

- Step 1: the My Trainings page loads for the signed-in role.
- Step 5: field and date validation is automatic.
- Step 6: the validation error is shown automatically.
- Step 7: the training record is saved automatically to the role's storage key.
- Step 11: certificate metadata is stored automatically (when the certificate belongs to an assignment, this also completes that assignment, detailed in Section 3).

---

## 3. Training assignment and completion

**Caption:** Figure 1.2.3: Proposed Process Flow for Training Assignment and Completion

**Swimlanes (top to bottom):** Staff, Office Head, Unit Director, System

**Steps**

| # | Lane | Shape | Step | Prototype page |
|---|------|-------|------|----------------|
| 1 | System | Start (oval) | A creator opens the assignment page | `director/training_assignments.html`, `officehead/my_trainings.html` |
| 2 | Unit Director | Process (rectangle) | Create an assignment for staff in any office (title, description, category, deadline, nature, scope, venue, required competencies, offices, staff with a role per person) | `director/training_assignments.html` |
| 3 | Office Head | Process (rectangle) | Create an assignment for own staff (title, deadline, role, own staff) | `officehead/my_trainings.html` |
| 4 | System | Decision (diamond) | Are all required assignment details complete and valid? | `director/training_assignments.html`, `officehead/my_trainings.html` |
| 5 | System | Process (rectangle) | Show validation errors | `director/training_assignments.html`, `officehead/my_trainings.html` |
| 6 | System | Process (rectangle) | Save the assignment and send an assignment notification to each assignee | `director/training_assignments.html`, `officehead/my_trainings.html`, `js/notifications.js` |
| 7 | Staff | Process (rectangle) | Open My Trainings and mark the assigned training done | `staff/staff_trainings.html` |
| 8 | Office Head | Process (rectangle) | Open My Trainings and mark the assigned training done | `officehead/my_trainings.html` |
| 9 | System | Process (rectangle) | Set the assignment status to Awaiting Certificate | `js/assignment_status.js` |
| 10 | Staff | Decision (diamond) | Cancel the assignment instead? | `staff/staff_trainings.html` |
| 11 | Office Head | Decision (diamond) | Cancel the assignment instead? | `officehead/my_trainings.html` |
| 12 | System | Process (rectangle) | Set the assignment status to Cancelled | `js/assignment_status.js` |
| 13 | Staff | Process (rectangle) | Upload the certificate file(s) with an optional note | `staff/staff_trainings.html` |
| 14 | Office Head | Process (rectangle) | Upload the certificate file(s) with an optional note | `officehead/my_trainings.html` |
| 15 | System | Process (rectangle) | Set the assignment status to Completed and notify the Unit Director and Office Head | `js/assignment_status.js`, `js/notifications.js` |
| 16 | System | Decision (diamond) | Is the assignment neither Completed nor Cancelled and more than 7 days past the deadline? | `js/assignment_status.js` |
| 17 | System | Process (rectangle) | Derive and display the Overdue status | `director/training_assignments.html`, `officehead/my_trainings.html` |
| 18 | System | End (oval) | Statuses are shown on the Assignment Board and the Assigned to my staff tab | `director/training_assignments.html`, `officehead/my_trainings.html` |

**Arrows**

- Step 1 -> Step 2
- Step 1 -> Step 3
- Step 2 -> Step 4
- Step 3 -> Step 4
- Step 4 -> Step 6 [Yes]
- Step 4 -> Step 5 [No]
- Step 5 -> Step 2
- Step 5 -> Step 3
- Step 6 -> Step 7
- Step 6 -> Step 8
- Step 7 -> Step 9
- Step 8 -> Step 9
- Step 9 -> Step 10
- Step 9 -> Step 11
- Step 10 -> Step 12 [Yes]
- Step 10 -> Step 13 [No]
- Step 11 -> Step 12 [Yes]
- Step 11 -> Step 14 [No]
- Step 13 -> Step 15
- Step 14 -> Step 15
- Step 12 -> Step 18
- Step 15 -> Step 16
- Step 16 -> Step 17 [Yes]
- Step 16 -> Step 18 [No]
- Step 17 -> Step 18

**System-only notes**

- Step 1: the assignment page loads.
- Step 4: assignment field validation is automatic.
- Step 5: validation errors are shown automatically.
- Step 6: the assignment is saved and the assignment notifications are dispatched automatically.
- Step 9: the status change to Awaiting Certificate is automatic.
- Step 12: the status change to Cancelled is automatic.
- Step 15: the status change to Completed and the certificate-uploaded notifications are automatic.
- Step 16: the overdue check (7 days after the deadline) is automatic.
- Step 17: the derived Overdue status is calculated automatically and never stored.
- Step 18: the status board read is automatic.

---

## 4. Finding staff by competency

**Caption:** Figure 1.2.4: Proposed Process Flow for Finding Staff by Competency

**Swimlanes (top to bottom):** Office Head, Unit Director, System (Staff does not take part)

**Steps**

| # | Lane | Shape | Step | Prototype page |
|---|------|-------|------|----------------|
| 1 | System | Start (oval) | A user opens the competency search page | `director/find_staff_by_skill.html`, `officehead/staff_skills.html` |
| 2 | Unit Director | Process (rectangle) | Select a competency or knowledge area to search across all offices | `director/find_staff_by_skill.html` |
| 3 | Office Head | Process (rectangle) | Select a competency or knowledge area to search within own office | `officehead/staff_skills.html` |
| 4 | System | Process (rectangle) | Read the staff training tags and the competency and knowledge catalog | `js/skills_data.js` |
| 5 | System | Decision (diamond) | Are there staff matching the selected competency or knowledge area? | `director/find_staff_by_skill.html`, `officehead/staff_skills.html` |
| 6 | System | Process (rectangle) | Show a no-match message | `director/find_staff_by_skill.html`, `officehead/staff_skills.html` |
| 7 | System | Process (rectangle) | Display matched staff with office and competency badges | `director/find_staff_by_skill.html`, `officehead/staff_skills.html` |
| 8 | Unit Director | Decision (diamond) | Assign a matched staff member to training? | `director/find_staff_by_skill.html` |
| 9 | System | Process (rectangle) | Open Training Assignments with the chosen staff pre-selected | `director/training_assignments.html` |
| 10 | Office Head | Decision (diamond) | Assign a matched staff member to training? | `officehead/staff_skills.html` |
| 11 | System | Process (rectangle) | Open My Trainings with the chosen staff pre-selected | `officehead/my_trainings.html` |
| 12 | System | End (oval) | Search ends | `director/find_staff_by_skill.html`, `officehead/staff_skills.html` |

**Arrows**

- Step 1 -> Step 2
- Step 1 -> Step 3
- Step 2 -> Step 4
- Step 3 -> Step 4
- Step 4 -> Step 5
- Step 5 -> Step 7 [Yes]
- Step 5 -> Step 6 [No]
- Step 6 -> Step 12
- Step 7 -> Step 8
- Step 7 -> Step 10
- Step 8 -> Step 9 [Yes]
- Step 8 -> Step 12 [No]
- Step 9 -> Step 12
- Step 10 -> Step 11 [Yes]
- Step 10 -> Step 12 [No]
- Step 11 -> Step 12

**System-only notes**

- Step 1: the search page loads.
- Step 4: the matching is computed automatically from training tags and the catalog.
- Step 5: the match test is automatic.
- Step 6: the no-match message is shown automatically.
- Step 7: the matched staff list is rendered automatically.
- Step 9 and Step 11: the pre-selected hand-off to the assignment page is automatic.

---

## 5. Evaluation of conducted trainings

**Caption:** Figure 1.2.5: Proposed Process Flow for Evaluating Conducted Trainings

**Swimlanes (top to bottom):** Staff, Office Head, Unit Director, System

**Steps**

| # | Lane | Shape | Step | Prototype page |
|---|------|-------|------|----------------|
| 1 | System | Start (oval) | An evaluator opens the Training Evaluations page | `director/training_evaluations.html`, `officehead/training_evaluations.html` |
| 2 | System | Process (rectangle) | List only trainings whose record type is Conducted | `director/training_evaluations.html`, `officehead/training_evaluations.html` |
| 3 | Unit Director | Process (rectangle) | Select a conducted training (all offices) and enter participants responded, feedback summary, optional per-role feedback, and the optional overall rating (4 Excellent, 3 Very Good, 2 Good, 1 Poor) | `director/training_evaluations.html` |
| 4 | Office Head | Process (rectangle) | Select a conducted training (own office) and enter the same evaluation fields | `officehead/training_evaluations.html` |
| 5 | System | Decision (diamond) | Are participants responded and feedback summary filled? | `director/training_evaluations.html`, `officehead/training_evaluations.html` |
| 6 | System | Process (rectangle) | Show validation error | `director/training_evaluations.html`, `officehead/training_evaluations.html` |
| 7 | System | Process (rectangle) | Save one evaluation per conducted training | `director/training_evaluations.html`, `officehead/training_evaluations.html` |
| 8 | Staff | Process (rectangle) | Open My Evaluations (read-only) | `staff/my_evaluations.html` |
| 9 | System | Process (rectangle) | Show the saved feedback and overall rating for the staff member's own conducted trainings | `staff/my_evaluations.html` |
| 10 | Staff | End (oval) | Feedback view ends | `staff/my_evaluations.html` |

**Arrows**

- Step 1 -> Step 2
- Step 2 -> Step 3
- Step 2 -> Step 4
- Step 3 -> Step 5
- Step 4 -> Step 5
- Step 5 -> Step 7 [Yes]
- Step 5 -> Step 6 [No]
- Step 6 -> Step 3
- Step 6 -> Step 4
- Step 7 -> Step 8
- Step 8 -> Step 9
- Step 9 -> Step 10

**System-only notes**

- Step 1: the evaluation page loads.
- Step 2: the conducted-training list is filtered automatically.
- Step 5: the required-field check is automatic.
- Step 6: the validation error is shown automatically.
- Step 7: the evaluation is stored automatically, one per conducted training.
- Step 9: the read-only feedback view is rendered automatically.

---

## 6. Partner institution management and expiry monitoring

**Caption:** Figure 1.2.6: Proposed Process Flow for Partner Institution Management and Expiry Monitoring

**Swimlanes (top to bottom):** Office Head, Unit Director, System (Staff does not take part)

**Steps**

| # | Lane | Shape | Step | Prototype page |
|---|------|-------|------|----------------|
| 1 | System | Start (oval) | A user opens the Partner Organizations page | `director/partner_organizations.html`, `officehead/partner_organizations.html` |
| 2 | Unit Director | Process (rectangle) | Add or edit any partner record (name, type, contact, email, phone, expiry date, lead implementing office, signed by) and attach MOU/agreement file names | `director/partner_organizations.html` |
| 3 | Office Head | Process (rectangle) | Add or edit partner records for own office and view the rest (same fields and file names) | `officehead/partner_organizations.html` |
| 4 | System | Decision (diamond) | Are the required partner fields filled? | `director/partner_organizations.html`, `officehead/partner_organizations.html` |
| 5 | System | Process (rectangle) | Show validation error | `director/partner_organizations.html`, `officehead/partner_organizations.html` |
| 6 | System | Process (rectangle) | Save the partner record to browser storage | `js/partners_data.js` |
| 7 | System | Process (rectangle) | Compute the agreement expiry against the current date (90-day window) | `js/partners_data.js` |
| 8 | System | Decision (diamond) | Is the agreement expired or expiring soon? | `director/partner_organizations.html`, `officehead/partner_organizations.html`, dashboards |
| 9 | System | Process (rectangle) | Show the Expired or Expiring-soon indicator | `director/partner_organizations.html`, `officehead/partner_organizations.html` |
| 10 | Office Head | Process (rectangle) | View the contribution breakdown by period (Yearly, Quarterly, Semestral) | `officehead/partner_organizations.html` |
| 11 | Unit Director | Process (rectangle) | View the contribution breakdown by period (Yearly, Quarterly, Semestral) | `director/partner_organizations.html` |
| 12 | System | End (oval) | Partner management ends | `director/partner_organizations.html`, `officehead/partner_organizations.html` |

**Arrows**

- Step 1 -> Step 2
- Step 1 -> Step 3
- Step 2 -> Step 4
- Step 3 -> Step 4
- Step 4 -> Step 6 [Yes]
- Step 4 -> Step 5 [No]
- Step 5 -> Step 2
- Step 5 -> Step 3
- Step 6 -> Step 7
- Step 7 -> Step 8
- Step 8 -> Step 9 [Yes]
- Step 8 -> Step 10 [No]
- Step 9 -> Step 10
- Step 9 -> Step 11
- Step 10 -> Step 12
- Step 11 -> Step 12

**System-only notes**

- Step 1: the partner page loads.
- Step 4: partner field validation is automatic.
- Step 5: the validation error is shown automatically.
- Step 6: the partner record is saved automatically to storage.
- Step 7: the expiry comparison is computed automatically.
- Step 8: the expired/expiring-soon test is automatic.
- Step 9: the expiry indicator is rendered automatically. Note: the prototype computes this indicator for display only; it does not write an automatic partner-expiry notification.

---

## 7. Notifications, dashboards and reports

**Caption:** Figure 1.2.7: Proposed Process Flow for Notifications, Dashboards and Reports

**Swimlanes (top to bottom):** Staff, Office Head, Unit Director, System

**Steps**

| # | Lane | Shape | Step | Prototype page |
|---|------|-------|------|----------------|
| 1 | System | Start (oval) | A user opens a dashboard | `director/dashboard.html`, `officehead/dashboard.html`, `staff/staff.html` |
| 2 | Unit Director | Process (rectangle) | View the Central Monitoring Dashboard (unit-wide records, completion rates, competency coverage) | `director/dashboard.html` |
| 3 | Office Head | Process (rectangle) | View the Office Head dashboard (own-office activity and participation roles) | `officehead/dashboard.html` |
| 4 | Staff | Process (rectangle) | View the Staff dashboard (training history, assignments, competency profile, notifications) | `staff/staff.html` |
| 5 | System | Process (rectangle) | Apply the time filter (Academic Year, 1st Semester, 2nd Semester) and show the filtered cards | dashboards, `js/staff_data.js` |
| 6 | System | Process (rectangle) | Generate the automatic notices (account status, assignment, certificate uploaded) in the notification bell | `js/notifications.js` |
| 7 | Unit Director | Process (rectangle) | Compose a one-way announcement and select recipients (all Staff, all Office Heads, an office, or a person) | `js/notifications.js` |
| 8 | Office Head | Process (rectangle) | Compose a one-way announcement to the Unit Director or own-office Staff | `js/notifications.js` |
| 9 | Staff | Process (rectangle) | Receive and read notifications (no inbox and no reply) | `js/notifications.js` |
| 10 | Unit Director / Office Head / Staff | Process (rectangle) | Open a report or directory and choose CSV export or print | `director/reports.html`, `officehead/reports.html`, `staff/staff_reports.html`, `director/directories.html`, `officehead/directories.html` |
| 11 | System | Process (rectangle) | Generate the CSV file or the printable output from the live data | report and directory pages |
| 12 | System | End (oval) | Report or export is produced | report and directory pages |

**Arrows**

- Step 1 -> Step 2
- Step 1 -> Step 3
- Step 1 -> Step 4
- Step 2 -> Step 5
- Step 3 -> Step 5
- Step 4 -> Step 5
- Step 5 -> Step 6
- Step 6 -> Step 7
- Step 6 -> Step 8
- Step 6 -> Step 9
- Step 7 -> Step 10
- Step 8 -> Step 10
- Step 9 -> Step 10
- Step 10 -> Step 11
- Step 11 -> Step 12

**System-only notes**

- Step 1: the dashboard loads for the signed-in role.
- Step 5: the time filter and card rendering are automatic (the prototype uses semesters as the academic-year halves).
- Step 6: the automatic account_status, assignment, and certificate_uploaded notices are generated automatically.
- Step 11: the CSV or print output is generated automatically from the live data.

---

## Legend of shapes

- **Oval** — Start or End terminal.
- **Rectangle** — Process (a user action or an automatic System action).
- **Diamond** — Decision; every exit is labelled **Yes** or **No**.
- **Swimlane (horizontal band)** — One role or the System. Lane order is Staff, Office Head, Unit Director, System; the System lane holds the automatic steps, and only the lanes that take part appear in a given flow.

## Checklist of figure captions

- [ ] Figure 1.2.1: Proposed Process Flow for Account Registration and Approval
- [ ] Figure 1.2.2: Proposed Process Flow for Training Record and Certificate Upload
- [ ] Figure 1.2.3: Proposed Process Flow for Training Assignment and Completion
- [ ] Figure 1.2.4: Proposed Process Flow for Finding Staff by Competency
- [ ] Figure 1.2.5: Proposed Process Flow for Evaluating Conducted Trainings
- [ ] Figure 1.2.6: Proposed Process Flow for Partner Institution Management and Expiry Monitoring
- [ ] Figure 1.2.7: Proposed Process Flow for Notifications, Dashboards and Reports

DONE
