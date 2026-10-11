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

### 3.3.2 Entity Relationship Diagram

[Figure 3.3.2.1: Entity Relationship Diagram of SDU-STMS]

The Entity Relationship Diagram, Figure 3.3.2.1, models the data of SDU-STMS at the business-rule level and is the source of the physical tables in Section 3.4.1. It contains sixteen entities: OFFICE, USER, CATEGORY, TRAINING_RECORD, TRAINING_RECORD_ROLE, TRAINING_RECORD_TAG, CERTIFICATE, ASSIGNMENT, ASSIGNMENT_ASSIGNEE, ASSIGNMENT_COMPETENCY, TRAINING_EVALUATION, PARTNER_INSTITUTION, PARTNER_AGREEMENT, PARTNER_CONTRIBUTION, NOTIFICATION, and ACTION_HISTORY.

USER is a supertype with a total, disjoint specialization into UNIT_DIRECTOR, OFFICE_HEAD, and STAFF. Every account belongs to exactly one role. The subtypes share the attributes of USER and differ only in what they may do, so each privilege is shown as a relationship owned by the subtype authorized to perform it rather than as an attribute of its own.

The relationships are:

- OFFICE employs USER (one to many).
- USER owns TRAINING_RECORD (one to many).
- CATEGORY of training type classifies TRAINING_RECORD (one to many).
- TRAINING_RECORD has TRAINING_RECORD_ROLE (one to many).
- TRAINING_RECORD is tagged with CATEGORY of competency or knowledge type (many to many through TRAINING_RECORD_TAG).
- TRAINING_RECORD has CERTIFICATE (one to many); ASSIGNMENT_ASSIGNEE has CERTIFICATE (one to many).
- UNIT_DIRECTOR assigns ASSIGNMENT to staff in any office, and OFFICE_HEAD assigns ASSIGNMENT to staff in the own office (one to many each).
- ASSIGNMENT has ASSIGNMENT_ASSIGNEE (one to many), and USER receives ASSIGNMENT_ASSIGNEE (one to many).
- ASSIGNMENT requires CATEGORY of competency type (many to many through ASSIGNMENT_COMPETENCY); CATEGORY of training type classifies ASSIGNMENT.
- TRAINING_RECORD of type Conducted is evaluated by TRAINING_EVALUATION (one to zero or one); USER, as Unit Director or Office Head, records TRAINING_EVALUATION.
- OFFICE leads PARTNER_INSTITUTION (one to many); the lead implementing office is separate from the signatory. OFFICE_HEAD manages the partners of the own office, and UNIT_DIRECTOR manages any partner.
- PARTNER_INSTITUTION has PARTNER_AGREEMENT and PARTNER_CONTRIBUTION (one to many each).
- USER receives and sends NOTIFICATION, and USER performs ACTION_HISTORY.

The model excludes budget entities, a Secretary subtype, proof review, messages or an inbox, and numeric ratings. The competency and knowledge profile is not an entity; it is computed from TRAINING_RECORD_TAG. Deleted items carry a deleted_at marker instead of being held in a recycle-bin table.

The entities correspond to the data stores in Section 3.3.1 as follows: D1 is USER; D2 is OFFICE; D3 is CATEGORY; D4 is TRAINING_RECORD, TRAINING_RECORD_ROLE, and TRAINING_RECORD_TAG; D5 is CERTIFICATE; D6 is ASSIGNMENT, ASSIGNMENT_ASSIGNEE, and ASSIGNMENT_COMPETENCY; D7 is TRAINING_EVALUATION; D8 is PARTNER_INSTITUTION, PARTNER_AGREEMENT, and PARTNER_CONTRIBUTION; D9 is NOTIFICATION; and D10 is ACTION_HISTORY.

### 3.3.3 Pseudocode

The logic of the system is written below as plain-language pseudocode. Each module covers one operation in the system design and is checked against the sub-processes of the Level 1 data flow diagrams in Section 3.3.1. The data stores are referred to by their DFD labels D1 to D10.

**A. Login and Role Routing (sub-process 1.2)**

1. Read the email and password submitted on the login form.
2. If either field is empty, show an error and stop.
3. Look up the account by email in D1 Users and confirm that its status is Active.
4. If the credentials do not match an active account, show an error and stop.
5. Otherwise open the dashboard for the role recorded on the account: Unit Director, Office Head, or Staff.
6. Apply the role to every subsequent request and limit access to the role's scope.

**B. Account Approval or Rejection (sub-process 1.3)**

