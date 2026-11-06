import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { randomUUID } from 'node:crypto';
import { SqlClient } from '../src/server/db';
import { startAttempt, saveAnswer, submitAttempt, readAttempt } from '../src/server/exams';
import { idempotent } from '../src/server/idempotency';
import { activeUserByEmail, permit } from '../src/server/users';
import { createStudent, findStudents } from '../src/server/students';

test('student identity upgrade preserves existing IDs and NIS without using school identity as a key', async () => {
  const pg = new PGlite();
  try {
    await pg.exec(await readFile('database/migrations/001_initial.sql', 'utf8'));
    const id = randomUUID();
    await pg.query(`INSERT INTO euclide.users(id,name,email,role) VALUES ($1,'Lama','legacy@example.test','siswa')`, [id]);
    await pg.query(`INSERT INTO euclide.student_profiles(user_id,nis,cohort_year) VALUES ($1,'SEKOLAH-001',2025)`, [id]);
    await pg.exec(await readFile('database/migrations/004_student_codes.sql', 'utf8'));
    const { rows } = await pg.query<{user_id:string; nis:string; kode_siswa:string}>('SELECT user_id,nis,kode_siswa FROM euclide.student_profiles');
    assert.equal(rows[0].user_id, id);
    assert.equal(rows[0].nis, 'SEKOLAH-001');
    assert.match(rows[0].kode_siswa, /^EUC-\d{4}-\d{4,}$/);
    await assert.rejects(() => pg.query(`UPDATE euclide.student_profiles SET kode_siswa='EUC-2026-9999' WHERE user_id=$1`, [id]), /cannot be reassigned/);
  } finally { await pg.close(); }
});

test('admin-created student has immutable automatic code, no login access, and replay-safe creation', async () => {
  const f = await fixture();
  try {
    const input = { name: 'Siswa Baru', email: 'NEW@example.test', cohortYear: 2026 };
    const run = (key:string, data:unknown) => f.pg.transaction(tx => idempotent(tx as unknown as SqlClient,
      f.admin, 'student.create', key, data, () => createStudent(tx as unknown as SqlClient, f.admin, data)));
    const created = await run('student-create-001', input);
    const replay = await run('student-create-001', input);
    assert.deepEqual(created, replay);
    assert.equal(created.status, 'nonactive');
    assert.equal(created.email, 'new@example.test');
    assert.equal(await activeUserByEmail(f.db, 'new@example.test'), null);
    assert.match(String(created.kode_siswa), /^EUC-\d{4}-\d{4,}$/);
    const found = await findStudents(f.db, String(created.kode_siswa));
    assert.equal(found.length, 1);
    assert.equal(found[0].id, created.id);
    assert.equal((await findStudents(f.db, 'NIS1')).length, 0);
    assert.equal((await findStudents(f.db, '%')).length, 0);
    await assert.rejects(() => run('student-create-002', input), /Email sudah terdaftar/);
    await assert.rejects(() => run('student-create-003', { ...input, email:'bad@example.test', kode_siswa:'MANUAL' }));
    await f.pg.query(`UPDATE euclide.users SET status='graduated' WHERE id=$1`, [created.id]);
    assert.equal((await findStudents(f.db, String(created.kode_siswa)))[0].status, 'graduated');
    const audit = await f.pg.query<{count:number}>(`SELECT count(*)::int AS count FROM euclide.audit_logs WHERE action='student.create'`);
    assert.equal(audit.rows[0].count, 1);
  } finally { await f.pg.close(); }
});

test('student code counter stays unique beyond four digits and NIS may be shared across schools', async () => {
  const f = await fixture();
  try {
    await f.pg.query(`SELECT setval('euclide.student_code_sequence',9999)`);
    const first = await f.pg.transaction(tx => createStudent(tx as unknown as SqlClient, f.admin,
      { name:'Nama Sama', email:'one@example.test', cohortYear:2026 }));
    const second = await f.pg.transaction(tx => createStudent(tx as unknown as SqlClient, f.admin,
      { name:'Nama Sama', email:'two@example.test', cohortYear:2026 }));
    assert.match(String(first.kode_siswa), /-10000$/);
    assert.match(String(second.kode_siswa), /-10001$/);
    await f.pg.query(`UPDATE euclide.student_profiles SET nis='SCHOOL-001' WHERE user_id IN ($1,$2)`, [first.id, second.id]);
    assert.equal((await findStudents(f.db, 'Nama Sama')).length, 2);
  } finally { await f.pg.close(); }
});

