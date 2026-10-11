NOTE: This is the DEFENDED version of the paper. It still includes features that were later removed (budget management, the Secretary role, proof validation, messaging).

# Chapter 3
# METHODOLOGY

## 3.1 Architectural Design

[Figure 3.1: Three-Tier Client-Server Architecture Diagram of SDU-ISCBMS]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): A diagram showing three tiers. 
> - TIER 1 - PRESENTATION LAYER (CLIENT - WEB BROWSER): Top box is "SYSTEM LANDING PAGE LOGIN FORM | SIGN UP FORM" which points with a "REDIRECTS" arrow to four boxes: UNIT DIRECTOR, OFFICE HEAD, SECRETARY, and STAFF. Each of these four boxes contains a bulleted list of interface components (e.g., Central monitoring dashboard, Staff & office directories, etc.).
> - Arrows labeled "JSON RESPONSE / RENDERED HTML" and "HTTP REQUEST / FORM SUBMISSIONS" connect Tier 1 to Tier 2.
> - TIER 2 - APPLICATION LAYER (LOGIC - LARAVEL): Contains boxes for various logic modules: Account management (RBAC, login, approval), Gap tracking Competency mapping, Skills Tracking & Matching, Training input, Notification (Alerts - messages), Partner Institution Management, Training assignment (Director/Secretary or Office Head-own staff) task deadline proof-gated completion, Filter module, Evaluation, Category Management: CRUD training, expense & evaluation categories, Proof upload & two-tier validation, Reports and export (CSV - summary - print), Budget Management (allocation - sub-distribution expense logging w/ receipt - overspend alert). Below these is a box for "Laravel controller layer" listing routing, file validation logic, session management, etc.
> - Arrows labeled "RETURNS QUERY RESULT" and "READS / WRITES DATA (POSTGRESQL)" connect Tier 2 to Tier 3.
> - TIER 3 - DATA LAYER (DATABASE - POSTGRESQL): Contains database tables: Users, Training Record Roles (multi-role junction), Notifications & Reports, Evaluation, Offices, Assignments, Skills, Budget, Training records, Proof Files, Partner Institutions, Categories.

Figure 3.1 illustrates the SDU-ISCBMS's three-tier architecture: client browsers used by the Unit Director, Secretary, Office Head, and Staff; the web server and application logic layer; and the centralized relational database. The Client and Application Tiers run on Laravel with Blade templates styled in Tailwind CSS; the Data Tier runs on PostgreSQL. Physically, this is deployed across three cloud providers Render (application hosting), Supabase (managed PostgreSQL), and Cloudinary (file/media storage) though the underlying architecture is provider-agnostic and can be redeployed to university-managed infrastructure without changing core logic, should ADZU's CITS office assume hosting after project turnover.

This model was chosen to resolve the core inadequacies of SDU's current manual process a shared, unstructured Google Sheet with no schema enforcement, no role-based access, and no centralized repository by establishing clear boundaries between presentation, logic, and data layers accessible to all four user levels through standard web browsers, no installation required. As defined by Nyabuto (2024), client-server architecture services requests over a network: the client requests a resource, the server processes and responds. This centralizes data across multiple simultaneous access points, supporting the scalability SDU's six centers require given their shared yet distinct data needs.

### 3.1.1 Client Tier (Presentation Layer)

Accessed through standard browsers, this tier renders the GUI for each role: the Staff Dashboard, Office Head Oversight Dashboard (with a localized proof validation interface for center staff), the Secretary's Dashboard (mirroring the Unit Director's to preserve continuity during absence), and the Unit Director's Central Monitoring Dashboard. It also renders the system's expanded-scope interfaces: Skill Search, Partner Institution pages, the Budget dashboard, an Office Head budget sub-distribution view, the Evaluation rating form, and the Training, Expense, and Evaluation Category management interfaces available to the Unit Director and Secretary. This layer handles input events (form submissions, file uploads, filter selections) and passes them to the Application Tier; it stores no business logic or data.

### 3.1.2 Application Tier (Logic Layer)

