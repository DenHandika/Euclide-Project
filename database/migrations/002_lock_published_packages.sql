-- Configuration used by published/started exams cannot be edited in place.
CREATE FUNCTION euclide.protect_exam_configuration() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE old_tryout uuid; new_tryout uuid;
BEGIN
  IF TG_OP <> 'INSERT' THEN old_tryout := OLD.tryout_id; END IF;
  IF TG_OP <> 'DELETE' THEN new_tryout := NEW.tryout_id; END IF;
  IF EXISTS (SELECT 1 FROM euclide.tryouts WHERE id IN (old_tryout,new_tryout) AND status <> 'draft')
    OR EXISTS (SELECT 1 FROM euclide.exam_attempts WHERE tryout_id IN (old_tryout,new_tryout))
  THEN RAISE EXCEPTION 'Published exam configuration is immutable'; END IF;
  RETURN CASE WHEN TG_OP='DELETE' THEN OLD ELSE NEW END;
END $$;
CREATE TRIGGER subtest_configuration_immutable BEFORE INSERT OR UPDATE OR DELETE ON euclide.tryout_subtests
  FOR EACH ROW EXECUTE FUNCTION euclide.protect_exam_configuration();
CREATE TRIGGER package_questions_immutable BEFORE INSERT OR UPDATE OR DELETE ON euclide.tryout_questions
  FOR EACH ROW EXECUTE FUNCTION euclide.protect_exam_configuration();
CREATE FUNCTION euclide.protect_tryout_status() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status <> 'draft' AND NEW.status='draft' THEN
    RAISE EXCEPTION 'Published exams cannot return to draft; create a new package';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER tryout_status_immutable BEFORE UPDATE ON euclide.tryouts
  FOR EACH ROW EXECUTE FUNCTION euclide.protect_tryout_status();
