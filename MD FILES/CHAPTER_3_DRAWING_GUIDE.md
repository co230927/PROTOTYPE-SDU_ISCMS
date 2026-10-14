# CHAPTER 3 DRAWING GUIDE (SDU-STMS)

How to use this file: draw each figure in draw.io (app.diagrams.net). Every line below is one arrow or one box. Names match CHAPTER_3_V2.md exactly. Save each as .drawio, export PNG for the paper.

Format used below:
- `A -> B : label` means draw an arrow from A to B and write the label on the arrow.
- `[Name]` is an external entity (rectangle).
- `(1.0 Name)` is a process (big rounded box).
- `|D1 Users|` is a data store (open-ended rectangle).

DFD rules for every figure:
1. Processes are the BIGGEST shapes. Entities and stores are smaller. (The panel asked for this.)
2. Every arrow has a label. Use the labels given here.
3. An entity never connects directly to a data store. A process is always in between.
4. Use the same names as the chapter text.
5. Put the processes in the middle, entities on the left and right edges, data stores at the bottom or top.

---

## FIGURE 3.1: Three-Tier Client-Server Architecture Diagram of SDU-STMS

Draw three big stacked boxes, top to bottom.

TIER 1 box: "Tier 1 - Presentation Layer (Client - Web Browser)"
- Inside, top: one box "System Landing Page | Login Form | Sign Up Form"
- A small box "Redirects"
- Under it, three role boxes side by side, each with its page list under it:
  - [Unit Director]: Unit dashboard; Staff and office directories; Find staff by competency; Training assignment form; My trainings; Training evaluations; Partner organizations directory; Account approval; Catalog management (training categories, competencies, knowledge); Reports, action history, export and print; Notifications
  - [Office Head]: Office dashboard; Office staff directory; Staff competencies with assign; My trainings and my competencies; Assign training to own staff; Training evaluations (own office); Partner directory (edit own office); Reports and action history; Notifications and announcements
  - [Staff]: Personal dashboard; My trainings (participation roles, certificate upload); Assigned trainings and deadlines; My competencies and knowledge; My evaluations (feedback on conducted trainings); Reports; Notifications

TIER 2 box: "Tier 2 - Application Layer (Logic - Laravel)"
- Eight small boxes in two rows:
  - Account Management (RBAC, login, approval)
  - Training Profile (records, participation roles, certificate upload)
  - Training Management (assignment, find staff by competency, status and overdue)
  - Training Evaluation
  - Partner Institution Management (expiry monitoring)
  - Monitoring and Reporting (dashboards, filters, export, action history)
  - Notifications (automatic notices, announcements)
  - Catalog Management (training categories, competencies, knowledge)
- One wide bottom box: "Laravel controller layer: Routing, RBAC, File validation, Business rules, Session management, Deadline enforcement (7 days), Partner expiry checks, Competency profile calculation, API responses"

TIER 3 box: "Tier 3 - Data Layer (Database - PostgreSQL)"
- Boxes: Offices; Users; Categories (training, competency, knowledge); Training records (with roles and tags); Certificates; Assignments (with assignees and competencies); Training evaluations; Partner institutions (with agreements and contributions); Notifications; Action history
- One separate box: "Cloudinary file storage: certificate and agreement files (the database keeps only references)"

Arrows between tiers:
```
Tier 1 -> Tier 2 : HTTP request / form submissions
Tier 2 -> Tier 1 : JSON response / rendered HTML  (dashed)
Tier 2 -> Tier 3 : Reads / writes data (PostgreSQL)
Tier 3 -> Tier 2 : Returns query result  (dashed)
Tier 2 -> Cloudinary box : Uploads / retrieves files
```
Do NOT draw: Secretary, budget, proof validation, rating, inbox.

---

## FIGURE 3.3.1.A: Context Data Flow Diagram of SDU-STMS

One process in the middle: (0 SDU-STMS). Three entities around it: [Staff], [Office Head], [Unit Director]. No data stores appear at this level, and every external flow here must reappear on Figure 3.3.1.B. Note the corrections from the earlier draft: Staff only receive notifications (Staff send none), the Unit Director's notification flow is listed once, and login credentials are a flow for all three entities.

