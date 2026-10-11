# CH3_SPEC.md: Chapter 3 working spec for SDU-STMS

This is a working file for the AI tool. It is NOT the paper text. Write the paper's Chapter 3 from it.

## 0. Ground rules (read first)

- System name: **Staff Training and Management System (SDU-STMS)**. Never use "ISCBMS", "ISCMS", or "Capacity Building" as the system name.
- Three roles only: **Unit Director**, **Office Head**, **Staff**. There is no Secretary.
- Removed from scope, never describe as features: budget management, in-system messaging or inbox, proof validation or review/approval of certificates, numeric 1-to-5 ratings.
- Seven offices: SDU (the Unit Director's office) plus ACCA, ACES, ACLG, APC, CCES, ALTEC. APC and ACLG are separate offices.
- Planned stack (kept from the defended paper): Laravel (PHP) with Blade and Tailwind CSS, PostgreSQL. The browser-only HTML/JS prototype is the visual and behavioral reference. Say clearly that the prototype has no backend and no database.
- Write in clean professional language, not buzzwordy. No names of interviewees, panelists, or advisers. Refer to "the client interview" and "the panel".
- Evidence sources to cite by description only: the panel revision list (defense, October 2026) and the client interview of October 7, 2026. Do not invent citations.
- Where a fact is unknown, write [CONFIRM] and list it at the end instead of guessing.

### The six specific objectives (final wording)
1. Secure Account Management with Role-Based Access Control (register, log in, log out, Unit Director approves or rejects accounts, access by role).
2. Staff Training Profile Module (record attended or conducted trainings, participation roles, competencies and knowledge, certificate; builds each staff member's competency and knowledge profile).
3. Training Management Module (Unit Director assigns staff in any office, Office Heads assign own staff, find staff by competency or knowledge, assignment statuses, evaluation of conducted trainings viewable by staff).
4. Monitoring and Reporting Module (role-based dashboards, directories, filters, training needs, action history, export and print).
5. Notification Module (role-based announcements and automatic notices; staff view-only).
6. Partner Institution Management Module (Unit Director system-wide; Office Heads own office; lead implementing office; MOA/MOU files; expiry monitoring; contribution summaries).

## 3.1 System architecture (three-tier, kept)

- Client (presentation): Laravel Blade and Tailwind CSS. Role-specific pages for Unit Director, Office Head, Staff. Input and display only.
- Application (logic): Laravel. Authentication, RBAC enforced on the server and in the interface, assignment status rules (including overdue 7 days after the deadline), competency and knowledge profile calculation, evaluation, partner expiry checks, notification routing.
- Data: PostgreSQL is the single source of truth for structured data. Uploaded certificate and agreement files are stored in Cloudinary, and the database keeps only file references, not the files (as stated in the defense slides and Section 3.1 of the defended paper).
- Add one sentence: the prototype stores data in the browser (localStorage and sessionStorage) to demonstrate the screens and flows only.

## 3.2 Users and characteristics

| Role | Who | Main access |
|------|-----|-------------|
| Unit Director | Head of the Social Development Unit | Approves or rejects accounts; manages catalogs (training categories, competencies, knowledge areas); assigns staff in any office; finds staff by competency; records evaluations; manages partners system-wide; sees all dashboards, directories, and reports; logs own trainings; sends notifications to Office Heads and Staff |
| Office Head | Head of one center | Own training records; assigns training to staff in own office; finds own-office staff by competency; records evaluations of conducted trainings in own office; adds and edits partner records of own office (views others); sees own-office dashboard, directory, and reports; sends notifications to the Unit Director and own-office Staff |
| Staff | Program officers and regular staff | Own training records and certificates; completes assigned trainings by uploading a certificate; sees own competency and knowledge profile, own dashboard, and evaluation feedback on own conducted trainings (read-only); receives notifications |

Note: each account has exactly one role. Account approval sits only with the Unit Director.

## 3.3 System design

### 3.3.1 Data flow diagrams

**Context DFD.** One process (SDU-STMS), three external entities.
- Staff sends: registration details, training records, certificates, profile updates. Receives: dashboard, assignments, competency and knowledge profile, evaluation feedback on own conducted trainings, notifications.
- Office Head sends: the Staff inputs plus assignments to own staff, evaluations, own-office partner records, notifications. Receives: office dashboard, staff records and competency directory, assignment statuses, reports.
- Unit Director sends: account decisions, catalog entries, assignments, evaluations, partner records, notifications. Receives: unit-wide dashboard, directories, competency search results, reports, alerts.

**Level 0.** Six processes, ten data stores. The panel asked for the processes to be emphasized over the entities, and nine processes were too many.
- 1.0 Account and Catalog Management
- 2.0 Training Record Management
- 3.0 Training Assignment
- 4.0 Training Evaluation
- 5.0 Partner Institution Management
- 6.0 Monitoring, Reports, and Notifications

Data stores: D1 Users; D2 Offices; D3 Catalogs (training categories, competencies, knowledge); D4 Training Records; D5 Certificates; D6 Assignments; D7 Evaluations; D8 Partner Institutions; D9 Notifications; D10 Action History.

Objective mapping: Objective 1 is Process 1.0; Objective 2 is Process 2.0; Objective 3 is Processes 3.0 and 4.0; Objective 4 is Process 6.0 (6.1 to 6.5); Objective 5 is sub-process 6.6; Objective 6 is Process 5.0.

**Level 1.**

Process 1.0 Account and Catalog Management (D1, D2, D3, D10)
- 1.1 Registration: name, email, password, office; creates a Pending account.
- 1.2 Login and Role Routing: validates credentials; routes to the role's dashboard.
- 1.3 Account Approval or Rejection: the Unit Director approves, or rejects with a reason; the applicant is notified through 6.6.
- 1.4 Profile Maintenance: contact details, employment status, job function, notification preferences.
- 1.5 Catalog Management: the Unit Director adds, renames, deactivates, or reactivates training categories, competencies, and knowledge areas. Deactivated entries disappear from dropdowns but stay on existing records.

Process 2.0 Training Record Management (D3, D4, D5, D10)
- 2.1 Record Input: name, venue, start and end dates, nature (Internal or External), scope (Local, Regional, National, International), training category, record type (Attended or Conducted), participation roles (Participant, Facilitator, Organizer, Speaker, Host/Emcee, Documenter), competencies, knowledge areas, description.
- 2.2 Certificate Upload: one or more files with an optional note, linked to the record. Stored as proof of attendance. There is no review or approval step.
- 2.3 Record View and Edit: a user sees and edits own records only.

Process 3.0 Training Assignment (D1, D2, D3, D4, D5, D6, D9)
- 3.1 Find Staff by Competency: filter by competency or knowledge area; the Unit Director searches all offices, the Office Head searches own office. Results come from tags on staff records (D4) and the catalog (D3).
- 3.2 Assignment Creation: Unit Director (title, description, category, deadline, nature, scope, venue, required competencies, offices, staff with a role per person); Office Head (title, deadline, role, own staff). An Office Head's assignment needs no Director approval and the Unit Director is notified for information only.
- 3.3 Assignment Notification: each assignee is notified through 6.6.
- 3.4 Status Update: Pending, then Awaiting Certificate when the assignee marks the training done, then Completed when a certificate is uploaded; or Cancelled. Overdue is derived when the deadline plus 7 days has passed and the assignment is not Completed or Cancelled. The Unit Director and Office Head are notified when a certificate is uploaded.

Process 4.0 Training Evaluation (D4, D7, D10)
- 4.1 Select Conducted Training: only records whose type is Conducted. The Unit Director sees all offices; the Office Head sees own office.
- 4.2 Record Evaluation: participants who responded, written feedback summary, optional per-role feedback (for example speaker or facilitator), optional level (Demonstrated, Partially Demonstrated, Not Demonstrated). One evaluation per conducted training. No numeric rating.
- 4.3 View Feedback: the Unit Director and Office Head see evaluations in their scope; Staff see feedback on their own conducted trainings, read-only.
- Basis (client interview, Oct 7, 2026): SDU evaluates trainings its staff conduct, using participant feedback; attending a training is not rated.

Process 5.0 Partner Institution Management (D2, D8, D9)
- 5.1 Partner Record Create or Edit: name, type, contact person, email, phone, MOU expiry date, lead implementing office, signatory. The Unit Director manages any partner; the Office Head creates and edits only partners whose lead office is their own and views the rest.
- 5.2 Agreement Files: MOA, MOU, and related documents per partner.
- 5.3 Expiry Monitoring: compares each expiry date with the current date and raises an alert through 6.6 when it is near or past.
- 5.4 Contribution Summary: per period (Yearly, Quarterly, Semestral), training count and staff reached per partner.

Process 6.0 Monitoring, Reports, and Notifications (reads D1 to D10; writes D9, D10)
- 6.1 Role-Based Dashboards: Unit Director (unit-wide), Office Head (own office), Staff (own). Cards for accounts, trainings, record types, role breakdown, category coverage, and needs-attention alerts.
- 6.2 Directories and Filters: office and staff directories with training detail.
- 6.3 Competency and Knowledge Profile: calculated, not stored. For each person: sessions attended and conducted per competency and knowledge area, latest date, and the trainings behind each count.
- 6.4 Action History: logs create, edit, and delete actions per user.
- 6.5 Export and Print: CSV and printable reports.
- 6.6 Notifications: automatic notices (account status, assignment, certificate uploaded, partner expiry) and manual one-way announcements. The Unit Director sends to all Staff, all Office Heads, an office, or a person; an Office Head sends to the Unit Director or own-office Staff; Staff only receive.

**Swimlane flows** (lanes: Staff, Office Head, Unit Director), one figure each:
1. Training record and certificate: log in, add record, validate required fields (decision: valid or return with error), save, upload certificate, dashboards and profile update. The Unit Director records own trainings the same way.
2. Assignment and completion: search by competency, create assignment (Unit Director any office; Office Head own staff), save and notify, assignee marks done (Awaiting Certificate), uploads certificate (decision: attached or not), Completed; Overdue after deadline plus 7 days; notify assigner; Office Head views "Assigned to my staff".
3. Evaluation of a conducted training: record a Conducted training, Unit Director or Office Head selects it and enters the evaluation, Staff views feedback on own conducted trainings.

### 3.3.2 Entity relationship diagram

Sixteen entities: OFFICE, USER, CATEGORY, TRAINING_RECORD, TRAINING_RECORD_ROLE, TRAINING_RECORD_TAG, CERTIFICATE, ASSIGNMENT, ASSIGNMENT_ASSIGNEE, ASSIGNMENT_COMPETENCY, TRAINING_EVALUATION, PARTNER_INSTITUTION, PARTNER_AGREEMENT, PARTNER_CONTRIBUTION, NOTIFICATION, ACTION_HISTORY.

USER is a supertype with a total, disjoint specialization into UNIT_DIRECTOR, OFFICE_HEAD, and STAFF. Every account is exactly one role. The subtypes share attributes and differ in what they may do, so privileges are shown as relationships.

Relationships:
- OFFICE employs USER (1 to many).
- USER owns TRAINING_RECORD (1 to many).
- CATEGORY (training type) classifies TRAINING_RECORD (1 to many).
- TRAINING_RECORD has TRAINING_RECORD_ROLE (1 to many).
- TRAINING_RECORD is tagged with CATEGORY of competency or knowledge type (many to many via TRAINING_RECORD_TAG).
- TRAINING_RECORD has CERTIFICATE (1 to many); ASSIGNMENT_ASSIGNEE has CERTIFICATE (1 to many).
- UNIT_DIRECTOR assigns ASSIGNMENT to staff in any office; OFFICE_HEAD assigns ASSIGNMENT to staff in own office (1 to many each).
- ASSIGNMENT has ASSIGNMENT_ASSIGNEE (1 to many); USER receives ASSIGNMENT_ASSIGNEE (1 to many).
- ASSIGNMENT requires CATEGORY of competency type (many to many via ASSIGNMENT_COMPETENCY); CATEGORY (training type) classifies ASSIGNMENT.
- TRAINING_RECORD of type Conducted is evaluated by TRAINING_EVALUATION (1 to 0..1); USER (Unit Director or Office Head) records TRAINING_EVALUATION.
- OFFICE leads PARTNER_INSTITUTION (1 to many; the lead implementing office, separate from the signatory). OFFICE_HEAD manages partners of own office; UNIT_DIRECTOR manages any.
- PARTNER_INSTITUTION has PARTNER_AGREEMENT and PARTNER_CONTRIBUTION (1 to many each).
- USER receives and sends NOTIFICATION; USER performs ACTION_HISTORY.

Not in the ERD: budget entities, a Secretary subtype, proof review, messages or inbox, numeric ratings. The competency and knowledge profile is computed from TRAINING_RECORD_TAG. Deleted items use a deleted_at marker instead of a recycle-bin table.

DFD store to ERD mapping: D1 USER; D2 OFFICE; D3 CATEGORY; D4 TRAINING_RECORD, TRAINING_RECORD_ROLE, TRAINING_RECORD_TAG; D5 CERTIFICATE; D6 ASSIGNMENT, ASSIGNMENT_ASSIGNEE, ASSIGNMENT_COMPETENCY; D7 TRAINING_EVALUATION; D8 PARTNER_INSTITUTION, PARTNER_AGREEMENT, PARTNER_CONTRIBUTION; D9 NOTIFICATION; D10 ACTION_HISTORY.

### 3.3.3 Pseudocode

Use PSEUDOCODE_DRAFT.md as the base and check it against the DFD. Required modules: login and role routing; account approval or rejection; create a training record; certificate upload that completes an assignment; overdue calculation (deadline plus 7 days); Unit Director creates an assignment; Office Head assigns own staff; find staff by competency and assign; save a training evaluation; staff views feedback; build competency and knowledge profile; partner record save with Office Head limited to own office, and expiry check; notification routing.

## 3.4 Database design

### 3.4.1 Tables (PostgreSQL, Third Normal Form, 16 tables)

Conventions: every table has an integer primary key `id` (except pure link tables); `created_at` timestamps; soft delete with `deleted_at` where noted.

1. **offices**: id PK; code UNIQUE NOT NULL (SDU, ACCA, ACES, ACLG, APC, CCES, ALTEC); name NOT NULL.
2. **users**: id PK; office_id FK offices NOT NULL; name NOT NULL; email UNIQUE NOT NULL; password_hash NOT NULL; role ENUM(unit_director, office_head, staff) NOT NULL; status ENUM(pending, active, rejected, inactive) DEFAULT pending; rejection_reason NULL; contact_number NULL; employment_status NULL; job_function NULL; notify_email BOOLEAN; notify_system BOOLEAN; created_at; deleted_at NULL.
3. **categories**: id PK; type ENUM(training, competency, knowledge) NOT NULL; name NOT NULL; is_active BOOLEAN DEFAULT true; created_at; UNIQUE(type, name).
4. **training_records**: id PK; user_id FK users NOT NULL; category_id FK categories (type training) NOT NULL; title NOT NULL; venue NOT NULL; start_date NOT NULL; end_date NOT NULL; nature ENUM(internal, external) NOT NULL; scope ENUM(local, regional, national, international) NOT NULL; record_type ENUM(attended, conducted) NOT NULL; description NULL; created_at; updated_at; deleted_at NULL; CHECK(end_date >= start_date).
5. **training_record_roles**: id PK; training_record_id FK NOT NULL; role ENUM(participant, facilitator, organizer, speaker, host_emcee, documenter) NOT NULL; UNIQUE(training_record_id, role); at least one role per record is enforced by the application.
6. **training_record_tags**: training_record_id FK; category_id FK (type competency or knowledge); PK(training_record_id, category_id).
7. **certificates**: id PK; training_record_id FK NULL; assignment_assignee_id FK NULL; file_name NOT NULL; file_reference NOT NULL; file_size; note NULL; uploaded_at; CHECK exactly one of the two foreign keys is set.
8. **assignments**: id PK; assigned_by FK users NOT NULL; category_id FK categories (training); title NOT NULL; description NULL; deadline DATE NOT NULL; nature; scope; venue NULL; created_at; deleted_at NULL.
9. **assignment_assignees**: id PK; assignment_id FK NOT NULL; user_id FK NOT NULL; role ENUM (same six roles) DEFAULT participant; status ENUM(pending, awaiting_certificate, completed, cancelled) DEFAULT pending; status_updated_at; UNIQUE(assignment_id, user_id). Overdue is derived: status not completed or cancelled and today greater than deadline plus 7 days. It is not stored.
10. **assignment_competencies**: assignment_id FK; category_id FK (competency); PK(assignment_id, category_id).
11. **training_evaluations**: id PK; training_record_id FK UNIQUE NOT NULL (record_type must be conducted, enforced by the application); recorded_by FK users NOT NULL; participants_responded INTEGER NOT NULL CHECK >= 0; feedback_summary TEXT NOT NULL; role_feedback TEXT NULL; level ENUM(demonstrated, partially_demonstrated, not_demonstrated) NULL; created_at; updated_at.
12. **partner_institutions**: id PK; lead_office_id FK offices NOT NULL; created_by FK users; name NOT NULL; type ENUM(local_government, national_government, ngo, academic_institution, humanitarian, faith_based, private_sector); contact_person NOT NULL; email NOT NULL; phone NULL; expiry_date DATE NOT NULL; signed_by NOT NULL; created_at; updated_at; deleted_at NULL.
13. **partner_agreements**: id PK; partner_id FK NOT NULL; file_name NOT NULL; file_reference NOT NULL; uploaded_at.
14. **partner_contributions**: id PK; partner_id FK NOT NULL; period_type ENUM(yearly, quarterly, semestral); period_label NOT NULL; training_count INTEGER >= 0; staff_reached INTEGER >= 0. Contribution figures are logged by the Unit Director, or by an Office Head for partners of own office (as in the defended DFD sub-process 7.4 Contribution Logging). The prototype only displays the summaries and has no entry form; say so in the chapter.
15. **notifications**: id PK; sender_id FK users NULL (NULL means system); type NOT NULL (account_status, assignment, certificate_uploaded, partner_expiry, announcement); title NOT NULL (max 100); message NOT NULL (max 1000); recipient_scope ENUM(user, office_staff, office_head, all_staff, all_heads, role); recipient_user_id FK NULL; recipient_office_id FK NULL; created_at.
16. **action_history**: id PK; user_id FK users NOT NULL; action_type NOT NULL; summary NOT NULL; created_at.

Foreign keys: ON DELETE RESTRICT for reference tables (offices, users, categories); ON DELETE CASCADE for dependent rows (roles, tags, assignees, agreements, contributions).

### 3.4.2 Data dictionary
Produce a table per entity with: field, data type, size or values, null or required, key, description. Use the table list above.

### 3.4.3 Report design
- Unit Director dashboard report: accounts, trainings, record types, role breakdown, category coverage, needs attention, per office.
- Office dashboard report: same for one office.
- Staff personal summary: own trainings and competency and knowledge profile.
- Staff directory report: per office and per person, trainings by participation role.
- Competency and knowledge profile report: sessions per competency or knowledge area per person.
- Assignment status report: by status, office, and deadline.
- Training evaluation report: per conducted training.
- Partner agreement and expiry report.
- Action history report.
All can be exported as CSV or printed. Design each as: purpose, audience, filters, columns, source tables.

### 3.4.4 Integrity controls
- Input: required fields; end date not before start date; controlled dropdowns for category, role, competency, knowledge, record type, nature, scope; unique email; at least one participation role per record; file type and size limits on uploads; field length limits (notification title 100, message 1000).
- Database: primary keys; foreign keys; unique constraints; CHECK constraints; enumerated types; default values; transactions for multi-table saves (a record with its roles and tags); soft delete.
- Output: role-scoped queries; derived values (Overdue, competency profile) computed at read time so they cannot go stale.

### 3.4.5 Security controls
- Authentication: Bcrypt password hashing; Laravel session management.
- Authorization: RBAC enforced on the server and in the interface; scope rules (Office Head limited to own office for staff data, assignments, evaluations, and partner edits; Staff limited to own records).
- Data transmission: HTTPS.
- Audit: key actions written to action_history with user and timestamp.
- Input protection: validation and sanitization; CSRF protection.
- Files: allowed types and size limits; files are kept in Cloudinary (managed file storage), not on the application server. Do NOT repeat the defended 3.4.5 wording about files stored in the server's file storage directory or included in the pg_dump backup, because it contradicted Section 3.1.
- Backup: scheduled PostgreSQL backups (pg_dump) of the database. Uploaded files are held in Cloudinary and referenced from the database.

## 3.5 Development
Iterative development, not Agile (no formal sprints or ceremonies). Cycles producing reviewable versions, with feedback from the client and the panel. Standards: modular structure, version control with Git and GitHub. Add that a front-end prototype was built first to validate the screens and flows, and that the DFD, ERD, and tables were revised to match it.

## 3.6 Testing
Alpha and Beta testing with Test Case and Test Scenario documents. Roles under test: Unit Director, Office Head, Staff (three, not four). Modules under test: the six objectives. Example Test Case: Login and role routing (valid login redirects to the role dashboard; invalid input shows an error). Sample additional cases: certificate upload completes an assignment; overdue appears after deadline plus 7 days; Office Head cannot edit another office's partner; Staff can view but not edit an evaluation. Note: testing with the client's three roles is planned after the website is built.

## Open items to list at the end of the chapter
- Whether Send Notification (one-way announcements) stays [CONFIRM with client].
- Evaluation fields to be aligned with the client's sample evaluation form when it arrives [CONFIRM].
- Staff counts per office from the client's written numbers [CONFIRM].