This tier processes all requests from the Client Tier, enforces business rules and Role-Based Access Control (RBAC), and mediates all database interaction. Core functions include authentication and session management; training record encoding with two-tier proof validation routing; participation role classification; training assignment logic by the Director/Secretary, or by an Office Head for their own staff with proof-gated completion status and a one-week grace period before a record is marked overdue; notification dispatch; gap analysis; report generation and export; and category management (training, expense, evaluation) for the Director and Secretary. It also handles skill-matching against event-required competencies; partner contribution and agreement-expiry tracking; budget allocation, an Office Head's sub-distribution of their office's allocated budget among staff and events, and overspend threshold calculation (alerting at 80 percent of an event's allocated budget); and evaluation score aggregation and trend computation. This tier enforces per-role data access, preventing cross-center exposure, and validates all input before it reaches the database.

### 3.1.3 Data Tier (Database Layer)

PostgreSQL serves as the single source of truth for all structured data. Files training proof, certificates, MOUs, and expense receipts (required per entry) are stored via Cloudinary, with the database retaining only file references and metadata. As established in Section 2.2.2, a relational schema prevents the inconsistencies of free-form spreadsheet entry: primary keys, foreign key relationships, referential integrity, and ACID transaction properties keep records accurate under concurrent multi-center access. This tier holds all training records, user profiles, multi-role participation mappings, proof references, notifications, and compliance data, alongside the expanded scope: staff skill profiles, partner institution and agreement metadata (including each partnership's lead implementing office), evaluation ratings, office budget and expense records, and Director/Secretary-managed category definitions across training, expense, and evaluation types. All dashboards, filters, and exports draw directly from live records.

This architecture is further supported by Sankoh et al. (2026), whose comparable web-based industrial placement system achieved sub-two-second response times and 98%+ data accuracy on the same architectural model, and by Sri Kanna et al. (2026), whose Smart HR Management System sustained sub-120ms API response under a simulated 10,000-record load using the same PostgreSQL-backed, role-based three-tier structure supporting this architecture's viability for SDU-ISCBMS's staff, training, and competency records at comparable scale.

## 3.2 Requirements Specification

This section identifies and describes the complete set of requirements for the SDU-ISCBMS. The requirements presented here were gathered through two primary methods: structured interviews with the Unit Director and Program Coordinator of the Social Development Unit, which were used to identify operational pain points and decision-support needs; and a systematic review of the SDU's existing Personnel Audit Form and current Google Sheets-based workflow, which was used to identify functional gaps and data management deficiencies as documented in Chapter 1. These requirements guide all subsequent system design decisions and ensure that the proposed solution is directly aligned with the organizational needs of the SDU.

### 3.2.1 Users and Characteristics

The SDU-ISCBMS is designed for four user types, differentiated by organizational role, authorized functions, and technical proficiency, corresponding to the four-level hierarchy established in Section 1.1.3.

| User Type | Role in Organization | Frequency of Use | Technical Proficiency | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| Unit Director | Primary administrator; oversees training and capacity building across all centers, reviews budget allocations, and searches skill profiles for external matching | Regular; ongoing monitoring, bi-yearly reporting, daily account management | Moderate | Highest; system-wide access to all records, dashboards, and exports |
| Secretary | Delegate administrator; assumes full Director-level access during the Director's absence, including budget allocation | Occasional; during Director's absence | Moderate | Highest; identical to the Director, except budget allocation, which is Secretary-exclusive |
| Office Head | Supervises an assigned center (ACCA, ACES, ACLG, ALTEC, APC, CCES); approves staff proofs, inputs own training, assigns training to own staff, logs receipted expenses, sub-distributes her office's allocated budget, and rates staff competency. May add and edit partner institution records associated with their own office | Regular; ongoing compliance monitoring | Moderate | Mid-level; restricted to her own center's records, budget, and evaluations |
| Staff Members | Program Coordinators, Project Officers, and other center personnel | Periodic; records and proof upload per training | Basic to moderate | Lowest; restricted to own profile, records, skills, and notifications |

Table 3.2.1: SDU-ISCBMS Users and Characteristics

The Unit Director holds the broadest access account approval, training assignment, monitoring, proof validation, gap analysis, and reporting while Office Head access is center-scoped and Staff access is limited to their own records. This variation is enforced through RBAC (Section 2.2.3). Office Head validates proofs from staff within their own center; their own proofs route instead to the Director or Secretary, since an Office Head cannot approve her own submission.

The Secretary holds access identical to the Director's, with one exception: budget allocation is Secretary-exclusive, with the Director retaining view-only access. Staff skill profiles auto-update upon completion of tagged trainings, and Staff may view their own evaluation ratings, but cannot initiate skill searches, allocate or sub-distribute budgets, or rate their own competency functions reserved for the Director, Secretary, and Office Head respectively.

### 3.2.2 Software Functionalities

The SDU-ISCBMS is composed of twenty-nine (29) functional modules, each corresponding directly to a specific objective established in Section 1.3. These modules are organized into eight (8) functional groups based on their operational purpose: Access and Account Management, Training Management, Monitoring and Analytics, Communication and Reporting, Skills Tracking and Matching, Partner Institution Management, Evaluation, and Budget Management.

Group A: Access and Account Management
*   Secure Account Management System with Role-Based Access Control (RBAC): Provides user registration with role and office selection, login/logout, and a Unit Director or Secretary-controlled account approval workflow. New accounts remain pending until reviewed and approved.
*   User-Friendly Interface: A responsive interface that adapts its menu and accessible functions to the authenticated user's role, accommodating varying digital literacy across centers.
*   Training and Expense Category Management: Allows the Unit Director and Secretary to create, edit, and deactivate training and expense category values used across the Training Input and Budget Management modules, replacing fixed lists with an extensible, admin-managed set.

Group B: Training Management
*   Training Input Module: Enables Staff and Office Head to encode training records such as title, description, date(s), venue, nature, scope, and participation role replacing manual Google Sheets entry with a standardized digital form.
*   Participation Role Classification: Records whether a staff member attended as Facilitator, Participant, Resource Speaker, or Organizer, selectable via checkboxes and usable as a dashboard/report filter.
*   Training Assignment Module: Enables the Unit Director or Secretary to assign training tasks to Staff and Office Head, or an Office Head to assign training to her own staff. A record is marked "Completed" only once its proof is validated, and "Overdue" only after a grace period past a passed deadline or self-marked status alone does not constitute completion.
*   Proof Upload and Validation Module: Allows Staff and Office Head to submit supporting files as proof of completion. Staff proofs route to their Office Head; Office Head proofs route to the Director or Secretary, since an Office Head cannot approve her own submission. Rejection triggers an automatic resubmission notice.
*   Staff Dashboard: Gives each Staff member a consolidated view of training history, roles, assigned tasks, profile, and notifications, with the ability to initiate inputs and track proof status.

Group C: Monitoring and Analytics
*   Central Monitoring Dashboard: Real-time, system-wide view of training records, compliance, completion rates, and capacity progress for the Director and Secretary.
*   Office Head Oversight Function: Center-specific dashboard of training activity, compliance, and capacity for each staff member in an Office Head's assigned center.
*   Training Gap Analysis Feature: Automatically flags competency deficits and over/under-participation by comparing required competencies against recorded training data.
*   Filter Module: Lets Staff query their own records, Office Head query their center's records, and the Director/Secretary query system-wide, by category, role, participation type, or academic-year half.

Group D: Communication and Reporting
*   Communication Module: Lets the Director, Secretary, and Office Head compose and send messages/alerts to staff, offices, or groups; Staff and Office Head receive notifications on assignments, rejections, and compliance updates.
*   Data Export and Printing Module: Lets the Director and Secretary export records to CSV or generate printed reports for bi-yearly and administrative reporting.

Group E: Skills Tracking and Matching
*   Skill Tagging Module: Lets the Director, Secretary, or Office Head tag a training with the competencies it develops; completion auto-adds the skill to the staff member's profile.
*   Staff Skill Profile: A searchable record combining auto-populated and manually entered skills.
*   Skill Search Function: Lets the Director and Secretary query staff by skill for external requests.

Group F: Partner Institution Management
*   Partner Institution Records: CRUD functionality for partner profiles (government, NGO, private foundation), including the specific SDU office designated as lead implementer of each partnership. Viewable by all roles, editable by the Director and Secretary system-wide, and by an Office Head for partnerships associated with their own office
*   MOU/Agreement Tracking: Upload of MOU/agreement documentation with optional expiry date; the system flags approaching or past-expiry agreements.
*   Contribution Log: Records cash and in-kind partner contributions with description, estimated value, and per-event/date-range history.

Group G: Evaluation
*   Post-Training Skill Rating: Lets an Office Head rate a Staff member's competency, and the Director or Secretary rate an Office Head's competency, on a 1-5 scale per skill per completed training.
*   Rating Trend View: Displays a staff member's rating history over time.
*   Evaluation Category Management: Lets the Director and Secretary create, edit, and deactivate evaluation categories used in the Post-Training Skill Rating module.

Group H: Budget Management
*   Office Budget Allocation: Lets the Secretary allocate a portion of an office's annual budget to a specific event, deducting it from the office's remaining balance; the Director retains view-only access to allocation records.
*   Office Budget Sub-Distribution: Lets an Office Head further distribute her office's already-allocated budget among her own staff and events.
*   Partner Funding Contribution: Adds partner funding to an event's budget as a separate account, without affecting the office's own balance.
*   Expense Logging: Lets staff assigned to an event log itemized expenses with a required receipt image.
*   Overspend Alert: Notifies the Office Head, Director, and Secretary when an event's expenses reach 80 percent of its allocated budget.
*   Budget Report Export: Generates an exportable/printable breakdown of funding sources and expenses per event.

### 3.2.3 Security Requirements

The SDU-ISCBMS handles sensitive personnel data including staff profiles, training records, competency assessments, and proof of training documentation. The following security requirements are established to protect this data from unauthorized access, accidental modification, and data breaches, and to ensure compliance with the data privacy expectations of the organization as raised during the interview phase of the study.

*   Role-Based Access Control (RBAC): Access to all system modules and data is restricted based on the authenticated user's assigned role. The Unit Director and Secretary are the only users with system-wide access, with the Secretary granted identical permissions to maintain continuity of approvals during the Director's absence. Office Head can only access data pertaining to staff within their assigned center, preventing cross-center data exposure. Staff members are restricted to their own profile and training records. RBAC is enforced at both the interface level, where menus and modules are rendered only for the appropriate role, and at the server level, where all API routes are protected by role-specific authorization middleware.
*   Budget Access Scoping: Office budget allocation is restricted to the Secretary; the Unit Director has view-only access to allocation records. Office Head may sub-distribute her own office's already-allocated budget among her staff and events, and may log itemized expenses only against events assigned to her own center, but cannot allocate from the university-wide budget pool or view/modify budget records belonging to other centers. Staff cannot allocate, sub-distribute, or modify any budget records. This scoping is enforced through the same interface- and server-level RBAC mechanisms described above.
*   Partner Institution Access Scoping: Partner institution records are editable by the Unit Director and Secretary system-wide, and by an Office Head only for partnerships associated with her own office. An Office Head cannot add, edit, or view partner records belonging to another center. Staff members hold view-only access to the partner institution directory. This scoping is enforced through the same interface- and server-level RBAC mechanisms described above.
*   Account Approval Workflow: No user account is activated without explicit review and approval by the Unit Director or Secretary. Upon registration, accounts are placed in pending status. This gate prevents unauthorized or incorrectly assigned users from gaining system access, ensuring that all active accounts represent verified SDU personnel.
*   Authentication and Session Management: Users must authenticate via a registered email address and password to access the system. Passwords are stored in hashed form using an industry-standard hashing algorithm. User sessions are managed server-side and are automatically terminated upon logout or after a defined period of inactivity, preventing unauthorized session reuse.
*   Data Privacy Compliance: A data privacy disclaimer is presented to all users upon account registration and upon each system login, consistent with the requirements of the Data Privacy Act of 2012 (Republic Act No. 10173) of the Philippines and in accordance with the university's data governance expectations.
*   Secure Data Transmission: All data transmitted between the client browser and the application server is encrypted via HTTPS (Hypertext Transfer Protocol Secure), preventing interception of sensitive personnel and training data during transmission.
*   Audit Trail: The system maintains a log of key administrative actions, including account approvals, proof validations, proof rejections, training assignments, and budget allocations, attributing each action to the responsible user account with a corresponding timestamp. This audit trail supports organizational accountability and traceability of decision-making within the system.

### 3.2.4 Technical Requirements

This section specifies the hardware, software, network, and compatibility requirements necessary for the development, deployment, and operation of the SDU-ISCBMS. These requirements are defined to ensure that the system functions reliably within the technical environment of the Ateneo de Zamboanga University's Social Development Unit.

Server Requirements (Deployment Environment)

| Component | Minimum Specification |
| :--- | :--- |
| Processor | Dual-core CPU, 2.0 GHz or higher |
| Memory (RAM) | 4 GB RAM minimum; 8 GB recommended |
| Storage | 20 GB available disk space minimum for application files, database, and uploaded proof files |
| Application Hosting | Managed cloud hosting through Render, which automatically provisions the server operating system, web server, HTTPS/SSL certificates, and scaling, removing the need for manual server configuration. Both the frontend (Blade views) and backend (Laravel application logic) are served from this single deployment. |
| Database Hosting | Managed PostgreSQL hosting through Supabase, providing automated backups, connection pooling, and a web-based administration interface without requiring manual database server setup. |
| File and Media Storage | Managed cloud storage through Cloudinary for training proof files, certificates, partner MOU/agreement documents, and expense receipts, providing automatic file validation, optimized delivery, and storage separate from the relational database. |
| Network | Stable internet connection with a minimum upload/download speed of 10 Mbps; HTTPS-enabled domain with a valid SSL certificate |

Table 3.2.4.1: Server Technical Requirements

Client Requirements (End-User Devices)

| Component | Minimum Specification |
| :--- | :--- |
| Device | Desktop computer, laptop, or tablet capable of running a modern web browser |
| Processor | 1.5 GHz or higher |
| Memory (RAM) | 2 GB RAM minimum |
| Browser Compatibility | Google Chrome (v100+), Mozilla Firefox (v100+), Microsoft Edge (v100+), Safari (v15+). No browser plugins or extensions are required. |
| Screen Resolution | Minimum 1280x720 pixels for optimal dashboard display |
| Network | Stable internet connection with a minimum speed of 5 Mbps for reliable form submission and file uploads |

Table 3.2.4.2: Client Technical Requirements

Development Environment

| Component | Specification |
| :--- | :--- |
| Programming Language (Backend) | PHP 8.1+ using the Laravel Framework |
| Frontend Technologies | Laravel Blade templating engine with Tailwind CSS for responsive UI layout |
| Database | PostgreSQL, hosted via Supabase |
| File and Media Storage | Cloudinary |
| Integrated Development Environment (IDE) | Visual Studio Code or any equivalent code editor |
| Version Control | Git with a remote repository hosted on GitHub for source code management and collaboration |
| Local Development Server | XAMPP (Windows/macOS) or Laravel Sail/Docker for local environment simulation during development |
| File Upload Handling | Cloudinary-based cloud file storage with server-side validation for accepted file types (PDF, DOC, PNG, JPG) prior to upload. |
| Deployment Model | The application is deployed as a single Laravel monolith on Render, with Blade views served directly by the backend and no separate frontend framework required. Database and file storage are hosted separately through Supabase and Cloudinary respectively, keeping the application server stateless with respect to persistent data and uploaded files. |

Table 3.2.4.3: Development Environment Technical Requirements

The technologies specified in the development environment table were selected based on their direct alignment with the three-tier architectural model discussed in Section 3.1. The Laravel framework provides both the server-side application logic layer and the client presentation layer through its Blade templating engine, while the PostgreSQL relational database serves as the data tier.

## 3.3 Analysis

The analysis phase serves as the diagnostic and translational core of the system development life cycle, where operational realities are systematically converted into technical software specifications. To establish an objective foundation for the Social Development Unit Integrated Staff Capacity Building Management System (SDU-ISCBMS), this section examines and documents the operational processes currently utilized by the organization, exposing structural bottlenecks that degrade data integrity and administrative efficiency. By explicitly contrasting these manual field liabilities against verified user demands, this analysis outlines how the gathered requirements directly guide system engineering. This structured evaluation ensures that the proposed software architecture remains completely aligned with the multi-center coordination, strategic decision-support, and data privacy needs of the organization

Current Process Evaluation and Operational Pain Points

On-site observations, personnel workflow reviews, and structured interviews with the Unit Director and Program Coordinator, conducted across two phases of data gathering, reveal that the organization currently relies entirely on a decentralized, manual tracking framework built within shared Google Sheets.

This tracking sheet, originally distributed as a one-time personnel audit exercise when the current Unit Director assumed the role, continues to function as the SDU's primary record of staff program assignments and educational attainment, without having been reissued or updated since. This operational loop introduces several critical vulnerabilities and institutional pain points that the proposed SDU-ISCBMS is designed to address:

1.  Labor-Intensive and Inefficient Data Input: Front-line staff members are forced to spend substantial administrative time manually typing names, positions, assigned programs, and degrees into a flat spreadsheet structure a one-time exercise that, having never been repeated, has left the SDU without any mechanism to capture staff changes, new hires, or updated qualifications since. This process is highly repetitive and diverts human resource energy away from primary community extensions and marginalized sector advocacies.
2.  High Risk of Data Inconsistency and Human Error: Because multiple users concurrently input data with varying levels of digital literacy and zero schema constraints, the shared document becomes highly vulnerable to silent formatting breaks, duplicate entries, and typographic errors. Simple naming variances (e.g., entering "Community Program" versus "Communities Program") prevent accurate software-driven sorting, corrupting the baseline integrity of the institutional capacity audit.
3.  Absence of Real-Time Analytics and Data Visualization: The flat layout of a standard spreadsheet lacks a relational database engine, leaving data static and siloed. The Unit Director cannot instantly generate high-level visualizations or track longitudinal competency growth across centers without manually counting cells and processing data rows.
4.  Lack of Proactive Monitoring and Automated Alerts: The current workspace operates in a purely reactive mode. Because the spreadsheet environment lacks automated validation or internal reminders, compliance gaps such as missing critical competencies required for specialized social work operations-go completely unnoticed until a formal administrative or program audit occurs.
5.  Critical Blind Spots in Strategic Decision-Support: The existing process records absolute attendance but fails to log the explicit capacity in which a staff member participated. The Unit Director cannot systematically distinguish whether an employee acted as a Participant, Facilitator, Speaker, or Organizer, a distinction that is absolutely critical for mapping true internal expertise.
6.  Absence of a Skill-Based Staff Matching Mechanism: The current system records that a staff member attended a training, but retains no structured, searchable record of the specific competencies they hold. When the SDU receives external requests for resource speakers or facilitators, such as the documented UN Women training-of-trainers request, staff-competency matching is performed entirely from memory or informal inquiry by the Unit Director. This has resulted in a documented pattern of over-reliance on the same one or two centers for such requests, since the Director has no visibility into competencies held by staff in other centers.
7.  No Structured Tracking of Partner Institutions or Budget Utilization: The SDU maintains active relationships with numerous external partner institutions, government agencies, non-government organizations, and private foundations, that provide funding, in-kind resources, and program support across its six centers. However, no centralized record exists to track partner contribution history, agreement documentation, or expiry dates, with this information instead scattered informally across individual center files. Similarly, while each office maintains a dedicated staff-development budget line, budget utilization is checked only through the university's separate Purchasing Custodian Office system, with no mechanism within the SDU's own tracking process to monitor allocation against actual event expenditures or to flag when a specific event's budget is approaching exhaustion.
8.  No Mechanism to Distinguish Attendance from Demonstrated Competency Growth: The current process treats training attendance as an implicit proxy for staff development, without any means of verifying whether a staff member's actual competency improved as a result. A staff member may attend numerous seminars in a given year with no corresponding evaluation of skill growth, learning retention, or behavioral change. This gap was identified as a critical omission during adviser consultation, since capacity building, properly understood, requires evidence of demonstrated improvement, not merely a record of participation.

### 3.3.1 Process Models

A. DFD: Context Data Flow Diagram

[Figure 3.3.1.A: Context Data Flow Diagram of SDU-ISCBMS]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): A Context Data Flow Diagram (Level 0) showing a central process named "SDU INTEGRATED STAFF CAPACITY BUILDING MANAGEMENT SYSTEM" interacting with three external entities: STAFF, OFFICE HEADS, and DIRECTOR / SECRETARY. Arrows indicate data flowing in and out of the central process for each entity. For example, STAFF sends Login Credentials, Registration Form, Training Records, Training Proof, Background Skills, etc., and receives Display Personal Dashboard Data, Training Assignment View, Display Own Skill Profile, etc. OFFICE HEADS sends and receives similar but expanded data (e.g., Validate/Reject Proof, Rate Staff Evaluation). DIRECTOR / SECRETARY sends administrative data like Approve/Reject Account, Allocate Office Budget, Evaluation Category Management, and receives Display Central Monitoring Dashboard, Display All Staff Data, etc.

The Context Data Flow Diagram (Context DFD) illustrated in Figure 3.3.1.A presents the highest-level overview of the SDU-ISCBMS, depicting the system as a single process (Process 0) and its interactions with three external entities: the Staff, the Office Head, and the SDU Director/Secretary.

The Staff interacts with the system by submitting login credentials, registration forms, training records (including category, scope, and participation role), training proof, self-reported background skills, event budget expense logs, messages, export or print requests, and proof rejection resubmissions. In return, the system provides the Staff with their personal dashboard data, training assignment view, personal skill profile and evaluation rating history, staff gap analysis, proof validation status, received notifications and messages, action reports, and a printable or exportable file.

The Office Head communicates with the system by sending login credentials, registration forms, training records, training proof, proof validation or rejection decisions for staff within their center, staff competency evaluation ratings, training assignments for their own staff, budget expense logs within their assigned center, office budget distribution requests among their own staff and events, partner institution records and agreement documentation for partnerships associated with their own office, messages and notifications, export or print requests, and proof rejection resubmissions. The system responds by delivering the office dashboard data, office staff training data, training assignment view, office gap analysis, proof validation status, staff skill and evaluation views, the partner institution directory scoped to full access for their own office's records and view-only for other centers, center budget and funded events view, received notifications and messages, action reports, and a printable or exportable file.

The SDU Director/Secretary, as the highest-level user, inputs login credentials, account approvals or rejections, training assignments, training category, expense category, and evaluation category management actions, proof validations or rejections escalated from Office Head, partner institution records and agreement documentation, budget allocations, skill search queries, notifications and messages, export or print requests, and training details into the system. The system returns to the Director/Secretary the central monitoring dashboard, all staff data system-wide, pending account approvals, training gap analysis, escalated proof submissions, the partner institution directory, the budget dashboard, skill search results, received notifications and messages, action reports, and a printable or exportable file.

B. DFD: Level 0 Data Flow Diagram

[Figure 3.3.1.B: Level 0 Data Flow Diagram of SDU-ISCBMS]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): A complex Level 0 Data Flow Diagram displaying 9 main processes: 1.0 Account & System Administration, 2.0 Training Management, 3.0 Proof Validation, 4.0 Monitoring and Analytics, 5.0 Communication and Reporting, 6.0 Skills Tracking and Matching, 7.0 Partner Institution Management, 8.0 Evaluation, 9.0 Budget Management. These processes interact with 10 data stores: D1 Users, D2 Office, D3 Training Records, D4 Proof Files, D5 Assignment, D6 Notifications, D7 Reports, D8 Skills, D9 Partner Institutions, D10 Budget. The external entities (STAFF, OFFICE HEAD, SDU DIRECTOR / SECRETARY) are shown interacting with these processes via numerous labeled data flow arrows.

Figure 3.3.1.B presents the Level 0 Data Flow Diagram of the SDU Integrated Staff Capacity Building Management System (SDU-ISCBMS), illustrating the complete flow of data between the three external entities STAFF, OFFICE HEAD, and SDU DIRECTOR/SECRETARY, the nine core processes of the system, and the ten data stores that serve as the system's centralized repositories. The diagram is organized around nine processes: Process 1.0 Account & System Administration, Process 2.0 Training Management, Process 3.0 Proof Validation, Process 4.0 Monitoring and Analytics, Process 5.0 Notification and Reporting, Process 6.0 Skills Tracking and Matching, Process 7.0 Partner Institution Management, Process 8.0 Evaluation, and Process 9.0 Budget Management. These processes interact with ten data stores: D1 Users, D2 Offices, D3 Training Records, D4 Proof Files, D5 Assignments, D6 Notifications, D7 Reports, D8 Skills (+ Staff Skills, Event Required Skills, Skill Categories), D10 Budget (+ Funding Sources, Expenses, Expense Categories), D9 Partner Institutions (+ Agreements, Contributions), D10 Budget (+ Funding Sources, Expenses).

Process 1.0 Account & System Administration receives registration forms and login credentials from all three external entities. New Staff and Office Head accounts are placed in a pending state in D1 until the SDU Director/Secretary approves or rejects them. This process also handles the Director/Secretary's Training Category Management actions, reading from and writing to D3's category values. It also handles the Director/Secretary's Expense Category Management actions, writing the corresponding category values to D10. Validated login credentials return role-specific access confirmation to the requesting entity.

Process 2.0 Training Management receives training input (title, description, dates, venue, nature, scope, category, participation role) from Staff and Office Heads, storing each record in D3. It also receives training assignment details from the Director/Secretary, or from an Office Head assigning training to their own staff, writing task, deadline, and completion-status data to D5. A training's completion status in D5 is updated only upon confirmation from Process 3.0 that its associated proof has been validated; a passed deadline alone does not trigger completion. Assignments past their deadline are marked 'Overdue' only after a one-week grace period, not immediately upon deadline expiry.

Process 3.0 Proof Validation receives training proof files from Staff and Office Heads, storing them in D4 with a pending status. Proofs submitted by Staff are routed to their assigned Office Head for review; proofs submitted by an Office Head are instead routed to the SDU Director/Secretary, since an Office Head cannot approve their own submission. The reviewing entity's validate/reject decision updates D4's status, and upon validation, updates the proof's validation status in D4, which Process 2.0 reads to update the corresponding record in D5 to 'Completed.' A rejection returns a resubmission notice to the original submitter.

Process 4.0 Monitoring and Analytics reads training, proof, and assignment data from D3, D4, and D5 to generate dashboard views, compliance tracking, and gap analysis. Staff receive their personal dashboard data and gap analysis; Office Heads receive center-level staff training data, dashboard data, and gap analysis; the Director/Secretary receives the central monitoring dashboard, system-wide staff and training data, and system-wide gap analysis. Gap alerts and filtered query results are forwarded to Process 5.0 for reporting.