1. The Unit Director opens the list of accounts whose status is Pending in D1 Users.
2. On approval, set the account status to Active, record the action in D10 Action History, and notify the applicant through sub-process 6.6.
3. On rejection, read the reason. If it is empty, ask for a reason and stop.
4. Otherwise set the account status to Rejected with the reason, record the action in D10 Action History, and notify the applicant with the reason.

**C. Create a Training Record (sub-process 2.1)**

1. The user opens the training record form.
2. If a required field is missing or no participation role is checked, show an error and stop.
3. If the end date is earlier than the start date, show an error and stop.
4. Otherwise save the record to D4 Training Records with its participation roles (D4) and its competency and knowledge tags (D4, using D3 Catalogs).
5. If editing an existing record, overwrite its fields and tags; if deleting, mark the record deleted and record the action in D10 Action History.
6. A user sees and edits only own records.

**D. Certificate Upload That Completes an Assignment (sub-processes 2.2 and 3.4)**

1. The assignee marks the assigned training done, and the assignment status becomes Awaiting Certificate in D6 Assignments.
2. The assignee uploads one or more certificate files with an optional note.
3. If no file is attached, show an error and stop.
4. Otherwise store the certificate in D5 Certificates, linked to the assignment, and set the assignment status to Completed in D6.
5. Notify the Unit Director and the Office Head through sub-process 6.6.
6. There is no review or approval step; the upload completes the assignment.

**E. Overdue Calculation, Seven Days After the Deadline (sub-process 3.4)**

1. If the assignment status is already Completed or Cancelled, keep the status.
2. Otherwise read the assignment's deadline from D6.
3. If there is no deadline, keep the status.
4. Add exactly seven days to the deadline.
5. If the current date is later than that moment and the status is neither Completed nor Cancelled, show the assignment as Overdue; otherwise keep the stored status.
6. Overdue is derived at read time and is not stored.

**F. Unit Director Creates an Assignment (sub-process 3.2)**

1. The Unit Director selects one or more offices, which then lists the staff of those offices.
2. The Unit Director selects staff and sets a role for each person (default Participant).
3. Require a title, a deadline, at least one office, and at least one staff member; otherwise show an error and stop.
4. Save the assignment to D6 with its details, required competencies, offices, and assignees, each with status Pending.
5. Notify each assignee through sub-process 6.6.
6. The assignment appears on the Assignment Board, split into incomplete and completed.

**G. Office Head Assigns Own Staff (sub-process 3.2)**

1. The Office Head opens the assign-to-staff form for the own office.
2. List the own-office staff, excluding the Office Head.
3. Require a title, a deadline, and at least one staff member; otherwise show an error and stop.
4. Create one assignment per selected staff member in D6 with the chosen role and status Pending.
5. Notify each assignee, and notify the Unit Director for information only. No Director approval is required.
6. The own-staff list shows each assignment's status: Pending, Awaiting Certificate, Completed, Cancelled, or Overdue.

**H. Find Staff by Competency and Assign (sub-process 3.1)**

1. The user chooses a competency from D3 Catalogs; the Unit Director may also choose a knowledge area.
2. Look up the staff whose records in D4 are tagged with that competency or knowledge area. The Unit Director searches all offices; the Office Head searches only the own office.
3. Show the matching staff with their office and competency badges; if there are none, show a no-match row.
4. On Assign, open the assignment form with the chosen staff preselected.

**I. Save a Training Evaluation (sub-process 4.2)**

1. Collect the conducted trainings within the user's scope: the Unit Director sees all offices, and the Office Head sees the own office.
2. On Save, read the chosen training. If none matches, show an error and stop.
3. Require the number of participants who responded and the feedback summary; otherwise show an error and stop.
4. If an evaluation already exists for that training, update its participants, summary, per-role feedback, and level; otherwise create a new evaluation in D7.
5. Keep one evaluation per conducted training. There is no numeric rating.

**J. Staff Views Feedback (sub-process 4.3)**

1. Read the staff member's own conducted trainings from D4.
2. Match each one against the evaluations in D7.
3. For each match, show the participants who responded, the feedback summary, the per-role feedback, and the level.
4. If a conducted training has no evaluation, show a message that no feedback is recorded yet. The page is read-only.

**K. Build the Competency and Knowledge Profile (sub-process 6.3)**

