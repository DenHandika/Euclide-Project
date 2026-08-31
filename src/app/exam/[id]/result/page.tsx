'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import MathRenderer from '@/components/common/MathRenderer';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import confetti from 'canvas-confetti';
import {
  Award,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Target,
  FileCheck2,
} from 'lucide-react';

export default function ExamResultPage() {
  const params = useParams();
  const tryoutId = (params?.id as string) || 'to-utbk-national-01';
  const { getExamResult, tryouts, questions } = useApp();

  const result = getExamResult(tryoutId);
  const tryout = tryouts.find((t) => t.id === tryoutId) || tryouts[0];

  const [filterReview, setFilterReview] = useState<'all' | 'incorrect' | 'math'>('all');
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});

  // Confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  }, []);

  const toggleExpand = (qId: string) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // Prepare radar data for 7 UTBK subtests
  const radarData = result.subtestResults.map((st) => ({
    subject: st.subtestName.replace('Penalaran', 'Pen.').replace('Pengetahuan', 'Peng.'),
    skorSiswa: st.score,
    rataNasional: st.nationalAverage,
    fullMark: 1000,
  }));

  const reviewQuestions = tryout.questions.filter((q) => {
    if (filterReview === 'math') return q.subtestId === 'penalaran_matematika' || q.subtestId === 'pengetahuan_kuantitatif';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-blue-900 via-navy to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-300 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hasil Resmi CBT & Rasionalisasi PTN</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {result.tryoutTitle}
              </h1>
              <p className="text-xs text-slate-300">
                Peserta: <strong>{result.userName}</strong> • Tanggal: {result.date} • Model Penilaian: IRT (Item Response Theory)
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href={`/exam/${tryoutId}`}
                className="inline-flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Ujian</span>
              </Link>
              <Link
                href="/tryouts"
                className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/30 transition"
              >
                <span>Katalog Tryout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 1. Score Cards Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 shadow-elevated border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Rata-rata Skor UTBK
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-black text-navy font-mono">
                {result.totalScore}
              </span>
              <span className="text-xs font-semibold text-slate-400">/ 1000</span>
            </div>
            <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+138.5 di atas rerata nasional</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-elevated border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Persentil Nasional
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-black text-amber-500 font-mono">
                {result.percentileRank}%
              </span>
              <span className="text-xs font-semibold text-slate-400">Top Tier</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Lebih tinggi dari 97.2% peserta se-Indonesia
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-elevated border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Akurasi Jawaban
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono">
                {Math.round((result.totalCorrect / (result.totalCorrect + result.totalIncorrect + result.totalUnanswered)) * 100)}%
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500 space-x-1">
              <span className="text-emerald-700 font-bold">{result.totalCorrect} Benar</span> •{' '}
              <span className="text-rose-600">{result.totalIncorrect} Salah</span> •{' '}
              <span className="text-slate-400">{result.totalUnanswered} Kosong</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-elevated border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Status Rasionalisasi
            </span>
            <div className="mt-1">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pilihan 1 AMAN (UI)</span>
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Pilihan 2 STEI ITB dalam Zona Kompetitif
            </p>
          </div>
        </div>

        {/* 2. Target PTN Rationalization Analysis Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Rasionalisasi Peluang Lolos Target PTN SNBT
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Perbandingan skor IRT Anda dengan Passing Grade historis dan kuota SNBT 2026.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {result.ptnTargets.map((target, idx) => {
              const isAman = target.status === 'aman';
              const isKompetitif = target.status === 'kompetitif';

              return (
                <div
                  key={idx}
                  className={`rounded-2xl p-5 border-2 transition-all ${
                    isAman
                      ? 'border-emerald-300 bg-emerald-50/40'
                      : isKompetitif
                      ? 'border-amber-300 bg-amber-50/40'
                      : 'border-rose-300 bg-rose-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                      Pilihan {idx + 1}
                    </span>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        isAman
                          ? 'bg-emerald-600 text-white'
                          : isKompetitif
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {isAman ? '🟢 Zona Aman (Lolos)' : isKompetitif ? '🟡 Zona Kompetitif' : '🔴 Zona Kritis'}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">{target.ptnName}</h3>
                  <div className="text-xs font-semibold text-blue-700 mb-3">{target.prodiName}</div>

                  {/* Target vs Current Score Bar */}
                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200 mb-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Skor Anda:</span>
                      <span className="font-bold text-slate-900 font-mono">{target.userScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Target Passing Grade:</span>
                      <span className="font-bold text-slate-700 font-mono">{target.targetScore}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-100">
                      <span className="text-slate-500">Margin Selisih:</span>
                      <span
                        className={`font-black font-mono ${
                          target.difference >= 0 ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {target.difference >= 0 ? `+${target.difference}` : target.difference} Poin
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{target.advice}</p>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Peluang: <strong>{target.chancePercentage}%</strong></span>
                    <span>Kuota: <strong>{target.acceptanceQuota} Kursi</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Recharts Visualizations: Radar Chart & Subtest Bar Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart: 7 Subtest Performance */}
          <div className="bg-white rounded-3xl p-6 shadow-elevated border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Radar Kompetensi 7 Subtest UTBK
                </h3>
                <p className="text-xs text-slate-500">Skor Siswa vs Rata-rata Nasional</p>
              </div>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                IRT Normalized
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 1000]} stroke="#cbd5e1" />
                  <Radar
                    name="Skor Anda"
                    dataKey="skorSiswa"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    fillOpacity={0.45}
                  />
                  <Radar
                    name="Rerata Nasional"
                    dataKey="rataNasional"
                    stroke="#f59e0b"
                    fill="#fbbf24"
                    fillOpacity={0.25}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart: Subtest Score Details */}
          <div className="bg-white rounded-3xl p-6 shadow-elevated border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Distribusi Nilai Per Subtest
                </h3>
                <p className="text-xs text-slate-500">Pencapaian skor pada masing-masing bidang</p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                7 Subtest Lengkap
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={radarData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis
                    dataKey="subject"
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 1000]} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="skorSiswa" name="Skor Anda" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="rataNasional" name="Rerata Nasional" fill="#e2e8f0" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 4. Tentor Feedback & Strategy Notes */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-slate-200 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <img
              src={result.tentorFeedback.avatar}
              alt="Tentor"
              className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">{result.tentorFeedback.evaluator}</h3>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Evaluator PTN
                </span>
              </div>
              <p className="text-xs text-slate-500">Catatan Strategi & Rencana Tindak Lanjut Siswa</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block mb-1">
                Kekuatan Utama:
              </span>
              <p className="text-xs text-blue-950 leading-relaxed font-medium">
                {result.tentorFeedback.strengths}
              </p>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-1">
                Aspek Perlu Ditingkatkan:
              </span>
              <p className="text-xs text-amber-950 leading-relaxed font-medium">
                {result.tentorFeedback.weaknesses}
              </p>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                Rencana Aksi 2 Pekan:
              </span>
              <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                {result.tentorFeedback.strategicActionPlan}
              </p>
            </div>
          </div>
        </div>

        {/* 5. Detailed Question Solutions & KaTeX Review */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Pembahasan Soal & Langkah KaTeX Lengkap
              </h2>
              <p className="text-xs text-slate-500">
                Pelajari metode penyelesaian cepat untuk menghemat waktu pada tryout berikutnya.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilterReview('all')}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition ${
                  filterReview === 'all'
                    ? 'bg-navy text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua Soal
              </button>
              <button
                onClick={() => setFilterReview('math')}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition ${
                  filterReview === 'math'
                    ? 'bg-navy text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Kuantitatif & MTK
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {reviewQuestions.map((q, idx) => {
              const isExpanded = !!expandedSolutions[q.id];

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                          Soal #{q.number || idx + 1}
                        </span>
                        <span className="text-xs font-medium text-slate-500 capitalize">
                          {q.subtestId.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-slate-900 pt-1">
                        <MathRenderer content={q.question} />
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpand(q.id)}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs shrink-0"
                    >
                      <span>{isExpanded ? 'Tutup Pembahasan' : 'Lihat Solusi'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Expanded Solution Box with KaTeX */}
                  {isExpanded && (
                    <div className="mt-3 p-4 bg-white rounded-xl border border-blue-200 text-xs text-slate-800 space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-[11px] font-bold text-emerald-700">
                          Kunci Jawaban: {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          Bobot IRT: {q.maxScore} Poin
                        </span>
                      </div>
                      <div className="text-slate-700 pt-1 leading-relaxed">
                        <MathRenderer content={q.explanation} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
