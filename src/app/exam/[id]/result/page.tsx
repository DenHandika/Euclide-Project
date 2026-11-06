'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import MathRenderer from '@/components/common/MathRenderer';
import TargetEvaluation from '@/components/student/TargetEvaluation';
import { evaluateTarget } from '@/lib/snbtChoices';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Award,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  RotateCcw,
  ArrowRight,
  Sparkles,
  User,
  GraduationCap,
  FileCheck2,
  Layers,
  Percent,
} from 'lucide-react';

export default function ExamResultPage() {
  const params = useParams();
  const tryoutId = (params?.id as string) || 'to-utbk-national-01';
  const { getExamResult, tryouts } = useApp();
  const [filterReview, setFilterReview] = useState<'all' | 'math' | 'wrong'>('all');

  const result = getExamResult(tryoutId);
  const tryout = tryouts.find((t) => t.id === tryoutId) || tryouts[0];
  const firstChoice = result.targetChoices?.[0];
  const firstTarget = evaluateTarget(result.totalScore, firstChoice?.targetScore ?? null);

  const radarData = result.subtestResults.map((st) => ({
    subject: st.subtestName.replace('Penalaran', 'Pen.').replace('Pengetahuan', 'Peng.'),
    skorSiswa: st.score,
    rataAngkatan: st.nationalAverage,
    fullMark: 1000,
  }));

  const reviewQuestions = tryout.questions.filter((q) => {
    if (filterReview === 'math') return q.subtestId === 'penalaran_matematika' || q.subtestId === 'pengetahuan_kuantitatif';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">Prototipe untuk demo: skor, statistik, dan evaluasi materi masih menggunakan data contoh. Pilihan prodi berasal dari preferensi saat sesi dimulai.</p>
        {/* 1. Official Evaluation Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200/80 rounded-full text-xs font-semibold text-blue-700">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Lembar Hasil Ujian CBT & Evaluasi Rasionalisasi PTN</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {result.tryoutTitle}
              </h1>
              <p className="text-xs text-slate-500 font-sans">
                Peserta: <strong className="text-slate-800">{result.userName}</strong> • Tanggal Uji: {result.date} • Metodologi: Skor Tertimbang Subtest UTBK
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold">
              <Link
                href={`/tryouts/${tryoutId}/prepare`}
                className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-4 py-2.5 rounded-xl transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Ujian</span>
              </Link>
              <Link
                href="/tryouts"
                className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4.5 py-2.5 rounded-xl shadow-xs transition"
              >
                <span>Katalog Tryout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 2. Key Score Cards Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Rata-rata Skor Tertimbang
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl font-extrabold text-slate-900">
                  {result.totalScore}
                </span>
                <span className="text-xs text-slate-400 font-sans">/ 1000</span>
              </div>
              <div className="mt-1 text-xs text-emerald-600 font-bold">
                +138.5 di atas rata-rata angkatan
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Peringkat Internal Bimbel
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl font-extrabold text-amber-600">
                  {result.percentileRank}%
                </span>
                <span className="text-xs text-slate-400 font-sans">Top Tier</span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Top 5% dari 650 siswa angkatan
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Akurasi Jawaban Benar
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl font-extrabold text-blue-600">
                  {result.totalCorrect}
                </span>
                <span className="text-xs text-slate-400 font-sans">/ {result.totalCorrect + result.totalIncorrect + result.totalUnanswered} Butir contoh</span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                {result.totalIncorrect} Salah • {result.totalUnanswered} Kosong
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Target Pilihan 1
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-extrabold text-slate-900">
                  {firstChoice ? firstTarget.label : 'Belum ada pilihan'}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                {firstChoice ? `${firstChoice.name} · ${firstChoice.degree}` : 'Pilih prodi sebelum memulai tryout.'}
              </p>
            </div>
          </div>
        </div>

        <TargetEvaluation choices={result.targetChoices ?? []} score={result.totalScore} />

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-bold">Fokus belajar berikutnya</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">Mulai dari subtes dengan skor terendah pada contoh hasil ini.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[...result.subtestResults].sort((a, b) => a.score - b.score).slice(0, 3).map((subtest, index) => (
              <div key={subtest.subtestId} className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-[#244676]">Prioritas latihan {index + 1}</p>
                <h3 className="mt-2 text-sm font-bold leading-6">{subtest.subtestName}</h3>
                <p className="mt-1 text-xs text-slate-500">Skor contoh: {subtest.score}/1000</p>
              </div>
            ))}
          </div>
          <Link href="/drilling" className="eu-button-secondary mt-5 rounded-xl">Buka latihan soal <ArrowRight size={16} /></Link>
        </section>

        {/* 4. Visualizations: Radar Chart & Subtest Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-card">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Radar Kompetensi 7 Subtest UTBK
                </h3>
                <p className="text-xs text-slate-500">Skor Siswa vs Rata-rata Angkatan Euclide</p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                7 SUBTEST
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="70%">
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 1000]} stroke="#CBD5E1" />
                  <Radar
                    name="Skor Anda"
                    dataKey="skorSiswa"
                    stroke="#2563EB"
                    fill="#3B82F6"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="Rerata Angkatan"
                    dataKey="rataAngkatan"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.2}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-card">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Distribusi Nilai Per Subtest
                </h3>
                <p className="text-xs text-slate-500">Rincian pencapaian skor per bidang studi</p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                SKOR CAPAIAN
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={radarData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis
                    dataKey="subject"
                    tick={{ fill: '#64748B', fontSize: 9 }}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 1000]} tick={{ fill: '#64748B', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="skorSiswa" name="Skor Anda" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rataAngkatan" name="Rata-rata Angkatan" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 5. Tentor Qualitative Feedback Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              DT
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Catatan Evaluasi & Rencana Aksi Tentor
              </h3>
              <p className="text-xs text-slate-500">
                Evaluator: <strong className="text-slate-800">{result.tentorFeedback.evaluator}</strong> • Pembimbing Spesialis UTBK
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/70 space-y-1">
              <div className="text-xs font-bold text-emerald-800 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kekuatan Utama Siswa:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {result.tentorFeedback.strengths}
              </p>
            </div>

            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-1">
              <div className="text-xs font-bold text-amber-800 flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>Area Perlu Peningkatan:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {result.tentorFeedback.weaknesses}
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/70">
            <div className="text-xs font-bold text-blue-900 mb-1">
              Rekomendasi Strategis Sesi Bimbingan Berikutnya:
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {result.tentorFeedback.strategicActionPlan}
            </p>
          </div>
        </div>

        {/* 6. Question Review List with KaTeX Explanations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Pembahasan Lengkap & Kunci Jawaban
              </h3>
              <p className="text-xs text-slate-500">Telaah langkah pengerjaan dan pembahasan KaTeX per butir soal</p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              {[
                { id: 'all', label: `Semua (${reviewQuestions.length})` },
                { id: 'math', label: 'Matematika & Kuantitatif' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterReview(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition min-h-11 ${
                    filterReview === tab.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  } `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {reviewQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center font-sans font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      Soal #{idx + 1} • {q.subtestId.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                    Kunci: {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
                  <MathRenderer content={q.question} />
                </div>

                {q.explanation && (
                  <div className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-1.5 text-xs">
                    <span className="font-bold text-blue-700 block">
                      Pembahasan Langkah Pengerjaan:
                    </span>
                    <div className="text-slate-700 leading-relaxed font-sans">
                      <MathRenderer content={q.explanation} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
