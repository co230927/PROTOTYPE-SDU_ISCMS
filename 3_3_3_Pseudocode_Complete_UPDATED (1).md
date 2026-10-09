# 3.3.3 Logic Models (Pseudocode) — Complete Set (UPDATED)

This is the full, current version of all 10 pseudocode figures with the latest
interview-driven fixes folded in. Four figures changed from the previous
version (3.3.3.2, 3.3.3.6, 3.3.3.9, 3.3.3.10) — everything else (Account
Management, Proof Validation, Monitoring, Notification, Skills Tracking,
Partner Institution) is unchanged. Copy each block into its corresponding
Figure in the paper.

---

## Figure 3.3.3.1 — Pseudocode: Account Management Logic

```
PROCESS: User Registration and Account Approval

BEGIN REGISTRATION
  RECEIVE input: name, email, password, office, role

  IF email already exists in USERS table THEN
    RETURN error: "Email is already registered"
  END IF

  IF any required field is empty THEN
    RETURN error: "All fields are required"
  END IF

  HASH password using bcrypt algorithm
  SET status = "Pending"
  INSERT new record into USERS table
  SEND notification to Unit Director AND Secretary: "New account pending approval"
  RETURN success: "Registration submitted. Awaiting approval."
END REGISTRATION

BEGIN ACCOUNT APPROVAL
  RECEIVE input: approver_id, target_user_id, decision (Approve / Reject)

  QUERY USERS table WHERE user_id = approver_id
  IF approver role NOT IN ("Director", "Secretary") THEN
    RETURN error: "Only the Unit Director or Secretary may approve accounts"
  END IF

  IF decision = "Approve" THEN
    UPDATE status = "Active" IN USERS table WHERE user_id = target_user_id
    SEND notification to target_user_id: "Your account has been approved"
  ELSE IF decision = "Reject" THEN
    UPDATE status = "Rejected" IN USERS table WHERE user_id = target_user_id
    SEND notification to target_user_id: "Your account has been rejected"
  END IF

  LOG action in REPORTS table: "Account approval decision", generated_by = approver_id
  RETURN success: "Account status updated"
END ACCOUNT APPROVAL

BEGIN AUTHENTICATION
  RECEIVE input: email, password

  QUERY USERS table WHERE email = input email

  IF no record found THEN
    RETURN error: "Invalid email or password"
  END IF

  IF status = "Pending" THEN
    RETURN error: "Account is awaiting approval"
  END IF

  IF status = "Rejected" THEN
    RETURN error: "Account has been rejected"
  END IF

  VERIFY input password against hashed password

  IF password does not match THEN
    RETURN error: "Invalid email or password"
  END IF

  CREATE authenticated session
  LOAD role-specific dashboard based on user role:
    IF role = "Director" THEN LOAD Central Monitoring Dashboard
    IF role = "Secretary" THEN LOAD Central Monitoring Dashboard
    IF role = "OfficeHead" THEN LOAD Office Head Dashboard
    IF role = "Staff" THEN LOAD Staff Dashboard
END AUTHENTICATION
```

---

## Figure 3.3.3.2 — Pseudocode: Training Management Logic (UPDATED)

