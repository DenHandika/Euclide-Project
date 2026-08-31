'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { EssaySubmission } from '@/types';
import MathRenderer from '@/components/common/MathRenderer';
import {
  FileCheck2,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Sliders,
  MessageSquare,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export default function TentorGradingPage() {
  const { essaySubmissions, gradeEssay, currentUser, showToast } = useApp();

  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>(
    essaySubmissions[0]?.id || ''
  );
  const [rubricScore, setRubricScore] = useState<number>(85);
  const [feedbackText, setFeedbackText] = useState<string>(
    'Analisis argumentatif sangat sistematis dan menyinggung peran penting metakognisi. Penataan kalimat sangat baku dan sesuai PUEBI.'
  );

  const selectedSub = essaySubmissions.find((s) => s.id === selectedSubmissionId) || essaySubmissions[0];

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    gradeEssay(selectedSub.id, rubricScore, feedbackText);
  };

  const pendingCount = essaySubmissions.filter((s) => !s.isGraded).length;
  const completedCount = essaySubmissions.filter((s) => s.isGraded).length;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full mb-2 border border-amber-200">
              <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
              <span>Portal Evaluasi Tentor & Instruktur</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Antrean Koreksi Esai Manual & Rubrik Nilai
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Evaluasi jawaban esai literasi siswa, tetapkan skor rubrik analitis (0–100), dan berikan bimbingan personal.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl font-bold">
              ⏳ {pendingCount} Menunggu Koreksi
            </span>
            <span className="bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl font-bold">
              ✅ {completedCount} Selesai Dinilai
            </span>
          </div>
        </div>

        {/* Main 2-Column Interface: Queue List on Left, Grading Sheet on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Submissions Queue List */}
          <div className="bg-white rounded-3xl p-5 shadow-elevated border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Antrean Lembar Esai ({essaySubmissions.length})
              </span>
            </div>

            <div className="space-y-2.5 max-h-[700px] overflow-y-auto">
              {essaySubmissions.map((sub) => {
                const isSelected = sub.id === selectedSub?.id;
                return (
                  <div
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubmissionId(sub.id);
                      if (sub.isGraded && sub.score !== undefined) {
                        setRubricScore(sub.score);
                        setFeedbackText(sub.feedback || '');
                      }
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {sub.studentName}
                      </div>
                      {sub.isGraded ? (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full shrink-0">
                          {sub.score}/100
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full shrink-0">
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mb-1">
                      {sub.tryoutTitle}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>NIS: {sub.studentNis}</span>
                      <span>{sub.wordCount} kata</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Grading Worksheet & Rubric Slider */}
          {selectedSub ? (
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-slate-200 space-y-6">
              {/* Question & Stimulus Review */}
              <div className="space-y-3 pb-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    Soal Esai #{selectedSub.questionNumber}
                  </span>
                  <span className="text-xs text-slate-500">
                    Disubmit: {selectedSub.submittedAt}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-900 leading-relaxed">
                  <MathRenderer content={selectedSub.questionText} />
                </div>

                {/* Rubric Guide Box */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    📋 Panduan Rubrik Penilaian:
                  </span>
                  <p className="whitespace-pre-line text-slate-600 leading-relaxed">
                    {selectedSub.rubricGuide}
                  </p>
                </div>
              </div>

              {/* Student's Actual Answer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Jawaban Siswa: {selectedSub.studentName} ({selectedSub.studentNis})
                  </span>
                  <span className="font-mono text-blue-600 font-bold">
                    {selectedSub.wordCount} Kata
                  </span>
                </div>
                <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-200 text-xs sm:text-sm text-slate-900 leading-relaxed whitespace-pre-line font-sans">
                  {selectedSub.studentAnswer}
                </div>
              </div>

              {/* Interactive Rubric Slider & Feedback Form */}
              <form onSubmit={handleGradeSubmit} className="space-y-5 pt-4 border-t border-slate-100">
                {/* Rubric Score Slider (0 - 100) */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-amber-600" />
                      <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Skor Rubrik Esai (0 - 100)
                      </label>
                    </div>
                    <div className="text-2xl font-black text-amber-600 font-mono">
                      {rubricScore} <span className="text-xs text-slate-400 font-sans">/ 100</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={rubricScore}
                    onChange={(e) => setRubricScore(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />

                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>0 (Kosong/Menyimpang)</span>
                    <span>50 (Cukup)</span>
                    <span>75 (Baik)</span>
                    <span>100 (Sempurna)</span>
                  </div>
                </div>

                {/* Tentor Comments & Actionable Feedback */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Catatan & Ulasan Konstruktif Tentor untuk Siswa:</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Berikan masukan terkait kelebihan argumen dan aspek yang perlu diperbaiki..."
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs text-slate-900 leading-relaxed focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md shadow-amber-600/20 flex items-center justify-center space-x-2 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Simpan Nilai & Publikasikan ke Siswa</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-white rounded-3xl p-12 text-center text-slate-400">
              Pilih lembar esai dari antrean sebelah kiri untuk memulai penilaian.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
