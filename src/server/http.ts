import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiError } from './errors';

export function sameOrigin(request: NextRequest): void {
  const expected = process.env.NEXTAUTH_URL;
  if (!expected) throw new ApiError(503,'origin_unconfigured','URL aplikasi belum dikonfigurasi.');
  if (request.headers.get('origin') !== new URL(expected).origin) throw new ApiError(403,'invalid_origin','Origin permintaan tidak diizinkan.');
}
export async function body(request: NextRequest): Promise<unknown> {
  const text = await request.text();
  if (Buffer.byteLength(text,'utf8') > 65536) throw new ApiError(413,'body_too_large','Data terlalu besar.');
  try { return JSON.parse(text); } catch { throw new ApiError(400,'invalid_json','Format JSON tidak valid.'); }
}
export function json(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
}
export function failure(error: unknown): NextResponse {
  if (error instanceof ApiError) return json({error:{code:error.code,message:error.message}},error.status);
  if (error instanceof ZodError) return json({error:{code:'invalid_input',message:'Data permintaan tidak valid.'}},400);
  console.error('Euclide API error',error instanceof Error ? error.name : 'Unknown');
  return json({error:{code:'unavailable',message:'Layanan belum siap atau sedang mengalami gangguan.'}},503);
}