Process 5.0 Communication and Reporting consolidates action triggers from Processes 1.0 through 4.0 and 6.0 through 9.0, together with direct notification, direct messaging, and export requests from all three entities, to handle outgoing communications, inter-user messaging, and record exports. System-generated notifications are dispatched to Staff, Office Heads, and the Director/Secretary, with records stored in D6. Direct messages composed between any two entities are also routed through this process and stored in D6, allowing recipients to retrieve and view their conversation history. All system actions like account approvals, proof validations, training assignments, budget allocations, partner record changes, and exported reports are logged in D7 as role-specific action histories, displayed back through each entity's action report view.

Process 6.0 Skills Tracking and Matching receives skill-tagging input from the Director/Secretary or Office Head against a completed training, automatically writing the associated skill to the relevant staff member's profile in D8. It also receives Staff's self-reported background skills directly into D8. The Director/Secretary's skill search queries are matched against D8 and returned as skill search results.

Process 7.0 Partner Institution Management Process 7.0 Partner Institution Management receives partner institution records, MOU/agreement uploads, and contribution logs from the Director/Secretary system-wide, and from an Office Head for partnerships associated with their own office, writing them to D9. Records are readable by Staff as a view-only partner directory, and by Office Heads with full access to their own office's records and view-only access elsewhere. The process monitors agreement expiry dates in D9 and forwards expiry alerts to Process 5.0 for dashboard display.

Process 8.0 Evaluation receives post-training competency ratings (1–5 scale) from Office Heads for staff within their center, tied to a specific skill and training record, and stores them in D8. Rating history is returned to Staff as their personal evaluation trend, to Office Heads as their staff's evaluation views, and to the Director/Secretary as a system-wide evaluation trend.

Process 9.0 Budget Management receives office budget allocation input from the Director/Secretary, deducting the allocated amount from the relevant office's balance in D10. An Office Head may further distribute her office's already-allocated budget among her own staff and events, also recorded in D10. Staff and Office Heads submit itemized expense logs including a required receipt image against funded events, also written to D10. The process monitors each event's expense total against its allocated amount and, upon reaching 80 percent, forwards an overspend alert to Process 5.0 for dispatch to the Office Head and Director/Secretary.

A. DFD: Level 1 Data Flow Diagram

Process 1.0: Account & System Administration

[Figure 3.3.1.C: Level 1.1 Data Flow Diagram of SDU-ISCBMS]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Level 1.1 DFD for Account & System Administration. It shows sub-processes: 1.1 Registration, 1.2 Login Validation, 1.3 Account Approval/Rejection, 1.4 Account Modify/Deactivate, 1.5 Category Management, and 1.6 Account Status Notification. These sub-processes interact with external entities STAFF, OFFICE HEAD, and SDU DIRECTOR / SECRETARY, and read/write to data stores D1 Users, D3 Training Records, D10 Budget, and D8 Skills.

Figure 3.3.1.C presents the Level 1 Data Flow Diagram for Process 1.0: Account & System Administration of the SDU-ISCBMS. This level of decomposition breaks the process into six sub-processes: (1.1) Registration, (1.2) Login Validation, (1.3) Account Approval/Rejection, (1.4) Account Modify/Deactivate, (1.5) (1.5) Training, Expense, and Skill Category Management, and (1.6) Account Status Notification. The process interacts with three data stores Users (D1), Training Records (D3), Skills (D8), and Budget (D10) and all three external entities. Sub-process 1.1 Registration receives registration forms from Staff and Office Heads and creates a pending account record in D1. Sub-process 1.2 Login Validation authenticates credentials submitted by all three entities against D1. Sub-process 1.3 Account Approval/Rejection processes the SDU Director/Secretary's approval decisions, updating the account's status in D1. Sub-process 1.5 Training, Expense, and Skill Category Management handles the Director/Secretary's category creation, editing, and deactivation requests for training, expense, and skill categories, writing training category values to D3, expense category values to D10, and skill category values to D8. Sub-process 1.6 Account Status Notification returns the resulting account status to the requesting Staff or Office Head, while pending approvals are displayed back to the Director/Secretary.

Process 2.0: Training Management

[Figure 3.3.1.D: Level 1.2 Data Flow Diagram of SDU-ISCBMS]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Level 1.2 DFD for Training Management. It shows sub-processes: 2.1 Training Record Input, 2.2 Participation Role Classification, 2.3 Training Assignment Creation, 2.4 Assignment Notification Dispatch, and 2.5 Completion Status Update. These interact with STAFF, OFFICE HEADS, and SDU DIRECTOR / SECRETARY, and data stores D3 Training Records, D5 Assignment, and D4 Proof Files.

Figure 3.3.1.D presents the Level 1 Data Flow Diagram for Process 2.0: Training Management. This process is decomposed into five sub-processes: (2.1) Training Record Input, (2.2) Participation Role Classification, (2.3) Training Assignment Creation, (2.4) Assignment Notification Dispatch, and (2.5) Completion Status Update. The process interacts with two data stores, Training Records (D3) and Assignments (D5), and all three external entities. Sub-process 2.1 receives training details from Staff and Office Heads and records them in D3, while 2.2 classifies the associated participation role as part of the same submission. Sub-process 2.3 processes training task assignments from either the Director/Secretary or an Office Head assigning training to their own staff, writing the assigned training, deadline, and completion status to D5. When an Office Head creates the assignment, the Director/Secretary additionally receives an FYI notification of the action. Sub-process 2.4 dispatches the corresponding assignment notification to the assigned Staff or Office Head. Sub-process 2.5 Completion Status Update reads the validation status from D4 and updates the corresponding record in D5 to "Completed" only once validation has occurred a passed deadline alone does not trigger this update, and a record is marked "Overdue" only after a one-week grace period past its deadline.

Process 3.0: Proof Validation 

[Figure 3.3.1.E: Level 1.3 Data Flow Diagram of SDU-ISCBMS]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Level 1.3 DFD for Proof Validation. Shows sub-processes: 3.1 Proof Submission, 3.2 Route to Office Head, 3.3 Route to Director/Secretary, 3.4 Validate/Reject Decision, and 3.5 Rejection Notification & Resubmission. The process interacts with STAFF, OFFICE HEADS, and SDU DIRECTOR / SECRETARY, writing to and reading from D4 Proof Files.

Figure 3.3.1.E presents the Level 1 Data Flow Diagram for Process 3.0: Proof Validation of the SDU-ISCBMS. This level of decomposition breaks down the proof validation process into five sub-processes: (3.1) Proof Submission, (3.2) Route to Office Head, (3.3) Route to Director/Secretary, (3.4) Validate/Reject Decision, and (3.5) Rejection Notification & Resubmission. The process interacts with one data store Proof Files (D4) and three external entities: Staff, Office Head, and SDU Director/Secretary. Sub-process 3.1 Proof Submission receives training proof from Staff or Office Heads and records it in D4 with a pending status, forwarding the submission to either 3.2 or 3.3 depending on the submitter's role. Proofs submitted by Staff are directed to 3.2 Route to Office Head, notifying the staff member's assigned Office Head for review; proofs submitted by an Office Head are instead directed to 3.3 Route to Director/Secretary, since an Office Head cannot approve their own submission. Both paths converge at 3.4 Validate/Reject Decision, where the reviewing entity's decision updates the proof's status in D4, which Process 2.0's sub-process 2.5 subsequently reads to update the corresponding training record's completion status. If rejected, 3.5 Rejection Notification & Resubmission returns a rejection notice with a stated reason to the original submitter, who may then resubmit proof, restarting the cycle at 3.1.

Process 4.0: Monitoring and Analytics 
 
[Figure 3.3.1.F: Level 1.4 Data Flow Diagram of SDU-ISCBMS]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Level 1.4 DFD for Monitoring and Analytics. Shows sub-processes: 4.1 Retrieve Training/Proof/Assignment Data, 4.2 Central Monitoring Dashboard, 4.3 Office Oversight Dashboard, 4.4 Staff Personal Dashboard, 4.5 Training Gap Analysis, and 4.6 Filter/Query Module. The process reads from D3 Training Records, D4 Proof Files, and D5 Assignment, and writes Gap Alert Entries to D7 Reports. Interacts with STAFF, OFFICE HEADS, and SDU DIRECTOR / SECRETARY.

Figure 3.3.1.F presents the Level 1 Data Flow Diagram for Process 4.0: Monitoring and Analytics. This process is decomposed into six sub-processes: (4.1) Retrieve Training/Proof/Assignment Data, (4.2) Central Monitoring Dashboard, (4.3) Office Oversight Dashboard, (4.4) Staff Personal Dashboard, (4.5) Training Gap Analysis, and (4.6) Filter/Query Module. The process reads from three data stores Training Records (D3), Proof Files (D4), and Assignments (D5) and interacts with all three external entities. Sub-process 4.1 retrieves compliance, validation, and assignment status data from the three data stores, which is then routed according to the requesting entity's role: 4.2 compiles the system-wide Central Monitoring Dashboard for the Director/Secretary, 4.3 compiles the center-scoped Office Oversight Dashboard for Office Heads, and 4.4 compiles the individual Staff Personal Dashboard. Sub-process 4.5 Training Gap Analysis compares recorded training data against required competencies to flag deficits and over-participation, writing gap alerts directly to D7 for Process 5.0 to subsequently read and dispatch. Sub-process 4.6 allows Office Heads and the Director/Secretary to filter and query data by office, role, participation type, or academic period and Staff which is scoped to personal records

Process 5.0: Notification and Reporting

[Figure 3.3.1.G: Level 1.5 Data Flow Diagram of SDU-ISCBMS]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Level 1.5 DFD for Communication and Reporting. Shows sub-processes: 5.1 Compose/Send Notification, 5.2 Receive/Display Notification, 5.3 Export/Print Handling, 5.4 Action History Logging, 5.5 Action History Retrieval, and 5.6 Inbox Messaging. It shows inputs from all other processes (1.0 to 4.0 and 6.0 to 9.0) feeding into 5.4 Action History Logging and D7 Reports. It interacts heavily with D6 Notifications and all three external entities.

Figure 3.3.1.G presents the Level 1 Data Flow Diagram for Process 5.0: Communication and Reporting. This process is decomposed into six sub-processes: (5.1) Compose/Send Notification, (5.2) Receive/Display Notification, (5.3) Export/Print Handling, (5.4) Action History Logging, (5.5) Action History Retrieval, and (5.6) Inbox Messaging. The process interacts with two data stores Notifications (D6) and Reports (D7) and all three external entities. Sub-process 5.1 processes outgoing messages directly composed by any entity, storing each in D6, while 5.2 delivers received notifications back to their intended recipients. Sub-process 5.3 handles export and print requests, generating CSV or printable files on demand. Sub-process 5.4 Action History Logging reads action and alert entries already written to D6 and D7 by Processes 1.0 through 4.0 and 6.0 through 9.0 including account approvals, proof validations, training assignments, budget allocations, and partner record changes and organizes them into role-specific action histories, which 5.5 retrieves and displays back through each entity's action report view. Sub-process 5.6 allows any entity to compose a direct message to another and retrieve their conversation history, stored alongside notifications in D6.

Process 6.0: Skills Tracking and Matching

[Figure 3.3.1.H: Level 1.6 Data Flow Diagram of SDU-ISCBMS]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Level 1.6 DFD for Skills Tracking and Matching. Shows sub-processes: 6.1 Skill Tagging, 6.2 Auto-Populate Skill Profile, 6.3 Manual Background Skill Entry, and 6.4 Skill Search Query. It interacts with D8 Skills and D3 Training Records. Entities STAFF, OFFICE HEADS, and SDU DIRECTOR / SECRETARY are shown sending inputs and receiving skill views/results.

Figure 3.3.1.H presents the Level 1 Data Flow Diagram for Process 6.0: Skills Tracking and Matching. This process is decomposed into four sub-processes: (6.1) Skill Tagging, (6.2) Auto-Populate Skill Profile, (6.3) Manual Background Skill Entry, and (6.4) Skill Search Query. The process interacts with one data store Skills (D8) and all three external entities. Sub-process 6.1 allows the Director/Secretary or Office Head to tag a training record with the competencies it develops; upon detecting a training record in D3 marked "Completed," 6.2 automatically writes the associated skill to the relevant staff member's profile in D8. Sub-process 6.3 separately accepts Staff's self-reported background or educational skills not tied to any tracked training, writing these directly to D8 as well. Sub-process 6.4 Skill Search and Profile Retrieval allows the Director/Secretary to search D8 by specific skill or competency, and also retrieves and returns skill profile data to Staff and Office Heads for their own dashboard views., returning matching staff records to support rapid identification of qualified personnel for external requests. The catalog of available skills itself is created and maintained by the Director/Secretary through Process 1.0's Skill Category Management sub-process, rather than within Process 6.0.

Process 7.0: Partner Institution Management

[Figure 3.3.1.I: Level 1.7 Data Flow Diagram of SDU-ISCBMS]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Level 1.7 DFD for Partner Institution Management. Shows sub-processes: 7.1 Partner Record CRUD, 7.2 MOU/Agreement Upload, 7.3 Agreement Expiry Monitoring, 7.4 Contribution Logging, and 7.5 Partner Directory View. Interacts with D9 Partner Institutions, D2 Office, and D6 Notifications. Entities SDU DIRECTOR / SECRETARY and OFFICE HEADS send inputs, while STAFF has read-only access.

Figure 3.3.1.C.7 presents the Level 1 Data Flow Diagram for Process 7.0: Partner Institution Management. This process is decomposed into five sub-processes: (7.1) Partner Record CRUD, (7.2) MOU/Agreement Upload, (7.3) Agreement Expiry Monitoring, (7.4) Contribution Logging, and (7.5) Partner Directory View. The process interacts with one data store Partner Institutions (D9) and all three external entities. Sub-process 7.1 processes the Director/Secretary's creation, editing, and deletion of partner organization profiles system-wide, and an Office Head's creation and editing of partner records associated with their own office, in D9, including designation of the specific SDU office that leads implementation of each partnership, referenced against D2, since the legal signatory on an agreement (e.g., the university itself) may differ from the office actually carrying out the partnership's activities. An Office Head is restricted to records whose lead_office_id matches their own assigned office. Sub-process 7.2 handles the upload of associated Memorandum of Understanding or agreement documentation with an optional expiry date. Sub-process 7.3 continuously checks D9 for agreements approaching or past expiry, writing expiry alerts directly to D6 for Process 5.0 to subsequently read and dispatch. Sub-process 7.4 records both cash and in-kind partner contributions logged by the Director/Secretary. Sub-process 7.5 Partner Directory View provides read-only access to D9 for Staff, and full read access for the Director/Secretary system-wide and for an Office Head within their own office's records, with view-only access to records outside their own office.

Process 8.0: Evaluation

[Figure 3.3.1.J: Level 1.8 Data Flow Diagram of SDU-ISCBMS]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Level 1.8 DFD for Evaluation. Shows sub-processes: 8.1 Post-Training Rating Input, 8.2 Rating Storage/Update, 8.3 Rating Trend Retrieval, 8.4 Role-Based Rating Display, and 8.5 Evaluation Category Management. Interacts with D3 Training Records and D8 Skills. SDU DIRECTOR / SECRETARY evaluates Office Heads, OFFICE HEADS evaluates Staff, and STAFF receives evaluation history.

