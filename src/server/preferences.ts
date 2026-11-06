import { SqlClient } from './db';
import { ApiError } from './errors';
import { StudyProgram, SNBT_RULE_YEAR, validateChoices } from '../lib/snbtChoices';
import { startAttempt, readAttempt } from './exams';

// Called in the transaction that creates the attempt; the client supplies IDs only.
export async function startPreparedAttempt(db:SqlClient,studentId:string,tryoutId:string,ids:string[],year:number) {
  if (year!==SNBT_RULE_YEAR) throw new ApiError(400,'unsupported_rule_year','Aturan tahun seleksi ini belum tersedia.');
  const {rows:existing}=await db.query('SELECT id FROM euclide.exam_attempts WHERE student_id=$1 AND tryout_id=$2',[studentId,tryoutId]);
  if (existing[0]) return readAttempt(db,studentId,existing[0].id as string);
  const {rows}=await db.query(`SELECT p.id,p.name,p.degree,i.name AS institution,s.target_score,s.source,s.methodology
    FROM euclide.study_programs p JOIN euclide.institutions i ON i.id=p.institution_id
    JOIN euclide.program_year_stats s ON s.program_id=p.id AND s.academic_year=$2
    WHERE p.id=ANY($1::uuid[]) FOR SHARE OF p,i,s`,[ids,year]);
  const choices=ids.map(id=>rows.find(p=>p.id===id));
  if (choices.some(p=>!p)) throw new ApiError(400,'invalid_program','Program studi tidak tersedia untuk tahun yang dipilih.');
  const programs=choices.map(p=>({id:p!.id,institution:p!.institution,name:p!.name,degree:p!.degree,year,targetScore:p!.target_score===null ? null : Number(p!.target_score)})) as StudyProgram[];
  const validation=validateChoices(programs);
  if (!validation.valid) throw new ApiError(400,'invalid_choices',validation.message);
  const attempt=await startAttempt(db,studentId,tryoutId);
  // The row lock taken by startAttempt serializes competing requests; the first
  // committed preference list wins, and subsequent resume requests keep it.
  const {rows:saved}=await db.query('SELECT priority FROM euclide.attempt_preferences WHERE attempt_id=$1',[attempt.attempt.id]);
  if (!saved.length) {
    for (let index=0;index<programs.length;index++) {
      const program=programs[index];
      const source=choices[index]!;
      await db.query(`INSERT INTO euclide.attempt_preferences(attempt_id,priority,program_id,rule_year,snapshot)
        VALUES ($1,$2,$3,$4,$5::jsonb)`,[attempt.attempt.id,index+1,program.id,year,JSON.stringify({...program,source:source.source,methodology:source.methodology})]);
    }
  }
  return readAttempt(db,studentId,attempt.attempt.id);
}
