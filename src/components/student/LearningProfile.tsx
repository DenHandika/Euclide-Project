"use client";

import Link from "next/link";
import type { ExamResult } from "@/types";
import { learningProfile, studyAdvice } from "@/lib/learningAnalytics";

export default function LearningProfile({
  results,
  studentId,
}: {
  results: ExamResult[];
  studentId: string;
}) {
  const profile = learningProfile(results, studentId);
  if (!profile)
    return (
      <section className="workspace-panel">
        <h2 className="text-xl font-bold">Belum ada hasil tryout</h2>
        <p className="mt-3 max-w-prose text-sm leading-7 text-slate-600">
          Analisis belajar tersedia setelah hasil tryout siswa ini tercatat.
        </p>
      </section>
    );

  return (
    <div className="learning-profile">
      <div className="learning-profile-grid grid min-w-0 items-start gap-6">
        <section className="workspace-panel min-w-0">
          <h2 className="text-xl font-bold">Peta kemampuan per subtes</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {profile.latest.tryoutTitle} · {profile.latest.date}
          </p>
          {profile.rows.length === 0 ? (
            <p className="mt-5 text-sm text-slate-600">
              Rincian skor subtes belum tersedia pada hasil ini.
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-slate-200">
              {profile.rows.map((row) => (
                <li key={row.id} className="py-4 first:pt-0">
                  <div className="flex flex-wrap justify-between gap-2 text-sm">
                    <span className="font-semibold">{row.name}</span>
                    <span className="tabular-nums text-slate-600">
                      <strong className="text-slate-900">{row.score}</strong> /
                      1000
                      {row.accuracy === null ? "" : ` · ${row.accuracy}% benar`}
                    </span>
                  </div>
                  <progress
                    className="learning-progress mt-3"
                    max={1000}
                    value={row.score}
                    aria-label={`Skor ${row.name}`}
                  >
                    {row.score} dari 1000
                  </progress>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="workspace-panel min-w-0">
          <h2 className="text-xl font-bold">Prioritas latihan berikutnya</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Mulai dari subtes dengan skor terendah pada hasil terbaru. Materi
            dapat disesuaikan tentor setelah melihat jawaban.
          </p>
          <ol className="mt-6 space-y-6">
            {profile.priorities.map((row, index) => (
              <li key={row.id} className="border-t border-slate-200 pt-5">
                <p className="text-sm font-semibold text-[#244676]">
                  {index + 1}. {studyAdvice(row.id).focus}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {studyAdvice(row.id).activity}
                </p>
                <Link
                  href={`/drilling?subtest=${row.id}`}
                  className="overview-text-link mt-2"
                >
                  Latihan {row.name}
                </Link>
              </li>
            ))}
          </ol>
          {profile.strongest && (
            <div className="mt-6 rounded-xl bg-[#F0F4FA] p-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Skor tertinggi: {profile.strongest.name}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {profile.strongest.score}/1000 pada hasil ini. Sisipkan latihan
                pengulangan sambil mendahulukan subtes prioritas.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
