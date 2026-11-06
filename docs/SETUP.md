# Euclide: stack and setup

For the current local-first workflow, see [LOCAL.md](LOCAL.md). It includes
`local:init`, `local:check`, and loopback-only dev/start commands. Hosting selection
is deferred until the persistent application is integrated and load-tested.

## Stack decision

Keep the existing Next.js App Router + TypeScript + Tailwind app, including KaTeX,
Recharts and SheetJS. Use Next.js Route Handlers for the backend, node-postgres for
PostgreSQL queries, Zod for input validation and NextAuth v4 (compatible with the
current Next.js 14 application) for Google OAuth. No separate Laravel service is
required for this implementation. Redis/object storage can be added after the
persistent core is connected; neither is configured yet.

Local PostgreSQL 18 is installed and running on this computer. A VPS is not needed
for development. Vercel cannot connect to localhost on this PC; a hosted PostgreSQL
database will be needed before the live website can use persistent data.

## Current implementation boundary

The existing frontend still runs on demo React Context/LocalStorage. The student prototype now includes /tryouts/:id/prepare with fictional prodi references, SNBT 2026 validation, original-choice snapshots and a post-exam what-if simulator. These screens do not call the production APIs yet. The new APIs
are a separate, authenticated backend foundation, not a completed production app.
Do not announce production readiness or populate the demo with real student data.
Google OAuth is not connected to the existing /login UI yet. For backend OAuth
verification after setup, use /api/auth/signin. Only registered active emails may
sign in; unknown emails are denied and no user is created automatically.

Implemented: SQL schema + checksum migrations, local database provisioning,
initial admin bootstrap, whitelist authentication and server authorization,
start/resume attempt, save answer with revision checks, fixed subtest deadlines,
objective grading, pending essay status, and idempotent manual payment API.

Implemented identity extension: migration 004 generates immutable Kode Siswa
codes in PostgreSQL, retaining optional school NIS metadata. Admin student search
and creation APIs are present; newly created records are nonactive until the
enrollment workflow is complete. Existing student screens/imports are not connected.
See [DEVELOPMENT.md](DEVELOPMENT.md) for core-first priorities; gateway work is deferred.

Remaining: frontend API integration, Kode Siswa integration in student screens/imports and manual login, tutor admin
APIs, complete bank-soal/publishing workflow, essay-grading/finalization API,
import commits/deduplication, enrollment transactions, PTN data and choices,
violation event API, expiry worker, persistent rate limits, online configuration,
production upgrade/security review and 350-user load test.

## Local setup

1. Copy `.env.example` to `.env.local` or use the prepared local file. Keep all
   credentials in that ignored file. Never put them in Git or NEXT_PUBLIC_ vars.
2. Set DATABASE_MIGRATION_URL for the existing PostgreSQL administrator and a
   database named `euclide`. URL-encode special characters in the password.
3. For development only, DATABASE_URL can use the same administrator connection.
   Production must use a separate application login with only required DML rights,
   no CREATE/DROP or schema ownership. Configure trusted TLS for hosted connections.
4. Run `npm run db:setup` then `npm run db:migrate`. Setup creates only the dedicated
   local `euclide` database if missing. Migrations never drop existing data.
5. Set BOOTSTRAP_ADMIN_EMAIL to your Google account email and BOOTSTRAP_ADMIN_NAME.
   Run `npm run db:bootstrap-admin`. This only works before any admin exists.
6. Create a Google OAuth Web client. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.
   Add `http://localhost:3000/api/auth/callback/google` as a redirect URI.
   Set NEXTAUTH_URL to the app origin and a random NEXTAUTH_SECRET.
7. Run `npm run dev`; test OAuth at `/api/auth/signin` and identity at `/api/me`.

If this computer's npm shim fails, use the installed CLI explicitly:

```powershell
& 'C:/Program Files/nodejs/node.exe' 'C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js' run db:setup
```

## API contracts

All mutations require an Origin matching NEXTAUTH_URL and an authenticated cookie.
User IDs and roles come from the validated session and current database record,
never from LocalStorage. Responses use Cache-Control: no-store.

- POST /api/attempts: `{ "tryoutId": "uuid", "programIds": ["uuid"], "ruleYear": 2026 }`. Program IDs are resolved against year-specific database records and their SNBT composition is validated on the server. Original program and target metadata are snapshotted. One attempt per student/package for
  now; retry resumes it with the same deadlines. No retake policy implemented yet.
- GET /api/attempts/:id: serverNow, subtest schedule, current-subtest questions and
  saved answers. Returns only the owner's data. No answer keys or explanations.
- PUT /api/attempts/:id/answers/:questionId: `{ "answer": "A", "flagged": false,
  "revision": 1 }`. Same revision/payload is replay-safe; older/different revisions
  are rejected. Multiple choices use an array; text/essay use a string.
- POST /api/attempts/:id/submit: repeated submit returns the existing status/result.
  Objective results are weighted subtest scores on an internal 0–1000 scale, not
  official UTBK/IRT scores. Nonempty ungraded essays keep the result pending.
- POST /api/admin/payments: requires Idempotency-Key and `{ "studentId": "uuid",
  "amountRupiah": 500000, "method": "cash", "paidAt": "2026-10-01T10:00:00+07:00",
  "notes": "SPP" }`. The same key and payload returns the same stored receipt.
- GET /api/admin/students?q=...&limit=25&offset=0: admin-only search by Kode Siswa,
  name, or email across active and inactive students; no NIS matching. Limit max100.
- POST /api/admin/students: admin-only, same-origin, requires Idempotency-Key and
  `{ "name": "Nama", "email": "student@example.test", "cohortYear": 2026 }`, optional
  phone. `id`, `kode_siswa`, role, and status cannot be supplied by the caller.
  Creates a nonactive account and audit entry atomically; does not approve an
  application, mark payment received, or reserve a class. Existing email gives409.

## Timer policy for the first backend implementation

All subtest windows are fixed at start and run consecutively without pauses.
Finishing a subtest early does not advance the next window. Reopening the app
never adds time. Saves check database clock after taking the attempt row lock.
Reading an expired abandoned attempt finalizes it; a scheduled expiry worker is
still required to finalize attempts without subsequent requests.

## Verification

`npm run test:backend` runs integration checks against isolated PGlite PostgreSQL
instances, not your personal database. It checks schema validity, no key leakage,
owner isolation, answer retry/revision behavior, expiry, one-time submission,
essay pending state, idempotency conflicts and whitelist deactivation.

These tests do not replace real PostgreSQL concurrency tests, Google OAuth testing,
frontend E2E testing or production load testing.

