# CH3_CHECK.md

Comparison of `MD FILES/CHAPTER_3_REVISED.md` against `MD FILES/CH3_SPEC.md`, `MD FILES/PROTOTYPE_INVENTORY.md`, `MD FILES/PSEUDOCODE_DRAFT.md`, and `database/schema.sql`.

This file only lists differences. Nothing was changed.

Line numbers refer to `MD FILES/CHAPTER_3_REVISED.md`.

---

## 1. Prohibited-topic mentions

The chapter uses the correct system name (SDU-STMS). No occurrence of "ISCBMS", "ISCMS", or "capacity building" was found. The following terms do appear:

- **Secretary** — line 190, "a Secretary subtype".
- **budget** — line 190, "budget entities".
- **proof review / proof validation** — line 190, "proof review"; line 92, "There is no review or approval step"; line 230, "There is no review or approval step".
- **messaging / inbox** — line 190, "messages or an inbox"; line 303, "there is no inbox and no direct messaging".
- **numeric rating** — line 113, "There is no numeric rating"; line 190, "numeric ratings"; line 272, "There is no numeric rating".

All of these are negative statements that exclude the topic, but each still names it.

Related prototype-only residue (not in the chapter): `PROTOTYPE_INVENTORY.md` section 6 and `PSEUDOCODE_DRAFT.md` sections 1, 4, and 7 reference the Secretary role in leftover code, and the prototype stores file names only.

---

## 2. Required/nullability mismatches: data dictionary (3.4.2) vs `schema.sql`

- **users.notify_email** — data dictionary (line 373) says **Null**; `schema.sql` (line 48) is **NOT NULL DEFAULT true**.
- **users.notify_system** — data dictionary (line 374) says **Null**; `schema.sql` (line 49) is **NOT NULL DEFAULT true**.
- **notifications.recipient_scope** — data dictionary (line 539) says **Required**; `schema.sql` (line 237) is **nullable**.

Related internal inconsistency in the chapter's table list:
- Chapter 3.4.1, line 314 shows `notify_email BOOLEAN; notify_system BOOLEAN` with no NOT NULL, which agrees with the data dictionary but disagrees with `schema.sql`.
- Chapter 3.4.1, line 327 shows `recipient_scope ENUM(...)` with no marker, which agrees with `schema.sql` (nullable) but disagrees with the data dictionary (Required).
- `CH3_SPEC.md` (lines 143 and 156) leaves all three fields unmarked, so the spec does not settle the question.

No other field required/null state differs between the data dictionary and `schema.sql`.

---

## 3. ON DELETE mismatches: chapter 3.4.1 / spec vs `schema.sql`

Chapter 3.4.1 (line 330) and `CH3_SPEC.md` (line 159) say CASCADE applies to roles, tags, assignees, agreements, and contributions. `schema.sql` also uses CASCADE on:

- **assignment_competencies.assignment_id** (`schema.sql` line 162) — competencies not listed.
- **certificates.training_record_id** (`schema.sql` line 148) — certificates not listed.
- **certificates.assignment_assignee_id** (`schema.sql` line 149) — certificates not listed.
- **training_evaluations.training_record_id** (`schema.sql` line 173) — evaluations not listed.

All RESTRICT rules for `offices`, `users`, and `categories` in `schema.sql` match the chapter and spec.

---

## 4. Table and field name differences

- No table name or column name in chapter 3.4.1 or the data dictionary (3.4.2) differs from `schema.sql`. All sixteen table names and all field names match.
- **Entity vs table naming form**: the ERD (3.3.2) uses singular uppercase entity names (OFFICE, USER, CATEGORY, TRAINING_RECORD, TRAINING_RECORD_ROLE, TRAINING_RECORD_TAG, CERTIFICATE, ASSIGNMENT, ASSIGNMENT_ASSIGNEE, ASSIGNMENT_COMPETENCY, TRAINING_EVALUATION, PARTNER_INSTITUTION, PARTNER_AGREEMENT, PARTNER_CONTRIBUTION, NOTIFICATION, ACTION_HISTORY), while `schema.sql` uses plural lowercase table names (offices, users, categories, training_records, training_record_roles, training_record_tags, certificates, assignments, assignment_assignees, assignment_competencies, training_evaluations, partner_institutions, partner_agreements, partner_contributions, notifications, action_history). This follows the spec convention but the two forms do not match each other.

---

## 5. Role, status, and option list differences

