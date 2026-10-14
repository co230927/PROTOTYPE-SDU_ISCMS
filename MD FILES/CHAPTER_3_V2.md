# Chapter 3

# METHODOLOGY

## 3.1 Architectural Design

[Figure 3.1: Three-Tier Client-Server Architecture Diagram of SDU-STMS]

Figure 3.1 illustrates the SDU-STMS's three-tier architecture: client browsers used by the Unit Director, Office Head, and Staff; the web server and application logic layer; and the centralized relational database. The Client and Application Tiers run on Laravel with Blade templates styled in Tailwind CSS; the Data Tier runs on PostgreSQL. Physically, this is deployed across three cloud providers Render (application hosting), Supabase (managed PostgreSQL), and Cloudinary (file/media storage) though the underlying architecture is provider-agnostic and can be redeployed to university-managed infrastructure without changing core logic, should ADZU's CITS office assume hosting after project turnover.

This model was chosen to resolve the core inadequacies of SDU's current manual process a shared, unstructured Google Sheet with no schema enforcement, no role-based access, and no centralized repository by establishing clear boundaries between presentation, logic, and data layers accessible to all three user levels through standard web browsers, no installation required. As defined by Nyabuto (2024), client-server architecture services requests over a network: the client requests a resource, the server processes and responds. This centralizes data across multiple simultaneous access points, supporting the scalability SDU's six centers require given their shared yet distinct data needs.

### 3.1.1 Client Tier (Presentation Layer)

Accessed through standard browsers, this tier renders the GUI for each role: the Staff Dashboard, the Office Head Oversight Dashboard (with a center-scoped staff competency directory), and the Unit Director's Central Monitoring Dashboard. It also renders the system's expanded-scope interfaces: the Find Staff by Competency search, the Staff Competency and Knowledge profile pages, Partner Institution pages, the evaluation interface for conducted trainings, and the Training, Competency, and Knowledge Category management interfaces available to the Unit Director. This layer handles input events (form submissions, file uploads, filter selections) and passes them to the Application Tier; it stores no business logic or data.

### 3.1.2 Application Tier (Logic Layer)

This tier processes all requests from the Client Tier, enforces business rules and Role-Based Access Control (RBAC), and mediates all database interaction. Core functions include authentication and session management; training record encoding with certificate upload that completes an assignment; participation role classification; training assignment logic by the Unit Director, or by an Office Head for her own staff, with an assignment marked Awaiting Certificate until a certificate is uploaded and Overdue once a week has passed beyond a passed deadline; notification dispatch; report generation and export; and category management (training, competency, and knowledge) for the Unit Director. It also handles competency and knowledge matching against event-required tags; partner contribution and agreement-expiry tracking; and the recording and viewing of conducted-training evaluations. This tier enforces per-role data access, preventing cross-center exposure, and validates all input before it reaches the database.

### 3.1.3 Data Tier (Database Layer)

