-- SDU-STMS database schema (PostgreSQL)
-- Generated from MD FILES/CH3_SPEC.md section 3.4.1 (16 tables).
-- Conventions: integer primary key id on every table except the pure link tables
-- (training_record_tags, assignment_competencies); created_at timestamps; soft delete
-- with deleted_at where noted.

-- ============================================================
-- Enumerated types
-- ============================================================
CREATE TYPE user_role            AS ENUM ('unit_director', 'office_head', 'staff');
CREATE TYPE account_status       AS ENUM ('pending', 'active', 'rejected', 'inactive');
CREATE TYPE category_type        AS ENUM ('training', 'competency', 'knowledge');
CREATE TYPE training_nature      AS ENUM ('internal', 'external');
CREATE TYPE training_scope       AS ENUM ('local', 'regional', 'national', 'international');
CREATE TYPE training_record_type AS ENUM ('attended', 'conducted');
CREATE TYPE participation_role   AS ENUM ('participant', 'facilitator', 'organizer', 'speaker', 'host_emcee', 'documenter');
CREATE TYPE assignment_status    AS ENUM ('pending', 'awaiting_certificate', 'completed', 'cancelled');
CREATE TYPE evaluation_level     AS ENUM ('demonstrated', 'partially_demonstrated', 'not_demonstrated');
CREATE TYPE partner_type         AS ENUM ('local_government', 'national_government', 'ngo', 'academic_institution', 'humanitarian', 'faith_based', 'private_sector');
CREATE TYPE contribution_period  AS ENUM ('yearly', 'quarterly', 'semestral');
CREATE TYPE notification_type    AS ENUM ('account_status', 'assignment', 'certificate_uploaded', 'partner_expiry', 'announcement');
CREATE TYPE recipient_scope      AS ENUM ('user', 'office_staff', 'office_head', 'all_staff', 'all_heads', 'role');

-- ============================================================
-- 1. offices
-- ============================================================
CREATE TABLE offices (
    id   serial PRIMARY KEY,
    code text NOT NULL UNIQUE,   -- SDU, ACCA, ACES, ACLG, APC, CCES, ALTEC
    name text NOT NULL
);

-- ============================================================
-- 2. users
-- ============================================================
CREATE TABLE users (
    id                serial PRIMARY KEY,
    office_id         integer NOT NULL REFERENCES offices (id) ON DELETE RESTRICT,
    name              text NOT NULL,
    email             text NOT NULL UNIQUE,
    password_hash     text NOT NULL,
    role              user_role NOT NULL,
    status            account_status NOT NULL DEFAULT 'pending',
    rejection_reason  text,
    contact_number    text,
    employment_status text,
    job_function      text,
    notify_email      boolean NOT NULL DEFAULT true,
    notify_system     boolean NOT NULL DEFAULT true,
    created_at        timestamp NOT NULL DEFAULT now(),
    deleted_at        timestamp
);

-- ============================================================
-- 3. categories
-- ============================================================
CREATE TABLE categories (
    id         serial PRIMARY KEY,
    type       category_type NOT NULL,
    name       text NOT NULL,
    is_active  boolean NOT NULL DEFAULT true,
    created_at timestamp NOT NULL DEFAULT now(),
    UNIQUE (type, name)
);

-- ============================================================
-- 4. training_records
-- ============================================================
CREATE TABLE training_records (
    id          serial PRIMARY KEY,
    user_id     integer NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    category_id integer NOT NULL REFERENCES categories (id) ON DELETE RESTRICT,
    title       text NOT NULL,
    venue       text NOT NULL,
    start_date  date NOT NULL,
    end_date    date NOT NULL,
    nature      training_nature NOT NULL,
    scope       training_scope NOT NULL,
    record_type training_record_type NOT NULL,
    description text,
    created_at  timestamp NOT NULL DEFAULT now(),
    updated_at  timestamp NOT NULL DEFAULT now(),
    deleted_at  timestamp,
    CHECK (end_date >= start_date)
);
-- category_id must reference a category of type 'training' (application-enforced).

-- ============================================================
-- 5. training_record_roles
-- ============================================================
CREATE TABLE training_record_roles (
    id                 serial PRIMARY KEY,
    training_record_id integer NOT NULL REFERENCES training_records (id) ON DELETE CASCADE,
    role               participation_role NOT NULL,
    UNIQUE (training_record_id, role)
);
-- At least one role per training record is enforced by the application.

-- ============================================================
-- 6. training_record_tags
-- ============================================================
CREATE TABLE training_record_tags (
    training_record_id integer NOT NULL REFERENCES training_records (id) ON DELETE CASCADE,
    category_id        integer NOT NULL REFERENCES categories (id) ON DELETE RESTRICT,
    PRIMARY KEY (training_record_id, category_id)
);
-- category_id must reference a category of type 'competency' or 'knowledge' (application-enforced).

-- ============================================================
-- 8. assignments
-- ============================================================
CREATE TABLE assignments (
    id          serial PRIMARY KEY,
    assigned_by integer NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    category_id integer REFERENCES categories (id) ON DELETE RESTRICT,
    title       text NOT NULL,
    description text,
    deadline    date NOT NULL,
    nature      training_nature,
    scope       training_scope,
    venue       text,
    created_at  timestamp NOT NULL DEFAULT now(),
    deleted_at  timestamp
);
-- category_id must reference a category of type 'training' (application-enforced).