**Staff**
```
[Staff] -> (0 SDU-STMS) : registration details
[Staff] -> (0 SDU-STMS) : login credentials
[Staff] -> (0 SDU-STMS) : training records
[Staff] -> (0 SDU-STMS) : certificates
[Staff] -> (0 SDU-STMS) : profile updates
[Staff] -> (0 SDU-STMS) : assigned-training completion and status change
[Staff] -> (0 SDU-STMS) : filter selections and export or print requests
(0 SDU-STMS) -> [Staff] : account status
(0 SDU-STMS) -> [Staff] : personal dashboard
(0 SDU-STMS) -> [Staff] : training records
(0 SDU-STMS) -> [Staff] : training assignment view and statuses
(0 SDU-STMS) -> [Staff] : competency and knowledge profile
(0 SDU-STMS) -> [Staff] : evaluation feedback on own conducted trainings
(0 SDU-STMS) -> [Staff] : action history
(0 SDU-STMS) -> [Staff] : received notifications
(0 SDU-STMS) -> [Staff] : printable or exported file
```

**Office Head**
```
[Office Head] -> (0 SDU-STMS) : registration details
[Office Head] -> (0 SDU-STMS) : login credentials
[Office Head] -> (0 SDU-STMS) : training records
[Office Head] -> (0 SDU-STMS) : certificates
[Office Head] -> (0 SDU-STMS) : profile updates
[Office Head] -> (0 SDU-STMS) : assignments to own staff
[Office Head] -> (0 SDU-STMS) : assigned-training completion and status change
[Office Head] -> (0 SDU-STMS) : evaluations of conducted trainings
[Office Head] -> (0 SDU-STMS) : own-office partner records and agreement files
[Office Head] -> (0 SDU-STMS) : announcements
[Office Head] -> (0 SDU-STMS) : filter selections and export or print requests
(0 SDU-STMS) -> [Office Head] : account status
(0 SDU-STMS) -> [Office Head] : office dashboard
(0 SDU-STMS) -> [Office Head] : staff records and competency search results
(0 SDU-STMS) -> [Office Head] : training records
(0 SDU-STMS) -> [Office Head] : training assignment view and statuses
(0 SDU-STMS) -> [Office Head] : evaluations in scope
(0 SDU-STMS) -> [Office Head] : partner institution directory
(0 SDU-STMS) -> [Office Head] : action history
(0 SDU-STMS) -> [Office Head] : received notifications
(0 SDU-STMS) -> [Office Head] : printable or exported file
```

**Unit Director**
```
[Unit Director] -> (0 SDU-STMS) : login credentials
[Unit Director] -> (0 SDU-STMS) : account decisions
[Unit Director] -> (0 SDU-STMS) : training records
[Unit Director] -> (0 SDU-STMS) : certificates
[Unit Director] -> (0 SDU-STMS) : catalog entries
[Unit Director] -> (0 SDU-STMS) : assignments
[Unit Director] -> (0 SDU-STMS) : evaluations of conducted trainings
[Unit Director] -> (0 SDU-STMS) : partner records and agreement files
[Unit Director] -> (0 SDU-STMS) : announcements
[Unit Director] -> (0 SDU-STMS) : filter selections and export or print requests
(0 SDU-STMS) -> [Unit Director] : pending accounts
(0 SDU-STMS) -> [Unit Director] : central monitoring dashboard
(0 SDU-STMS) -> [Unit Director] : system-wide directories and competency search results
(0 SDU-STMS) -> [Unit Director] : training records
(0 SDU-STMS) -> [Unit Director] : assignment statuses
(0 SDU-STMS) -> [Unit Director] : evaluations
(0 SDU-STMS) -> [Unit Director] : partner institution directory and expiry alerts
(0 SDU-STMS) -> [Unit Director] : action history
(0 SDU-STMS) -> [Unit Director] : received notifications
(0 SDU-STMS) -> [Unit Director] : printable or exported file
```
Tip: if there are too many arrows, draw ONE arrow per direction for each entity and put the labels in a list on that arrow (separate with commas).

---

## FIGURE 3.3.1.B: Level 0 Data Flow Diagram of SDU-STMS

