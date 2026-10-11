# Chapter 3
# METHODOLOGY

## 3.1 System Architecture

[Figure 3.1: Three-Tier Client-Server Architecture Diagram of SDU-STMS]

The Staff Training and Management System (SDU-STMS) follows a three-tier client-server architecture, separating the user interface, the application logic, and the data. This structure keeps presentation concerns apart from the business rules and concentrates the data in a single repository that the three roles reach through a standard web browser.

The client, or presentation, tier is built with Laravel Blade templates and Tailwind CSS. It provides role-specific pages for the Unit Director, the Office Head, and Staff. This tier renders forms and displays data; it holds no business logic and no data of its own.

The application, or logic, tier runs on Laravel. It performs authentication, enforces role-based access control on the server and in the interface, applies the training assignment status rules (including the overdue rule of seven days after the deadline), calculates each staff member's competency and knowledge profile, records and serves training evaluations, checks partner agreement expiry, and routes notifications.

The data tier uses PostgreSQL as the single source of truth for structured data. Uploaded certificate and agreement files are stored in Cloudinary, and the database retains only references to those files rather than the files themselves.

The planned stack therefore pairs Laravel (PHP) with Blade and Tailwind CSS for the interface and PostgreSQL for storage. A browser-only HTML and JavaScript prototype was built first as the visual and behavioral reference for these screens and flows. The prototype has no backend and no database; it stores its data in the browser through localStorage and sessionStorage to demonstrate the screens and flows only.

## 3.2 Users and Characteristics

SDU-STMS serves three user types, distinguished by their organizational role and the functions they are authorized to perform.

| User Type | Role in the Organization | Main Access |
| :--- | :--- | :--- |
| Unit Director | Head of the Social Development Unit | Approves or rejects accounts; manages the catalogs of training categories, competencies, and knowledge areas; assigns staff in any office; finds staff by competency; records evaluations; manages partners system-wide; sees all dashboards, directories, and reports; logs own trainings; sends notifications to Office Heads and Staff |
| Office Head | Head of one center | Maintains own training records; assigns training to staff in the own office; finds own-office staff by competency; records evaluations of conducted trainings in the own office; adds and edits partner records of the own office and views the rest; sees the own-office dashboard, directory, and reports; sends notifications to the Unit Director and own-office Staff |
| Staff | Program officers and regular staff | Maintains own training records and certificates; completes assigned trainings by uploading a certificate; sees the own competency and knowledge profile, the own dashboard, and evaluation feedback on own conducted trainings in read-only form; receives notifications |

Table 3.2.1: SDU-STMS Users and Characteristics

Each account carries exactly one role, and account approval rests only with the Unit Director.

## 3.3 System Design

### 3.3.1 Data Flow Diagrams

The system design is documented through data flow diagrams at the context, Level 0, and Level 1 tiers, followed by swimlane diagrams for the principal operations.

**A. DFD: Context Data Flow Diagram**

[Figure 3.3.1.A: Context Data Flow Diagram of SDU-STMS]

The Context Data Flow Diagram, Figure 3.3.1.A, presents the highest-level view of SDU-STMS as a single process interacting with three external entities: Staff, Office Head, and Unit Director.

Staff sends registration details, training records, certificates, and profile updates into the system. Staff receives the dashboard, assignments, the competency and knowledge profile, evaluation feedback on own conducted trainings, and notifications.

The Office Head sends the Staff inputs together with assignments to own staff, evaluations, own-office partner records, and notifications. The Office Head receives the office dashboard, staff records and the competency directory, assignment statuses, and reports.

The Unit Director sends account decisions, catalog entries, assignments, evaluations, partner records, and notifications. The Unit Director receives the unit-wide dashboard, directories, competency search results, reports, and alerts.

**B. DFD: Level 0 Data Flow Diagram**

[Figure 3.3.1.B: Level 0 Data Flow Diagram of SDU-STMS]

The Level 0 diagram, Figure 3.3.1.B, decomposes SDU-STMS into six processes and ten data stores. The panel asked that the processes be emphasized over the external entities, and an earlier set of nine processes was consolidated into the six presented here.

The six processes are:

- 1.0 Account and Catalog Management
- 2.0 Training Record Management
- 3.0 Training Assignment
- 4.0 Training Evaluation
- 5.0 Partner Institution Management
- 6.0 Monitoring, Reports, and Notifications