1. Read the person's records from D4 and the catalogs from D3.
2. For each competency and knowledge area mapped to the person, find the trainings whose tags include it.
3. Count the sessions attended and conducted, count the total sessions, and find the latest session date.
4. Present one card per mapped item with its name, category, the attended and conducted counts, the total sessions, the latest date, and the matching trainings.
5. The profile is calculated at read time and is not stored.

**L. Partner Record Save, Office Head Limited to Own Office, and Expiry Check (sub-processes 5.1 and 5.3)**

1. Read the partner fields and the agreement file names.
2. If editing an existing partner and the user is an Office Head whose office is not the partner's lead office, stop. An Office Head creates and edits only the partners whose lead office is the own office and views the rest.
3. Save the partner to D8 Partner Institutions, with its agreements and contribution rows.
4. Expiry check: compare the MOU expiry date with the current date. If it has passed, show Expired; if it falls within 90 days, show that it is expiring soon; otherwise show the expiry date.
5. Raise an alert through sub-process 6.6 when an agreement is near or past expiry.

**M. Notification Routing (sub-process 6.6)**

1. Store notifications in D9 Notifications with a type, title, message, sender, recipient role, and optional recipient office and name.
2. A user sees a notice when the recipient role matches the user's role, when a recipient office is set it matches the user's office, and when the recipient name is empty or matches the user's name.
3. Generate automatic notices for account status, assignment, certificate uploaded, and partner expiry.
4. A manual announcement may be sent by the Unit Director to all Staff, all Office Heads, an office, or a person, or by an Office Head to the Unit Director or to own-office Staff. Staff only receive.
5. Notifications are one-way; there is no inbox and no direct messaging.

The pseudocode above follows the Level 1 data flow diagrams in Section 3.3.1 and the entities in Section 3.3.2. Where the browser prototype behaves differently, the DFD sub-processes and the tables in Section 3.4.1 are the reference for the planned system.

### 3.4.1 Database Design

[Figure 3.4.1: Relational Data Model of SDU-STMS]

The database is built on PostgreSQL and follows Third Normal Form. It has sixteen tables. Every table has an integer primary key named id, except the pure link tables (TRAINING_RECORD_TAG and ASSIGNMENT_COMPETENCY), and every table carries a created_at timestamp. Tables that keep deleted rows use a deleted_at marker for soft deletion. The tables are:

1. **offices**: id PK; code UNIQUE NOT NULL (SDU, ACCA, ACES, ACLG, APC, CCES, ALTEC); name NOT NULL.
2. **users**: id PK; office_id FK offices NOT NULL; name NOT NULL; email UNIQUE NOT NULL; password_hash NOT NULL; role ENUM(unit_director, office_head, staff) NOT NULL; status ENUM(pending, active, rejected, inactive) DEFAULT pending; rejection_reason NULL; contact_number NULL; employment_status NULL; job_function NULL; notify_email BOOLEAN; notify_system BOOLEAN; created_at; deleted_at NULL.
3. **categories**: id PK; type ENUM(training, competency, knowledge) NOT NULL; name NOT NULL; is_active BOOLEAN DEFAULT true; created_at; UNIQUE(type, name).
4. **training_records**: id PK; user_id FK users NOT NULL; category_id FK categories of training type NOT NULL; title NOT NULL; venue NOT NULL; start_date NOT NULL; end_date NOT NULL; nature ENUM(internal, external) NOT NULL; scope ENUM(local, regional, national, international) NOT NULL; record_type ENUM(attended, conducted) NOT NULL; description NULL; created_at; updated_at; deleted_at NULL; CHECK(end_date >= start_date).
5. **training_record_roles**: id PK; training_record_id FK NOT NULL; role ENUM(participant, facilitator, organizer, speaker, host_emcee, documenter) NOT NULL; UNIQUE(training_record_id, role). At least one role per record is enforced by the application.
6. **training_record_tags**: training_record_id FK; category_id FK categories of competency or knowledge type; primary key (training_record_id, category_id).
7. **certificates**: id PK; training_record_id FK NULL; assignment_assignee_id FK NULL; file_name NOT NULL; file_reference NOT NULL; file_size; note NULL; uploaded_at; CHECK that exactly one of the two foreign keys is set.
8. **assignments**: id PK; assigned_by FK users NOT NULL; category_id FK categories of training type; title NOT NULL; description NULL; deadline DATE NOT NULL; nature; scope; venue NULL; created_at; deleted_at NULL.
9. **assignment_assignees**: id PK; assignment_id FK NOT NULL; user_id FK NOT NULL; role ENUM of the same six roles DEFAULT participant; status ENUM(pending, awaiting_certificate, completed, cancelled) DEFAULT pending; status_updated_at; UNIQUE(assignment_id, user_id). Overdue is derived at read time when the status is neither completed nor cancelled and the current date is greater than the deadline plus seven days. It is not stored.
10. **assignment_competencies**: assignment_id FK; category_id FK categories of competency type; primary key (assignment_id, category_id).
11. **training_evaluations**: id PK; training_record_id FK UNIQUE NOT NULL (the record type must be conducted, enforced by the application); recorded_by FK users NOT NULL; participants_responded INTEGER NOT NULL CHECK greater than or equal to zero; feedback_summary TEXT NOT NULL; role_feedback TEXT NULL; level ENUM(demonstrated, partially_demonstrated, not_demonstrated) NULL; created_at; updated_at.
12. **partner_institutions**: id PK; lead_office_id FK offices NOT NULL; created_by FK users; name NOT NULL; type ENUM(local_government, national_government, ngo, academic_institution, humanitarian, faith_based, private_sector); contact_person NOT NULL; email NOT NULL; phone NULL; expiry_date DATE NOT NULL; signed_by NOT NULL; created_at; updated_at; deleted_at NULL.
13. **partner_agreements**: id PK; partner_id FK NOT NULL; file_name NOT NULL; file_reference NOT NULL; uploaded_at.
14. **partner_contributions**: id PK; partner_id FK NOT NULL; period_type ENUM(yearly, quarterly, semestral); period_label NOT NULL; training_count INTEGER greater than or equal to zero; staff_reached INTEGER greater than or equal to zero. The contribution figures are logged by the Unit Director, or by an Office Head for the partners of the own office. The prototype only displays the summaries and has no entry form.
15. **notifications**: id PK; sender_id FK users NULL (NULL means the system); type NOT NULL (account_status, assignment, certificate_uploaded, partner_expiry, announcement); title NOT NULL with a maximum of 100 characters; message NOT NULL with a maximum of 1000 characters; recipient_scope ENUM(user, office_staff, office_head, all_staff, all_heads, role); recipient_user_id FK NULL; recipient_office_id FK NULL; created_at.
16. **action_history**: id PK; user_id FK users NOT NULL; action_type NOT NULL; summary NOT NULL; created_at.