Figure 3.3.1.J presents the Level 1 Data Flow Diagram for Process 8.0: Evaluation. This process is decomposed into five sub-processes: (8.1) Post-Training Rating Input, (8.2) Rating Storage/Update, (8.3) Rating Trend Retrieval, (8.4) Role-Based Rating Display, and (8.5) Evaluation Category Management. The process interacts with one data store Skills (D8), shared with Process 6.0, and all three external entities. Sub-process 8.1 receives a competency rating on a 1–5 scale from an Office Head for a Staff member within their center, or from the Unit Director/Secretary for an Office Head, since an Office Head cannot rate their own performance — mirroring the same escalation rule enforced in Process 3.0 Proof Validation. Each rating is tied to a specific skill, a specific evaluation category, and references the training recorded as "Completed" in D3. Sub-process 8.2 writes the rating to D8 alongside the associated staff, skill, and training identifiers. Sub-process 8.3 retrieves a staff member's rating history over time, and 8.4 displays it according to the requesting entity's role: Staff view their own evaluation history, Office Heads view ratings for staff within their center as well as their own evaluation history, and the Director/Secretary views a system-wide evaluation trend. Sub-process 8.5 Evaluation Category Management allows the Director/Secretary to create, edit, or deactivate evaluation categories beyond the system's default set, writing the corresponding category values to D8.

Process 9.0: Budget Management

[Figure 3.3.1.K: Level 1.9 Data Flow Diagram of SDU-ISCBMS]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Level 1.9 DFD for Budget Management. Shows sub-processes: 9.1 Office Budget Allocation, 9.2 Partner Funding Contribution, 9.3 Expense Logging, 9.4 Overspend Threshold Check, 9.5 Overspend Alert Dispatch, 9.6 Budget Report Export, and 9.7 Office Budget Sub-Distribution. Interacts with D10 Budget and D6 Notifications. SDU DIRECTOR / SECRETARY allocates budget and logs partner funding, OFFICE HEADS requests sub-distribution and logs expenses, STAFF logs event expenses.

Figure 3.3.1.K presents the Level 1 Data Flow Diagram for Process 9.0: Budget Management. This process is decomposed into seven sub-processes: (9.1) Office Budget Allocation, (9.2) Partner Funding Contribution, (9.3) Expense Logging, (9.4) Overspend Threshold Check, (9.5) Overspend Alert Dispatch, (9.6) Budget Report Export, and (9.7) Office Budget Sub-Distribution. The process interacts with one data store Budget (D10) and all three external entities. Sub-process 9.1 processes the Director/Secretary's allocation of a portion of an office's annual budget to a specific event, deducting the amount from the office's remaining balance in D10. Sub-process 9.2 records partner funding contributions to an event as a separate account within D10, without affecting the office's own balance. Sub-process 9.3 allows Staff and Office Heads assigned to an event to log itemized expenses against it, with a receipt image required for each entry. Sub-process 9.4 continuously compares an event's logged expenses against its allocated amount, and upon reaching 80 percent, 9.5 writes an overspend alert directly to D6 for Process 5.0 to subsequently read and dispatch to the Office Head and Director/Secretary. Sub-process 9.6 generates an exportable or printable breakdown of funding sources and expenses per event. Sub-process 9.7 Office Budget Sub-Distribution allows an Office Head to further divide her office's already-allocated budget among her own staff and events, recording each sub-allocation in D10.

### 3.3.2 Data Models

[Figure 3.3.2.1: ERD for SDU-ICSBMS]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Entity-Relationship Diagram (ERD) with the central supertype entity USER branching into subtypes: DIRECTOR, SECRETARY, OFFICE_HEAD, and STAFF. Other major entities include OFFICE, TRAINING_RECORD, PROOF_FILE, ASSIGNMENT, CATEGORY, TRAINING_RECORD_ROLE, FUNDING_SOURCE, EVENT_EXPENSE, REPORT, NOTIFICATION, PARTNER_INSTITUTION, PARTNER_AGREEMENT, CONTRIBUTION, OFFICE_BUDGET, EVENT_REQUIRED_SKILLS, TRAINING_CATEGORY, SKILLS, STAFF_SKILLS, EVALUATION. Arrows depict relationships like "Allocates", "Distributes", "Validates", "Submit".

Figure 3.3.2.1 presents the Conceptual Entity-Relationship Diagram (ERD) of the SDU-ISCBMS, modeling the system's data at the business-rule level prior to physical database implementation, which is subsequently addressed in Section 3.4.1. The diagram is composed of nineteen conceptual entities, organized around a central supertype/subtype hierarchy and six supporting functional groups: Training and Proof, Communication, Skills, Partner Institutions, Evaluation, and Budget.

The USER entity serves as a total, disjoint supertype, connected through a specialization circle marked ⊙(d) to four mutually exclusive subtypes: DIRECTOR, SECRETARY, OFFICE_HEAD, and STAFF. This specialization is total, meaning every user account must belong to exactly one of the four subtypes, and disjoint, meaning no account may hold more than one role simultaneously. Rather than duplicating attributes across four separate entities, all shared fields such as name, email, password_hash, status, and job_function are held once at the USER level and inherited downward, while each subtype is distinguished entirely by the relationships it participates in rather than by additional attributes of its own.

This specialization structure is what allows the diagram to represent the system's central business rule: two-tier proof validation. Rather than a single generic "validates" relationship attached to USER, three separate, explicitly labeled relationships connect PROOF_FILE to the specific subtypes authorized to review it OFFICE_HEAD validates proofs submitted by Staff within their own center, while DIRECTOR and SECRETARY validate proofs escalated from an Office Head, since an Office Head cannot approve their own submission. The same specialization pattern is applied consistently to every other role-restricted action in the system: account approval, training assignment, category management, partner institution management, budget allocation, and competency evaluation are each modeled as relationships owned by the specific subtype or subtypes empowered to perform them, rather than generalized to USER as a whole. Budget allocation illustrates this most explicitly: SECRETARY "Allocates" to OFFICE_BUDGET, DIRECTOR holds a separate, view-only "Views" relationship to the same entity, and OFFICE_HEAD independently "Distributes" her office's already-allocated budget among her own staff and events three distinct relationships modeling three distinct privilege levels over one entity. This includes the Evaluation group's own two-tier structure an Office Head rates the staff within their center, while the Director or Secretary rates the Office Heads mirroring the same escalation logic used for proof validation, and the Skills group's STAFF_SKILL relationship, which deliberately excludes DIRECTOR and SECRETARY, reflecting the system's scope decision that the Director and Secretary do not log personal training records or accumulate a staff skill profile of their own.

The remaining functional groups follow the same relationship pattern established for the core entities. TRAINING_RECORD is linked to CATEGORY and decomposed into TRAINING_RECORD_ROLE as a resolved many-to-many relationship, allowing a single training record to carry more than one participation role. CATEGORY is a generalized entity, distinguished by a category_type attribute (training, expense, evaluation, or skill), that consolidates what would otherwise require four separate, near-identical lookup entities; SKILL and EVALUATION each reference it the same way TRAINING_RECORD does. The Skills group connects SKILL to both STAFF_SKILL and EVENT_REQUIRED_SKILL, supporting both self-reported and training-derived competencies. The Partner Institutions group links PARTNER_AGREEMENT and CONTRIBUTION to PARTNER_INSTITUTION, with an additional "Implements" relationship to OFFICE identifying the specific SDU center that leads each partnership's implementation, independent of which entity is the legal MOU signatory. An Office Head may also create and edit PARTNER_INSTITUTION records where the office_id matches their own assigned office, reusing the same field that identifies each partnership's lead implementing office to enforce this scoping, rather than introducing a separate ownership attribute. The Budget group's OFFICE_BUDGET, FUNDING_SOURCE, and EVENT_EXPENSE entities track office-funded and partner-funded allocations as separate, non-commingled accounts, consistent with the SDU's existing budget-handling practice, with each EVENT_EXPENSE record requiring an associated receipt image. Together, this conceptual model with its explicit subtype specialization, verb-labeled relationships, and fully specified cardinality establishes the business-rule foundation from which the physical relational schema in Section 3.4.1 is subsequently derived.

### 3.3.3 Logic Models (pseudocode)

The logic models presented in this section describe the decision-making and data processing behavior of the SDU-ISCBMS across its five core processes. Each pseudocode block represents the logical flow of operations from input to processing to output, detailing how the system handles different conditions and scenarios in alignment with the process models established in Section 3.3.1 and the data model established in Section 3.3.2.

A. Account Management Logic

[Figure 3.3.3.1: Pseudocode Account Management Logic]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): An image showing several blocks of code detailing logic for Account Management, including functions like "User Registration", "Login Validation", and "Account Approval". 

B. Training Management Logic

[Figure 3.3.3.2: Pseudocode Training Management Logic]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): An image showing several blocks of code detailing logic for Training Management, including functions for training input, handling participation roles, and assigning trainings.

C. Proof Validation Logic

[Figure 3.3.3.3: Pseudocode Proof Validation Logic]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): An image showing several blocks of code detailing logic for Proof Validation, handling routing of proof files depending on whether a staff or an office head submits them, and marking statuses.

D. Monitoring and Analytics Logic

[Figure 3.3.3.4: Monitoring and Analytics Logic]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): An image showing several blocks of code detailing logic for Monitoring and Analytics, focusing on dashboard data retrieval and training gap analysis.

E. Communication and Reporting Logic

[Figure 3.3.3.5: Communication and Reporting Logic]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): An image showing several blocks of code detailing logic for Communication and Reporting, with loops for dispatching notifications and formatting report queries.

F. Training Category Management Logic

[Figure 3.3.3.6: Training Category Management Logic]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): An image showing several blocks of code detailing logic for Training Category Management, handling CRUD operations for categories.

G. Skills Tracking and Matching Logic

[Figure 3.3.3.7: Skills Tracking and Matching Logic]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): An image showing several blocks of code detailing logic for Skills Tracking and Matching, including searching staff by required skills.

H. Partner Institution Management Logic

[Figure 3.3.3.8: Partner Institution Management Logic]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): An image showing several blocks of code detailing logic for Partner Institution Management, covering partner record CRUD, agreements, and contributions.

I. Evaluation Logic

[Figure 3.3.3.9: Partner Institution Management Logic]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): An image showing several blocks of code detailing logic for Evaluation (despite the mislabeled caption in the original document), covering post-training rating input and retrieval.

J. Budget Management Logic

[Figure 3.3.3.10: Budget Management Logic]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): An image showing several blocks of code detailing logic for Budget Management, managing allocations, tracking expenses, and triggering overspend alerts.

These ten pseudocode blocks collectively represent the complete logical behavior of the SDU-ISCBMS across all core processes. Each pseudocode aligns directly with the Level 0 and Level 1 Data Flow Diagrams presented in Section 3.3.1 and the relational data model presented in Section 3.3.2, providing a coherent and implementation-ready blueprint for the system's development phase.

## 3.4 Design

The design phase of the SDU-ISCBMS translates the requirements and process models established in the preceding sections into a concrete structural blueprint that governs how the system will be built, how data will be organized, and how users will interact with the platform. This section presents four interconnected design components that together ensure the system meets all identified functional, security, and technical requirements of the Social Development Unit. The database design establishes the relational data model that defines how all organizational data is stored, structured, and accessed across nineteen normalized tables. The user interface design presents the planned layout and interaction structure of the system across all four user roles Unit Director, Secretary, Office Head, and Staff that can help us make sure that the interface is intuitive, role-appropriate, and accessible through standard web browsers. The report design details the types of on-screen and exportable reports the system will generate to support administrative decision-making and bi-yearly compliance reporting. Finally, the integrity controls define the validation rules, database constraints, and output safeguards embedded across the interface, application logic, and database layers to ensure that all data entering, residing in, and leaving the system remains accurate, consistent, and secure throughout the system's operation.

### 3.4.1 Database Design

[Figure 3.4.1: RDM of SDU ISCBMS]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): A Relational Database Model diagram showing interconnected tables with primary and foreign keys. The tables are: offices, users, categories, skills, partner_institutions, office_budgets, training_records, notifications, assignments, staff_skills, partner_agreements, contributions, reports, training_record_roles, proof_files, event_required_skills, evaluations, funding_sources, event_expenses.

As shown in Figure 3.4.1, the SDU-ISCBMS database is structured around nineteen interrelated tables, each with a single clearly defined responsibility, with all cross-table relationships enforced through foreign key constraints to maintain referential integrity. The offices table anchors all center-scoped data, storing the six SDU centers and the SDU itself, referenced by users, reports, and office_budgets. The users table consolidates all four user types into one entity, differentiated by a role field, with office_id linking each user to their center and status defaulting to Pending until approved by the Director or Secretary.

The categories table is a single, generalized reference list, distinguished by a category_type field (training, expense, evaluation, or skill), replacing what would otherwise require four separate lookup tables, and managed directly by the Director or Secretary. training_records, assignments, skills, evaluations, and event_expenses each reference it through their own category_id, so any category renamed, merged, or deactivated propagates consistently across every dependent module. training_records stores all submitted training activities, linked to the submitting user and category. Since a single record may involve more than one participation role, roles are resolved into a separate training_record_roles table rather than a flat field. proof_files depends on training_records, storing supporting documents and validation status, a record's completion_status updates only once its proof is validated, never from a passed deadline alone, and only after a one-week grace period does an unvalidated record become Overdue. assignments records training tasks via two foreign keys to users, assigned_by and assigned_to, reflecting that the Director, Secretary, or an Office Head assigning to her own staff may create one. notifications follow the same dual-FK pattern for messaging across all roles. reports links to both the generating user and the scoped office. skills connects to staff via staff_skills and to training records via event_required_skills, resolving both many-to-many relationships. partner_institutions stores external partners, with partner_agreements and contributions as dependents tracking MOU documentation and logged contributions; an office_id and signed_by field distinguish a partnership's lead implementing office from its legal signatory. evaluations records post-training ratings, mirroring the same two-tier structure as proof validation: an Office Head rates her own staff, while the Director or Secretary rates Office Heads.

office_budgets, funding_sources, and event_expenses track allocation, partner co-funding, and itemized expenditure as separate, non-commingled accounts. Only the Secretary may allocate to office_budgets; the Director holds view-only access, and an Office Head may further distribute her office's allocation among her own staff and events. Each event_expenses entry requires a receipt_file, and a nullable partner_id in funding_sources distinguishes office-funded events from partner-co-funded ones. The database follows Third Normal Form: every attribute depends only on its own table's primary key, with no transitive dependencies, and no data is duplicated across tables. This nineteen-table structure supports all eight functional module groups: offices, users, and categories for Access and Account Management; training_records, training_record_roles, proof_files, and assignments for Training Management and Monitoring; notifications and reports for Communication; skills, staff_skills, and event_required_skills for Skills Tracking; partner_institutions, partner_agreements, and contributions for Partner Institution Management; evaluations for Evaluation; and office_budgets, funding_sources, and event_expenses for Budget Management. Indexed keys support query performance at scale, and the consolidated category structure allows new offices, categories, or skill classifications to be added without restructuring the core schema.

### 3.4.2 User Interface

The SDU-ISCBMS user interface was designed with a focus on clarity, consistency, and role-appropriate accessibility across all four user levels of the Social Development Unit. The system adopts a unified dark navy blue sidebar navigation with a clean white content area, ensuring visual consistency throughout all pages regardless of the user's assigned role. The interface dynamically adapts its navigation structure and accessible modules based on the authenticated user's role, presenting only the functions relevant to their organizational responsibilities. All pages are fully responsive and accessible through standard web browsers without requiring any additional software installation.

[Figure 3.5.1: Login and Registration Page]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Screenshot of the SDU-ISCBMS login page. Features a background image of the Ateneo de Zamboanga University campus. Centered is a white login card with the university and SDU logos, "SOCIAL DEVELOPMENT UNIT", Email and Password input fields, a "Login" button, and a link reading "Don't have an account? Register here".