```
PROCESS: Training Record Encoding and Assignment

BEGIN TRAINING RECORD ENCODING
  RECEIVE input: title, description, start_date, end_date,
                 venue, nature, scope, category_id,
                 participation_roles[]   // array — supports multiple roles per record

  IF any required field is empty THEN
    RETURN error: "All required fields must be filled"
  END IF

  IF end_date is before start_date THEN
    RETURN error: "End date cannot be before start date"
  END IF

  IF participation_roles is empty THEN
    RETURN error: "At least one participation role is required"
  END IF

  INSERT new record into TRAINING_RECORDS table
  SET validation_status = "Pending"
  SET completion_status = "Pending"

  FOR EACH role in participation_roles DO
    INSERT record into TRAINING_RECORD_ROLES table:
      training_id = new training_id
      role = role
  END FOR

  RETURN success: "Training record submitted successfully"
END TRAINING RECORD ENCODING

BEGIN TRAINING ASSIGNMENT
  RECEIVE input: assigned_by (Director, Secretary, or OfficeHead user_id), training_title,
                 description, category_id, nature, scope, venue,
                 deadline, assigned_offices[]

  QUERY USERS table WHERE user_id = assigned_by
  SET assigner_role = role from query result

  IF assigner_role NOT IN ("Director", "Secretary", "OfficeHead") THEN
    RETURN error: "You are not authorized to assign trainings"
  END IF

  IF assigner_role = "OfficeHead" THEN
    FOR EACH user in assigned_offices DO
      IF user.office_id != assigned_by.office_id THEN
        RETURN error: "Office Head may only assign training to staff within their own center"
      END IF
    END FOR
  END IF

  IF any required field is empty THEN
    RETURN error: "All required fields must be filled"
  END IF

  IF deadline is before today THEN
    RETURN error: "Deadline must be a future date"
  END IF

  INSERT new record into ASSIGNMENTS table
  SET assigned_by = assigned_by
  SET completion_status = "Pending"

  FOR EACH user in assigned_offices DO
    INSERT notification into NOTIFICATIONS table:
      sender_id = assigned_by
      receiver_id = user_id
      type = "Assignment"
      message = "You have been assigned a new training"
  END FOR

  IF assigner_role = "OfficeHead" THEN
    INSERT notification into NOTIFICATIONS table:
      sender_id = assigned_by
      receiver_id = Director, Secretary
      type = "Assignment"
      message = "Office Head [name] assigned training to own staff"
      // One-way notice; it does not require Director/Secretary approval
  END IF

  LOG action in REPORTS table: "Training assigned and users notified"
  RETURN success: "Training assigned and users notified"
END TRAINING ASSIGNMENT

BEGIN COMPLETION STATUS UPDATE
  // Triggered by a successful proof validation signal (see Figure 3.3.3.3)
  // AND by a scheduled daily check for overdue assignments.
  RECEIVE input: training_id, proof_validation_result (optional), current_date

  IF proof_validation_result = "Validated" THEN
    UPDATE completion_status = "Completed" IN ASSIGNMENTS table
      WHERE training_id = training_id
    UPDATE completion_status = "Completed" IN TRAINING_RECORDS table
      WHERE training_id = training_id
    SEND notification to submitter: "Your training has been marked Completed"
    RETURN success: "Completion status updated"
  END IF

  // Scheduled check — runs independently of proof validation
  QUERY ASSIGNMENTS table WHERE completion_status = "Pending"
  FOR EACH assignment in results DO
    IF current_date > assignment.deadline + 7 days THEN
      UPDATE completion_status = "Overdue" IN ASSIGNMENTS table
        WHERE assignment_id = assignment.assignment_id
      SEND notification to assignment.assigned_to: "Your training assignment is now Overdue"
    END IF
    // A passed deadline alone (within the 7-day grace period) does not change status
  END FOR

  RETURN success: "Completion status check complete"
END COMPLETION STATUS UPDATE
```

---

## Figure 3.3.3.3 — Pseudocode: Proof Validation Logic (two-tier)

```
PROCESS: Proof Upload and Two-Tier Validation

BEGIN PROOF UPLOAD
  RECEIVE input: training_id, submitter_id, proof_files[]

  IF no file uploaded THEN
    RETURN error: "At least one proof file is required"
  END IF

  FOR EACH file in proof_files DO
    IF file type is NOT in (PDF, PNG, JPG, DOC, DOCX) THEN
      RETURN error: "Invalid file type"
    END IF

    IF file size exceeds 10MB THEN
      RETURN error: "File size must not exceed 10MB"
    END IF

    STORE file in server storage
    INSERT record into PROOF_FILES table:
      training_id = input training_id
      file_path = stored file path
      file_type = file extension
      validation_status = "Pending"
  END FOR

  QUERY USERS table WHERE user_id = submitter_id
  SET submitter_role = role from query result

  // Two-tier routing — this is the core fix
  IF submitter_role = "Staff" THEN
    QUERY USERS table: GET assigned Office Head for submitter's office
    SEND notification to Office Head: "New proof submitted for review"
  ELSE IF submitter_role = "OfficeHead" THEN
    SEND notification to Director AND Secretary: "New proof submitted for review (escalated)"
  END IF

  RETURN success: "Proof files uploaded successfully"
END PROOF UPLOAD

BEGIN PROOF VALIDATION
  RECEIVE input: proof_id, reviewer_id, decision (Accept / Reject), rejection_note

  QUERY PROOF_FILES table WHERE proof_id = input proof_id
  QUERY TRAINING_RECORDS table: GET submitter_id and submitter_role FOR this proof

  QUERY USERS table WHERE user_id = reviewer_id
  SET reviewer_role = role from query result

  // Enforce correct reviewer per two-tier rule
  IF submitter_role = "Staff" THEN
    IF reviewer_role != "OfficeHead" OR reviewer is NOT the submitter's assigned Office Head THEN
      RETURN error: "Only the submitter's assigned Office Head may validate this proof"
    END IF
  ELSE IF submitter_role = "OfficeHead" THEN
    IF reviewer_role NOT IN ("Director", "Secretary") THEN
      RETURN error: "Only the Unit Director or Secretary may validate an Office Head's proof"
    END IF
  END IF

  IF decision = "Accept" THEN
    UPDATE validation_status = "Accepted" IN PROOF_FILES table
    UPDATE validation_status = "Accepted" IN TRAINING_RECORDS table
      WHERE training_id = proof.training_id
    SEND notification to submitter:
      type = "Approval"
      message = "Your proof has been accepted"
    LOG action in REPORTS table: "Approved proof"
    CALL Completion Status Update (training_id, proof_validation_result = "Validated")
      // see Figure 3.3.3.2

  ELSE IF decision = "Reject" THEN
    IF rejection_note is empty THEN
      RETURN error: "Rejection note is required"
    END IF
    UPDATE validation_status = "Rejected" IN PROOF_FILES table
    SET rejection_note = input rejection_note
    SEND notification to submitter:
      type = "Rejection"
      message = "Your proof was rejected: " + rejection_note
    LOG action in REPORTS table: "Rejected proof"
  END IF

  RETURN success: "Proof validation recorded"
END PROOF VALIDATION
```

