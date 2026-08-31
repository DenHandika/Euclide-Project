'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { SubtestId, Question, UserAnswer } from '@/types';
import MathRenderer from '@/components/common/MathRenderer';
import {
  Clock,
  Maximize,
  Minimize,
  AlertTriangle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Grid,
  Send,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  X,
  FileText,
} from 'lucide-react';

export default function CBTExamPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const tryoutId = (params?.id as string) || 'to-utbk-national-01';

  const {
    tryouts,
    startExam,
    getExamSession,
    saveAnswer,
    toggleFlagQuestion,
    updateSubtestTimer,
    incrementViolations,
    submitExam,
    currentUser,
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
          // Auto advance to next subtest or submit
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

  // Sync timer when changing subtest
  useEffect(() => {
    const rem = session.subtestRemainingSeconds[currentSubtest.id] || currentSubtest.durationMinutes * 60;
    setTimerSeconds(rem);
    setCurrentQuestionIndex(0);
  }, [currentSubtestIndex]);

  // 2. Anti-Cheat Detection (`visibilitychange`, `window.blur`, full-screen change)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const count = incrementViolations(tryoutId);
        setAntiCheatModal({ isOpen: true, count });
      }
    };

    const handleWindowBlur = () => {
      // Optional blur check
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

  // Format time MM:SS
  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Fullscreen toggle
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
      const currentObj = prev.answers[currentQuestion.id];
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

  // Subtest navigation
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

  // Stats calculation for palette
  const totalQuestionsAll = tryout.questions.length;
  const totalAnswered = Object.values(session.answers).filter((a) => {
    if (Array.isArray(a.answer)) return a.answer.length > 0;
    return String(a.answer).trim().length > 0;
  }).length;
  const totalFlagged = Object.values(session.answers).filter((a) => a.isFlagged).length;
  const totalUnanswered = Math.max(0, totalQuestionsAll - totalAnswered);

  // Security prevention
  const preventCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  return (
    <div
      onCopy={preventCopy}
      onCut={preventCopy}
      onPaste={preventCopy}
      onContextMenu={(e) => e.preventDefault()}
      className="cbt-secure-screen min-h-screen bg-slate-100 flex flex-col justify-between"
    >
      {/* 1. CBT Header Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs px-3 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Left: Subtest Title & Category */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-navy text-white flex items-center justify-center font-bold text-xs shrink-0">
            {currentSubtestIndex + 1}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block leading-none truncate">
              {currentSubtest.category} ({currentSubtestIndex + 1}/{tryout.subtests.length})
            </span>
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight truncate">
              {currentSubtest.name}
            </h2>
          </div>
        </div>

        {/* Center/Right: Timer, Palette Trigger, Fullscreen */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Subtest Timer Badge */}
          <div
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold border transition ${
              timerSeconds < 300
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
            <span>{formatTime(timerSeconds)}</span>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullScreen}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Mobile Question Palette Toggle */}
          <button
            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Daftar Soal</span>
            <span className="sm:hidden font-mono">{currentQuestionIndex + 1}/{subtestQuestions.length}</span>
          </button>
        </div>
      </div>

      {/* 2. Subtest Stepper Indicator (Desktop & Tablet) */}
      <div className="hidden md:flex items-center bg-slate-50 border-b border-slate-200 px-6 py-2 overflow-x-auto space-x-2">
        {tryout.subtests.map((st, idx) => {
          const isActive = idx === currentSubtestIndex;
          const isDone = idx < currentSubtestIndex;
          return (
            <button
              key={st.id}
              onClick={() => setCurrentSubtestIndex(idx)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 shrink-0 transition ${
                isActive
                  ? 'bg-navy text-white shadow-xs'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{idx + 1}. {st.name.split(' ')[0]}</span>
              {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
            </button>
          );
        })}
      </div>

      {/* 3. Main Question Playing Area */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: The Question Card (Span 3 on Desktop) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-5 sm:p-8 shadow-elevated border border-slate-200 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Question Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black bg-blue-50 text-blue-700 px-3 py-1 rounded-xl border border-blue-200">
                  Nomor {currentQuestionIndex + 1}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {currentQuestion.type === 'single_choice' && 'Pilihan Ganda (ABCDE)'}
                  {currentQuestion.type === 'multi_select' && 'Pilihan Majemuk (Kotak Ceklis)'}
                  {currentQuestion.type === 'short_answer' && 'Isian Singkat'}
                  {currentQuestion.type === 'essay' && 'Esai Argumentatif'}
                </span>
              </div>

              {/* Ragu-ragu Checkbox / Flag */}
              <button
                onClick={handleToggleFlag}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition ${
                  isCurrentFlagged
                    ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-amber-950' : ''}`} />
                <span>{isCurrentFlagged ? 'Ragu-ragu' : 'Tandai Ragu'}</span>
              </button>
            </div>

            {/* Stimulus Reading Text (if any) */}
            {currentQuestion.stimulus && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed max-h-56 overflow-y-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Wacana Stimulus / Grafik Soal:
                </span>
                <MathRenderer content={currentQuestion.stimulus} />
              </div>
            )}

            {/* The Main Question Prompt */}
            <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
              <MathRenderer content={currentQuestion.question} />
            </div>

            {/* 4. Format 1: Single Choice (A, B, C, D, E) */}
            {currentQuestion.type === 'single_choice' && currentQuestion.options && (
              <div className="space-y-3 pt-2">
                {currentQuestion.options.map((opt) => {
                  const isSelected = currentAnswerVal === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`flex items-start space-x-3.5 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 transition ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {opt.id}
                      </div>
                      <div className="pt-0.5 text-xs sm:text-sm leading-relaxed flex-1">
                        <MathRenderer content={opt.text} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Format 2: Multi Select Checkboxes */}
            {currentQuestion.type === 'multi_select' && currentQuestion.options && (
              <div className="space-y-3 pt-2">
                <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-800">
                  💡 <strong>Instruksi Multi-Jawaban:</strong> Berikan tanda centang pada <strong>semua pernyataan</strong> yang benar.
                </div>
                {currentQuestion.options.map((opt) => {
                  const selectedArr = Array.isArray(currentAnswerVal) ? currentAnswerVal : [];
                  const isChecked = selectedArr.includes(opt.id);

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleMultiSelectOption(opt.id)}
                      className={`flex items-start space-x-3.5 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="mt-1 w-5 h-5 rounded-md text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div className="text-xs sm:text-sm leading-relaxed flex-1">
                        <MathRenderer content={opt.text} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Format 3: Short Answer (Isian Singkat) */}
            {currentQuestion.type === 'short_answer' && (
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Ketik jawaban numerik / kata singkat Anda:
                </label>
                <div className="max-w-md">
                  <input
                    type="text"
                    placeholder="Ketik angka / kata jawaban di sini..."
                    value={currentAnswerVal as string}
                    onChange={(e) => handleShortAnswerChange(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    *Gunakan angka bulat jika hasil desimal tidak ditentukan.
                  </p>
                </div>
              </div>
            )}

            {/* Format 4: Essay Input with Word Counter */}
            {currentQuestion.type === 'essay' && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Lembar Jawaban Esai Siswa:</span>
                  <span className="font-mono font-bold text-blue-600">
                    Jumlah Kata: {String(currentAnswerVal || '').trim() ? String(currentAnswerVal).trim().split(/\s+/).length : 0} kata
                  </span>
                </div>
                <textarea
                  rows={8}
                  placeholder="Tuliskan argumen dan solusi komprehensif Anda di sini (100–250 kata)..."
                  value={currentAnswerVal as string}
                  onChange={(e) => handleEssayChange(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition font-sans"
                />
                <div className="flex items-center space-x-2 text-[11px] text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Jawaban esai otomatis tersimpan secara real-time ke antrean tentor.</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Pagination Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                } else if (currentSubtestIndex > 0) {
                  handlePrevSubtest();
                }
              }}
              disabled={currentQuestionIndex === 0 && currentSubtestIndex === 0}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {currentQuestionIndex < subtestQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition"
              >
                <span>Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : currentSubtestIndex < tryout.subtests.length - 1 ? (
              <button
                onClick={handleNextSubtest}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition"
              >
                <span>Lanjut Subtest Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setSubmitModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition animate-pulse"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Ujian (Selesai)</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Desktop Persistent Question Palette */}
        <div className="hidden lg:block bg-white rounded-3xl p-5 shadow-elevated border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Palet Nomor Soal
            </span>
            <span className="text-[11px] font-bold text-blue-600">
              {subtestQuestions.length} Soal
            </span>
          </div>

          {/* Palette Legend */}
          <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-600 pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Dijawab</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Ragu</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span>Kosong</span>
            </div>
          </div>

          {/* Numbers Grid */}
          <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1">
            {subtestQuestions.map((q, idx) => {
              const ans = session.answers[q.id];
              const isAnswered = ans && (Array.isArray(ans.answer) ? ans.answer.length > 0 : String(ans.answer).trim().length > 0);
              const isFlag = ans?.isFlagged;
              const isCurrent = idx === currentQuestionIndex;

              let btnStyle = 'bg-slate-100 text-slate-700 border-slate-200';
              if (isFlag) {
                btnStyle = 'bg-amber-400 text-amber-950 border-amber-500 font-bold';
              } else if (isAnswered) {
                btnStyle = 'bg-emerald-600 text-white border-emerald-700 font-bold';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`h-9 rounded-xl text-xs font-bold border transition transform active:scale-95 ${btnStyle} ${
                    isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Final Submit Trigger Button */}
          <button
            onClick={() => setSubmitModalOpen(true)}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center space-x-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Lembar Jawaban</span>
          </button>
        </div>
      </div>

      {/* 4. Mobile Slide-Up / Bottom-Sheet Question Palette Modal */}
      {isPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end lg:hidden">
          <div className="bg-white rounded-t-3xl p-5 shadow-2xl border-t border-slate-200 max-h-[80vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Daftar Nomor — {currentSubtest.name}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Dijawab: {totalAnswered} • Ragu: {totalFlagged} • Kosong: {totalUnanswered}
                </p>
              </div>
              <button
                onClick={() => setIsPaletteOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-600"
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

                let btnStyle = 'bg-slate-100 text-slate-700 border-slate-200';
                if (isFlag) {
                  btnStyle = 'bg-amber-400 text-amber-950 border-amber-500 font-bold';
                } else if (isAnswered) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-700 font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setIsPaletteOpen(false);
                    }}
                    className={`h-11 rounded-xl text-xs font-bold border transition ${btnStyle} ${
                      isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''
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
              className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Kirim & Selesaikan Ujian</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Anti-Cheat Security Violation Alert Modal */}
      {antiCheatModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-rose-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border-2 border-rose-500 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                Peringatan Integritas Ujian
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Peringatan ({antiCheatModal.count}/3): Keluar Layar Terdeteksi!
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Anda terdeteksi berpindah tab, meminimalkan browser, atau keluar dari jendela ujian CBT. Sistem pengawas otomatis mencatat aktivitas ini dalam log peserta.
            </p>

            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-left text-xs text-rose-800 space-y-1 font-medium">
              <div>⚠️ Sisa toleransi pelanggaran: {Math.max(0, 3 - antiCheatModal.count)} kali.</div>
              <div>⚠️ Pelanggaran ke-3 akan mendiskualifikasi dan mengunci sesi ujian secara permanen.</div>
            </div>

            <button
              onClick={() => setAntiCheatModal({ isOpen: false, count: antiCheatModal.count })}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 transition"
            >
              Saya Mengerti & Kembali ke Ujian
            </button>
          </div>
        </div>
      )}

      {/* 6. Submit Confirmation Review Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Konfirmasi Pengiriman Ujian
                </h3>
                <p className="text-xs text-slate-500">Periksa ringkasan lembar jawaban Anda</p>
              </div>
            </div>

            {/* Summary Box */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-lg font-black text-emerald-700">{totalAnswered}</div>
                <div className="text-[10px] text-emerald-800 font-semibold">Dijawab</div>
              </div>
              <div className="p-2 bg-amber-50 rounded-xl border border-amber-200">
                <div className="text-lg font-black text-amber-700">{totalFlagged}</div>
                <div className="text-[10px] text-amber-800 font-semibold">Ragu-ragu</div>
              </div>
              <div className="p-2 bg-slate-100 rounded-xl border border-slate-200">
                <div className="text-lg font-black text-slate-700">{totalUnanswered}</div>
                <div className="text-[10px] text-slate-600 font-semibold">Kosong</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Setelah dikirim, lembar jawaban akan diproses oleh mesin IRT dan rasionalisasi skor PTN Anda akan langsung ditampilkan.
            </p>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cek Kembali
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20"
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
