# CHAPTER_3_CHANGES.md

Change log for `MD FILES/CHAPTER_3_V2.md` versus the defended `MD FILES/PAPER PROPOSAL BEFORE THE DEFENSE/chapter_3_to_references.md` (sections 3.1 and 3.2 only). Each entry lists the section, the old sentence/clause, and the new sentence/clause. Only the required changes were made; everything else was copied unchanged.

Note on system name: every occurrence of "SDU-ISCBMS" was changed to "SDU-STMS". These are not listed individually below except where the sentence also changed for another reason. Likewise, each "Director and Secretary" / "Director or Secretary" was reduced to "Director" / "Unit Director" and each "skills" catalog reference was changed to "competencies" (with knowledge called out separately).

---

## 3.1 Architectural Design

### Figure 3.1 caption
- Old: `[Figure 3.1: Three-Tier Client-Server Architecture Diagram of SDU-ISCBMS]`
- New: `[Figure 3.1: Three-Tier Client-Server Architecture Diagram of SDU-STMS]`

### Figure 3.1 description (converter block quote)
- Old: redirects arrow points to four boxes: UNIT DIRECTOR, OFFICE HEAD, SECRETARY, and STAFF.
- New: redirects arrow points to three boxes: UNIT DIRECTOR, OFFICE HEAD, and STAFF.
- Old (Tier 2): Account management (RBAC, login, approval), Gap tracking Competency mapping, Skills Tracking & Matching, Training input, Notification (Alerts - messages), Partner Institution Management, Training assignment (Director/Secretary or Office Head-own staff) task deadline proof-gated completion, Filter module, Evaluation, Category Management: CRUD training, expense & evaluation categories, Proof upload & two-tier validation, Reports and export (CSV - summary - print), Budget Management (allocation - sub-distribution expense logging w/ receipt - overspend alert).
- New (Tier 2): Account management (RBAC, login, approval), Competency and Knowledge Mapping, Training input, Notification (Alerts), Partner Institution Management, Training assignment (Director any office or Office Head-own staff) with certificate-upload completion, Filter module, Evaluation, Category Management: CRUD training, competency & knowledge categories, Certificate upload, Reports and export (CSV - summary - print).
- Old (Tier 3): Users, Training Record Roles (multi-role junction), Notifications & Reports, Evaluation, Offices, Assignments, Skills, Budget, Training records, Proof Files, Partner Institutions, Categories.
- New (Tier 3): Users, Training Record Roles (multi-role junction), Notifications & Reports, Evaluation, Offices, Assignments, Competencies, Knowledge, Training records, Certificates, Partner Institutions, Categories.

### 3.1, paragraph 1
- Old: client browsers used by the Unit Director, Secretary, Office Head, and Staff
- New: client browsers used by the Unit Director, Office Head, and Staff

### 3.1, paragraph 2
- Old: accessible to all four user levels through standard web browsers, no installation required
- New: accessible to all three user levels through standard web browsers, no installation required

### 3.1.1 Client Tier (Presentation Layer)
- Old: Office Head Oversight Dashboard (with a localized proof validation interface for center staff), the Secretary's Dashboard (mirroring the Unit Director's to preserve continuity during absence), and the Unit Director's Central Monitoring Dashboard.
- New: Office Head Oversight Dashboard (with a center-scoped staff competency directory), and the Unit Director's Central Monitoring Dashboard.
- Old: It also renders the system's expanded-scope interfaces: Skill Search, Partner Institution pages, the Budget dashboard, an Office Head budget sub-distribution view, the Evaluation rating form, and the Training, Expense, and Evaluation Category management interfaces available to the Unit Director and Secretary.
- New: It also renders the system's expanded-scope interfaces: the Find Staff by Competency search, the Staff Competency and Knowledge profile pages, Partner Institution pages, the evaluation interface for conducted trainings, and the Training, Competency, and Knowledge Category management interfaces available to the Unit Director.