---

## Figure 3.3.3.4 — Pseudocode: Monitoring and Analytics Logic

```
PROCESS: Dashboard Generation and Gap Analysis

BEGIN DASHBOARD GENERATION
  RECEIVE input: authenticated user session

  IF role = "Director" OR role = "Secretary" THEN
    QUERY USERS table: COUNT all users by office
    QUERY TRAINING_RECORDS table: COUNT all records by status
    QUERY ASSIGNMENTS table: COUNT all and completed
    QUERY PROOF_FILES table: COUNT pending validations
    LOAD Central Monitoring Dashboard with retrieved data

  ELSE IF role = "OfficeHead" THEN
    QUERY USERS table WHERE office_id = user office_id
    QUERY TRAINING_RECORDS table WHERE user_id IN office staff
    QUERY ASSIGNMENTS table WHERE assigned_to IN office staff
    QUERY PROOF_FILES table WHERE submitter IN office staff
    LOAD Office Head Dashboard with center-scoped data

  ELSE IF role = "Staff" THEN
    QUERY TRAINING_RECORDS table WHERE user_id = user_id
    QUERY ASSIGNMENTS table WHERE assigned_to = user_id
    QUERY NOTIFICATIONS table WHERE receiver_id = user_id
    LOAD Staff Dashboard with personal data
  END IF
END DASHBOARD GENERATION

BEGIN GAP ANALYSIS
  RECEIVE input: office_id (or system-wide for Director/Secretary)

  QUERY OFFICES table: GET required_competencies list
  QUERY TRAINING_RECORDS table:
    GET all accepted training records
    GROUP BY user_id and category_id

  FOR EACH required competency DO
    COUNT staff with at least one accepted training in that category
    IF count = 0 THEN
      FLAG as "Competency Gap":
        message = "No active [role] identified for [competency]"
    END IF
  END FOR

  CALCULATE average training count per staff member
  FOR EACH staff member DO
    IF training count > average * 1.5 THEN
      FLAG as "Over-Participation":
        message = "[Staff name] is significantly above average training load"
    END IF
  END FOR

  RETURN gap analysis results to Dashboard Generation
END GAP ANALYSIS
```

---

## Figure 3.3.3.5 — Pseudocode: Notification and Reporting Logic

