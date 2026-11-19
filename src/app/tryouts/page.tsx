"use client";
import SearchForm from "@/components/common/SearchForm";
import useSubmittedSearch from "@/hooks/useSubmittedSearch";
import Pagination from "@/components/common/Pagination";
import usePagination from "@/hooks/usePagination";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { useApp } from "@/context/AppContext";
import TryoutCard from "@/components/common/TryoutCard";

export default function TryoutsCatalogPage() {
  const { tryouts, currentUser } = useApp();
  const [category, setCategory] = useState("all");
  const {
    query: search,
    draft: searchDraft,
    setDraft: setSearchDraft,
    submit: submitSearch,
    clear: clearSearch,
    revision: searchRevision,
  } = useSubmittedSearch();
  const categories = [
    { id: "all", label: "Semua tryout" },
    { id: "grand", label: "UTBK lengkap" },
    { id: "tps", label: "TPS & matematika" },
    { id: "literasi", label: "Literasi" },
  ];
  const filtered = useMemo(
    () =>
      tryouts.filter(
        (t) =>
          (category === "all" ||
            (category === "grand"
              ? t.subtests.length >= 7
              : category === "literasi"
                ? t.subtests.every((subtest) => subtest.category === "Literasi")
                : t.subtests.length < 7 &&
                  t.subtests.some(
                    (subtest) => subtest.category !== "Literasi",
                  ))) &&
          `${t.title} ${t.description} ${t.subtests.map((s) => s.name).join(" ")}`
            .toLowerCase()
            .includes(search.toLowerCase().trim()),
      ),
    [tryouts, category, search],
  );
  const tryoutsPagination = usePagination(
    filtered,
    6,
    search + "|" + category + "|" + searchRevision,
    [3, 6, 12, 24],
  );

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <div className="border-b border-slate-200/70 bg-white">
        <div className="mx-auto w-full px-5 py-10 sm:px-8">
          <p className="eu-eyebrow">RUANG BELAJAR</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Siap latihan, {currentUser.name.split(" ")[0]}?
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Pilih tryout sesuai kebutuhanmu. Mulai, evaluasi, lalu tingkatkan
            lagi.
          </p>
        </div>
      </div>
      <div className="mx-auto w-full px-5 py-8 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-[#E0E7F0] bg-[#EAF0FA] p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-bold">
              Belajar lebih terarah dari hasil tryout
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Lihat evaluasi subtes dan target program studi untuk menyusun
              langkah berikutnya.
            </p>
          </div>
          <Link
            href="/exam/to-utbk-national-01/result"
            className="flex shrink-0 items-center gap-2 text-sm font-bold text-[#244676] hover:underline"
          >
            Contoh hasil tryout
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="mb-7 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div
            role="group"
            aria-label="Kategori tryout"
            className="flex flex-wrap gap-2"
          >
            {categories.map((c) => (
              <button
                key={c.id}
                aria-pressed={category === c.id}
                onClick={() => setCategory(c.id)}
                className={`min-h-11 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${category === c.id ? "border-[#244676] bg-[#244676] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-[#B4C5DE]"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <SearchForm
            label="Cari tryout"
            placeholder="Materi atau nama tryout"
            value={searchDraft}
            onChange={setSearchDraft}
            onSearch={submitSearch}
            className="xl:w-80"
          />
        </div>
        <p role="status" className="mb-4 text-sm text-slate-500">
          {filtered.length} paket tersedia{" "}
        </p>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tryoutsPagination.pageItems.map((t) => (
            <TryoutCard key={t.id} tryout={t} />
          ))}
        </div>
        <Pagination pagination={tryoutsPagination} label="tryout" />

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <BookOpen className="mx-auto mb-4 text-slate-400" />
            <h2 className="font-bold">Tryout belum ditemukan</h2>
            <p className="mt-2 text-sm text-slate-500">
              Coba kata kunci lain atau tampilkan semua kategori.
            </p>
            <button
              type="button"
              onClick={() => {
                clearSearch();
                setCategory("all");
              }}
              className="eu-button-secondary mt-5"
            >
              Tampilkan semua tryout
            </button>
          </div>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">
            Ingin belajar satu materi dulu?
          </p>
          <Link
            href="/drilling"
            className="flex items-center gap-2 text-sm font-semibold text-[#244676]"
          >
            Buka latihan soal
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
