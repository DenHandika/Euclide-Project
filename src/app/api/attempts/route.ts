import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/server/auth';
import { transaction } from '@/server/db';
import { startPreparedAttempt } from '@/server/preferences';
import { json, failure, sameOrigin, body } from '@/server/http';
export const runtime='nodejs';
const input=z.object({tryoutId:z.uuid(),programIds:z.array(z.uuid()).min(1).max(4),ruleYear:z.literal(2026)}).strict();
export async function POST(request:NextRequest) {
  try {
    sameOrigin(request);
    const user=await requireUser(['siswa']);
    const data=input.parse(await body(request));
    return json(await transaction(db=>startPreparedAttempt(db,user.id,data.tryoutId,data.programIds,data.ruleYear)));
  } catch(error) { return failure(error); }
}
