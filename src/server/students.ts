import { z } from 'zod';
import { SqlClient } from './db';
import { ApiError } from './errors';

export const studentInput = z.object({
  name: z.string().trim().min(2).max(150),
  email: z.email().trim().toLowerCase().max(254),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{8,25}$/).optional(),
  cohortYear: z.number().int().min(2000).max(2100),
}).strict();

// Caller must use a transaction and enforce admin permission. This creates a
// nonactive student record, not approval, paid enrollment, or access to CBT.
export async function createStudent(db: SqlClient, actor: string, input: unknown) {
  const data = studentInput.parse(input);
  const { rows: users } = await db.query(`INSERT INTO euclide.users(name,email,role,status)
    VALUES ($1,$2,'siswa','nonactive') ON CONFLICT (email) DO NOTHING RETURNING id,name,email,status`,
  [data.name, data.email]);
  if (!users.length) throw new ApiError(409, 'student_exists', 'Email sudah terdaftar. Cari akun existing sebelum membuat siswa baru.');
  const { rows: profiles } = await db.query(`INSERT INTO euclide.student_profiles(user_id,phone,cohort_year)
    VALUES ($1,$2,$3) RETURNING kode_siswa,phone,cohort_year`, [users[0].id, data.phone ?? null, data.cohortYear]);
  await db.query(`INSERT INTO euclide.audit_logs(actor_id,action,entity_id)
    VALUES ($1,'student.create',$2)`, [actor, users[0].id]);
  return { ...users[0], ...profiles[0] };
}

export async function findStudents(db: SqlClient, query: string, limit = 25, offset = 0) {
  // Treat wildcard characters as literal search input. No NIS-based matching.
  const pattern = `%${query.replace(/[\\%_]/g, '\\$&')}%`;
  const { rows } = await db.query(`SELECT u.id,u.name,u.email,u.status,p.kode_siswa,p.phone,p.cohort_year
    FROM euclide.users u JOIN euclide.student_profiles p ON p.user_id=u.id
    WHERE u.role='siswa' AND (p.kode_siswa ILIKE $1 OR u.name ILIKE $1 OR u.email ILIKE $1)
    ORDER BY u.name,u.id LIMIT $2 OFFSET $3`, [pattern, limit, offset]);
  return rows;
}
