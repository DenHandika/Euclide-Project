-- Euclide owns a separate schema; application access goes through server APIs.
CREATE SCHEMA IF NOT EXISTS euclide;

CREATE TABLE euclide.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(trim(name)) > 0),
  email text NOT NULL CHECK (email = lower(trim(email))),
  role text NOT NULL CHECK (role IN ('admin','tentor','siswa')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','nonactive','suspended','graduated','leave')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email)
);
CREATE TABLE euclide.student_profiles (
  user_id uuid PRIMARY KEY REFERENCES euclide.users(id),
  nis text NOT NULL UNIQUE,
  phone text,
  cohort_year smallint NOT NULL,
  enrollment_ends_at date
);
CREATE TABLE euclide.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  room text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','upcoming','completed'))
);
CREATE TABLE euclide.class_tutors (
  class_id uuid REFERENCES euclide.classes(id),
  tutor_id uuid REFERENCES euclide.users(id),
  PRIMARY KEY (class_id,tutor_id)
);
CREATE TABLE euclide.class_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES euclide.classes(id),
  weekday smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  starts_at time NOT NULL,
  ends_at time NOT NULL CHECK (ends_at > starts_at)
);
CREATE TABLE euclide.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES euclide.classes(id),
  student_id uuid NOT NULL REFERENCES euclide.student_profiles(user_id),
  status text NOT NULL CHECK (status IN ('waiting','accepted','cancelled','completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (class_id,student_id)
);
CREATE INDEX enrollments_active_class_idx ON euclide.enrollments(class_id) WHERE status = 'accepted';
CREATE INDEX enrollments_student_idx ON euclide.enrollments(student_id);

CREATE TABLE euclide.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL REFERENCES euclide.users(id),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE euclide.question_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES euclide.questions(id),
  version integer NOT NULL CHECK (version > 0),
  type text NOT NULL CHECK (type IN ('single_choice','multi_select','short_answer','essay')),
  subject text NOT NULL,
  chapter text,
  prompt text NOT NULL,
  stimulus text,
  image_url text,
  options jsonb NOT NULL DEFAULT '[]' CHECK (jsonb_typeof(options) = 'array'),
  max_score numeric(10,4) NOT NULL CHECK (max_score > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (question_id,version)
);
CREATE TABLE euclide.answer_keys (
  version_id uuid PRIMARY KEY REFERENCES euclide.question_versions(id),
  answer jsonb NOT NULL,
  explanation text NOT NULL DEFAULT '',
  rubric text,
  case_sensitive boolean NOT NULL DEFAULT false
);
CREATE TABLE euclide.tryouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','closed')),
  opens_at timestamptz,
  closes_at timestamptz,
  violation_limit integer NOT NULL DEFAULT 3 CHECK (violation_limit > 0),
  CHECK (closes_at IS NULL OR opens_at IS NULL OR closes_at > opens_at)
);
CREATE TABLE euclide.tryout_subtests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tryout_id uuid NOT NULL REFERENCES euclide.tryouts(id),
  subject text NOT NULL,
  title text NOT NULL,
  position integer NOT NULL CHECK (position >= 0),
  duration_seconds integer NOT NULL CHECK (duration_seconds > 0),
  weight numeric(10,4) NOT NULL DEFAULT 1 CHECK (weight > 0),
  UNIQUE (tryout_id,position),
  UNIQUE (id,tryout_id)
);
CREATE TABLE euclide.tryout_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tryout_id uuid NOT NULL REFERENCES euclide.tryouts(id),
  subtest_id uuid NOT NULL,
  version_id uuid NOT NULL REFERENCES euclide.question_versions(id),
  position integer NOT NULL CHECK (position >= 0),
  FOREIGN KEY (subtest_id,tryout_id) REFERENCES euclide.tryout_subtests(id,tryout_id),
  UNIQUE (subtest_id,position),
  UNIQUE (tryout_id,version_id),
  UNIQUE (id,tryout_id)
);
CREATE TABLE euclide.exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tryout_id uuid NOT NULL REFERENCES euclide.tryouts(id),
  student_id uuid NOT NULL REFERENCES euclide.student_profiles(user_id),
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','pending_grading','final')),
  started_at timestamptz NOT NULL,
  deadline_at timestamptz NOT NULL,
  submitted_at timestamptz,
  submit_reason text CHECK (submit_reason IN ('student','expired','violations')),
  UNIQUE (tryout_id,student_id),
  UNIQUE (id,tryout_id),
  CHECK (deadline_at > started_at)
);
CREATE INDEX attempts_expiry_idx ON euclide.exam_attempts(deadline_at) WHERE status = 'in_progress';
CREATE INDEX attempts_student_idx ON euclide.exam_attempts(student_id,started_at DESC);
CREATE TABLE euclide.attempt_subtests (
  attempt_id uuid NOT NULL,
  tryout_id uuid NOT NULL,
  subtest_id uuid NOT NULL,
  starts_at timestamptz NOT NULL,
  deadline_at timestamptz NOT NULL,
  FOREIGN KEY (attempt_id,tryout_id) REFERENCES euclide.exam_attempts(id,tryout_id),
  FOREIGN KEY (subtest_id,tryout_id) REFERENCES euclide.tryout_subtests(id,tryout_id),
  PRIMARY KEY (attempt_id,subtest_id),
  CHECK (deadline_at > starts_at)
);
CREATE TABLE euclide.answers (
  attempt_id uuid NOT NULL,
  tryout_id uuid NOT NULL,
  tryout_question_id uuid NOT NULL,
  answer jsonb NOT NULL,
  flagged boolean NOT NULL DEFAULT false,
  revision integer NOT NULL CHECK (revision > 0),
  received_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  FOREIGN KEY (attempt_id,tryout_id) REFERENCES euclide.exam_attempts(id,tryout_id),
  FOREIGN KEY (tryout_question_id,tryout_id) REFERENCES euclide.tryout_questions(id,tryout_id),
  PRIMARY KEY (attempt_id,tryout_question_id)
);
CREATE TABLE euclide.essay_grades (
  attempt_id uuid NOT NULL,
  tryout_question_id uuid NOT NULL,
  score numeric(5,2) NOT NULL CHECK (score BETWEEN 0 AND 100),
  feedback text NOT NULL DEFAULT '',
  graded_by uuid NOT NULL REFERENCES euclide.users(id),
  graded_at timestamptz NOT NULL DEFAULT now(),
  revision integer NOT NULL CHECK (revision > 0),
  FOREIGN KEY (attempt_id,tryout_question_id) REFERENCES euclide.answers(attempt_id,tryout_question_id),
  PRIMARY KEY (attempt_id,tryout_question_id)
);
CREATE TABLE euclide.attempt_results (
  attempt_id uuid PRIMARY KEY REFERENCES euclide.exam_attempts(id),
  score numeric(10,4) NOT NULL,
  breakdown jsonb NOT NULL,
  calculated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE euclide.violation_events (
  attempt_id uuid NOT NULL REFERENCES euclide.exam_attempts(id),
  event_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('focus_lost','fullscreen_exit')),
  received_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (attempt_id,event_id)
);

