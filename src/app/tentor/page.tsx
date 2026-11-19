"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  latestResultsByStudent,
  learningProfile,
} from "@/lib/learningAnalytics";
import Pagination from "@/components/common/Pagination";
import usePagination from "@/hooks/usePagination";

export default function TentorDashboardPage() {
  const { currentUser, students, examResults, essaySubmissions, isHydrated } =
    useApp();
  const pending = essaySubmissions.filter((essay) => !essay.isGraded);
  const queue = usePagination(pending, 3, "", [3, 6, 12]);
  const results = Object.values(examResults).filter((result) =>
    students.some((student) => student.id === result.userId),
  );
  const profiles = latestResultsByStudent(results)
    .map((result) => ({
      student: students.find((student) => student.id === result.userId)!,
      profile: learningProfile(results, result.userId)!,
    }))
    .filter((item) => item.profile.priorities.length > 0)
    .sort(
      (a, b) => a.profile.priorities[0].score - b.profile.priorities[0].score,
    );

  return (
    <div className="workspace-page">
      <header className="workspace-heading">
        <div>
          <p className="text-sm font-semibold text-[#42668E]">
            Beranda pengajar
          </p>
          <h1 className="workspace-title mt-2">Ruang mengajar</h1>
          <p className="mt-3 max-w-prose text-base leading-7 text-slate-600">
            {currentUser.name}, tinjau jawaban yang masuk dan rencanakan
            pendampingan dari hasil belajar siswa.
          </p>
        </div>
        <Link href="/admin/questions" className="eu-button-secondary">
          Kelola bank soal
        </Link>
      </header>
      <section className="workspace-feature">
        <div>
          <p className="text-sm text-[#D3E0EF]">Antrean penilaian</p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {pending.length
              ? `${pending.length} jawaban menunggu koreksi`
              : "Seluruh jawaban sudah dinilai"}
          </h2>
          <p className="mt-3 max-w-prose text-sm leading-7 text-[#D3E0EF]">
            Gunakan rubrik untuk menilai argumen, lalu berikan umpan balik yang
            bisa ditindaklanjuti siswa.
          </p>
          <Link
            href="/tentor/grading"
            className="workspace-feature-action mt-5"
          >
            Buka koreksi esai
          </Link>
        </div>
        <dl className="flex flex-wrap gap-8">
          <div>
            <dt className="text-sm text-[#D3E0EF]">Sudah dinilai</dt>
            <dd className="mt-2 text-4xl font-bold">
              {essaySubmissions.length - pending.length}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-[#D3E0EF]">Siswa dengan hasil</dt>
            <dd className="mt-2 text-4xl font-bold">
              {latestResultsByStudent(results).length}
            </dd>
          </div>
        </dl>
      </section>
      {!isHydrated ? (
        <p role="status">Memuat kegiatan pengajaran…</p>
      ) : (
        <div className="grid min-w-0 items-start gap-6 xl:grid-cols-2">
          <section className="workspace-panel min-w-0">
            <h2 className="text-xl font-bold">Jawaban yang perlu diperiksa</h2>
            {pending.length ? (
              <>
                <ul className="mt-4 divide-y divide-slate-200">
                  {queue.pageItems.map((essay) => (
                    <li key={essay.id} className="py-5">
                      <h3 className="font-semibold">{essay.studentName}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {essay.tryoutTitle} · Soal {essay.questionNumber}
                      </p>
                      <p className="text-sm text-slate-600">
                        Dikumpulkan {essay.submittedAt}
                      </p>
                    </li>
                  ))}
                </ul>
                <Pagination pagination={queue} label="jawaban menunggu" />
              </>
            ) : (
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Tidak ada jawaban yang menunggu. Buka analisis siswa untuk
                menyiapkan latihan berikutnya.
              </p>
            )}
          </section>
          <section className="workspace-panel min-w-0">
            <h2 className="text-xl font-bold">Fokus pendampingan</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Diurutkan dari skor subtes terendah pada hasil terbaru
              masing-masing siswa.
            </p>
            {profiles.length ? (
              <ul className="mt-4 divide-y divide-slate-200">
                {profiles.slice(0, 3).map(({ student, profile }) => (
                  <li key={student.id} className="py-5">
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {profile.priorities[0].name} ·{" "}
                      {profile.priorities[0].score}/1000
                    </p>
                    <Link
                      href={`/tentor/analytics?student=${encodeURIComponent(student.id)}`}
                      className="overview-text-link mt-2"
                    >
                      Lihat kebutuhan siswa
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Belum ada rincian hasil siswa untuk menentukan prioritas.
              </p>
            )}
            <Link href="/tentor/analytics" className="overview-text-link mt-3">
              Buka analisis seluruh siswa
            </Link>
          </section>
        </div>
      )}
    </div>
  );
}
