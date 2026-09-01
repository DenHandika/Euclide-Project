'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { EssaySubmission } from '@/types';
import MathRenderer from '@/components/common/MathRenderer';
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  X,
} from 'lucide-react';

export default function TentorGradingPage() {
  const { essaySubmissions, gradeEssay, showToast } = useApp();
  const [selectedEssay, setSelectedEssay] = useState<EssaySubmission | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(85);
  const [feedbackInput, setFeedbackInput] = useState<string>(
    'Struktur penalaran logis sudah sangat kuat. Pertajam estimasi galat numerik pada pembuktian akhir.'
  );

  const handleOpenGrading = (essay: EssaySubmission) => {
    setSelectedEssay(essay);
    setScoreInput(essay.score ?? 85);
    setFeedbackInput(
      essay.feedback ??
        'Struktur penalaran logis sudah sangat kuat. Pertajam estimasi galat numerik pada pembuktian akhir.'
    );
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEssay) return;

    gradeEssay(selectedEssay.id, scoreInput, feedbackInput);
    setSelectedEssay(null);
  };

  const pendingList = essaySubmissions.filter((e) => !e.isGraded);
  const gradedList = essaySubmissions.filter((e) => e.isGraded);

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-8 font-sans text-[#13224E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#13224E] pb-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase text-[#C8831A] block mb-1">
              PORTAL PENILAIAN TENTOR
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#13224E]">
              Antrean Koreksi Esai Argumentatif Siswa
            </h1>
            <p className="text-xs sm:text-sm text-[#637096] mt-0.5">
              Evaluasi lembar jawaban esai dengan rubrik penilaian manual (0–100) dan umpan balik personal.
            </p>
          </div>

          <div className="flex items-center space-x-3 font-mono text-xs">
            <div className="bg-[#FFFFFF] border border-[#13224E] px-3 py-1.5">
              <span className="text-[#637096] block text-[10px] uppercase">Menunggu Penilaian:</span>
              <span className="font-bold text-[#C8831A] text-sm">{pendingList.length} Berkas</span>
            </div>
            <div className="bg-[#FFFFFF] border border-[#13224E] px-3 py-1.5">
              <span className="text-[#637096] block text-[10px] uppercase">Telah Dinilai:</span>
              <span className="font-bold text-[#1B8A5A] text-sm">{gradedList.length} Berkas</span>
            </div>
          </div>
        </div>

        {/* Submissions Table Sheet */}
        <div className="bg-[#FFFFFF] border border-[#13224E] p-6 space-y-4">
          <div className="border-b border-[#E4E4DC] pb-3 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[#13224E]">
              Daftar Berkas Jawaban Masuk
            </h2>
            <span className="font-mono text-xs text-[#637096]">
              Total: {essaySubmissions.length} Berkas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-[#13224E] font-mono text-[10px] text-[#637096] uppercase tracking-wider">
                  <th className="pb-2 px-2">Nama Siswa / NIS</th>
                  <th className="pb-2 px-2">Subtest Ujian</th>
                  <th className="pb-2 px-2">Waktu Pengumpulan</th>
                  <th className="pb-2 px-2">Status Koreksi</th>
                  <th className="pb-2 px-2">Skor Rubrik</th>
                  <th className="pb-2 px-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4DC]">
                {essaySubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#FAFAF7] transition">
                    <td className="py-3 px-2">
                      <div className="font-semibold text-[#13224E]">{sub.studentName}</div>
                      <div className="text-[10px] font-mono text-[#637096]">{sub.studentNis}</div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-[#13224E] font-medium capitalize">{sub.subtestId.replace(/_/g, ' ')}</div>
                      <div className="text-[10px] text-[#637096] truncate max-w-[200px]">{sub.questionText}</div>
                    </td>
                    <td className="py-3 px-2 font-mono text-[10px] text-[#637096]">{sub.submittedAt}</td>
                    <td className="py-3 px-2 font-mono text-[10px]">
                      <span
                        className={`inline-block px-1.5 py-0.2 font-semibold ${
                          sub.isGraded
                            ? 'bg-[#EAF7F0] text-[#126340] border border-[#1B8A5A]/30'
                            : 'bg-[#FDF3E3] text-[#C8831A] border border-[#EFA93B]/40'
                        }`}
                      >
                        {sub.isGraded ? 'Selesai Dinilai' : 'Menunggu Koreksi'}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-mono font-bold text-sm">
                      {sub.score !== undefined ? (
                        <span className="text-[#1B8A5A]">{sub.score} / 100</span>
                      ) : (
                        <span className="text-[#9EABC7]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right font-mono">
                      <button
                        onClick={() => handleOpenGrading(sub)}
                        className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold transition ${
                          sub.isGraded
                            ? 'bg-[#FAFAF7] hover:bg-[#F3F3ED] text-[#13224E] border border-[#CECEC2]'
                            : 'bg-[#13224E] hover:bg-[#1B3B8C] text-white'
                        }`}
                      >
                        <span>{sub.isGraded ? 'Ubah Nilai' : 'Beri Nilai'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Grading Worksheet Modal */}
      {selectedEssay && (
        <div className="fixed inset-0 z-50 bg-[#13224E]/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] max-w-2xl w-full p-6 border-2 border-[#13224E] space-y-4 font-sans my-8">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E4DC]">
              <div>
                <h3 className="font-serif font-bold text-base text-[#13224E]">
                  Lembar Penilaian Esai Tentor
                </h3>
                <p className="font-mono text-[10px] text-[#637096]">
                  Siswa: <strong>{selectedEssay.studentName}</strong> ({selectedEssay.studentNis})
                </p>
              </div>
              <button onClick={() => setSelectedEssay(null)} className="text-[#637096]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prompt */}
            <div className="p-3 bg-[#FAFAF7] border border-[#E4E4DC] text-xs">
              <span className="font-mono text-[9px] uppercase font-bold text-[#637096] block mb-1">
                [ PERTANYAAN SOAL ]
              </span>
              <div className="font-serif font-semibold text-[#13224E]">
                <MathRenderer content={selectedEssay.questionText} />
              </div>
            </div>

            {/* Student's Ruled Answer Sheet */}
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-[#1B3B8C] uppercase font-bold">
                Lembar Jawaban Siswa:
              </span>
              <div className="p-4 bg-[#FFFFFF] border-2 border-[#CECEC2] text-xs sm:text-sm text-[#13224E] leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap font-sans">
                {selectedEssay.studentAnswer}
              </div>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4 pt-2 border-t border-[#E4E4DC] text-xs">
              {/* Score Slider & Numeric Input */}
              <div className="bg-[#FAFAF7] p-3.5 border border-[#E4E4DC] space-y-2 font-mono">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#13224E]">
                    Skor Rubrik (Rentang 0 — 100):
                  </label>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold text-[#1B8A5A]">{scoreInput}</span>
                    <span className="text-[#637096] text-xs">/ 100</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(Number(e.target.value))}
                  className="w-full accent-[#1B8A5A]"
                />
              </div>

              {/* Tentor Feedback */}
              <div>
                <label className="block font-semibold text-[#13224E] mb-1">
                  Catatan Evaluasi & Rekomendasi Tentor
                </label>
                <textarea
                  rows={3}
                  required
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full p-2.5 bg-[#FAFAF7] border border-[#CECEC2] text-xs focus:outline-none focus:border-[#13224E] font-sans"
                />
              </div>

              <div className="pt-2 border-t border-[#E4E4DC] flex justify-end space-x-2 font-mono">
                <button
                  type="button"
                  onClick={() => setSelectedEssay(null)}
                  className="px-3 py-1.5 bg-[#FAFAF7] border border-[#CECEC2] text-[#637096]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#13224E] hover:bg-[#1B3B8C] text-white font-semibold"
                >
                  Simpan Nilai & Terbitkan Ulasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