Six big processes in the middle (two rows of three):
(1.0 Account and Catalog Management), (2.0 Training Record Management), (3.0 Training Assignment), (4.0 Training Evaluation), (5.0 Partner Institution Management), (6.0 Monitoring, Reports, and Notifications)

Entities: [Staff] on the left, [Office Head] at the bottom or top, [Unit Director] on the right.
Stores along the bottom: |D1 Users|, |D2 Offices|, |D3 Catalogs|, |D4 Training Records|, |D5 Certificates|, |D6 Assignments|, |D7 Evaluations|, |D8 Partner Institutions|, |D9 Notifications|, |D10 Action History|

Entity arrows (these must match Figure 3.3.1.A exactly):
```
Staff
[Staff] -> (1.0) : registration details, login credentials, profile updates
[Staff] -> (2.0) : training records, certificates
[Staff] -> (3.0) : assigned-training completion, certificate upload
[Staff] -> (6.0) : filter selections, export or print requests
(1.0) -> [Staff] : account status
(2.0) -> [Staff] : own training records and certificates
(3.0) -> [Staff] : training assignment view and statuses
(4.0) -> [Staff] : evaluation feedback on own conducted trainings
(6.0) -> [Staff] : personal dashboard, competency and knowledge profile, action history, notifications, printable or exported file

Office Head
[Office Head] -> (1.0) : registration details, login credentials, profile updates
[Office Head] -> (2.0) : training records, certificates
[Office Head] -> (3.0) : assignments to own staff, assigned-training completion, competency filter
[Office Head] -> (4.0) : evaluations of conducted trainings
[Office Head] -> (5.0) : own-office partner records and agreement files
[Office Head] -> (6.0) : announcements, filter selections, export or print requests
(1.0) -> [Office Head] : account status
(2.0) -> [Office Head] : own training records and certificates
(3.0) -> [Office Head] : matching staff, training assignment view and statuses
(4.0) -> [Office Head] : evaluations in scope
(5.0) -> [Office Head] : partner institution directory
(6.0) -> [Office Head] : office dashboard, staff records and competency search results, action history, reports and printable or exported file, notifications

Unit Director
[Unit Director] -> (1.0) : login credentials, account decisions, catalog entries
[Unit Director] -> (2.0) : own training records and certificates
[Unit Director] -> (3.0) : assignments, competency filter
[Unit Director] -> (4.0) : evaluations of conducted trainings
[Unit Director] -> (5.0) : partner records and agreement files
[Unit Director] -> (6.0) : announcements, filter selections, export or print requests
(1.0) -> [Unit Director] : pending accounts
(2.0) -> [Unit Director] : own training records and certificates
(3.0) -> [Unit Director] : competency search results, assignment statuses
(4.0) -> [Unit Director] : evaluations
(5.0) -> [Unit Director] : partner institution directory, expiry alerts
(6.0) -> [Unit Director] : central monitoring dashboard, system-wide directories and competency search results, action history, reports and printable or exported file, notifications, alerts
```

Process to process arrows (notification triggers):
```
(1.0) -> (6.0) : account status notices
(3.0) -> (6.0) : assignment and certificate notices
(5.0) -> (6.0) : expiry alerts
```

Process and data store arrows (double arrow = reads and writes):
```
(1.0) <-> |D1 Users|
(1.0) <-> |D3 Catalogs|
(1.0) -> |D10 Action History| : action log
|D2 Offices| -> (1.0) : office list
(2.0) <-> |D4 Training Records|
(2.0) <-> |D5 Certificates|
|D3 Catalogs| -> (2.0) : category, competency, knowledge values
(2.0) -> |D10 Action History| : action log
|D1 Users| -> (3.0) : staff
|D2 Offices| -> (3.0) : offices
|D3 Catalogs| -> (3.0) : competencies
|D4 Training Records| -> (3.0) : tagged records
(3.0) <-> |D6 Assignments|
(3.0) -> |D5 Certificates| : certificate for completed assignment
|D4 Training Records| -> (4.0) : conducted records
(4.0) <-> |D7 Evaluations|
(4.0) -> |D10 Action History| : action log
(5.0) <-> |D8 Partner Institutions|
|D2 Offices| -> (5.0) : lead office
|D1..D8| -> (6.0) : data for dashboards, directories, profiles
(6.0) <-> |D9 Notifications|
(6.0) <-> |D10 Action History|
```
Tip: to keep it readable, draw the stores as one long row and let arrows come up from the row.

