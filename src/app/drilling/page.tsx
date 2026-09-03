'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SUBTEST_CONFIGS } from '@/data/mockData';
import { SubtestId, Question } from '@/types';
import MathRenderer from '@/components/common/MathRenderer';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Zap,
  HelpCircle,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export default function DrillingPage() {
  const { questions } = useApp();
  const [selectedSubtest, setSelectedSubtest] = useState<SubtestId>('penalaran_matematika');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('');
  const [showExplanation, setShowExplanation] = useState(false);

  const subtestQuestions = questions.filter((q) => q.subtestId === selectedSubtest);
  const currentQ: Question = subtestQuestions[activeQuestionIndex] || questions[0];

  const handleSelectOption = (optId: string) => {
    if (showExplanation) return;
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
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-10 font-sans text-slate-900 pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-card space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200/80 rounded-full text-xs font-semibold text-blue-700 mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Modul Latihan Mandiri (Drilling)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Latihan Soal & Pembahasan KaTeX
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Drilling per subtest dengan evaluasi instan dan pembahasan langkah pengerjaan.
            </p>
          </div>

          {/* Subtest Selector Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            {SUBTEST_CONFIGS.map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setSelectedSubtest(st.id);
                  setActiveQuestionIndex(0);
                  setSelectedAnswer('');
                  setShowExplanation(false);
                }}
                className={`px-4 py-2 rounded-xl whitespace-nowrap font-semibold transition ${
                  selectedSubtest === st.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Drilling Question Paper Worksheet */}
        {currentQ ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-card">
            {/* Top Metadata */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-bold bg-slate-900 text-white px-2.5 py-1 rounded-md text-xs">
                  Soal #{activeQuestionIndex + 1}
                </span>
                <span className="text-slate-500 capitalize">
                  {currentQ.type.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span
                  className={`font-semibold px-2.5 py-0.5 rounded-full ${
                    currentQ.difficulty === 'Sukar'
                      ? 'bg-rose-100 text-rose-800'
                      : currentQ.difficulty === 'Sedang'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {currentQ.difficulty}
                </span>
                <span className="text-slate-400">
                  {subtestQuestions.length} Soal
                </span>
              </div>
            </div>

            {/* Stimulus Context */}
            {currentQ.stimulus && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
                <div className="flex items-center space-x-1.5 text-blue-700 font-bold mb-1 text-xs">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Wacana / Stimulus:</span>
                </div>
                <MathRenderer content={currentQ.stimulus} />
              </div>
            )}

            {/* Question Prompt */}
            <div className="text-sm sm:text-base font-serif font-medium text-slate-900 leading-relaxed">
              <MathRenderer content={currentQ.question} />
            </div>

            {/* Single Choice Format */}
            {currentQ.type === 'single_choice' && currentQ.options && (
              <div className="space-y-2.5 pt-1">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedAnswer === opt.id;
                  let cardStyle = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70';

                  if (showExplanation) {
                    if (opt.id === currentQ.correctAnswer) {
                      cardStyle = 'border-emerald-500 bg-emerald-50/60 font-semibold';
                    } else if (isSelected && opt.id !== currentQ.correctAnswer) {
                      cardStyle = 'border-rose-500 bg-rose-50/60';
                    }
                  } else if (isSelected) {
                    cardStyle = 'border-blue-600 bg-blue-50/80 shadow-xs font-semibold';
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`flex items-start space-x-3.5 p-3.5 rounded-xl border cursor-pointer transition-all duration-150 ${cardStyle}`}
                    >
                      <span
                        className={`omr-bubble shrink-0 ${
                          isSelected ? 'omr-bubble-filled' : ''
                        }`}
                      >
                        {opt.id}
                      </span>
                      <div className="pt-0.5 text-xs sm:text-sm text-slate-900 leading-relaxed font-sans">
                        <MathRenderer content={opt.text} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Actions Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                {!showExplanation ? (
                  <button
                    type="button"
                    onClick={handleCheckAnswer}
                    disabled={!selectedAnswer || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                      !selectedAnswer || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                    }`}
                  >
                    Periksa Jawaban
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    {isCorrect() ? (
                      <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Jawaban Anda Benar! (+{currentQ.maxScore || 100} Poin)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Kurang Tepat. Kunci: {Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer.join(', ') : currentQ.correctAnswer}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextQuestion}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <span>Soal Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Explanation Section */}
            {showExplanation && currentQ.explanation && (
              <div className="p-5 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-2 animate-in fade-in duration-200">
                <div className="text-xs font-bold text-blue-900 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Pembahasan Konsep Matematika / Penalaran:</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                  <MathRenderer content={currentQ.explanation} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
            Tidak ada soal pada subtest ini.
          </div>
        )}
      </div>
    </div>
  );
}
