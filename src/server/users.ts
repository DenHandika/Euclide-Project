import { SqlClient } from './db';
import { ApiError } from './errors';

export interface ServerUser extends Record<string, unknown> {
  id: string; name: string; email: string; role: 'admin' | 'tentor' | 'siswa'; status: string;
}
export async function activeUserByEmail(db: SqlClient, email: string): Promise<ServerUser | null> {
  const { rows } = await db.query<ServerUser>('SELECT id,name,email,role,status FROM euclide.users WHERE email=$1 AND status=$2', [email.toLowerCase().trim(),'active']);
  return rows[0] ?? null;
}
export async function activeUserById(db: SqlClient, id: string): Promise<ServerUser | null> {
  const { rows } = await db.query<ServerUser>('SELECT id,name,email,role,status FROM euclide.users WHERE id=$1 AND status=$2',[id,'active']);
  return rows[0] ?? null;
}
export function permit(user: ServerUser, roles: ServerUser['role'][]): void {
  if (!roles.includes(user.role)) throw new ApiError(403,'forbidden','Akses tidak diizinkan.');
}