[Figure 3.5.2: Unit Director / Secretary Central Monitoring Dashboard]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Screenshot of the Director Dashboard. Dark blue sidebar with navigation items. Main white area displays widgets: "Budget ≥80% spent (2)", "Pending Accounts (2)", "Pending Proofs (1)", "Upcoming Trainings (6)", "Agreements Expiring soon (3)". Includes a "Training Role Breakdown" multi-colored bar chart, a "Needs Attention" panel listing events with high budget utilization, and staff count boxes for SDU, ACCA, ACES, ACLG, APC, CCES, and ALTEC.

[Figure 3.5.3: Training Assignment Board]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Screenshot showing two views of the "Training Assignments" page. Top shows the "Assign Training" form with inputs for Training Name, Description, Category, Deadline, Nature, Scope, Venue, and Required Skills checkboxes. Bottom shows the "Assigned offices & staff" section to select offices (SDU, ACCA, ACES, etc.) and specific staff members, with a search bar and list of staff with past training counts. A green "Assign Training Task" button is at the bottom.

[Figure 3.5.4: Proof Review Interface]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Screenshot of the "Review" page for validating proofs. Top section "Review training proofs" shows a pending submission list with staff name, joined event, office, date, proofs count, and buttons for "View details", "Accept", "Reject". Bottom section "Staff training proof history" shows a table of recent decisions with columns for When, Staff, Training/Event, Office, Status (e.g., REJECTED, ACCEPTED), and Notes.

[Figure 3.5.5: Office Budget Management Page]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Two screenshots of the "Office Budget" page. Top shows cards for each center (ACCA, ACES, ACLG, APC, CCES, ALTEC, SDU) displaying Allocated, Spent, and Remaining values with colored progress bars (some red indicating over 80% spent). Bottom shows a drill-down detail view for an event ("Leadership for Multi-Center Teams"), displaying Office Allocated, Partner Contributed, Spent, Remaining, and tables for "Funding sources" and "Logged expenses".

[Figure 3.5.6: Partner Institutions Page]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Two screenshots of the "Partner Organizations" page. Top shows the directory list with columns for Organization, Type, Contact, MOU File, Expiry, and Action (View/Edit buttons). Bottom shows a detail view for a specific partner ("Zamboanga City Disaster Risk Reduction Office") listing contact details, agreement expiry, and a "Contribution breakdown" table with periods, trainings, staff reached, and in-kind value.

[Figure 3.5.7: Rate Office Heads / Evaluation Interface]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Screenshot of the "Rate Office Heads" page. Left panel "Office Head directory" lists names, offices, and ratings with a "Rate" button for each. Right panel "Rate competency" shows a form to select a Completed training, a Skill, a Rating (1-5), and an optional Comment, followed by a "Save rating" button.

[Figure 3.5.8: Category Management Interface]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Two screenshots of Category Management. Top shows "Training Categories" with a list of names (e.g., Community Organizing) and "Rename" / "Deactivate" buttons. Bottom shows "Skill Categories" with a similar list and management buttons. Both panels have a "New category name" input field at the top.

[Figure 3.5.9: Office Head Dashboard]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Screenshot of the Office Head Dashboard (specifically for ACCA). Similar to the Director dashboard but scoped down. Shows widgets: Pending Accounts, Pending Proofs, Upcoming Trainings, Total ACCA Staff. Includes Training Role Breakdown chart, Needs Attention panel, and an "ACCA Staff Records" table listing staff and counts of trainings facilitated, participated, organized, and spoken at.

[Figure 3.5.10: Staff Dashboard]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Screenshot of the Staff Dashboard. Shows widgets for Upcoming Trainings, Incoming Trainings, View My Skills, Assigned Event Budgets, Participating Events, Facilitating Events, Organizing Events, Speaking Events. Also includes a Training Breakdown bar chart, a Needs Attention panel, and a Training Category Coverage panel indicating if specific competency areas are covered or have no training yet.

Login and Registration Page
The system's entry point consists of a login form and a registration form, both presented over a full-screen background image of the Ateneo de Zamboanga University campus. The login form requires the user's registered institutional email address and password, while the registration form collects the user's full name, institutional email, password, job function, and assigned office. New accounts submitted through the registration form are placed in a pending status and are only activated upon explicit approval by the Unit Director or Secretary, enforcing the system's account approval workflow.

Unit Director and Secretary Interface
The Unit Director and Secretary interfaces provide administrative oversight across all SDU operations, organized across the main navigation modules: Dashboard, Directories, Training Management, Proof Review, Budget Management, Partner Institutions, Evaluations, Reports, and Profile. The Secretary maintains its own landing dashboard, distinct from the Director's, while sharing the same management pages for continuity of approvals during the Director's absence.

*   Central Monitoring Dashboard: Displays real-time summary counters for pending accounts, escalated proof validations, active budgets, and upcoming training assignments. The dashboard includes a Training Role Breakdown panel with filter controls for office and category, a color-coded participation distribution bar, a Needs Attention panel that surfaces automated competency gap alerts, and a staff count grid displaying the total number of personnel per SDU center. Interactive modals allow instant review of pending account registrations, proof validations, and scheduled training events.
*   Directories & User Management: Presents a complete staff directory categorized by office, displaying each member's training records, acquired competencies, and assigned roles. Administrators can manage training, expense, and skill categories through a shared category management interface, approve or deactivate user accounts, and view drill down center performance.
*   Training Management & Proof Review: Features an Assignment Board to dispatch training directives to specific centers or personnel, alongside a Review panel consolidating all escalated proof submissions requiring Unit level approval. An assignment remains Pending until its proof is validated, and is only marked Overdue after a one week grace period past its deadline.
*   Budget & Partner Management: Provides interfaces for the Secretary to allocate annual office budgets, with the Director retaining view only access to allocation records; logging itemized event expenses with a required receipt image; and tracking external partner institutions, their formal Memoranda of Understanding (MOUs), lead implementing office designation, and incoming financial or resource contributions.
*   Evaluations & Communication: Facilitates post-training evaluations for Office Heads on a 1 to 5 scale with corresponding qualitative labels, allows the Director or Secretary to manage evaluation categories, hosts threaded messaging and inbox functions, and provides broadcast notification controls to dispatch unit wide announcements.
*   Reports: Features automated generation and export tools for cross center compliance, budget utilization, and competency assessment reports.

Office Head Interface
The Office Head's interface is scoped strictly to center level governance and personal professional development, organized across: Dashboard, Center Directory, My Trainings, Proof Validations, Evaluations, Center Budget, Reports, and Profile.

*   Office Head Dashboard: Mirrors the executive dashboard layout but restricts all metrics to the Office Head's specific assigned center. It tracks pending staff proofs, upcoming center trainings, staff competency coverage, and role distribution alerts.
*   Staff Management & Proof Validation: Enables the Office Head to review staff directory profiles, track acquired skills, and execute first tier validation or rejection (with feedback notes) on proof files submitted by their center's staff.
*   My Trainings & Assignments: Provides personal tracking tabs for encoding the Office Head's own training activities, uploading proof documents (which are automatically routed upward for Director or Secretary validation), assigning trainings directly to their own center's staff, and managing received assignments.
*   Evaluations & Budget Tracking: Hosts the center level evaluation interface where the Office Head rates staff post-training competencies, alongside a center expense logging module linked to their allocated office budget, from which the Office Head may further sub-distribute funds among her own staff and events.
*   Communication & Reports: Manages center level message threads with staff and leadership, and generates center specific training compliance and attendance reports.

Staff Interface
The Staff interface focuses on personal capacity development, organized across: Dashboard, My Trainings, Skills Portfolio, Reports, and Profile.

*   Staff Dashboard: Provides a personalized overview of training milestones, active assignments, competency category coverage progress, and automated notifications regarding proof approval statuses or new directives.
*   My Trainings: Houses a multi tab workspace where staff members submit new training records via an encoding modal (capturing training details, category, scope, and specific participation roles), upload supporting proof documents, view validation feedback, and log event associated expenses with a required receipt image.
*   Skills Portfolio: Displays verified competencies acquired through validated trainings alongside evaluated performance ratings across competency dimensions.
*   Communication & Personal Reports: Displays message threads and inbox with the Office Head and Unit leadership, and generates personal training participation and compliance transcripts for appraisal purposes.

### 3.4.3 Report Design

The SDU-ISCBMS generates two categories of reports to support decision-making and operational needs across all four user levels, the Data Export Reports, which allow users to extract and print filtered staff, training, and budget data for administrative and compliance purposes, and Action History Reports, which serve as the system's audit trail by logging all key system interactions performed by each user type. All reports are generated directly from live database records through D7 Reports, ensuring that all displayed and exported information reflects the most current state of the system at the time of generation. Reports are accessible through each user's dedicated Reports page and through export controls embedded within relevant system pages, and are delivered in CSV format or as structured printable files.

[Figure 3.4.3.1: Sample Printable/Exportable File (Training Category Data)]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): An image showing a printed report with the header "Ateneo de Zamboanga University", "Social Development Unit - ISCMS". The table has columns for Category (e.g., Community Organizing, Project Management), Covered Staff, Total Staff, Coverage (%), and Status (Covered, Low coverage).

A. Data Export Reports
Data Export Reports are filterable, on-demand reports that allow users to extract organized subsets of staff, training, and budget data from the system for operational review, administrative documentation, and bi-yearly compliance reporting to university management. These reports are not confined to a single Reports page but are accessible through export and print controls embedded directly within the relevant pages of each user's interface.

A.1 Training Records Export Report

[Figure 3.4.3.A1: Staff Training Records Export Sheet]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): An image showing a wide printed table report with the Ateneo de Zamboanga University header. The table lists training records with columns for Name, Office, Group, Training Title, Role, Category, Date, Scope, Nature, and Venue.

The Training Records Export Report is available to all four user types and extracts detailed training event data from the system's training management pages. For the Unit Director and Secretary, this report is accessible from the Directories page's Office Training Details table and from the Training Assignments page's Assignment Board, both of which support Print/Export controls. The training records export presents each staff member's training events with the following fields: Staff Name, Training/Event Name, Date, Role, Category, Nature, Scope, and Venue. The Unit Director and Secretary can filter this report by office, academic year, and training category before export, enabling targeted extraction of training data for specific centers or competency areas. For the Office Head, the Training Records Export is accessible from the My Trainings page and from the Directories page's staff detail view. The Office Head can filter by participation role, event category, and period, Full Year or by semester, before exporting, producing a center-scoped training record that reflects only the data within their assigned office, including trainings the Office Head has assigned directly to their own staff. For Staff members, the Training Records Export is accessible from the My Trainings page and presents the staff member's personal training history with fields for Training/Event Name, Date, Role, Category, Venue, Nature, Scope, and Proof File count. Staff members can filter their records by role, category, and nature before exporting, producing a personal training summary that can be used for individual compliance documentation. All training record exports draw directly from D3 Training Records and D5 Assignments and are delivered in CSV format.

A.2 Budget and Expense Export Report

[Figure 3.4.3.A3: Office Budget and Expense Export Sheet]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): An image showing a printed summary report for "Disaster Risk Reduction". It displays ALLOCATED (P48,000), SPENT (P38,500), and REMAINING (P9,500) values. Below are tables for "Funding sources" showing source, type, and amount, and "Logged expenses" showing description, logged by, date, and amount.

The Budget and Expense Export Report is available to the Secretary, Unit Director, and Office Head, extracting itemized funding and expense data per office or event. For the Secretary and Director, the report is accessible from the Office Budget page and presents allocation records, funding sources, and event-level spending across all centers; the Director's access to this report remains view-only, consistent with the Secretary's exclusive allocation privileges. For the Office Head, the same report is scoped to their assigned center's allocated budget, funded events, sub-distributed allocations, and logged expenses, including receipt references for each entry. All budget exports draw directly from D10 Budget and are delivered as CSV or printable files.

B. Action History / Audit Trail Reports
Action History Reports serve as the system's internal audit trail, automatically logging all key administrative and compliance actions performed by each user type with a corresponding timestamp, action category, and descriptive detail. These reports are non-editable, system-generated records that draw directly from D7 Reports and are presented chronologically within each user's Reports page.

B.1 Director and Secretary Action History Report

[Figure 3.4.3.B1: Director's and Secretary's Action History Report]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Screenshot of the Director's Reports page showing a "Report Action History" table. It lists Date, Time, Action (color-coded badges like APPROVED ACCOUNT, APPROVED PROOF, ASSIGNED TRAINING, EXPORTED REPORT), Details, and Performed By (Director).

The Director and Secretary Action History Report is the primary audit trail for all administrative decisions made system-wide. It is presented as a chronological table containing the following fields: Date, Time, Action, Details, and Performed By. The Action field uses color-coded badge labels to categorize each logged event, including Approved Account, Approved Proof, Assigned Training, Allocated Budget, Managed Category, and Exported Report, allowing the Unit Director and Secretary to quickly distinguish between action types. The Allocated Budget action is logged exclusively under the Secretary's account, reflecting that budget allocation is the one function not shared identically between the two roles. The Managed Category action covers training, expense, and skill category changes made through Account Administration, as well as evaluation category changes made through the Evaluation module. The Details column provides a plain-language description of each action, such as the name of the staff member whose account was approved or the training event whose proof was validated. The Performed By column attributes each action to the responsible user account. The report supports filtering by action type through a dropdown selector, enabling the Unit Director or Secretary to isolate specific action categories for focused review. The full log can be exported using the Export Bills control and cleared using the Clear Report Section control. This report directly fulfills the audit trail security requirement established in Section 3.2.3.

B.2 Office Head Action History Report