For deletions, the foreign keys to the reference tables offices, users, and categories use ON DELETE RESTRICT. The foreign keys to dependent rows (roles, tags, assignees, agreements, and contributions) use ON DELETE CASCADE.

## Open Items to Confirm (Sections 3.3.2, 3.3.3, and 3.4.1)

The following items could not be verified from the available sources and are marked accordingly:

- Whether the Send Notification one-way announcements sub-process (6.6) stays in scope [CONFIRM with client].
- The evaluation fields in sub-process 4.2 are to be aligned with the client's sample evaluation form when it arrives [CONFIRM].
- The staff counts per office are to be taken from the client's written numbers [CONFIRM].
- Whether approving or rejecting an account is meant to create or record an account [CONFIRM].
- The exact business rule for completing an assigned training: whether the assignee must mark the training done before uploading, or whether the upload alone completes it [CONFIRM].
- Whether a completed or overdue assignment should be excluded from the pending list or shown separately [CONFIRM].
- The intended final set of stored assignment statuses, since a legacy value is still read but no longer written [CONFIRM].
- Whether the seeded demo content is meant to be replaced by real records or kept as a permanent sample [CONFIRM].
- Whether an Office Head may edit an evaluation first created by the Unit Director, since both roles write to the same evaluation store [CONFIRM].

### 3.4.2 Data Dictionary

The data dictionary documents every field of the sixteen tables defined in Section 3.4.1. Field sizes other than the two stated limits (notification title and message) are not specified in the available sources [CONFIRM].

**offices**

| Field | Data Type | Size or Values | Required or Null | Key | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| id | integer | — | Required | Primary key | Unique identifier of the office |
| code | string | SDU, ACCA, ACES, ACLG, APC, CCES, ALTEC | Required | Unique | Short office code |
| name | string | — | Required | — | Office name |

**users**