async function fixture(essay=false) {
  const pg=new PGlite();
  await pg.exec(await readFile('database/migrations/001_initial.sql','utf8'));
  await pg.exec(await readFile('database/migrations/002_lock_published_packages.sql','utf8'));
  await pg.exec(await readFile('database/migrations/003_attempt_preferences.sql','utf8'));
  await pg.exec(await readFile('database/migrations/004_student_codes.sql','utf8'));
  const db=pg as unknown as SqlClient;
  const student=randomUUID(), other=randomUUID(), admin=randomUUID(), tryout=randomUUID(), question=randomUUID(), version=randomUUID(), subtest=randomUUID(), item=randomUUID();
  await pg.query(`INSERT INTO euclide.users(id,name,email,role) VALUES ($1,'Siswa','student@example.test','siswa'),($2,'Admin','admin@example.test','admin'),($3,'Lain','other@example.test','siswa')`,[student,admin,other]);
  await pg.query(`INSERT INTO euclide.student_profiles(user_id,nis,cohort_year) VALUES ($1,'NIS1',2026),($2,'NIS2',2026)`,[student,other]);
  await pg.query(`INSERT INTO euclide.questions(id,created_by) VALUES ($1,$2)`,[question,admin]);
  await pg.query(`INSERT INTO euclide.question_versions(id,question_id,version,type,subject,prompt,options,max_score) VALUES ($1,$2,1,$3,'math','Soal',$4::jsonb,1)`,[version,question,essay?'essay':'single_choice',JSON.stringify([{id:'A',text:'Benar'},{id:'B',text:'Salah'}])]);
  await pg.query(`INSERT INTO euclide.answer_keys(version_id,answer,explanation) VALUES ($1,'"A"','Rahasia pembahasan')`,[version]);
  await pg.query(`INSERT INTO euclide.tryouts(id,title) VALUES ($1,'Paket')`,[tryout]);
  await pg.query(`INSERT INTO euclide.tryout_subtests(id,tryout_id,subject,title,position,duration_seconds) VALUES ($1,$2,'math','Math',0,600)`,[subtest,tryout]);
  await pg.query(`INSERT INTO euclide.tryout_questions(id,tryout_id,subtest_id,version_id,position) VALUES ($1,$2,$3,$4,0)`,[item,tryout,subtest,version]);
  await pg.query(`UPDATE euclide.tryouts SET status='published' WHERE id=$1`,[tryout]);
  const result=await startAttempt(db,student,tryout);
  return {pg,db,student,other,admin,tryout,version,subtest,item,id:result.attempt.id,result};
}

test('migration can create all relations and attempts return no answer keys',async()=>{
  const f=await fixture();
  try {
    assert.equal(f.result.questions.length,1);
    assert.ok(!JSON.stringify(f.result).includes('correct_answer'));
    assert.ok(!JSON.stringify(f.result).includes('Rahasia pembahasan'));
    const resumed=await startAttempt(f.db,f.student,f.tryout);
    assert.equal(resumed.attempt.id,f.id);
    assert.equal(new Date(resumed.attempt.deadline_at).toISOString(),new Date(f.result.attempt.deadline_at).toISOString());
    await assert.rejects(()=>readAttempt(f.db,f.other,f.id),/tidak ditemukan/);
  } finally {await f.pg.close();}
});

test('answer retries are safe, old revisions fail, and repeated submission grades once',async()=>{
  const f=await fixture();
  try {
    const input={answer:'A',flagged:false,revision:2};
    await saveAnswer(f.db,f.student,f.id,f.item,input);
    await saveAnswer(f.db,f.student,f.id,f.item,input);
    await assert.rejects(()=>saveAnswer(f.db,f.student,f.id,f.item,{...input,answer:'B',revision:1}),/lebih baru/);
    const first=await submitAttempt(f.db,f.student,f.id);
    const second=await submitAttempt(f.db,f.student,f.id);
    assert.equal(first.status,'final');
    assert.equal(Number(first.result?.score),1000);
    assert.equal(Number(second.result?.score),1000);
    const count=await f.pg.query<{count:number}>('SELECT count(*)::int AS count FROM euclide.attempt_results');
    assert.equal(count.rows[0].count,1);
    await assert.rejects(()=>saveAnswer(f.db,f.student,f.id,f.item,input),/dikumpulkan/);
  } finally {await f.pg.close();}
});