The ten data stores are D1 Users, D2 Offices, D3 Catalogs (training categories, competencies, and knowledge), D4 Training Records, D5 Certificates, D6 Assignments, D7 Evaluations, D8 Partner Institutions, D9 Notifications, and D10 Action History.

The six processes map to the specific objectives as follows. Objective 1 corresponds to Process 1.0; Objective 2 to Process 2.0; Objective 3 to Processes 3.0 and 4.0; Objective 4 to Process 6.0, its sub-processes 6.1 to 6.5; Objective 5 to sub-process 6.6; and Objective 6 to Process 5.0.

**C. DFD: Level 1 Data Flow Diagrams**

The Level 1 diagrams decompose each of the six processes into its sub-processes. Each process is presented below as a short description followed by its sub-processes.

**Process 1.0: Account and Catalog Management**

[Figure 3.3.1.C: Level 1 Data Flow Diagram for Account and Catalog Management of SDU-STMS]

Process 1.0 covers registration, access, account decisions, profile upkeep, and the reference catalogs. It reads and writes the data stores D1 Users, D2 Offices, D3 Catalogs, and D10 Action History. Its sub-processes are:

- 1.1 Registration: collects the name, email, password, and office, and creates a Pending account.
- 1.2 Login and Role Routing: validates credentials and routes the user to the dashboard for the user's role.
- 1.3 Account Approval or Rejection: the Unit Director approves an account, or rejects it with a reason, and the applicant is notified through sub-process 6.6.
- 1.4 Profile Maintenance: maintains the contact details, employment status, job function, and notification preferences.
- 1.5 Catalog Management: the Unit Director adds, renames, deactivates, or reactivates training categories, competencies, and knowledge areas. Deactivated entries no longer appear in dropdowns but remain on existing records.

**Process 2.0: Training Record Management**

[Figure 3.3.1.D: Level 1 Data Flow Diagram for Training Record Management of SDU-STMS]

Process 2.0 covers the encoding of training records, the upload of certificates, and the viewing and editing of a user's own records. It reads and writes the data stores D3 Catalogs, D4 Training Records, D5 Certificates, and D10 Action History. Its sub-processes are:

- 2.1 Record Input: records the training name, venue, start and end dates, nature (Internal or External), scope (Local, Regional, National, or International), training category, record type (Attended or Conducted), participation roles (Participant, Facilitator, Organizer, Speaker, Host or Emcee, and Documenter), competencies, knowledge areas, and description.
- 2.2 Certificate Upload: attaches one or more files with an optional note to the record as proof of attendance. There is no review or approval step.
- 2.3 Record View and Edit: a user sees and edits only own records.

**Process 3.0: Training Assignment**

[Figure 3.3.1.E: Level 1 Data Flow Diagram for Training Assignment of SDU-STMS]

Process 3.0 covers finding staff by competency, creating assignments, notifying assignees, and updating status. It reads and writes the data stores D1 Users, D2 Offices, D3 Catalogs, D4 Training Records, D5 Certificates, D6 Assignments, and D9 Notifications. Its sub-processes are:

- 3.1 Find Staff by Competency: filters staff by competency or knowledge area. The Unit Director searches all offices, while the Office Head searches the own office. The results come from the tags on staff records (D4) and the catalog (D3).
- 3.2 Assignment Creation: the Unit Director creates an assignment with a title, description, category, deadline, nature, scope, venue, required competencies, offices, and staff with a role per person; the Office Head creates one with a title, deadline, role, and own staff. An Office Head's assignment needs no Director approval, and the Unit Director is notified for information only.
- 3.3 Assignment Notification: each assignee is notified through sub-process 6.6.
- 3.4 Status Update: an assignment moves from Pending to Awaiting Certificate when the assignee marks the training done, and to Completed when a certificate is uploaded, or it is Cancelled. Overdue is derived when the deadline plus seven days has passed and the assignment is neither Completed nor Cancelled. The Unit Director and the Office Head are notified when a certificate is uploaded.

**Process 4.0: Training Evaluation**

[Figure 3.3.1.F: Level 1 Data Flow Diagram for Training Evaluation of SDU-STMS]

Process 4.0 covers the evaluation of conducted trainings and the viewing of the resulting feedback. It reads and writes the data stores D4 Training Records, D7 Evaluations, and D10 Action History. Its sub-processes are:

