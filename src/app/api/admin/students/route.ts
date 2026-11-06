import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/server/auth';
import { getPool, transaction } from '@/server/db';
import { createStudent, findStudents, studentInput } from '@/server/students';
import { idempotent } from '@/server/idempotency';
import { body, failure, json, sameOrigin } from '@/server/http';
import { ApiError } from '@/server/errors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const search = z.object({
  q: z.string().trim().max(150).default(''),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  offset: z.coerce.number().int().min(0).max(100000).default(0),
});

export async function GET(request: NextRequest) {
  try {
    await requireUser(['admin']);
    const input = search.parse(Object.fromEntries(request.nextUrl.searchParams));
    return json({ students: await findStudents(getPool(), input.q, input.limit, input.offset) });
  } catch (error) { return failure(error); }
}

export async function POST(request: NextRequest) {
  try {
    sameOrigin(request);
    const admin = await requireUser(['admin']);
    const key = request.headers.get('Idempotency-Key');
    if (!key) throw new ApiError(400, 'missing_key', 'Idempotency-Key diperlukan.');
    const input = studentInput.parse(await body(request));
    const student = await transaction(db => idempotent(db, admin.id, 'student.create', key, input,
      () => createStudent(db, admin.id, input)));
    return json({ student });
  } catch (error) { return failure(error); }
}