test('expired subtest rejects answers and abandoned attempt finalizes on read',async()=>{
  const f=await fixture();
  try {
    await f.pg.query(`UPDATE euclide.attempt_subtests SET starts_at=clock_timestamp()-interval '2 hours',deadline_at=clock_timestamp()-interval '1 hour' WHERE attempt_id=$1`,[f.id]);
    await assert.rejects(()=>saveAnswer(f.db,f.student,f.id,f.item,{answer:'A',flagged:false,revision:1}),/waktunya sudah habis/);
    await f.pg.query(`UPDATE euclide.exam_attempts SET started_at=clock_timestamp()-interval '2 hours',deadline_at=clock_timestamp()-interval '1 hour' WHERE id=$1`,[f.id]);
    const result=await readAttempt(f.db,f.student,f.id);
    assert.equal(result.attempt.status,'final');
    assert.equal(result.attempt.submit_reason,'expired');
    assert.equal(result.questions.length,0);
  } finally {await f.pg.close();}
});

test('essay holds final score pending manual grading',async()=>{
  const f=await fixture(true);
  try {
    await saveAnswer(f.db,f.student,f.id,f.item,{answer:'Argumen saya',flagged:false,revision:1});
    const result=await submitAttempt(f.db,f.student,f.id);
    assert.equal(result.status,'pending_grading');
    assert.equal(result.result,null);
  } finally {await f.pg.close();}
});

test('idempotent payment operation replays canonical payload and rejects different amount',async()=>{
  const f=await fixture();
  try {
    let effects=0;
    const run=(payload:unknown)=>f.pg.transaction(tx=>idempotent(tx as unknown as SqlClient,f.admin,'payment.create','payment-test-001',payload,async()=>{effects++;return {id:'receipt'};}));
    const first=await run({amount:100,student:f.student});
    const second=await run({student:f.student,amount:100});
    assert.deepEqual(first,second);
    assert.equal(effects,1);
    await assert.rejects(()=>run({amount:200,student:f.student}),/berbeda/);
  } finally {await f.pg.close();}
});

test('whitelist denies unknown and deactivated accounts; admin role inheritance is explicit',async()=>{
  const f=await fixture();
  try {
    assert.equal(await activeUserByEmail(f.db,'unknown@example.test'),null);
    assert.equal((await activeUserByEmail(f.db,' STUDENT@EXAMPLE.TEST '))?.id,f.student);
    await f.pg.query(`UPDATE euclide.users SET status='graduated' WHERE id=$1`,[f.student]);
    assert.equal(await activeUserByEmail(f.db,'student@example.test'),null);
    const admin=await activeUserByEmail(f.db,'admin@example.test');
    assert.ok(admin);
    assert.doesNotThrow(()=>permit(admin,['tentor','admin']));
    await assert.rejects(()=>f.pg.query(`UPDATE euclide.question_versions SET prompt='Changed' WHERE id=$1`,[f.version]),/immutable/);
    await assert.rejects(()=>f.pg.query(`UPDATE euclide.tryout_subtests SET weight=2 WHERE id=$1`,[f.subtest]),/immutable/);
  } finally {await f.pg.close();}
});

test('server validates database degrees and snapshots original preferences for resumes',async()=>{
  const {startPreparedAttempt}=await import('../src/server/preferences');
  const f=await fixture();
  try {
    const institution=randomUUID();
    const ids=[randomUUID(),randomUUID(),randomUUID()];
    await f.pg.query(`INSERT INTO euclide.institutions(id,code,name) VALUES ($1,'TEST','Kampus Test')`,[institution]);
    for(let i=0;i<ids.length;i++) {
      await f.pg.query(`INSERT INTO euclide.study_programs(id,institution_id,code,name,degree) VALUES ($1,$2,$3,$4,'S1')`,[ids[i],institution,`TEST-${i}`,`Program ${i}`]);
      await f.pg.query(`INSERT INTO euclide.program_year_stats(program_id,academic_year,quota,previous_applicants,target_score,source,methodology) VALUES ($1,2026,10,100,700,'test','test')`,[ids[i]]);
    }
    await assert.rejects(()=>startPreparedAttempt(f.db,f.other,f.tryout,ids,2026),/Untuk tiga pilihan/);
    const started=await f.pg.transaction(tx=>startPreparedAttempt(tx as unknown as SqlClient,f.other,f.tryout,[ids[0],ids[1]],2026));
    assert.equal(started.targetChoices.length,2);
    assert.equal((started.targetChoices[0].snapshot as {targetScore:number}).targetScore,700);
    await f.pg.query('UPDATE euclide.program_year_stats SET target_score=800 WHERE program_id=$1',[ids[0]]);
    const resumed=await f.pg.transaction(tx=>startPreparedAttempt(tx as unknown as SqlClient,f.other,f.tryout,[ids[2]],2026));
    assert.equal(resumed.attempt.id,started.attempt.id);
    assert.equal(resumed.targetChoices.length,2);
    assert.equal((resumed.targetChoices[0].snapshot as {targetScore:number}).targetScore,700);
  } finally {await f.pg.close();}
});
