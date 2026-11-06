import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/server/auth';
import { transaction } from '@/server/db';
import { saveAnswer } from '@/server/exams';
import { json, failure, sameOrigin, body } from '@/server/http';
export const runtime='nodejs';
const input=z.object({answer:z.union([z.string().max(20000),z.array(z.string().max(128)).max(30)]),flagged:z.boolean(),revision:z.number().int().positive().max(2147483647)}).strict();
export async function PUT(request:NextRequest,{params}:{params:{id:string;questionId:string}}) {
  try {
    sameOrigin(request);
    const user=await requireUser(['siswa']);
    const id=z.uuid().parse(params.id), questionId=z.uuid().parse(params.questionId);
    const data=input.parse(await body(request));
    return json(await transaction(db=>saveAnswer(db,user.id,id,questionId,data)));
  } catch(error) { return failure(error); }
}