PostgreSQL serves as the single source of truth for all structured data. Files such as training certificates and partner MOUs (with agreement documents) are stored via Cloudinary, with the database retaining only file references and metadata. As established in Section 2.2.2, a relational schema prevents the inconsistencies of free-form spreadsheet entry: primary keys, foreign key relationships, referential integrity, and ACID transaction properties keep records accurate under concurrent multi-center access. This tier holds all training records, user profiles, multi-role participation mappings, certificate references, notifications, and compliance data, alongside the expanded scope: staff competency and knowledge profiles, partner institution and agreement metadata (including each partnership's lead implementing office), conducted-training evaluations, and Unit Director-managed category definitions across training, competency, and knowledge types. All dashboards, filters, and exports draw directly from live records.

This architecture is further supported by Sankoh et al. (2026), whose comparable web-based industrial placement system achieved sub-two-second response times and 98%+ data accuracy on the same architectural model, and by Sri Kanna et al. (2026), whose Smart HR Management System sustained sub-120ms API response under a simulated 10,000-record load using the same PostgreSQL-backed, role-based three-tier structure supporting this architecture's viability for SDU-STMS's staff, training, and competency records at comparable scale.

## 3.2 Requirements Specification

This section identifies and describes the complete set of requirements for the SDU-STMS. The requirements presented here were gathered through two primary methods: structured interviews with the Unit Director and Program Coordinator of the Social Development Unit, which were used to identify operational pain points and decision-support needs; and a systematic review of the SDU's existing Personnel Audit Form and current Google Sheets-based workflow, which was used to identify functional gaps and data management deficiencies as documented in Chapter 1. These requirements guide all subsequent system design decisions and ensure that the proposed solution is directly aligned with the organizational needs of the SDU.

### 3.2.1 Users and Characteristics

The SDU-STMS is designed for three user types, differentiated by organizational role, authorized functions, and technical proficiency, corresponding to the three-level hierarchy established in Section 1.1.3.

| Attribute             | Unit Director                                                                                                                                                                                                          | Office Head                                                                                                                                                                                                                                                                                 | Staff Members                                                                             |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------- |
| Role in Organization  | Primary administrator; approves accounts, manages catalogs, oversees training across all offices, assigns training in any office, evaluates conducted trainings, and searches staff competency profiles for assignment | Supervises an assigned office (ACCA, ACES, ACLG, ALTEC, APC, CCES); records own training, assigns training to own staff, finds own-office staff by competency, evaluates conducted trainings in the office, and adds and edits partner institution records associated with their own office | Program Coordinators, Project Officers, and other center personnel                        |
| Frequency of Use      | Regular; ongoing monitoring, bi-yearly reporting, daily account management                                                                                                                                             | Regular; ongoing compliance monitoring                                                                                                                                                                                                                                                      | Periodic; records training and uploads certificates                                       |
| Technical Proficiency | Moderate                                                                                                                                                                                                               | Moderate                                                                                                                                                                                                                                                                                    | Basic to moderate                                                                         |
| Access Level          | Highest; system-wide access to all records, dashboards, and exports                                                                                                                                                    | Mid-level; restricted to their own office's records, staff, assignments, evaluations, and partner records                                                                                                                                                                                     | Lowest; restricted to own profile, records, competencies and knowledge, and notifications |

Table 3.2.1: SDU-STMS Users and Characteristics

The Unit Director holds the broadest access account approval, training assignment, monitoring, evaluation, and reporting while Office Head access is office-scoped and Staff access is limited to their own records. This variation is enforced through RBAC (Section 2.2.3). Office Head records evaluations for conducted trainings within their own office, while Staff can view the feedback recorded for their own conducted trainings.

Staff competency and knowledge profiles auto-update upon completion of tagged trainings, and Staff may view feedback on their own conducted trainings, but cannot initiate competency searches, approve accounts, assign training, or record evaluations functions reserved for the Unit Director and Office Head respectively. Each account holds exactly one role, and only the Unit Director approves or rejects account registrations.

### 3.2.2 Software Functionalities

The SDU-STMS is composed of twenty (20) functional modules, which together implement the six specific objectives established in Section 1.3. These modules are organized into seven (7) functional groups based on their operational purpose: Access and Account Management, Training Management, Monitoring and Analytics, Communication and Reporting, Competencies and Knowledge Tracking and Matching, Partner Institution Management, and Evaluation.

Group A: Access and Account Management

- Secure Account Management System with Role-Based Access Control (RBAC): Provides user registration, login/logout, and a Unit Director-controlled account approval workflow. Users register with their name, email, password, and office, and the Unit Director assigns the role when approving the account. New accounts remain pending until reviewed and approved.
- User-Friendly Interface: A responsive interface that adapts its menu and accessible functions to the authenticated user's role, accommodating varying digital literacy across offices.
- Catalog Management: Allows the Unit Director to create, rename, deactivate, and reactivate training, competency, and knowledge category values used across the Training Input, Tagging, and Assignment modules, replacing fixed lists with an extensible, admin-managed set.

Group B: Training Management

- Training Input Module: Enables Staff, Office Head, and Unit Director to encode training records such as title, description, date(s), venue, nature, scope, and participation role replacing manual Google Sheets entry with a standardized digital form.
- Participation Role Classification: Records whether a staff member attended as Participant, Facilitator, Speaker or Resource Person, Organizer, Host or Emcee, or Documenter, selectable via checkboxes and usable as a dashboard/report filter.
- Training Assignment Module: Enables the Unit Director to assign training tasks to Staff and Office Head in any office, or an Office Head to assign training to her own staff. A record moves to "Awaiting Certificate" once the assignee marks it done, and to "Completed" once a certificate is uploaded; it is "Overdue" once a week has passed beyond a passed deadline, and a self-marked status alone does not constitute completion.
- Certificate Upload Module: Allows Staff and Office Head to upload a training certificate, with an optional note, to complete an assigned training. The upload completes the assignment directly.
- Staff Dashboard: Gives each Staff member a consolidated view of training history, roles, assigned tasks, competency and knowledge profile, and notifications, with the ability to initiate inputs and track assignment and certificate status.

Group C: Monitoring and Analytics

- Central Monitoring Dashboard: Real-time, system-wide view of training records, completion rates, and competency coverage for the Unit Director.
- Office Head Oversight Function: Center-specific dashboard of training activity, compliance, and participation roles for each staff member in an Office Head's assigned center.
- Filter Module: Lets Staff query their own records, Office Head query their office's records, and the Unit Director query system-wide, by category, role, participation type, or academic-year half.

Group D: Communication and Reporting

- Notification Module: Lets the Unit Director send role-based announcements to staff, offices, or groups, and an Office Head send to the Unit Director or their own office staff; Staff and Office Head receive automatic notices on account decisions, assignments, certificate uploads, and partner expiry.
- Data Export and Printing Module: Lets the Unit Director export records to CSV or generate printed reports for bi-yearly and administrative reporting, lets the Office Head export office-scoped records, and lets Staff export their own training records.

Group E: Competencies and Knowledge Tracking and Matching

- Competency and Knowledge Tagging Module: Lets the Unit Director or Office Head tag a training with the competencies and knowledge areas it develops; completion auto-adds them to the staff member's profile.
- Staff Competency and Knowledge Profile: A searchable record built from the competency and knowledge tags on the training records.
- Find Staff by Competency Function: Lets the Unit Director query staff across all offices, and an Office Head query own-office staff, by competency or knowledge area for training assignment.

Group F: Partner Institution Management

- Partner Institution Records: CRUD functionality for partner profiles (government, NGO, private foundation), including the specific SDU office designated as lead implementing office of each partnership. The Unit Director manages all partner records, and Office Heads add and edit the records of their own office and view the others.
- MOU/Agreement Tracking: Upload of MOU/agreement documentation with expiry date; the system flags approaching or past-expiry agreements.
- Contribution Log: Records partner contributions with a description and per-event or date-range history.

Group G: Evaluation

- Conducted-Training Evaluation: Lets the Unit Director evaluate any conducted training, and an Office Head evaluate conducted trainings in their own office, recording the participants who responded, a written feedback summary, optional per-role feedback, and an optional overall rating. The overall rating uses the four-point scale (4 Excellent, 3 Very Good, 2 Good, 1 Poor) that SDU already uses in its project evaluation tools. Feedback on a Staff member's own conducted trainings is viewable by that Staff member.

### 3.2.3 Security Requirements

The SDU-STMS handles sensitive personnel data including staff profiles, training records, competency assessments, and training certificates. The following security requirements are established to protect this data from unauthorized access, accidental modification, and data breaches, and to ensure compliance with the data privacy expectations of the organization as raised during the interview phase of the study.

- Role-Based Access Control (RBAC): Access to all system modules and data is restricted based on the authenticated user's assigned role. The Unit Director is the only user with system-wide access. Office Head can only access data pertaining to staff within her assigned center, preventing cross-center data exposure. Staff members are restricted to their own profile and training records. RBAC is enforced at both the interface level, where menus and modules are rendered only for the appropriate role, and at the server level, where all API routes are protected by role-specific authorization middleware.
- Partner Institution Access Scoping: Partner institution records are editable by the Unit Director system-wide, and by an Office Head only for partnerships whose lead implementing office is her own. An Office Head cannot add, edit, or view partner records belonging to another center. Staff members hold view-only access to the partner institution directory. This scoping is enforced through the same interface- and server-level RBAC mechanisms described above.
- Account Approval Workflow: No user account is activated without explicit review and approval by the Unit Director. Upon registration, accounts are placed in pending status. This gate prevents unauthorized or incorrectly assigned users from gaining system access, ensuring that all active accounts represent verified SDU personnel.
- Authentication and Session Management: Users must authenticate via a registered email address and password to access the system. Passwords are stored in hashed form using an industry-standard hashing algorithm. User sessions are managed server-side and are automatically terminated upon logout or after a defined period of inactivity, preventing unauthorized session reuse.
- Data Privacy Compliance: A data privacy disclaimer is presented to all users upon account registration and upon each system login, consistent with the requirements of the Data Privacy Act of 2012 (Republic Act No. 10173) of the Philippines and in accordance with the university's data governance expectations.
- Secure Data Transmission: All data transmitted between the client browser and the application server is encrypted via HTTPS (Hypertext Transfer Protocol Secure), preventing interception of sensitive personnel and training data during transmission.
- Audit Trail: The system maintains a log of key administrative actions, including account approvals and rejections, training assignments, certificate uploads, evaluations, and partner expiry notices, attributing each action to the responsible user account with a corresponding timestamp. This audit trail supports organizational accountability and traceability of decision-making within the system.

### 3.2.4 Technical Requirements

This section specifies the hardware, software, network, and compatibility requirements necessary for the development, deployment, and operation of the SDU-STMS. These requirements are defined to ensure that the system functions reliably within the technical environment of the Ateneo de Zamboanga University's Social Development Unit.

Server Requirements (Deployment Environment)

| Component              | Minimum Specification                                                                                                                                                                                                                                                                                                 |
| :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Processor              | Dual-core CPU, 2.0 GHz or higher                                                                                                                                                                                                                                                                                      |
| Memory (RAM)           | 4 GB RAM minimum; 8 GB recommended                                                                                                                                                                                                                                                                                    |
| Storage                | 20 GB available disk space minimum for application files, database, and uploaded certificate and agreement files                                                                                                                                                                                                      |
| Application Hosting    | Managed cloud hosting through Render, which automatically provisions the server operating system, web server, HTTPS/SSL certificates, and scaling, removing the need for manual server configuration. Both the frontend (Blade views) and backend (Laravel application logic) are served from this single deployment. |
| Database Hosting       | Managed PostgreSQL hosting through Supabase, providing automated backups, connection pooling, and a web-based administration interface without requiring manual database server setup.                                                                                                                                |
| File and Media Storage | Managed cloud storage through Cloudinary for training certificates and partner MOU/agreement documents, providing automatic file validation, optimized delivery, and storage separate from the relational database.                                                                                                   |
| Network                | Stable internet connection with a minimum upload/download speed of 10 Mbps; HTTPS-enabled domain with a valid SSL certificate                                                                                                                                                                                         |

Table 3.2.4.1: Server Technical Requirements

Client Requirements (End-User Devices)

| Component             | Minimum Specification                                                                                                                 |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| Device                | Desktop computer, laptop, or tablet capable of running a modern web browser                                                           |
| Processor             | 1.5 GHz or higher                                                                                                                     |
| Memory (RAM)          | 2 GB RAM minimum                                                                                                                      |
| Browser Compatibility | Google Chrome (v100+), Mozilla Firefox (v100+), Microsoft Edge (v100+), Safari (v15+). No browser plugins or extensions are required. |
| Screen Resolution     | Minimum 1280x720 pixels for optimal dashboard display                                                                                 |
| Network               | Stable internet connection with a minimum speed of 5 Mbps for reliable form submission and file uploads                               |

Table 3.2.4.2: Client Technical Requirements

Development Environment

| Component                                | Specification                                                                                                                                                                                                                                                                                                                                               |
| :--------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Programming Language (Backend)           | PHP 8.1+ using the Laravel Framework                                                                                                                                                                                                                                                                                                                        |
| Frontend Technologies                    | Laravel Blade templating engine with Tailwind CSS for responsive UI layout                                                                                                                                                                                                                                                                                  |
| Database                                 | PostgreSQL, hosted via Supabase                                                                                                                                                                                                                                                                                                                             |
| File and Media Storage                   | Cloudinary                                                                                                                                                                                                                                                                                                                                                  |
| Integrated Development Environment (IDE) | Visual Studio Code or any equivalent code editor                                                                                                                                                                                                                                                                                                            |
| Version Control                          | Git with a remote repository hosted on GitHub for source code management and collaboration                                                                                                                                                                                                                                                                  |
| Local Development Server                 | XAMPP (Windows/macOS) or Laravel Sail/Docker for local environment simulation during development                                                                                                                                                                                                                                                            |
| File Upload Handling                     | Cloudinary-based cloud file storage with server-side validation for accepted file types (PDF, DOC, PNG, JPG) prior to upload.                                                                                                                                                                                                                               |
| Deployment Model                         | The application is deployed as a single Laravel monolith on Render, with Blade views served directly by the backend and no separate frontend framework required. Database and file storage are hosted separately through Supabase and Cloudinary respectively, keeping the application server stateless with respect to persistent data and uploaded files. |

Table 3.2.4.3: Development Environment Technical Requirements

The technologies specified in the development environment table were selected based on their direct alignment with the three-tier architectural model discussed in Section 3.1. The Laravel framework provides both the server-side application logic layer and the client presentation layer through its Blade templating engine, while the PostgreSQL relational database serves as the data tier.

## 3.3 Analysis

The analysis phase serves as the diagnostic and translational core of the system development life cycle, where operational realities are systematically converted into technical software specifications. To establish an objective foundation for the Social Development Unit Staff Training and Management System (SDU-STMS), this section examines and documents the operational processes currently utilized by the organization, exposing the structural bottlenecks that degrade data integrity and administrative efficiency. By explicitly contrasting these manual field liabilities against verified user demands, this analysis outlines how the gathered requirements directly guide system engineering. This structured evaluation ensures that the proposed software architecture remains completely aligned with the multi-center coordination, strategic decision-support, and data privacy needs of the organization.

Current Process Evaluation and Operational Pain Points

On-site observations, personnel workflow reviews, and structured interviews with the Unit Director and Program Coordinator, conducted across two phases of data gathering, reveal that the organization currently relies entirely on a decentralized, manual tracking framework built within shared Google Sheets.

This tracking sheet, originally distributed as a one-time personnel audit exercise when the current Unit Director assumed the role, continues to function as the SDU's primary record of staff program assignments and educational attainment, without having been reissued or updated since. This operational loop introduces several critical vulnerabilities and institutional pain points that the proposed SDU-STMS is designed to address:

1.  Labor-Intensive and Inefficient Data Input: Front-line staff members are forced to spend substantial administrative time manually typing names, positions, assigned programs, and degrees into a flat spreadsheet structure a one-time exercise that, having never been repeated, has left the SDU without any mechanism to capture staff changes, new hires, or updated qualifications since. This process is highly repetitive and diverts human resource energy away from primary community extensions and marginalized sector advocacies.
2.  High Risk of Data Inconsistency and Human Error: Because multiple users concurrently input data with varying levels of digital literacy and zero schema constraints, the shared document becomes highly vulnerable to silent formatting breaks, duplicate entries, and typographic errors. Simple naming variances (e.g., entering "Community Program" versus "Communities Program") prevent accurate software-driven sorting, corrupting the baseline integrity of the institutional capacity audit.
3.  Absence of Real-Time Analytics and Data Visualization: The flat layout of a standard spreadsheet lacks a relational database engine, leaving data static and siloed. The Unit Director cannot instantly generate high-level visualizations or track longitudinal competency growth across centers without manually counting cells and processing data rows.
4.  Lack of Proactive Monitoring and Automated Alerts: The current workspace operates in a purely reactive mode. Because the spreadsheet environment lacks automated validation or internal reminders, compliance gaps such as missing critical competencies required for specialized social work operations-go completely unnoticed until a formal administrative or program audit occurs.
5.  Critical Blind Spots in Strategic Decision-Support: The existing process records absolute attendance but fails to log the explicit capacity in which a staff member participated. The Unit Director cannot systematically distinguish whether an employee acted as a Participant, Facilitator, Speaker or Resource Person, Organizer, Host or Emcee, or Documenter, a distinction that is absolutely critical for mapping true internal expertise.
6.  Absence of a Skill-Based Staff Matching Mechanism: The current system records that a staff member attended a training, but retains no structured, searchable record of the specific competencies they hold. When the SDU receives external requests for resource speakers or facilitators, such as the documented UN Women training-of-trainers request, staff-competency matching is performed entirely from memory or informal inquiry by the Unit Director. This has resulted in a documented pattern of over-reliance on the same one or two centers for such requests, since the Director has no visibility into competencies held by staff in other centers.
7.  No Structured Tracking of Partner Institutions: The SDU maintains active relationships with numerous external partner institutions, government agencies, non-government organizations, and private foundations, that provide funding, in-kind resources, and program support across its six centers. However, no centralized record exists to track partner contribution history, agreement documentation, or expiry dates, with this information instead scattered informally across individual center files.
8.  No Mechanism to Distinguish Attendance from Demonstrated Competency Growth: The current process treats training attendance as an implicit proxy for staff development, without any means of verifying whether a staff member's actual competency improved as a result. A staff member may attend numerous seminars in a given year with no corresponding evaluation of skill growth, learning retention, or behavioral change. This gap was identified as a critical omission during adviser consultation, since capacity building, properly understood, requires evidence of demonstrated improvement, not merely a record of participation.

### 3.3.1 Process Models

The system design is documented through data flow diagrams at the context, Level 0, and Level 1 tiers.

**A. DFD: Context Data Flow Diagram**

[Figure 3.3.1.A: Context Data Flow Diagram of SDU-STMS]

The Context Data Flow Diagram, Figure 3.3.1.A, presents the highest-level view of SDU-STMS as a single process interacting with three external entities: Staff, Office Head, and Unit Director.

Staff sends registration details, login credentials, training records, certificates, profile updates, assigned-training completion, and export or print requests into the system. Staff receives the account status, the personal dashboard, training records, the training assignment view and statuses, the competency and knowledge profile, evaluation feedback on its own conducted trainings, action history, notifications, and the printable or exported file.

The Office Head sends the Staff inputs together with assignments to own staff, assigned-training completion, evaluations of conducted trainings, own-office partner records and agreement files, announcements, and export or print requests. The Office Head receives the account status, the office dashboard, staff records and competency search results, training records, the training assignment view and statuses, evaluations in scope, the partner institution directory, action history, notifications, and the printable or exported file.

The Unit Director sends login credentials, account decisions, catalog entries, training records and certificates, assignments, evaluations of conducted trainings, partner records and agreement files, announcements, and export or print requests. The Unit Director receives pending accounts, the central monitoring dashboard, system-wide directories and competency search results, training records, assignment statuses, evaluations, the partner institution directory and expiry alerts, action history, notifications, and the printable or exported file.

**B. DFD: Level 0 Data Flow Diagram**

[Figure 3.3.1.B: Level 0 Data Flow Diagram of SDU-STMS]

The Level 0 diagram, Figure 3.3.1.B, decomposes SDU-STMS into six processes and ten data stores.

The six processes are Process 1.0 Account and Catalog Management, Process 2.0 Training Record Management, Process 3.0 Training Assignment, Process 4.0 Training Evaluation, Process 5.0 Partner Institution Management, and Process 6.0 Monitoring, Reports, and Notifications.

The ten data stores are D1 Users, D2 Offices, D3 Catalogs (training categories, competencies, and knowledge), D4 Training Records, D5 Certificates, D6 Assignments, D7 Evaluations, D8 Partner Institutions, D9 Notifications, and D10 Action History.

The six processes map to the specific objectives as follows. Objective 1 corresponds to Process 1.0; Objective 2 to Process 2.0; Objective 3 to Processes 3.0 and 4.0; Objective 4 to Process 6.0, its sub-processes 6.1 to 6.5; Objective 5 to sub-process 6.6; and Objective 6 to Process 5.0.

**C. DFD: Level 1 Data Flow Diagrams**

The Level 1 diagrams decompose each of the six processes into its sub-processes. Each process is presented below as a short description followed by its sub-processes.

**Process 1.0: Account and Catalog Management**

[Figure 3.3.1.C: Level 1 Data Flow Diagram for Account and Catalog Management of SDU-STMS]

Process 1.0 covers registration, access, account decisions, profile upkeep, and the reference catalogs. It reads and writes the data stores D1 Users, D2 Offices, D3 Catalogs, and D10 Action History. Its sub-processes are described below.

Sub-process 1.1, Registration, collects the name, email, password, and office, and creates an account with Pending status.

Sub-process 1.2, Login and Role Routing, validates the credentials and routes the user to the dashboard for the user's role.

Sub-process 1.3, Account Approval or Rejection, lets the Unit Director approve an account or reject it with a reason. On approval the Unit Director assigns the account's role. The applicant is notified of the decision through sub-process 6.6.

Sub-process 1.4, Profile Maintenance, maintains the contact details, employment status, job function, and notification preferences of each user.

Sub-process 1.5, Catalog Management, lets the Unit Director add, rename, deactivate, or reactivate training categories, competencies, and knowledge areas. Deactivated entries no longer appear in the dropdowns but remain on the existing records.

**Process 2.0: Training Record Management**

[Figure 3.3.1.D: Level 1 Data Flow Diagram for Training Record Management of SDU-STMS]

Process 2.0 covers the encoding of training records, the upload of certificates, and the viewing and editing of a user's own records. It reads and writes the data stores D3 Catalogs, D4 Training Records, D5 Certificates, and D10 Action History. Its sub-processes are described below.

Sub-process 2.1, Record Input, records the training name, venue, start and end dates, nature (Internal or External), scope (Local, Regional, National, or International), training category, record type (Attended or Conducted), participation roles (Participant, Facilitator, Organizer, Speaker, Host or Emcee, and Documenter), competencies, knowledge areas, and description.

Sub-process 2.2, Certificate Upload, attaches one or more files with an optional note to the record as proof of attendance.

Sub-process 2.3, Record View and Edit, lets a user see and edit only the user's own records.

**Process 3.0: Training Assignment**

[Figure 3.3.1.E: Level 1 Data Flow Diagram for Training Assignment of SDU-STMS]

Process 3.0 covers finding staff by competency, creating assignments, notifying assignees, and updating status. It reads and writes the data stores D1 Users, D2 Offices, D3 Catalogs, D4 Training Records, D5 Certificates, D6 Assignments, and D9 Notifications. Its sub-processes are described below.

Sub-process 3.1, Find Staff by Competency, filters staff by competency or knowledge area. The Unit Director searches all offices, while the Office Head searches the own office. The results come from the tags on the staff records (D4) and from the catalog (D3).

Sub-process 3.2, Assignment Creation, lets the Unit Director create an assignment with a title, description, category, deadline, nature, scope, venue, required competencies, offices, and staff with a role per person. The Office Head creates an assignment with a title, deadline, role, and own staff. An Office Head's assignment needs no Director approval, and the Unit Director is notified for information only.

Sub-process 3.3, Assignment Notification, notifies each assignee through sub-process 6.6.

Sub-process 3.4, Status Update, moves an assignment from Pending to Awaiting Certificate when the assignee marks the training done, and to Completed when a certificate is uploaded; an assignment may also be Cancelled. Overdue is derived when the deadline plus seven days has passed and the assignment is neither Completed nor Cancelled. The Unit Director and the Office Head are notified when a certificate is uploaded.

**Process 4.0: Training Evaluation**

[Figure 3.3.1.F: Level 1 Data Flow Diagram for Training Evaluation of SDU-STMS]

Process 4.0 covers the evaluation of conducted trainings and the viewing of the resulting feedback. It reads and writes the data stores D4 Training Records, D7 Evaluations, and D10 Action History. Its sub-processes are described below.

Sub-process 4.1, Select Conducted Training, lists only the records whose type is Conducted. The Unit Director sees all offices, while the Office Head sees the own office.

Sub-process 4.2, Record Evaluation, captures the number of participants who responded, a written feedback summary, optional per-role feedback (for example for a speaker or facilitator), and an optional overall rating (Excellent, Very Good, Good, or Poor). One evaluation is kept per conducted training.

Sub-process 4.3, View Feedback, lets the Unit Director and the Office Head see the evaluations within their scope, while Staff see the feedback on their own conducted trainings in read-only form.

The basis for this process is the client interview of October 7, 2026: the SDU evaluates trainings that its staff conduct, using participant feedback.

**Process 5.0: Partner Institution Management**

[Figure 3.3.1.G: Level 1 Data Flow Diagram for Partner Institution Management of SDU-STMS]

Process 5.0 covers the partner records, the agreement files, the monitoring of agreement expiry, and the contribution summaries. It reads and writes the data stores D2 Offices, D8 Partner Institutions, and D9 Notifications. Its sub-processes are described below.

Sub-process 5.1, Partner Record Create or Edit, captures the partner name, type, contact person, email, phone, MOU expiry date, lead implementing office, and signatory. The Unit Director manages any partner. The Office Head creates and edits only the partners whose lead office is the own office and views the rest.

Sub-process 5.2, Agreement Files, stores the MOA, MOU, and related documents for each partner.

Sub-process 5.3, Expiry Monitoring, compares each expiry date with the current date and raises an alert through sub-process 6.6 when the expiry is near or past.

Sub-process 5.4, Contribution Summary, reports the training count and the staff reached per partner for a period (Yearly, Quarterly, or Semestral).

**Process 6.0: Monitoring, Reports, and Notifications**

[Figure 3.3.1.H: Level 1 Data Flow Diagram for Monitoring, Reports, and Notifications of SDU-STMS]

Process 6.0 consolidates the dashboards, directories, profiles, action history, exports, and notifications. It reads the data stores D1 through D10 and writes to D9 Notifications and D10 Action History. Its sub-processes are described below.

Sub-process 6.1, Role-Based Dashboards, provides a unit-wide dashboard for the Unit Director, an own-office dashboard for the Office Head, and an own dashboard for Staff. The cards cover accounts, trainings, record types, role breakdown, category coverage, and needs-attention alerts.

Sub-process 6.2, Directories and Filters, provides office and staff directories with training detail.

Sub-process 6.3, Competency and Knowledge Profile, is calculated rather than stored. For each person, it reports the sessions attended and conducted per competency and knowledge area, the latest date, and the trainings behind each count.

Sub-process 6.4, Action History, logs the create, edit, and delete actions per user.

Sub-process 6.5, Export and Print, produces CSV exports and printable reports.

Sub-process 6.6, Notifications, sends automatic notices (account status, assignment, certificate uploaded, and partner expiry) and manual one-way announcements. The Unit Director sends to all Staff, all Office Heads, an office, or a person. An Office Head sends to the Unit Director or to the Staff of the own office. Staff only receive notifications.

### 3.3.2 Data Models

[Figure 3.3.2.1: Entity Relationship Diagram of SDU-STMS]

The Entity Relationship Diagram, Figure 3.3.2.1, models the data of SDU-STMS at the business-rule level and is the source of the physical tables in Section 3.4.1. It contains sixteen entities: OFFICE, USER, CATEGORY, TRAINING_RECORD, TRAINING_RECORD_ROLE, TRAINING_RECORD_TAG, CERTIFICATE, ASSIGNMENT, ASSIGNMENT_ASSIGNEE, ASSIGNMENT_COMPETENCY, TRAINING_EVALUATION, PARTNER_INSTITUTION, PARTNER_AGREEMENT, PARTNER_CONTRIBUTION, NOTIFICATION, and ACTION_HISTORY.

USER is a supertype with a total, disjoint specialization into UNIT_DIRECTOR, OFFICE_HEAD, and STAFF. Every account belongs to exactly one role. The subtypes share the attributes of USER and differ only in what they may do, so each privilege is shown as a relationship owned by the subtype authorized to perform it rather than as an attribute of its own.

The relationships are described by area. An OFFICE employs many USERs, and a USER owns many TRAINING_RECORDs. A CATEGORY of training type classifies many TRAINING_RECORDs, and each TRAINING_RECORD has many TRAINING_RECORD_ROLEs. A TRAINING_RECORD is tagged with CATEGORYs of competency or knowledge type, a many-to-many relationship resolved through TRAINING_RECORD_TAG. A TRAINING_RECORD has many CERTIFICATEs, and an ASSIGNMENT_ASSIGNEE also has many CERTIFICATEs.

For assignments, the UNIT_DIRECTOR assigns an ASSIGNMENT to staff in any office, and the OFFICE_HEAD assigns an ASSIGNMENT to staff in the own office; each of them can create many assignments. An ASSIGNMENT has many ASSIGNMENT_ASSIGNEEs, and a USER receives many ASSIGNMENT_ASSIGNEEs. An ASSIGNMENT requires CATEGORYs of competency type, a many-to-many relationship resolved through ASSIGNMENT_COMPETENCY, and a CATEGORY of training type classifies each ASSIGNMENT.

A TRAINING_RECORD of type Conducted is evaluated by at most one TRAINING_EVALUATION (one to zero or one), and a USER, as Unit Director or Office Head, records many TRAINING_EVALUATIONs.

For partner institutions, an OFFICE leads many PARTNER_INSTITUTIONs, and the lead implementing office is separate from the signatory. The OFFICE_HEAD manages the partners of the own office, and the UNIT_DIRECTOR manages any partner. A PARTNER_INSTITUTION has many PARTNER_AGREEMENTs and many PARTNER_CONTRIBUTIONs.

Finally, a USER receives and sends many NOTIFICATIONs, and a USER performs many ACTION_HISTORY entries.

The competency and knowledge profile is not an entity; it is computed from TRAINING_RECORD_TAG. Deleted items carry a deleted_at marker instead of being held in a recycle-bin table.

The entities correspond to the data stores in Section 3.3.1 as follows: D1 is USER; D2 is OFFICE; D3 is CATEGORY; D4 is TRAINING_RECORD, TRAINING_RECORD_ROLE, and TRAINING_RECORD_TAG; D5 is CERTIFICATE; D6 is ASSIGNMENT, ASSIGNMENT_ASSIGNEE, and ASSIGNMENT_COMPETENCY; D7 is TRAINING_EVALUATION; D8 is PARTNER_INSTITUTION, PARTNER_AGREEMENT, and PARTNER_CONTRIBUTION; D9 is NOTIFICATION; and D10 is ACTION_HISTORY.

### 3.3.3 Logic Models (pseudocode)

The logic models presented in this section describe the decision-making and data processing behavior of the SDU-STMS across its six core processes. Each pseudocode block represents the logical flow of operations from input to processing to output, detailing how the system handles different conditions and scenarios in alignment with the process models established in Section 3.3.1 and the data model established in Section 3.3.2.

**A. Account Management Logic**

[Figure 3.3.3.1: Pseudocode Account Management Logic]

1. A new user opens the registration form and submits a name, email, password, and office.
2. If any required field is empty, show an error and stop.
3. Otherwise create an account in D1 Users with a Pending status and notify the Unit Director that a new account awaits review.
4. When a user logs in, read the email and password.
5. If either field is empty, show an error and stop.
6. Otherwise look up the account by email in D1 Users, verify the password, and confirm that the account status is Active.
7. If the credentials do not match an active account, show an error and stop.
8. Otherwise open the dashboard for the role recorded on the account: Unit Director, Office Head, or Staff, and limit every subsequent request to that role's scope.
9. The Unit Director opens the list of accounts whose status is Pending in D1 Users.
10. On approval, set the account status to Active, record the action in D10 Action History, and notify the applicant.
11. On rejection, read the reason. If it is empty, ask for a reason and stop.
12. Otherwise set the account status to Rejected with the reason, record the action in D10 Action History, and notify the applicant with the reason.

**B. Training Record Logic**

[Figure 3.3.3.2: Pseudocode Training Record Logic]

1. A user opens the training record form and enters the training name, venue, start and end dates, nature, scope, category, record type, participation roles, competencies, knowledge areas, and description.
2. If a required field is missing or no participation role is selected, show an error and stop.
3. Otherwise if the end date is earlier than the start date, show an error and stop.
4. Otherwise save the record to D4 Training Records with its participation roles and its competency and knowledge tags, using the values in D3 Catalogs.
5. If the user is editing an existing record, overwrite its fields and tags.
6. Otherwise if the user is deleting a record, mark the record deleted and record the action in D10 Action History.
7. If the user attaches one or more certificate files, store them in D5 Certificates with an optional note, linked to the record.
8. A user sees and edits only the user's own records.

**C. Training Assignment Logic**

[Figure 3.3.3.3: Pseudocode Training Assignment Logic]

1. To find staff, the user selects a competency from D3 Catalogs; the Unit Director may also select a knowledge area.
2. Look up the staff whose records in D4 are tagged with that competency or knowledge area. The Unit Director searches all offices; the Office Head searches only the own office.
3. Show the matching staff with their office and competency badges; if there are none, show a no-match row.
4. When the Unit Director creates an assignment, select one or more offices to list their staff, then select staff and set a role for each person (default Participant).
5. If the title, the deadline, the office selection, or the staff selection is empty, show an error and stop.
6. Otherwise save the assignment to D6 Assignments with its details, required competencies, offices, and assignees, each with a Pending status.
7. When the Office Head creates an assignment, list the own-office staff, excluding the Office Head.
8. If the title, the deadline, or the staff selection is empty, show an error and stop.
9. Otherwise create one assignment per selected staff member in D6 with the chosen role and a Pending status.
10. Notify each assignee, and notify the Unit Director for information only. No Director approval is required.
11. When the assignee marks the assigned training done, set the assignment status to Awaiting Certificate in D6.
12. When the assignee uploads one or more certificate files with an optional note, if no file is attached, show an error and stop.
13. Otherwise store the certificate in D5 Certificates, linked to the assignment, set the assignment status to Completed in D6, and notify the Unit Director and the Office Head.
14. An assignment may instead be Cancelled.
15. To derive Overdue, if the assignment status is already Completed or Cancelled, keep the status.
16. Otherwise read the assignment's deadline from D6; if there is no deadline, keep the status.
17. Otherwise if the current date is later than the deadline plus seven days, show the assignment as Overdue; otherwise keep the stored status.
18. Overdue is derived at read time and is not stored.

**D. Training Evaluation Logic**

[Figure 3.3.3.4: Pseudocode Training Evaluation Logic]

1. Collect the conducted trainings within the user's scope: the Unit Director sees all offices, and the Office Head sees the own office. Only records whose record type is Conducted are listed.
2. If there are no conducted trainings, show an informational message and stop.
3. Otherwise when the user selects a conducted training and saves an evaluation, read the chosen training; if none matches, show an error and stop.
4. If the number of participants who responded or the feedback summary is empty, show an error and stop.
5. Otherwise if an evaluation already exists for that training, update its participants, summary, per-role feedback, and overall rating.
6. Otherwise create a new evaluation in D7 Evaluations.
7. Keep one evaluation per conducted training.
8. When a Staff member views feedback, read the own conducted trainings from D4 and match each one against the evaluations in D7.
9. For each match, show the participants who responded, the feedback summary, the per-role feedback, and the overall rating; otherwise if a conducted training has no evaluation, show that no feedback is recorded yet. The view is read-only.

**E. Partner Institution Logic**

[Figure 3.3.3.5: Pseudocode Partner Institution Logic]

1. Read the partner fields: name, type, contact person, email, phone, MOU expiry date, lead implementing office, and signatory, together with the agreement file names.
2. If the user is an Office Head whose office is not the partner's lead office, stop. An Office Head creates and edits only the partners whose lead office is the own office and views the rest.
3. Otherwise save the partner to D8 Partner Institutions with its agreements and contribution rows.
4. Compare the MOU expiry date with the current date; if it has passed, show Expired.
5. Otherwise if it falls within 90 days, show that it is expiring soon.
6. Otherwise show the expiry date.
7. Raise an alert through sub-process 6.6 when an agreement is near or past expiry.
8. Contribution summaries report the training count and the staff reached per partner for a Yearly, Quarterly, or Semestral period.

**F. Monitoring, Reports and Notifications Logic**

[Figure 3.3.3.6: Pseudocode Monitoring, Reports and Notifications Logic]

1. On each request, determine the role of the user and limit every dashboard, directory, and report to that role's scope: the Unit Director sees the whole unit, the Office Head sees the own office, and Staff sees only the own records.
2. Build the role-based dashboard from the cards for accounts, trainings, record types, role breakdown, category coverage, and needs-attention alerts.
3. For the competency and knowledge profile, read the person's records from D4 and the catalogs from D3.
4. For each competency and knowledge area mapped to the person, find the trainings whose tags include it, count the sessions attended and conducted, count the total sessions, and find the latest session date.
5. Present one card per mapped item with its name, category, the attended and conducted counts, the total sessions, the latest date, and the matching trainings; the profile is calculated at read time and is not stored.
6. Log the create, edit, and delete actions per user in D10 Action History, and produce CSV exports and printable reports on request.
7. Store notifications in D9 Notifications with a type, title, message, sender, recipient role, and optional recipient office and name.
8. If the recipient role matches the user's role, and the recipient office either is not set or matches the user's office, and the recipient name is empty or matches the user's name, show the notice to that user.
9. Generate automatic notices for account status, assignment, certificate upload, and partner expiry.
10. A manual announcement may be sent by the Unit Director to all Staff, all Office Heads, an office, or a person, or by an Office Head to the Unit Director or to own-office Staff. Staff only receive.

## 3.4 Design

The design phase of the SDU-STMS translates the requirements and process models established in the preceding sections into a concrete structural blueprint that governs how the system will be built, how data will be organized, and how users will interact with the platform. This section presents four interconnected design components that together ensure the system meets all identified functional, security, and technical requirements of the Social Development Unit. The database design establishes the relational data model that defines how all organizational data is stored, structured, and accessed across sixteen normalized tables. The user interface design presents the planned layout and interaction structure of the system across all three user roles Unit Director, Office Head, and Staff that can help us make sure that the interface is intuitive, role-appropriate, and accessible through standard web browsers. The report design details the types of on-screen and exportable reports the system will generate to support administrative decision-making and bi-yearly compliance reporting. Finally, the integrity controls define the validation rules, database constraints, and output safeguards embedded across the interface, application logic, and database layers to ensure that all data entering, residing in, and leaving the system remains accurate, consistent, and secure throughout the system's operation.

### 3.4.1 Database Design

[Figure 3.4.1: Relational Data Model of SDU-STMS]

As shown in Figure 3.4.1, the SDU-STMS database is built on PostgreSQL and follows Third Normal Form. It is structured around sixteen interrelated tables, each with a single clearly defined responsibility, and all cross-table relationships are enforced through foreign key constraints to maintain referential integrity. Every table has an integer primary key named id, except the two pure link tables training_record_tags and assignment_competencies, which use a composite primary key formed from their two foreign keys. Most tables carry a created_at timestamp; a few dependent tables instead use a field such as uploaded_at or status_updated_at, and tables that keep deleted rows use a deleted_at marker for soft deletion.

The offices table anchors all office-scoped data, storing the six SDU centers and the SDU itself, referenced by users and partner_institutions. The users table holds every account in one entity, differentiated by a role field limited to unit_director, office_head, or staff, with office_id linking each user to their center and a status that defaults to Pending until approved by the Unit Director. The categories table is a single, generalized reference list distinguished by a type field (training, competency, or knowledge), replacing what would otherwise require three separate lookup tables and managed directly by the Unit Director; training_records and assignments reference it through their own category_id, while training_record_tags and assignment_competencies resolve the many-to-many relationships between records or assignments and the competencies and knowledge areas, so any category renamed or deactivated propagates consistently across every dependent module. training_records stores all recorded training activities, linked to the recording user and a training category, and since a single record may involve more than one participation role, roles are resolved into a separate training_record_roles table rather than a flat field. certificates records uploaded files, linked either to a training record or to an assignment assignee with exactly one of the two foreign keys set, and retaining only the file name and a reference to the file held in Cloudinary. assignments records training tasks through the assigned_by foreign key to users, and assignment_assignees holds each assigned person with a role and a status (pending, awaiting_certificate, completed, or cancelled); a certificate upload completes the assignment directly, and Overdue is derived at read time when the status is neither completed nor cancelled and the current date is past the deadline plus seven days. training_evaluations records one feedback evaluation per conducted training.

The partner_institutions table stores external partners, with a lead_office_id and a signed_by field that distinguish a partnership's lead implementing office from its legal signatory, and partner_agreements and partner_contributions as dependents tracking MOU documentation and contribution summaries. notifications stores the one-way notices sent to users, and action_history stores the create, edit, and delete actions performed by each user. The database follows Third Normal Form: every attribute depends only on its own table's primary key, with no transitive dependencies, and no data is duplicated across tables. This sixteen-table structure supports the system's functional groups: offices, users, and categories for Access and Account Management; training_records, training_record_roles, training_record_tags, certificates, assignments, assignment_assignees, and assignment_competencies for Training Management and Monitoring; notifications and action_history for Communication and Reporting; partner_institutions, partner_agreements, and partner_contributions for Partner Institution Management; and training_evaluations for Evaluation. For deletions, the foreign keys to the reference tables offices, users, and categories use ON DELETE RESTRICT, while the foreign keys to dependent rows (roles, tags, certificates, assignees, assignment competencies, evaluations, agreements, and contributions) use ON DELETE CASCADE. Indexed keys support query performance at scale, and the consolidated category structure allows new offices, categories, or competency classifications to be added without restructuring the core schema.

### 3.4.2 User Interface

The SDU-STMS user interface was designed with a focus on clarity, consistency, and role-appropriate accessibility across all three user levels of the Social Development Unit. The system adopts a unified dark navy blue sidebar navigation with a clean white content area, ensuring visual consistency throughout all pages regardless of the user's assigned role. The interface dynamically adapts its navigation structure and accessible modules based on the authenticated user's role, presenting only the functions relevant to their organizational responsibilities. All pages are fully responsive and accessible through standard web browsers without requiring any additional software installation.

[Figure 3.4.2.1: Login and Registration Page]

[Figure 3.4.2.2: Unit Director Central Monitoring Dashboard]

[Figure 3.4.2.3: Training Assignment Board]

[Figure 3.4.2.4: Pending Approvals / Account Management Interface]

[Figure 3.4.2.5: Find Staff by Competency Interface]

[Figure 3.4.2.6: Partner Institutions Page]

[Figure 3.4.2.7: Training Evaluations Interface]

[Figure 3.4.2.8: Category Management Interface]

[Figure 3.4.2.9: Office Head Dashboard]

[Figure 3.4.2.10: Staff Dashboard]

Login and Registration Page
The system's entry point consists of a login form and a registration form, both presented over a full-screen background image of the Ateneo de Zamboanga University campus. The login form requires the user's registered institutional email address and password, while the registration form collects the user's full name, institutional email, password, and assigned office. New accounts submitted through the registration form are placed in a pending status and are only activated upon explicit approval by the Unit Director, enforcing the system's account approval workflow.

Unit Director Interface
The Unit Director interface provides administrative oversight across all SDU operations, organized across the main navigation modules: Dashboard, Directories, Find Staff by Competency, Training Assignments, My Trainings, Training Evaluations, Partners, Reports, Pending Approvals, Catalogs, and Profile.

- Central Monitoring Dashboard: Displays real-time summary counters for pending accounts, upcoming trainings, and items needing attention. The dashboard includes a Training Role Breakdown panel with filter controls for office and category, a color-coded participation distribution bar, a Needs Attention panel, a staff count grid displaying the total number of personnel per SDU office, and interactive modals to review pending account registrations and scheduled training events.
- Directories & User Management: Presents a complete staff directory categorized by office, displaying each member's training records, acquired competencies, and assigned roles. Administrators can manage the training, competency, and knowledge catalogs through the Catalogs group, approve or deactivate user accounts, and view drill-down office performance.
- Training Management & Evaluation: Features an Assignment Board to dispatch training directives to specific offices or personnel, alongside a Training Evaluations panel for recording feedback on conducted trainings. An assignment remains Pending until its certificate is uploaded, and is only marked Overdue after a one-week grace period past its deadline.
- Partner Management: Provides interfaces for tracking external partner institutions, their formal Memoranda of Understanding (MOUs), lead implementing office designation, agreement expiry, and incoming contributions, and for recording contribution summaries per partner.
- Evaluation & Communication: Facilitates post-training evaluations of conducted trainings through participant feedback, and provides broadcast notification controls to dispatch unit-wide announcements.
- Reports: Features automated generation and export tools for cross-office training, competency, and partner reports.

Office Head Interface
The Office Head's interface is scoped strictly to office-level governance and personal professional development, organized across: Dashboard, Directories, Staff Competencies, Partners, My Trainings, Training Evaluations, My Competencies, Reports, and Profile.

- Office Head Dashboard: Mirrors the executive dashboard layout but restricts all metrics to the Office Head's specific assigned office. It tracks upcoming office trainings, staff competency coverage, role distribution alerts, and provides an Assign Training button.
- Staff Management & Competency Directory: Enables the Office Head to review staff directory profiles, track acquired competencies, and use the staff competency directory to find own-office staff by competency for assignment.
- My Trainings & Assignments: Provides personal tracking tabs for encoding the Office Head's own training activities, uploading certificates, assigning trainings directly to their own office's staff, and managing received assignments and their statuses.
- Evaluation: Hosts the office-level evaluation interface where the Office Head records feedback on conducted trainings in the own office.
- Communication & Reports: Sends one-way notifications to the Unit Director or own-office staff, and generates office-specific training compliance and attendance reports.

Staff Interface
The Staff interface focuses on personal training development, organized across: Dashboard, My Trainings, Evaluations, My Competencies, Reports, and Profile.

- Staff Dashboard: Provides a personalized overview of training milestones, active assignments, competency category coverage progress, and automated notifications regarding assignments and certificate statuses.
- My Trainings: Houses a multi-tab workspace where staff members submit new training records via an encoding modal (capturing training details, category, scope, and specific participation roles), upload certificates for assigned trainings, and view their assignment statuses.
- My Competencies: Displays the competencies and knowledge areas acquired through recorded trainings, with attended and conducted counts, session totals, and the latest session date.
- Notifications & Personal Reports: Displays received one-way notifications from the Unit Director and Office Head, and generates personal training participation and compliance transcripts for appraisal purposes.

### 3.4.3 Report Design

The SDU-STMS generates two categories of reports to support decision-making and operational needs across all three user levels, the Data Export Reports, which allow users to extract and print filtered staff and training data for administrative and compliance purposes, and Action History Reports, which serve as the system's audit trail by logging all key system interactions performed by each user type. All reports are generated directly from live database records through the monitoring and reporting processes, ensuring that all displayed and exported information reflects the most current state of the system at the time of generation. Reports are accessible through each user's dedicated Reports page and through export controls embedded within relevant system pages, and are delivered in CSV format or as structured printable files.

[Figure 3.4.3.1: Sample Printable/Exportable File (Training Category Data)]

A. Data Export Reports
Data Export Reports are filterable, on-demand reports that allow users to extract organized subsets of staff and training data from the system for operational review, administrative documentation, and bi-yearly compliance reporting to university management. These reports are not confined to a single Reports page but are accessible through export and print controls embedded directly within the relevant pages of each user's interface.

A.1 Training Records Export Report

[Figure 3.4.3.2: Staff Training Records Export Sheet]

The Training Records Export Report is available to all three user types and extracts detailed training event data from the system's training management pages. For the Unit Director, this report is accessible from the Directories page's Office Training Details table and from the Training Assignments page's Assignment Board, both of which support Print/Export controls. The training records export presents each staff member's training events with the following fields: Staff Name, Training/Event Name, Date, Role, Category, Nature, Scope, and Venue. The Unit Director can filter this report by office, academic year, and training category before export, enabling targeted extraction of training data for specific offices or competency areas. For the Office Head, the Training Records Export is accessible from the My Trainings page and from the Directories page's staff detail view. The Office Head can filter by participation role, event category, and period, Full Year or by semester, before exporting, producing an office-scoped training record that reflects only the data within their assigned office, including trainings the Office Head has assigned directly to their own staff. For Staff members, the Training Records Export is accessible from the My Trainings page and presents the staff member's personal training history with fields for Training/Event Name, Date, Role, Category, Venue, Nature, Scope, and Certificate count. Staff members can filter their records by role, category, and nature before exporting, producing a personal training summary that can be used for individual compliance documentation. All training record exports draw directly from D4 Training Records and D6 Assignments and are delivered in CSV format.

B. Action History / Audit Trail Reports
Action History Reports serve as the system's internal audit trail, automatically logging all key administrative and compliance actions performed by each user type with a corresponding timestamp, action category, and descriptive detail. These reports are non-editable, system-generated records that draw directly from D10 Action History and are presented chronologically within each user's Reports page.

B.1 Unit Director Action History Report

[Figure 3.4.3.3: Unit Director's Action History Report]

The Unit Director Action History Report is the primary audit trail for all administrative decisions made system-wide. It is presented as a chronological table containing the following fields: Date, Time, Action, Details, and Performed By. The Action field uses color-coded badge labels to categorize each logged event, including Approved Account, Uploaded Certificate, Assigned Training, Recorded Evaluation, Managed Category, and Exported Report, allowing the Unit Director to quickly distinguish between action types. The Managed Category action covers training, competency, and knowledge catalog changes made through the Catalog Management interface. The Details column provides a plain-language description of each action, such as the name of the staff member whose account was approved or the training event whose certificate was uploaded. The Performed By column attributes each action to the responsible user account. The report supports filtering by action type through a dropdown selector, enabling the Unit Director to isolate specific action categories for focused review. The full log can be exported using the Export Bills control and cleared using the Clear Report Section control. This report directly fulfills the audit trail security requirement established in Section 3.2.3.

B.2 Office Head Action History Report

[Figure 3.4.3.4: Office Head's Action History Report]

The Office Head Action History Report provides office-specific administrative logging for each Office Head, recording all actions performed from their office's pages separately from the Unit Director's global report log. It shares the same tabular structure as the Unit Director report, displaying Date, Time, Action, Details, and Performed By fields with color-coded action badges. Action types logged at the Office Head level include Assigned Training (Own Staff), Recorded Evaluation, Uploaded Certificate, Exported Report, Removed Staff from Directory, and Exported Staff Directory, reflecting the office-management functions of the Office Head role. All logged actions are scoped exclusively to the Office Head's assigned office, preventing cross-office data exposure at the reporting layer. The report supports file export and section-clearing controls identical to the Unit Director report.

B.3 Staff Activity Report

[Figure 3.4.3.5: Staff's Action History Report]

The Staff Activity Report provides each staff member with a personal log of all system interactions they have performed, functioning as an individual accountability record for their own training and compliance history. It is presented as a chronological table containing Date, Time, Action, Details, and Status fields. Action types logged at the Staff level include Training Participated, Certificate Uploaded, Profile Updated, and Training Completed, each accompanied by a plain-language description identifying the specific training event or system interaction involved.

The Status field uses color-coded badge labels, Completed, Pending, Overdue, and Approved, to indicate the resolution state of each logged action, allowing staff members to track their certificate submissions and assignment completions without requiring direct communication with the Unit Director or Office Head. An assignment displays as Overdue only after passing the one-week grace period beyond its deadline without a submitted certificate. The report can be filtered by action type and exported as a file from the Staff Reports page.

### 3.4.4 Integrity Controls

The SDU-STMS implements a comprehensive set of integrity controls distributed across three layers of the system, the user interface, the application logic, and the database, to make sure that all data entering, residing in, and leaving the system remains accurate, complete, consistent, and reliable throughout operations. These controls directly address the data integrity vulnerabilities identified in the SDU's previous manual workflow, where the absence of schema enforcement, validation rules, and access restrictions allowed silent formatting breaks, duplicate entries, and typographic errors to compromise institutional records.

A. Input Integrity Controls
Input integrity controls are enforced at both the user interface layer and the application logic layer to ensure that all data submitted to the system is valid, complete, and properly formatted before it is processed or stored in the database.

- Required Field Validation: All data entry forms in the system enforce mandatory field checks at the interface level. In the Training Submission form, the fields for Training Title, Venue, Start Date, End Date, Nature, Scope, Category, and at least one Participation Role are all required before submission is permitted. In the Registration form, Full Name, Institutional Email, Password, and Assigned Office are mandatory. In the Training Assignment form, Training Name, Category, Deadline, Nature, Scope, and at least one assigned recipient are required, regardless of whether the assignment is created by the Unit Director or by an Office Head assigning training to their own staff. In the Training Evaluation form, the conducted training, the number of participants who responded, and the feedback summary are mandatory. Forms cannot be submitted with any required field left blank, and the interface displays inline error indicators identifying the specific fields that need to be completed before submission can proceed.
- Format and Boundary Validation: All date fields throughout the system enforce a standardized date format and validate that an event's end date is not set earlier than its start date. Email fields on the Registration and Login forms validate that the entered value conforms to a standard institutional email format. Password fields enforce minimum length and complexity requirements during registration and account updates to maintain credential security. File upload fields on the Certificate Upload and Agreement Upload forms restrict accepted file types to PDF, DOC, PNG, and JPG only, with a maximum file size of 10 MB per file, preventing the submission of unsupported or oversized attachments. Evaluation inputs are restricted to the defined overall rating values. Certificate uploads and agreement files are validated before storage so that no unsupported attachment enters the system.
- Duplication Prevention: The system enforces a unique constraint on the email address field at the application logic layer, preventing the registration of multiple accounts under the same institutional email address. If a user attempts to register with an email address already associated with an existing account, the system returns a validation error and prevents duplicate record creation. Training records submitted by the same user for the same training event on identical dates are flagged at the application layer to alert the user of a potential duplicate entry before the record is committed.
- Dropdown and Enumerated Field Controls: Fields for Nature, Scope, Category, Participation Role, and Office are implemented as controlled dropdown selectors, checkbox groups, or database lookups rather than free text inputs, restricting all entries to a predefined set of valid values. The Category field is shared across the training, competency, and knowledge catalogs, drawing from the same admin-managed reference list in each case. This eliminates naming variances (such as entering "Community Program" versus "Communities Program") that cause sorting and filtering failures. No free text entry is permitted for any field that corresponds to a categorized or enumerated data attribute.
- Account Approval and Certificate Gates: All newly registered accounts are placed in a Pending status upon submission and are not granted active system access until the Unit Director explicitly approves the account through the Account Management interface. This input-level gate prevents unauthorized or incorrectly configured user accounts from entering the active user pool. Furthermore, a training assignment's completion status cannot be manually marked complete or triggered by passed deadlines alone; it transitions to a completed state only after the assignee uploads a certificate, which completes the assignment, and an unvalidated assignment is only marked Overdue after a one-week grace period past its deadline.

B. Database Integrity Controls
Database integrity controls are enforced at the PostgreSQL data tier to maintain the accuracy, consistency, and reliability of all stored data regardless of the volume of concurrent users accessing the system.

- Primary Key Constraints: Every table in the sixteen-table SDU-STMS database defines a unique primary key for each record. Most tables use an integer id (offices, users, categories, training_records, training_record_roles, certificates, assignments, assignment_assignees, training_evaluations, partner_institutions, partner_agreements, partner_contributions, notifications, and action_history), while the two pure link tables, training_record_tags and assignment_competencies, use a composite primary key formed from their two foreign keys. These primary key constraints ensure that every record in the system is uniquely identifiable and that no two records within the same table can share the same identifier.
- Foreign Key Constraints and Referential Integrity: All relationships between tables are enforced through foreign key constraints that prevent orphaned or inconsistent records from persisting in the database. Administrative reference entities (offices, users, and categories) utilize ON DELETE RESTRICT rules to prevent the accidental deletion of parent records tied to active historical logs. Because the categories table is referenced by dependent tables, this restriction is especially significant: a category cannot be deleted while any record still references it, and must instead be deactivated through the catalog management interface, preserving the historical accuracy of every record that cites it. Dependent transactional entities (training_record_roles, training_record_tags, certificates, assignment_assignees, assignment_competencies, training_evaluations, partner_agreements, and partner_contributions) enforce ON DELETE CASCADE rules when a parent record is formally purged. This ensures that no training record can exist without an associated user and category, and no certificate can exist without a corresponding training record or assignment.
- Schema Enforcement and Data Type Constraints: Every column in all sixteen tables is defined with an explicit data type, length limit, and nullability requirement (NOT NULL). Date columns accept only valid calendar dates, integer count columns enforce non-negative values, and enumerated columns, including the categories table's type field, accept only values within their predefined set. These schema-level constraints eliminate type mismatches and unstructured entries across the database.
- ACID Transaction Properties: All database operations in the SDU-STMS are executed within an ACID-compliant transaction framework. Atomicity ensures that multi-step operations, such as committing a training record alongside its multiple participation roles and its competency and knowledge tags, or uploading a certificate that completes an assignment, either complete fully or roll back entirely, leaving no partial writes in the database. Consistency guarantees that every committed transaction transitions the database from one valid state to another. Isolation ensures that concurrent submissions executed by staff and office heads across different offices do not interfere with one another. Durability guarantees that all committed records and uploaded file references remain permanently stored even during sudden system interruptions.
- Default Values: Fields that represent system-managed states are assigned default values at the database level to ensure that no record enters the system in an undefined state. The status field in the users table defaults to Pending upon account creation. The status field in the assignment_assignees table defaults to Pending. The is_active flag in categories defaults to true. These defaults ensure that all newly created records immediately reflect their correct operational state without relying solely on application-layer assignment.

C. Output Integrity Controls
Output integrity controls ensure that all dashboards, reports, queries, and exported files presented to users accurately reflect the live state of the database and cannot be altered, misrepresented, or accessed by unauthorized users.

- Live Database Query Generation: All dashboard outputs, filter query results, competency computations, and report displays in the SDU-STMS are generated directly from live database queries across the sixteen tables (users, training_records, training_evaluations, categories, etc.) at the time of the request rather than from cached or precompiled static data. The executive monitoring dashboard, office-level oversight panels, and staff dashboards query real-time data at the moment each page is rendered, ensuring that displayed metrics are always current.
- Role-Based Output Restriction: All query outputs and report data are filtered at the server-side application logic layer according to the authenticated user's assigned role:
  Staff: Can only retrieve their personal training submissions, assigned directives, acquired competency and knowledge portfolio, and personal notifications.
  Office Head: Can only retrieve records, staff profiles, certificates, assignments, evaluations, and partner records scoped to their assigned office, preventing unauthorized cross-office data exposure.
  Unit Director: Authorized to execute system-wide queries across all offices and the SDU unit, accessing aggregate institutional reports, cross-office evaluations, and partner summaries.
- Timestamped Reports and Action Logs: All generated reports, evaluation submissions, certificate uploads, and administrative decisions are automatically stamped with system-generated timestamps (created_at / generation_timestamp) at the moment the transaction commits. Exported files reflect the exact date and time of generation, providing a traceable audit trail that prevents retrospective record tampering.
- Export Validation: All CSV, PDF, and printable file exports are generated directly from the same live database queries that power on-screen report displays, ensuring that exported files are identical to what the user viewed on screen. Active interface filters, such as office scope, academic period, participation role, and competency category, are carried directly into the export query, ensuring that exported files contain only the intentionally selected data subset without leaking out-of-scope records.
- Error Handling and Validation Feedback: The system returns clear, specific error messages at the interface level when a submitted form fails validation, when a file upload exceeds permitted size or type restrictions, or when an operation violates database constraints. These messages identify the exact cause of the error and guide the user toward corrective action without exposing raw database exceptions or internal system architectures. All unhandled exceptions at the application layer are logged server-side and presented to the user as sanitized, generic notifications, preventing the leakage of sensitive infrastructure details through error outputs.

### 3.4.5 Security Controls

The SDU-STMS implements a multi-layered set of security controls designed to protect sensitive personnel data, training records, and certificate documentation from unauthorized access, accidental modification, and data breaches. These controls are distributed across the authentication layer, the authorization layer, the data transmission layer, and the database layer, and are designed in compliance with the requirements of the Data Privacy Act of 2012 (Republic Act No. 10173) of the Philippines and the data governance expectations of the Ateneo de Zamboanga University as established in Section 3.2.3.

A. Authentication
User authentication in the SDU-STMS is enforced through a credential-based login system requiring a registered institutional email address and password. Passwords are never stored in plaintext; upon registration, all passwords are processed through the Bcrypt hashing algorithm before being written to the users table in the PostgreSQL database. Bcrypt applies a computational cost factor to the hashing process, making brute-force and rainbow-table attacks computationally infeasible even in the event of a database breach. During login, the system retrieves the stored hash and uses bcrypt's comparison function to verify the submitted password without ever decrypting the stored value.

User sessions are managed entirely server-side through Laravel's session management framework. Upon successful authentication, the system issues a server-managed session token that persists only for the duration of the user's active browser session. Sessions are automatically invalidated upon explicit logout or after a defined period of inactivity, preventing unauthorized session reuse from unattended devices. A data privacy disclaimer is presented to all users upon registration and upon each system login, consistent with the requirements of Republic Act No. 10173.

B. Authorization and Role-Based Access Control
Access to all system modules, data records, and functional operations is governed by a Role-Based Access Control (RBAC) mechanism enforced at two levels of the application stack. At the interface level, the navigation menu and accessible pages rendered to each authenticated user are dynamically determined by their assigned role, ensuring that users are never presented with controls or views outside their authorization scope. At the server level, all API routes and controller actions are protected by role-specific authorization middleware that verifies the authenticated user's role before processing any request, ensuring that unauthorized data cannot be retrieved or modified even through direct URL manipulation or API calls.

The three authorization levels enforced by the system correspond directly to the three user types established in Section 3.2.1. The Unit Director holds the highest access level, with system-wide visibility into all staff records, training data, certificates, evaluations, and reports across all offices and the SDU unit, as well as authority over account approvals, training assignments, and catalog management. Office Head holds a mid-level access scope restricted to the staff, training records, assignments, evaluations, and partner records within their assigned office only, including the authority to assign training to their own staff, preventing cross-office data exposure. Staff members hold the lowest access level, restricted exclusively to their own personal profile, training records, assigned tasks, and received notifications.

C. Data Transmission Security
All data transmitted between the client browser and the application server is encrypted using HTTPS (Hypertext Transfer Protocol Secure) enforced through a valid SSL/TLS certificate installed on the deployment server. HTTPS ensures that all form submissions, file uploads, login credentials, and API responses are encrypted in transit and cannot be intercepted or tampered with through man-in-the-middle attacks. No sensitive data is transmitted over unencrypted HTTP connections. The deployment server is configured to redirect all HTTP requests to HTTPS automatically, ensuring that encrypted transmission is enforced regardless of how the user accesses the system URL.

D. Audit Trail
The system maintains a comprehensive audit trail through the action_history table in the database, automatically logging all key administrative actions performed by each user type with a system-generated timestamp, action category, and descriptive detail. Actions logged at the Unit Director level include account approvals and rejections, training assignments, catalog management (training, competency, and knowledge), evaluations, certificate uploads, and report exports. Actions logged at the Office Head level include staff directory modifications, training assignments to their own staff, evaluations, certificate uploads, office-level report exports, and partner record changes. Actions logged at the Staff level include training record submissions, certificate uploads, profile updates, and assignment completions. All audit log entries are system-generated and non-editable, ensuring that the action history cannot be falsified or selectively deleted by any user. This audit trail supports organizational accountability and provides a traceable record of all decision-making within the system as required by the SDU's administrative governance expectations.

E. Data Backup and Recovery
To protect against data loss resulting from hardware failure, accidental deletion, or system interruption, the SDU-STMS deployment environment is configured to perform regular automated database backups using PostgreSQL's built-in pg_dump utility. Database snapshots are scheduled at defined intervals and stored in a separate backup directory on the deployment server, with older backups retained for a rolling period to allow point-in-time recovery. Uploaded certificates and agreement documents are held in Cloudinary, a managed file storage service, and are not stored on the application server; the database retains only file references and metadata, so the backup covers the database and not the files themselves. In the event of data loss or corruption, the system can be restored from the most recent backup snapshot with minimal disruption to the SDU's operational continuity.

F. Additional Security Measures
Beyond the core controls described above, the SDU-STMS implements several additional protective measures at the application layer. All user-submitted input is sanitized and validated server-side before being processed or written to the database, preventing SQL injection and cross-site scripting (XSS) attacks from compromising the system through malicious form submissions. Laravel's built-in CSRF (Cross-Site Request Forgery) protection is applied to all state-changing form submissions, ensuring that requests cannot be forged from external sources. File uploads, including training certificates and agreement documents, are restricted to a defined set of accepted file types (PDF, DOC, PNG, and JPG) and are held in Cloudinary rather than on the application server, keeping them separate from the web-accessible application and preventing the execution of malicious scripts disguised as uploaded documents. These measures collectively ensure that the SDU-STMS maintains a secure operating environment throughout its deployment and operational lifecycle.

## 3.5 Development

The development of the Social Development Unit Staff Training and Management System will be carried out in accordance with the approved system design, following a structured and methodical process to ensure quality, scalability, and long-term maintainability.

The system will be developed using PHP as the primary server-side programming language due to its open-source nature, stability, and compatibility with modern web development frameworks. To further accelerate and standardize the development process, Laravel will be employed as the primary back-end framework. Laravel's robust ecosystem offers built-in features such as routing, authentication, database migration, and Eloquent ORM, which significantly reduces development work while promoting clean and maintainable code architecture. On the front-end, the system will be structured using HTML as the foundational markup language, giving every page and interface element a clear structure. JavaScript will be incorporated to handle dynamic interactions and client-side functionality, making the system more responsive and engaging for users without requiring constant page reloads. For styling, CSS and Tailwind CSS will be used together as the primary design framework. Tailwind's utility-first approach makes it straightforward to build interfaces that are clean, consistent, fully responsive, and user-friendly for the unit director, office head, and staff.

For data storage and management, the system will utilize PostgreSQL, a reliable and open-source relational database management system that will serve as the central data repository of the SDU-STMS. PostgreSQL was chosen because it naturally fits the kind of structured, multi-user environment the SDU operates in, one where training records, user accounts, participation roles, certificates, evaluations, and compliance data all need to stay accurate and consistent regardless of how many people are accessing the system at the same time. Its enforcement of schema constraints, foreign key relationships, and ACID (Atomicity, Consistency, Isolation, Durability) transaction properties ensures that the data integrity issues and inconsistencies found in the SDU's current Google Sheets-based workflow are effectively eliminated.

The project will adopt an Iterative development approach, which essentially means the system will be built progressively through a series of planned development cycles. Each cycle produces a working version of the system that can be tested, reviewed, and improved before moving forward. This approach was chosen because it allows the team to catch and address issues early, incorporate feedback from clients along the way, and steadily refine the system until it fully meets the intended requirements. Rather than waiting until everything is finished to find out what needs fixing, the iterative approach makes the development process more adaptive and responsive.

The development team follows consistent coding standards throughout the project. PHP files are organized using a modular folder structure separating controllers, models, views, and configuration files. Inline documentation is provided for all functions, database queries, and conditional logic blocks. Version control is managed using Git, with the code repository hosted on GitHub. All changes are committed with descriptive messages before merging into the main branch. This ensures that the codebase remains maintainable, traceable, and accessible for future enhancement or handover. The prototype demonstrates the screens and the main flows of the system; the storage of registrations, the live action history, the automatic partner expiry notices, and the logging of partner contributions are implemented in the next phase of development.

## 3.6 Testing

This section covers the Alpha and Beta Testing phases, which are designed to assess how well the Web-Based Social Development Unit Staff Training and Management System performs in terms of functionality, dependability, ease of use, and overall preparedness for deployment. Through these testing phases, issues are identified and addressed at an early stage, ensuring that the system aligns with the genuine needs and expectations of its users in practical, real-world use.

Before Alpha Testing begins, the proponents will first conduct Unit Testing. In this phase, the developers will test each feature and function of the system one at a time to make sure that each one works correctly on its own. By focusing on individual components early on, any problems that arise can be identified and fixed right away, before all the parts are combined into one complete system. This phase is carried out solely by the developers. The objectives of this testing phase are to: first, to confirm that each module and function performs the task it was designed for; second, to detect and correct errors early in order to prevent bigger issues from occurring once the modules are integrated together; and third, to verify that the system properly handles validation, data processing, CRUD operations, and error handling.

[Figure 3.6.1: Test Case Sample]

Figure 3.6.1 shows a sample test case that the developers will use during the testing phase where the test case ID, created by, testing priority, test case description, reviewed by, version, tester's name, date tested, test case status, prerequisites, test data, and test scenario are provided. This test case template will be used consistently across the unit, alpha, and beta testing phases of the SDU-STMS.

[Figure 3.6.2: Test Scenario Sample]

Figure 3.6.2 shows the test scenarios and actual results that the developers will use during the testing phase. The step number, step details, expected results, actual results, and pass or fail status are documented for each step. This template ensures clear tracking of test execution by comparing expected and actual results, helping to quickly identify and address any issues in order to improve the overall functionality of the SDU-STMS.

### 3.6.1 Alpha Testing

Alpha Testing takes place within the development team itself, serving as an internal quality check before any external user gets access to the system. At this stage, the team carefully examines the system to uncover any remaining bugs, inconsistencies in how features behave, and errors in the overall workflow that may have slipped through during development. The goal is to make sure that the system is functioning well and is stable enough to withstand real-world testing conditions.

The primary goal of this phase is to verify that the system meets its design specifications and performs all critical operations accurately. The developers will test each feature based on prepared test cases and validation criteria.

- Login, Logout, and Session Management: This part of the testing ensures that all three user roles (Unit Director, Office Head, and Staff) can log in and out of the system securely and are redirected to their correct dashboards based on their assigned role. Login should complete within 2 to 3 seconds upon submission of valid credentials.
  Expected behaviors include:
  ● Correct role-based redirection after a successful login.
  ● A clear validation message when incorrect credentials are entered.
  ● Automatic session termination upon logout, preventing unauthorized access to protected pages.
  ● Denial of direct URL access to restricted modules when the user is not authenticated.

- Account Registration and Approval Workflow: This test ensures that new accounts are correctly placed in a pending status upon registration and are only activated after explicit approval by the Unit Director. The registration form should load within 1 to 2 seconds, and the data privacy disclaimer must be displayed before or during the registration process.
  Expected behaviors include:
  ● Successful creation of a pending account upon form submission, with a confirmation message appearing within 2 seconds.
  ● Denial of login for accounts that remain in pending status.
  ● Correct activation of the account once the Unit Director approves it through the account management panel.
  ● Automatic notification dispatched to the user upon account approval.

- Role-Based Access Control (RBAC): This test verifies that each user role is restricted to only the modules and data permitted for their position, both at the interface level and at the server route level. The Unit Director should have system-wide access, Office Head should only see data within their assigned office, and Staff members should only access their own profile and training records.
  Expected behaviors include:
  ● Navigation menus that dynamically display only role-permitted modules for each user.
  ● An access denied response when a user attempts to reach a restricted URL directly.
  ● No cross-office data exposure for Office Head accounts.

- Training Input Module: This test ensures that Staff and Office Head can successfully encode training records with all required fields, including training title, description, date, venue, nature, scope, category, competencies, and participation role. The training input form should load within 1 to 2 seconds, and a saved record should appear in the training list within 2 seconds of submission.
  Expected behaviors include:
  ● Clear validation messages for each required field left blank upon submission.
  ● Accurate saving of participation roles selected via checkboxes, including multiple roles such as Facilitator and Organizer simultaneously.
  ● Immediate appearance of the new record in the training list after saving.
  ● Correct display of all saved field values when the record is opened for review.

- Training Assignment Module: This test verifies that the Unit Director can assign training tasks to Staff members and Office Head with specified deadlines, and that the system automatically dispatches a notification to the assigned user upon task creation. The assignment form should complete submission within 2 seconds.
  Expected behaviors include:
  ● Successful creation of a training assignment with the correct assignee and deadline saved.
  ● Automatic notification delivered to the assigned user immediately after task creation.
  ● Real-time display of the assignment and its completion status on the Central Monitoring Dashboard.
  ● Validation messages when required fields such as training name or deadline are left blank.

- Certificate Upload Module: This test ensures that Staff and Office Head can upload multiple certificate files including images and PDF documents to complete an assigned training, and that uploading a certificate directly completes the assignment. File uploads should complete within 3 to 5 seconds depending on file size.
  Expected behaviors include:
  ● Successful upload of multiple valid file types such as JPG, PNG, and PDF.
  ● Rejection of unsupported file types with a clear error message.
  ● Direct completion of the assignment upon upload.
  ● Automatic notification sent to the Unit Director and the Office Head when a certificate is uploaded.

- Central Monitoring Dashboard: This test verifies that the Unit Director's dashboard accurately reflects real-time system-wide data, including training records, staff compliance status, and training completion rates across all SDU offices. The dashboard should load and display all data within 3 to 5 seconds.
  Expected behaviors include:
  ● Accurate aggregation of training records from all SDU offices into a single dashboard view.
  ● Correct calculation and display of training completion rates and staff compliance metrics.
  ● Immediate reflection of new training records on the dashboard upon addition by a staff member.
  ● Office-scoped data display for Office Head accounts, with no cross-office data exposure.

- Filter Module: This test verifies that the Unit Director can filter all staff and training data by office, role, participation type, and time period, and that combined filters return accurate, correctly scoped results. Filter queries should return results within 1 to 2 seconds.
  Expected behaviors include:
  ● Accurate results when a single filter criterion is applied.
  ● Correct and consistent results when multiple filters are applied simultaneously.
  ● Complete restoration of all records when filters are cleared.

- Notification Module: This test ensures that the Unit Director and Office Head can compose and send notifications to specific users or entire offices, and that system-triggered notifications for training assignments and certificate uploads are automatically dispatched. Notifications should appear in the recipient's panel within 2 seconds of dispatch.
  Expected behaviors include:
  ● Successful delivery of manually composed notifications to the correct individual or group recipient.
  ● Automatic dispatch of notifications upon training assignment creation and certificate upload.
  ● Persistent read status for notifications marked as read by the recipient.

- Data Export and Printing Module: This test verifies that the system correctly exports all training and staff records to CSV format and generates structured, print-ready reports. Export operations should complete within 3 to 5 seconds depending on data volume.
  Expected behaviors include:
  ● Complete and correctly structured CSV exports containing all required fields such as staff name, training title, date, nature, scope, participation role, and status.
  ● Correctly scoped CSV exports when a filter is applied before export.
  ● Clean and properly formatted print report layout with no missing data or misaligned columns.

- Staff Dashboard: This test ensures that each Staff member's personal dashboard accurately displays their own training history, assigned tasks, assignment and certificate statuses, and profile information, and that new training records can be initiated directly from the dashboard.
  Expected behaviors include:
  ● Accurate display of all training records submitted by the logged-in staff member.
  ● Correct display of assigned tasks with their deadlines and completion statuses.
  ● Accurate assignment status labels such as Pending, Awaiting Certificate, or Completed for each assignment.
  ● Successful opening of the training input form directly from the staff dashboard.

- Competencies and Knowledge Tracking & Matching Module: This test ensures that the Unit Director and Office Head can tag trainings with competencies and knowledge areas, and perform competency searches and matching to find staff members for appropriate training assignments. The search query should complete within 1 to 2 seconds.
  Expected behaviors include:
  ● Successful tagging of competency and knowledge areas onto specific training programs by the Unit Director and Office Head.
  ● Accurate updating of individual competency and knowledge profiles when tagged trainings are recorded.
  ● Correct return of staff lists matching single or multi-tag competency and knowledge query filters.

- Partner Institution Management: This test verifies that the Unit Director can create, edit, and archive partner institution records, agreement files (MOUs), and contribution logs, while Office Heads can add and edit records only for their own office and view the rest. Form submissions and file attachments should process within 2 to 3 seconds.
  Expected behaviors include:
  ● Successful uploading and linking of partnership agreement files (PDFs) to partner institution profiles.
  ● Correct scoping so that an Office Head can create and edit only the partner records whose lead implementing office is their own, with other records read-only.
  ● Immediate updates to partner activity and contribution logs upon saving new entries.

- Evaluation Module: This test ensures that evaluations can be conducted within the system, allowing the Unit Director to evaluate any conducted training and Office Heads to evaluate conducted trainings in their own office, with the feedback viewable by the Staff member who conducted the training. Evaluation submissions should process within 1 to 2 seconds.
  Expected behaviors include:
  ● Correct display of the evaluation form based on the evaluator's scope (Unit Director: all offices; Office Head: own office).
  ● Complete storage of the recorded participants, feedback summary, per-role feedback, and overall rating upon form submission.
  ● Prevention of unauthorized cross-office evaluation submissions.
  ● Read-only display of the feedback on a staff member's own conducted trainings.

| Criteria                      | Description                                                                                                                                       | 5 - Excellent                                                                                                                                                  | 4 - Very Good                                                                                | 3 - Satisfactory                                                                                        | 2 - Needs Improvement                                                                  | 1 - Poor                                            |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------- | :-------------------------------------------------- |
| Access and Account Management | Tests user registration, login/logout, role-based access control, account approval workflow, and interface responsiveness across all three roles. | All authentication, RBAC, approval workflow, and interface functions work flawlessly with no errors across all roles and viewports.                            | All functions work correctly; minor UI inconsistencies or slight delay in approval workflow. | Core login and RBAC functions work; occasional role redirection or interface display issues.            | Login works but RBAC or approval workflow malfunctions in some cases.                  | Authentication or access control does not function. |
| Training Management           | Tests training input, participation role classification, assignment, certificate upload, and the staff personal dashboard.                        | All training modules save, classify, assign, and record certificates correctly without error; dashboard automatically and immediately reflects submitted data. | All modules functional; minor delays in notification dispatch or dashboard refresh.          | Core functions work; certificate upload or participation role classification occasionally inconsistent. | Some modules are functional; certificate upload or assignment notification unreliable. | Training management modules do not function.        |
| Monitoring and Analytics      | Tests the Central Monitoring Dashboard, Office Head oversight, and filter module across all data scopes.                                          | Dashboards accommodate real-time competency coverage correctly; all filter combinations return precise results.                                                | All monitoring functions are accurate; minor delay in dashboard refresh or filter query.     | Dashboards and filters mostly work; competency coverage occasionally misses edge cases.                 | Dashboards load missing values or inaccurately; filters are partially non-functional.  | Monitoring and analysis features do not function.   |

Table 3.6.1: Alpha Testing Rubric for Social Development Unit Staff Training and Management System

| Score range | Interpretation                             |
| :---------- | :----------------------------------------- |
| 4.50 – 5.00 | Passed – System ready for beta testing     |
| 3.50 – 4.49 | Minor revisions required                   |
| 2.50 – 3.49 | Major revisions needed before next phase   |
| 1.00 – 2.49 | Failed – System not ready for beta testing |

Table 3.6.2: Scoring Scale for Alpha Testing

### 3.6.2 Beta Testing

Beta testing will be carried out with the participation of actual end-users such as the SDU unit director, office head, and staff. This phase aims to gather structured, role-based feedback on the system's functionality, ease of use, and overall readiness before final deployment.

Beta Testing participants are selected from the SDU's active personnel representing all three user roles. The Unit Director participates to evaluate the administrative modules including the Central Monitoring Dashboard, Training Assignment, Certificate Upload, Notification, Evaluation, and Export modules. At least two Office Heads drawn from different SDU offices will participate to evaluate office-level oversight and training input functions. A minimum of three Staff members are selected to represent varying levels of digital literacy across the SDU's offices to participate to evaluate the training input, certificate upload, staff dashboard, and notification modules. All participants are existing SDU personnel and are not members of the development team.

Each participant is given access to the system and is asked to complete a set of role-specific tasks such as registering an account, encoding a training record, uploading a certificate, or reviewing the monitoring dashboard without step-by-step guidance from the developers. Participants are observed during the testing session and their actions, hesitations, and errors are noted by the proponents.

Feedback is collected through three instruments: direct observation during the testing session, a structured rubric (Table 3.6.3) completed by each participant after the session, and a brief open-ended interview conducted after the rubric is completed. Interview responses are transcribed and organized by theme. All feedback is reviewed and categorized into critical issues requiring immediate resolution, moderate issues to be addressed before deployment, and minor suggestions to be noted for future development cycles.

Rubrics for Beta Testing

| Criteria                      | Description                                                                                                                                                            | 5 - Excellent                                                                                                                                                                            | 4 - Very Good                                                                                                                                        | 3 - Satisfactory                                                                                                                                  | 2 - Needs Improvement                                                                                                       | 1 - Poor                                                                            |
| :---------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| Access and Account Management | Measures how easily Staff, Office Head, and the Unit Director can register, log in, and navigate the system based on their assigned role without developer assistance. | All users complete registration and login independently, understand the data privacy disclaimer, and navigate role-based menus without any guidance.                                     | All users complete login and registration successfully with only minor confusion on role selection or menu item labels.                              | Most users log in successfully but some require brief guidance on the account registration workflow or role-based navigation.                     | Several users struggle to complete login, registration, or understanding their role-specific interface.                     | Users cannot complete login or registration independently.                          |
| Training Management           | Measures how easily real users encode training records, upload certificates, track assignments, and use the dashboard without step-by-step developer guidance.         | All users complete training input, certificate upload, assignment tracking, and dashboard navigation independently and without errors.                                                   | All functions are completed successfully with only minor uncertainty on participation role checkboxes or assignment status tracking.                 | Most users complete core training tasks but some fields or workflow steps require brief guidance from the development team.                       | Several users are unable to complete training input or certificate upload without direct assistance.                        | Users cannot use training management features independently.                        |
| Monitoring and Analytics      | Measures how well the Unit Director and Office Head can navigate dashboards, apply filters, and interpret competency coverage results without developer explanation.   | All users independently navigate all monitoring features, correctly interpret all dashboard metrics and filter results, and understand competency coverage outputs without any guidance. | All monitoring features are understood with only minor clarification needed on one dashboard metric or filter option.                                | Users generally understand the dashboards and basic filters, but competency coverage outputs or combined filter results require some explanation. | Users find the monitoring and analytics features confusing and frequently misinterpret dashboard metrics or filter results. | Users cannot navigate or interpret monitoring and analytics features independently. |
| Communication and Reporting   | Measures how easily users send notifications, receive system alerts, and generate exports or printed reports without assistance.                                       | All users send and receive notifications correctly, and export and print functions are completed independently without confusion.                                                        | Notifications and export functions are completed successfully with only minor confusion on locating the export options or sent notification history. | Core communication and export functions are completed, but some steps in the notification composition or export workflow require guidance.        | Users can receive notifications but struggle to compose them or locate the data export and printing functions.              | Users cannot use communication or reporting features independently.                 |

Table 3.6.3: Beta Testing Rubric for Social Development Unit Staff Training and Management System

| Score range | Interpretation                             |
| :---------- | :----------------------------------------- |
| 4.50 – 5.00 | Passed – System ready for beta testing     |
| 3.50 – 4.49 | Minor revisions required                   |
| 2.50 – 3.49 | Major revisions needed before next phase   |
| 1.00 – 2.49 | Failed – System not ready for beta testing |

Table 3.6.4: Scoring Scale for Beta Testing
