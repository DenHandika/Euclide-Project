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
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Target,
  ArrowRight,
} from 'lucide-react';

export default function ExamResultPage() {
  const params = useParams();
  const tryoutId = (params?.id as string) || 'to-utbk-national-01';
  const { getExamResult, tryouts } = useApp();

  const result = getExamResult(tryoutId);
  const tryout = tryouts.find((t) => t.id === tryoutId) || tryouts[0];

  const [filterReview, setFilterReview] = useState<'all' | 'math'>('all');
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
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
    <div className="min-h-screen bg-[#FAFAF7] py-8 font-sans text-[#13224E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* 1. Official Examination Evaluation Sheet Header */}
        <div className="bg-[#FFFFFF] border-2 border-[#13224E] p-6 sm:p-8 shadow-paper">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E4E4DC] pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-[#13224E]" />
                <span className="font-mono text-xs font-bold uppercase text-[#13224E]">
                  LEMBAR HASIL UJIAN CBT & EVALUASI RASIONALISASI PTN
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#13224E]">
                {result.tryoutTitle}
              </h1>
              <p className="text-xs font-mono text-[#637096]">
                Peserta: <strong className="text-[#13224E]">{result.userName}</strong> • Tanggal Uji: {result.date} • Model: Item Response Theory (IRT)
              </p>
            </div>

            <div className="flex items-center space-x-2 font-mono text-xs">
              <Link
                href={`/exam/${tryoutId}`}
                className="inline-flex items-center space-x-1 bg-[#FAFAF7] hover:bg-[#F3F3ED] text-[#13224E] px-3 py-2 border border-[#CECEC2] transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Ujian</span>
              </Link>
              <Link
                href="/tryouts"
                className="inline-flex items-center space-x-1 bg-[#1B3B8C] hover:bg-[#274DB8] text-white px-3.5 py-2 transition"
              >
                <span>Katalog Tryout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 2. Key Score Cards Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
            <div className="bg-[#FAFAF7] border border-[#E4E4DC] p-4 font-mono">
              <span className="text-[10px] uppercase text-[#637096] block mb-1">
                Rata-rata Skor UTBK
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl font-bold text-[#13224E]">
                  {result.totalScore}
                </span>
                <span className="text-xs text-[#9EABC7]">/ 1000</span>
              </div>
              <div className="mt-1 text-[11px] text-[#1B8A5A] font-semibold">
                +138.5 di atas rerata nasional
              </div>
            </div>

            <div className="bg-[#FAFAF7] border border-[#E4E4DC] p-4 font-mono">
              <span className="text-[10px] uppercase text-[#637096] block mb-1">
                Persentil Nasional
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl font-bold text-[#C8831A]">
                  {result.percentileRank}%
                </span>
                <span className="text-xs text-[#9EABC7]">Top Tier</span>
              </div>
              <p className="mt-1 text-[11px] text-[#637096]">
                Desil atas peserta se-Indonesia
              </p>
            </div>

            <div className="bg-[#FAFAF7] border border-[#E4E4DC] p-4 font-mono">
              <span className="text-[10px] uppercase text-[#637096] block mb-1">
                Akurasi Jawaban
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl font-bold text-[#1B3B8C]">
                  {Math.round((result.totalCorrect / (result.totalCorrect + result.totalIncorrect + result.totalUnanswered)) * 100)}%
                </span>
              </div>
              <div className="mt-1 text-[11px] text-[#637096]">
                <span className="text-[#1B8A5A] font-semibold">{result.totalCorrect} Benar</span> •{' '}
                <span className="text-[#D0342C] font-semibold">{result.totalIncorrect} Salah</span>
              </div>
            </div>

            <div className="bg-[#FAFAF7] border border-[#E4E4DC] p-4 font-mono">
              <span className="text-[10px] uppercase text-[#637096] block mb-1">
                Status Rasionalisasi
              </span>
              <div className="mt-1">
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-bold bg-[#EAF7F0] text-[#126340] border border-[#1B8A5A]/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pilihan 1 AMAN (UI)</span>
                </span>
              </div>
              <p className="mt-1 text-[10px] text-[#637096]">
                Pilihan 2 STEI ITB Kompetitif
              </p>
            </div>
          </div>
          <p className="text-[10px] text-[#9EABC7] italic mt-2 text-right font-mono">
            *Data ilustrasi — perhitungan aktual akan disesuaikan skala data riil bimbel.
          </p>
        </div>

        {/* 3. Target PTN Rationalization Cards */}
        <div className="bg-[#FFFFFF] border border-[#13224E] p-6 sm:p-8 space-y-5 shadow-paper">
          <div className="border-b border-[#E4E4DC] pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#13224E]">
                Rasionalisasi Peluang Target PTN SNBT
              </h2>
              <p className="text-xs text-[#637096]">
                Perbandingan skor capaian dengan ambang batas historis dan daya tampung SNBT.
              </p>
            </div>
            <Target className="w-5 h-5 text-[#1B3B8C]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {result.ptnTargets.map((target, idx) => {
              const isAman = target.status === 'aman';
              const isKompetitif = target.status === 'kompetitif';

              return (
                <div
                  key={idx}
                  className={`p-4 border transition-all ${
                    isAman
                      ? 'border-[#1B8A5A] bg-[#FAFAF7]'
                      : isKompetitif
                      ? 'border-[#EFA93B] bg-[#FAFAF7]'
                      : 'border-[#D0342C] bg-[#FAFAF7]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 font-mono text-[10px]">
                    <span className="border border-[#CECEC2] bg-[#FFFFFF] px-1.5 py-0.5 font-semibold text-[#13224E]">
                      PIL #{idx + 1}
                    </span>
                    <span
                      className={`font-bold px-2 py-0.5 ${
                        isAman
                          ? 'bg-[#EAF7F0] text-[#126340] border border-[#1B8A5A]/30'
                          : isKompetitif
                          ? 'bg-[#FDF3E3] text-[#C8831A] border border-[#EFA93B]/40'
                          : 'bg-[#FDECEB] text-[#A6211A] border border-[#D0342C]/30'
                      }`}
                    >
                      {isAman ? '🟢 Zona Aman (Lolos)' : isKompetitif ? '🟡 Zona Kompetitif' : '🔴 Zona Kritis'}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#13224E] leading-snug">
                    {target.ptnName}
                  </h3>
                  <div className="text-xs font-medium text-[#1B3B8C] mb-3">{target.prodiName}</div>

                  {/* Target vs User Score Box */}
                  <div className="space-y-1 bg-[#FFFFFF] p-2.5 border border-[#E4E4DC] mb-3 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#637096]">Skor Anda:</span>
                      <span className="font-bold text-[#13224E]">{target.userScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#637096]">Target Passing:</span>
                      <span className="text-[#13224E]">{target.targetScore}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[#E4E4DC]">
                      <span className="text-[#637096]">Margin:</span>
                      <span
                        className={`font-bold ${
                          target.difference >= 0 ? 'text-[#1B8A5A]' : 'text-[#C8831A]'
                        }`}
                      >
                        {target.difference >= 0 ? `+${target.difference}` : target.difference} Poin
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#637096] leading-relaxed mb-3">{target.advice}</p>

                  <div className="pt-2 border-t border-[#E4E4DC] flex items-center justify-between font-mono text-[10px] text-[#637096]">
                    <span>Peluang: <strong className="text-[#13224E]">{target.chancePercentage}%</strong></span>
                    <span>Kuota: <strong className="text-[#13224E]">{target.acceptanceQuota} Kursi</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#E4E4DC] flex justify-end">
            <span className="text-[10px] font-mono text-[#9EABC7] italic">
              *Data ilustrasi — perhitungan aktual akan disesuaikan skala data riil bimbel.
            </span>
          </div>
        </div>

        {/* 4. Recharts Visualizations: Radar Chart & Subtest Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart: 7 Subtest Performance */}
          <div className="bg-[#FFFFFF] border border-[#13224E] p-6 shadow-paper space-y-3">
            <div className="flex items-center justify-between border-b border-[#E4E4DC] pb-2">
              <div>
                <h3 className="font-serif font-bold text-base text-[#13224E]">
                  Radar Kompetensi 7 Subtest UTBK
                </h3>
                <p className="text-xs text-[#637096]">Skor Siswa vs Rata-rata Nasional BPPP</p>
              </div>
              <span className="font-mono text-[9px] text-[#1B3B8C] bg-[#FAFAF7] border border-[#E4E4DC] px-2 py-0.5">
                IRT NORMALIZED
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="70%">
                  <PolarGrid stroke="#E4E4DC" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#13224E', fontSize: 10, fontFamily: 'Work Sans' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 1000]} stroke="#CECEC2" />
                  <Radar
                    name="Skor Anda"
                    dataKey="skorSiswa"
                    stroke="#1B3B8C"
                    fill="#1B3B8C"
                    fillOpacity={0.35}
                  />
                  <Radar
                    name="Rerata Nasional"
                    dataKey="rataNasional"
                    stroke="#EFA93B"
                    fill="#EFA93B"
                    fillOpacity={0.2}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', fontFamily: 'Work Sans' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#13224E',
                      color: '#FFFFFF',
                      borderRadius: '0px',
                      fontSize: '11px',
                      fontFamily: 'JetBrains Mono',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart: Subtest Score Details */}
          <div className="bg-[#FFFFFF] border border-[#13224E] p-6 shadow-paper space-y-3">
            <div className="flex items-center justify-between border-b border-[#E4E4DC] pb-2">
              <div>
                <h3 className="font-serif font-bold text-base text-[#13224E]">
                  Distribusi Nilai Per Subtest
                </h3>
                <p className="text-xs text-[#637096]">Rincian pencapaian skor per bidang</p>
              </div>
              <span className="font-mono text-[9px] text-[#13224E] bg-[#FAFAF7] border border-[#E4E4DC] px-2 py-0.5">
                7 SUBTEST
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={radarData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis
                    dataKey="subject"
                    tick={{ fill: '#637096', fontSize: 9, fontFamily: 'Work Sans' }}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 1000]} tick={{ fill: '#637096', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#13224E',
                      color: '#FFFFFF',
                      borderRadius: '0px',
                      fontSize: '11px',
                      fontFamily: 'JetBrains Mono',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Work Sans' }} />
                  <Bar dataKey="skorSiswa" name="Skor Anda" fill="#1B3B8C" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="rataNasional" name="Rerata Nasional" fill="#CECEC2" radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 5. Tentor Strategy Notes (Ruled Sheet Style) */}
        <div className="bg-[#FFFFFF] border border-[#13224E] p-6 sm:p-8 space-y-4 shadow-paper">
          <div className="flex items-center space-x-3 pb-3 border-b border-[#E4E4DC]">
            <img
              src={result.tentorFeedback.avatar}
              alt="Tentor"
              className="w-10 h-10 object-cover border border-[#13224E]"
            />
            <div>
              <h3 className="font-serif font-bold text-base text-[#13224E]">{result.tentorFeedback.evaluator}</h3>
              <p className="text-xs text-[#637096]">Ulasan Strategis & Catatan Tindak Lanjut Akademik</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 bg-[#FAFAF7] border border-[#E4E4DC]">
              <span className="font-mono text-[9px] uppercase font-bold text-[#1B3B8C] block mb-1">
                Kekuatan Utama:
              </span>
              <p className="text-xs text-[#13224E] leading-relaxed">
                {result.tentorFeedback.strengths}
              </p>
            </div>

            <div className="p-3.5 bg-[#FAFAF7] border border-[#E4E4DC]">
              <span className="font-mono text-[9px] uppercase font-bold text-[#C8831A] block mb-1">
                Aspek Ditingkatkan:
              </span>
              <p className="text-xs text-[#13224E] leading-relaxed">
                {result.tentorFeedback.weaknesses}
              </p>
            </div>

            <div className="p-3.5 bg-[#FAFAF7] border border-[#E4E4DC]">
              <span className="font-mono text-[9px] uppercase font-bold text-[#1B8A5A] block mb-1">
                Rencana Aksi 2 Pekan:
              </span>
              <p className="text-xs text-[#13224E] leading-relaxed">
                {result.tentorFeedback.strategicActionPlan}
              </p>
            </div>
          </div>
        </div>

        {/* 6. Detailed KaTeX Solutions */}
        <div className="bg-[#FFFFFF] border border-[#13224E] p-6 sm:p-8 space-y-4 shadow-paper">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E4DC] pb-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#13224E]">
                Pembahasan & Langkah KaTeX Lengkap
              </h2>
              <p className="text-xs text-[#637096]">
                Pelajari metode penyelesaian cepat untuk butir soal pada simulasi berikutnya.
              </p>
            </div>

            <div className="flex items-center space-x-2 font-mono text-xs">
              <button
                onClick={() => setFilterReview('all')}
                className={`px-2.5 py-1 border ${
                  filterReview === 'all'
                    ? 'bg-[#13224E] text-white border-[#13224E]'
                    : 'bg-[#FAFAF7] text-[#637096] border-[#CECEC2]'
                }`}
              >
                Semua Soal
              </button>
              <button
                onClick={() => setFilterReview('math')}
                className={`px-2.5 py-1 border ${
                  filterReview === 'math'
                    ? 'bg-[#13224E] text-white border-[#13224E]'
                    : 'bg-[#FAFAF7] text-[#637096] border-[#CECEC2]'
                }`}
              >
                Kuantitatif & MTK
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {reviewQuestions.map((q, idx) => {
              const isExpanded = !!expandedSolutions[q.id];

              return (
                <div
                  key={q.id}
                  className="border border-[#E4E4DC] bg-[#FAFAF7] p-4 space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 font-mono text-xs">
                        <span className="font-bold text-[#13224E]">
                          SOAL #{q.number || idx + 1}
                        </span>
                        <span className="text-[#637096] capitalize">
                          [{q.subtestId.replace(/_/g, ' ')}]
                        </span>
                      </div>
                      <div className="text-sm font-serif font-semibold text-[#13224E] pt-0.5">
                        <MathRenderer content={q.question} />
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpand(q.id)}
                      className="inline-flex items-center space-x-1 text-xs font-mono font-medium text-[#1B3B8C] bg-[#FFFFFF] px-2.5 py-1 border border-[#CECEC2] shrink-0"
                    >
                      <span>{isExpanded ? 'Tutup Solusi' : 'Lihat Solusi'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-2 p-3.5 bg-[#FFFFFF] border border-[#1B3B8C] text-xs text-[#13224E] space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between pb-1.5 border-b border-[#E4E4DC] font-mono">
                        <span className="font-bold text-[#1B8A5A]">
                          Kunci: {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}
                        </span>
                        <span className="text-[#637096]">
                          Bobot IRT: {q.maxScore} Poin
                        </span>
                      </div>
                      <div className="leading-relaxed">
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
