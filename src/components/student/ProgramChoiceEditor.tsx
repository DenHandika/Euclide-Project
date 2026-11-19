"use client";
import SearchForm from "@/components/common/SearchForm";
import useSubmittedSearch from "@/hooks/useSubmittedSearch";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Trash2,
  Plus,
  AlertCircle,
} from "lucide-react";
import { DEMO_PROGRAMS } from "@/data/programs";
import { Degree, StudyProgram, validateChoices } from "@/lib/snbtChoices";

export default function ProgramChoiceEditor({
  choices,
  onChange,
}: {
  choices: StudyProgram[];
  onChange: (choices: StudyProgram[]) => void;
}) {
  const {
    query: search,
    draft: searchDraft,
    setDraft: setSearchDraft,
    submit: submitSearch,
  } = useSubmittedSearch();
  const [degree, setDegree] = useState<Degree | "all">("all");
  const validation = validateChoices(choices);
  const programs = useMemo(
    () =>
      DEMO_PROGRAMS.filter(
        (p) =>
          (degree === "all" || p.degree === degree) &&
          `${p.name} ${p.institution}`
            .toLowerCase()
            .includes(search.trim().toLowerCase()),
      ),
    [degree, search],
  );
  const move = (index: number, delta: number) => {
    const next = [...choices];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    onChange(next);
  };
  return (
    <div className="space-y-6">
      <section
        aria-labelledby="choice-heading"
        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="choice-heading" className="font-bold">
            Pilihanmu, sesuai prioritas
          </h2>
          <span className="text-sm text-slate-500">
            {choices.length}/4 prodi
          </span>
        </div>
        {choices.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm leading-6 text-slate-500">
            Belum ada pilihan. Cari kampus atau program studi di bawah, lalu
            tambahkan ke daftar.
          </p>
        )}
        <ol className="space-y-3">
          {choices.map((p, index) => (
            <li key={p.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF0FA] text-sm font-bold text-[#244676]">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold leading-6">{p.name}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {p.institution}
                  </p>
                  <span className="mt-2 inline-block rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                    {p.degree} · {p.degree === "S1" ? "Akademik" : "Vokasi"}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-3 flex-wrap">
                <button
                  type="button"
                  aria-label={`Naikkan prioritas ${p.name}`}
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30"
                >
                  <ArrowUp size={17} />
                </button>
                <button
                  type="button"
                  aria-label={`Turunkan prioritas ${p.name}`}
                  disabled={index === choices.length - 1}
                  onClick={() => move(index, 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30"
                >
                  <ArrowDown size={17} />
                </button>
                <button
                  type="button"
                  aria-label={`Hapus ${p.name}`}
                  onClick={() => onChange(choices.filter((c) => c.id !== p.id))}
                  className="eu-button-danger-icon"
                >
                  <Trash2 aria-hidden="true" size={18} />
                </button>
              </div>
            </li>
          ))}
        </ol>
        <div
          role="status"
          aria-live="polite"
          className={`mt-4 flex items-start gap-2 rounded-xl p-3 text-sm leading-6 ${validation.valid ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}
        >
          {validation.valid ? (
            <CheckCircle2 size={18} className="mt-1 shrink-0" />
          ) : (
            <AlertCircle size={18} className="mt-1 shrink-0" />
          )}
          {validation.message}
        </div>
        <p className="mt-3 text-xs leading-6 text-slate-500">
          Urutan menyatakan prioritas. Jenjang tidak harus berada pada posisi
          tertentu. Aturan acuan: SNBT 2026.
        </p>
      </section>
      <section
        aria-labelledby="program-heading"
        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
      >
        <h2 id="program-heading" className="mb-4 font-bold">
          Cari kampus & program studi
        </h2>
        <SearchForm
          label="Cari kampus atau prodi"
          placeholder="Nama kampus atau prodi"
          value={searchDraft}
          onChange={setSearchDraft}
          onSearch={submitSearch}
          className="mb-3"
        />
        <div
          role="group"
          aria-label="Filter jenjang"
          className="mb-4 flex flex-wrap gap-2"
        >
          {(["all", "S1", "D4", "D3"] as const).map((d) => (
            <button
              type="button"
              key={d}
              aria-pressed={degree === d}
              onClick={() => setDegree(d)}
              className={`min-h-11 rounded-lg border px-4 text-sm font-semibold ${degree === d ? "border-[#244676] bg-[#244676] text-white" : "border-slate-200 text-slate-600"}`}
            >
              {d === "all" ? "Semua" : d}
            </button>
          ))}
        </div>
        <p className="mb-4 text-xs leading-6 text-slate-500">
          Target skor adalah acuan latihan, bukan ambang kelulusan resmi.
        </p>
        <p role="status" className="mb-3 text-sm text-slate-600">
          {programs.length} program studi ditemukan
        </p>
        {programs.length === 0 && (
          <p className="mb-4 text-sm leading-7 text-slate-600">
            Tidak ada prodi yang sesuai. Ubah kata kunci, lalu tekan Enter atau
            Cari.
          </p>
        )}
        <div className="space-y-3">
          {programs.map((p) => {
            const selected = choices.some((c) => c.id === p.id);
            return (
              <div
                key={p.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-4"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#244676]">
                    {p.degree} · {p.degree === "S1" ? "Akademik" : "Vokasi"}
                  </p>
                  <h3 className="mt-1 text-sm font-bold leading-6">{p.name}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {p.institution}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Tambahkan ${p.name} ${p.degree}`}
                  disabled={selected || choices.length >= 4}
                  onClick={() => onChange([...choices, { ...p }])}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF0FA] text-[#244676] disabled:bg-slate-100 disabled:text-slate-400"
                >
                  {selected ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                </button>
              </div>
            );
          })}
        </div>
        {programs.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">
            Prodi belum ditemukan. Coba kata kunci atau jenjang lain.
          </p>
        )}
      </section>
    </div>
  );
}
