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
  ShieldCheck,
  CheckCircle2,
  X,
  FileText,
  AlertTriangle,
  HelpCircle,
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
    showToast,
  } = useApp();

  const tryout = tryouts.find((t) => t.id === tryoutId) || tryouts[0];

  // Local CBT state
  const [currentSubtestIndex, setCurrentSubtestIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(new Set());
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

  // Mark current question as visited
  useEffect(() => {
    if (currentQuestion?.id) {
      setVisitedQuestions((prev) => new Set([...Array.from(prev), currentQuestion.id]));
    }
  }, [currentQuestion?.id]);

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

  // 2. Anti-Cheat Visibility & Fullscreen detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const count = incrementViolations(tryoutId);
        setAntiCheatModal({ isOpen: true, count });
        if (count >= 3) {
          showToast('Batas toleransi pelanggaran fokus layar (3x) terlampaui. Ujian otomatis dikumpulkan demi integritas.', 'error');
          setTimeout(() => {
            handleFinalSubmit();
          }, 1500);
        }
      }
    };

    const handleWindowBlur = () => {
      const count = incrementViolations(tryoutId);
      setAntiCheatModal({ isOpen: true, count });
      if (count >= 3) {
        showToast('Batas toleransi pelanggaran fokus layar (3x) terlampaui. Ujian otomatis dikumpulkan demi integritas.', 'error');
        setTimeout(() => {
          handleFinalSubmit();
        }, 1500);
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
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

  const handleToggleMultiSelect = (optId: string) => {
    const prevArr = Array.isArray(currentAnswerVal) ? currentAnswerVal : [];
    let updatedArr: string[];
    if (prevArr.includes(optId)) {
      updatedArr = prevArr.filter((id) => id !== optId);
    } else {
      updatedArr = [...prevArr, optId];
    }

    saveAnswer(tryoutId, currentQuestion.id, 'multi_select', updatedArr, isCurrentFlagged);
    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: {
          questionId: currentQuestion.id,
          type: 'multi_select',
          answer: updatedArr,
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

  // Helper for Question Palette Status Determination (5 statuses)
  const getQuestionPaletteStatus = (q: Question) => {
    const ans = session?.answers[q.id];
    const isAnswered = ans && (Array.isArray(ans.answer) ? ans.answer.length > 0 : String(ans.answer).trim().length > 0);
    const isFlagged = ans?.isFlagged || false;
    const isVisited = visitedQuestions.has(q.id);

    if (isAnswered && isFlagged) return 'answered_flagged';
    if (isAnswered) return 'answered';
    if (isFlagged) return 'flagged';
    if (isVisited) return 'visited_unanswered';
    return 'not_visited';
  };

  const totalQuestionsAll = tryout.questions.length;
  const totalAnswered = Object.values(session.answers).filter((a) => {
    if (Array.isArray(a.answer)) return a.answer.length > 0;
    return String(a.answer).trim().length > 0;
  }).length;
  const totalFlagged = Object.values(session.answers).filter((a) => a.isFlagged).length;
  const totalUnanswered = Math.max(0, totalQuestionsAll - totalAnswered);

  const hasStimulus = Boolean(currentQuestion?.stimulus && currentQuestion.stimulus.trim().length > 0);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="cbt-secure-screen min-h-screen bg-[#FAFAF7] flex flex-col justify-between font-sans text-[#13224E]"
    >
      {/* ========================================================================= */}
      {/* 1. DISTRACTION-FREE EXAM HEADER BAR (Replaces Standard Web Navbar)        */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b-2 border-[#13224E] px-4 sm:px-6 py-2.5 flex items-center justify-between font-mono select-none">
        {/* Left: Exam Identifier & Subtest Badge */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-8 h-8 bg-[#13224E] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {currentSubtestIndex + 1}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-[#1B3B8C] uppercase tracking-wider">
                NASKAH: {tryout.code}
              </span>
              <span className="text-[#9EABC7] hidden sm:inline">•</span>
              <span className="text-[10px] text-[#637096] hidden sm:inline">
                Subtest {currentSubtestIndex + 1} dari {tryout.subtests.length}
              </span>
            </div>
            <h1 className="font-serif font-bold text-xs sm:text-sm text-[#13224E] leading-tight truncate">
              {currentSubtest.name}
            </h1>
          </div>
        </div>

        {/* Center: Monospace Digital Countdown Timer */}
        <div className="flex items-center space-x-2">
          <div
            className={`flex items-center space-x-1.5 px-3 py-1 border transition-colors ${
              timerSeconds <= 60
                ? 'bg-[#FBEBEA] border-[#D0342C] text-[#D0342C] animate-pulse font-bold'
                : timerSeconds <= 300
                ? 'bg-[#FDF3E3] border-[#EFA93B] text-[#C8831A] font-bold'
                : 'bg-[#FAFAF7] border-[#13224E] text-[#13224E] font-semibold'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs sm:text-sm">{formatTime(timerSeconds)}</span>
          </div>
        </div>

        {/* Right: Fullscreen, Anti-cheat Status, & Submit */}
        <div className="flex items-center space-x-2">
          {/* Proctoring / Screen Lock Indicator */}
          <div className="hidden lg:flex items-center space-x-1 px-2 py-1 bg-[#EAF7F0] border border-[#1B8A5A]/30 text-[10px] text-[#126340]">
            <ShieldCheck className="w-3 h-3 text-[#1B8A5A]" />
            <span>Integritas Terkunci</span>
          </div>

          <button
            onClick={toggleFullScreen}
            className="p-1.5 text-[#637096] hover:text-[#13224E] border border-[#CECEC2] bg-[#FFFFFF] hidden sm:inline-flex"
            title="Layar Penuh"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
            className="flex items-center space-x-1.5 bg-[#FFFFFF] hover:bg-[#FAFAF7] text-[#13224E] border border-[#13224E] text-xs px-2.5 py-1.5 transition"
          >
            <Grid className="w-3.5 h-3.5 text-[#1B3B8C]" />
            <span className="hidden sm:inline">Palet Soal</span>
            <span>({currentQuestionIndex + 1}/{subtestQuestions.length})</span>
          </button>

          <button
            onClick={() => setSubmitModalOpen(true)}
            className="flex items-center space-x-1 bg-[#13224E] hover:bg-[#1B3B8C] text-white text-xs px-3 py-1.5 font-bold transition"
          >
            <Send className="w-3 h-3 text-[#EFA93B]" />
            <span className="hidden sm:inline">Kumpulkan</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. SUBTEST STEPPER BAR (Deskripsi & Auto-Advance Indicator)               */}
      {/* ========================================================================= */}
      <nav className="bg-[#FFFFFF] border-b border-[#E4E4DC] px-4 sm:px-6 py-1.5 flex items-center justify-between text-xs font-mono select-none overflow-x-auto">
        <div className="flex items-center space-x-1.5">
          {tryout.subtests.map((st, idx) => {
            const isActive = idx === currentSubtestIndex;
            const isDone = idx < currentSubtestIndex;
            return (
              <button
                key={st.id}
                onClick={() => setCurrentSubtestIndex(idx)}
                className={`px-2.5 py-0.5 border text-[11px] whitespace-nowrap transition flex items-center space-x-1 ${
                  isActive
                    ? 'bg-[#13224E] text-white border-[#13224E] font-bold'
                    : isDone
                    ? 'bg-[#EAF7F0] text-[#126340] border-[#1B8A5A]/30'
                    : 'bg-[#FAFAF7] text-[#637096] border-[#E4E4DC] hover:border-[#CECEC2]'
                }`}
              >
                <span>{idx + 1}. {st.name.split(' ')[0]}</span>
                {isDone && <CheckCircle2 className="w-3 h-3 text-[#1B8A5A]" />}
              </button>
            );
          })}
        </div>

        <span className="text-[10px] text-[#9EABC7] hidden md:inline">
          Auto-Advance Aktif • Waktu Berjalan per Subtest
        </span>
      </nav>

      {/* ========================================================================= */}
      {/* 3. MAIN EXAMINATION CANVAS: SPLIT-PANE VIEW 2-KOLOM                       */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-between select-none">
        <div
          className="bg-[#FFFFFF] border border-[#13224E] p-4 sm:p-6 select-none"
          onContextMenu={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
        >
          {/* Question Metadata Strip */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E4DC] mb-5 font-mono text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-[#13224E] text-white flex items-center justify-center font-bold text-xs">
                {currentQuestionIndex + 1}
              </span>
              <span className="font-bold text-[#13224E]">
                SOAL NOMOR {currentQuestionIndex + 1} DARI {subtestQuestions.length}
              </span>
              <span className="text-[#9EABC7]">•</span>
              <span className="text-[#637096] text-[11px] uppercase">
                {currentQuestion.type === 'single_choice' && 'PILIHAN GANDA (OMR)'}
                {currentQuestion.type === 'multi_select' && 'PILIHAN MAJEMUK (CEKLIS)'}
                {currentQuestion.type === 'short_answer' && 'ISIAN SINGKAT'}
                {currentQuestion.type === 'essay' && 'ESAI ARGUMENTATIF'}
              </span>
            </div>

            {/* Flag / Doubt Toggle Button */}
            <button
              onClick={handleToggleFlag}
              className={`flex items-center space-x-1 px-3 py-1 border text-xs font-mono transition ${
                isCurrentFlagged
                  ? 'bg-[#EFA93B] text-[#13224E] border-[#C8831A] font-bold'
                  : 'bg-[#FAFAF7] text-[#637096] border-[#CECEC2] hover:bg-[#F3F3ED]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-[#13224E]' : ''}`} />
              <span>{isCurrentFlagged ? 'Ragu-ragu (Ditandai)' : 'Tandai Ragu'}</span>
            </button>
          </div>

          {/* Split-Pane 2-Kolom Container */}
          <div className={`grid gap-6 items-start ${hasStimulus ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
            {/* Left Pane: Stimulus / Wacana / Grafik (Scrollable Independently) */}
            {hasStimulus && (
              <div className="lg:col-span-6 bg-[#FAFAF7] border border-[#E4E4DC] p-4 sm:p-5 max-h-[520px] overflow-y-auto space-y-3 font-sans text-xs sm:text-sm text-[#13224E] leading-relaxed">
                <div className="flex items-center space-x-1.5 pb-2 border-b border-[#E4E4DC] font-mono text-[10px] text-[#1B3B8C] font-bold uppercase">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Stimulus Wacana / Konteks Soal:</span>
                </div>

                {currentQuestion.stimulus?.startsWith('[IMAGE_STIMULUS]') ? (
                  <div className="p-2 bg-[#FFFFFF] border border-[#E4E4DC] flex items-center justify-center">
                    <img
                      src={currentQuestion.stimulus.replace('[IMAGE_STIMULUS]', '')}
                      alt="Stimulus Soal"
                      className="max-h-72 object-contain"
                    />
                  </div>
                ) : (
                  <div className="whitespace-pre-line leading-relaxed font-sans">
                    <MathRenderer content={currentQuestion.stimulus || ''} />
                  </div>
                )}
              </div>
            )}

            {/* Right Pane: Question Prompt & OMR Option Selectors */}
            <div className={`${hasStimulus ? 'lg:col-span-6' : 'max-w-3xl mx-auto w-full'} space-y-5`}>
              {/* Question Text in Editorial Serif */}
              <div className="font-serif text-sm sm:text-base font-semibold text-[#13224E] leading-relaxed">
                <MathRenderer content={currentQuestion.question} />
              </div>

              {/* 1. Format Single Choice: OMR Bullets (A - E) */}
              {currentQuestion.type === 'single_choice' && currentQuestion.options && (
                <div className="space-y-2.5">
                  <span className="font-mono text-[10px] text-[#637096] uppercase block">
                    PILIH SATU JAWABAN (BULATAN OMR):
                  </span>
                  {currentQuestion.options.map((opt) => {
                    const isSelected = currentAnswerVal === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`flex items-start space-x-3 p-3 border cursor-pointer transition select-none ${
                          isSelected
                            ? 'border-[#1B3B8C] bg-[#FAFAF7]'
                            : 'border-[#E4E4DC] bg-[#FFFFFF] hover:border-[#CECEC2] hover:bg-[#FAFAF7]'
                        }`}
                      >
                        <span
                          className={`omr-bubble shrink-0 ${
                            isSelected ? 'omr-bubble-filled' : ''
                          }`}
                        >
                          {opt.id}
                        </span>
                        <div className="pt-0.5 text-xs sm:text-sm font-sans text-[#13224E] leading-relaxed">
                          <MathRenderer content={opt.text} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 2. Format Multi-Select: Ceklis Majemuk */}
              {currentQuestion.type === 'multi_select' && currentQuestion.options && (
                <div className="space-y-2.5">
                  <span className="font-mono text-[10px] text-[#637096] uppercase block">
                    PILIH SEMUA PERNYATAAN YANG BENAR (CEKLIS):
                  </span>
                  {currentQuestion.options.map((opt) => {
                    const arr = Array.isArray(currentAnswerVal) ? currentAnswerVal : [];
                    const isChecked = arr.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleToggleMultiSelect(opt.id)}
                        className={`flex items-start space-x-3 p-3 border cursor-pointer transition select-none ${
                          isChecked
                            ? 'border-[#1B3B8C] bg-[#FAFAF7]'
                            : 'border-[#E4E4DC] bg-[#FFFFFF] hover:border-[#CECEC2] hover:bg-[#FAFAF7]'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 border flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs ${
                            isChecked
                              ? 'bg-[#1B3B8C] text-white border-[#1B3B8C]'
                              : 'bg-white text-transparent border-[#CECEC2]'
                          }`}
                        >
                          ✓
                        </div>
                        <div className="text-xs sm:text-sm font-sans text-[#13224E] leading-relaxed">
                          <MathRenderer content={opt.text} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 3. Format Short Answer */}
              {currentQuestion.type === 'short_answer' && (
                <div className="space-y-2 font-mono">
                  <label className="text-[10px] text-[#637096] uppercase block">
                    KETIKKAN ANGKA ATAU JAWABAN SINGKAT:
                  </label>
                  <input
                    type="text"
                    value={typeof currentAnswerVal === 'string' ? currentAnswerVal : ''}
                    onChange={(e) => handleShortAnswerChange(e.target.value)}
                    placeholder="Contoh: 45 atau x = 2"
                    className="w-full p-3 bg-[#FAFAF7] border border-[#CECEC2] text-sm focus:outline-none focus:border-[#13224E]"
                  />
                </div>
              )}

              {/* 4. Format Essay */}
              {currentQuestion.type === 'essay' && (
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-[#637096] uppercase block">
                    LEMBAR JAWABAN ESAI SISWA:
                  </label>
                  <textarea
                    rows={8}
                    value={typeof currentAnswerVal === 'string' ? currentAnswerVal : ''}
                    onChange={(e) => handleEssayChange(e.target.value)}
                    placeholder="Tuliskan argumen penalaran Anda secara runtut dan sistematis..."
                    className="w-full p-3 bg-[#FAFAF7] border border-[#CECEC2] text-xs sm:text-sm font-sans leading-relaxed focus:outline-none focus:border-[#13224E]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Navigation Bottom Toolbar */}
          <div className="mt-8 pt-4 border-t border-[#E4E4DC] flex items-center justify-between font-mono text-xs select-none">
            <button
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                } else if (currentSubtestIndex > 0) {
                  handlePrevSubtest();
                }
              }}
              disabled={currentSubtestIndex === 0 && currentQuestionIndex === 0}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-2 border transition ${
                currentSubtestIndex === 0 && currentQuestionIndex === 0
                  ? 'bg-[#FAFAF7] text-[#9EABC7] border-[#E4E4DC] cursor-not-allowed'
                  : 'bg-[#FFFFFF] hover:bg-[#FAFAF7] text-[#13224E] border-[#13224E]'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Sebelumnya</span>
            </button>

            <span className="text-[#637096] text-[11px] hidden sm:inline">
              Navigasi Cepat Soal ({currentQuestionIndex + 1} dari {subtestQuestions.length})
            </span>

            <button
              onClick={() => {
                if (currentQuestionIndex < subtestQuestions.length - 1) {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                } else if (currentSubtestIndex < tryout.subtests.length - 1) {
                  handleNextSubtest();
                }
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#13224E] hover:bg-[#1B3B8C] text-white font-bold transition"
            >
              <span>{currentQuestionIndex === subtestQuestions.length - 1 && currentSubtestIndex === tryout.subtests.length - 1 ? 'Selesai Subtest' : 'Berikutnya'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. QUESTION PALETTE MATRIX DRAWER (5 Status Legend System)               */}
      {/* ========================================================================= */}
      {isPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-[#13224E]/70 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] max-w-xl w-full p-6 border-2 border-[#13224E] space-y-4 font-sans my-8">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E4DC]">
              <div>
                <h3 className="font-serif font-bold text-base text-[#13224E]">
                  Matriks Palet Soal: {currentSubtest.name}
                </h3>
                <p className="font-mono text-[10px] text-[#637096]">
                  Klik nomor soal di bawah untuk berpindah butir langsung
                </p>
              </div>
              <button onClick={() => setIsPaletteOpen(false)} className="text-[#637096] hover:text-[#13224E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Matrix Grid Numbers */}
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 pt-2">
              {subtestQuestions.map((q, idx) => {
                const status = getQuestionPaletteStatus(q);
                const isCurrent = idx === currentQuestionIndex;

                let statusStyle = 'bg-[#FFFFFF] text-[#637096] border-[#E4E4DC]'; // not_visited
                if (status === 'answered_flagged') {
                  statusStyle = 'bg-[#EAF7F0] text-[#126340] border-2 border-[#EFA93B] font-bold';
                } else if (status === 'answered') {
                  statusStyle = 'bg-[#EAF7F0] text-[#126340] border-[#1B8A5A] font-bold';
                } else if (status === 'flagged') {
                  statusStyle = 'bg-[#FDF3E3] text-[#C8831A] border-[#EFA93B] font-bold';
                } else if (status === 'visited_unanswered') {
                  statusStyle = 'bg-[#FBEBEA] text-[#D0342C] border-[#D0342C]/40';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setIsPaletteOpen(false);
                    }}
                    className={`relative p-2.5 border font-mono text-xs transition flex flex-col items-center justify-center ${statusStyle} ${
                      isCurrent ? 'ring-2 ring-[#13224E] ring-offset-1' : ''
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {status === 'answered_flagged' && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#EFA93B]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* 5-Status Legend Bar */}
            <div className="pt-4 border-t border-[#E4E4DC] grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[10px]">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#EAF7F0] border border-[#1B8A5A]" />
                <span className="text-[#126340]">Terjawab</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FDF3E3] border border-[#EFA93B]" />
                <span className="text-[#C8831A]">Ragu-ragu</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#EAF7F0] border-2 border-[#EFA93B]" />
                <span className="text-[#13224E]">Terjawab & Ragu</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FBEBEA] border border-[#D0342C]" />
                <span className="text-[#D0342C]">Terlewati (Belum Jawab)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FFFFFF] border border-[#CECEC2]" />
                <span className="text-[#637096]">Belum Dibuka</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CONFIRMATION SUBMIT MODAL                                              */}
      {/* ========================================================================= */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#13224E]/70 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] max-w-md w-full p-6 border-2 border-[#13224E] space-y-4 font-sans">
            <div className="flex items-center space-x-2 pb-2 border-b border-[#E4E4DC]">
              <Send className="w-4 h-4 text-[#1B3B8C]" />
              <h3 className="font-serif font-bold text-base text-[#13224E]">
                Konfirmasi Pengumpulan Naskah Ujian
              </h3>
            </div>

            <p className="text-xs text-[#637096] leading-relaxed">
              Apakah Anda yakin ingin menyelesaikan simulasi UTBK ini? Pastikan seluruh subtest telah diperiksa.
            </p>

            <div className="grid grid-cols-3 gap-2 p-3 bg-[#FAFAF7] border border-[#E4E4DC] font-mono text-center text-xs">
              <div>
                <span className="text-[10px] text-[#637096] block">TERJAWAB</span>
                <span className="font-bold text-[#1B8A5A] text-sm">{totalAnswered}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#637096] block">RAGU-RAGU</span>
                <span className="font-bold text-[#C8831A] text-sm">{totalFlagged}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#637096] block">KOSONG</span>
                <span className="font-bold text-[#D0342C] text-sm">{totalUnanswered}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setSubmitModalOpen(false)}
                className="px-3 py-1.5 bg-[#FAFAF7] border border-[#CECEC2] text-[#637096]"
              >
                Kembali Mengerjakan
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-4 py-1.5 bg-[#13224E] hover:bg-[#1B3B8C] text-white font-bold"
              >
                Kumpulkan & Lihat Hasil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. PROCTORING / ANTI-CHEAT WARNING MODAL                                  */}
      {/* ========================================================================= */}
      {antiCheatModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-[#13224E]/80 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] max-w-sm w-full p-6 border-2 border-[#D0342C] space-y-4 font-sans text-center">
            <div className="w-12 h-12 rounded-full bg-[#FBEBEA] border border-[#D0342C] flex items-center justify-center mx-auto text-[#D0342C]">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-[#D0342C]">
                Peringatan Integritas CBT
              </h3>
              <p className="text-xs text-[#637096] mt-1 leading-relaxed">
                Anda terdeteksi meninggalkan layar ujian / berpindah tab browser.
              </p>
            </div>

            <div className="p-2.5 bg-[#FAFAF7] border border-[#E4E4DC] font-mono text-xs">
              Pelanggaran: <strong className="text-[#D0342C]">{antiCheatModal.count} dari 3 batas toleransi</strong>
            </div>

            <button
              onClick={() => setAntiCheatModal({ isOpen: false, count: antiCheatModal.count })}
              className="w-full py-2 bg-[#13224E] hover:bg-[#1B3B8C] text-white font-mono text-xs font-bold"
            >
              Kembali ke Layar Ujian
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