[Figure 3.4.3.B2: Office Head's Action History Report]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Screenshot of the Office Head Reports page showing a "Report Action History" table. It lists Date, Time, Action (badges like EXPORTED REPORT, REMOVED STAFF (DIRECTORY)), Details, and Performed By (an Office Head).

The Office Head Action History Report provides center-specific administrative logging for each Office Head, recording all actions performed from their office's pages separately from the Director's global report log. It shares the same tabular structure as the Director report, displaying Date, Time, Action, Details, and Performed By fields with color-coded action badges. Action types logged at the Office Head level include Assigned Training (Own Staff), Distributed Budget, Logged Expense, Exported Report, Removed Staff from Directory, Exported Staff Directory, and Exported Proof Report, reflecting the center-management functions of the Office Head role. All logged actions are scoped exclusively to the Office Head's assigned center, preventing cross-center data exposure at the reporting layer. The report supports file export and section-clearing controls identical to the Director and Secretary report.

B.3 Staff Activity Report

[Figure 3.4.3.B3: Staff's Action History Report]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): Screenshot of the Staff Reports page showing an "Action History" table. It lists Date, Time, Action (badges like TRAINING PARTICIPATION, PROOF SUBMITTED, PROFILE UPDATED, TRAINING COMPLETED), Details, and Status (badges like Completed, Pending, Approved).

The Staff Activity Report provides each staff member with a personal log of all system interactions they have performed, functioning as an individual accountability record for their own training and compliance history. It is presented as a chronological table containing Date, Time, Action, Details, and Status fields. Action types logged at the Staff level include Training Participated, Proof Submitted, Profile Updated, Training Completed, and Proof Approved, each accompanied by a plain-language description identifying the specific training event or system interaction involved.

The Status field uses color-coded badge labels, Completed, Pending, Overdue, and Approved, to indicate the resolution state of each logged action, allowing staff members to track their proof submissions and assignment completions without requiring direct communication with the Unit Director, Secretary, or Office Head. An assignment displays as Overdue only after passing the one-week grace period beyond its deadline without a validated proof. The report can be filtered by action type and exported as a file from the Staff Reports page.

### 3.4.4 Integrity Controls

The SDU-ISCBMS implements a comprehensive set of integrity controls distributed across three layers of the system, the user interface, the application logic, and the database, to make sure that all data entering, residing in, and leaving the system remains accurate, complete, consistent, and reliable throughout operations. These controls directly address the data integrity vulnerabilities identified in the SDU's previous manual workflow, where the absence of schema enforcement, validation rules, and access restrictions allowed silent formatting breaks, duplicate entries, and typographic errors to compromise institutional records.

A. Input Integrity Controls
Input integrity controls are enforced at both the user interface layer and the application logic layer to ensure that all data submitted to the system is valid, complete, and properly formatted before it is processed or stored in the database.
*   Required Field Validation: All data entry forms in the system enforce mandatory field checks at the interface level. In the Training Submission form, the fields for Training Title, Venue, Start Date, End Date, Nature, Scope, Category, and at least one Participation Role are all required before submission is permitted. In the Registration form, Full Name, Institutional Email, Password, Job Function, and Assigned Office are mandatory. In the Training Assignment form, Training Name, Category, Deadline, Nature, Scope, and at least one assigned recipient are required, regardless of whether the assignment is created by the Unit Director, Secretary, or by an Office Head assigning training to their own staff. In the Post-Training Evaluation form, the rating score, associated skill, and evaluation category are mandatory. In the Expense Logging form, the amount, description, expense category, and a receipt image are all mandatory. Forms cannot be submitted with any required field left blank, and the interface displays inline error indicators identifying the specific fields that need to be completed before submission can proceed.
*   Format and Boundary Validation: All date fields throughout the system enforce a standardized date format and validate that an event's end date is not set earlier than its start date. Email fields on the Registration and Login forms validate that the entered value conforms to a standard institutional email format. Password fields enforce minimum length and complexity requirements during registration and account updates to maintain credential security. File upload fields on the Proof Upload and Expense Receipt forms restrict accepted file types to PDF, PNG, and JPG only, with a maximum file size of 10 MB per file, preventing the submission of unsupported or oversized attachments. Post-training evaluation inputs are restricted to numerical ratings between 1 and 5, while financial fields across office budgets, funding allocations, and expense logs reject negative numerical values, and an Office Head's budget sub-distribution is additionally validated against her office's remaining already-allocated balance to prevent over-distribution.
*   Duplication Prevention: The system enforces a unique constraint on the email address field at the application logic layer, preventing the registration of multiple accounts under the same institutional email address. If a user attempts to register with an email address already associated with an existing account, the system returns a validation error and prevents duplicate record creation. Training records submitted by the same user for the same training event on identical dates are flagged at the application layer to alert the user of a potential duplicate entry before the record is committed.
*   Dropdown and Enumerated Field Controls: Fields for Nature, Scope, Category, Participation Role, and Office are implemented as controlled dropdown selectors, checkbox groups, or database lookups rather than free text inputs, restricting all entries to a predefined set of valid values. The Category field is shared across training, expense, evaluation, and skill classification, drawing from the same admin managed reference list in each case. This eliminates naming variances (such as entering "Community Program" versus "Communities Program") that cause sorting and filtering failures. No free text entry is permitted for any field that corresponds to a categorized or enumerated data attribute.
*   Account Approval and Proof Validation Gates: All newly registered accounts are placed in a Pending status upon submission and are not granted active system access until the Unit Director or Secretary explicitly approves the account through the Account Management interface. This input level gate prevents unauthorized or incorrectly configured user accounts from entering the active user pool. Furthermore, a training record's completion status cannot be manually marked complete or triggered by passed deadlines alone; it transitions to a completed state only after submitted proof files are reviewed and approved through the two tier validation workflow, and an unvalidated assignment is only marked Overdue after a one week grace period past its deadline. Expense entries are similarly gated: an expense log cannot be submitted without an attached receipt image, preventing incomplete financial records from entering the system.

B. Database Integrity Controls
Database integrity controls are enforced at the PostgreSQL data tier to maintain the accuracy, consistency, and reliability of all stored data regardless of the volume of concurrent users accessing the system.
*   Primary Key Constraints: Every table in the nineteen table SDU-ISCBMS database defines a unique primary key for each record. The offices table uses office_id, users uses user_id, categories uses category_id, training_records uses training_id, training_record_roles uses role_id, proof_files uses proof_id, assignments uses assignment_id, skills uses skill_id, staff_skills uses staff_skill_id, event_required_skills uses id, evaluations uses evaluation_id, partner_institutions uses partner_id, partner_agreements uses agreement_id, contributions uses contribution_id, office_budgets uses budget_id, funding_sources uses funding_id, event_expenses uses expense_id, notifications uses notification_id, and reports uses report_id. These primary key constraints ensure that every record in the system is uniquely identifiable and that no two records within the same table can share the same identifier.
*   Foreign Key Constraints and Referential Integrity: All relationships between tables are enforced through foreign key constraints that prevent orphaned or inconsistent records from persisting in the database. Administrative reference entities (offices, users, categories, skills, and partner_institutions) utilize ON DELETE RESTRICT rules to prevent the accidental deletion of parent records tied to active historical logs. Because the categories table is referenced by five dependent tables, training_records, assignments, skills, evaluations, and event_expenses, this restriction is especially significant: a category cannot be deleted while any record still references it, and must instead be deactivated through the category_type-scoped management interface, preserving the historical accuracy of every record that cites it. Dependent transactional entities (training_record_roles, proof_files, event_expenses, and contributions) enforce ON DELETE CASCADE rules when a parent training or partner record is formally purged. This ensures that no training record can exist without an associated user and category, and no proof document or expense can exist without a corresponding training event.
*   Schema Enforcement and Data Type Constraints: Every column in all nineteen tables is defined with an explicit data type, length limit, and nullability requirement (NOT NULL). Date columns accept only valid calendar dates, numerical budget columns enforce decimal precision (DECIMAL(12,2)), and enumerated columns, including the categories table's category_type field, accept only values within their predefined set. These schema level constraints eliminate type mismatches and unstructured entries across the database.
*   ACID Transaction Properties: All database operations in the SDU-ISCBMS are executed within an ACID compliant transaction framework. Atomicity ensures that multi step operations, such as committing a training record alongside its multiple participation roles, required skills, and proof files, or an Office Head's sub-distribution of budget across multiple staff and events in a single action, either complete fully or rollback entirely, leaving no partial writes in the database. Consistency guarantees that every committed transaction transitions the database from one valid state to another. Isolation ensures that concurrent submissions executed by staff and office heads across different centers do not interfere with one another. Durability guarantees that all committed records and uploaded proof metadata remain permanently stored even during sudden system interruptions.
*   Default Values: Fields that represent system managed states are assigned default values at the database level to ensure that no record enters the system in an undefined state. The status field in the users table defaults to Pending upon account creation. The validation_status field in the training_records and proof_files tables defaults to Pending. The completion_status in training_records and assignments defaults to Incomplete and Pending respectively. The is_read flag in notifications defaults to false, and active_flag in categories defaults to true. These defaults ensure that all newly created records immediately reflect their correct operational state without relying solely on application layer assignment.

C. Output Integrity Controls
Output integrity controls ensure that all dashboards, reports, queries, and exported files presented to users accurately reflect the live state of the database and cannot be altered, misrepresented, or accessed by unauthorized users.
*   Live Database Query Generation: All dashboard outputs, filter query results, gap analysis computations, and report displays in the SDU-ISCBMS are generated directly from live database queries across the nineteen tables (users, training_records, evaluations, office_budgets, categories, etc.) at the time of the request rather than from cached or pre compiled static data. The executive monitoring dashboard, center level oversight panels, and staff dashboards query real time data at the moment each page is rendered, ensuring that displayed metrics are always current.
*   Role-Based Output Restriction: All query outputs and report data are filtered at the server side application logic layer according to the authenticated user's assigned role:
    Staff: Can only retrieve their personal training submissions, assigned directives, acquired competency portfolio, and personal notifications.
    Office Head: Can only retrieve records, staff profiles, proof files, and budget data scoped to their assigned center. Within budget, an Office Head may view and sub-distribute her office's already-allocated balance but cannot allocate from the university-wide pool or access another office's budget records, preventing unauthorized cross-center data exposure.
    Unit Director and Secretary: Authorized to execute system wide queries across all six centers and the SDU unit, accessing aggregate institutional reports, cross-center evaluations, and financial summaries. Within this shared access, budget allocation output is restricted to the Secretary; the Director's query results for allocation records are limited to view-only, consistent with the one asymmetry established in this otherwise identical access level.
*   Timestamped Reports and Action Logs: All generated reports, evaluation submissions, proof validations, and administrative decisions are automatically stamped with system generated timestamps (created_at / generation_timestamp) at the moment the transaction commits. Exported files reflect the exact date and time of generation, providing a traceable audit trail that prevents retrospective record tampering.
*   Export Validation: All CSV, PDF, and printable file exports are generated directly from the same live database queries that power on screen report displays, ensuring that exported files are identical to what the user viewed on screen. Active interface filters, such as office scope, academic period, participation role, and competency category, are carried directly into the export query, ensuring that exported files contain only the intentionally selected data subset without leaking out of scope records.
*   Error Handling and Validation Feedback: The system returns clear, specific error messages at the interface level when a submitted form fails validation, when a file upload exceeds permitted size/type restrictions, or when an operation violates database constraints. These messages identify the exact cause of the error and guide the user toward corrective action without exposing raw database exceptions or internal system architectures. All unhandled exceptions at the application layer are logged server side and presented to the user as sanitized, generic notifications, preventing the leakage of sensitive infrastructure details through error outputs.

### 3.4.5 Security Controls

The SDU-ISCBMS implements a multi-layered set of security controls designed to protect sensitive personnel data, training records, and proof documentation from unauthorized access, accidental modification, and data breaches. These controls are distributed across the authentication layer, the authorization layer, the data transmission layer, and the database layer, and are designed in compliance with the requirements of the Data Privacy Act of 2012 (Republic Act No. 10173) of the Philippines and the data governance expectations of the Ateneo de Zamboanga University as established in Section 3.2.3.

A. Authentication
User authentication in the SDU-ISCBMS is enforced through a credential based login system requiring a registered institutional email address and password. Passwords are never stored in plaintext upon registration, all passwords are processed through the Bcrypt hashing algorithm before being written to the users table in the PostgreSQL database. Bcrypt applies a computational cost factor to the hashing process, making brute force and rainbow table attacks computationally infeasible even in the event of a database breach. During login, the system retrieves the stored hash and uses bcrypt's comparison function to verify the submitted password without ever decrypting the stored value.

User sessions are managed entirely server side through Laravel's session management framework. Upon successful authentication, the system issues a server managed session token that persists only for the duration of the user's active browser session. Sessions are automatically invalidated upon explicit logout or after a defined period of inactivity, preventing unauthorized session reuse from unattended devices. A data privacy disclaimer is presented to all users upon registration and upon each system login, consistent with the requirements of Republic Act No. 10173.

B. Authorization and Role-Based Access Control
Access to all system modules, data records, and functional operations is governed by a Role Based Access Control (RBAC) mechanism enforced at two levels of the application stack. At the interface level, the navigation menu and accessible pages rendered to each authenticated user are dynamically determined by their assigned role, ensuring that users are never presented with controls or views outside their authorization scope. At the server level, all API routes and controller actions are protected by role specific authorization middleware that verifies the authenticated user's role before processing any request, ensuring that unauthorized data cannot be retrieved or modified even through direct URL manipulation or API calls.

The four authorization levels enforced by the system correspond directly to the four user types established in Section 3.2.1. The Unit Director and Secretary hold the highest access level, with system wide visibility into all staff records, training data, proof submissions, and reports across all six SDU centers, as well as shared authority over account approvals, proof validations, and training assignments. The one exception within this shared access level is budget allocation, which is restricted to the Secretary, with the Director retaining view only access to allocation records. Office Head hold a mid level access scope restricted to the staff, training records, and compliance data within their assigned center only, including the authority to assign training to their own staff and to sub-distribute their office's already-allocated budget among their staff and events, preventing cross center data exposure. Staff members hold the lowest access level, restricted exclusively to their own personal profile, training records, assigned tasks, and received notifications.

C. Data Transmission Security
All data transmitted between the client browser and the application server is encrypted using HTTPS (Hypertext Transfer Protocol Secure) enforced through a valid SSL/TLS certificate installed on the deployment server. HTTPS ensures that all form submissions, file uploads, login credentials, and API responses are encrypted in transit and cannot be intercepted or tampered with through man in the middle attacks. No sensitive data is transmitted over unencrypted HTTP connections. The deployment server is configured to redirect all HTTP requests to HTTPS automatically, ensuring that encrypted transmission is enforced regardless of how the user accesses the system URL.

D. Audit Trail
The system maintains a comprehensive audit trail through the reports table in the database, automatically logging all key administrative actions performed by each user type with a system generated timestamp, action category, and descriptive detail. Actions logged at the Director and Secretary level include account approvals and rejections, proof validations and rejections, training assignments, category management (training, expense, evaluation, and skill), and report exports; budget allocation actions are logged exclusively under the Secretary's account, reflecting the one asymmetry within their otherwise shared access. Actions logged at the Office Head level include staff directory modifications, training assignments to their own staff, budget sub-distributions, expense logging, center level report exports, and proof related actions. Actions logged at the Staff level include training record submissions, proof uploads, profile updates, expense logging, and assignment completions. All audit log entries are system generated and non-editable, ensuring that the action history cannot be falsified or selectively deleted by any user. This audit trail supports organizational accountability and provides a traceable record of all decision making within the system as required by the SDU's administrative governance expectations.

E. Data Backup and Recovery
To protect against data loss resulting from hardware failure, accidental deletion, or system interruption, the SDU-ISCBMS deployment environment is configured to perform regular automated database backups using PostgreSQL's built in pg_dump utility. Database snapshots are scheduled at defined intervals and stored in a separate backup directory on the deployment server, with older backups retained for a rolling period to allow point in time recovery. Uploaded proof files and expense receipt images stored in the server's file storage directory are included in the backup schedule alongside database records, ensuring that both structured data and file attachments are recoverable in the event of a system failure. In the event of data loss or corruption, the system can be restored from the most recent backup snapshot with minimal disruption to the SDU's operational continuity.

F. Additional Security Measures
Beyond the core controls described above, the SDU-ISCBMS implements several additional protective measures at the application layer. All user submitted input is sanitized and validated server side before being processed or written to the database, preventing SQL injection and cross site scripting (XSS) attacks from compromising the system through malicious form submissions. Laravel's built in CSRF (Cross-Site Request Forgery) protection is applied to all state changing form submissions, ensuring that requests cannot be forged from external sources. File uploads, including training proof and expense receipt images, are restricted to a defined set of accepted file types, PDF, PNG, and JPG, and are stored outside the web accessible public directory with server side access controls, preventing the execution of malicious scripts disguised as uploaded documents. These measures collectively ensure that the SDU-ISCBMS maintains a secure operating environment throughout its deployment and operational lifecycle.

## 3.5 Development

The development of the Social Development Unit Integrated Staff Capacity Building Management System will be carried out in accordance with the approved system design, following a structured and methodical process to ensure quality, scalability, and long-term maintainability.

The system will be developed using PHP as the primary server-side programming language due to its open-source nature, stability, and compatibility with modern web development frameworks. To further accelerate and standardize the development process, Laravel will be employed as the primary back-end framework. Laravel's robust ecosystem offers built-in features such as routing, authentication, database migration, and eloquent ORM, which significantly reduces development work while promoting clean and maintainable code architecture. On the front-end, the system will be structured using HTML as the foundational markup language, giving every page and interface element a clear structure. JavaScript will be incorporated to handle dynamic interactions and client-side functionality, making the system more responsive and engaging for users without requiring constant page reloads. For styling, CSS and Tailwind CSS will be used together as the primary design framework. Tailwind's utility-first approach makes it straightforward to build interfaces that are clean, consistent, fully responsive, and user-friendly for unit director, office head, and staff.

For data storage and management, the system will utilize PostgreSQL, a reliable and open-source relational database management system that will serve as the central data repository of the SDU-ISCBMS. PostgreSQL was chosen because it naturally fits the kind of structured, multi-user environment the SDU operates in, one where training records, user accounts, participation roles, proof submissions, and compliance data all need to stay accurate and consistent regardless of how many people are accessing the system at the same time. Its enforcement of schema constraints, foreign key relationships, and ACID (Atomicity, Consistency, Isolation, Durability) transaction properties ensures that the data integrity issues and inconsistencies found in the SDU's current Google Sheets-based workflow are effectively eliminated.

The project will adopt an Iterative development approach, which essentially means the system will be built progressively through a series of planned development cycles. Each cycle produces a working version of the system that can be tested, reviewed, and improved before moving forward. This approach was chosen because it allows the team to catch and address issues early, incorporate feedback from clients along the way, and steadily refine the system until it fully meets the intended requirements. Rather than waiting until everything is finished to find out what needs fixing, the iterative approach makes the development process more adaptive and responsive.

The development team follows consistent coding standards throughout the project. PHP files are organized using a modular folder structure separating controllers, models, views, and configuration files. Inline documentation is provided for all functions, database queries, and conditional logic blocks. Version control is managed using Git, with the code repository hosted on GitHub. All changes are committed with descriptive messages before merging into the main branch. This ensures that the codebase remains maintainable, traceable, and accessible for future enhancement or handover.

## 3.6 Testing

This section covers the Alpha and Beta Testing phases, which are designed to assess how well the Web-Based Social Development Unit Integrated Staff Capacity Building Management System performs in terms of functionality, dependability, ease of use, and overall preparedness for deployment. Through these testing phases, issues are identified and addressed at an early stage, ensuring that the system aligns with the genuine needs and expectations of its users in practical, real-world use.

Before Alpha Testing begins, the proponents will first conduct Unit Testing. In this phase, the developers will test each feature and function of the system one at a time to make sure that each one works correctly on its own. By focusing on individual components early on, any problems that arise can be identified and fixed right away, before all the parts are combined into one complete system. This phase is carried out solely by the developers. The objectives of this testing phase are to: first, to confirm that each module and function performs the task it was designed for; second, to detect and correct errors early in order to prevent bigger issues from occurring once the modules are integrated together; and third, to verify that the system properly handles validation, data processing, CRUD operations, and error handling.

[Figure 4.2.1: Test Case Sample]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): An image showing a template for a Test Case. It includes fields for Test Case ID, Created By, Priority, Tester's Name, Test Case Description, Reviewed By, Version, Date Tested, Test Case (Pass/Fail/Not Executed), Prerequisites, and Test Data.

Figure 4.2.1 shows a sample test case that the developers will use during the testing phase where the test case ID, created by, testing priority, test case description, reviewed by, version, tester’s name, date tested, test case status, prerequisites, test data, and test scenario are provided. This test case template will be used consistently across the unit, alpha, and beta testing phases of the SDU-ISCBMS.

[Figure 4.2.2: Test Scenario Sample]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): An image showing a template for a Test Scenario. It includes a Test Scenario description and a table with columns for Step #, Step Details, Expected Results, Actual Results, and Pass / Fail / Not executed / Suspended.