---

## LEVEL 1 DFDs (Figures 3.3.1.C to 3.3.1.H)

For each: the big dashed frame is the process. Inside it draw the sub-processes as medium rounded boxes. Outside draw the entities and stores that it touches (listed).

### FIGURE 3.3.1.C: Level 1 for (1.0 Account and Catalog Management)
Sub-processes: (1.1 Registration), (1.2 Login and Role Routing), (1.3 Account Approval or Rejection), (1.4 Profile Maintenance), (1.5 Catalog Management)
Outside: [Staff], [Office Head], [Unit Director], |D1 Users|, |D2 Offices|, |D3 Catalogs|, |D10 Action History|, and a small box (6.6 Notifications) from Process 6.0

```
[Staff / Office Head] -> (1.1) : name, email, password, office
|D2 Offices| -> (1.1) : office list
(1.1) -> |D1 Users| : new account (Pending)
[Any user] -> (1.2) : email, password
|D1 Users| -> (1.2) : account record and role
(1.2) -> [Any user] : role dashboard or error message
|D1 Users| -> (1.3) : pending accounts
[Unit Director] -> (1.3) : approve or reject decision (with reason)
(1.3) -> |D1 Users| : account status (Active or Rejected), assigned role, rejection reason
(1.3) -> (6.6 Notifications) : account status notice
(1.3) -> [Applicant: Staff / Office Head] : account decision (approved or rejected)
(1.3) -> |D10 Action History| : action log
[Any user] -> (1.4) : contact details, employment status, job function, notification preferences
(1.4) -> |D1 Users| : updated profile
[Unit Director] -> (1.5) : new, renamed, deactivated or reactivated catalog entries
|D3 Catalogs| -> (1.5) : current catalog values
(1.5) -> |D3 Catalogs| : updated catalogs
(1.5) -> |D10 Action History| : action log
```

### FIGURE 3.3.1.D: Level 1 for (2.0 Training Record Management)
Sub-processes: (2.1 Record Input), (2.2 Certificate Upload), (2.3 Record View and Edit)
Outside: [Staff], [Office Head], [Unit Director], |D3 Catalogs|, |D4 Training Records|, |D5 Certificates|, |D10 Action History|

```
[Staff / Office Head / Unit Director] -> (2.1) : training details, record type, participation roles, competencies, knowledge
|D3 Catalogs| -> (2.1) : category, competency and knowledge values
(2.1) -> |D4 Training Records| : training record (with roles and tags)
(2.1) -> |D10 Action History| : action log
[Staff / Office Head / Unit Director] -> (2.2) : certificate files, optional note
|D4 Training Records| -> (2.2) : record to attach to
(2.2) -> |D5 Certificates| : certificate file references
(2.2) -> |D10 Action History| : action log
[Staff / Office Head / Unit Director] -> (2.3) : view or edit request
|D4 Training Records| -> (2.3) : own records
|D5 Certificates| -> (2.3) : own certificates
(2.3) -> |D4 Training Records| : edited record
(2.3) -> [Staff / Office Head / Unit Director] : own records and certificates
(2.3) -> |D10 Action History| : action log
```

### FIGURE 3.3.1.E: Level 1 for (3.0 Training Assignment)
Sub-processes: (3.1 Find Staff by Competency), (3.2 Assignment Creation), (3.3 Assignment Notification), (3.4 Status Update)
Outside: [Unit Director], [Office Head], [Staff], |D1|, |D2|, |D3|, |D4|, |D5|, |D6|, (6.6 Notifications)

