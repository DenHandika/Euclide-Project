"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { learningProfile, resultsForStudent } from "@/lib/learningAnalytics";
import LearningProfile from "@/components/student/LearningProfile";
import TryoutCard from "@/components/common/TryoutCard";
import Pagination from "@/components/common/Pagination";
import usePagination from "@/hooks/usePagination";

export default function StudentDashboardPage() {
  const { currentUser, examResults, activeSessions, tryouts, isHydrated } =
    useApp();
  const results = resultsForStudent(Object.values(examResults), currentUser.id);
  const profile = learningProfile(results, currentUser.id);
  const ongoing = Object.values(activeSessions).filter(
    (session) => session.userId === currentUser.id && !session.isCompleted,
  );
  const catalog = usePagination(tryouts, 3, "", [3, 6, 9]);

  return (
    <div className="workspace-page">
      <header className="workspace-heading">
        <div>
          <p className="text-sm font-semibold text-[#42668E]">Beranda siswa</p>
          <h1 className="workspace-title mt-2">
            Ruang belajar {currentUser.name.split(" ")[0]}
          </h1>
          <p className="mt-3 max-w-prose text-base leading-7 text-slate-600">
            Lanjutkan belajarmu dengan satu langkah yang jelas: latihan, tryout,
            lalu evaluasi hasilnya.
          </p>
        </div>
        <Link href="/tryouts" className="eu-button-secondary">
          Semua tryout
        </Link>
      </header>
      {!isHydrated ? (
        <p role="status">Memuat kegiatan belajarmu…</p>
      ) : (
        <>
          <section className="workspace-feature">
            <div className="max-w-2xl">
              <p className="text-sm text-[#D3E0EF]">Langkah berikutnya</p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                {ongoing.length
                  ? "Selesaikan tryout yang sedang berjalan"
                  : profile?.priorities[0]
                    ? `Latih ${profile.priorities[0].name}`
                    : "Mulai dari tryout pertamamu"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#D3E0EF]">
                {profile
                  ? "Gunakan hasil terakhir untuk memilih latihan berikutnya, lalu cek perkembangan pada tryout selanjutnya."
                  : "Pilih prodi tujuan sebelum mulai. Setelah selesai, lihat subtes yang perlu diperkuat dan tentukan prioritas latihan."}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={
                    ongoing[0]
                      ? `/exam/${ongoing[0].tryoutId}`
                      : profile?.priorities[0]
                        ? `/drilling?subtest=${profile.priorities[0].id}`
                        : "/tryouts"
                  }
                  className="workspace-feature-action"
                >
                  {ongoing.length
                    ? "Lanjutkan tryout"
                    : profile
                      ? "Buka latihan prioritas"
                      : "Pilih tryout"}
                </Link>
                <Link href="/drilling" className="workspace-feature-link">
                  Latihan per subtes
                </Link>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-7">
              <div>
                <dt className="text-sm text-[#D3E0EF]">Hasil tersedia</dt>
                <dd className="mt-2 text-4xl font-bold">{results.length}</dd>
              </div>
              <div>
                <dt className="text-sm text-[#D3E0EF]">Skor terbaru</dt>
                <dd className="mt-2 text-4xl font-bold">
                  {profile?.latest.totalScore ?? "—"}
                </dd>
              </div>
            </dl>
          </section>
          {profile ? (
            <LearningProfile results={results} studentId={currentUser.id} />
          ) : (
            <section className="workspace-panel">
              <h2 className="text-xl font-bold">Kenali titik awalmu</h2>
              <p className="mt-3 max-w-prose text-sm leading-7 text-slate-600">
                Belum ada hasil tryout milikmu. Kerjakan satu paket agar peta
                kemampuan dan prioritas latihan dapat ditampilkan.
              </p>
            </section>
          )}
          {results.length > 0 && (
            <section className="workspace-panel">
              <h2 className="text-xl font-bold">Hasil terakhir</h2>
              <ul className="mt-4 divide-y divide-slate-200">
                {results.slice(0, 3).map((result) => (
                  <li
                    key={result.id}
                    className="flex flex-wrap items-center justify-between gap-4 py-4"
                  >
                    <div>
                      <h3 className="font-semibold">{result.tryoutTitle}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {result.date} · Skor {result.totalScore}
                      </p>
                    </div>
                    <Link
                      href={`/exam/${result.tryoutId}/result`}
                      className="overview-text-link"
                    >
                      Lihat hasil
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Pilih sesi belajarmu</h2>
            <p className="mt-2 text-sm text-slate-600">
              Paket lengkap atau latihan fokus sesuai kebutuhanmu.
            </p>
          </div>
          <Link href="/tryouts" className="overview-text-link">
            Buka katalog tryout
          </Link>
        </div>
        <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {catalog.pageItems.map((tryout) => (
            <TryoutCard key={tryout.id} tryout={tryout} />
          ))}
        </div>
        <Pagination pagination={catalog} label="paket di beranda" />
      </section>
    </div>
  );
}