| Field | Data Type | Size or Values | Required or Null | Key | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| id | integer | — | Required | Primary key | Unique identifier of the account |
| office_id | integer | — | Required | Foreign key to offices | Office the user belongs to |
| name | string | — | Required | — | Full name of the user |
| email | string | — | Required | Unique | Email address used to log in |
| password_hash | string | — | Required | — | Hashed password (Bcrypt) |
| role | enum | unit_director, office_head, staff | Required | — | The single role of the account |
| status | enum | pending, active, rejected, inactive | Required (default pending) | — | Account approval state |
| rejection_reason | string | — | Null | — | Reason recorded when an account is rejected |
| contact_number | string | — | Null | — | Contact number |
| employment_status | string | — | Null | — | Employment status |
| job_function | string | — | Null | — | Job function |
| notify_email | boolean | — | Null | — | Whether email notifications are enabled |
| notify_system | boolean | — | Null | — | Whether in-system notifications are enabled |
| created_at | timestamp | — | Required | — | Creation timestamp |
| deleted_at | timestamp | — | Null | — | Soft-delete marker |

**categories**

| Field | Data Type | Size or Values | Required or Null | Key | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| id | integer | — | Required | Primary key | Unique identifier of the catalog entry |
| type | enum | training, competency, knowledge | Required | Unique with name | Catalog type |
| name | string | — | Required | Unique with type | Catalog entry name |
| is_active | boolean | — | Required (default true) | — | Whether the entry is selectable |
| created_at | timestamp | — | Required | — | Creation timestamp |

**training_records**

| Field | Data Type | Size or Values | Required or Null | Key | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| id | integer | — | Required | Primary key | Unique identifier of the record |
| user_id | integer | — | Required | Foreign key to users | Owner of the record |
| category_id | integer | training type | Required | Foreign key to categories | Training category |
| title | string | — | Required | — | Training name |
| venue | string | — | Required | — | Venue |
| start_date | date | — | Required | — | Start date |
| end_date | date | — | Required | — | End date; must be on or after the start date |
| nature | enum | internal, external | Required | — | Nature of the training |
| scope | enum | local, regional, national, international | Required | — | Scope of the training |
| record_type | enum | attended, conducted | Required | — | Whether the person attended or conducted |
| description | text | — | Null | — | Description |
| created_at | timestamp | — | Required | — | Creation timestamp |
| updated_at | timestamp | — | Required | — | Last update timestamp |
| deleted_at | timestamp | — | Null | — | Soft-delete marker |

**training_record_roles**

| Field | Data Type | Size or Values | Required or Null | Key | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| id | integer | — | Required | Primary key | Unique identifier of the role row |
| training_record_id | integer | — | Required | Foreign key to training_records; unique with role | Parent record |
| role | enum | participant, facilitator, organizer, speaker, host_emcee, documenter | Required | Unique with training_record_id | Participation role |

At least one role per record is enforced by the application.

**training_record_tags**

| Field | Data Type | Size or Values | Required or Null | Key | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| training_record_id | integer | — | Required | Primary key; foreign key to training_records | Tagged record |
| category_id | integer | competency or knowledge type | Required | Primary key; foreign key to categories | Competency or knowledge area |

**certificates**

| Field | Data Type | Size or Values | Required or Null | Key | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| id | integer | — | Required | Primary key | Unique identifier of the certificate |
| training_record_id | integer | — | Null | Foreign key to training_records | Record the certificate proves, when linked to a record |
| assignment_assignee_id | integer | — | Null | Foreign key to assignment_assignees | Assignee the certificate completes, when linked to an assignment |
| file_name | string | — | Required | — | Stored file name |
| file_reference | string | — | Required | — | Reference to the file in Cloudinary |
| file_size | integer | — | Null | — | File size |
| note | text | — | Null | — | Optional note |
| uploaded_at | timestamp | — | Required | — | Upload timestamp |

Exactly one of training_record_id or assignment_assignee_id is set.

**assignments**

| Field | Data Type | Size or Values | Required or Null | Key | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| id | integer | — | Required | Primary key | Unique identifier of the assignment |
| assigned_by | integer | — | Required | Foreign key to users | User who created the assignment |
| category_id | integer | training type | Null | Foreign key to categories | Training category |
| title | string | — | Required | — | Assignment title |
| description | text | — | Null | — | Description |
| deadline | date | — | Required | — | Deadline |
| nature | enum | internal, external | Null | — | Nature |
| scope | enum | local, regional, national, international | Null | — | Scope |
| venue | string | — | Null | — | Venue |
| created_at | timestamp | — | Required | — | Creation timestamp |
| deleted_at | timestamp | — | Null | — | Soft-delete marker |

**assignment_assignees**

