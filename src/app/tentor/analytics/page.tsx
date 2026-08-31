'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { SUBTEST_CONFIGS } from '@/data/mockData';
import {
  Award,
  TrendingUp,
  BarChart2,
  Users,
  Target,
  Sparkles,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export default function TentorAnalyticsPage() {
  const { students } = useApp();

  const cohortPerformanceData = [
    { subtest: 'Penalaran Umum', rerataEuclide: 742, rerataNasional: 580 },
    { subtest: 'Pengetahuan Kuantitatif', rerataEuclide: 765, rerataNasional: 545 },
    { subtest: 'PBM', rerataEuclide: 680, rerataNasional: 560 },
    { subtest: 'PPU', rerataEuclide: 695, rerataNasional: 550 },
    { subtest: 'Literasi B. Indo', rerataEuclide: 688, rerataNasional: 570 },
    { subtest: 'Literasi B. Inggris', rerataEuclide: 720, rerataNasional: 530 },
    { subtest: 'Penalaran MTK', rerataEuclide: 739, rerataNasional: 520 },
  ];

  const ptnPassingGradeBenchmarks = [
    { ptn: 'Universitas Indonesia (UI)', prodi: 'Pendidikan Dokter', target: 745, euclideEligible: '32 Siswa' },
    { ptn: 'Institut Teknologi Bandung (ITB)', prodi: 'STEI - Rekayasa', target: 725, euclideEligible: '48 Siswa' },
    { ptn: 'Universitas Indonesia (UI)', prodi: 'Teknik Informatika', target: 700, euclideEligible: '65 Siswa' },
    { ptn: 'Universitas Gadjah Mada (UGM)', prodi: 'Kedokteran', target: 740, euclideEligible: '30 Siswa' },
    { ptn: 'Institut Teknologi Sepuluh Nopember (ITS)', prodi: 'Sistem Informasi', target: 680, euclideEligible: '84 Siswa' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full mb-2 border border-amber-200">
              <BarChart2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Analitika Kohort & Rasionalisasi PTN</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Statistik Subtest & Evaluasi Daya Saing SNBT
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Komparasi performa siswa Euclide terhadap standar nasional BPPP dan pemetaan kuota lolos PTN Klaster 1.
            </p>
          </div>
        </div>

        {/* 1. Metric Overview Cards */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-3xl p-6 shadow-elevated border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Rerata Skor IRT Seluruh Siswa
              </span>
              <div className="text-3xl font-black text-navy font-mono">
                718.4 <span className="text-xs font-medium text-slate-400 font-sans">/ 1000</span>
              </div>
              <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+168 Poin di atas Rata-rata BPPP Nasional</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-elevated border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Subtest Paling Unggul
              </span>
              <div className="text-xl font-bold text-slate-900">
                Pengetahuan Kuantitatif (PK)
              </div>
              <div className="mt-2 text-xs text-blue-600 font-semibold">
                Rata-rata 765 Poin (Akurasi 86.4%)
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-elevated border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Subtest Butuh Drilling Ekstra
              </span>
              <div className="text-xl font-bold text-rose-600">
                Pemahaman Bacaan & Menulis (PBM)
              </div>
              <div className="mt-2 text-xs text-rose-600 font-semibold">
                Rata-rata 680 Poin (Waktu 72s per Soal)
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 italic mt-2 text-right">
            *Data ilustrasi — perhitungan aktual akan disesuaikan skala data riil bimbel.
          </p>
        </div>

        {/* 2. Recharts Bar Chart: Euclide vs Nasional */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Komparasi Skor Subtest: Siswa Euclide vs Rata-rata Nasional
              </h2>
              <p className="text-xs text-slate-500">
                Data agregat dari 4.820 peserta simulasi UTBK 2026.
              </p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cohortPerformanceData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="subtest" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis domain={[0, 1000]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="rerataEuclide" name="Rerata Siswa Euclide" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="rerataNasional" name="Rerata Nasional BPPP" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. PTN Benchmark Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Benchmark Passing Grade & Estimasi Kelulusan Siswa
              </h2>
              <p className="text-xs text-slate-500">
                Jumlah siswa Euclide yang saat ini berada di Zona Aman target PTN Klaster 1.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">Perguruan Tinggi (PTN)</th>
                  <th className="pb-3 px-3">Program Studi</th>
                  <th className="pb-3 px-3">Target Passing Grade</th>
                  <th className="pb-3 px-3 text-right">Siswa di Zona Aman</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ptnPassingGradeBenchmarks.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-3 font-bold text-slate-900">{item.ptn}</td>
                    <td className="py-3.5 px-3 text-blue-700 font-semibold">{item.prodi}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-800">{item.target}</td>
                    <td className="py-3.5 px-3 text-right font-bold text-emerald-700">
                      {item.euclideEligible}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <span className="text-[10px] text-slate-400 italic">
              *Data ilustrasi — perhitungan aktual akan disesuaikan skala data riil bimbel.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
