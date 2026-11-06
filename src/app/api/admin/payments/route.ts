import { randomUUID } from 'node:crypto';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/server/auth';
import { transaction } from '@/server/db';
import { idempotent } from '@/server/idempotency';
import { json, failure, sameOrigin, body } from '@/server/http';
import { ApiError } from '@/server/errors';
export const runtime='nodejs';
const input=z.object({studentId:z.uuid(),amountRupiah:z.number().int().positive().max(1000000000),method:z.enum(['cash','bank_transfer']),paidAt:z.iso.datetime({offset:true}),notes:z.string().max(1000).default('')}).strict();
export async function POST(request:NextRequest) {
  try {
    sameOrigin(request);
    const user=await requireUser(['admin']);
    const key=request.headers.get('Idempotency-Key');
    if (!key) throw new ApiError(400,'missing_key','Idempotency-Key diperlukan.');
    const data=input.parse(await body(request));
    return json(await transaction(db=>idempotent(db,user.id,'payment.create',key,data,async()=>{
      const receipt=`EUC-${randomUUID()}`;
      const {rows}=await db.query(`INSERT INTO euclide.payments(receipt_number,student_id,amount_rupiah,method,paid_at,recorded_by,notes)
        VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id,receipt_number,student_id,amount_rupiah,method,paid_at`,[receipt,data.studentId,data.amountRupiah,data.method,data.paidAt,user.id,data.notes]);
      await db.query(`INSERT INTO euclide.audit_logs(actor_id,action,entity_id) VALUES ($1,'payment.create',$2)`,[user.id,rows[0].id]);
      return rows[0];
    })));
  } catch(error) { return failure(error); }
}