- 4.1 Select Conducted Training: lists only records whose type is Conducted. The Unit Director sees all offices, while the Office Head sees the own office.
- 4.2 Record Evaluation: captures the number of participants who responded, a written feedback summary, optional per-role feedback (for example for a speaker or facilitator), and an optional level (Demonstrated, Partially Demonstrated, or Not Demonstrated). One evaluation is kept per conducted training. There is no numeric rating.
- 4.3 View Feedback: the Unit Director and the Office Head see evaluations within their scope, while Staff see the feedback on their own conducted trainings in read-only form.

The basis for this process is the client interview of October 7, 2026: the SDU evaluates trainings that its staff conduct, using participant feedback, and attending a training is not rated.

**Process 5.0: Partner Institution Management**

[Figure 3.3.1.G: Level 1 Data Flow Diagram for Partner Institution Management of SDU-STMS]

Process 5.0 covers the partner records, the agreement files, the monitoring of agreement expiry, and the contribution summaries. It reads and writes the data stores D2 Offices, D8 Partner Institutions, and D9 Notifications. Its sub-processes are:

- 5.1 Partner Record Create or Edit: captures the partner name, type, contact person, email, phone, MOU expiry date, lead implementing office, and signatory. The Unit Director manages any partner; the Office Head creates and edits only the partners whose lead office is the own office and views the rest.
- 5.2 Agreement Files: stores the MOA, MOU, and related documents for each partner.
- 5.3 Expiry Monitoring: compares each expiry date with the current date and raises an alert through sub-process 6.6 when it is near or past.
- 5.4 Contribution Summary: reports the training count and the staff reached per partner for a period (Yearly, Quarterly, or Semestral).

**Process 6.0: Monitoring, Reports, and Notifications**

[Figure 3.3.1.H: Level 1 Data Flow Diagram for Monitoring, Reports, and Notifications of SDU-STMS]

Process 6.0 consolidates the dashboards, directories, profiles, action history, exports, and notifications. It reads the data stores D1 through D10 and writes to D9 Notifications and D10 Action History. Its sub-processes are:

- 6.1 Role-Based Dashboards: a unit-wide dashboard for the Unit Director, an own-office dashboard for the Office Head, and an own dashboard for Staff. The cards cover accounts, trainings, record types, role breakdown, category coverage, and needs-attention alerts.
- 6.2 Directories and Filters: office and staff directories with training detail.
- 6.3 Competency and Knowledge Profile: calculated rather than stored. For each person, it reports the sessions attended and conducted per competency and knowledge area, the latest date, and the trainings behind each count.
- 6.4 Action History: logs the create, edit, and delete actions per user.
- 6.5 Export and Print: CSV exports and printable reports.
- 6.6 Notifications: automatic notices (account status, assignment, certificate uploaded, and partner expiry) and manual one-way announcements. The Unit Director sends to all Staff, all Office Heads, an office, or a person; an Office Head sends to the Unit Director or to own-office Staff; Staff only receive.

**D. Swimlane Flows**

The sequence of steps for the principal operations is presented as swimlane diagrams, one per flow, with lanes for Staff, Office Head, and Unit Director.

[Figure 3.3.1.I: Swimlane Diagram for Training Record and Certificate of SDU-STMS]

Training record and certificate: the user logs in, adds a record, and the system validates the required fields (a decision point that either returns an error or continues), then saves the record and accepts the certificate upload, after which the dashboards and the profile update. The Unit Director records own trainings in the same way.

[Figure 3.3.1.J: Swimlane Diagram for Assignment and Completion of SDU-STMS]

Assignment and completion: a user searches for staff by competency and creates an assignment (the Unit Director for any office, the Office Head for own staff), which is saved and notified. The assignee marks the training done, moving the assignment to Awaiting Certificate, then uploads a certificate (a decision point for whether a file is attached), and the assignment becomes Completed. An assignment that is not completed or cancelled and is past the deadline plus seven days becomes Overdue. The assigner is notified, and the Office Head can view the list of assignments issued to own staff.

[Figure 3.3.1.K: Swimlane Diagram for Evaluation of a Conducted Training of SDU-STMS]

Evaluation of a conducted training: a user records a Conducted training, the Unit Director or the Office Head selects it and enters the evaluation, and Staff view the feedback on their own conducted trainings.

## Open Items to Confirm

The following items could not be verified from the available sources and are marked accordingly:

- Whether the Send Notification one-way announcements sub-process (6.6) stays in scope [CONFIRM with client].
- The evaluation fields in sub-process 4.2 are to be aligned with the client's sample evaluation form when it arrives [CONFIRM].
- The staff counts per office are to be taken from the client's written numbers [CONFIRM].
