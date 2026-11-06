CREATE TABLE euclide.attempt_preferences (
  attempt_id uuid NOT NULL REFERENCES euclide.exam_attempts(id),
  priority smallint NOT NULL CHECK (priority BETWEEN 1 AND 4),
  program_id uuid NOT NULL REFERENCES euclide.study_programs(id),
  rule_year smallint NOT NULL,
  snapshot jsonb NOT NULL,
  PRIMARY KEY (attempt_id,priority),
  UNIQUE (attempt_id,program_id)
);