| Field | Data Type | Size or Values | Required or Null | Key | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| id | integer | — | Required | Primary key | Unique identifier of the assignee row |
| assignment_id | integer | — | Required | Foreign key to assignments; unique with user_id | Parent assignment |
| user_id | integer | — | Required | Foreign key to users; unique with assignment_id | Assigned user |
| role | enum | participant, facilitator, organizer, speaker, host_emcee, documenter | Required (default participant) | — | Role in the assignment |
| status | enum | pending, awaiting_certificate, completed, cancelled | Required (default pending) | — | Assignment status |
| status_updated_at | timestamp | — | Null | — | When the status last changed |

Overdue is derived at read time when the status is neither completed nor cancelled and the current date is greater than the deadline plus seven days. It is not stored.

**assignment_competencies**

| Field | Data Type | Size or Values | Required or Null | Key | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| assignment_id | integer | — | Required | Primary key; foreign key to assignments | Parent assignment |
| category_id | integer | competency type | Required | Primary key; foreign key to categories | Required competency |

**training_evaluations**

| Field | Data Type | Size or Values | Required or Null | Key | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| id | integer | — | Required | Primary key | Unique identifier of the evaluation |
| training_record_id | integer | conducted type only | Required | Foreign key to training_records; unique | Evaluated conducted training |
| recorded_by | integer | — | Required | Foreign key to users | User who recorded the evaluation |
| participants_responded | integer | zero or greater | Required | — | Number of participants who responded |
| feedback_summary | text | — | Required | — | Written feedback summary |
| role_feedback | text | — | Null | — | Optional per-role feedback |
| level | enum | demonstrated, partially_demonstrated, not_demonstrated | Null | — | Optional level |
| created_at | timestamp | — | Required | — | Creation timestamp |
| updated_at | timestamp | — | Required | — | Last update timestamp |

**partner_institutions**

| Field | Data Type | Size or Values | Required or Null | Key | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| id | integer | — | Required | Primary key | Unique identifier of the partner |
| lead_office_id | integer | — | Required | Foreign key to offices | Lead implementing office |
| created_by | integer | — | Null | Foreign key to users | User who created the record |
| name | string | — | Required | — | Partner name |
| type | enum | local_government, national_government, ngo, academic_institution, humanitarian, faith_based, private_sector | Null | — | Partner type |
| contact_person | string | — | Required | — | Contact person |
| email | string | — | Required | — | Email |
| phone | string | — | Null | — | Phone |
| expiry_date | date | — | Required | — | MOU expiry date |
| signed_by | string | — | Required | — | Signatory |
| created_at | timestamp | — | Required | — | Creation timestamp |
| updated_at | timestamp | — | Required | — | Last update timestamp |
| deleted_at | timestamp | — | Null | — | Soft-delete marker |

**partner_agreements**

| Field | Data Type | Size or Values | Required or Null | Key | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| id | integer | — | Required | Primary key | Unique identifier of the agreement |
| partner_id | integer | — | Required | Foreign key to partner_institutions | Parent partner |
| file_name | string | — | Required | — | Stored file name |
| file_reference | string | — | Required | — | Reference to the file in Cloudinary |
| uploaded_at | timestamp | — | Required | — | Upload timestamp |

**partner_contributions**

| Field | Data Type | Size or Values | Required or Null | Key | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| id | integer | — | Required | Primary key | Unique identifier of the contribution row |
| partner_id | integer | — | Required | Foreign key to partner_institutions | Parent partner |
| period_type | enum | yearly, quarterly, semestral | Null | — | Period type |
| period_label | string | — | Required | — | Period label |
| training_count | integer | zero or greater | Null | — | Number of trainings |
| staff_reached | integer | zero or greater | Null | — | Number of staff reached |

The contribution figures are logged by the Unit Director, or by an Office Head for the partners of the own office. The prototype only displays the summaries and has no entry form.

**notifications**

| Field | Data Type | Size or Values | Required or Null | Key | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| id | integer | — | Required | Primary key | Unique identifier of the notification |
| sender_id | integer | NULL means the system | Null | Foreign key to users | Sender |
| type | enum | account_status, assignment, certificate_uploaded, partner_expiry, announcement | Required | — | Notification type |
| title | string | maximum 100 characters | Required | — | Title |
| message | text | maximum 1000 characters | Required | — | Message |
| recipient_scope | enum | user, office_staff, office_head, all_staff, all_heads, role | Required | — | Who receives the notice |
| recipient_user_id | integer | — | Null | Foreign key to users | Specific recipient user |
| recipient_office_id | integer | — | Null | Foreign key to offices | Specific recipient office |
| created_at | timestamp | — | Required | — | Creation timestamp |

