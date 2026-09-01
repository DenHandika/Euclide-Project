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
  User,
  ZoomIn,
  ZoomOut,
  Type,
} from 'lucide-react';

export default function CBTExamPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const tryoutId = (params?.id as string) || 'to-utbk-national-01';

  const {
    tryouts,
    currentUser,
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
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');
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

  const subtestAnsweredCount = subtestQuestions.filter((q) => {
    const ans = session?.answers[q.id];
    return ans && (Array.isArray(ans.answer) ? ans.answer.length > 0 : String(ans.answer).trim().length > 0);
  }).length;
  const subtestFlaggedCount = subtestQuestions.filter((q) => session?.answers[q.id]?.isFlagged).length;
  const subtestUnansweredCount = Math.max(0, subtestQuestions.length - subtestAnsweredCount);

  const totalQuestionsAll = tryout.questions.length;
  const totalAnswered = Object.values(session.answers).filter((a) => {
    if (Array.isArray(a.answer)) return a.answer.length > 0;
    return String(a.answer).trim().length > 0;
  }).length;
  const totalFlagged = Object.values(session.answers).filter((a) => a.isFlagged).length;
  const totalUnanswered = Math.max(0, totalQuestionsAll - totalAnswered);

  const hasStimulus = Boolean(currentQuestion?.stimulus && currentQuestion.stimulus.trim().length > 0);

  // Dynamic Typography Scaling
  const questionTextClass =
    fontSizeLevel === 'large'
      ? 'text-base sm:text-lg'
      : fontSizeLevel === 'xlarge'
      ? 'text-lg sm:text-xl'
      : 'text-sm sm:text-base';

  const stimulusTextClass =
    fontSizeLevel === 'large'
      ? 'text-sm sm:text-base'
      : fontSizeLevel === 'xlarge'
      ? 'text-base sm:text-lg'
      : 'text-xs sm:text-sm';

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="cbt-secure-screen min-h-screen bg-[#F4F4F0] flex flex-col justify-between font-sans text-[#13224E]"
    >
      {/* ========================================================================= */}
      {/* 1. PROFESSIONAL CBT EXAM COCKPIT HEADER                                   */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#13224E] px-4 sm:px-6 py-2 flex items-center justify-between font-mono select-none shadow-xs">
        {/* Left: Candidate & Exam Identifier */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-9 h-9 bg-[#13224E] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-[#13224E]">
            {currentSubtestIndex + 1}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-[#1B3B8C] uppercase tracking-wider bg-[#FAFAF7] px-1.5 py-0.5 border border-[#CECEC2]">
                {tryout.code}
              </span>
              <span className="text-[#9EABC7] hidden sm:inline">•</span>
              <span className="text-[11px] font-semibold text-[#13224E] truncate hidden sm:inline">
                {currentUser.name} ({currentUser.nis || 'EUC-2026-0042'})
              </span>
            </div>
            <h1 className="font-serif font-bold text-xs sm:text-sm text-[#13224E] leading-tight truncate mt-0.5">
              Subtest {currentSubtestIndex + 1}/{tryout.subtests.length}: {currentSubtest.name}
            </h1>
          </div>
        </div>

        {/* Center: Monospace High-Contrast Digital Countdown Timer */}
        <div className="flex items-center space-x-2">
          <div
            className={`flex items-center space-x-2 px-3.5 py-1.5 border-2 transition-colors ${
              timerSeconds <= 60
                ? 'bg-[#FBEBEA] border-[#D0342C] text-[#D0342C] animate-pulse font-bold'
                : timerSeconds <= 300
                ? 'bg-[#FDF3E3] border-[#EFA93B] text-[#C8831A] font-bold'
                : 'bg-[#13224E] border-[#13224E] text-white font-semibold'
            }`}
          >
            <Clock className="w-4 h-4" />
            <div className="text-right">
              <span className="text-xs sm:text-sm font-bold tracking-wider">{formatTime(timerSeconds)}</span>
              <span className="block text-[8px] uppercase tracking-tighter opacity-80">Sisa Waktu</span>
            </div>
          </div>
        </div>

        {/* Right: Accessibility Controls, Anti-cheat Status, & Mobile Trigger */}
        <div className="flex items-center space-x-2">
          {/* Font Size Adjuster (Standard SNBT Feature) */}
          <div className="hidden md:flex items-center space-x-0.5 bg-[#FAFAF7] border border-[#CECEC2] p-0.5 text-xs font-mono">
            <button
              onClick={() => setFontSizeLevel('normal')}
              className={`px-1.5 py-0.5 transition ${fontSizeLevel === 'normal' ? 'bg-[#13224E] text-white font-bold' : 'text-[#637096] hover:text-[#13224E]'}`}
              title="Font Normal"
            >
              A
            </button>
            <button
              onClick={() => setFontSizeLevel('large')}
              className={`px-1.5 py-0.5 transition ${fontSizeLevel === 'large' ? 'bg-[#13224E] text-white font-bold' : 'text-[#637096] hover:text-[#13224E]'}`}
              title="Font Besar"
            >
              A+
            </button>
            <button
              onClick={() => setFontSizeLevel('xlarge')}
              className={`px-1.5 py-0.5 transition ${fontSizeLevel === 'xlarge' ? 'bg-[#13224E] text-white font-bold' : 'text-[#637096] hover:text-[#13224E]'}`}
              title="Font Ekstra Besar"
            >
              A++
            </button>
          </div>

          <button
            onClick={toggleFullScreen}
            className="p-1.5 text-[#637096] hover:text-[#13224E] border border-[#CECEC2] bg-[#FAFAF7] hidden sm:inline-flex"
            title="Layar Penuh"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>

          {/* Mobile-Only Palette Drawer Button */}
          <button
            onClick={() => setIsMobilePaletteOpen(true)}
            className="lg:hidden flex items-center space-x-1 bg-[#FFFFFF] hover:bg-[#FAFAF7] text-[#13224E] border border-[#13224E] text-xs px-2.5 py-1.5"
          >
            <Grid className="w-3.5 h-3.5 text-[#1B3B8C]" />
            <span>Nomor ({currentQuestionIndex + 1}/{subtestQuestions.length})</span>
          </button>

          <button
            onClick={() => setSubmitModalOpen(true)}
            className="flex items-center space-x-1.5 bg-[#1B8A5A] hover:bg-[#126340] text-white text-xs px-3.5 py-1.5 font-bold transition border border-[#126340]"
          >
            <Send className="w-3 h-3 text-[#EFA93B]" />
            <span className="hidden sm:inline">Kumpulkan Naskah</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. SUBTEST PROGRESS STEPPER STRIP                                         */}
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
                className={`px-3 py-1 border text-[11px] whitespace-nowrap transition flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-[#13224E] text-white border-[#13224E] font-bold'
                    : isDone
                    ? 'bg-[#EAF7F0] text-[#126340] border-[#1B8A5A]/40'
                    : 'bg-[#FAFAF7] text-[#637096] border-[#E4E4DC] hover:border-[#CECEC2]'
                }`}
              >
                <span>{idx + 1}. {st.name.split(' ')[0]}</span>
                {isDone && <CheckCircle2 className="w-3 h-3 text-[#1B8A5A]" />}
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center space-x-3 text-[10px] text-[#637096]">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-[#1B8A5A]" />
            <span>Anti-Curang Aktif</span>
          </span>
          <span>•</span>
          <span>Durasi per Subtest Terkunci</span>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 3. MAIN ERGONOMIC WORKSPACE: QUESTION CANVAS + DOCKED PALETTE SIDEBAR     */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 select-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ======================================================================= */}
          {/* LEFT/CENTER: QUESTION & ANSWERS WORKSPACE (9 of 12 columns)             */}
          {/* ======================================================================= */}
          <div className="lg:col-span-8 xl:col-span-9 bg-[#FFFFFF] border border-[#13224E] flex flex-col justify-between min-h-[580px]">
            {/* Question Top Header Bar */}
            <div className="p-4 border-b border-[#E4E4DC] flex items-center justify-between bg-[#FAFAF7]">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 bg-[#13224E] text-white font-mono font-bold text-sm flex items-center justify-center border border-[#13224E]">
                  {currentQuestionIndex + 1}
                </span>
                <div>
                  <h2 className="font-serif font-bold text-sm sm:text-base text-[#13224E] leading-tight">
                    Soal Nomor {currentQuestionIndex + 1}
                  </h2>
                  <span className="font-mono text-[10px] text-[#637096] uppercase">
                    {currentQuestion.type === 'single_choice' && 'PILIHAN GANDA (PILIH 1 JAWABAN)'}
                    {currentQuestion.type === 'multi_select' && 'PILIHAN MAJEMUK (BISA PILIH LEBIH DARI 1)'}
                    {currentQuestion.type === 'short_answer' && 'ISIAN SINGKAT'}
                    {currentQuestion.type === 'essay' && 'ESAI / ARGUMENTASI'}
                  </span>
                </div>
              </div>

              {/* Ragu-Ragu Toggle Button */}
              <button
                type="button"
                onClick={handleToggleFlag}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 border font-mono text-xs font-semibold transition ${
                  isCurrentFlagged
                    ? 'bg-[#EFA93B] text-[#13224E] border-[#C8831A] font-bold shadow-xs'
                    : 'bg-[#FFFFFF] text-[#637096] border-[#CECEC2] hover:bg-[#FAFAF7]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-[#13224E] text-[#13224E]' : 'text-[#637096]'}`} />
                <span>{isCurrentFlagged ? 'Ragu-Ragu (Ditandai)' : 'Tandai Ragu'}</span>
              </button>
            </div>

            {/* Question Content Area (Split-Pane jika ada Wacana) */}
            <div
              className="p-4 sm:p-6 flex-1 space-y-6 select-none"
              onContextMenu={(e) => e.preventDefault()}
              onCopy={(e) => e.preventDefault()}
            >
              <div className={`grid gap-6 items-start ${hasStimulus ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {/* Left Pane: Stimulus / Wacana Bacaan */}
                {hasStimulus && (
                  <div className="bg-[#FAFAF7] border border-[#E4E4DC] p-4 sm:p-5 max-h-[460px] overflow-y-auto space-y-3 font-sans text-[#13224E] leading-relaxed">
                    <div className="flex items-center space-x-1.5 pb-2 border-b border-[#E4E4DC] font-mono text-[10px] text-[#1B3B8C] font-bold uppercase">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Wacana / Stimulus Bacaan:</span>
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
                      <div className={`whitespace-pre-line leading-relaxed font-sans ${stimulusTextClass}`}>
                        <MathRenderer content={currentQuestion.stimulus || ''} />
                      </div>
                    )}
                  </div>
                )}

                {/* Right/Main: Question Prompt & Options */}
                <div className="space-y-5">
                  {/* Prompt Text */}
                  <div className={`font-serif font-semibold text-[#13224E] leading-relaxed ${questionTextClass}`}>
                    <MathRenderer content={currentQuestion.question} />
                  </div>

                  {/* 1. Format Single Choice: Bulatan OMR (A - E) */}
                  {currentQuestion.type === 'single_choice' && currentQuestion.options && (
                    <div className="space-y-2 pt-1">
                      {currentQuestion.options.map((opt) => {
                        const isSelected = currentAnswerVal === opt.id;
                        return (
                          <div
                            key={opt.id}
                            onClick={() => handleSelectOption(opt.id)}
                            className={`flex items-start space-x-3 p-3.5 border cursor-pointer transition select-none ${
                              isSelected
                                ? 'border-[#13224E] bg-[#FAFAF7] font-medium'
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
                            <div className={`pt-0.5 font-sans text-[#13224E] leading-relaxed ${questionTextClass}`}>
                              <MathRenderer content={opt.text} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 2. Format Multi-Select: Ceklis Kotak */}
                  {currentQuestion.type === 'multi_select' && currentQuestion.options && (
                    <div className="space-y-2 pt-1">
                      {currentQuestion.options.map((opt) => {
                        const arr = Array.isArray(currentAnswerVal) ? currentAnswerVal : [];
                        const isChecked = arr.includes(opt.id);
                        return (
                          <div
                            key={opt.id}
                            onClick={() => handleToggleMultiSelect(opt.id)}
                            className={`flex items-start space-x-3 p-3.5 border cursor-pointer transition select-none ${
                              isChecked
                                ? 'border-[#13224E] bg-[#FAFAF7] font-medium'
                                : 'border-[#E4E4DC] bg-[#FFFFFF] hover:border-[#CECEC2] hover:bg-[#FAFAF7]'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 border flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs ${
                                isChecked
                                  ? 'bg-[#13224E] text-white border-[#13224E]'
                                  : 'bg-white text-transparent border-[#CECEC2]'
                              }`}
                            >
                              ✓
                            </div>
                            <div className={`pt-0.5 font-sans text-[#13224E] leading-relaxed ${questionTextClass}`}>
                              <MathRenderer content={opt.text} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 3. Format Short Answer */}
                  {currentQuestion.type === 'short_answer' && (
                    <div className="space-y-2 pt-1 font-mono">
                      <label className="text-[10px] text-[#637096] uppercase block">
                        Ketikkan Angka atau Jawaban Singkat:
                      </label>
                      <input
                        type="text"
                        value={typeof currentAnswerVal === 'string' ? currentAnswerVal : ''}
                        onChange={(e) => handleShortAnswerChange(e.target.value)}
                        placeholder="Contoh: 45 atau 12.5"
                        className="w-full sm:w-80 p-3 bg-[#FAFAF7] border border-[#CECEC2] text-sm focus:outline-none focus:border-[#13224E]"
                      />
                    </div>
                  )}

                  {/* 4. Format Essay */}
                  {currentQuestion.type === 'essay' && (
                    <div className="space-y-2 pt-1">
                      <label className="font-mono text-[10px] text-[#637096] uppercase block">
                        Lembar Jawaban Esai Peserta:
                      </label>
                      <textarea
                        rows={7}
                        value={typeof currentAnswerVal === 'string' ? currentAnswerVal : ''}
                        onChange={(e) => handleEssayChange(e.target.value)}
                        placeholder="Tuliskan argumen penalaran Anda secara runtut dan sistematis..."
                        className="w-full p-3.5 bg-[#FAFAF7] border border-[#CECEC2] text-sm font-sans leading-relaxed focus:outline-none focus:border-[#13224E]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Nav Action Bar */}
            <div className="p-4 border-t border-[#E4E4DC] bg-[#FAFAF7] flex items-center justify-between font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex(currentQuestionIndex - 1);
                  } else if (currentSubtestIndex > 0) {
                    handlePrevSubtest();
                  }
                }}
                disabled={currentSubtestIndex === 0 && currentQuestionIndex === 0}
                className={`inline-flex items-center space-x-1.5 px-4 py-2 border transition ${
                  currentSubtestIndex === 0 && currentQuestionIndex === 0
                    ? 'bg-[#FAFAF7] text-[#9EABC7] border-[#E4E4DC] cursor-not-allowed'
                    : 'bg-[#FFFFFF] hover:bg-[#FAFAF7] text-[#13224E] border-[#13224E]'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Soal Sebelumnya</span>
              </button>

              <span className="text-[#637096] text-[11px] hidden sm:inline">
                Butir {currentQuestionIndex + 1} dari {subtestQuestions.length} Soal
              </span>

              <button
                type="button"
                onClick={() => {
                  if (currentQuestionIndex < subtestQuestions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                  } else if (currentSubtestIndex < tryout.subtests.length - 1) {
                    handleNextSubtest();
                  }
                }}
                className="inline-flex items-center space-x-1.5 px-4.5 py-2 bg-[#13224E] hover:bg-[#1B3B8C] text-white font-bold transition"
              >
                <span>
                  {currentQuestionIndex === subtestQuestions.length - 1 && currentSubtestIndex === tryout.subtests.length - 1
                    ? 'Selesai Subtest'
                    : 'Soal Berikutnya'}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* RIGHT SIDEBAR: PERMANENT DOCKED QUESTION PALETTE (3-4 of 12 columns)    */}
          {/* ALWAYS VISIBLE ON DESKTOP & 1-CLICK JUMP                                */}
          {/* ======================================================================= */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-4">
            <div className="bg-[#FFFFFF] border border-[#13224E] p-4 sm:p-5 sticky top-20">
              {/* Palette Header */}
              <div className="pb-3 border-b border-[#E4E4DC] flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#13224E]">
                    Daftar Nomor Soal
                  </h3>
                  <p className="font-mono text-[10px] text-[#637096] mt-0.5">
                    Subtest: <span className="font-semibold text-[#13224E]">{currentSubtest.name}</span>
                  </p>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 bg-[#FAFAF7] text-[#1B3B8C] border border-[#CECEC2] font-bold">
                  {subtestQuestions.length} Soal
                </span>
              </div>

              {/* Number Matrix Grid (ALWAYS VISIBLE & 1-CLICK JUMP) */}
              <div className="grid grid-cols-5 gap-2 py-4">
                {subtestQuestions.map((q, idx) => {
                  const status = getQuestionPaletteStatus(q);
                  const isCurrent = idx === currentQuestionIndex;

                  let statusClasses = 'bg-[#FFFFFF] text-[#637096] border-[#E4E4DC] hover:border-[#13224E]';
                  if (status === 'answered_flagged') {
                    statusClasses = 'bg-[#EAF7F0] text-[#126340] border-2 border-[#EFA93B] font-bold';
                  } else if (status === 'answered') {
                    statusClasses = 'bg-[#1B8A5A] text-white border-[#1B8A5A] font-bold';
                  } else if (status === 'flagged') {
                    statusClasses = 'bg-[#EFA93B] text-[#13224E] border-[#C8831A] font-bold';
                  } else if (status === 'visited_unanswered') {
                    statusClasses = 'bg-[#FBEBEA] text-[#D0342C] border-[#D0342C]/40 font-medium';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`relative h-9 border font-mono text-xs font-semibold flex items-center justify-center transition ${statusClasses} ${
                        isCurrent ? 'ring-2 ring-[#13224E] ring-offset-1 scale-105 z-10' : ''
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

              {/* Real-time Subtest Counter */}
              <div className="py-2.5 px-3 bg-[#FAFAF7] border border-[#E4E4DC] grid grid-cols-3 gap-1 font-mono text-[10px] text-center">
                <div>
                  <span className="text-[#637096] block">Terjawab</span>
                  <strong className="text-[#1B8A5A] text-xs">{subtestAnsweredCount}</strong>
                </div>
                <div>
                  <span className="text-[#637096] block">Ragu</span>
                  <strong className="text-[#C8831A] text-xs">{subtestFlaggedCount}</strong>
                </div>
                <div>
                  <span className="text-[#637096] block">Kosong</span>
                  <strong className="text-[#D0342C] text-xs">{subtestUnansweredCount}</strong>
                </div>
              </div>

              {/* 5-Status Color Legend Strip */}
              <div className="pt-3 border-t border-[#E4E4DC] space-y-1.5 font-mono text-[10px] text-[#637096]">
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 bg-[#1B8A5A] shrink-0 border border-[#1B8A5A]" />
                    <span className="text-[#126340] font-medium">Sudah Dijawab</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 bg-[#EFA93B] shrink-0 border border-[#C8831A]" />
                    <span className="text-[#C8831A] font-medium">Ragu-ragu</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 bg-[#EAF7F0] border-2 border-[#EFA93B] shrink-0" />
                    <span className="text-[#13224E]">Dijawab & Ragu</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 bg-[#FBEBEA] border border-[#D0342C]/40 shrink-0" />
                    <span className="text-[#D0342C]">Belum Dijawab</span>
                  </div>
                </div>
              </div>

              {/* Final Submit Trigger */}
              <div className="pt-4 mt-2 border-t border-[#E4E4DC]">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(true)}
                  className="w-full py-2.5 px-4 bg-[#13224E] hover:bg-[#1B3B8C] text-white font-mono text-xs font-bold transition flex items-center justify-center space-x-2 border border-[#13224E]"
                >
                  <Send className="w-3.5 h-3.5 text-[#EFA93B]" />
                  <span>Kumpulkan Naskah Ujian</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. MOBILE SLIDE-OVER PALETTE DRAWER (Khusus Layar Smartphone)             */}
      {/* ========================================================================= */}
      {isMobilePaletteOpen && (
        <div className="fixed inset-0 z-50 bg-[#13224E]/80 lg:hidden flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#FFFFFF] max-w-md w-full p-5 space-y-4 max-h-[85vh] flex flex-col border-t-2 sm:border-2 border-[#13224E]">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E4DC]">
              <div>
                <h3 className="font-serif font-bold text-base text-[#13224E]">
                  Daftar Nomor Soal: {currentSubtest.name}
                </h3>
                <p className="font-mono text-xs text-[#637096]">
                  Pilih nomor butir soal untuk berpindah langsung
                </p>
              </div>
              <button
                onClick={() => setIsMobilePaletteOpen(false)}
                className="text-[#637096] hover:text-[#13224E] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2 overflow-y-auto py-2">
              {subtestQuestions.map((q, idx) => {
                const status = getQuestionPaletteStatus(q);
                const isCurrent = idx === currentQuestionIndex;

                let statusClasses = 'bg-[#FFFFFF] text-[#637096] border-[#E4E4DC]';
                if (status === 'answered_flagged') {
                  statusClasses = 'bg-[#EAF7F0] text-[#126340] border-2 border-[#EFA93B] font-bold';
                } else if (status === 'answered') {
                  statusClasses = 'bg-[#1B8A5A] text-white border-[#1B8A5A] font-bold';
                } else if (status === 'flagged') {
                  statusClasses = 'bg-[#EFA93B] text-[#13224E] border-[#C8831A] font-bold';
                } else if (status === 'visited_unanswered') {
                  statusClasses = 'bg-[#FBEBEA] text-[#D0342C] border-[#D0342C]/40';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setIsMobilePaletteOpen(false);
                    }}
                    className={`h-10 border font-mono text-xs font-semibold flex items-center justify-center ${statusClasses} ${
                      isCurrent ? 'ring-2 ring-[#13224E] ring-offset-2' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#E4E4DC]">
              <button
                type="button"
                onClick={() => {
                  setIsMobilePaletteOpen(false);
                  setSubmitModalOpen(true);
                }}
                className="w-full py-2.5 bg-[#1B8A5A] hover:bg-[#126340] text-white font-mono text-xs font-bold transition"
              >
                Kumpulkan Naskah Ujian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CONFIRMATION SUBMIT MODAL                                              */}
      {/* ========================================================================= */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#13224E]/80 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] max-w-md w-full p-6 border-2 border-[#13224E] space-y-4 font-sans shadow-xl">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-[#E4E4DC]">
              <Send className="w-5 h-5 text-[#1B3B8C]" />
              <h3 className="font-serif font-bold text-base text-[#13224E]">
                Konfirmasi Pengumpulan Naskah Ujian
              </h3>
            </div>

            <p className="text-xs text-[#637096] leading-relaxed">
              Apakah Anda yakin ingin menyelesaikan simulasi UTBK ini? Pastikan seluruh subtest telah diperiksa sebelum naskah dikunci.
            </p>

            <div className="grid grid-cols-3 gap-2 p-3 bg-[#FAFAF7] border border-[#E4E4DC] text-center font-mono text-xs">
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
                className="px-3.5 py-2 bg-[#FAFAF7] border border-[#CECEC2] text-[#637096] hover:text-[#13224E]"
              >
                Kembali Mengerjakan
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-4.5 py-2 bg-[#13224E] hover:bg-[#1B3B8C] text-white font-bold transition"
              >
                Kumpulkan & Kunci Nilai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. PROCTORING / ANTI-CHEAT WARNING MODAL                                  */}
      {/* ========================================================================= */}
      {antiCheatModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-[#13224E]/85 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] max-w-sm w-full p-6 border-2 border-[#D0342C] space-y-4 font-sans text-center shadow-2xl">
            <div className="w-12 h-12 bg-[#FBEBEA] border border-[#D0342C] flex items-center justify-center mx-auto text-[#D0342C]">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-[#D0342C]">
                Peringatan Integritas CBT
              </h3>
              <p className="text-xs text-[#637096] mt-1 leading-relaxed">
                Anda terdeteksi meninggalkan layar ujian / berpindah tab browser / split-screen.
              </p>
            </div>

            <div className="p-2.5 bg-[#FAFAF7] border border-[#E4E4DC] font-mono text-xs">
              Pelanggaran: <strong className="text-[#D0342C]">{antiCheatModal.count} dari 3 batas toleransi</strong>
            </div>

            <button
              onClick={() => setAntiCheatModal({ isOpen: false, count: antiCheatModal.count })}
              className="w-full py-2 bg-[#13224E] hover:bg-[#1B3B8C] text-white font-mono text-xs font-bold transition"
            >
              Kembali ke Layar Ujian
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
