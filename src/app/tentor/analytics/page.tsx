"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  cohortLearningRows,
  latestResultsByStudent,
  learningProfile,
} from "@/lib/learningAnalytics";
import LearningProfile from "@/components/student/LearningProfile";
import Pagination from "@/components/common/Pagination";
import usePagination from "@/hooks/usePagination";

export default function TentorAnalyticsPage() {
  const { students, batches, examResults, isHydrated } = useApp();
  const [mode, setMode] = useState<"cohort" | "student">("cohort");
  const [batchId, setBatchId] = useState("all");
  const [studentId, setStudentId] = useState("");
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get(
      "student",
    );
    if (requested) {
      setStudentId(requested);
      setMode("student");
    }
  }, []);
  const scopedStudents = students.filter(
    (student) => batchId === "all" || student.batchId === batchId,
  );
  const studentIds = new Set(scopedStudents.map((student) => student.id));
  const results = Object.values(examResults).filter((result) =>
    studentIds.has(result.userId),
  );
  const latest = latestResultsByStudent(results);
  const rows = cohortLearningRows(results);
  const weakest = [...rows].sort((a, b) => a.score - b.score)[0];
  const average = latest.length
    ? Math.round(
        (latest.reduce((sum, result) => sum + result.totalScore, 0) /
          latest.length) *
          10,
      ) / 10
    : null;
  const selected = studentId
    ? scopedStudents.find((student) => student.id === studentId)
    : scopedStudents[0];
  const profile = selected ? learningProfile(results, selected.id) : null;
  const historyPagination = usePagination(
    profile?.history ?? [],
    5,
    selected?.id ?? "",
  );

  return (
    <div className="workspace-page">
      <header className="workspace-heading">
        <div>
          <p className="text-sm font-semibold text-[#42668E]">
            Pendampingan belajar
          </p>
          <h1 className="workspace-title mt-2">Analisis siswa</h1>
          <p className="mt-3 max-w-prose text-base leading-7 text-slate-600">
            Lihat kebutuhan kelas, lalu tentukan langkah pendampingan untuk
            setiap siswa.
          </p>
        </div>
        <div
          role="group"
          aria-label="Tampilan analisis"
          className="flex flex-wrap gap-3"
        >
          <button
            type="button"
            aria-pressed={mode === "cohort"}
            onClick={() => setMode("cohort")}
            className={
              mode === "cohort" ? "eu-button-primary" : "eu-button-secondary"
            }
          >
            Ringkasan kelas
          </button>
          <button
            type="button"
            aria-pressed={mode === "student"}
            onClick={() => setMode("student")}
            className={
              mode === "student" ? "eu-button-primary" : "eu-button-secondary"
            }
          >
            Per siswa
          </button>
        </div>
      </header>
      <div className="workspace-panel flex flex-wrap items-end gap-5">
        <label className="grid w-full min-w-0 gap-2 text-sm font-semibold sm:min-w-56 sm:flex-1">
          Kelas bimbingan
          <select
            value={batchId}
            onChange={(event) => {
              setBatchId(event.target.value);
              setStudentId("");
            }}
            className="workspace-select"
          >
            <option value="all">Semua kelas</option>
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name}
              </option>
            ))}
          </select>
        </label>
        {mode === "student" && (
          <label className="grid w-full min-w-0 gap-2 text-sm font-semibold sm:min-w-56 sm:flex-1">
            Siswa
            <select
              value={selected?.id ?? ""}
              onChange={(event) => setStudentId(event.target.value)}
              className="workspace-select"
              disabled={!scopedStudents.length}
            >
              {!selected && (
                <option value="" disabled>
                  {scopedStudents.length
                    ? "Pilih siswa"
                    : "Belum ada siswa di kelas ini"}
                </option>
              )}
              {scopedStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                  {student.nis ? ` · ${student.nis}` : ""}
                </option>
              ))}
            </select>
          </label>
        )}
        <p className="max-w-prose text-sm leading-6 text-slate-600">
          {scopedStudents.length} siswa dalam cakupan · {latest.length} memiliki
          hasil. Ringkasan kelas memakai satu hasil terbaru per siswa.
        </p>
      </div>
      {!isHydrated ? (
        <p role="status">Memuat hasil belajar…</p>
      ) : mode === "student" ? (
        <>
          {selected ? (
            <>
              <section className="workspace-feature">
                <div>
                  <p className="text-sm font-medium text-[#D3E0EF]">
                    Profil belajar
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">
                    {selected.name}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#D3E0EF]">
                    {selected.nis || "Kode siswa belum tersedia"} ·{" "}
                    {batches.find((batch) => batch.id === selected.batchId)
                      ?.name ?? "Belum terhubung ke kelas"}
                  </p>
                </div>
                <dl className="flex flex-wrap gap-8">
                  <div>
                    <dt className="text-sm text-[#D3E0EF]">Hasil tersedia</dt>
                    <dd className="mt-2 text-3xl font-bold">
                      {profile?.history.length ?? 0}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-[#D3E0EF]">Skor terbaru</dt>
                    <dd className="mt-2 text-3xl font-bold">
                      {profile?.latest.totalScore ?? "Belum ada"}
                    </dd>
                  </div>
                </dl>
              </section>
              <LearningProfile results={results} studentId={selected.id} />
              {profile && (
                <section className="workspace-panel">
                  <h2 id="student-history-title" className="text-xl font-bold">
                    Riwayat hasil {selected.name.split(" ")[0]}
                  </h2>
                  <div
                    className="overview-table-scroll mt-5"
                    role="region"
                    tabIndex={0}
                    aria-labelledby="student-history-title"
                  >
                    <table className="overview-table">
                      <caption className="sr-only">
                        Riwayat tryout siswa terpilih
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col">Tryout</th>
                          <th scope="col">Tanggal</th>
                          <th scope="col">Skor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyPagination.pageItems.map((result) => (
                          <tr key={result.id}>
                            <th scope="row" className="overview-row-heading">
                              {result.tryoutTitle}
                            </th>
                            <td>{result.date}</td>
                            <td className="font-semibold tabular-nums">
                              {result.totalScore}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    pagination={historyPagination}
                    label="riwayat siswa"
                  />
                </section>
              )}
            </>
          ) : (
            <p className="workspace-panel text-slate-600">
              Belum ada siswa di kelas ini. Pilih kelas lain untuk melihat
              analisis.
            </p>
          )}
        </>
      ) : (
        <>
          <section className="workspace-feature">
            <div>
              <p className="text-sm text-[#D3E0EF]">Gambaran kelas</p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                {weakest
                  ? `Prioritaskan ${weakest.name}`
                  : "Kumpulkan hasil tryout pertama"}
              </h2>
              <p className="mt-3 max-w-prose text-sm leading-7 text-[#D3E0EF]">
                {weakest
                  ? "Subtes ini memiliki rerata terendah pada hasil yang tersedia. Buka Per siswa untuk membedakan kebutuhan tiap peserta."
                  : "Setelah hasil tersedia, kebutuhan belajar kelas akan ditampilkan di sini."}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#D3E0EF]">
                Rerata skor hasil terbaru
              </p>
              <p className="mt-2 text-4xl font-bold">
                {average ?? "Belum ada"}
              </p>
              <p className="mt-2 text-sm text-[#D3E0EF]">
                Berdasarkan {latest.length} siswa
              </p>
            </div>
          </section>
          <section className="workspace-panel">
            <h2 className="text-xl font-bold">
              Subtes mana yang perlu pendampingan?
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Jumlah peserta per subtes dapat berbeda jika rincian hasil belum
              lengkap.
            </p>
            {rows.length ? (
              <ul className="mt-6 grid gap-x-10 md:grid-cols-2">
                {rows.map((row) => (
                  <li key={row.id} className="border-t border-slate-200 py-5">
                    <div className="flex flex-wrap justify-between gap-2 text-sm">
                      <h3 className="font-semibold">{row.name}</h3>
                      <p className="tabular-nums">{row.score} / 1000</p>
                    </div>
                    <progress
                      className="learning-progress mt-3"
                      value={row.score}
                      max={1000}
                      aria-label={`Rerata ${row.name}`}
                    >
                      {row.score}
                    </progress>
                    <p className="mt-2 text-xs text-slate-600">
                      {row.count} siswa dengan rincian skor
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-sm text-slate-600">
                Belum ada rincian skor untuk kelas yang dipilih.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