```
PROCESS: Notification Dispatch and Report Export

BEGIN NOTIFICATION DISPATCH
  RECEIVE input: sender_id, receiver_scope, subject, message

  IF message is empty THEN
    RETURN error: "Message cannot be empty"
  END IF

  IF receiver_scope = "All Staff" THEN
    QUERY USERS table WHERE role = "Staff"
    SET receivers = all staff user_ids

  ELSE IF receiver_scope = specific office THEN
    QUERY USERS table WHERE office_id = selected office_id
    SET receivers = all office user_ids

  ELSE IF receiver_scope = specific user THEN
    SET receivers = [selected user_id]
  END IF

  FOR EACH receiver in receivers DO
    INSERT record into NOTIFICATIONS table:
      sender_id = sender_id
      receiver_id = receiver
      message = message
      type = "Announcement"
      is_read = FALSE
      sent_at = CURRENT TIMESTAMP
  END FOR

  RETURN success: "Notification sent to [count] users"
END NOTIFICATION DISPATCH

BEGIN REPORT EXPORT
  RECEIVE input: user_id, report_scope, filters (office, period, role, category)

  QUERY USERS table WHERE user_id = user_id
  SET requester_role = role from query result

  IF requester_role = "Director" OR requester_role = "Secretary" THEN
    QUERY TRAINING_RECORDS, USERS, OFFICES tables
    APPLY filters: office, period, role, category

  ELSE IF requester_role = "OfficeHead" THEN
    QUERY TRAINING_RECORDS, USERS tables
      WHERE office_id = user office_id
    APPLY filters: period, role, category

  ELSE IF requester_role = "Staff" THEN
    QUERY TRAINING_RECORDS table
      WHERE user_id = user_id
    APPLY filters: role, category
  END IF

  GENERATE file in requested format (CSV or printable PDF)
  LOG action in REPORTS table: "Report exported", generated_by = user_id
  RETURN file to requester
END REPORT EXPORT
```

---

## Figure 3.3.3.6 — Pseudocode: Training Category Management Logic

```
PROCESS: Training Category Management

BEGIN CATEGORY CREATION
  RECEIVE input: admin_id, category_name

  QUERY USERS table WHERE user_id = admin_id
  IF admin_id role NOT IN ("Director", "Secretary") THEN
    RETURN error: "Only the Unit Director or Secretary may manage categories"
  END IF

  IF category_name already exists in CATEGORIES table WHERE type = "Training" THEN
    RETURN error: "Category already exists"
  END IF

  INSERT new record into CATEGORIES table:
    category_name = input category_name
    category_type = "Training"
    is_active = TRUE

  LOG action in REPORTS table: "Category created", generated_by = admin_id
  RETURN success: "Category created"
END CATEGORY CREATION

BEGIN CATEGORY EDIT / MERGE / DEACTIVATE
  RECEIVE input: admin_id, category_id, new_name (optional), merge_into_id (optional),
                 action (Edit / Merge / Deactivate)

  QUERY USERS table WHERE user_id = admin_id
  IF admin_id role NOT IN ("Director", "Secretary") THEN
    RETURN error: "Only the Unit Director or Secretary may manage categories"
  END IF

  IF action = "Edit" THEN
    UPDATE category_name = new_name IN CATEGORIES table
      WHERE category_id = category_id

  ELSE IF action = "Merge" THEN
    UPDATE category_id = merge_into_id IN TRAINING_RECORDS table
      WHERE category_id = category_id
    UPDATE is_active = FALSE IN CATEGORIES table
      WHERE category_id = category_id
    // Categories are shared system-wide, not per-office, so a merge applies globally

  ELSE IF action = "Deactivate" THEN
    UPDATE is_active = FALSE IN CATEGORIES table
      WHERE category_id = category_id
    // Existing records keep their category_id reference;
    // deactivated categories are simply hidden from new-entry dropdowns.
  END IF

  LOG action in REPORTS table: "Category modified", generated_by = admin_id
  RETURN success: "Category updated"
END CATEGORY EDIT / MERGE / DEACTIVATE
```

---

## Figure 3.3.3.7 — Pseudocode: Skills Tracking and Matching Logic