Figure 4.2.2 shows the test scenarios and actual results that the developers will use during the testing phase. The step number, step details, expected results, actual results, and pass or fail status are documented for each step. This template ensures clear tracking of test execution by comparing expected and actual results, helping to quickly identify and address any issues in order to improve the overall functionality of the SDU-ISCBMS.

### 3.6.1 Alpha Testing

Alpha Testing takes place within the development team itself, serving as an internal quality check before any external user gets access to the system. At this stage, the team carefully examines the system to uncover any remaining bugs, inconsistencies in how features behave, and errors in the overall workflow that may have slipped through during development. The goal is to make sure that the system is functioning well and is stable enough to withstand real-world testing conditions.

The primary goal of this phase is to verify that the system meets its design specifications and performs all critical operations accurately. The developers will test each feature based on prepared test cases and validation criteria.

*   Login, Logout, and Session Management: This part of the testing ensures that all four user roles (Unit Director, Secretary, Office Head, and Staff) can log in and out of the system securely and are redirected to their correct dashboards based on their assigned role. Login should complete within 2 to 3 seconds upon submission of valid credentials.
    Expected behaviors include:
    ● Correct role-based redirection after a successful login.
    ● A clear validation message when incorrect credentials are entered.
    ● Automatic session termination upon logout, preventing unauthorized access to protected pages.
    ● Denial of direct URL access to restricted modules when the user is not authenticated.

*   Account Registration and Approval Workflow: This test ensures that new accounts are correctly placed in a pending status upon registration and are only activated after explicit approval by the Unit Director or Secretary. The registration form should load within 1 to 2 seconds, and the data privacy disclaimer must be displayed before or during the registration process.
    Expected behaviors include:
    ● Successful creation of a pending account upon form submission, with a confirmation message appearing within 2 seconds.
    ● Denial of login for accounts that remain in pending status.
    ● Correct activation of the account once the Unit Director or Secretary approves it through the account management panel.
    ● Automatic notification dispatched to the user upon account approval.

*   Role-Based Access Control (RBAC): This test verifies that each user role is restricted to only the modules and data permitted for their position, both at the interface level and at the server route level. The Unit Director and Secretary should have system-wide access, Office Head should only see data within their assigned center, and Staff members should only access their own profile and training records.
    Expected behaviors include:
    ● Navigation menus that dynamically display only role-permitted modules for each user.
    ● An access denied response when a user attempts to reach a restricted URL directly.
    ● No cross-center data exposure for Office Head accounts.

*   Training Input Module: This test ensures that Staff and Office Head can successfully encode training records with all required fields, including training title, description, date, venue, nature, scope, category, required skills, and participation role. The training input form should load within 1 to 2 seconds, and a saved record should appear in the training list within 2 seconds of submission.
    Expected behaviors include:
    ● Clear validation messages for each required field left blank upon submission.
    ● Accurate saving of participation roles selected via checkboxes, including multiple roles such as Facilitator and Organizer simultaneously.
    ● Immediate appearance of the new record in the training list after saving.
    ● Correct display of all saved field values when the record is opened for review.

*   Training Assignment Module: This test verifies that the Unit Director can assign training tasks to Staff members and Office Head with specified deadlines, and that the system automatically dispatches a notification to the assigned user upon task creation. The assignment form should complete submission within 2 seconds.
    Expected behaviors include:
    ● Successful creation of a training assignment with the correct assignee and deadline saved.
    ● Automatic notification delivered to the assigned user immediately after task creation.
    ● Real-time display of the assignment and its completion status on the Central Monitoring Dashboard.
    ● Validation messages when required fields such as training name or deadline are left blank.

*   Proof Upload and Validation Module: This test ensures that Staff and Office Head can upload multiple proof files including images and PDF documents for a completed training record, and that the Unit Director and Secretary can validate or reject submitted proofs through the review queue. File uploads should complete within 3 to 5 seconds depending on file size.
    Expected behaviors include:
    ● Successful upload of multiple valid file types such as JPG, PNG, and PDF.
    ● Rejection of unsupported file types with a clear error message.
    ● Correct routing of submitted proofs to the Unit Director's review queue with a Pending Review status.
    ● Automatic notification sent to the submitting user upon validation or rejection of their proof.
    ● Appearance of a resubmission prompt when a proof is rejected.

*   Central Monitoring Dashboard: This test verifies that the Unit Director's dashboard accurately reflects real-time system-wide data, including training records, staff compliance status, and training completion rates across all SDU centers. The dashboard should load and display all data within 3 to 5 seconds.
    Expected behaviors include:
    ● Accurate aggregation of training records from all SDU centers into a single dashboard view.
    ● Correct calculation and display of training completion rates and staff compliance metrics.
    ● Immediate reflection of new training records on the dashboard upon addition by a staff member.
    ● Center-scoped data display for Office Head accounts, with no cross-center data exposure.

*   Training Gap Analysis: This test ensures that the gap analysis feature correctly identifies competency deficits by comparing required competencies against recorded training data, and accurately flags staff members with disproportionately high or low training participation. Results should generate within 3 to 5 seconds.
    Expected behaviors include:
    ● Correct identification and display of competency areas with no matching training records.
    ● Accurate flagging of staff members with zero or unusually high training participation over the selected period.
    ● Correct scoping of results when filtered by the first or second half of the academic year.

*   Filter Module: This test verifies that the Unit Director can filter all staff and training data by office, role, participation type, and time period, and that combined filters return accurate, correctly scoped results. Filter queries should return results within 1 to 2 seconds.
    Expected behaviors include:
    ● Accurate results when a single filter criterion is applied.
    ● Correct and consistent results when multiple filters are applied simultaneously.
    ● Complete restoration of all records when filters are cleared.

*   Communication Module: This test ensures that the Unit Director and Office Head can compose and send notifications to specific users or entire offices, and that system-triggered notifications for training assignments and proof rejections are automatically dispatched. Notifications should appear in the recipient's panel within 2 seconds of dispatch.
    Expected behaviors include:
    ● Successful delivery of manually composed notifications to the correct individual or group recipient.
    ● Automatic dispatch of notifications upon training assignment creation and proof rejection.
    ● Persistent read status for notifications marked as read by the recipient.

*   Data Export and Printing Module: This test verifies that the system correctly exports all training and staff records to CSV format and generates structured, print-ready reports. Export operations should complete within 3 to 5 seconds depending on data volume.
    Expected behaviors include:
    ● Complete and correctly structured CSV exports containing all required fields such as staff name, training title, date, nature, scope, participation role, and status.
    ● Correctly scoped CSV exports when a filter is applied before export.
    ● Clean and properly formatted print report layout with no missing data or misaligned columns.

*   Staff Dashboard: This test ensures that each Staff member's personal dashboard accurately displays their own training history, assigned tasks, proof validation statuses, and profile information, and that new training records can be initiated directly from the dashboard.
    Expected behaviors include:
    ● Accurate display of all training records submitted by the logged-in staff member.
    ● Correct display of assigned tasks with their deadlines and completion statuses.
    ● Accurate proof validation status labels such as Validated, Pending, or Rejected for each submitted proof.
    ● Successful opening of the training input form directly from the staff dashboard.

*   Delegated Administration & Role Permutation Test: This test verifies that the Secretary possesses system-wide administrative capabilities identical to the Unit Director, ensuring uninterrupted operational workflows during the Director's absence.
    Expected behaviors include:
    ● Successful execution of account approvals, proof validations, and budget allocations by a logged-in Secretary account.
    ● System audit logs accurately attributing administrative actions to the Secretary's specific account ID.
    ● Identical access to system-wide dashboards, reports, and notification dispatch tools as the Unit Director.

*   Skills Tracking & Matching Module: This test ensures that Staff members can encode and update their background skill profiles, and that the Unit Director and Office Head can perform skill searches and tagging to match staff members with appropriate training programs or external assignments. The search query should complete within 1 to 2 seconds.
    Expected behaviors include:
    ● Successful creation and updating of individual skill profiles by Staff members.
    ● Accurate tagging of required skill categories onto specific training programs by Office Heads and the Unit Director.
    ● Correct return of staff lists matching single or multi-tag skill query filters.

*   Partner Institution Management: This test verifies that the Unit Director and Secretary can create, edit, and archive partner institution records, agreement files (MOUs), and contribution logs, while Office Heads retain read-only access to the directory. Form submissions and file attachments should process within 2 to 3 seconds.
    Expected behaviors include:
    ● Successful uploading and linking of partnership agreement files (PDFs) to partner institution profiles.
    ● Read-only directory access for Office Head accounts, with write/edit controls strictly restricted.
    ● Immediate updates to partner activity and contribution logs upon saving new entries.

*   Evaluation Module: This test ensures that multi-vector performance evaluations can be conducted within the system, allowing the Unit Director to evaluate Office Heads, and Office Heads to evaluate Staff members. Rating submissions should process within 1 to 2 seconds.
    Expected behaviors include:
    ● Correct display of evaluation forms based on the evaluator-evaluated relationship (Director → Office Head; Office Head → Staff).
    ● Complete calculation and storage of evaluation ratings upon form submission.
    ● Prevention of self-evaluation or unauthorized cross-office evaluation submissions.
    ● Accurate aggregation of historical evaluation trends on staff profile panels.

*   Budget Management: This test verifies that the Unit Director can allocate office budgets and that Office Heads and Staff can log event-related budget expenses, maintaining an accurate, real-time remaining balance check. Expense log entries should update within 1 to 2 seconds.
    Expected behaviors include:
    ● Successful allocation and adjustment of office budget limits by the Unit Director/Secretary.
    ● Automatic deduction from available balances when event expense items are logged by an Office Head or Staff member.
    ● Immediate display of validation warnings or flags when an expense entry exceeds the remaining allocated budget balance.
    ● Accurate export of budget ledger summaries within the Data Export module.

| Criteria | Description | 5 - Excellent | 4 - Very Good | 3 - Satisfactory | 2 - Needs Improvement | 1 - Poor |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Access and Account Management | Tests user registration, login/logout, role-based access control, account approval workflow, and interface responsiveness across all three roles. | All authentication, RBAC, approval workflow, and interface functions work flawlessly with no errors across all roles and viewports. | All functions work correctly; minor UI inconsistencies or slight delay in approval workflow. | Core login and RBAC functions work; occasional role redirection or interface display issues. | Login works but RBAC or approval workflow malfunctions in some cases. | Authentication or access control does not function. |
| Training Management | Tests training input, participation role classification, assignment, proof upload and validation, and the staff personal dashboard. | All training modules save, classify, assign, and validate data correctly without error; dashboard automatically and immediately reflects submitted data. | All modules functional; minor delays in notification dispatch or dashboard refresh. | Core functions work; proof validation or participation role classification occasionally inconsistent. | Some modules are functional; proof upload or assignment notification unreliable. | Training management modules do not function. |
| Monitoring and Analytics | Tests the Central Monitoring Dashboard, Office Head oversight, training gap analysis, and filter module across all data scopes. | Dashboards accommodate real-time gap analysis correctly; flags all deficits; all filter combinations return precise results. | All monitoring functions are accurate; minor delay in dashboard refresh or filter query. | Dashboards and filters mostly work; gap analysis occasionally misses edge cases. | Dashboards load missing values or inaccurately; filters or gap analysis are partially non-functional. | Monitoring and analysis features do not function. |

Table 7: Alpha Testing Rubric for Social Development Unit Integrated Staff Capacity Building Management System

| Score range | Interpretation |
| :--- | :--- |
| 4.50 – 5.00 | Passed – System ready for beta testing |
| 3.50 – 4.49 | Minor revisions required |
| 2.50 – 3.49 | Major revisions needed before next phase |
| 1.00 – 2.49 | Failed – System not ready for beta testing |

Table 8: Scoring Scale for Alpha Testing

### 3.6.2 Beta Testing

