'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  TrendingUp,
  BarChart2,
  Users,
  Target,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
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
    <div className="min-h-screen bg-[#FAFAF7] py-8 font-sans text-[#13224E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#13224E] pb-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase text-[#1B3B8C] block mb-1">
              ANALITIKA KOHORT & EVALUASI DAYA SAING
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#13224E]">
              Statistik 7 Subtest & Pemetaan Rasionalisasi PTN
            </h1>
            <p className="text-xs sm:text-sm text-[#637096] mt-0.5">
              Komparasi capaian siswa Euclide terhadap standar nasional BPPP dan pemetaan kuota lolos PTN Klaster 1.
            </p>
          </div>
        </div>

        {/* 1. Metric Overview Strip */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="bg-[#FFFFFF] border border-[#13224E] p-4">
              <span className="text-[10px] text-[#637096] uppercase block mb-1">
                Rerata Skor IRT Seluruh Siswa
              </span>
              <div className="text-3xl font-bold text-[#13224E]">
                718.4 <span className="text-xs text-[#9EABC7] font-normal">/ 1000</span>
              </div>
              <div className="mt-1 text-[11px] text-[#1B8A5A] font-semibold flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+168 Poin di atas Rata-rata BPPP Nasional</span>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#13224E] p-4">
              <span className="text-[10px] text-[#637096] uppercase block mb-1">
                Subtest Paling Unggul
              </span>
              <div className="text-lg font-bold text-[#1B3B8C] truncate">
                Pengetahuan Kuantitatif (PK)
              </div>
              <div className="mt-1 text-[11px] text-[#13224E]">
                Rata-rata 765 Poin (Akurasi 86.4%)
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#13224E] p-4">
              <span className="text-[10px] text-[#637096] uppercase block mb-1">
                Subtest Butuh Drilling Ekstra
              </span>
              <div className="text-lg font-bold text-[#D0342C] truncate">
                Pemahaman Bacaan & Menulis (PBM)
              </div>
              <div className="mt-1 text-[11px] text-[#D0342C]">
                Rata-rata 680 Poin (Waktu 72s per Soal)
              </div>
            </div>
          </div>
          <p className="text-[10px] font-mono text-[#9EABC7] italic mt-2 text-right">
            *Data ilustrasi — perhitungan aktual akan disesuaikan skala data riil bimbel.
          </p>
        </div>

        {/* 2. Recharts Bar Chart: Euclide vs Nasional */}
        <div className="bg-[#FFFFFF] border border-[#13224E] p-6 space-y-4">
          <div className="border-b border-[#E4E4DC] pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#13224E]">
                Komparasi Skor Subtest: Siswa Euclide vs Rata-rata Nasional
              </h2>
              <p className="text-xs text-[#637096]">
                Data agregat dari 4.820 peserta simulasi UTBK 2026.
              </p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cohortPerformanceData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4DC" />
                <XAxis dataKey="subtest" tick={{ fill: '#637096', fontSize: 10, fontFamily: 'Work Sans' }} />
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
                <Bar dataKey="rerataEuclide" name="Rerata Siswa Euclide" fill="#1B3B8C" radius={[0, 0, 0, 0]} />
                <Bar dataKey="rerataNasional" name="Rerata Nasional BPPP" fill="#CECEC2" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. PTN Benchmark Table */}
        <div className="bg-[#FFFFFF] border border-[#13224E] p-6 space-y-4">
          <div className="border-b border-[#E4E4DC] pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#13224E]">
                Benchmark Passing Grade & Estimasi Kelulusan Siswa
              </h2>
              <p className="text-xs text-[#637096]">
                Jumlah siswa Euclide yang saat ini berada di Zona Aman target PTN Klaster 1.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-[#13224E] font-mono text-[10px] text-[#637096] uppercase tracking-wider">
                  <th className="pb-2 px-2">Perguruan Tinggi (PTN)</th>
                  <th className="pb-2 px-2">Program Studi</th>
                  <th className="pb-2 px-2">Target Passing Grade</th>
                  <th className="pb-2 px-2 text-right">Siswa di Zona Aman</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4DC]">
                {ptnPassingGradeBenchmarks.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#FAFAF7] transition">
                    <td className="py-3 px-2 font-serif font-bold text-[#13224E]">{item.ptn}</td>
                    <td className="py-3 px-2 text-[#1B3B8C] font-semibold">{item.prodi}</td>
                    <td className="py-3 px-2 font-mono font-bold text-[#13224E]">{item.target}</td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-[#1B8A5A]">
                      {item.euclideEligible}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-[#E4E4DC] flex justify-end">
            <span className="text-[10px] font-mono text-[#9EABC7] italic">
              *Data ilustrasi — perhitungan aktual akan disesuaikan skala data riil bimbel.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
