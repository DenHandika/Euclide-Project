'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Question, UserAnswer } from '@/types';
import MathRenderer from '@/components/common/MathRenderer';
import {
  Clock,
  Maximize,
  Minimize,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Grid,
  Send,
  ShieldAlert,
  CheckCircle2,
  X,
} from 'lucide-react';

export default function CBTExamPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const tryoutId = (params?.id as string) || 'to-utbk-national-01';

  const {
    tryouts,
    startExam,
    saveAnswer,
    toggleFlagQuestion,
    updateSubtestTimer,
    incrementViolations,
    submitExam,
  } = useApp();

  const tryout = tryouts.find((t) => t.id === tryoutId) || tryouts[0];

  // Local CBT state
  const [currentSubtestIndex, setCurrentSubtestIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [antiCheatModal, setAntiCheatModal] = useState<{ isOpen: boolean; count: number }>({
    isOpen: false,
    count: 0,
  });
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  // Initialize or fetch session
  const [session, setSession] = useState(() => startExam(tryoutId));

  // Current Subtest & Question
  const currentSubtest = tryout.subtests[currentSubtestIndex] || tryout.subtests[0];
  const subtestQuestions = tryout.questions.filter((q) => q.subtestId === currentSubtest.id);
  const currentQuestion: Question =
    subtestQuestions[currentQuestionIndex] || tryout.questions[0] || ({} as Question);

  // Timer per subtest
  const [timerSeconds, setTimerSeconds] = useState<number>(() => {
    return session.subtestRemainingSeconds[currentSubtest.id] || currentSubtest.durationMinutes * 60;
  });

  // Current answer state for current question
  const currentAnswerObj: UserAnswer | undefined = session?.answers[currentQuestion?.id];
  const currentAnswerVal = currentAnswerObj?.answer ?? '';
  const isCurrentFlagged = currentAnswerObj?.isFlagged || false;

  // 1. Countdown Timer Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          if (currentSubtestIndex < tryout.subtests.length - 1) {
            handleNextSubtest();
          } else {
            handleFinalSubmit();
          }
          return 0;
        }
        const updated = prev - 1;
        updateSubtestTimer(tryoutId, currentSubtest.id, updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSubtestIndex, currentSubtest.id]);

  useEffect(() => {
    const rem = session.subtestRemainingSeconds[currentSubtest.id] || currentSubtest.durationMinutes * 60;
    setTimerSeconds(rem);
    setCurrentQuestionIndex(0);
  }, [currentSubtestIndex]);

  // 2. Anti-Cheat Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const count = incrementViolations(tryoutId);
        setAntiCheatModal({ isOpen: true, count });
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [tryoutId]);

  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Answer handlers
  const handleSelectOption = (optId: string) => {
    saveAnswer(tryoutId, currentQuestion.id, 'single_choice', optId, isCurrentFlagged);
    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: {
          questionId: currentQuestion.id,
          type: 'single_choice',
          answer: optId,
          isFlagged: isCurrentFlagged,
        },
      },
    }));
  };

  const handleMultiSelectOption = (optId: string) => {
    const currentList = Array.isArray(currentAnswerVal) ? [...currentAnswerVal] : [];
    let updatedList: string[];
    if (currentList.includes(optId)) {
      updatedList = currentList.filter((x) => x !== optId);
    } else {
      updatedList = [...currentList, optId];
    }

    saveAnswer(tryoutId, currentQuestion.id, 'multi_select', updatedList, isCurrentFlagged);
    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: {
          questionId: currentQuestion.id,
          type: 'multi_select',
          answer: updatedList,
          isFlagged: isCurrentFlagged,
        },
      },
    }));
  };

  const handleShortAnswerChange = (val: string) => {
    saveAnswer(tryoutId, currentQuestion.id, 'short_answer', val, isCurrentFlagged);
    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: {
          questionId: currentQuestion.id,
          type: 'short_answer',
          answer: val,
          isFlagged: isCurrentFlagged,
        },
      },
    }));
  };

  const handleEssayChange = (val: string) => {
    saveAnswer(tryoutId, currentQuestion.id, 'essay', val, isCurrentFlagged);
    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: {
          questionId: currentQuestion.id,
          type: 'essay',
          answer: val,
          isFlagged: isCurrentFlagged,
        },
      },
    }));
  };

  const handleToggleFlag = () => {
    toggleFlagQuestion(tryoutId, currentQuestion.id);
    setSession((prev) => {
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestion.id]: {
            questionId: currentQuestion.id,
            type: currentQuestion.type,
            answer: currentAnswerVal,
            isFlagged: !isCurrentFlagged,
          },
        },
      };
    });
  };

  const handleNextSubtest = () => {
    if (currentSubtestIndex < tryout.subtests.length - 1) {
      setCurrentSubtestIndex(currentSubtestIndex + 1);
    }
  };

  const handlePrevSubtest = () => {
    if (currentSubtestIndex > 0) {
      setCurrentSubtestIndex(currentSubtestIndex - 1);
    }
  };

  const handleFinalSubmit = () => {
    submitExam(tryoutId);
    router.push(`/exam/${tryoutId}/result`);
  };

  const totalQuestionsAll = tryout.questions.length;
  const totalAnswered = Object.values(session.answers).filter((a) => {
    if (Array.isArray(a.answer)) return a.answer.length > 0;
    return String(a.answer).trim().length > 0;
  }).length;
  const totalFlagged = Object.values(session.answers).filter((a) => a.isFlagged).length;
  const totalUnanswered = Math.max(0, totalQuestionsAll - totalAnswered);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="cbt-secure-screen min-h-screen bg-[#FAFAF7] flex flex-col justify-between font-sans text-[#13224E]"
    >
      {/* 1. CBT Header: Examination Strip */}
      <div className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#13224E] px-3 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Left: Subtest Name & Category */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <span className="w-7 h-7 bg-[#13224E] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
            {currentSubtestIndex + 1}
          </span>
          <div className="min-w-0">
            <span className="font-mono text-[9px] text-[#637096] uppercase tracking-wider block leading-none truncate">
              {currentSubtest.category} ({currentSubtestIndex + 1}/{tryout.subtests.length})
            </span>
            <h2 className="font-serif font-bold text-xs sm:text-sm text-[#13224E] leading-tight truncate">
              {currentSubtest.name}
            </h2>
          </div>
        </div>

        {/* Center/Right: Timer, Palette Trigger, Fullscreen */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Subtest Timer Box */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 font-mono text-xs sm:text-sm font-bold border ${
              timerSeconds < 300
                ? 'bg-[#FDECEB] border-[#D0342C] text-[#D0342C] animate-pulse'
                : 'bg-[#FAFAF7] border-[#13224E] text-[#13224E]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{formatTime(timerSeconds)}</span>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullScreen}
            className="p-1.5 text-[#637096] hover:text-[#13224E] border border-[#CECEC2] bg-[#FFFFFF]"
            title="Mode Layar Penuh"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>

          {/* Question Palette Trigger */}
          <button
            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
            className="flex items-center space-x-1.5 bg-[#13224E] hover:bg-[#1B3B8C] text-white text-xs font-mono px-3 py-1.5 transition"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Daftar Soal</span>
            <span className="sm:hidden">{currentQuestionIndex + 1}/{subtestQuestions.length}</span>
          </button>
        </div>
      </div>

      {/* 2. Subtest Stepper Indicator (Desktop) */}
      <div className="hidden md:flex items-center bg-[#FFFFFF] border-b border-[#E4E4DC] px-6 py-1.5 overflow-x-auto space-x-1.5">
        {tryout.subtests.map((st, idx) => {
          const isActive = idx === currentSubtestIndex;
          const isDone = idx < currentSubtestIndex;
          return (
            <button
              key={st.id}
              onClick={() => setCurrentSubtestIndex(idx)}
              className={`text-xs font-mono px-2.5 py-1 flex items-center space-x-1 shrink-0 transition ${
                isActive
                  ? 'bg-[#13224E] text-white font-bold'
                  : isDone
                  ? 'bg-[#FAFAF7] text-[#1B8A5A] border border-[#CECEC2]'
                  : 'bg-[#FAFAF7] text-[#637096] border border-[#E4E4DC] hover:border-[#13224E]'
              }`}
            >
              <span>{idx + 1}. {st.name.split(' ')[0]}</span>
              {isDone && <CheckCircle2 className="w-3 h-3 text-[#1B8A5A]" />}
            </button>
          );
        })}
      </div>

      {/* 3. Main Examination Paper Canvas */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: The Examination Worksheet */}
        <div className="lg:col-span-3 bg-[#FFFFFF] border border-[#13224E] p-5 sm:p-8 flex flex-col justify-between space-y-6 shadow-paper">
          <div className="space-y-5">
            {/* Question Top Header Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4DC]">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold bg-[#13224E] text-white px-2.5 py-0.5">
                  SOAL #{currentQuestionIndex + 1}
                </span>
                <span className="font-mono text-[11px] text-[#637096] uppercase">
                  {currentQuestion.type === 'single_choice' && 'Pilihan Ganda (OMR)'}
                  {currentQuestion.type === 'multi_select' && 'Pilihan Majemuk (Ceklis)'}
                  {currentQuestion.type === 'short_answer' && 'Isian Singkat'}
                  {currentQuestion.type === 'essay' && 'Esai Argumentatif'}
                </span>
              </div>

              {/* Ragu-ragu / Flag Button (Stabilo treatment) */}
              <button
                onClick={handleToggleFlag}
                className={`flex items-center space-x-1.5 px-2.5 py-1 text-xs font-mono border transition ${
                  isCurrentFlagged
                    ? 'bg-[#EFA93B] text-[#13224E] border-[#C8831A] font-bold'
                    : 'bg-[#FAFAF7] text-[#637096] border-[#CECEC2] hover:border-[#13224E]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-[#13224E]' : ''}`} />
                <span>{isCurrentFlagged ? 'Ragu-ragu' : 'Tandai Ragu'}</span>
              </button>
            </div>

            {/* Stimulus Reading Text */}
            {currentQuestion.stimulus && (
              <div className="p-4 bg-[#FAFAF7] border border-[#E4E4DC] text-xs sm:text-sm text-[#13224E] leading-relaxed max-h-56 overflow-y-auto">
                <span className="font-mono text-[9px] text-[#637096] uppercase font-bold block mb-1">
                  [ WACANA / STIMULUS TEKS ]
                </span>
                <MathRenderer content={currentQuestion.stimulus} />
              </div>
            )}

            {/* The Main Question Prompt */}
            <div className="text-sm sm:text-base font-serif font-semibold text-[#13224E] leading-relaxed pt-1">
              <MathRenderer content={currentQuestion.question} />
            </div>

            {/* 4. Format 1: Single Choice with OMR Bubbles */}
            {currentQuestion.type === 'single_choice' && currentQuestion.options && (
              <div className="space-y-2.5 pt-2">
                {currentQuestion.options.map((opt) => {
                  const isSelected = currentAnswerVal === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`flex items-start space-x-3 p-3 border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#1B3B8C] bg-[#FAFAF7]'
                          : 'border-[#E4E4DC] bg-[#FFFFFF] hover:border-[#CECEC2] hover:bg-[#FAFAF7]'
                      }`}
                    >
                      {/* OMR Bubble Indicator */}
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

            {/* Format 2: Multi Select Checkboxes */}
            {currentQuestion.type === 'multi_select' && currentQuestion.options && (
              <div className="space-y-2.5 pt-2">
                <div className="p-2 bg-[#FAFAF7] border border-[#CECEC2] text-xs text-[#13224E] font-mono">
                  ℹ️ Berikan tanda centang pada <strong>semua pernyataan</strong> yang bernilai benar.
                </div>
                {currentQuestion.options.map((opt) => {
                  const selectedArr = Array.isArray(currentAnswerVal) ? currentAnswerVal : [];
                  const isChecked = selectedArr.includes(opt.id);

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleMultiSelectOption(opt.id)}
                      className={`flex items-start space-x-3 p-3 border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#1B3B8C] bg-[#FAFAF7]'
                          : 'border-[#E4E4DC] bg-[#FFFFFF] hover:bg-[#FAFAF7]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="mt-1 w-4 h-4 text-[#1B3B8C] border-[#CECEC2] rounded-xs focus:ring-0 cursor-pointer"
                      />
                      <div className="text-xs sm:text-sm leading-relaxed flex-1 text-[#13224E]">
                        <MathRenderer content={opt.text} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Format 3: Short Answer */}
            {currentQuestion.type === 'short_answer' && (
              <div className="space-y-2.5 pt-2">
                <label className="block text-xs font-mono font-semibold text-[#13224E]">
                  Ketik jawaban singkat pada kolom di bawah ini:
                </label>
                <div className="max-w-md">
                  <input
                    type="text"
                    placeholder="Contoh: 42"
                    value={currentAnswerVal as string}
                    onChange={(e) => handleShortAnswerChange(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FAFAF7] border-2 border-[#13224E] font-mono text-base font-bold text-[#13224E] focus:outline-none"
                  />
                  <p className="text-[10px] font-mono text-[#637096] mt-1">
                    *Gunakan angka bulat jika hasil desimal tidak ditentukan.
                  </p>
                </div>
              </div>
            )}

            {/* Format 4: Essay Input */}
            {currentQuestion.type === 'essay' && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#637096]">Lembar Jawaban Esai:</span>
                  <span className="text-[#1B3B8C] font-bold">
                    Jumlah: {String(currentAnswerVal || '').trim() ? String(currentAnswerVal).trim().split(/\s+/).length : 0} kata
                  </span>
                </div>
                <textarea
                  rows={8}
                  placeholder="Tuliskan argumen dan pembuktian konsep Anda di sini (100–250 kata)..."
                  value={currentAnswerVal as string}
                  onChange={(e) => handleEssayChange(e.target.value)}
                  className="w-full p-3.5 bg-[#FAFAF7] border border-[#CECEC2] text-xs sm:text-sm text-[#13224E] leading-relaxed focus:outline-none focus:border-[#13224E] font-sans"
                />
              </div>
            )}
          </div>

          {/* Bottom Pagination Strip */}
          <div className="pt-4 border-t border-[#E4E4DC] flex items-center justify-between font-mono text-xs">
            <button
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                } else if (currentSubtestIndex > 0) {
                  handlePrevSubtest();
                }
              }}
              disabled={currentQuestionIndex === 0 && currentSubtestIndex === 0}
              className="inline-flex items-center space-x-1 px-3 py-2 border border-[#CECEC2] text-[#13224E] hover:bg-[#FAFAF7] disabled:opacity-30 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Sebelumnya</span>
            </button>

            {currentQuestionIndex < subtestQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="inline-flex items-center space-x-1 px-4 py-2 bg-[#1B3B8C] hover:bg-[#274DB8] text-white font-semibold transition"
              >
                <span>Berikutnya</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : currentSubtestIndex < tryout.subtests.length - 1 ? (
              <button
                onClick={handleNextSubtest}
                className="inline-flex items-center space-x-1 px-4 py-2 bg-[#13224E] hover:bg-[#1B3B8C] text-white font-semibold transition"
              >
                <span>Subtest Berikutnya</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setSubmitModalOpen(true)}
                className="inline-flex items-center space-x-1 px-4 py-2 bg-[#1B8A5A] hover:bg-[#126340] text-white font-semibold transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Jawaban</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: OMR Question Palette (Desktop) */}
        <div className="hidden lg:block bg-[#FFFFFF] border border-[#13224E] p-4 shadow-paper space-y-4">
          <div className="border-b border-[#E4E4DC] pb-2 flex items-center justify-between font-mono">
            <span className="text-xs font-bold text-[#13224E]">
              PALET OMR LJK
            </span>
            <span className="text-[10px] text-[#637096]">
              {subtestQuestions.length} Soal
            </span>
          </div>

          {/* OMR Legend */}
          <div className="grid grid-cols-3 gap-1 font-mono text-[9px] text-[#637096] pb-2 border-b border-[#E4E4DC]">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1B3B8C]" />
              <span>Diisi</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EFA93B]" />
              <span>Ragu</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFFFFF] border border-[#CECEC2]" />
              <span>Kosong</span>
            </div>
          </div>

          {/* OMR Number Bubbles Grid */}
          <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1">
            {subtestQuestions.map((q, idx) => {
              const ans = session.answers[q.id];
              const isAnswered = ans && (Array.isArray(ans.answer) ? ans.answer.length > 0 : String(ans.answer).trim().length > 0);
              const isFlag = ans?.isFlagged;
              const isCurrent = idx === currentQuestionIndex;

              let bubbleClass = 'omr-bubble';
              if (isFlag) {
                bubbleClass += ' omr-bubble-flagged';
              } else if (isAnswered) {
                bubbleClass += ' omr-bubble-filled';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`${bubbleClass} ${
                    isCurrent ? 'ring-2 ring-[#13224E] ring-offset-1' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Final Submit Trigger */}
          <button
            onClick={() => setSubmitModalOpen(true)}
            className="w-full py-2 bg-[#13224E] hover:bg-[#1B3B8C] text-white font-mono text-xs font-semibold transition flex items-center justify-center space-x-1.5"
          >
            <Send className="w-3 h-3" />
            <span>Kirim Lembar Ujian</span>
          </button>
        </div>
      </div>

      {/* 4. Mobile Bottom-Sheet OMR Palette */}
      {isPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-[#13224E]/60 flex flex-col justify-end lg:hidden">
          <div className="bg-[#FFFFFF] border-t-2 border-[#13224E] p-5 shadow-sheet max-h-[80vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E4DC]">
              <div>
                <h3 className="font-serif font-bold text-sm text-[#13224E]">
                  Palet OMR — {currentSubtest.name}
                </h3>
                <p className="font-mono text-[10px] text-[#637096]">
                  Diisi: {totalAnswered} • Ragu: {totalFlagged} • Kosong: {totalUnanswered}
                </p>
              </div>
              <button
                onClick={() => setIsPaletteOpen(false)}
                className="p-1 text-[#637096]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {subtestQuestions.map((q, idx) => {
                const ans = session.answers[q.id];
                const isAnswered = ans && (Array.isArray(ans.answer) ? ans.answer.length > 0 : String(ans.answer).trim().length > 0);
                const isFlag = ans?.isFlagged;
                const isCurrent = idx === currentQuestionIndex;

                let bubbleClass = 'omr-bubble';
                if (isFlag) {
                  bubbleClass += ' omr-bubble-flagged';
                } else if (isAnswered) {
                  bubbleClass += ' omr-bubble-filled';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setIsPaletteOpen(false);
                    }}
                    className={`${bubbleClass} ${
                      isCurrent ? 'ring-2 ring-[#13224E] ring-offset-1' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setIsPaletteOpen(false);
                setSubmitModalOpen(true);
              }}
              className="w-full py-2.5 bg-[#13224E] text-white font-mono text-xs font-semibold flex items-center justify-center space-x-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim & Selesaikan Ujian</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Anti-Cheat Integrity Modal */}
      {antiCheatModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-[#13224E]/80 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] max-w-md w-full p-6 border-2 border-[#D0342C] text-center space-y-4 shadow-sheet">
            <div className="w-10 h-10 bg-[#FDECEB] text-[#D0342C] flex items-center justify-center mx-auto border border-[#D0342C]/40">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase text-[#D0342C] bg-[#FDECEB] px-2 py-0.5 border border-[#D0342C]/30">
                Peringatan Integritas ({antiCheatModal.count}/3)
              </span>
              <h3 className="font-serif font-bold text-lg text-[#13224E]">
                Terdeteksi Keluar dari Lembar Ujian
              </h3>
            </div>

            <p className="text-xs text-[#637096] leading-relaxed font-sans">
              Anda terdeteksi berpindah jendela atau aplikasi. Catatan aktivitas ini dicatat dalam log pengawasan ujian.
            </p>

            <div className="p-3 bg-[#FDECEB] border border-[#D0342C]/30 text-left text-xs font-mono text-[#A6211A] space-y-1">
              <div>⚠️ Sisa toleransi: {Math.max(0, 3 - antiCheatModal.count)} kali.</div>
              <div>⚠️ Pelanggaran berulang dapat membatalkan sesi ujian.</div>
            </div>

            <button
              onClick={() => setAntiCheatModal({ isOpen: false, count: antiCheatModal.count })}
              className="w-full py-2.5 bg-[#D0342C] hover:bg-[#A6211A] text-white font-mono text-xs font-semibold transition"
            >
              Kembali ke Naskah Ujian
            </button>
          </div>
        </div>
      )}

      {/* 6. Submit Confirmation Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#13224E]/70 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] max-w-md w-full p-6 border-2 border-[#13224E] space-y-4 shadow-sheet">
            <div className="border-b border-[#E4E4DC] pb-2 flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-[#13224E]">KONFIRMASI PENGIRIMAN UJIAN</span>
            </div>

            {/* Summary Box */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-[#FAFAF7] border border-[#E4E4DC] text-center font-mono">
              <div className="p-2 bg-[#FFFFFF] border border-[#CECEC2]">
                <div className="text-base font-bold text-[#1B3B8C]">{totalAnswered}</div>
                <div className="text-[9px] text-[#637096] uppercase">Diisi</div>
              </div>
              <div className="p-2 bg-[#FFFFFF] border border-[#CECEC2]">
                <div className="text-base font-bold text-[#C8831A]">{totalFlagged}</div>
                <div className="text-[9px] text-[#637096] uppercase">Ragu</div>
              </div>
              <div className="p-2 bg-[#FFFFFF] border border-[#CECEC2]">
                <div className="text-base font-bold text-[#637096]">{totalUnanswered}</div>
                <div className="text-[9px] text-[#637096] uppercase">Kosong</div>
              </div>
            </div>

            <p className="text-xs text-[#637096] leading-relaxed">
              Setelah dikirim, lembar jawaban Anda akan diproses dan hasil rasionalisasi PTN akan langsung ditampilkan.
            </p>

            <div className="flex items-center space-x-2 pt-2 border-t border-[#E4E4DC] font-mono text-xs">
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="flex-1 py-2 bg-[#FAFAF7] hover:bg-[#F3F3ED] text-[#13224E] border border-[#CECEC2]"
              >
                Cek Kembali
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 py-2 bg-[#1B8A5A] hover:bg-[#126340] text-white font-semibold"
              >
                Kirim Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