```
[Unit Director / Office Head] -> (3.1) : competency or knowledge filter
|D1 Users| -> (3.1) : staff
|D2 Offices| -> (3.1) : offices
|D3 Catalogs| -> (3.1) : competencies and knowledge
|D4 Training Records| -> (3.1) : tagged training records
(3.1) -> [Unit Director / Office Head] : matching staff
(3.1) -> (3.2) : selected staff
[Unit Director] -> (3.2) : assignment details, offices, staff with role per person, required competencies
[Office Head] -> (3.2) : title, deadline, role, own staff
(3.2) -> |D6 Assignments| : assignment, assignees, required competencies
(3.2) -> (3.3) : new assignment
(3.2) -> [Assignee: Staff / Office Head] : assigned training (shown in My Trainings)
(3.3) -> (6.6 Notifications) : assignment notice
[Assignee: Staff / Office Head] -> (3.4) : marks training done, certificate files
|D6 Assignments| -> (3.4) : status and deadline
(3.4) -> |D6 Assignments| : new status (Awaiting Certificate, Completed, Cancelled)
(3.4) -> |D5 Certificates| : certificate file references
(3.4) -> (6.6 Notifications) : certificate uploaded notice
(3.4) -> [Assignee: Staff / Office Head] : updated assignment status
(3.4) -> [Unit Director / Office Head] : assignment statuses on the board (Overdue shown after deadline + 7 days)
```

### FIGURE 3.3.1.F: Level 1 for (4.0 Training Evaluation)
Sub-processes: (4.1 Select Conducted Training), (4.2 Record Evaluation), (4.3 View Feedback)
Outside: [Unit Director], [Office Head], [Staff], |D4|, |D7|, |D10|

```
|D4 Training Records| -> (4.1) : conducted records only
[Unit Director / Office Head] -> (4.1) : selection of a conducted training
(4.1) -> (4.2) : selected training
[Unit Director / Office Head] -> (4.2) : participants responded, feedback summary, role feedback, overall rating
(4.2) -> |D7 Evaluations| : evaluation
(4.2) -> |D10 Action History| : action log
|D7 Evaluations| -> (4.3) : evaluations
|D4 Training Records| -> (4.3) : owner of each conducted record
(4.3) -> [Unit Director / Office Head] : evaluations in scope
(4.3) -> [Staff] : feedback on own conducted trainings (read-only)
```

### FIGURE 3.3.1.G: Level 1 for (5.0 Partner Institution Management)
Sub-processes: (5.1 Partner Record Create or Edit), (5.2 Agreement Files), (5.3 Expiry Monitoring), (5.4 Contribution Summary)
Outside: [Unit Director], [Office Head], |D2|, |D8|, (6.6 Notifications)

```
[Unit Director / Office Head] -> (5.1) : partner name, type, contact, expiry date, lead implementing office, signatory
|D2 Offices| -> (5.1) : office list
(5.1) -> |D8 Partner Institutions| : partner record
(5.1) -> [Unit Director / Office Head] : partner records in scope (own-office editable for the Office Head)
[Unit Director / Office Head] -> (5.2) : MOA, MOU and related files
(5.2) -> |D8 Partner Institutions| : agreement file references
|D8 Partner Institutions| -> (5.3) : expiry dates
(5.3) -> (6.6 Notifications) : expiry alerts
|D8 Partner Institutions| -> (5.4) : partner data
(5.4) -> [Unit Director / Office Head] : training count and staff reached per period
```
Note on the Office Head: draw a small note "Office Head: own-office partners only".

### FIGURE 3.3.1.H: Level 1 for (6.0 Monitoring, Reports, and Notifications)
Sub-processes: (6.1 Role-Based Dashboards), (6.2 Directories and Filters), (6.3 Competency and Knowledge Profile), (6.4 Action History), (6.5 Export and Print), (6.6 Notifications)
Outside: [Staff], [Office Head], [Unit Director], |D1| to |D10|, plus incoming trigger arrows from (1.3), (3.3), (3.4), (5.3)