```
PROCESS: Skill Tagging, Auto-Population, and Search

BEGIN SKILL TAGGING
  RECEIVE input: tagger_id, training_id, skill_ids[]

  QUERY USERS table WHERE user_id = tagger_id
  IF tagger_id role NOT IN ("Director", "Secretary", "OfficeHead") THEN
    RETURN error: "Only the Director, Secretary, or Office Head may tag skills"
  END IF

  FOR EACH skill_id in skill_ids DO
    INSERT record into EVENT_REQUIRED_SKILLS table:
      training_id = training_id
      skill_id = skill_id
  END FOR

  RETURN success: "Skills tagged to training"
END SKILL TAGGING

BEGIN AUTO-POPULATE SKILL PROFILE
  // Triggered by Completion Status Update (Figure 3.3.3.2) when a
  // tagged training reaches "Completed"
  RECEIVE input: training_id, user_id

  QUERY EVENT_REQUIRED_SKILLS table WHERE training_id = training_id
  SET tagged_skills = result list

  FOR EACH skill_id in tagged_skills DO
    IF skill_id NOT ALREADY in STAFF_SKILLS table for user_id THEN
      INSERT record into STAFF_SKILLS table:
        user_id = user_id
        skill_id = skill_id
        date_acquired = CURRENT DATE
    END IF
  END FOR

  RETURN success: "Skill profile updated"
END AUTO-POPULATE SKILL PROFILE

BEGIN MANUAL BACKGROUND SKILL ENTRY
  RECEIVE input: user_id, skill_name, category

  QUERY SKILLS table WHERE skill_name = input skill_name
  IF skill does not exist THEN
    INSERT new record into SKILLS table: skill_name, category
  END IF

  INSERT record into STAFF_SKILLS table:
    user_id = user_id
    skill_id = matched or newly created skill_id
    date_acquired = CURRENT DATE

  RETURN success: "Background skill added to profile"
END MANUAL BACKGROUND SKILL ENTRY

BEGIN SKILL SEARCH
  RECEIVE input: requester_id, skill_query

  QUERY USERS table WHERE user_id = requester_id
  SET requester_role = role from query result

  IF requester_role NOT IN ("Director", "Secretary", "OfficeHead") THEN
    RETURN error: "Only the Director, Secretary, or Office Head may search staff by skill"
  END IF

  QUERY SKILLS table WHERE skill_name MATCHES skill_query
  QUERY STAFF_SKILLS table WHERE skill_id IN matched skills
  JOIN USERS table to retrieve staff details

  IF requester_role = "OfficeHead" THEN
    FILTER results WHERE office_id = requester_id office_id
    // Office Head search is scoped to their own center only
  END IF
  // Director and Secretary receive system-wide results (no filter applied)

  RETURN list of matching staff with skill and office details
END SKILL SEARCH
```

---

## Figure 3.3.3.8 — Pseudocode: Partner Institution Management Logic

```
PROCESS: Partner Institution CRUD, Agreement Tracking, and Contribution Logging

BEGIN PARTNER RECORD CREATE / UPDATE / DELETE
  RECEIVE input: admin_id, action (Create / Update / Delete), partner_id (if Update/Delete),
                 org_name, type, contact_info, lead_office_id

  QUERY USERS table WHERE user_id = admin_id
  IF admin_id role NOT IN ("Director", "Secretary") THEN
    RETURN error: "Only the Unit Director or Secretary may modify partner records"
  END IF

  IF action = "Create" THEN
    IF lead_office_id is empty THEN
      RETURN error: "Lead implementing office is required"
    END IF
    INSERT new record into PARTNER_INSTITUTIONS table:
      org_name = org_name
      type = type
      contact_info = contact_info
      lead_office_id = lead_office_id
      // lead_office_id = the SDU center actually running the partnership day-to-day,
      // which may differ from the legal MOU signatory (e.g. a university-level MOU)
  ELSE IF action = "Update" THEN
    UPDATE PARTNER_INSTITUTIONS table SET org_name, type, contact_info, lead_office_id
      WHERE partner_id = partner_id
  ELSE IF action = "Delete" THEN
    DELETE FROM PARTNER_INSTITUTIONS table WHERE partner_id = partner_id
  END IF

  LOG action in REPORTS table: "Partner record modified", generated_by = admin_id
  RETURN success: "Partner institution record updated"
END PARTNER RECORD CREATE / UPDATE / DELETE

BEGIN MOU / AGREEMENT UPLOAD
  RECEIVE input: admin_id, partner_id, mou_file, expiry_date

  QUERY USERS table WHERE user_id = admin_id
  IF admin_id role NOT IN ("Director", "Secretary") THEN
    RETURN error: "Only the Unit Director or Secretary may upload agreements"
  END IF

  STORE mou_file in server storage
  INSERT record into PARTNER_AGREEMENTS table:
    partner_id = partner_id
    mou_file = stored file path
    expiry_date = expiry_date

  RETURN success: "Agreement uploaded"
END MOU / AGREEMENT UPLOAD

BEGIN AGREEMENT EXPIRY CHECK
  // Runs on a scheduled basis (e.g., daily)
  QUERY PARTNER_AGREEMENTS table WHERE expiry_date <= (CURRENT DATE + 30 days)

  FOR EACH agreement in results DO
    IF expiry_date <= CURRENT DATE THEN
      FLAG as "Expired"
    ELSE
      FLAG as "Expiring Soon"
    END IF
    SEND notification to Director AND Secretary:
      message = "Partner agreement for [org_name] is [Expired / Expiring Soon]"
  END FOR
END AGREEMENT EXPIRY CHECK

BEGIN CONTRIBUTION LOGGING
  RECEIVE input: admin_id, partner_id, type (Cash / In-Kind), value, description, date

QUERY USERS table WHERE user_id = admin_id
SET actor_role = role from query result

IF actor_role NOT IN ("Director", "Secretary", "OfficeHead") THEN
  RETURN error: "You are not authorized to modify partner records"
END IF

IF actor_role = "OfficeHead" THEN
  IF action = "Create" AND lead_office_id != admin_id.office_id THEN
    RETURN error: "Office Head may only create partner records for their own office"
  ELSE IF action IN ("Update", "Delete") THEN
    QUERY PARTNER_INSTITUTIONS table WHERE partner_id = partner_id
    IF lead_office_id != admin_id.office_id THEN
      RETURN error: "Office Head may only modify partner records associated with their own office"
    END IF
  END IF
END IF

  INSERT record into CONTRIBUTIONS table:
    partner_id = partner_id
    type = type
    value = value
    description = description
    date = date

  RETURN success: "Contribution logged"
END CONTRIBUTION LOGGING
```