**action_history**

| Field | Data Type | Size or Values | Required or Null | Key | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| id | integer | — | Required | Primary key | Unique identifier of the history row |
| user_id | integer | — | Required | Foreign key to users | User who performed the action |
| action_type | string | — | Required | — | Type of action |
| summary | string | — | Required | — | Action summary |
| created_at | timestamp | — | Required | — | Timestamp |

### 3.4.3 Report Design

The system produces the reports listed below. Each report is described by its purpose, its audience, its filters, its columns, and the source tables it reads. All reports can be exported as CSV or printed.

**Report 1: Unit Director Dashboard Report**
- Purpose: Give the Unit Director a unit-wide view of accounts, trainings, and items that need attention.
- Audience: Unit Director.
- Filters: office.
- Columns: office; account count; training count; record type counts (Attended and Conducted); role breakdown; category coverage; needs-attention items.
- Source tables: offices, users, training_records, training_record_roles, categories, assignments, assignment_assignees, notifications.

**Report 2: Office Dashboard Report**
- Purpose: Give the Office Head the same overview as the unit-wide report but for one office only.
- Audience: Office Head.
- Filters: the own office (fixed).
- Columns: office; account count; training count; record type counts; role breakdown; category coverage; needs-attention items.
- Source tables: offices, users, training_records, training_record_roles, categories, assignments, assignment_assignees, notifications.

**Report 3: Staff Personal Summary**
- Purpose: Show a staff member's own trainings and competency and knowledge profile.
- Audience: Staff.
- Filters: none (own records only).
- Columns: training title; dates; record type; participation roles; competency tags; knowledge tags; sessions per competency and knowledge area.
- Source tables: training_records, training_record_roles, training_record_tags, categories, users.

**Report 4: Staff Directory Report**
- Purpose: List staff and their trainings by participation role.
- Audience: Unit Director (all offices) and Office Head (own office).
- Filters: office; staff; participation role.
- Columns: office; staff name; training title; participation role; record type; dates.
- Source tables: offices, users, training_records, training_record_roles.

**Report 5: Competency and Knowledge Profile Report**
- Purpose: Show the sessions per competency or knowledge area for each person.
- Audience: Unit Director (all offices) and Office Head (own office).
- Filters: competency; knowledge area; office; person.
- Columns: person; office; competency or knowledge area; sessions attended; sessions conducted; latest date.
- Source tables: training_record_tags, training_records, categories, users.

**Report 6: Assignment Status Report**
- Purpose: Show assignments by status, office, and deadline.
- Audience: Unit Director (all offices) and Office Head (own office).
- Filters: status; office; deadline.
- Columns: assignment title; assigned by; office; assignee; role; deadline; status; overdue flag.
- Source tables: assignments, assignment_assignees, assignment_competencies, offices, users.

**Report 7: Training Evaluation Report**
- Purpose: Show the evaluation recorded for each conducted training.
- Audience: Unit Director (all offices) and Office Head (own office).
- Filters: office; training; level.
- Columns: conducted training; office; recorded by; participants responded; feedback summary; role feedback; level.
- Source tables: training_evaluations, training_records, users.

**Report 8: Partner Agreement and Expiry Report**
- Purpose: List partners and the expiry state of their agreements.
- Audience: Unit Director (all partners) and Office Head (own office).
- Filters: lead implementing office; expiry state; partner type.
- Columns: partner name; type; lead implementing office; contact person; MOU expiry date; expiry state; agreement files.
- Source tables: partner_institutions, partner_agreements, offices.

**Report 9: Action History Report**
- Purpose: Show the logged create, edit, and delete actions.
- Audience: Unit Director, Office Head, and Staff (own actions).
- Filters: user; action type; date.
- Columns: user; action type; summary; timestamp.
- Source tables: action_history, users.

The exact set of columns for each report is derived from the described content and the table definitions in Section 3.4.1 and may be aligned with the client's preferences [CONFIRM].

### 3.4.4 Integrity Controls

**Input controls**
- Required fields are enforced on every form.
- The end date must not be earlier than the start date.
- Dropdown values are controlled for the category, participation role, competency, knowledge, record type, nature, and scope.
- The email address must be unique.
- At least one participation role is required for each training record.
- Uploads are restricted by file type and file size limits.
- Field length limits are applied (notification title 100 characters, message 1000 characters).

