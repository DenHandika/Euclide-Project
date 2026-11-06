import { z } from 'zod';
import { requireUser } from '@/server/auth';
import { transaction } from '@/server/db';
import { readAttempt } from '@/server/exams';
import { json, failure } from '@/server/http';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export async function GET(_request:Request,{params}:{params:{id:string}}) {
  try {
    const user=await requireUser(['siswa']);
    const id=z.uuid().parse(params.id);
    return json(await transaction(db=>readAttempt(db,user.id,id)));
  } catch(error) { return failure(error); }
}