### 3.1.2 Application Tier (Logic Layer)
- Old: training record encoding with two-tier proof validation routing
- New: training record encoding with certificate upload that completes an assignment without a review or approval step
- Old: training assignment logic by the Director/Secretary, or by an Office Head for their own staff with proof-gated completion status and a one-week grace period before a record is marked overdue
- New: training assignment logic by the Unit Director, or by an Office Head for her own staff, with an assignment marked Awaiting Certificate until a certificate is uploaded and Overdue once a week has passed beyond a passed deadline
- Old: notification dispatch; gap analysis; report generation and export; and category management (training, expense, evaluation) for the Director and Secretary.
- New: notification dispatch; report generation and export; and category management (training, competency, and knowledge) for the Unit Director.
- Old: It also handles skill-matching against event-required competencies; partner contribution and agreement-expiry tracking; budget allocation, an Office Head's sub-distribution of their office's allocated budget among staff and events, and overspend threshold calculation (alerting at 80 percent of an event's allocated budget); and evaluation score aggregation and trend computation.
- New: It also handles competency and knowledge matching against event-required tags; partner contribution and agreement-expiry tracking; and the recording and viewing of conducted-training evaluations.

### 3.1.3 Data Tier (Database Layer), paragraph 1
- Old: Files training proof, certificates, MOUs, and expense receipts (required per entry) are stored via Cloudinary, with the database retaining only file references and metadata.
- New: Files such as training certificates and partner MOUs (with agreement documents) are stored via Cloudinary, with the database retaining only file references and metadata.
- Old: This tier holds all training records, user profiles, multi-role participation mappings, proof references, notifications, and compliance data, alongside the expanded scope: staff skill profiles, partner institution and agreement metadata (including each partnership's lead implementing office), evaluation ratings, office budget and expense records, and Director/Secretary-managed category definitions across training, expense, and evaluation types.
- New: This tier holds all training records, user profiles, multi-role participation mappings, certificate references, notifications, and compliance data, alongside the expanded scope: staff competency and knowledge profiles, partner institution and agreement metadata (including each partnership's lead implementing office), conducted-training evaluations, and Unit Director-managed category definitions across training, competency, and knowledge types.

### 3.1.3 Data Tier, paragraph 2
- Old: this architecture's viability for SDU-ISCBMS's staff, training, and competency records
- New: this architecture's viability for SDU-STMS's staff, training, and competency records

---

## 3.2 Requirements Specification

### 3.2 introduction
- Old: describes the complete set of requirements for the SDU-ISCBMS.
- New: describes the complete set of requirements for the SDU-STMS.

### 3.2.1 Users and Characteristics, paragraph 1
- Old: designed for four user types ... corresponding to the four-level hierarchy established in Section 1.1.3.
- New: designed for three user types ... corresponding to the three-level hierarchy established in Section 1.1.3.

### 3.2.1 table (Table 3.2.1)
- Old (Unit Director row): Primary administrator; oversees training and capacity building across all centers, reviews budget allocations, and searches skill profiles for external matching
- New (Unit Director row): Primary administrator; approves accounts, manages catalogs, oversees training across all offices, assigns training in any office, evaluates conducted trainings, and searches staff competency profiles for assignment
- Old (Secretary row): Delegate administrator; assumes full Director-level access during the Director's absence, including budget allocation | Occasional; during Director's absence | Moderate | Highest; identical to the Director, except budget allocation, which is Secretary-exclusive
- New: row deleted.
- Old (Office Head row): approves staff proofs, inputs own training, assigns training to own staff, logs receipted expenses, sub-distributes her office's allocated budget, and rates staff competency.
- New (Office Head row): records own training, assigns training to own staff, finds own-office staff by competency, evaluates conducted trainings in the office, and adds and edits partner institution records associated with their own office
- Old (Office Head access level): Mid-level; restricted to her own center's records, budget, and evaluations
- New (Office Head access level): Mid-level; restricted to her own office's records, staff, assignments, evaluations, and partner records
- Old (Staff frequency): Periodic; records and proof upload per training
- New (Staff frequency): Periodic; records training and uploads certificates
- Old (Staff access level): Lowest; restricted to own profile, records, skills, and notifications
- New (Staff access level): Lowest; restricted to own profile, records, competencies and knowledge, and notifications
- Old caption: Table 3.2.1: SDU-ISCBMS Users and Characteristics
- New caption: Table 3.2.1: SDU-STMS Users and Characteristics

### 3.2.1 paragraph 2
- Old: The Unit Director holds the broadest access account approval, training assignment, monitoring, proof validation, gap analysis, and reporting while Office Head access is center-scoped and Staff access is limited to their own records. ... Office Head validates proofs from staff within their own center; their own proofs route instead to the Director or Secretary, since an Office Head cannot approve her own submission.
- New: The Unit Director holds the broadest access account approval, training assignment, monitoring, evaluation, and reporting while Office Head access is office-scoped and Staff access is limited to their own records. ... Office Head records evaluations for conducted trainings within her own office, while Staff can view the feedback recorded for their own conducted trainings.

### 3.2.1 paragraph 3
- Old: The Secretary holds access identical to the Director's, with one exception: budget allocation is Secretary-exclusive, with the Director retaining view-only access. Staff skill profiles auto-update upon completion of tagged trainings, and Staff may view their own evaluation ratings, but cannot initiate skill searches, allocate or sub-distribute budgets, or rate their own competency functions reserved for the Director, Secretary, and Office Head respectively.
- New: Staff competency and knowledge profiles auto-update upon completion of tagged trainings, and Staff may view feedback on their own conducted trainings, but cannot initiate competency searches, approve accounts, assign training, or record evaluations functions reserved for the Unit Director and Office Head respectively. Each account holds exactly one role, and only the Unit Director approves or rejects account registrations.

### 3.2.2 Software Functionalities, paragraph 1
- Old: composed of twenty-nine (29) functional modules ... organized into eight (8) functional groups ... Access and Account Management, Training Management, Monitoring and Analytics, Communication and Reporting, Skills Tracking and Matching, Partner Institution Management, Evaluation, and Budget Management.
- New: composed of twenty (20) functional modules ... organized into seven (7) functional groups ... Access and Account Management, Training Management, Monitoring and Analytics, Communication and Reporting, Competencies and Knowledge Tracking and Matching, Partner Institution Management, and Evaluation.

### 3.2.2 Group A: Access and Account Management
- Old: login/logout, and a Unit Director or Secretary-controlled account approval workflow.
- New: login/logout, and a Unit Director-controlled account approval workflow.
- Old: User-Friendly Interface: ... accommodating varying digital literacy across centers.
- New: User-Friendly Interface: ... accommodating varying digital literacy across offices.
- Old: Training and Expense Category Management: Allows the Unit Director and Secretary to create, edit, and deactivate training and expense category values used across the Training Input and Budget Management modules, replacing fixed lists with an extensible, admin-managed set.
- New: Catalog Management: Allows the Unit Director to create, rename, deactivate, and reactivate training, competency, and knowledge category values used across the Training Input, Tagging, and Assignment modules, replacing fixed lists with an extensible, admin-managed set.

### 3.2.2 Group B: Training Management
- Old: Training Assignment Module: Enables the Unit Director or Secretary to assign training tasks to Staff and Office Head, or an Office Head to assign training to her own staff. A record is marked "Completed" only once its proof is validated, and "Overdue" only after a grace period past a passed deadline or self-marked status alone does not constitute completion.
- New: Training Assignment Module: Enables the Unit Director to assign training tasks to Staff and Office Head in any office, or an Office Head to assign training to her own staff. A record moves to "Awaiting Certificate" once the assignee marks it done, and to "Completed" once a certificate is uploaded; it is "Overdue" once a week has passed beyond a passed deadline, and a self-marked status alone does not constitute completion.
- Old: Proof Upload and Validation Module: Allows Staff and Office Head to submit supporting files as proof of completion. Staff proofs route to their Office Head; Office Head proofs route to the Director or Secretary, since an Office Head cannot approve her own submission. Rejection triggers an automatic resubmission notice.
- New: Certificate Upload Module: Allows Staff and Office Head to upload a training certificate, with an optional note, to complete an assigned training. The upload completes the assignment directly, with no review or approval step.
- Old: Staff Dashboard: ... competency and knowledge profile ... track proof status.
- New: Staff Dashboard: ... competency and knowledge profile ... track assignment and certificate status.

### 3.2.2 Group C: Monitoring and Analytics
- Old: Central Monitoring Dashboard: Real-time, system-wide view of training records, compliance, completion rates, and capacity progress for the Director and Secretary.
- New: Central Monitoring Dashboard: Real-time, system-wide view of training records, completion rates, and competency coverage for the Unit Director.
- Old: Training Gap Analysis Feature: Automatically flags competency deficits and over/under-participation by comparing required competencies against recorded training data.
- New: bullet deleted.
- Old: Filter Module: ... Office Head query their center's records, and the Director/Secretary query system-wide ...
- New: Filter Module: ... Office Head query their office's records, and the Unit Director query system-wide ...

### 3.2.2 Group D: Communication and Reporting
- Old: Communication Module: Lets the Director, Secretary, and Office Head compose and send messages/alerts to staff, offices, or groups; Staff and Office Head receive notifications on assignments, rejections, and compliance updates.
- New: Notification Module: Lets the Unit Director send role-based announcements to staff, offices, or groups, and an Office Head send to the Unit Director or her own office staff; Staff and Office Head receive automatic notices on account decisions, assignments, certificate uploads, and partner expiry.
- Old: Data Export and Printing Module: Lets the Director and Secretary export records to CSV ...
- New: Data Export and Printing Module: Lets the Unit Director export records to CSV ...

### 3.2.2 Group E: Skills Tracking and Matching (heading and bullets)
- Old heading: Group E: Skills Tracking and Matching
- New heading: Group E: Competencies and Knowledge Tracking and Matching
- Old: Skill Tagging Module: Lets the Director, Secretary, or Office Head tag a training with the competencies it develops; completion auto-adds the skill to the staff member's profile.
- New: Competency and Knowledge Tagging Module: Lets the Unit Director or Office Head tag a training with the competencies and knowledge areas it develops; completion auto-adds them to the staff member's profile.
- Old: Staff Skill Profile: A searchable record combining auto-populated and manually entered skills.
- New: Staff Competency and Knowledge Profile: A searchable record combining auto-populated and manually entered competencies and knowledge areas.
- Old: Skill Search Function: Lets the Director and Secretary query staff by skill for external requests.
- New: Find Staff by Competency Function: Lets the Unit Director query staff across all offices, and an Office Head query own-office staff, by competency or knowledge area for training assignment.

### 3.2.2 Group F: Partner Institution Management
- Old: ... including the specific SDU office designated as lead implementer of each partnership. ... editable by the Director and Secretary system-wide, and by an Office Head for partnerships associated with their own office
- New: ... including the specific SDU office designated as lead implementing office of each partnership. ... editable by the Unit Director system-wide, and by an Office Head for partnerships whose lead implementing office is her own

### 3.2.2 Group G: Evaluation
- Old: Post-Training Skill Rating: Lets an Office Head rate a Staff member's competency, and the Director or Secretary rate an Office Head's competency, on a 1-5 scale per skill per completed training.
- New: Conducted-Training Evaluation: Lets the Unit Director evaluate any conducted training, and an Office Head evaluate conducted trainings in her own office, recording the participants who responded, a written feedback summary, optional per-role feedback, and an optional demonstration level. Feedback on a Staff member's own conducted trainings is viewable by that Staff member.
- Old: Rating Trend View: Displays a staff member's rating history over time.
- New: bullet deleted.
- Old: Evaluation Category Management: Lets the Director and Secretary create, edit, and deactivate evaluation categories used in the Post-Training Skill Rating module.
- New: bullet deleted.

### 3.2.2 Group H: Budget Management
- Old: entire group (Office Budget Allocation, Office Budget Sub-Distribution, Partner Funding Contribution, Expense Logging, Overspend Alert, Budget Report Export).
- New: group deleted.

### 3.2.3 Security Requirements
- Old: sensitive personnel data including staff profiles, training records, competency assessments, and proof of training documentation
- New: sensitive personnel data including staff profiles, training records, competency assessments, and training certificates
- Old: The Unit Director and Secretary are the only users with system-wide access, with the Secretary granted identical permissions to maintain continuity of approvals during the Director's absence. Office Head can only access data pertaining to staff within their assigned center ...
- New: The Unit Director is the only user with system-wide access. Office Head can only access data pertaining to staff within her assigned center ...
- Old: Budget Access Scoping: (entire bullet).
- New: bullet deleted.
- Old: Partner Institution Access Scoping: Partner institution records are editable by the Unit Director and Secretary system-wide, and by an Office Head only for partnerships associated with her own office.
- New: Partner Institution Access Scoping: Partner institution records are editable by the Unit Director system-wide, and by an Office Head only for partnerships whose lead implementing office is her own.
- Old: Account Approval Workflow: No user account is activated without explicit review and approval by the Unit Director or Secretary.
- New: Account Approval Workflow: No user account is activated without explicit review and approval by the Unit Director.
- Old: Audit Trail: ... including account approvals, proof validations, proof rejections, training assignments, and budget allocations ...
- New: Audit Trail: ... including account approvals and rejections, training assignments, certificate uploads, evaluations, and partner expiry notices ...

### 3.2.4 Technical Requirements
- Old: operation of the SDU-ISCBMS.
- New: operation of the SDU-STMS.
- Old (Storage row): 20 GB available disk space minimum for application files, database, and uploaded proof files
- New (Storage row): 20 GB available disk space minimum for application files, database, and uploaded certificate and agreement files
- Old (File and Media Storage row): Managed cloud storage through Cloudinary for training proof files, certificates, partner MOU/agreement documents, and expense receipts ...
- New (File and Media Storage row): Managed cloud storage through Cloudinary for training certificates and partner MOU/agreement documents ...
- All other 3.2.4 text (processor, memory, hosting, network, client requirements, development environment, closing paragraph) copied unchanged.

---

## Things I was unsure about

1. **Converter note line.** The defended file opens with `NOTE: This is the DEFENDED version of the paper...`. This is not paper text, and its statement ("still includes features that were later removed") is no longer true for V2, so I omitted it. If you want the meta-note carried over, say so.
2. **Converter figure description block.** The block quote labeled "not part of the paper text" was kept (to avoid shortening) but updated to three roles and to drop budget/proof-validation/messaging/expense. If that block is generated automatically elsewhere, it should probably be regenerated rather than hand-edited.
3. **Module and group counts.** Deleting the gap-analysis, rating-trend, evaluation-category, and all six budget modules, plus removing the budget group, changes 29 modules / 8 groups to 20 modules / 7 groups. I updated the stated numbers. If you intend to keep the "29/8" wording, that conflicts with the deletions.
4. **Group G now has one module.** The Evaluation group was reduced from three modules to one (Conducted-Training Evaluation). Retaining a group with a single module is legal but you may prefer to fold it into another group; the rules said not to add/remove groups, so I left it.
5. **Expense/evaluation "categories" vs catalogs.** I treated the removed "Training and Expense Category Management" and "Evaluation Category Management" as replaced by a single Catalog Management module covering training, competency, and knowledge. I did not add a separate module.
6. **"compliance" wording.** I left words like "compliance monitoring" and "compliance data" in place, since compliance was not on the removal list even though their original context (proof validation/budget) is gone.
7. **"proof" residue.** I converted "proof upload", "proof references", "proof status", and "proof files" to certificate terminology, but I kept the technical Development Environment row "server-side validation for accepted file types", which is file-type validation, not proof validation. Confirm that is acceptable.
8. **Six centers vs seven offices.** The defended text says "SDU's six centers" while the spec lists seven offices (SDU plus six). I did not change it because it was not on the change list, but the office lists elsewhere mention ACCA, ACES, ACLG, APC, CCES, ALTEC (no SDU in the Office Head list), which may need reconciling.
9. **Partner expiry wording.** The defended MOU bullet says "optional expiry date"; the spec makes expiry required. I left "optional" unchanged since it was not a listed change.
10. **"Gap analysis" as a dashboard/report term.** The removal rule targets "gap analysis as a module". I deleted the gap-analysis module bullet and the application-tier mention, but the word "needs-attention"/"capacity" style language in dashboards was left untouched; confirm no other gap-analysis phrasing should be removed.

---

# Change log for the appended Section 3.3 (Analysis)

Source of content: `MD FILES/CHAPTER_3_REVISED.md` (sections 3.3.1 and 3.3.2) and `MD FILES/PSEUDOCODE_DRAFT.md`. Defended `chapter_3_to_references.md` was used only for heading wording, figure-caption style, and narrative style. Every change from the source text is listed below as section / old / new. The source already used the name SDU-STMS, so no name change was needed in this part.

## 3.3 Analysis (new heading + intro)
- Old: no 3.3 in `CHAPTER_3_V2.md`; defended 3.3 states "The analysis phase serves as the diagnostic and translational core of the system development life cycle, where operational realities are systematically converted into technical software specifications. To establish an objective foundation for the Social Development Unit Integrated Staff Capacity Building Management System (SDU-ISCBMS), this section..."
- New: `## 3.3 Analysis` with an intro paragraph adapted to "the Social Development Unit Staff Training and Management System (SDU-STMS)" and kept in the defended narrative style. The defended "Current Process Evaluation and Operational Pain Points" list and the converter figure-description block quotes were not carried over, because the instructed content source was Revised 3.3.1/3.3.2 and PSEUDOCODE_DRAFT.

## 3.3.1 heading
- Old (Revised): `### 3.3.1 Data Flow Diagrams`
- New: `### 3.3.1 Process Models`

## 3.3.2 heading
- Old (Revised): `### 3.3.2 Entity Relationship Diagram`
- New: `### 3.3.2 Data Models`

## 3.3.3 heading
- Old (Revised): `### 3.3.3 Pseudocode`
- New: `### 3.3.3 Logic Models (pseudocode)`

## Figure captions
- Old (Revised): captions already formatted as `[Figure 3.3.1.A: ...]`, `[Figure 3.3.2.1: ...]`.
- New: same caption style retained and applied to the pseudocode figures as `[Figure 3.3.3.1: Pseudocode Account Management Logic]` through `[Figure 3.3.3.6: Pseudocode Monitoring, Reports and Notifications Logic]`, following the defended `[Figure 3.3.3.1: Pseudocode Account Management Logic]` style.

## 3.3.1 Process Models content
- Old (Revised): context DFD (`3.3.1.A`), Level 0 (`3.3.1.B`), Level 1 (`3.3.1.C` to `3.3.1.H`), and swimlane flows (`3.3.1.I` to `3.3.1.K`).
- New: copied unchanged, including the six Level 1 processes and the ten data stores. The swimlane flows were retained as part of 3.3.1.

## 3.3.2 Data Models content
- Old (Revised): sixteen-entity ERD narrative.
- New: copied unchanged, including the USER supertype with the three subtypes UNIT_DIRECTOR, OFFICE_HEAD, and STAFF, and the D1-to-D10 store mapping.

## 3.3.3 Logic Models (pseudocode), restructuring
- Old (Revised): thirteen modules labelled A to M.
- New: consolidated into six process blocks under the required headings, one per process:
  - A. Account Management Logic = Revised A (Login and Role Routing) + Revised B (Account Approval or Rejection) + registration.
  - B. Training Record Logic = Revised C (Create a Training Record).
  - C. Training Assignment Logic = Revised D (Certificate Upload That Completes an Assignment) + E (Overdue Calculation) + F (Unit Director Creates an Assignment) + G (Office Head Assigns Own Staff) + H (Find Staff by Competency and Assign).
  - D. Training Evaluation Logic = Revised I (Save a Training Evaluation) + J (Staff Views Feedback).
  - E. Partner Institution Logic = Revised L (Partner Record Save, Office Head Limited to Own Office, and Expiry Check).
  - F. Monitoring, Reports and Notifications Logic = Revised K (Build the Competency and Knowledge Profile) + M (Notification Routing) + the dashboards, directories, reports, and exports.

## 3.3.3 intro paragraph
- Old (defended): "The logic models presented in this section describe the decision-making and data processing behavior of the SDU-ISCBMS across its five core processes. Each pseudocode block represents the logical flow of operations from input to processing to output, detailing how the system handles different conditions and scenarios in alignment with the process models established in Section 3.3.1 and the data model established in Section 3.3.2."
- New: same sentence with the name changed to SDU-STMS and "five core processes" changed to "six core processes".

## 3.3.3 removal of prototype-only behavior
- Old (PSEUDOCODE_DRAFT section 1): login routes fixed demo email addresses (Director/Staff/Office Head), and "the password text is collected by the form but is never compared to anything."
- New: "look up the account by email in D1 Users, verify the password, and confirm that the account status is Active"; invalid credentials show an error.
- Old (PSEUDOCODE_DRAFT section 1): after sign-up, "No account is saved and no pending request is created anywhere."
- New: "create an account in D1 Users with a Pending status and notify the Unit Director that a new account awaits review."
- Old (PSEUDOCODE_DRAFT section 2): approval/rejection "changes only the on-screen list"; "No account is created and no approved-history entry is written."
- New: approval sets the account Active; rejection stores the reason; both are recorded in D10 Action History and the applicant is notified.
- Old (PSEUDOCODE_DRAFT section 3): records are read from and written to browser storage and merged with baseline seed records.
- New: records are saved to D4 Training Records with their tags from D3 Catalogs; a user sees and edits only own records.
- Old (PSEUDOCODE_DRAFT section 4): the assignment status helper "keeps one map of assignment id to status in browser storage."
- New: the assignment status is stored in D6 Assignments.
- Old (PSEUDOCODE_DRAFT sections 9 and 10): a seeded fallback evaluation is shown until something is saved; the evaluation store is read from browser storage.
- New: evaluations are stored in and read from D7 Evaluations.
- Old (PSEUDOCODE_DRAFT section 12): the partner list is read from and written to browser storage, defaulting to six built-in seed partners.
- New: partners are stored in D8 Partner Institutions with their agreements and contribution rows.
- Old (PSEUDOCODE_DRAFT section 13): notifications are kept "in one browser store, newest first, capped at the most recent 500."
- New: notifications are stored in D9 Notifications with type, title, message, sender, recipient role, and optional recipient office and name.
- Old (PSEUDOCODE_DRAFT "Could not determine"): noted ambiguities such as whether uploading alone completes an assignment and whether seeded content is permanent.
- New: not carried over; the planned behavior is stated directly (the certificate upload completes the assignment with no review step, and no statement about seed data is made).

---

## Things I was unsure about (Section 3.3)

1. **3.3 intro paragraph.** I wrote a short 3.3 opening in the defended narrative style. If you only wanted the 3.3.3 intro paragraph (as the instruction literally says) and no 3.3-level intro, delete the paragraph under `## 3.3 Analysis`.
2. **Swimlane flows.** Revised 3.3.1 contains swimlane diagrams (Figures 3.3.1.I to 3.3.1.K). The defended 3.3.1 has no swimlanes, but the instruction said content comes from Revised 3.3.1, so I included them. Remove them if "Process Models" should mean DFDs only.
3. **Figure labels for Level 1.** The defended labels the Level 1 DFDs unreliably (its Level 1 section is lettered "A"), while Revised labels them C to H. I used the Revised labels (A context, B Level 0, C-H Level 1, I-K swimlanes).
4. **"no inbox and no direct messaging."** This negative sentence is retained verbatim from Revised/PSEUDOCODE_DRAFT (Module M, step 5). It names a removed feature only to exclude it; confirm this is acceptable, or reword to avoid naming it.
5. **Data-store labels in pseudocode.** I kept the DFD labels D1 to D10 (from Revised) inside the pseudocode, since the source uses them. If "no code syntax" was meant to exclude D-store labels too, say so.
6. **Certificate upload placement.** The certificate upload that completes an assignment is described inside C (Training Assignment Logic), while attaching a certificate to one's own training record is in B. This split follows the DFD sub-processes (2.2 and 3.4), but you may prefer the whole certificate flow in one block.
7. **Pain-points section.** The defended 3.3 has an eight-item "Current Process Evaluation and Operational Pain Points" list. It was not added because the instructed content sources were Revised 3.3.1/3.3.2 and PSEUDOCODE_DRAFT. Confirm whether that list should also appear under the new 3.3.
8. **Pseudocode granularity.** Each block is a numbered list of sentences with IF/ELSE wording. Some steps (for example the Overdue rule and the 90-day expiry window) combine several source steps into one numbered line to keep one block per process; confirm the level of detail is acceptable.

---

# Change log for Section 3.4, 3.5 and 3.6 (appended)

Base text: defended `chapter_3_to_references.md`. 3.4.1 uses the sixteen-table design from `CHAPTER_3_REVISED.md` section 3.4.1 in the defended narrative style. 3.4.2 uses `PROTOTYPE_INVENTORY.md` for the screens. Every change is listed as section / old / new. Name changes from "SDU-ISCBMS" to "SDU-STMS" are applied throughout and are noted once.

## 3.4 Design (intro)
- Old: "...SDU-ISCBMS... across nineteen normalized tables. ... across all four user roles Unit Director, Secretary, Office Head, and Staff..."
- New: "...SDU-STMS... across sixteen normalized tables. ... across all three user roles Unit Director, Office Head, and Staff..."

## 3.4.1 Database Design
- Old: `[Figure 3.4.1: RDM of SDU ISCBMS]` plus a converter description listing nineteen tables including skills, office_budgets, proof_files, event_expenses.
- New: `[Figure 3.4.1: Relational Data Model of SDU-STMS]`; converter description omitted.
- Old (defended): narrative around nineteen tables, budget tables, proof_files, the Secretary, and four category types (training, expense, evaluation, skill).
- New: rewritten in the defended narrative style around the sixteen tables from Revised 3.4.1 (offices, users, categories, training_records, training_record_roles, training_record_tags, certificates, assignments, assignment_assignees, assignment_competencies, training_evaluations, partner_institutions, partner_agreements, partner_contributions, notifications, action_history); three catalog types (training, competency, knowledge); the role field limited to unit_director/office_head/staff; certificates linked to a training record or an assignee with file reference to Cloudinary; assignment status values pending/awaiting_certificate/completed/cancelled with derived Overdue; ON DELETE RESTRICT for offices, users, categories and ON DELETE CASCADE for dependents. No data dictionary was added.

## 3.4.2 User Interface
- Old: "...across all four user levels..."
- New: "...across all three user levels..."
- Old figure captions 3.5.1 to 3.5.10: included "Unit Director / Secretary Central Monitoring Dashboard", "Proof Review Interface", "Office Budget Management Page", "Rate Office Heads / Evaluation Interface".
- New figure captions: numbering kept (3.5.1 to 3.5.10); removed screens replaced with existing prototype screens: 3.5.2 "Unit Director Central Monitoring Dashboard", 3.5.4 "Pending Approvals / Account Management Interface" (replaces Proof Review), 3.5.5 "Find Staff by Competency Interface" (replaces Office Budget), 3.5.7 "Training Evaluations Interface" (replaces Rate Office Heads). Converter descriptions omitted.
- Old "Login and Registration Page": registration collects "job function, and assigned office"; activation "by the Unit Director or Secretary".
- New: registration collects "and assigned office"; activation "by the Unit Director".
- Old heading "Unit Director and Secretary Interface": modules "Dashboard, Directories, Training Management, Proof Review, Budget Management, Partner Institutions, Evaluations, Reports, and Profile"; the Secretary's separate dashboard.
- New heading "Unit Director Interface": modules "Dashboard, Directories, Find Staff by Competency, Training Assignments, My Trainings, Training Evaluations, Partners, Reports, Pending Approvals, Catalogs, and Profile"; Secretary text removed (per `PROTOTYPE_INVENTORY.md` Director sidebar).
- Old bullets: escalated proof validations, active budgets, expense and skill categories, Review panel, budget allocation, 1-to-5 evaluations, threaded messaging and inbox.
- New bullets: pending accounts and upcoming trainings; training, competency, and knowledge catalogs; Training Evaluations panel; certificate upload completes and Overdue after one week; partner lead implementing office and expiry; evaluations without numeric ratings and one-way notifications (no inbox or messaging); cross-office training, competency, and partner reports.
- Old "Office Head Interface" modules: "Dashboard, Center Directory, My Trainings, Proof Validations, Evaluations, Center Budget, Reports, and Profile"; bullets about first-tier proof validation, proof routing, rating staff, budget sub-distribution, message threads.
- New modules: "Dashboard, Directories, Staff Competencies, Partners, My Trainings, Training Evaluations, My Competencies, Reports, and Profile" (per `PROTOTYPE_INVENTORY.md` Office Head sidebar); bullets about the staff competency directory, certificate upload, own-office evaluations, and one-way notifications.
- Old "Staff Interface" modules: "Dashboard, My Trainings, Skills Portfolio, Reports, and Profile"; bullets about proof approval statuses, uploading proof, expense logging, ratings, and message threads.
- New modules: "Dashboard, My Trainings, Evaluations, My Competencies, Reports, and Profile" (per `PROTOTYPE_INVENTORY.md` Staff sidebar); bullets about assignment and certificate statuses, certificate uploads, competency and knowledge displays, and received one-way notifications.

## 3.4.3 Report Design
- Old: "across all four user levels"; "staff, training, and budget data"; reports drawn "through D7 Reports".
- New: "across all three user levels"; "staff and training data"; reports drawn "through the monitoring and reporting processes".
- Old: "A.2 Budget and Expense Export Report" with `[Figure 3.4.3.A3: Office Budget and Expense Export Sheet]` and its paragraph.
- New: deleted; replaced by an added report that covers an existing feature without one: "A.2 Training Evaluation Export Report" with `[Figure 3.4.3.A3: Training Evaluation Export Sheet]`, drawing from D7 Evaluations and D4 Training Records (Uncertainty item 3).
- Old (A.1): "available to all four user types"; Unit Director and Secretary access; Staff "Proof File count"; source "D3 Training Records and D5 Assignments".
- New: "available to all three user types"; Unit Director access; Staff "Certificate count"; source "D4 Training Records and D6 Assignments".
- Old (B intro): reports "draw directly from D7 Reports".
- New: "draw directly from D10 Action History".
- Old (B.1): "Director and Secretary Action History Report"; badges including Approved Proof and Allocated Budget; the sentence that budget allocation is logged only under the Secretary; Managed Category covering training, expense, skill, and evaluation categories.
- New: "Unit Director Action History Report"; badges Approved Account, Uploaded Certificate, Assigned Training, Recorded Evaluation, Managed Category, and Exported Report; the Secretary/budget sentence removed; Managed Category covering training, competency, and knowledge catalogs.
- Old (B.2): Office Head action types including Distributed Budget and Logged Expense, and Exported Proof Report.
- New: Office Head action types including Recorded Evaluation, Uploaded Certificate, and Exported Staff Directory; budget/expense/proof types removed; "center" changed to "office".
- Old (B.3): Staff action types including Proof Submitted and Proof Approved; tracked "proof submissions"; Overdue after "without a validated proof".
- New: Staff action types including Certificate Uploaded; tracked "certificate submissions"; Overdue after "without a submitted certificate"; the Unit Director, Secretary, or Office Head reference reduced to Unit Director or Office Head.

## 3.4.4 Integrity Controls
- Old: "SDU-ISCBMS"; nineteen tables; Post-Training Evaluation fields "the rating score, associated skill, and evaluation category"; an Expense Logging form with a receipt image; Proof Upload and Expense Receipt forms; 1-to-5 evaluation inputs; financial fields and budget sub-distribution validation; the "Account Approval and Proof Validation Gates" bullet; budget/proof default values.
- New: "SDU-STMS"; sixteen tables; Training Evaluation fields "the conducted training, the number of participants who responded, and the feedback summary"; Expense Logging form removed; "Certificate Upload and Agreement Upload forms"; evaluation levels instead of numeric ratings; financial/budget validation removed; the bullet renamed "Account Approval and Certificate Gates" (certificate upload completes the assignment with no separate review step); Primary Key bullet rewritten for the sixteen tables with the two composite-key link tables; Foreign Key bullet rewritten with RESTRICT for offices/users/categories and CASCADE for the dependent rows; Schema bullet rewritten for sixteen tables with count and enum constraints; ACID example changed to a training record with roles and tags or a certificate upload completing an assignment; default values limited to users.status (Pending), assignment_assignees.status (Pending), and categories.is_active (true); Output section drops gap analysis and office_budgets, and the role restriction lists only Staff, Office Head, and Unit Director (no Secretary or budget allocation asymmetry).
- Rule satisfied: files are held in Cloudinary; the backup text appears only in 3.4.5 and covers the database only.

## 3.4.5 Security Controls
- Old: "SDU-ISCBMS"; "proof documentation"; the "four authorization levels ... four user types"; the Unit Director and Secretary shared highest access with budget allocation restricted to the Secretary; audit trail logging proof validations, expense logging, and budget allocation/sub-distribution; backup included "Uploaded proof files and expense receipt images stored in the server's file storage directory ... included in the backup schedule"; additional measures stored files "outside the web-accessible public directory".
- New: "SDU-STMS"; "certificate documentation"; "three authorization levels ... three user types"; the Unit Director holds the highest access level; Office Head office-scoped; audit trail logs account approvals/rejections, assignments, catalog management, evaluations, certificate uploads, and report exports with no budget actions; backup states that uploaded certificates and agreement documents "are held in Cloudinary ... not stored on the application server" and "the backup covers the database and not the files themselves"; additional measures state files "are held in Cloudinary rather than on the application server, keeping them separate from the web-accessible application".

## 3.5 Development
- Old: "...Social Development Unit Integrated Staff Capacity Building Management System..."; "training records, user accounts, participation roles, proof submissions, and compliance data"; "for unit director, office head, and staff".
- New: "...Social Development Unit Staff Training and Management System..."; "training records, user accounts, participation roles, certificates, evaluations, and compliance data"; "for the unit director, office head, and staff". No other structural change.

## 3.6 Testing
- Old: "Web-Based Social Development Unit Integrated Staff Capacity Building Management System"; "SDU-ISCBMS" in the figure paragraphs.
- New: "Web-Based Social Development Unit Staff Training and Management System"; "SDU-STMS".
- Old (Alpha bullet 1): "all four user roles (Unit Director, Secretary, Office Head, and Staff)".
- New: "all three user roles (Unit Director, Office Head, and Staff)".
- Old (Alpha bullet 2): activation "by the Unit Director or Secretary"; approval "once the Unit Director or Secretary approves it".
- New: activation "by the Unit Director"; approval "once the Unit Director approves it".
- Old (Alpha RBAC bullet): "The Unit Director and Secretary should have system-wide access"; "cross-center".
- New: "The Unit Director should have system-wide access"; "cross-office".
- Old (Alpha Training Input bullet): required fields included "required skills".
- New: required fields include "competencies".
- Old (Alpha "Proof Upload and Validation Module" bullet): multiple proof files reviewed by the Unit Director and Secretary through the review queue.
- New (Alpha "Certificate Upload Module" bullet): multiple certificate files that directly complete the assignment with no separate review step, notifying the Unit Director and Office Head.
- Old (Alpha "Training Gap Analysis" bullet).
- New: deleted.
- Old (Alpha "Communication Module" bullet): compose and send notifications with proof rejections noted.
- New (Alpha "Notification Module" bullet): certificate uploads instead of proof rejections.
- Old (Alpha "Staff Dashboard" bullet): "proof validation statuses" and "Validated, Pending, or Rejected".
- New: "assignment and certificate statuses" and "Pending, Awaiting Certificate, or Completed".
- Old (Alpha "Delegated Administration & Role Permutation Test" bullet).
- New: deleted.
- Old (Alpha "Skills Tracking & Matching Module" bullet): background skill profiles and skill searches/tagging.
- New (Alpha "Competencies and Knowledge Tracking & Matching Module" bullet): competency and knowledge tagging and searching; profiles updated by tagged trainings.
- Old (Alpha "Partner Institution Management" bullet): "Office Heads retain read-only access to the directory".
- New: "Office Heads can add and edit records only for their own office and view the rest", with the lead implementing office scoping.
- Old (Alpha "Evaluation Module" bullet): Director to Office Head, Office Head to Staff rating submissions, and evaluation trends.
- New: units of conducted trainings, Unit Director any office and Office Head own office, with Staff viewing feedback read-only; no ratings or trends.
- Old (Alpha "Budget Management" bullet).
- New: deleted.
- Old (Table 7): Training Management row included "proof upload and validation"; Monitoring and Analytics row included "training gap analysis".
- New (Table 7): Training Management row uses "certificate upload"; Monitoring and Analytics row uses "competency coverage"; title changed to "Social Development Unit Staff Training and Management System".
- Old (Table 9): Training Management row included "upload proof" and "proof validation status tracking"; Monitoring row included "gap analysis".
- New (Table 9): Training Management row uses "upload certificates" and "assignment status tracking"; Monitoring row uses "competency coverage"; title changed to "Social Development Unit Staff Training and Management System".
- Old (Beta intro): "such as SDU unit director, secretary, office head, and staff"; Unit Director and Secretary participants; module list included Proof Validation and Gap Analysis; "SDU centers"; "reviewing the monitoring dashboard".
- New: "such as the SDU unit director, office head, and staff"; Unit Director participant only; module list uses Certificate Upload and Evaluation; "SDU offices"; "uploading a certificate, or reviewing the monitoring dashboard".

---

## Things I was unsure about (Sections 3.4, 3.5 and 3.6)

1. **Figure numbering in 3.4.2.** The defended figures 3.5.1 to 3.5.10 include three screens that were removed (Proof Review, Office Budget, Rate Office Heads). To keep the defended numbering, I kept all ten caption slots and repurposed 3.5.4, 3.5.5, and 3.5.7 to existing prototype screens (Pending Approvals, Find Staff by Competency, Training Evaluations). If instead the removed figures should be dropped and the rest renumbered, say so.
2. **Converter figure descriptions.** The defended section carries converter-added block descriptions under each figure. I kept only the caption placeholders and omitted the descriptions (they list removed features). Confirm whether the descriptions should be present for the screens that remain.
3. **The single added report.** The instruction allowed one added report for an existing feature with no report. I added the "Training Evaluation Export Report". Other candidates that also lack a defended report are the Competency and Knowledge Profile Report, the Assignment Status Report, and the Partner Agreement and Expiry Report; swap if you prefer a different one.
4. **Figure 3.4.3.A3 label.** The defended budget report used figure number 3.4.3.A3 (skipping A2). The replacement evaluation report reuses 3.4.3.A3 to preserve numbering; if it should be 3.4.3.A2, change it.
5. **3.4.1 converter description and numbering.** I did not carry the defended converter description for Figure 3.4.1 (it lists the nineteen old tables). The heading and figure number are unchanged.
6. **3.5 prototype sentence.** Revised 3.5 notes that a front-end prototype was built first and that "iterative, not Agile" was used. I did not add these to the defended paragraphs, to keep the paragraph lengths and structure. Confirm whether that sentence should be inserted.
7. **Negative rating wording.** In 3.4.2 and 3.4.4 I wrote that evaluations use participant feedback "without numeric ratings" / "no numeric rating field is provided". These are negative statements that name the removed feature. Reword if naming it is undesirable.
8. **Table 7 vs Table numbering.** The defended alpha rubrics are labelled Table 7 and Table 8, and the beta rubrics Table 9 and Table 10, even though they sit in 3.6. I kept those numbers; they look like they were inherited from the old Chapter 4 numbering.
9. **Office vs center wording.** I changed "center" to "office" where the removed center-scoped budget/proof features were involved, but left "center" in a few places (for example the six centers and "center personnel"). Confirm the preferred term for the paper.
10. **"proof of attendance" in 3.3.1 (Sub-process 2.2).** That line, from the previously appended 3.3, still reads "as proof of attendance". It was outside this task's scope; flag if it should be reworded to certificate terminology.

---

# Fixes round 2

All changes below were made only in `MD FILES/CHAPTER_3_V2.md`. Each is listed as section / old / new.

## 1. Converter block quotes and notes removed
- Old (3.1, lines under the Figure 3.1 caption): the block quote beginning `> FIGURE DESCRIPTION (added by the converter, not part of the paper text): A diagram showing three tiers.` and its five following `>` lines.
- New: deleted; the caption `[Figure 3.1: Three-Tier Client-Server Architecture Diagram of SDU-STMS]` and the following paragraph are kept. This was the only converter block quote in the file; no other converter note was present.

## 2. Swimlane flows removed (3.3.1)
- Old: `**D. Swimlane Flows**` heading, its intro paragraph, `[Figure 3.3.1.I: Swimlane Diagram for Training Record and Certificate of SDU-STMS]`, `[Figure 3.3.1.J: Swimlane Diagram for Assignment and Completion of SDU-STMS]`, `[Figure 3.3.1.K: Swimlane Diagram for Evaluation of a Conducted Training of SDU-STMS]`, and the three paragraphs that accompanied them.
- New: deleted. The sentence in the 3.3.1 intro was also trimmed: old "The system design is documented through data flow diagrams at the context, Level 0, and Level 1 tiers, followed by swimlane diagrams for the principal operations." to "The system design is documented through data flow diagrams at the context, Level 0, and Level 1 tiers."

## 3. Report Design (3.4.3)
- Old: the added "A.2 Training Evaluation Export Report" heading, its `[Figure 3.4.3.A3: Training Evaluation Export Sheet]` caption, and its paragraph.
- New: deleted. The budget report had already been removed in the previous round; it is confirmed absent.
- Old report figure labels: `[Figure 3.4.3.1]`, `[Figure 3.4.3.A1]`, `[Figure 3.4.3.B1]`, `[Figure 3.4.3.B2]`, `[Figure 3.4.3.B3]`.
- New (no gap, single contiguous series): `[Figure 3.4.3.1]` (sample, unchanged), `[Figure 3.4.3.2]` (was A1, Staff Training Records Export Sheet), `[Figure 3.4.3.3]` (was B1, Unit Director's Action History Report), `[Figure 3.4.3.4]` (was B2, Office Head's Action History Report), `[Figure 3.4.3.5]` (was B3, Staff's Action History Report). No in-text references existed for these figures.

## 4. Pain points restored (3.3)
- Old: 3.3 went straight from the intro paragraph to `### 3.3.1 Process Models`.
- New: the defended "Current Process Evaluation and Operational Pain Points" block was restored word for word in its original position (after the 3.3 intro, before 3.3.1): the plain-text label, the two framing paragraphs, and items 1 to 8.
- Name change (standing rule): in the framing paragraph, "the proposed SDU-ISCBMS is designed to address" was written as "the proposed SDU-STMS is designed to address". This is the only word changed in the restored block.
- Budget item (item 7), changed: old "7.  No Structured Tracking of Partner Institutions or Budget Utilization: ... Similarly, while each office maintains a dedicated staff-development budget line, budget utilization is checked only through the university's separate Purchasing Custodian Office system, with no mechanism within the SDU's own tracking process to monitor allocation against actual event expenditures or to flag when a specific event's budget is approaching exhaustion." New "7.  No Structured Tracking of Partner Institutions: ..." with the budget sentence deleted. Only the title and the budget sentences changed; the partner sentences were kept.

## 5. Exclusion sentences deleted
- Old (3.1.2): "training record encoding with certificate upload that completes an assignment without a review or approval step;"
- New: "training record encoding with certificate upload that completes an assignment;"
- Old (3.2.2, Certificate Upload Module): "The upload completes the assignment directly, with no review or approval step."
- New: "The upload completes the assignment directly."
- Old (3.3.1, Sub-process 2.2): "attaches one or more files with an optional note to the record as proof of attendance. There is no review or approval step."
- New: "attaches one or more files with an optional note to the record as proof of attendance."
- Old (3.3.1, Sub-process 4.2): "One evaluation is kept per conducted training. There is no numeric rating."
- New: "One evaluation is kept per conducted training."
- Old (3.3.1, Process 4.0 basis): "the SDU evaluates trainings that its staff conduct, using participant feedback, and attending a training is not rated."
- New: "the SDU evaluates trainings that its staff conduct, using participant feedback."
- Old (3.3.3, C step 13): "...and notify the Unit Director and the Office Head. There is no review or approval step; the upload completes the assignment."
- New: "...and notify the Unit Director and the Office Head."
- Old (3.3.3, D step 7): "Keep one evaluation per conducted training. There is no numeric rating."
- New: "Keep one evaluation per conducted training."
- Old (3.3.3, F step 11): "11. Notifications are one-way; there is no inbox and no direct messaging."
- New: deleted (the block now ends at step 10).
- Old (3.4.2, Evaluation & Communication): "...through participant feedback, without numeric ratings, and provides broadcast notification controls to dispatch unit-wide announcements; there is no inbox and no direct messaging."
- New: "...through participant feedback, and provides broadcast notification controls to dispatch unit-wide announcements."
- Old (3.4.4, Format and Boundary Validation): "Evaluation inputs are restricted to the defined demonstration levels, and no numeric rating field is provided."
- New: "Evaluation inputs are restricted to the defined demonstration levels."
- Old (3.4.4, Account Approval and Certificate Gates): "...which completes the assignment with no separate review or approval step, and an unvalidated assignment..."
- New: "...which completes the assignment, and an unvalidated assignment..."
- Old (3.6.1, Certificate Upload Module): "Direct completion of the assignment upon upload, without a separate review or approval step."
- New: "Direct completion of the assignment upon upload."

## 6. Partner MOU expiry (3.2.2)
- Old: "Upload of MOU/agreement documentation with optional expiry date; the system flags approaching or past-expiry agreements."
- New: "Upload of MOU/agreement documentation with expiry date; the system flags approaching or past-expiry agreements."

## 7. Figure and table renumbering
- Old (3.4.2): `[Figure 3.5.1]` to `[Figure 3.5.10]`.
- New: `[Figure 3.4.2.1]` to `[Figure 3.4.2.10]` (same captions; only the labels changed). No in-text references existed for these figures.
- Old (3.6.1): "Table 7: Alpha Testing Rubric..." and "Table 8: Scoring Scale for Alpha Testing".
- New: "Table 3.6.1: Alpha Testing Rubric..." and "Table 3.6.2: Scoring Scale for Alpha Testing".
- Old (3.6.2): "Table 9: Beta Testing Rubric..." and "Table 10: Scoring Scale for Beta Testing".
- New: "Table 3.6.3: Beta Testing Rubric..." and "Table 3.6.4: Scoring Scale for Beta Testing".
- In-text reference: old "a structured rubric (Table 9) completed by each participant" to "a structured rubric (Table 3.6.3) completed by each participant". No other in-text references to Tables 7, 8 or 10 existed.
- Note: the two testing figure captions in 3.6 were left as `[Figure 4.2.1]` and `[Figure 4.2.2]`, because task 7 listed only the 3.4.2 figures and the four tables for renumbering.

## 8. Heading comparison (levels 2 to 4)
Defended `chapter_3_to_references.md` (Chapter 3) headings, with the matching `CHAPTER_3_V2.md` heading beside each:

| Defended heading | V2 heading | Status |
| :--- | :--- | :--- |
| ## 3.1 Architectural Design | ## 3.1 Architectural Design | Present |
| ### 3.1.1 Client Tier (Presentation Layer) | ### 3.1.1 Client Tier (Presentation Layer) | Present |
| ### 3.1.2 Application Tier (Logic Layer) | ### 3.1.2 Application Tier (Logic Layer) | Present |
| ### 3.1.3 Data Tier (Database Layer) | ### 3.1.3 Data Tier (Database Layer) | Present |
| ## 3.2 Requirements Specification | ## 3.2 Requirements Specification | Present |
| ### 3.2.1 Users and Characteristics | ### 3.2.1 Users and Characteristics | Present |
| ### 3.2.2 Software Functionalities | ### 3.2.2 Software Functionalities | Present |
| ### 3.2.3 Security Requirements | ### 3.2.3 Security Requirements | Present |
| ### 3.2.4 Technical Requirements | ### 3.2.4 Technical Requirements | Present |
| ## 3.3 Analysis | ## 3.3 Analysis | Present |
| ### 3.3.1 Process Models | ### 3.3.1 Process Models | Present |
| ### 3.3.2 Data Models | ### 3.3.2 Data Models | Present |
| ### 3.3.3 Logic Models (pseudocode) | ### 3.3.3 Logic Models (pseudocode) | Present |
| ## 3.4 Design | ## 3.4 Design | Present |
| ### 3.4.1 Database Design | ### 3.4.1 Database Design | Present |
| ### 3.4.2 User Interface | ### 3.4.2 User Interface | Present |
| ### 3.4.3 Report Design | ### 3.4.3 Report Design | Present |
| ### 3.4.4 Integrity Controls | ### 3.4.4 Integrity Controls | Present |
| ### 3.4.5 Security Controls | ### 3.4.5 Security Controls | Present |
| ## 3.5 Development | ## 3.5 Development | Present |
| ## 3.6 Testing | ## 3.6 Testing | Present |
| ### 3.6.1 Alpha Testing | ### 3.6.1 Alpha Testing | Present |
| ### 3.6.2 Beta Testing | ### 3.6.2 Beta Testing | Present |

No level 2 to 4 defended Chapter 3 heading is missing in V2. (The defended file also contains `## 4.3 Calendar of Activities`, which belongs to Chapter 4 and is outside the scope of this Chapter 3 file.)

---

## Things I was unsure about (Fixes round 2)

1. **Report figure renumbering scheme.** I renumbered the remaining report figures as a single contiguous series (`3.4.3.1` to `3.4.3.5`), matching the `3.4.2.x` convention used for the interface figures. An alternative that keeps the A/B category letters would be to leave them as A1, B1, B2, B3 (which also has no gap). If you prefer the lettered style, say which labels you want.
2. **Exclusion sentences beyond the three named.** The instruction named "no inbox and no direct messaging", "without numeric ratings", and "no numeric rating field", plus "any similar sentence that names a removed feature only to exclude it". I treated the "no review or approval step" / "no separate review or approval step" clauses and "attending a training is not rated" as similar and removed them. I did not remove the descriptive phrase "one-way notifications", since it describes a feature rather than excluding a removed one. Confirm both choices.
3. **Pain-point name change.** The restored block is word for word except the one "SDU-ISCBMS" to "SDU-STMS" change in the framing sentence. If "word for word" should win over the standing rename rule, restore "SDU-ISCBMS" there.
4. **Item 7 wording.** I deleted only the budget clause and kept the partner-institution sentences, so the item title now reads "No Structured Tracking of Partner Institutions". If item 7 should be deleted entirely instead, that is a one-line change.
5. **3.6 figure captions.** Task 7 listed only the 3.4.2 figures and Tables 7 to 10, so I left `[Figure 4.2.1]` and `[Figure 4.2.2]` unchanged even though they carry old numbering. Confirm they should stay.
6. **"proof of attendance" (3.3.1, Sub-process 2.2).** This phrase remains; it describes a certificate, not the removed proof-validation workflow, so I left it. Change to "as proof of completion" if preferred.
7. **Report section labels.** After deleting A.2, the remaining headings are "A.1 Training Records Export Report", "B.1", "B.2", and "B.3", while the figure labels are now 3.4.3.2 to 3.4.3.5. The section letters and the figure numbers no longer correspond. Task 3 asked only to renumber the figure labels, so I left the section letters. Confirm whether the section letters should also be flattened (for example to 1, 2, 3, 4) or left as is.

---

# Fixes round 3

All changes below were made only in `MD FILES/CHAPTER_3_V2.md`. Each is listed as section / old / new.

## 1. 3.2.2 first paragraph
- Old: "The SDU-STMS is composed of twenty (20) functional modules, each corresponding directly to a specific objective established in Section 1.3."
- New: "The SDU-STMS is composed of twenty (20) functional modules, which together implement the six specific objectives established in Section 1.3."

## 2. 3.2.2 Participation Role Classification module
- Old: "Records whether a staff member attended as Facilitator, Participant, Resource Speaker, or Organizer, selectable via checkboxes and usable as a dashboard/report filter."
- New: "Records whether a staff member attended as Participant, Facilitator, Speaker or Resource Person, Organizer, Host or Emcee, or Documenter, selectable via checkboxes and usable as a dashboard/report filter."

## 3. Participation role lists updated elsewhere
- Old (3.3 pain point 5, Critical Blind Spots in Strategic Decision-Support): "The Unit Director cannot systematically distinguish whether an employee acted as a Participant, Facilitator, Speaker, or Organizer, a distinction that is absolutely critical for mapping true internal expertise."
- New: "The Unit Director cannot systematically distinguish whether an employee acted as a Participant, Facilitator, Speaker or Resource Person, Organizer, Host or Emcee, or Documenter, a distinction that is absolutely critical for mapping true internal expertise."
- Examined and left unchanged (already list all six): 3.3.1 Sub-process 2.1, "participation roles (Participant, Facilitator, Organizer, Speaker, Host or Emcee, and Documenter)".
- Examined and left unchanged (examples, not complete lists): 3.3.1 Sub-process 4.2 "for example for a speaker or facilitator"; 3.6.1 alpha test "multiple roles such as Facilitator and Organizer simultaneously".

## 4. 3.2.2 Training Input Module
- Old: "Enables Staff and Office Head to encode training records..."
- New: "Enables Staff, Office Head, and Unit Director to encode training records..."

## 5. 3.2.2 Contribution Log module
- Old: "Records cash and in-kind partner contributions with description, estimated value, and per-event/date-range history."
- New: "Records partner contributions with a description and per-event or date-range history."

## 6. 3.2.2 Office Head Oversight Function module
- Old: "Center-specific dashboard of training activity, compliance, and capacity for each staff member in an Office Head's assigned center."
- New: "Center-specific dashboard of training activity, compliance, and participation roles for each staff member in an Office Head's assigned center."

## 7. 3.4.2 Staff Interface intro
- Old: "The Staff interface focuses on personal capacity development, organized across..."
- New: "The Staff interface focuses on personal training development, organized across..."

---

## Things I was unsure about (Fixes round 3)

1. **"Speaker or Resource Person" versus "Speaker".** The new role label given in task 2 is "Speaker or Resource Person". Elsewhere the file already lists the six roles but uses the shorter label "Speaker" (3.3.1 Sub-process 2.1: "Participant, Facilitator, Organizer, Speaker, Host or Emcee, and Documenter") and the example phrases use "speaker" / "Facilitator". I did not change those, because they already list all six roles. If the label should be unified to "Speaker or Resource Person" everywhere, say so.
2. **Role order.** Task 2's replacement lists the roles in the order "Participant, Facilitator, Speaker or Resource Person, Organizer, Host or Emcee, or Documenter". The 3.3 pain-point list now uses that same order, but 3.3.1 Sub-process 2.1 keeps its original order "Participant, Facilitator, Organizer, Speaker, Host or Emcee, and Documenter". Confirm whether the order should also be unified.
3. **Example versus full list.** I treated "such as Facilitator and Organizer" (3.6.1) and "for example for a speaker or facilitator" (3.3.1) as examples rather than participation-role lists, so I left them. Confirm they were not intended to be expanded to all six.
4. **"capacity" elsewhere.** Task 5 changed only "capacity for each staff member" (3.2.2) and "personal capacity development" (3.4.2). Other uses of "capacity" remain in the restored pain-points list: "institutional capacity audit" (item 2), "the explicit capacity in which a staff member participated" (item 5), and "capacity building, properly understood" (item 8). These come from the defended text, so I left them unchanged. Confirm whether any of them should also be reworded.

---

# Fixes round 4

## 3.2.1 Users and Characteristics table structure
- First attempt: I wrongly shortened the cell text. This was reverted, and the exact original wording is back.
- Final change: only the table structure was rotated. The table now has the roles as columns and the attributes as rows, so each role is one column and every part lines up under the role it belongs to.
  - Old headers: `User Type | Role in Organization | Frequency of Use | Technical Proficiency | Access Level`
  - New headers: `Attribute | Unit Director | Office Head | Staff Members`
  - Rows are now `Role in Organization`, `Frequency of Use`, `Technical Proficiency`, and `Access Level`, with each cell carrying the original wording unchanged.
- No cell contents were changed. The caption "Table 3.2.1: SDU-STMS Users and Characteristics" and the surrounding paragraphs are unchanged.

---

## Things I was unsure about (Fixes round 4)

1. **Transpose versus alignment.** I rotated the table so roles are the columns. If you only wanted the original 5-column table with the pipes padded/aligned (not rotated), say so and I will switch back to the original orientation.
2. **Nothing else changed.** No cell wording, headings, or other sections were touched.

---

## Training evaluation: level replaced by overall rating

### Prototype
- `director/training_evaluations.html` and `officehead/training_evaluations.html`: the optional field changed from "Level (optional)" (`#evalLevel`: `Not set`, `Demonstrated`, `Partially Demonstrated`, `Not Demonstrated`) to "Overall rating (optional)" (`#evalRating`: `Not set`, `Excellent`, `Very Good`, `Good`, `Poor`), storing the label text. The table column `LEVEL` is now `OVERALL RATING`.
- Old: `function levelPill(level) { ... 'Demonstrated' ? 'active' : 'Not Demonstrated' ? 'inactive' : 'partial'; ... }`
- New: `function ratingPill(rating) { ... 'Excellent' ? 'active' : 'Poor' ? 'inactive' : 'partial'; ... }`; any other stored value (including the old level text) falls to `partial`, so old values still render.
- Saves now write an `overallRating` property instead of `level`; reads use `ev.overallRating || ev.level`, so evaluations saved under the old `level` property still display without errors. The Add and Edit modals set `#evalRating` from `overallRating || level || ''`.
- `staff/my_evaluations.html`: the `LEVEL` column became `OVERALL RATING` and the row renders the overall rating with the same old-value fallback.
- `js/staff_data.js`: in `iscmsSeedTrainingEvaluations()`, old `level: 'Demonstrated',` new `overallRating: 'Very Good',`.

### Database
- `database/schema.sql`: old `CREATE TYPE evaluation_level AS ENUM ('demonstrated', 'partially_demonstrated', 'not_demonstrated');` new `CREATE TYPE evaluation_rating AS ENUM ('excellent', 'very_good', 'good', 'poor');`.
- `database/schema.sql`: old `level evaluation_level,` new `overall_rating evaluation_rating,` (still nullable / optional).
- `database/schema.dbml`: old `Enum evaluation_level { demonstrated / partially_demonstrated / not_demonstrated }` new `Enum evaluation_rating { excellent / very_good / good / poor }`; old `level evaluation_level` new `overall_rating evaluation_rating`.

### Chapter 3 (CHAPTER_3_V2.md)
- 3.2.2, Conducted-Training Evaluation module: old "...optional per-role feedback, and an optional demonstration level." new "...optional per-role feedback, and an optional overall rating. The overall rating uses the four-point scale (4 Excellent, 3 Very Good, 2 Good, 1 Poor) that SDU already uses in its project evaluation tools." (the added sentence is the new scale description).
- 3.3.1, Sub-process 4.2: old "...optional per-role feedback (for example for a speaker or facilitator), and an optional level (Demonstrated, Partially Demonstrated, or Not Demonstrated)." new "...optional per-role feedback (for example for a speaker or facilitator), and an optional overall rating (Excellent, Very Good, Good, or Poor)."
- 3.3.3, Training Evaluation Logic, step 5: old "update its participants, summary, per-role feedback, and level." new "update its participants, summary, per-role feedback, and overall rating."
- 3.3.3, Training Evaluation Logic, step 9: old "...the per-role feedback, and the level;" new "...the per-role feedback, and the overall rating;"
- 3.4.4, Format and Boundary Validation: old "Evaluation inputs are restricted to the defined demonstration levels." new "Evaluation inputs are restricted to the defined overall rating values."
- 3.6.1, Evaluation Module test case: old "...feedback summary, per-role feedback, and level upon form submission." new "...feedback summary, per-role feedback, and overall rating upon form submission."

### Documentation
- `PROTOTYPE_INVENTORY.md`: the event evaluation form row changed from `evalLevel` (`Not set`, `Demonstrated`, `Partially Demonstrated`, `Not Demonstrated`) to `evalRating` (`Not set`, `Excellent`, `Very Good`, `Good`, `Poor`); the Staff Evaluations row and the "My Evaluations" column list now say "overall rating"; the seeded evaluation description now says overall rating `Very Good`.
- `STMS_GUIDE.md`: the Staff Evaluations bullet now says "overall rating"; the evaluation field list now lists `evalRating` — optional overall rating: `Not set`, `Excellent`, `Very Good`, `Good`, `Poor`.

### Verification
- `node --check js/staff_data.js` passed (the only changed `.js` file; the other changes are inline in HTML and in `.sql` / `.dbml`).

---

## Things I was unsure about (Fixes round 4 — overall rating)

1. **3.4.1 training_evaluations table.** The task asked to update "the training_evaluations table in 3.4.1", but 3.4.1 in this file describes that table only in prose and never names its columns (there is no data dictionary), so there was no level mention to change. I left 3.4.1 unchanged.
2. **3.4.2 interface text.** The task named "the interface text in 3.4.2", but 3.4.2 contains no mention of the level. The only remaining text-level mention was in 3.4.4 (Format and Boundary Validation, "the defined demonstration levels"), which I updated. Flag if a different line was intended.
3. **Existing "Fixes round 4" heading.** The file already contained a "Fixes round 4" section (about the 3.2.1 table rotation). I appended this round's changes under that heading rather than creating a duplicate heading. Say so if a separate "Fixes round 5" heading is preferred.
4. **Scale wording.** I wrote the added sentence as "The overall rating uses the four-point scale (4 Excellent, 3 Very Good, 2 Good, 1 Poor) that SDU already uses in its project evaluation tools." The task said the scale is the 4-point scale SDU already uses; I included the four labels to name them explicitly. Remove the labels if only the sentence about the scale should remain.
5. **Old values in the modal select.** Old evaluations with `level: 'Demonstrated'` still display in the tables, but the Edit modal's `#evalRating` select has no matching option, so it shows blank on load (the stored value is not lost unless the form is re-saved). No error occurs.
6. **Unrelated "no 1-to-5 rating" wording.** `PROTOTYPE_INVENTORY.md` and `STMS_GUIDE.md` contain separate "No 1-to-5 rating" statements about the removed skill-rating module. These remain accurate (the new overall rating is a 4-point scale, not 1-to-5), so I left them unchanged.

---

# Fixes round 5

All changes below were made only in `MD FILES/CHAPTER_3_V2.md`. Each is listed as section / old / new.

## 1. 3.2.2 Secure Account Management System with Role-Based Access Control (RBAC)
- Old: "Provides user registration with role and office selection, login/logout, and a Unit Director-controlled account approval workflow. New accounts remain pending until reviewed and approved."
- New: "Provides user registration, login/logout, and a Unit Director-controlled account approval workflow. Users register with their name, email, password, and office, and the Unit Director assigns the role when approving the account. New accounts remain pending until reviewed and approved."

## 2. 3.2.2 Staff Competency and Knowledge Profile
- Old: "A searchable record combining auto-populated and manually entered competencies and knowledge areas."
- New: "A searchable record built from the competency and knowledge tags on the training records."

## 3. 3.2.2 Partner Institution Records
- Old: "Viewable by all roles, editable by the Unit Director system-wide, and by an Office Head for partnerships whose lead implementing office is her own"
- New: "The Unit Director manages all partner records, and Office Heads add and edit the records of their own office and view the others."

## 4. 3.5 Development, closing paragraph
- Old (final sentence): "This ensures that the codebase remains maintainable, traceable, and accessible for future enhancement or handover."
- New: that same sentence followed by the added sentence "The prototype demonstrates the screens and the main flows of the system; the storage of registrations, the live action history, the automatic partner expiry notices, and the logging of partner contributions are implemented in the next phase of development."

## 5. 3.3.1 Sub-process 1.1 Registration
- No change. The text reads "collects the name, email, password, and office, and creates an account with Pending status"; it does not say users select a role when registering, so the condition in the task did not apply.

---

## Things I was unsure about (Fixes round 5)

1. **3.5 target paragraph.** The task says to add the sentence "at the end of the paragraph that mentions the prototype", but no paragraph in 3.5 (or anywhere in the file) contains the word "prototype". I appended it to the closing paragraph of 3.5 (the coding-standards paragraph), so it lands at the end of the section. If a different paragraph was intended (for example the iterative-development paragraph), say which and I will move it.
2. **3.2.2 partner "viewable by all roles".** Only the Partner Institution Records module (line 85) contained a "viewable by all roles" statement in 3.2.2, so that is the only one changed. The related sentence in 3.2.3 Security Requirements ("Staff members hold view-only access to the partner institution directory") is outside 3.2.2 and was left unchanged.
3. **3.2.2 RBAC wording.** I removed the "with role and office selection" phrase and used the task's exact replacement sentence. If you wanted only the shorter form ("...user registration with name, email, password, and office...") without the extra sentence, that is a one-line change.
4. **Sub-process 1.1.** It already matched the register-without-role flow (name, email, password, office; Pending status) and did not mention role selection, so per the task I changed nothing there. It does not explicitly state that the Unit Director assigns the role on approval; I left it as-is rather than adding text.

---

# Final fixes

Changes made only in `MD FILES/CHAPTER_3_V2.md` and `MD FILES/CHAPTER_2_REVISED.md`.

## CHAPTER_3_V2.md

### 1. 3.3.1 B (Level 0), sentence deleted
- Old: "The Level 0 diagram, Figure 3.3.1.B, decomposes SDU-STMS into six processes and ten data stores. The panel asked that the processes be emphasized over the external entities, and an earlier set of nine processes was consolidated into the six presented here."
- New: "The Level 0 diagram, Figure 3.3.1.B, decomposes SDU-STMS into six processes and ten data stores."

### 2. "her own office" changed to "their own office" (4 occurrences)
- 3.2.1 table (Access Level row), 3.2.1 paragraph 2, 3.2.2 Notification Module, and 3.2.2 Conducted-Training Evaluation.

### 3. 3.6 figure renumbering
- Old: `[Figure 4.2.1: Test Case Sample]` and in-text "Figure 4.2.1 shows a sample test case..."
- New: `[Figure 3.6.1: Test Case Sample]` and "Figure 3.6.1 shows a sample test case..."
- Old: `[Figure 4.2.2: Test Scenario Sample]` and in-text "Figure 4.2.2 shows the test scenarios..."
- New: `[Figure 3.6.2: Test Scenario Sample]` and "Figure 3.6.2 shows the test scenarios..."

### 4. 3.2.3 partner records
- No change. 3.2.3 contains no sentence stating that partner records are viewable by all roles; the condition in the task did not apply.

### 5. Left as-is
- The prototype sentence added in 3.5 remains where it is.
- 3.3.1 sub-process 1.1 and the 3.2.2 RBAC wording are unchanged.

## CHAPTER_2_REVISED.md

### 6. Every [VERIFY] replaced
- All 15 table cells under "Competency and knowledge tagging per training", "Staff assignment by competency", "Evaluation of conducted trainings (participant feedback)", "Certificate upload per training record", and "Agreement tracking with expiry alerts" now read "Not documented".

### 7. [ADD SOURCE: ...] markers removed, sentences kept
- 2.1.5: removed " [ADD SOURCE: participation roles and session counts as experience evidence]".
- 2.1.6: removed " [ADD SOURCE: knowledge, skills and abilities]".
- 2.2.5: removed " [ADD SOURCE: notification systems]".
- No citation was invented; each sentence was kept as the paper's own reasoning.

### 8. Lack-of-feature claims in 2.3 and 2.4 rephrased
- 2.3.1 TalentLMS: old "TalentLMS does not support participation role tagging (...), competency and knowledge tagging per training, staff assignment by competency, evaluation of conducted trainings through participant feedback, or a hierarchical monitoring structure..." new keeps the participation-role-tagging and hierarchy limitations and states "for competency and knowledge tagging per training, staff assignment by competency, and evaluation of conducted trainings through participant feedback, no documentation of this feature was found in the materials reviewed."
- 2.3.1 Cornerstone OnDemand: old "It also lacks the SDU-specific combination of participation role tagging, competency and knowledge tagging per training, staff assignment by competency, evaluation of conducted trainings, and a multi-office Unit Director and Office Head hierarchy..." new keeps participation role tagging and the hierarchy and states "for competency and knowledge tagging per training, staff assignment by competency, and evaluation of conducted trainings, no documentation of this feature was found in the materials reviewed."
- 2.3.2 Integra HRIS Government Edition: old "It does not support participation role tagging, competency and knowledge tagging per training, staff assignment by competency, evaluation of conducted trainings, director-level monitoring..., or a multi-office Unit Director and Office Head hierarchy..." new keeps participation role tagging, director-level monitoring, and the hierarchy and states "for competency and knowledge tagging per training, staff assignment by competency, and evaluation of conducted trainings, no documentation of this feature was found in the materials reviewed."
- 2.3.4 comparison paragraph: old "Likewise, none provide the combination of participation role tagging, competency and knowledge tagging per training, staff assignment by competency, evaluation of conducted trainings through participant feedback, and a multi-office Unit Director and Office Head hierarchy..." new states "for competency and knowledge tagging per training, staff assignment by competency, and evaluation of conducted trainings through participant feedback, no documentation of this feature was found in the materials reviewed; these, together with participation role tagging and a multi-office Unit Director and Office Head hierarchy, are core operational requirements..."
- 2.4 finding 3: old "TalentLMS, Cornerstone, and Integra do not offer the combined role tagging, competency assignment, and multi-office hierarchy. ... none of them combines participation role tagging, competency and knowledge tagging, assignment of staff by competency, evaluation of conducted trainings, and a Unit Director and Office Head hierarchy across offices." new keeps role tagging and hierarchy and states "for competency and knowledge tagging, assignment of staff by competency, and evaluation of conducted trainings, no documentation of this feature was found in the materials reviewed."

### 9. Working note removed
- Deleted the top line: "NOTE: Revised version for the Staff Training and Management System (SDU-STMS). This file contains Section 2.1 only. All existing citations are kept exactly as written."
- No change-log, "what was removed or changed" section, or list of markers was present at the top or bottom of the file.

## Final counts (both chapter files)
- [VERIFY] = 0
- [ADD SOURCE] = 0
- [CONFIRM] = 0
- Secretary = 0
- budget = 0
- ISCBMS = 0
- ISCMS = 0
- "her own office" = 0
- "Figure 4.2" = 0
- "panel asked that the processes" = 0