-- ============================================================
-- 9. assignment_assignees
-- ============================================================
CREATE TABLE assignment_assignees (
    id                serial PRIMARY KEY,
    assignment_id     integer NOT NULL REFERENCES assignments (id) ON DELETE CASCADE,
    user_id           integer NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    role              participation_role NOT NULL DEFAULT 'participant',
    status            assignment_status NOT NULL DEFAULT 'pending',
    status_updated_at timestamp,
    UNIQUE (assignment_id, user_id)
);
-- Overdue is derived at read time (status is not completed or cancelled and the current
-- date is greater than the deadline plus seven days) and is not stored.

-- ============================================================
-- 7. certificates
-- (defined after assignment_assignees because it references that table)
-- ============================================================
CREATE TABLE certificates (
    id                     serial PRIMARY KEY,
    training_record_id     integer REFERENCES training_records (id) ON DELETE CASCADE,
    assignment_assignee_id integer REFERENCES assignment_assignees (id) ON DELETE CASCADE,
    file_name              text NOT NULL,
    file_reference         text NOT NULL,
    file_size              integer,
    note                   text,
    uploaded_at            timestamp NOT NULL DEFAULT now(),
    CHECK (num_nonnulls(training_record_id, assignment_assignee_id) = 1)
);

-- ============================================================
-- 10. assignment_competencies
-- ============================================================
CREATE TABLE assignment_competencies (
    assignment_id integer NOT NULL REFERENCES assignments (id) ON DELETE CASCADE,
    category_id   integer NOT NULL REFERENCES categories (id) ON DELETE RESTRICT,
    PRIMARY KEY (assignment_id, category_id)
);
-- category_id must reference a category of type 'competency' (application-enforced).

-- ============================================================
-- 11. training_evaluations
-- ============================================================
CREATE TABLE training_evaluations (
    id                     serial PRIMARY KEY,
    training_record_id     integer NOT NULL UNIQUE REFERENCES training_records (id) ON DELETE CASCADE,
    recorded_by            integer NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    participants_responded integer NOT NULL CHECK (participants_responded >= 0),
    feedback_summary       text NOT NULL,
    role_feedback          text,
    level                  evaluation_level,
    created_at             timestamp NOT NULL DEFAULT now(),
    updated_at             timestamp NOT NULL DEFAULT now()
);
-- training_record_id must reference a record whose record_type is 'conducted' (application-enforced).

-- ============================================================
-- 12. partner_institutions
-- ============================================================
CREATE TABLE partner_institutions (
    id             serial PRIMARY KEY,
    lead_office_id integer NOT NULL REFERENCES offices (id) ON DELETE RESTRICT,
    created_by     integer REFERENCES users (id) ON DELETE RESTRICT,
    name           text NOT NULL,
    type           partner_type,
    contact_person text NOT NULL,
    email          text NOT NULL,
    phone          text,
    expiry_date    date NOT NULL,
    signed_by      text NOT NULL,
    created_at     timestamp NOT NULL DEFAULT now(),
    updated_at     timestamp NOT NULL DEFAULT now(),
    deleted_at     timestamp
);

-- ============================================================
-- 13. partner_agreements
-- ============================================================
CREATE TABLE partner_agreements (
    id             serial PRIMARY KEY,
    partner_id     integer NOT NULL REFERENCES partner_institutions (id) ON DELETE CASCADE,
    file_name      text NOT NULL,
    file_reference text NOT NULL,
    uploaded_at    timestamp NOT NULL DEFAULT now()
);

-- ============================================================
-- 14. partner_contributions
-- ============================================================
CREATE TABLE partner_contributions (
    id             serial PRIMARY KEY,
    partner_id     integer NOT NULL REFERENCES partner_institutions (id) ON DELETE CASCADE,
    period_type    contribution_period,
    period_label   text NOT NULL,
    training_count integer CHECK (training_count >= 0),
    staff_reached  integer CHECK (staff_reached >= 0)
);
-- Contribution figures are logged by the Unit Director, or by an Office Head for the
-- partners of the own office. The prototype only displays the summaries and has no entry form.

-- ============================================================
-- 15. notifications
-- ============================================================
CREATE TABLE notifications (
    id                  serial PRIMARY KEY,
    sender_id           integer REFERENCES users (id) ON DELETE RESTRICT,   -- NULL means the system
    type                notification_type NOT NULL,
    title               varchar(100) NOT NULL,
    message             varchar(1000) NOT NULL,
    recipient_scope     recipient_scope,
    recipient_user_id   integer REFERENCES users (id) ON DELETE RESTRICT,
    recipient_office_id integer REFERENCES offices (id) ON DELETE RESTRICT,
    created_at          timestamp NOT NULL DEFAULT now()
);

-- ============================================================
-- 16. action_history
-- ============================================================
CREATE TABLE action_history (
    id          serial PRIMARY KEY,
    user_id     integer NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    action_type text NOT NULL,
    summary     text NOT NULL,
    created_at  timestamp NOT NULL DEFAULT now()
);
