import { requireUser } from '@/server/auth';
import { json, failure } from '@/server/http';
export const dynamic='force-dynamic';
export async function GET() {
  try { return json({user:await requireUser()}); } catch(error) { return failure(error); }
}
