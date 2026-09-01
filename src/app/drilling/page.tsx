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
    <div className="min-h-screen bg-[#FAFAF7] py-8 font-sans text-[#13224E]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Hub Header */}
        <div className="bg-[#FFFFFF] border-2 border-[#13224E] p-6 sm:p-8 shadow-paper">
          <div className="border-b border-[#E4E4DC] pb-3 mb-4">
            <span className="font-mono text-[10px] text-[#637096] uppercase font-bold block mb-1">
              MODUL LATIHAN ADAPTIF
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#13224E]">
              Lembar Latihan Soal & Pembahasan KaTeX
            </h1>
            <p className="text-xs text-[#637096] mt-0.5">
              Drilling per subtest dengan evaluasi rumus matematika instan dan penjelasan konsep.
            </p>
          </div>

          {/* Subtest Selector Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto font-mono text-xs">
            {SUBTEST_CONFIGS.map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setSelectedSubtest(st.id);
                  setActiveQuestionIndex(0);
                  setSelectedAnswer('');
                  setShowExplanation(false);
                }}
                className={`px-3 py-1.5 border whitespace-nowrap transition ${
                  selectedSubtest === st.id
                    ? 'bg-[#13224E] text-white border-[#13224E] font-semibold'
                    : 'bg-[#FAFAF7] text-[#637096] border-[#E4E4DC] hover:border-[#13224E]'
                }`}
              >
                {st.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Drilling Question Paper Worksheet */}
        {currentQ ? (
          <div className="bg-[#FFFFFF] border border-[#13224E] p-6 sm:p-8 shadow-paper space-y-5">
            {/* Top Metadata */}
            <div className="flex items-center justify-between border-b border-[#E4E4DC] pb-3 font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-bold bg-[#13224E] text-white px-2.5 py-0.5">
                  SOAL #{activeQuestionIndex + 1}
                </span>
                <span className="text-[#637096] uppercase">
                  Tipe: {currentQ.type.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[10px]">
                <span
                  className={`font-bold px-2 py-0.5 ${
                    currentQ.difficulty === 'Sukar'
                      ? 'bg-[#FDECEB] text-[#D0342C]'
                      : currentQ.difficulty === 'Sedang'
                      ? 'bg-[#FDF3E3] text-[#C8831A]'
                      : 'bg-[#EAF7F0] text-[#126340]'
                  }`}
                >
                  Tingkat: {currentQ.difficulty}
                </span>
                <span className="text-[#637096]">
                  {subtestQuestions.length} Soal Tersedia
                </span>
              </div>
            </div>

            {/* Stimulus Context */}
            {currentQ.stimulus && (
              <div className="p-4 bg-[#FAFAF7] border border-[#E4E4DC] text-xs sm:text-sm text-[#13224E] leading-relaxed">
                <span className="font-mono text-[9px] text-[#637096] uppercase font-bold block mb-1">
                  [ WACANA / STIMULUS ]
                </span>
                <MathRenderer content={currentQ.stimulus} />
              </div>
            )}

            {/* Question Prompt */}
            <div className="text-sm sm:text-base font-serif font-semibold text-[#13224E] leading-relaxed pt-1">
              <MathRenderer content={currentQ.question} />
            </div>

            {/* Single Choice Format */}
            {currentQ.type === 'single_choice' && currentQ.options && (
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedAnswer === opt.id;
                  let cardBorder = 'border-[#E4E4DC] bg-[#FFFFFF] hover:border-[#CECEC2] hover:bg-[#FAFAF7]';

                  if (showExplanation) {
                    if (opt.id === currentQ.correctAnswer) {
                      cardBorder = 'border-[#1B8A5A] bg-[#EAF7F0]/40';
                    } else if (isSelected && opt.id !== currentQ.correctAnswer) {
                      cardBorder = 'border-[#D0342C] bg-[#FDECEB]/40';
                    }
                  } else if (isSelected) {
                    cardBorder = 'border-[#1B3B8C] bg-[#FAFAF7]';
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`flex items-start space-x-3 p-3 border cursor-pointer transition ${cardBorder}`}
                    >
                      <span
                        className={`omr-bubble shrink-0 ${
                          isSelected ? 'omr-bubble-filled' : ''
                        }`}
                      >
                        {opt.id}
                      </span>
                      <div className="pt-1 text-xs sm:text-sm leading-relaxed flex-1 text-[#13224E]">
                        <MathRenderer content={opt.text} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Short Answer Format */}
            {currentQ.type === 'short_answer' && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-mono font-semibold text-[#13224E]">
                  Ketik jawaban Anda:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 42"
                  value={selectedAnswer as string}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  disabled={showExplanation}
                  className="w-full max-w-sm px-3 py-2 bg-[#FAFAF7] border-2 border-[#13224E] font-mono text-sm font-bold text-[#13224E] focus:outline-none"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E4E4DC] font-mono text-xs">
              <button
                onClick={() => handleNextQuestion()}
                className="text-[#637096] hover:text-[#13224E]"
              >
                Lewati Soal
              </button>

              {!showExplanation ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)}
                  className="bg-[#13224E] hover:bg-[#1B3B8C] disabled:opacity-40 text-white font-semibold px-4 py-2 transition"
                >
                  Periksa Jawaban
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="inline-flex items-center space-x-1.5 bg-[#1B3B8C] hover:bg-[#274DB8] text-white font-semibold px-4 py-2 transition"
                >
                  <span>Soal Berikutnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Explanation Box */}
            {showExplanation && (
              <div className="mt-4 p-4 border border-[#13224E] bg-[#FAFAF7] space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-[#E4E4DC] pb-2 font-mono text-xs">
                  <div>
                    {isCorrect() ? (
                      <span className="flex items-center space-x-1 text-[#1B8A5A] font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Jawaban Anda BENAR (+{currentQ.maxScore} Poin)</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-[#D0342C] font-bold">
                        <XCircle className="w-4 h-4" />
                        <span>Jawaban Anda Kurang Tepat</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[#637096]">
                    Kunci: {Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer.join(', ') : currentQ.correctAnswer}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-[#13224E] leading-relaxed pt-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#1B3B8C] block mb-1">
                    PEMBAHASAN FORMULA (KaTeX Engine):
                  </span>
                  <MathRenderer content={currentQ.explanation} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#13224E] p-12 text-center text-[#637096]">
            Belum ada soal pada subtest ini.
          </div>
        )}
      </div>
    </div>
  );
}
