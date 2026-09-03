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
  HelpCircle,
  Sparkles,
  BookOpen,
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
  const [mobileTab, setMobileTab] = useState<'question' | 'stimulus'>('question');
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
    // When switching questions, default back to question tab on mobile
    setMobileTab('question');
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
          showToast('Batas toleransi keluar layar (3x) terlampaui. Ujian otomatis dikumpulkan demi integritas.', 'error');
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
        showToast('Batas toleransi keluar layar (3x) terlampaui. Ujian otomatis dikumpulkan demi integritas.', 'error');
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
    setSession((prev) => ({
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
    }));
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
      className="cbt-secure-screen min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans text-slate-900 pb-20 lg:pb-6"
    >
      {/* ========================================================================= */}
      {/* 1. COMPACT, HIGH-ERGONOMY CBT HEADER (DESKTOP & MOBILE COCKPIT)           */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-2xs">
        {/* Left: Active Question Badge & Subtest Tag */}
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {currentQuestionIndex + 1}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                No. {currentQuestionIndex + 1}/{subtestQuestions.length}
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-xs font-semibold text-slate-600 truncate hidden sm:inline">
                {currentUser.name}
              </span>
            </div>
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5 max-w-[140px] sm:max-w-none">
              {currentSubtest.name}
            </h1>
          </div>
        </div>

        {/* Center/Right: Timer Pill + Quick Palette Drawer + Submit */}
        <div className="flex items-center space-x-2">
          {/* High-Contrast Countdown Timer Pill */}
          <div
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all shadow-xs ${
              timerSeconds <= 60
                ? 'bg-rose-50 text-rose-700 border border-rose-300 animate-pulse'
                : timerSeconds <= 300
                ? 'bg-amber-50 text-amber-800 border border-amber-300'
                : 'bg-slate-900 text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="tracking-wide text-xs sm:text-sm">{formatTime(timerSeconds)}</span>
          </div>

          {/* Font Size Adjuster (Desktop Only) */}
          <div className="hidden md:flex items-center space-x-0.5 bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
            <button
              onClick={() => setFontSizeLevel('normal')}
              className={`px-2 py-1 rounded transition ${fontSizeLevel === 'normal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              title="Font Normal"
            >
              A
            </button>
            <button
              onClick={() => setFontSizeLevel('large')}
              className={`px-2 py-1 rounded transition ${fontSizeLevel === 'large' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              title="Font Besar"
            >
              A+
            </button>
            <button
              onClick={() => setFontSizeLevel('xlarge')}
              className={`px-2 py-1 rounded transition ${fontSizeLevel === 'xlarge' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              title="Font Ekstra Besar"
            >
              A++
            </button>
          </div>

          {/* Mobile Bottom-Sheet Trigger */}
          <button
            type="button"
            onClick={() => setIsMobilePaletteOpen(true)}
            className="lg:hidden flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-2.5 py-1.5 rounded-xl transition"
          >
            <Grid className="w-3.5 h-3.5 text-blue-600" />
            <span>Palet ({subtestAnsweredCount}/{subtestQuestions.length})</span>
          </button>

          {/* Desktop Submit Button */}
          <button
            type="button"
            onClick={() => setSubmitModalOpen(true)}
            className="hidden sm:inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kumpulkan</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. SUBTEST PROGRESS CHIP BAR (HORIZONTAL SCROLLABLE)                      */}
      {/* ========================================================================= */}
      <nav className="bg-white border-b border-slate-200/80 px-3 sm:px-6 py-1.5 flex items-center justify-between text-xs select-none overflow-x-auto gap-2">
        <div className="flex items-center space-x-1.5">
          {tryout.subtests.map((st, idx) => {
            const isActive = idx === currentSubtestIndex;
            const isDone = idx < currentSubtestIndex;
            return (
              <button
                key={st.id}
                onClick={() => setCurrentSubtestIndex(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-2xs'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <span>{idx + 1}. {st.name.split(' ')[0]}</span>
                {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
              </button>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center space-x-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Screen Lock Aktif</span>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2.5 PERMANENT QUESTION NUMBER RIBBON (SELALU TAMPIL TANPA PERLU KLIK)     */}
      {/* ========================================================================= */}
      <div className="bg-slate-50 border-b border-slate-200/90 px-3 sm:px-6 py-2 flex items-center justify-between gap-3 sticky top-[57px] z-30 shadow-2xs select-none">
        {/* Horizontal Number Strip (Scrollable & 1-Tap Jump) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5 no-scrollbar flex-1 font-mono">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mr-1 hidden sm:inline shrink-0">
            Nomor:
          </span>
          {subtestQuestions.map((q, idx) => {
            const status = getQuestionPaletteStatus(q);
            const isCurrent = idx === currentQuestionIndex;

            let statusStyle = 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400';
            if (status === 'answered_flagged') {
              statusStyle = 'bg-emerald-50 text-emerald-900 border-2 border-amber-400 font-bold';
            } else if (status === 'answered') {
              statusStyle = 'bg-emerald-600 text-white font-bold border border-emerald-600 shadow-2xs';
            } else if (status === 'flagged') {
              statusStyle = 'bg-amber-400 text-slate-950 font-bold border border-amber-500 shadow-2xs';
            } else if (status === 'visited_unanswered') {
              statusStyle = 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold';
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs shrink-0 flex items-center justify-center transition-all ${statusStyle} ${
                  isCurrent ? 'ring-2 ring-blue-600 ring-offset-2 scale-110 z-10 font-extrabold shadow-sm' : ''
                }`}
                title={`Lompat ke Soal #${idx + 1}`}
              >
                <span>{idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Live Status Indicators Legend Mini */}
        <div className="hidden md:flex items-center space-x-3 text-[11px] shrink-0 font-medium text-slate-600">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            <span>Terjawab: <strong className="text-emerald-700">{subtestAnsweredCount}</strong></span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span>Ragu: <strong className="text-amber-700">{subtestFlaggedCount}</strong></span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
            <span>Kosong: <strong className="text-slate-700">{subtestUnansweredCount}</strong></span>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE STIMULUS SEGMENTED CONTROL TABS (HANYA MUNCUL DI SMARTPHONE)    */}
      {/* ========================================================================= */}
      {hasStimulus && (
        <div className="lg:hidden bg-slate-100 p-1.5 border-b border-slate-200 sticky top-[57px] z-30 flex items-center justify-center space-x-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMobileTab('stimulus')}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition ${
              mobileTab === 'stimulus'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Wacana / Bacaan</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('question')}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition ${
              mobileTab === 'question'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Soal & Jawaban OMR</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MAIN WORKSPACE: SMARTPHONE ERGONOMIC VIEW & DESKTOP DOCKED VIEW        */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 select-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* QUESTION + OPTIONS WORKSPACE (9 COLS ON DESKTOP, FULL ON MOBILE) */}
          <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-card flex flex-col justify-between min-h-[520px]">
            {/* Question Top Subheader */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 rounded-t-2xl">
              <div className="flex items-center space-x-2.5">
                <span className="text-xs font-bold text-slate-800">
                  Butir Soal No. {currentQuestionIndex + 1}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] font-semibold text-slate-500 uppercase">
                  {currentQuestion.type === 'single_choice' && 'Pilihan Ganda'}
                  {currentQuestion.type === 'multi_select' && 'Pilihan Majemuk'}
                  {currentQuestion.type === 'short_answer' && 'Isian Singkat'}
                  {currentQuestion.type === 'essay' && 'Esai Argumentatif'}
                </span>
              </div>

              {/* Ragu-Ragu Toggle Chip */}
              <button
                type="button"
                onClick={handleToggleFlag}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-2xs ${
                  isCurrentFlagged
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-amber-900 text-amber-900' : 'text-slate-400'}`} />
                <span>{isCurrentFlagged ? 'Ragu' : 'Tandai Ragu'}</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6 flex-1 space-y-6">
              {/* If on mobile and stimulus tab active */}
              {hasStimulus && mobileTab === 'stimulus' ? (
                <div className="lg:hidden bg-slate-50 rounded-xl border border-slate-200/80 p-4 space-y-3 font-sans text-slate-900 leading-relaxed">
                  <div className="flex items-center space-x-1.5 pb-2 border-b border-slate-200 text-xs font-bold text-blue-700">
                    <FileText className="w-4 h-4" />
                    <span>Wacana Bacaan:</span>
                  </div>

                  {currentQuestion.stimulus?.startsWith('[IMAGE_STIMULUS]') ? (
                    <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
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

                  <button
                    type="button"
                    onClick={() => setMobileTab('question')}
                    className="w-full mt-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5"
                  >
                    <span>Lanjut Jawab Soal</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className={`grid gap-6 items-start ${hasStimulus ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                  {/* Left Pane on Desktop (Always Visible on Desktop if Stimulus Exists) */}
                  {hasStimulus && (
                    <div className="hidden lg:block bg-slate-50 rounded-xl border border-slate-200/80 p-5 max-h-[460px] overflow-y-auto space-y-3 font-sans text-slate-900 leading-relaxed">
                      <div className="flex items-center space-x-1.5 pb-2 border-b border-slate-200 text-xs font-bold text-blue-700">
                        <FileText className="w-4 h-4" />
                        <span>Wacana / Stimulus Bacaan:</span>
                      </div>

                      {currentQuestion.stimulus?.startsWith('[IMAGE_STIMULUS]') ? (
                        <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
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

                  {/* Main Question & Option Selector Cards */}
                  <div className="space-y-5">
                    {/* Prompt Text */}
                    <div className={`font-serif font-semibold text-slate-900 leading-relaxed ${questionTextClass}`}>
                      <MathRenderer content={currentQuestion.question} />
                    </div>

                    {/* 1. Format Single Choice: Large Thumb-Friendly OMR Cards */}
                    {currentQuestion.type === 'single_choice' && currentQuestion.options && (
                      <div className="space-y-2.5 pt-1">
                        {currentQuestion.options.map((opt) => {
                          const isSelected = currentAnswerVal === opt.id;
                          return (
                            <div
                              key={opt.id}
                              onClick={() => handleSelectOption(opt.id)}
                              className={`flex items-start space-x-3.5 p-3.5 rounded-xl border cursor-pointer transition-all duration-150 select-none ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                              }`}
                            >
                              <span
                                className={`omr-bubble shrink-0 ${
                                  isSelected ? 'omr-bubble-filled' : ''
                                }`}
                              >
                                {opt.id}
                              </span>
                              <div className={`pt-0.5 font-sans text-slate-900 leading-relaxed ${questionTextClass}`}>
                                <MathRenderer content={opt.text} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* 2. Format Multi-Select: Ceklis Majemuk */}
                    {currentQuestion.type === 'multi_select' && currentQuestion.options && (
                      <div className="space-y-2.5 pt-1">
                        {currentQuestion.options.map((opt) => {
                          const arr = Array.isArray(currentAnswerVal) ? currentAnswerVal : [];
                          const isChecked = arr.includes(opt.id);
                          return (
                            <div
                              key={opt.id}
                              onClick={() => handleToggleMultiSelect(opt.id)}
                              className={`flex items-start space-x-3.5 p-3.5 rounded-xl border cursor-pointer transition-all duration-150 select-none ${
                                isChecked
                                  ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                              }`}
                            >
                              <div
                                className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                                  isChecked
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-transparent border-slate-300'
                                }`}
                              >
                                ✓
                              </div>
                              <div className={`pt-0.5 font-sans text-slate-900 leading-relaxed ${questionTextClass}`}>
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
                        <label className="text-xs text-slate-500 font-semibold block uppercase">
                          Ketikkan Jawaban Singkat:
                        </label>
                        <input
                          type="text"
                          value={typeof currentAnswerVal === 'string' ? currentAnswerVal : ''}
                          onChange={(e) => handleShortAnswerChange(e.target.value)}
                          placeholder="Contoh: 45 atau 12.5"
                          className="w-full sm:w-80 p-3 bg-slate-50 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition"
                        />
                      </div>
                    )}

                    {/* 4. Format Essay */}
                    {currentQuestion.type === 'essay' && (
                      <div className="space-y-2 pt-1">
                        <label className="text-xs text-slate-500 font-semibold block uppercase">
                          Lembar Jawaban Esai:
                        </label>
                        <textarea
                          rows={6}
                          value={typeof currentAnswerVal === 'string' ? currentAnswerVal : ''}
                          onChange={(e) => handleEssayChange(e.target.value)}
                          placeholder="Tuliskan argumen penalaran Anda secara sistematis..."
                          className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-300 text-sm font-sans leading-relaxed focus:outline-none focus:border-blue-600 focus:bg-white transition"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Navigation Footer */}
            <div className="hidden lg:flex p-4 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl items-center justify-between text-xs font-bold">
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
                className={`inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border transition ${
                  currentSubtestIndex === 0 && currentQuestionIndex === 0
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Soal Sebelumnya</span>
              </button>

              <span className="text-slate-500 text-xs">
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
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition"
              >
                <span>
                  {currentQuestionIndex === subtestQuestions.length - 1 && currentSubtestIndex === tryout.subtests.length - 1
                    ? 'Selesai Subtest'
                    : 'Soal Berikutnya'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DESKTOP PERMANENT DOCKED PALETTE (3-4 COLS) */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-20 shadow-card">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Daftar Nomor Soal
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Subtest: <span className="font-bold text-slate-800">{currentSubtest.name}</span>
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md">
                  {subtestQuestions.length} Soal
                </span>
              </div>

              {/* Number Matrix Grid */}
              <div className="grid grid-cols-5 gap-2 py-4 font-mono">
                {subtestQuestions.map((q, idx) => {
                  const status = getQuestionPaletteStatus(q);
                  const isCurrent = idx === currentQuestionIndex;

                  let statusClasses = 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400';
                  if (status === 'answered_flagged') {
                    statusClasses = 'bg-emerald-50 text-emerald-800 border-2 border-amber-400 font-bold';
                  } else if (status === 'answered') {
                    statusClasses = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                  } else if (status === 'flagged') {
                    statusClasses = 'bg-amber-400 text-slate-950 border-amber-500 font-bold';
                  } else if (status === 'visited_unanswered') {
                    statusClasses = 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-9 rounded-lg border text-xs flex items-center justify-center transition-all ${statusClasses} ${
                        isCurrent ? 'ring-2 ring-slate-900 ring-offset-2 scale-105 z-10' : ''
                      }`}
                    >
                      <span>{idx + 1}</span>
                    </button>
                  );
                })}
              </div>

              {/* Real-time Subtest Counter */}
              <div className="py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-3 gap-1 text-xs text-center font-bold">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase">Terjawab</span>
                  <strong className="text-emerald-600">{subtestAnsweredCount}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase">Ragu</span>
                  <strong className="text-amber-600">{subtestFlaggedCount}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase">Kosong</span>
                  <strong className="text-rose-600">{subtestUnansweredCount}</strong>
                </div>
              </div>

              {/* Final Submit Trigger */}
              <div className="pt-4 mt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(true)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kumpulkan Ujian</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 5. THUMB-FRIENDLY FIXED BOTTOM ACTION BAR (KHUSUS SMARTPHONE / MOBILE)    */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
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
          className={`flex items-center space-x-1 py-2 px-3 rounded-xl text-xs font-bold transition ${
            currentSubtestIndex === 0 && currentQuestionIndex === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        {/* Center: Ragu Toggle */}
        <button
          type="button"
          onClick={handleToggleFlag}
          className={`flex items-center space-x-1 py-2 px-3.5 rounded-xl text-xs font-bold transition ${
            isCurrentFlagged
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-amber-900 text-amber-900' : ''}`} />
          <span>{isCurrentFlagged ? 'Ragu ✓' : 'Ragu'}</span>
        </button>

        {/* Right: Next / Submit */}
        {currentQuestionIndex === subtestQuestions.length - 1 && currentSubtestIndex === tryout.subtests.length - 1 ? (
          <button
            type="button"
            onClick={() => setSubmitModalOpen(true)}
            className="flex items-center space-x-1.5 py-2 px-4 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            <span>Kumpulkan</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (currentQuestionIndex < subtestQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              } else if (currentSubtestIndex < tryout.subtests.length - 1) {
                handleNextSubtest();
              }
            }}
            className="flex items-center space-x-1 py-2 px-3.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 6. MOBILE SLIDE-UP BOTTOM SHEET FOR PALETTE (ERGONOMIS LAYAR SENTUH)      */}
      {/* ========================================================================= */}
      {isMobilePaletteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs lg:hidden flex items-end justify-center p-0">
          <div className="bg-white max-w-lg w-full rounded-t-3xl p-5 space-y-4 max-h-[80vh] flex flex-col shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-200">
            {/* Sheet Handle & Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-2" />
                <h3 className="font-bold text-base text-slate-900">
                  Daftar Nomor: {currentSubtest.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Ketuk nomor butir soal untuk berpindah langsung
                </p>
              </div>
              <button
                onClick={() => setIsMobilePaletteOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold py-1">
              <div className="bg-emerald-50 text-emerald-800 p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] block opacity-80 uppercase">Terjawab</span>
                <span>{subtestAnsweredCount}</span>
              </div>
              <div className="bg-amber-50 text-amber-800 p-2 rounded-xl border border-amber-100">
                <span className="text-[10px] block opacity-80 uppercase">Ragu</span>
                <span>{subtestFlaggedCount}</span>
              </div>
              <div className="bg-slate-100 text-slate-700 p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] block opacity-80 uppercase">Kosong</span>
                <span>{subtestUnansweredCount}</span>
              </div>
            </div>

            {/* 5x4 Grid */}
            <div className="grid grid-cols-5 gap-2.5 overflow-y-auto py-2 font-mono">
              {subtestQuestions.map((q, idx) => {
                const status = getQuestionPaletteStatus(q);
                const isCurrent = idx === currentQuestionIndex;

                let statusClasses = 'bg-slate-100 text-slate-700 border-slate-200';
                if (status === 'answered_flagged') {
                  statusClasses = 'bg-emerald-50 text-emerald-800 border-2 border-amber-400 font-bold';
                } else if (status === 'answered') {
                  statusClasses = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                } else if (status === 'flagged') {
                  statusClasses = 'bg-amber-400 text-slate-950 border-amber-500 font-bold';
                } else if (status === 'visited_unanswered') {
                  statusClasses = 'bg-rose-50 text-rose-700 border-rose-200';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setIsMobilePaletteOpen(false);
                    }}
                    className={`h-11 rounded-xl border text-sm font-bold flex items-center justify-center transition-all ${statusClasses} ${
                      isCurrent ? 'ring-2 ring-slate-900 ring-offset-2' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsMobilePaletteOpen(false);
                  setSubmitModalOpen(true);
                }}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                Kumpulkan Naskah Ujian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. CONFIRMATION SUBMIT MODAL                                              */}
      {/* ========================================================================= */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xl font-sans">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Konfirmasi Pengumpulan
                </h3>
                <p className="text-xs text-slate-500">Periksa kembali ringkasan jawaban Anda</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-center text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">TERJAWAB</span>
                <span className="font-bold text-emerald-600 text-sm">{totalAnswered}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">RAGU</span>
                <span className="font-bold text-amber-600 text-sm">{totalFlagged}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">KOSONG</span>
                <span className="font-bold text-rose-600 text-sm">{totalUnanswered}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSubmitModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition"
              >
                Kumpulkan & Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. PROCTORING / ANTI-CHEAT WARNING MODAL                                  */}
      {/* ========================================================================= */}
      {antiCheatModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 rounded-2xl border border-rose-200 space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-base text-rose-700">
                Peringatan Integritas Ujian
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Anda terdeteksi berpindah tab, meminimalkan browser, atau membuka aplikasi lain.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs">
              Pelanggaran: <strong className="text-rose-600">{antiCheatModal.count} dari 3 batas toleransi</strong>
            </div>

            <button
              onClick={() => setAntiCheatModal({ isOpen: false, count: antiCheatModal.count })}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
            >
              Kembali ke Ujian
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