---

## Figure 3.3.3.9 — Pseudocode: Evaluation Logic (UPDATED — added category management)

```
PROCESS: Post-Training Skill Rating, Trend Retrieval, and Evaluation Category Management

BEGIN RATING INPUT
  RECEIVE input: evaluator_id, staff_id, training_id, skill_id, category_id, rating (1-5), comment

  QUERY USERS table WHERE user_id = evaluator_id
  IF evaluator_id role != "OfficeHead" THEN
    RETURN error: "Only the Office Head may submit competency ratings"
  END IF

  QUERY USERS table WHERE user_id = staff_id
  IF staff_id office_id != evaluator_id office_id THEN
    RETURN error: "You may only rate staff within your own center"
  END IF

  QUERY TRAINING_RECORDS table WHERE training_id = training_id
  IF completion_status != "Completed" THEN
    RETURN error: "Evaluation requires a completed training record"
  END IF

  IF rating < 1 OR rating > 5 THEN
    RETURN error: "Rating must be between 1 and 5"
  END IF

  INSERT record into EVALUATIONS table:
    staff_id = staff_id
    evaluated_by = evaluator_id
    training_id = training_id
    skill_id = skill_id
    category_id = category_id
    rating_1_to_5 = rating
    comment = comment
    date_evaluated = CURRENT DATE

  SEND notification to staff_id: "You have received a new competency rating"
  RETURN success: "Evaluation submitted"
END RATING INPUT

BEGIN RATING TREND RETRIEVAL
  RECEIVE input: requester_id, target_staff_id

  QUERY USERS table WHERE user_id = requester_id
  SET requester_role = role from query result

  IF requester_role = "Staff" AND requester_id != target_staff_id THEN
    RETURN error: "Staff may only view their own evaluation history"
  END IF

  IF requester_role = "OfficeHead" THEN
    QUERY USERS table WHERE user_id = target_staff_id
    IF target_staff_id office_id != requester_id office_id THEN
      RETURN error: "You may only view evaluations for staff in your own center"
    END IF
  END IF

  QUERY EVALUATIONS table WHERE staff_id = target_staff_id
  ORDER BY date_evaluated ASCENDING

  RETURN rating history grouped by skill_id, for trend display
END RATING TREND RETRIEVAL

BEGIN EVALUATION CATEGORY MANAGEMENT
  RECEIVE input: admin_id, category_name, action (Create / Edit / Deactivate), category_id (if Edit/Deactivate)

  QUERY USERS table WHERE user_id = admin_id
  IF admin_id role NOT IN ("Director", "Secretary") THEN
    RETURN error: "Only the Unit Director or Secretary may manage evaluation categories"
  END IF

  IF action = "Create" THEN
    INSERT new record into CATEGORIES table:
      category_name = category_name
      category_type = "Evaluation"
      is_active = TRUE
  ELSE IF action = "Edit" THEN
    UPDATE category_name = category_name IN CATEGORIES table
      WHERE category_id = category_id
  ELSE IF action = "Deactivate" THEN
    UPDATE is_active = FALSE IN CATEGORIES table
      WHERE category_id = category_id
  END IF

  LOG action in REPORTS table: "Evaluation category modified", generated_by = admin_id
  RETURN success: "Evaluation category updated"
END EVALUATION CATEGORY MANAGEMENT
```

---
