'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SUBTEST_CONFIGS } from '@/data/mockData';
import { SubtestId, Question } from '@/types';
import MathRenderer from '@/components/common/MathRenderer';
import WrittenAnswer from '@/components/common/WrittenAnswer';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

export default function DrillingPage() {
  const { questions } = useApp();
  const [selectedSubtest, setSelectedSubtest] = useState<SubtestId>(
    'penalaran_matematika'
  );
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('');
  const [showExplanation, setShowExplanation] = useState(false);

  const subtestQuestions = questions.filter(
    (q) => q.subtestId === selectedSubtest
  );
  const currentQ: Question =
    subtestQuestions[activeQuestionIndex] || questions[0];

  const handleSelectOption = (optId: string) => {
    if (showExplanation) return;
    if (currentQ.type === 'multi_select') {
      const currentList = Array.isArray(selectedAnswer)
        ? [...selectedAnswer]
        : [];
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
      const corr = Array.isArray(currentQ.correctAnswer)
        ? currentQ.correctAnswer
        : [currentQ.correctAnswer];
      const ans = Array.isArray(selectedAnswer) ? selectedAnswer : [];
      return corr.length === ans.length && corr.every((c) => ans.includes(c));
    } else if (currentQ.type === 'short_answer') {
      return (
        String(selectedAnswer).trim().toLowerCase() ===
        String(currentQ.correctAnswer).trim().toLowerCase()
      );
    } else {
      return selectedAnswer === currentQ.correctAnswer;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-10 font-sans text-slate-900 pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Latihan soal dan pembahasan
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Pilih subtes, kerjakan soal, lalu pelajari pembahasannya.
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
                className={`px-4 py-2 rounded-xl whitespace-nowrap font-semibold transition min-h-11 ${
                  selectedSubtest === st.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                } `}
              >
                {st.name}
              </button>
            ))}
          </div>
        </div>

        {/* Drilling Question Paper Worksheet */}
        {currentQ ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 space-y-6">
            {/* Top Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="font-bold bg-slate-900 text-white px-2.5 py-1 rounded-md text-xs">
                  Soal #{activeQuestionIndex + 1}
                </span>
                <span className="text-slate-500 capitalize">
                  {
                    {
                      single_choice: 'Pilihan ganda',
                      multi_select: 'Pilihan jamak',
                      short_answer: 'Isian singkat',
                      essay: 'Esai',
                    }[currentQ.type]
                  }
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
                <span className="text-slate-600">
                  {subtestQuestions.length} Soal
                </span>
              </div>
            </div>

            {/* Stimulus Context */}
            {currentQ.stimulus && (
              <section
                aria-label="Wacana"
                className="space-y-3 text-base leading-relaxed text-slate-800"
              >
                <h2 className="text-sm font-semibold text-slate-600">Wacana</h2>
                <div className="whitespace-pre-line">
                  <MathRenderer content={currentQ.stimulus} />
                </div>
              </section>
            )}

            {/* Question Prompt */}
            <div className="text-base font-sans font-semibold text-slate-900 leading-relaxed">
              <MathRenderer content={currentQ.question} />
            </div>

            {/* Single Choice Format */}
            {(currentQ.type === 'single_choice' ||
              currentQ.type === 'multi_select') &&
              currentQ.options && (
                <div className="space-y-2.5 pt-1">
                  {currentQ.options.map((opt) => {
                    const isSelected = Array.isArray(selectedAnswer)
                      ? selectedAnswer.includes(opt.id)
                      : selectedAnswer === opt.id;
                    let cardStyle =
                      'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70';

                    if (showExplanation) {
                      if (
                        Array.isArray(currentQ.correctAnswer)
                          ? currentQ.correctAnswer.includes(opt.id)
                          : opt.id === currentQ.correctAnswer
                      ) {
                        cardStyle =
                          'border-emerald-500 bg-emerald-50/60 font-semibold';
                      } else if (
                        isSelected &&
                        !(Array.isArray(currentQ.correctAnswer)
                          ? currentQ.correctAnswer.includes(opt.id)
                          : opt.id === currentQ.correctAnswer)
                      ) {
                        cardStyle = 'border-rose-500 bg-rose-50/60';
                      }
                    } else if (isSelected) {
                      cardStyle =
                        'border-blue-600 bg-blue-50/80 shadow-xs font-semibold';
                    }

                    return (
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        disabled={showExplanation}
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`w-full text-left flex items-start space-x-3.5 p-3.5 rounded-xl border cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${cardStyle}`}
                      >
                        <span
                          className={`omr-bubble shrink-0 ${
                            isSelected ? 'omr-bubble-filled' : ''
                          }`}
                        >
                          {opt.id}
                        </span>
                        <div className="pt-0.5 text-base text-slate-900 leading-relaxed font-sans">
                          <MathRenderer content={opt.text} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

            {(currentQ.type === 'short_answer' ||
              currentQ.type === 'essay') && (
              <WrittenAnswer
                key={currentQ.id}
                type={currentQ.type}
                value={typeof selectedAnswer === 'string' ? selectedAnswer : ''}
                onChange={setSelectedAnswer}
                readOnly={showExplanation}
              />
            )}

            {/* Actions Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                {!showExplanation ? (
                  <button
                    type="button"
                    onClick={handleCheckAnswer}
                    disabled={
                      !String(selectedAnswer).trim() ||
                      (Array.isArray(selectedAnswer) &&
                        selectedAnswer.length === 0)
                    }
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition min-h-11 ${
                      !String(selectedAnswer).trim() ||
                      (Array.isArray(selectedAnswer) &&
                        selectedAnswer.length === 0)
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                    } `}
                  >
                    Periksa Jawaban
                  </button>
                ) : (
                  <div role="status" className="flex items-center space-x-2">
                    {currentQ.type === 'essay' ? (
                      <p className="text-sm font-semibold text-blue-800">
                        Bandingkan jawabanmu dengan pembahasan. Esai tidak
                        dinilai otomatis.
                      </p>
                    ) : isCorrect() ? (
                      <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>
                          Jawaban Anda Benar! (+{currentQ.maxScore || 100} Poin)
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>
                          Kurang Tepat. Kunci:{' '}
                          {Array.isArray(currentQ.correctAnswer)
                            ? currentQ.correctAnswer.join(', ')
                            : currentQ.correctAnswer}
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Explanation Section */}
            {showExplanation && currentQ.explanation && (
              <section
                aria-label="Pembahasan"
                className="space-y-3 border-t border-slate-200 pt-6"
              >
                <h2 className="text-lg font-bold text-slate-900">Pembahasan</h2>
                <div className="whitespace-pre-line text-base leading-relaxed text-slate-800">
                  <MathRenderer content={currentQ.explanation} />
                </div>
              </section>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition min-h-11"
              >
                <span>Soal Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
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