```
|D1..D8| -> (6.1) : data for dashboard cards
(6.1) -> [Staff / Office Head / Unit Director] : role-based dashboard
[Staff / Office Head / Unit Director] -> (6.2) : filter selections
|D1 Users|, |D2 Offices|, |D4 Training Records| -> (6.2) : staff and training detail
(6.2) -> [Office Head / Unit Director] : directories
|D3 Catalogs|, |D4 Training Records| -> (6.3) : tags and sessions
(6.3) -> (6.1) : competency and knowledge profile
(6.3) -> [Staff / Office Head / Unit Director] : competency and knowledge profile
[Any process] -> (6.4) : actions (create, edit, delete)
(6.4) -> |D10 Action History| : log entry
|D10 Action History| -> (6.4) : history
(6.4) -> [Staff / Office Head / Unit Director] : action history
[Staff / Office Head / Unit Director] -> (6.5) : export or print request
(6.1), (6.2), (6.4) -> (6.5) : report data
(6.5) -> [Staff / Office Head / Unit Director] : CSV file or printable report
(1.3) -> (6.6) : account status notice
(3.3) -> (6.6) : assignment notice
(3.4) -> (6.6) : certificate uploaded notice
(5.3) -> (6.6) : expiry alert
[Unit Director] -> (6.6) : announcement (title, message, recipients)
[Office Head] -> (6.6) : announcement to Unit Director or own staff
|D1 Users|, |D2 Offices| -> (6.6) : recipients
(6.6) -> |D9 Notifications| : notification
|D9 Notifications| -> (6.6) : stored notifications
(6.6) -> [Staff / Office Head / Unit Director] : notifications (Staff only receive)
```

---

## FIGURE 3.3.2.1: Entity Relationship Diagram of SDU-STMS

Draw 16 boxes (entities) with the key attributes inside. Draw lines with cardinality at each end (1 or many) and the verb on the line.

Entities and attributes:
```
OFFICE: code, name
USER: name, email, password hash, role, status, rejection reason, contact, employment status, job function
CATEGORY: name, type (training / competency / knowledge), status
TRAINING_RECORD: title, venue, start date, end date, nature, scope, record type, description
TRAINING_RECORD_ROLE: participation role
TRAINING_RECORD_TAG: (links a record to a competency or knowledge category)
CERTIFICATE: file name, file reference, size, note, uploaded date
ASSIGNMENT: title, description, deadline, nature, scope, venue
ASSIGNMENT_ASSIGNEE: role, status
ASSIGNMENT_COMPETENCY: (links an assignment to a required competency)
TRAINING_EVALUATION: participants responded, feedback summary, role feedback, overall rating
PARTNER_INSTITUTION: name, type, contact person, email, phone, expiry date, signatory
PARTNER_AGREEMENT: file name, file reference
PARTNER_CONTRIBUTION: period, training count, staff reached
NOTIFICATION: type, title, message, recipient scope, date
ACTION_HISTORY: action type, summary, date
```

User subtypes: draw USER at the top. Under it, a small circle with "d" (disjoint) joined by a DOUBLE line to USER (total). From the circle, three lines to three boxes: UNIT_DIRECTOR, OFFICE_HEAD, STAFF.

Relationships (read as: first side 1 or many, verb, second side):
```
OFFICE (1) -- employs -- (many) USER
USER (1) -- owns -- (many) TRAINING_RECORD
CATEGORY of type training (1) -- classifies -- (many) TRAINING_RECORD
TRAINING_RECORD (1) -- has -- (many) TRAINING_RECORD_ROLE
TRAINING_RECORD (many) -- is tagged with -- (many) CATEGORY of type competency or knowledge   [draw through TRAINING_RECORD_TAG]
TRAINING_RECORD (1) -- has -- (many) CERTIFICATE
ASSIGNMENT_ASSIGNEE (1) -- has -- (many) CERTIFICATE
UNIT_DIRECTOR (1) -- assigns (any office) -- (many) ASSIGNMENT
OFFICE_HEAD (1) -- assigns (own office) -- (many) ASSIGNMENT
ASSIGNMENT (1) -- has -- (many) ASSIGNMENT_ASSIGNEE
USER (1) -- receives -- (many) ASSIGNMENT_ASSIGNEE
ASSIGNMENT (many) -- requires -- (many) CATEGORY of type competency   [draw through ASSIGNMENT_COMPETENCY]
CATEGORY of type training (1) -- classifies -- (many) ASSIGNMENT
TRAINING_RECORD of type Conducted (1) -- is evaluated by -- (0 or 1) TRAINING_EVALUATION
USER, as Unit Director or Office Head (1) -- records -- (many) TRAINING_EVALUATION
OFFICE (1) -- leads -- (many) PARTNER_INSTITUTION   [the lead implementing office]
UNIT_DIRECTOR (1) -- manages (any) -- (many) PARTNER_INSTITUTION
OFFICE_HEAD (1) -- manages (own office) -- (many) PARTNER_INSTITUTION
PARTNER_INSTITUTION (1) -- has -- (many) PARTNER_AGREEMENT
PARTNER_INSTITUTION (1) -- has -- (many) PARTNER_CONTRIBUTION
USER (1) -- receives -- (many) NOTIFICATION
USER (1) -- sends -- (many) NOTIFICATION
USER (1) -- performs -- (many) ACTION_HISTORY
```
Do NOT draw: budget entities, a Secretary subtype, proof review, messages or inbox, ratings.