- **Assignment status value name** — the prototype stores `awaiting_proof` (`PROTOTYPE_INVENTORY.md` section 3); the chapter and `schema.sql` use `awaiting_certificate`.
- **Legacy status** — the prototype also reads a legacy `proof_pending` value (`PROTOTYPE_INVENTORY.md` section 3). This value is not in the chapter's status enum or `schema.sql` (the chapter's open items mention a legacy value but do not name it).
- **Evaluation level** — the prototype offers an explicit `Not set` option (`PROTOTYPE_INVENTORY.md` evaluation form); the chapter and `schema.sql` define only `demonstrated`, `partially_demonstrated`, and `not_demonstrated`, with absence represented as NULL.
- **Training record status** — the prototype derives Upcoming / Ongoing / Completed from dates (`PSEUDOCODE_DRAFT.md` section 3, step 14); the chapter has no training-record status.
- **Secretary in option/role lists** — the prototype's leftover code includes `secretary` in role lists and notification titles (`PROTOTYPE_INVENTORY.md` section 6); the chapter lists only Unit Director, Office Head, and Staff.
- The following otherwise match across the chapter, spec, prototype, and `schema.sql`: roles (unit_director, office_head, staff); account status (pending, active, rejected, inactive); assignment status (pending, awaiting_certificate, completed, cancelled) plus derived Overdue; participation roles (participant, facilitator, organizer, speaker, host_emcee, documenter); category type (training, competency, knowledge); nature (internal, external); scope (local, regional, national, international); record type (attended, conducted); partner type (local_government, national_government, ngo, academic_institution, humanitarian, faith_based, private_sector); contribution period (yearly, quarterly, semestral); notification type (account_status, assignment, certificate_uploaded, partner_expiry, announcement); recipient scope (user, office_staff, office_head, all_staff, all_heads, role).

---

## 6. Chapter features not present in the browser prototype

The chapter describes the planned Laravel/PostgreSQL system, and chapter 3.1 states the prototype has no backend. These chapter behaviors are not implemented in the prototype (listed for completeness):

- Credential validation against an **Active** account (3.3.3, module A). The prototype checks only three fixed email addresses and never checks the password (`PSEUDOCODE_DRAFT.md` section 1; `STMS_GUIDE.md` section 3).
- Account approval/rejection that sets account status and writes action history (3.3.3, module B). The prototype only shows a notification and removes the on-screen row (`PSEUDOCODE_DRAFT.md` section 2; `PROTOTYPE_INVENTORY.md` section 7.1).
- Server-side role-based access control and PostgreSQL persistence (3.1, 3.4.5). The prototype is client-side with browser storage only.
- Cloudinary file storage referenced by `file_reference` (3.1, 3.4.5). The prototype stores file names and sizes only (`STMS_GUIDE.md` sections 6 and 14).
- Scheduled `pg_dump` database backups (3.4.5). The prototype has none.
- Transactions for multi-table saves (3.4.4). The prototype has none.
- **90-day "expiring soon" window** (3.3.3, module L; 3.4.1 line 326 implies near/past). The 90-day figure is in `PSEUDOCODE_DRAFT.md` section 12 but is not stated in `CH3_SPEC.md`.

---

## 7. Prototype or spec features missing from the chapter

- **Partner contribution "in-kind value"** — the prototype contribution rows include an in-kind value (`STMS_GUIDE.md` section 8). The chapter and `schema.sql` `partner_contributions` contain only `training_count` and `staff_reached`.
- **Office Head dashboard "Top Performers" card** — present in the prototype (`PROTOTYPE_INVENTORY.md` section 1); not in the chapter's dashboard cards (3.3.1, 6.1).
- **Recycle-bin behavior and restore** — the prototype has a Recycle Bin (`PROTOTYPE_INVENTORY.md` section 1 and 6; `STMS_GUIDE.md` section 9). The chapter replaces this with the `deleted_at` soft-delete marker (3.3.2 line 190; 3.4.1).
- **Simulated password change** — the prototype profile pages include a change-password control (`PROTOTYPE_INVENTORY.md` profile forms). The chapter has no password-change sub-process; only Bcrypt authentication (3.4.5).
- **Notification store cap of 500** — the prototype caps stored notifications at the most recent 500 (`PSEUDOCODE_DRAFT.md` section 13). Not stated in the chapter.
- **Recipient name** — the prototype and pseudocode address notices to a named person (`PSEUDOCODE_DRAFT.md` section 13; chapter 3.3.3, module M, step 2 says "recipient name is empty or matches the user's name"), but the `notifications` table only has `recipient_user_id` and no recipient-name column (chapter 3.4.1 line 327; `schema.sql` line 238).

---

## 8. Other internal inconsistencies in the chapter

- **created_at blanket claim** — chapter 3.4.1, line 311 states "every table carries a created_at timestamp." Neither `schema.sql` nor `CH3_SPEC.md` (line 140 and the table list) gives `created_at` to `offices`, `training_record_roles`, `training_record_tags`, `assignment_assignees`, `assignment_competencies`, or `partner_contributions`, and it uses `uploaded_at` for `certificates` and `partner_agreements` and `status_updated_at` for `assignment_assignees`.
- **notify_email / notify_system** — three-way disagreement: data dictionary Null (lines 373-374), chapter 3.4.1 no marker (line 314), `schema.sql` NOT NULL DEFAULT true (lines 48-49).
- **recipient_scope** — three-way disagreement: data dictionary Required (line 539), chapter 3.4.1 no marker (line 327), `schema.sql` nullable (line 237).
