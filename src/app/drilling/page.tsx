'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SUBTEST_CONFIGS, MOCK_QUESTIONS } from '@/data/mockData';
import { SubtestId, Question } from '@/types';
import MathRenderer from '@/components/common/MathRenderer';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Flame,
  Clock,
  BookOpen,
} from 'lucide-react';

export default function DrillingPage() {
  const { questions } = useApp();
  const [selectedSubtest, setSelectedSubtest] = useState<SubtestId>('penalaran_matematika');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('');
  const [showExplanation, setShowExplanation] = useState(false);

  // Filter questions for the selected subtest or fallback
  const subtestQuestions = questions.filter((q) => q.subtestId === selectedSubtest);
  const currentQ: Question = subtestQuestions[activeQuestionIndex] || questions[0];

  const handleSelectOption = (optId: string) => {
    if (showExplanation) return; // Locked once evaluated
    if (currentQ.type === 'multi_select') {
      const currentList = Array.isArray(selectedAnswer) ? [...selectedAnswer] : [];
      if (currentList.includes(optId)) {
        setSelectedAnswer(currentList.filter((x) => x !== optId));
      } else {
        setSelectedAnswer([...currentList, optId]);
      }
    } else {
      setSelectedAnswer(optId);
    }
  };

  const handleCheckAnswer = () => {
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer('');
    setShowExplanation(false);
    if (activeQuestionIndex < subtestQuestions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    } else {
      setActiveQuestionIndex(0);
    }
  };

  const isCorrect = () => {
    if (!currentQ) return false;
    if (currentQ.type === 'multi_select') {
      const corr = Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer : [currentQ.correctAnswer];
      const ans = Array.isArray(selectedAnswer) ? selectedAnswer : [];
      return corr.length === ans.length && corr.every((c) => ans.includes(c));
    } else if (currentQ.type === 'short_answer') {
      return (
        String(selectedAnswer).trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase()
      );
    } else {
      return selectedAnswer === currentQ.correctAnswer;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Hub Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full mb-2">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Drilling Adaptif Tanpa Batas Waktu</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Modul Drilling & Pembahasan KaTeX
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Latihan soal harian per subtest dengan evaluasi rumus instan dan penjelasan konsep mendalam.
              </p>
            </div>
          </div>

          {/* Subtest Selector Tabs */}
          <div className="mt-6 flex items-center space-x-2 overflow-x-auto pb-2">
            {SUBTEST_CONFIGS.map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setSelectedSubtest(st.id);
                  setActiveQuestionIndex(0);
                  setSelectedAnswer('');
                  setShowExplanation(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedSubtest === st.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>
        </div>

        {/* Drilling Question Card */}
        {currentQ ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-slate-200 space-y-6">
            {/* Question Top Metadata */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  Soal #{activeQuestionIndex + 1}
                </span>
                <span className="text-xs font-semibold text-slate-500 capitalize">
                  Tipe: {currentQ.type.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    currentQ.difficulty === 'Sukar'
                      ? 'bg-rose-100 text-rose-700'
                      : currentQ.difficulty === 'Sedang'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {currentQ.difficulty}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {subtestQuestions.length} Soal Tersedia
                </span>
              </div>
            </div>

            {/* Stimulus Context (if any) */}
            {currentQ.stimulus && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Wacana / Konteks:
                </span>
                <MathRenderer content={currentQ.stimulus} />
              </div>
            )}

            {/* Prompt */}
            <div className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
              <MathRenderer content={currentQ.question} />
            </div>

            {/* Options / Inputs based on Question Format */}
            {currentQ.type === 'single_choice' && currentQ.options && (
              <div className="space-y-3">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedAnswer === opt.id;
                  let cardStyle = isSelected
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800';

                  if (showExplanation) {
                    if (opt.id === currentQ.correctAnswer) {
                      cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20';
                    } else if (isSelected && opt.id !== currentQ.correctAnswer) {
                      cardStyle = 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-500/20';
                    }
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`flex items-start space-x-3.5 p-3.5 rounded-2xl border cursor-pointer transition-all ${cardStyle}`}
                    >
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {opt.id}
                      </span>
                      <div className="pt-0.5 text-xs sm:text-sm leading-relaxed flex-1">
                        <MathRenderer content={opt.text} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {currentQ.type === 'multi_select' && currentQ.options && (
              <div className="space-y-3">
                <div className="text-xs text-amber-700 font-semibold bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  ℹ️ Soal Kotak-kotak: Pilih <strong>semua</strong> jawaban yang benar.
                </div>
                {currentQ.options.map((opt) => {
                  const selectedArr = Array.isArray(selectedAnswer) ? selectedAnswer : [];
                  const isChecked = selectedArr.includes(opt.id);

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`flex items-start space-x-3.5 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div className="text-xs sm:text-sm leading-relaxed flex-1">
                        <MathRenderer content={opt.text} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {currentQ.type === 'short_answer' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Ketik jawaban singkat Anda di bawah ini:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 42"
                  value={selectedAnswer as string}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  disabled={showExplanation}
                  className="w-full max-w-sm px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            )}

            {/* Evaluation Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => handleNextQuestion()}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Lewati Soal
              </button>

              {!showExplanation ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)}
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Periksa Jawaban</span>
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition"
                >
                  <span>Soal Berikutnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Explanation & KaTeX Pembahasan */}
            {showExplanation && (
              <div className="mt-4 p-5 rounded-2xl bg-slate-900 text-white space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {isCorrect() ? (
                      <span className="flex items-center space-x-1 text-emerald-400 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Jawaban Anda BENAR! (+{currentQ.maxScore} Poin)</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-rose-400 font-bold text-xs">
                        <XCircle className="w-4 h-4" />
                        <span>Jawaban Anda Kurang Tepat</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Kunci: {Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer.join(', ') : currentQ.correctAnswer}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 text-xs sm:text-sm text-slate-300">
                  <span className="font-bold text-amber-400 block mb-1">
                    Pembahasan Konsep (KaTeX Engine):
                  </span>
                  <MathRenderer content={currentQ.explanation} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-500">
            Belum ada soal pada subtest ini. Silakan pilih subtest lain.
          </div>
        )}
      </div>
    </div>
  );
}
