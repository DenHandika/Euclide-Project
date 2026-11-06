import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/server/auth';
import { transaction } from '@/server/db';
import { submitAttempt } from '@/server/exams';
import { json, failure, sameOrigin } from '@/server/http';
export const runtime='nodejs';
export async function POST(request:NextRequest,{params}:{params:{id:string}}) {
  try {
    sameOrigin(request);
    const user=await requireUser(['siswa']);
    const id=z.uuid().parse(params.id);
    return json(await transaction(db=>submitAttempt(db,user.id,id)));
  } catch(error) { return failure(error); }
}