**Database controls**
- Every table has a primary key.
- Foreign keys enforce referential integrity.
- Unique constraints prevent duplicate email addresses, duplicate catalog entries, duplicate roles per record, and duplicate assignees per assignment.
- CHECK constraints enforce the stated ranges and comparisons.
- Enumerated types restrict the allowed values.
- Default values are applied where defined.
- Transactions cover multi-table saves, such as a record saved with its roles and tags.
- Deletion is soft through the deleted_at marker.

**Output controls**
- Queries are scoped by role.
- Derived values, such as Overdue and the competency and knowledge profile, are computed at read time so they cannot go stale.

### 3.4.5 Security Controls

- Authentication: Passwords are hashed with Bcrypt, and sessions are managed by Laravel.
- Authorization: Role-based access control is enforced on the server and in the interface, with scope rules. An Office Head is limited to the own office for staff data, assignments, evaluations, and partner edits, and Staff are limited to own records.
- Data transmission: All traffic is served over HTTPS.
- Audit: Key actions are written to action_history with the user and the timestamp.
- Input protection: Input is validated and sanitized, and CSRF protection is applied.
- Files: Allowed file types and size limits are enforced. Uploaded files are kept in Cloudinary, a managed file storage service, and are not stored on the application server.
- Backup: Scheduled PostgreSQL backups (pg_dump) are taken of the database. The uploaded files are held in Cloudinary and only referenced from the database, so the backup covers the database and not the files.

## 3.5 Development

The system is built through iterative development rather than Agile, with no formal sprints or ceremonies. Each cycle produces a reviewable version that is shown to the client and the panel, and the feedback is applied to the next cycle.

The project follows a modular structure, and the source code is kept under version control with Git and a remote repository on GitHub. A front-end prototype was built first to validate the screens and flows, and the data flow diagrams, the entity relationship diagram, and the tables were revised to match it.

## 3.6 Testing

Testing uses Alpha and Beta testing supported by Test Case and Test Scenario documents. The roles under test are the Unit Director, the Office Head, and Staff. The modules under test are the six objectives. Testing with the client's three roles is planned after the website is built.

**Test Scenarios**

| Test Scenario | Objective | Description |
| :--- | :--- | :--- |
| TS-01 Account management and role-based access | Objective 1 | Register, log in, and log out; approve or reject an account; and confirm that access follows the role |
| TS-02 Staff training profile | Objective 2 | Record attended or conducted trainings with participation roles, competencies, knowledge, and certificates |
| TS-03 Training management and evaluation | Objective 3 | Assign staff, find staff by competency, follow assignment statuses, and record and view evaluations |
| TS-04 Monitoring and reporting | Objective 4 | Use the dashboards, directories, filters, training needs, action history, and export and print |
| TS-05 Notification | Objective 5 | Send role-based announcements and automatic notices, with Staff in view-only mode |
| TS-06 Partner institution management | Objective 6 | Manage partner records, the lead implementing office, MOA and MOU files, expiry monitoring, and contribution summaries |

**Test Cases**

| Test Case | Test Scenario | Input or Action | Expected Result |
| :--- | :--- | :--- | :--- |
| TC-01 | TS-01 | Log in with valid credentials for a role | The system redirects to the dashboard for that role |
| TC-02 | TS-01 | Log in with invalid or empty input | The system shows an error and does not log in |
| TC-03 | TS-03 | Upload a certificate for an assignment that is awaiting a certificate | The assignment becomes Completed |
| TC-04 | TS-03 | Leave an assignment incomplete past the deadline plus seven days | The assignment is shown as Overdue |
| TC-05 | TS-06 | As an Office Head, attempt to edit a partner whose lead office is another office | The system blocks the edit and the record stays view-only |
| TC-06 | TS-03 | As Staff, open the evaluation feedback for a conducted training | The feedback is shown in read-only form and cannot be edited |

## Open Items to Confirm (Sections 3.4.2 to 3.6)

The following items could not be verified from the available sources and are marked accordingly:

- Field sizes other than the two stated notification limits are not specified [CONFIRM].
- The specific allowed file types and file size limits for uploads are not specified [CONFIRM].
- The exact set of columns for each report may be aligned with the client's preferences [CONFIRM].
- Whether the Send Notification one-way announcements sub-process (6.6) stays in scope [CONFIRM with client].
- The evaluation fields in sub-process 4.2 are to be aligned with the client's sample evaluation form when it arrives [CONFIRM].
- The staff counts per office are to be taken from the client's written numbers [CONFIRM].