CREATE TABLE euclide.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES euclide.student_profiles(user_id),
  period date NOT NULL CHECK (extract(day FROM period) = 1),
  amount_rupiah bigint NOT NULL CHECK (amount_rupiah > 0),
  due_at date NOT NULL,
  UNIQUE (student_id,period)
);
CREATE TABLE euclide.import_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('students','payments','programs')),
  file_sha256 text NOT NULL,
  status text NOT NULL DEFAULT 'preview' CHECK (status IN ('preview','committed','failed')),
  created_by uuid NOT NULL REFERENCES euclide.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE euclide.import_rows (
  job_id uuid REFERENCES euclide.import_jobs(id),
  row_number integer NOT NULL CHECK (row_number > 0),
  payload jsonb NOT NULL,
  error text,
  committed_at timestamptz,
  PRIMARY KEY (job_id,row_number)
);
CREATE TABLE euclide.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number text NOT NULL UNIQUE,
  student_id uuid NOT NULL REFERENCES euclide.student_profiles(user_id),
  amount_rupiah bigint NOT NULL CHECK (amount_rupiah > 0),
  method text NOT NULL CHECK (method IN ('cash','bank_transfer')),
  paid_at timestamptz NOT NULL,
  recorded_by uuid NOT NULL REFERENCES euclide.users(id),
  source_reference text UNIQUE,
  import_job_id uuid REFERENCES euclide.import_jobs(id),
  import_row_number integer,
  notes text NOT NULL DEFAULT '',
  voided_at timestamptz,
  UNIQUE (import_job_id,import_row_number),
  FOREIGN KEY (import_job_id,import_row_number) REFERENCES euclide.import_rows(job_id,row_number),
  CHECK ((import_job_id IS NULL) = (import_row_number IS NULL))
);
CREATE INDEX payments_student_idx ON euclide.payments(student_id,paid_at DESC);
CREATE TABLE euclide.payment_allocations (
  payment_id uuid REFERENCES euclide.payments(id),
  invoice_id uuid REFERENCES euclide.invoices(id),
  amount_rupiah bigint NOT NULL CHECK (amount_rupiah > 0),
  PRIMARY KEY (payment_id,invoice_id)
);
CREATE TABLE euclide.institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL
);
CREATE TABLE euclide.study_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES euclide.institutions(id),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  degree text NOT NULL CHECK (degree IN ('S1','D4','D3')),
  subject_group text
);
CREATE TABLE euclide.program_year_stats (
  program_id uuid REFERENCES euclide.study_programs(id),
  academic_year smallint NOT NULL,
  quota integer NOT NULL CHECK (quota >= 0),
  previous_applicants integer NOT NULL CHECK (previous_applicants >= 0),
  target_score numeric(10,4) CHECK (target_score >= 0),
  source text NOT NULL,
  methodology text NOT NULL,
  PRIMARY KEY (program_id,academic_year)
);
CREATE TABLE euclide.student_choices (
  student_id uuid REFERENCES euclide.student_profiles(user_id),
  academic_year smallint NOT NULL,
  position smallint NOT NULL CHECK (position BETWEEN 1 AND 4),
  program_id uuid NOT NULL REFERENCES euclide.study_programs(id),
  PRIMARY KEY (student_id,academic_year,position),
  UNIQUE (student_id,academic_year,program_id)
);
CREATE TABLE euclide.idempotency_requests (
  actor_id uuid REFERENCES euclide.users(id),
  operation text NOT NULL,
  key text NOT NULL CHECK (length(key) BETWEEN 8 AND 128),
  payload_sha256 text NOT NULL,
  response jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (actor_id,operation,key)
);
CREATE TABLE euclide.audit_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id uuid REFERENCES euclide.users(id),
  action text NOT NULL,
  entity_id text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Published exams and their grading keys must keep their original meaning.
CREATE FUNCTION euclide.protect_published_question() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM euclide.tryout_questions tq JOIN euclide.tryouts t ON t.id=tq.tryout_id
    WHERE tq.version_id=OLD.id AND t.status <> 'draft'
  ) THEN RAISE EXCEPTION 'Published question versions are immutable'; END IF;
  RETURN CASE WHEN TG_OP='DELETE' THEN OLD ELSE NEW END;
END $$;
CREATE TRIGGER question_version_immutable BEFORE UPDATE OR DELETE ON euclide.question_versions
  FOR EACH ROW EXECUTE FUNCTION euclide.protect_published_question();
CREATE FUNCTION euclide.protect_published_key() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM euclide.tryout_questions tq JOIN euclide.tryouts t ON t.id=tq.tryout_id
    WHERE tq.version_id=OLD.version_id AND t.status <> 'draft'
  ) THEN RAISE EXCEPTION 'Published answer keys are immutable'; END IF;
  RETURN CASE WHEN TG_OP='DELETE' THEN OLD ELSE NEW END;
END $$;
CREATE TRIGGER answer_key_immutable BEFORE UPDATE OR DELETE ON euclide.answer_keys
  FOR EACH ROW EXECUTE FUNCTION euclide.protect_published_key();