Database check (done): the ERD and the RDM match `database/schema.dbml` and `database/schema.sql` (16 tables). The only recent database change is the evaluation field: the `evaluation_level` enum was renamed to `evaluation_rating` (excellent, very_good, good, poor) and the `training_evaluations.level` column to `overall_rating`. No other database change is needed; the flows above need no new tables or columns.

---

## FIGURE 3.4.1: Relational Data Model of SDU-STMS
1. Open database/schema.dbml, copy everything.
2. Paste into dbdiagram.io (left panel).
3. Rearrange: offices and users at the top; training tables together; assignment tables next to them; training_evaluations beside training_records; partner tables together; notifications and action_history on one side.
4. Export PNG.

---

## FIGURES 3.3.3.1 to 3.3.3.6: Pseudocode
These are text blocks, not drawings. For each block A to F in section 3.3.3 of CHAPTER_3_V2.md:
1. Copy the numbered steps.
2. Put them in a box (a table with one cell, or a text box with a thin border) in a monospace font.
3. Put the caption under it as written: Figure 3.3.3.1 Pseudocode Account Management Logic, and so on.

---

## FIGURES 3.4.2.1 to 3.4.2.10: Prototype screenshots
Open the prototype in a private window with the browser zoom at 80 to 90 percent so the whole page fits. Use these demo logins (any password): director@adzu.edu.ph, officehead@adzu.edu.ph, staff@adzu.edu.ph.

```
3.4.2.1  Login and Registration Page            -> login_and_signup/login.html (show both Login and Sign Up if possible)
3.4.2.2  Unit Director Central Monitoring Dashboard -> director/dashboard.html
3.4.2.3  Training Assignment Board              -> director/training_assignments.html (scroll to the Assignment Board)
3.4.2.4  Pending Approvals / Account Management -> director/pending_approvals.html
3.4.2.5  Find Staff by Competency Interface     -> director/find_staff_by_skill.html (search a competency so results show)
3.4.2.6  Partner Institutions Page              -> director/partner_organizations.html
3.4.2.7  Training Evaluations Interface         -> director/training_evaluations.html
3.4.2.8  Category Management Interface          -> director/training_categories.html
3.4.2.9  Office Head Dashboard                  -> officehead/dashboard.html
3.4.2.10 Staff Dashboard                        -> staff/staff.html
```

## FIGURES 3.4.3.1 to 3.4.3.5: Report samples
```
3.4.3.1  Sample Printable/Exportable File (Training Category Data) -> Use the Export/Print option on the closest page (director/training_categories.html); if it has none, screenshot the page
3.4.3.2  Staff Training Records Export Sheet     -> Export/Print on director/directories.html or the Staff Reports page
3.4.3.3  Unit Director's Action History Report   -> director/reports.html
3.4.3.4  Office Head's Action History Report     -> officehead/reports.html
3.4.3.5  Staff's Action History Report           -> staff/staff_reports.html
```

---

## DRAWING ORDER (so you do not get stuck)
1. FIGURE 3.4.1 (RDM): 10 minutes.
2. Prototype screenshots (3.4.2 and 3.4.3): 30 minutes. Dorothy can do these.
3. FIGURE 3.3.1.A Context DFD: 15 minutes.
4. FIGURE 3.3.1.B Level 0.
5. FIGURE 3.1 Architecture.
6. FIGURE 3.3.2.1 ERD.
7. Level 1 DFDs: start with 3.3.1.E and 3.3.1.D, then C, F, G, H.
8. Pseudocode boxes: paste and format.

Total figures: 1 architecture + 8 DFD + 1 ERD + 1 RDM + 6 pseudocode blocks + 10 UI screenshots + 5 report samples = 32.