Beta testing will be carried out with the participation of actual end-users such as SDU unit director, secretary, office head, and staff. This phase aims to gather structured, role-based feedback on the system's functionality, ease of use, and overall readiness before final deployment.

Beta Testing participants are selected from the SDU's active personnel representing all three user roles. The Unit Director and Secretary participates to evaluate the administrative modules including the Central Monitoring Dashboard, Training Assignment, Proof Validation, Gap Analysis, Filter, Notification, and Export modules. At least two Office Heads which are drawn from different SDU centers will participate to evaluate center-level oversight and training input functions. A minimum of three Staff members are selected to represent varying levels of digital literacy across the SDU's centers to participate to evaluate the training input, proof upload, staff dashboard, and notification modules. All participants are existing SDU personnel and are not members of the development team.

Each participant is given access to the system and is asked to complete a set of role-specific tasks such as registering an account, encoding a training record, uploading proof, or reviewing the monitoring dashboard without step-by-step guidance from the developers. Participants are observed during the testing session and their actions, hesitations, and errors are noted by the proponents.

Feedback is collected through three instruments: direct observation during the testing session, a structured rubric (Table 9) completed by each participant after the session, and a brief open-ended interview conducted after the rubric is completed. Interview responses are transcribed and organized by theme. All feedback is reviewed and categorized into critical issues requiring immediate resolution, moderate issues to be addressed before deployment, and minor suggestions to be noted for future development cycles.

Rubrics for Beta Testing

| Criteria | Description | 5 - Excellent | 4 - Very Good | 3 - Satisfactory | 2 - Needs Improvement | 1 - Poor |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Access and Account Management | Measures how easily Staff, Office Head, and the Unit Director can register, log in, and navigate the system based on their assigned role without developer assistance. | All users complete registration and login independently, understand the data privacy disclaimer, and navigate role-based menus without any guidance. | All users complete login and registration successfully with only minor confusion on role selection or menu item labels. | Most users log in successfully but some require brief guidance on the account registration workflow or role-based navigation. | Several users struggle to complete login, registration, or understanding their role-specific interface. | Users cannot complete login or registration independently. |
| Training Management | Measures how easily real users encode training records, upload proof, track assignments, and use the dashboard without step-by-step developer guidance. | All users complete training input, proof upload, assignment tracking, and dashboard navigation independently and without errors. | All functions are completed successfully with only minor uncertainty on participation role checkboxes or proof validation status tracking. | Most users complete core training tasks but some fields or workflow steps require brief guidance from the development team. | Several users are unable to complete training input or proof upload without direct assistance. | Users cannot use training management features independently. |
| Monitoring and Analytics | Measures how well the Unit Director and Office Head can navigate dashboards, apply filters, and interpret gap analysis results without developer explanation. | All users independently navigate all monitoring features, correctly interpret all dashboard metrics and filter results, and understand gap analysis outputs without any guidance. | All monitoring features are understood with only minor clarification needed on one dashboard metric or filter option. | Users generally understand the dashboards and basic filters, but gap analysis outputs or combined filter results require some explanation. | Users find the monitoring and analytics features confusing and frequently misinterpret dashboard metrics or filter results. | Users cannot navigate or interpret monitoring and analytics features independently. |
| Communication and Reporting | Measures how easily users send notifications, receive system alerts, and generate exports or printed reports without assistance. | All users send and receive notifications correctly, and export and print functions are completed independently without confusion. | Notifications and export functions are completed successfully with only minor confusion on locating the export options or sent notification history. | Core communication and export functions are completed, but some steps in the notification composition or export workflow require guidance. | Users can receive notifications but struggle to compose them or locate the data export and printing functions. | Users cannot use communication or reporting features independently. |

Table 9: Beta Testing Rubric for Social Development Unit Integrated Staff Capacity Building Management System

| Score range | Interpretation |
| :--- | :--- |
| 4.50 – 5.00 | Passed – System ready for beta testing |
| 3.50 – 4.49 | Minor revisions required |
| 2.50 – 3.49 | Major revisions needed before next phase |
| 1.00 – 2.49 | Failed – System not ready for beta testing |

Table 10: Scoring Scale for Beta Testing

## 4.3 Calendar of Activities

The Gantt Chart for the conduct of the entire project timeline is presented below.

[Figure 4.3: Gantt Chart]
> FIGURE DESCRIPTION (added by the converter, not part of the paper text): A Gantt Chart spread across columns for July, August, September, October, November, December, January, February, March, and April. It shows four phases: Concept Phase (Write Concept Paper in July), Proposal Phase (Adviser Approval in early August, Writing & submission of Proposal paper in late August, Proposal Defense in September/October), Development Phase (System Development and Testing from November through March), and Finalization (Final Defense & Paper Finalization in March/April).

This figure outlines the calendar of activities for implementing the proposed system from system proposal writing to final defense and presentation. It starts with a proposal paper and getting adviser approval, then moves to the writing and submission of the proposal. There would be a proposal defense during September 14 to October 31, 2026. When the proposal is accepted, the team then moves on to the development and testing stages of the proposed system, where each unit of the system will be simultaneously built and tested to ensure quality and that errors will be detected early on. Lastly, the project ends with the final defense and fixing and finalization of the capstone paper.

# REFERENCES

Acorn PLMS. (2026). 11 roles of a facilitator and skills you need to be one. https://acorn.works/blog/facilitator-roles-and-skills

Ahmed, A. (2026). The role of management information systems in organizational decision making. In Journal of Data Analysis and Critical Management, Journal of Data Analysis and Critical Management (Vols. 01–01) [Journal-article]. https://doi.org/10.64235/4pb2hn47

Bibi, N., Anwar, Z., & Rana, T. (2021). Expertise based skills management system to support resource allocation. PLOS ONE, 16(8), e0255928. https://doi.org/10.1371/journal.pone.0255928

Boxall, Peter & Purcell, John. (2003). Strategy and Human Resource Management. Industrial & Labor Relations Review. 57. https://doi.org/10.1108/00251740310479368

Bryan, T. K., Robichau, R. W., & L'Esperance, G. E. (2021). Conducting and utilizing evaluation for multiple accountabilities: A study of nonprofit evaluation capacities. Nonprofit Management and Leadership, 31(3), 547–569. https://doi.org/10.1002/nml.21505

Cardos, N. C., Empal, Z. K., Gabriel, C. E., & Prudente, R. S. (2025). Evaluating the impact of role-based access control and data privacy measures on user satisfaction and security compliance in the SEAIT OJT evaluation and feedback system. International Journal of Innovative Science and Research Technology, 10(5), 785–796. https://doi.org/10.38124/ijisrt/25may565

Chaudhari, D., Chavan, A., Ghunawat, K., & Naik, A. (2026). Patient record management system. International Research Journal of Engineering and Technology, 13(2), 89–96. https://www.irjet.net/archives/V13/i2/IRJET-V13I0216.pdf

Chitimbe, J. (n.d.). role of mis in planning. Scribd. https://www.scribd.com/document/657402163/role-of-mis-in-planning

Cornerstone OnDemand. (2025). Cornerstone learning management system. https://www.cornerstoneondemand.com/platform/learning-management-lms/

Cosmotech Philippines, Inc. (n.d.). Integra HRIS government edition. https://cosmotech.com.ph/hris-government/

D2L. (2025). Employee training tracker: Track learning progress effectively. https://www.d2l.com/blog/employee-training-tracker/

Edstellar. (n.d.). Key roles and responsibilities of a training facilitator. https://www.edstellar.com/blog/training-facilitator-role

Expiration Reminder. (2025). Why spreadsheets fail for training tracking. https://www.expirationreminder.net/blog/why-spreadsheets-fail-training-tracking

Faisal-E-Alam, M., & Islam, A. R. M. T. (2025). Exploring the hierarchical framework of the Kirkpatrick model in training evaluation from a developing country. Evaluation and Program Planning, 113, Article 102696. https://doi.org/10.1016/j.evalprogplan.2025.102696

Fernandez, V., & Gallardo-Gallardo, E. (2021). Tackling the HR digitalization challenge: Key factors and barriers to HR analytics adoption. Competitiveness Review, 31(1), 162–187. https://doi.org/10.1108/CR-12-2019-0163

Ferraiolo, D. F., & Kuhn, D. R. (1992). Role-based access controls [Conference paper]. 15th National Computer Security Conference. https://csrc.nist.gov/files/pubs/conference/1992/10/13/rolebased-access-controls/final/docs/ferraiolo-kuhn-92.pdf

FitGap. (2025). TalentLMS review. https://us.fitgap.com/products/000750/talentlms

Food and Agriculture Organization of the United Nations (FAO). (n.d.). Module I: Preparing for training and facilitating. https://www.fao.org/4/ad424e/ad424e02.htm

Hjelle, S., Vassilakopoulou, P., Mikalef, P., Engesmo, J., & Parmiggiani, E. (2024). Organizational decision making and analytics: An experimental study on dashboard visualizations. Information & Management, 61(6), 104011. https://doi.org/10.1016/j.im.2024.104011

HR Consulting Group. (2024). Top 5 HR & payroll challenges of nonprofits and how to overcome them. https://www.hr-consulting-group.com/hr-news/hr-and-payroll-challenges-of-nonprofit-organizations

HROne. (2025). How to eliminate HR spreadsheet errors forever with automated systems. https://hrone.cloud/blog/eliminate-hr-spreadsheet-errors-with-automated-systems

Management Information System. (2025, December 10). Cohesity. https://www.cohesity.com/glossary/management-information-system/

Marar, G. K. (n.d.). Evolution of Management Information Systems. Scribd. https://www.scribd.com/document/97440548/Mis

Mulchandani, P. (2026, June 17). What is capacity building? Meaning, importance, and its types. The 4th Wheel. https://www.the4thwheel.com/post/what-is-capacity-building

Musau, J. (2024). Digital transformation in non-profit organizations: Strategies, challenges, and successes. Advanced International Journal of Multidisciplinary Research. https://www.researchgate.net/publication/384667845

Nawaz, F., Ahmad, W., & Khushnood, M. (2022). Kirkpatrick model and training effectiveness: A meta-analysis 1982 to 2021. Business & Economic Review, 14(2), 35–56. https://imsciences.edu.pk/files/journals/vol14_2_2022/2-M.A-1220.pdf

National Council of Nonprofits. (2023). Capacity building. https://www.councilofnonprofits.org/running-nonprofit/governance-leadership/what-capacity-building

Noble, W. (2025, April 21). Database vs Spreadsheet: The differences between them and when to use each. Glide Blog. https://www.glideapps.com/blog/database-vs-spreadsheet

Noe, R. A., Hollenbeck, J. R., Gerhart, B., & Wright, P. M. (2023). Human resource management: Gaining a competitive advantage (13th ed.). McGraw-Hill Education. https://studylib.net/doc/27321485/human-resource-management--gaining-a-competitive-advantag...?p=5

Nursing Reports. (2024). An exploratory study of issues in training facilitators for online training in advance care planning: Mixed methods research. MDPI. https://pmc.ncbi.nlm.nih.gov/articles/PMC11036261/

Nyabuto, G. (2024). Client-server architecture, a review. International Journal of Advanced Science and Computer Applications. https://ijasca.org/index.php/ijasca/article/view/48/33

Okon, R., Odionu, C. S., & Bristol-Alagbariya, B. (2024). Integrating data-driven analytics into human resource management to improve decision-making and organizational effectiveness. Iconic Research and Engineering Journals, 8(6), 574–596. https://www.irejournals.com/paper-details/1706749

Poortman, C. L., Schildkamp, K., & Brown, C. (2026). Guest editorial: The role of facilitators in professional learning networks: Achieving valued network outcomes. Journal of Professional Capital and Community, 11(1), 1–11. https://doi.org/10.1108/JPCC-11-2025-0208

Rahman, M. A., Alam, M. S., & Mrida, M. S. H. (2025). How interactive dashboards improve managerial decision-making in operations management. American Journal of Advanced Technology and Engineering Solutions, 1(01), 122–146. https://doi.org/10.63125/cqm5jk84

Reza, M., & Sohrab, M. (2022). The role of dashboards in business decision making and performance management. ResearchGate. https://www.researchgate.net/publication/353307344_THE_ROLE_OF_DASHBOARDS_IN_BUSINESS_DECISION_MAKING_AND_PERFORMANCE_MANAGEMENT

Salehzadeh, R., & Ziaeian, M. (2024). Decision making in human resource management: A systematic review of the applications of analytic hierarchy process. Frontiers in Psychology, 15, Article 1400772. https://doi.org/10.3389/fpsyg.2024.1400772

Samad, A., & Ahmad, S. (2022). Linking organizational capacities with effectiveness: Financial management, leadership, staff management, operational, adaptive and strategic planning. Journal of Public Administration and Governance, 12(2).

Sankoh, A. S., Kamara, M. H., Sesay, A. B., & Conteh, E. (2026). Development and implementation of a web-based industrial placement management system for Milton Margai Technical University. International Journal of Computer Applications. https://www.ijcaonline.org/archives/volume187/number89/development-and-implementation-of-a-web-based-industrial-placement-management-system-for-milton-margai-technical-university/

Setyawati, E., & Hariri, H. (2021). Web-based management information system for services development: A literature review. International Journal of Current Science Research and Review, 4(3), 175–185. https://doi.org/10.47191/ijcsrr/V4-i3-05

Shen, J. (2020, April). Relational databases and SQL. kb.osu.edu. https://kb.osu.edu/bitstreams/b64ef3de-ce31-427e-a684-cbbe89d45ceb/download

Social Current. (2025). Social sector trends to watch in 2025. https://www.social-current.org/wp-content/uploads/2025/01/KIC_Trends-2025-Q1.pdf

Sprout Solutions. (2024). Sprout HR: The most trusted HRIS system in the Philippines. https://sprout.ph/product/hris/

Sri Kanna, S., Surya, C., & San Clinton, L. (2026). Smart HR management system: A database-driven approach for efficient human resource operations. International Journal for Multidisciplinary Research, 8(2), 1–10. https://www.ijfmr.com/papers/2026/2/75709.pdf

Taylor, L. A., Aveling, E.-L., Roberts, J., Bhuiya, N., Edmondson, A., & Singer, S. (2023). Building resilient partnerships: How businesses and nonprofits create the capacity for responsiveness. Frontiers in Health Services, 3, Article 1155941. https://doi.org/10.3389/frhs.2023.1155941

TimeOffCloud. (2024). Simplify PTO tracking with Time Off Cloud's PTO management software. https://www.timeoffcloud.com/software/tracker/pto-tracking/

Ulrich, D., & Dulebohn, J. H. (2015). Are we there yet? What's next for HR? Human Resource Management Review, 25(2), 188–204. https://doi.org/10.1016/j.hrmr.2015.01.004

UN-Habitat Capacity Development and Training Unit. (2020). Guide to deliver capacity-building using digital tools. United Nations Human Settlements Programme. https://unhabitat.org/guide-to-deliver-capacity-building-using-digital-tools

United Nations. (n.d.). Capacity-Building | United Nations. https://www.un.org/en/academic-impact/capacity-building

Zebua, D. K., Santosa, T. A., & Putra, F. D. (2024). The role of HR analytics in enhancing organizational performance: A review literature. Indonesia Journal of Engineering and Education Technology (IJEET), 2(2), 363–368. https://doi.org/10.61991/ijeet.v2i2.69

Zhang, J., & Chen, Z. (2024). Exploring human resource management digital transformation in the digital age. Journal of the Knowledge Economy, 15(1), 1482–1498. https://doi.org/10.1007/s13132-023-01214-y