import { SqlClient } from './db';
import { ApiError } from './errors';

type Attempt = Record<string, unknown> & {id:string; tryout_id:string; status:string; started_at:Date|string; deadline_at:Date|string};
const date = (value: unknown) => new Date(value as string | Date).getTime();
async function owned(db: SqlClient, id: string, studentId: string): Promise<Attempt> {
  const { rows } = await db.query<Attempt>('SELECT * FROM euclide.exam_attempts WHERE id=$1 AND student_id=$2 FOR UPDATE',[id,studentId]);
  if (!rows[0]) throw new ApiError(404,'not_found','Sesi ujian tidak ditemukan.');
  return rows[0];
}
async function clock(db: SqlClient): Promise<Date> {
  const { rows } = await db.query('SELECT clock_timestamp() AS now');
  return new Date(rows[0].now as string);
}
export async function startAttempt(db: SqlClient, studentId: string, tryoutId: string) {
  const { rows: previous } = await db.query('SELECT id FROM euclide.exam_attempts WHERE student_id=$1 AND tryout_id=$2',[studentId,tryoutId]);
  if (previous[0]) return readAttempt(db,studentId,previous[0].id as string);
  // Lock publication configuration while creating the schedule.
  const {rows:packages} = await db.query(`SELECT * FROM euclide.tryouts WHERE id=$1 AND status='published' FOR SHARE`,[tryoutId]);
  const now = await clock(db);
  const pack = packages[0];
  if (!pack || (pack.opens_at && date(pack.opens_at)>now.getTime()) || (pack.closes_at && date(pack.closes_at)<=now.getTime())) throw new ApiError(409,'unavailable','Tryout belum tersedia atau sudah ditutup.');
  const {rows:subtests} = await db.query(`SELECT s.*, count(q.id)::int AS question_count FROM euclide.tryout_subtests s
    LEFT JOIN euclide.tryout_questions q ON q.subtest_id=s.id WHERE s.tryout_id=$1 GROUP BY s.id ORDER BY s.position`,[tryoutId]);
  if (!subtests.length || subtests.some(s=>Number(s.question_count)===0)) throw new ApiError(409,'invalid_package','Paket soal belum lengkap.');
  const end = new Date(now.getTime()+subtests.reduce((sum,s)=>sum+Number(s.duration_seconds)*1000,0));
  const {rows:created} = await db.query(`INSERT INTO euclide.exam_attempts(student_id,tryout_id,started_at,deadline_at)
    VALUES ($1,$2,$3,$4) ON CONFLICT (tryout_id,student_id) DO NOTHING RETURNING id`,[studentId,tryoutId,now,end]);
  if (!created[0]) {
    const {rows} = await db.query('SELECT id FROM euclide.exam_attempts WHERE student_id=$1 AND tryout_id=$2',[studentId,tryoutId]);
    return readAttempt(db,studentId,rows[0].id as string);
  }
  const id = created[0].id as string;
  let begins = now;
  for (const subtest of subtests) {
    const deadline = new Date(begins.getTime()+Number(subtest.duration_seconds)*1000);
    await db.query(`INSERT INTO euclide.attempt_subtests(attempt_id,tryout_id,subtest_id,starts_at,deadline_at) VALUES ($1,$2,$3,$4,$5)`,[id,tryoutId,subtest.id,begins,deadline]);
    begins=deadline;
  }
  return readAttempt(db,studentId,id);
}
export async function readAttempt(db: SqlClient, studentId: string, id: string) {
  let attempt=await owned(db,id,studentId);
  const now=await clock(db);
  if (attempt.status==='in_progress' && date(attempt.deadline_at)<=now.getTime()) {
    await submitAttempt(db,studentId,id,'expired');
    attempt=await owned(db,id,studentId);
  }
  const {rows:subtests}=await db.query(`SELECT s.subtest_id,s.starts_at,s.deadline_at,t.title,t.position
    FROM euclide.attempt_subtests s JOIN euclide.tryout_subtests t ON t.id=s.subtest_id WHERE s.attempt_id=$1 ORDER BY t.position`,[id]);
  const active=subtests.find(s=>date(s.starts_at)<=now.getTime() && date(s.deadline_at)>now.getTime());
  // Explicit projection: answer keys, explanations and grading rubrics never leave this endpoint.
  const {rows:questions}=await db.query(`SELECT q.id,q.subtest_id,q.position,v.type,v.prompt,v.stimulus,v.image_url,v.options
    FROM euclide.tryout_questions q JOIN euclide.question_versions v ON v.id=q.version_id
    WHERE q.tryout_id=$1 AND q.subtest_id=$2 ORDER BY q.position`,[attempt.tryout_id,attempt.status==='in_progress' ? active?.subtest_id ?? null : null]);
  const {rows:answers}=await db.query('SELECT tryout_question_id,answer,flagged,revision,received_at FROM euclide.answers WHERE attempt_id=$1',[id]);
  const {rows:results}=await db.query('SELECT score,breakdown FROM euclide.attempt_results WHERE attempt_id=$1',[id]);
  const {rows:targetChoices}=await db.query('SELECT priority,rule_year,snapshot FROM euclide.attempt_preferences WHERE attempt_id=$1 ORDER BY priority',[id]);
  return {attempt,serverNow:now.toISOString(),subtests,activeSubtestId:attempt.status==='in_progress' ? active?.subtest_id ?? null : null,questions,answers,targetChoices,result:results[0]??null};
}
export async function saveAnswer(db: SqlClient, studentId: string, attemptId: string, questionId: string, input: {answer:string|string[];flagged:boolean;revision:number}) {
  const attempt=await owned(db,attemptId,studentId);
  const now=await clock(db);
  if (attempt.status!=='in_progress') throw new ApiError(409,'closed','Ujian sudah dikumpulkan.');
  const {rows}=await db.query(`SELECT q.id,v.type,v.options,s.starts_at,s.deadline_at FROM euclide.tryout_questions q
    JOIN euclide.question_versions v ON v.id=q.version_id JOIN euclide.attempt_subtests s ON s.subtest_id=q.subtest_id AND s.attempt_id=$1
    WHERE q.id=$2 AND q.tryout_id=$3`,[attemptId,questionId,attempt.tryout_id]);
  const q=rows[0];
  if (!q) throw new ApiError(404,'question_not_found','Soal tidak ditemukan.');
  if (date(q.starts_at)>now.getTime() || date(q.deadline_at)<=now.getTime()) throw new ApiError(409,'subtest_closed','Subtes tidak aktif atau waktunya sudah habis.');
  const options=(q.options as {id:string}[]).map(o=>o.id);
  if (q.type==='multi_select') {
    if (!Array.isArray(input.answer) || new Set(input.answer).size!==input.answer.length || input.answer.some(a=>!options.includes(a))) throw new ApiError(400,'invalid_answer','Pilihan jawaban tidak valid.');
  } else if (typeof input.answer!=='string' || (q.type==='single_choice' && input.answer!=='' && !options.includes(input.answer))) throw new ApiError(400,'invalid_answer','Jawaban tidak sesuai tipe soal.');
  const normalized=Array.isArray(input.answer) ? [...input.answer].sort() : input.answer;
  const {rows:existing}=await db.query('SELECT answer,flagged,revision FROM euclide.answers WHERE attempt_id=$1 AND tryout_question_id=$2',[attemptId,questionId]);
  const old=existing[0];
  if (old && Number(old.revision)===input.revision && JSON.stringify(old.answer)===JSON.stringify(normalized) && old.flagged===input.flagged) return old;
  if (old && Number(old.revision)>=input.revision) throw new ApiError(409,'stale_revision','Jawaban lebih baru sudah tersimpan.');
  const {rows:saved}=await db.query(`INSERT INTO euclide.answers(attempt_id,tryout_id,tryout_question_id,answer,flagged,revision,received_at)
    VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7) ON CONFLICT (attempt_id,tryout_question_id)
    DO UPDATE SET answer=EXCLUDED.answer,flagged=EXCLUDED.flagged,revision=EXCLUDED.revision,received_at=EXCLUDED.received_at
    RETURNING answer,flagged,revision`,[attemptId,attempt.tryout_id,questionId,JSON.stringify(normalized),input.flagged,input.revision,now]);
  return saved[0];
}
function objectiveCorrect(type: unknown, answer: unknown, key: unknown, caseSensitive: unknown): boolean {
  if (type==='multi_select') return Array.isArray(answer) && Array.isArray(key) && JSON.stringify([...answer].sort())===JSON.stringify([...key].sort());
  if (typeof answer!=='string' || typeof key!=='string' || !answer.trim()) return false;
  if (type==='short_answer') return caseSensitive ? answer.trim()===key.trim() : answer.trim().toLowerCase()===key.trim().toLowerCase();
  return answer===key;
}
export async function submitAttempt(db: SqlClient, studentId: string, id: string, reason: 'student'|'expired'|'violations'='student') {
  const attempt=await owned(db,id,studentId);
  if (attempt.status!=='in_progress') {
    const {rows}=await db.query('SELECT score,breakdown FROM euclide.attempt_results WHERE attempt_id=$1',[id]);
    return {attemptId:id,status:attempt.status,result:rows[0]??null};
  }
  const now=await clock(db);
  const {rows}=await db.query(`SELECT q.id,q.subtest_id,v.type,v.max_score,k.answer AS correct_answer,k.case_sensitive,a.answer,g.score AS essay_score,s.weight
    FROM euclide.tryout_questions q JOIN euclide.question_versions v ON v.id=q.version_id
    LEFT JOIN euclide.answer_keys k ON k.version_id=v.id JOIN euclide.tryout_subtests s ON s.id=q.subtest_id
    LEFT JOIN euclide.answers a ON a.tryout_question_id=q.id AND a.attempt_id=$1
    LEFT JOIN euclide.essay_grades g ON g.tryout_question_id=q.id AND g.attempt_id=$1 WHERE q.tryout_id=$2`,[id,attempt.tryout_id]);
  if (rows.some(q=>q.type!=='essay' && q.correct_answer===null)) throw new ApiError(409,'missing_key','Paket memiliki soal tanpa kunci penilaian.');
  let pending=false;
  const totals:Record<string,{earned:number;maximum:number;weight:number}>={};
  for (const q of rows) {
    const sub=q.subtest_id as string;
    totals[sub]??={earned:0,maximum:0,weight:Number(q.weight)};
    const max=Number(q.max_score);
    totals[sub].maximum+=max;
    if (q.type==='essay') {
      if (typeof q.answer==='string' && q.answer.trim()) {
        if (q.essay_score===null) pending=true;
        else totals[sub].earned+=Number(q.essay_score)/100*max;
      }
    } else if (objectiveCorrect(q.type,q.answer,q.correct_answer,q.case_sensitive)) totals[sub].earned+=max;
  }
  const breakdown=Object.entries(totals).map(([subtestId,s])=>({subtestId,score:s.maximum ? s.earned/s.maximum*1000 : 0,weight:s.weight}));
  const weight=breakdown.reduce((sum,s)=>sum+s.weight,0);
  const score=weight ? breakdown.reduce((sum,s)=>sum+s.score*s.weight,0)/weight : 0;
  const status=pending ? 'pending_grading' : 'final';
  await db.query(`UPDATE euclide.exam_attempts SET status=$2,submitted_at=$3,submit_reason=$4 WHERE id=$1`,[id,status,now,date(attempt.deadline_at)<=now.getTime() ? 'expired' : reason]);
  if (!pending) await db.query('INSERT INTO euclide.attempt_results(attempt_id,score,breakdown) VALUES ($1,$2,$3::jsonb) ON CONFLICT DO NOTHING',[id,score,JSON.stringify(breakdown)]);
  return {attemptId:id,status,result:pending ? null : {score,breakdown}};
}
