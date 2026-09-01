'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  UserStatus,
  Tryout,
  Question,
  ClassBatch,
  PaymentRecord,
  PaymentImportRow,
  EssaySubmission,
  ExamSession,
  ExamResult,
  UserAnswer,
  SubtestId,
} from '@/types';
import {
  MOCK_USERS,
  MOCK_TRYOUTS,
  MOCK_QUESTIONS,
  MOCK_CLASS_BATCHES,
  MOCK_PAYMENTS,
  MOCK_ESSAY_SUBMISSIONS,
  MOCK_EXAM_RESULT,
} from '@/data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  switchUser: (user: User) => void;
  signInWithGoogle: (email?: string) => boolean;
  logout: () => void;
  
  // Tryouts & CBT
  tryouts: Tryout[];
  questions: Question[];
  activeSessions: Record<string, ExamSession>;
  startExam: (tryoutId: string) => ExamSession;
  getExamSession: (tryoutId: string) => ExamSession | null;
  saveAnswer: (tryoutId: string, questionId: string, type: any, answer: string | string[], isFlagged?: boolean) => void;
  toggleFlagQuestion: (tryoutId: string, questionId: string) => void;
  updateSubtestTimer: (tryoutId: string, subtestId: SubtestId, remainingSeconds: number) => void;
  incrementViolations: (tryoutId: string) => number;
  submitExam: (tryoutId: string) => ExamResult;
  
  // Results
  examResults: Record<string, ExamResult>;
  getExamResult: (tryoutId: string) => ExamResult;
  
  // Bank Soal
  addQuestion: (question: Omit<Question, 'id'>) => void;
  deleteQuestion: (id: string) => void;
  
  // Essay Grading
  essaySubmissions: EssaySubmission[];
  gradeEssay: (id: string, score: number, feedback: string) => void;
  
  // Admin & Financials
  batches: ClassBatch[];
  students: User[];
  payments: PaymentRecord[];
  updateBatchCapacity: (batchId: string, maxCapacity: number) => void;
  toggleStudentStatus: (studentId: string, status: UserStatus) => void;
  addManualPayment: (payment: Omit<PaymentRecord, 'id' | 'invoiceNumber' | 'paidAt'>) => PaymentRecord;
  importPaymentsBulk: (rows: PaymentImportRow[]) => { importedCount: number; errorsCount: number };
  getFinancialMetrics: () => {
    totalStudents: number;
    activeConcurrent: number;
    monthlyRevenue: number;
    overdueAmount: number;
  };

  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // 1. User State
  const [currentUser, setCurrentUser] = useState<User>(() => {
    return MOCK_USERS[2]; // Default: Active Siswa (Raihan)
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('siswa');

  // 2. Data states with LocalStorage persistence
  const [tryouts, setTryouts] = useState<Tryout[]>(() => MOCK_TRYOUTS);
  const [questions, setQuestions] = useState<Question[]>(() => MOCK_QUESTIONS);
  const [batches, setBatches] = useState<ClassBatch[]>(() => MOCK_CLASS_BATCHES);
  const [students, setStudents] = useState<User[]>(() => MOCK_USERS.filter((u) => u.role === 'siswa'));
  const [payments, setPayments] = useState<PaymentRecord[]>(() => MOCK_PAYMENTS);
  const [essaySubmissions, setEssaySubmissions] = useState<EssaySubmission[]>(() => MOCK_ESSAY_SUBMISSIONS);
  const [activeSessions, setActiveSessions] = useState<Record<string, ExamSession>>({});
  const [examResults, setExamResults] = useState<Record<string, ExamResult>>({
    'to-utbk-national-01': MOCK_EXAM_RESULT,
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('euclide_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
        setCurrentRole(parsed.role);
      }

      const storedPayments = localStorage.getItem('euclide_payments');
      if (storedPayments) setPayments(JSON.parse(storedPayments));

      const storedStudents = localStorage.getItem('euclide_students');
      if (storedStudents) setStudents(JSON.parse(storedStudents));

      const storedQuestions = localStorage.getItem('euclide_questions');
      if (storedQuestions) setQuestions(JSON.parse(storedQuestions));

      const storedEssays = localStorage.getItem('euclide_essays');
      if (storedEssays) setEssaySubmissions(JSON.parse(storedEssays));

      const storedResults = localStorage.getItem('euclide_results');
      if (storedResults) setExamResults(JSON.parse(storedResults));
    } catch (e) {
      console.warn('LocalStorage error or SSR', e);
    }
  }, []);

  // Sync to LocalStorage helpers
  const saveState = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchRole = (role: UserRole) => {
    let targetUser = MOCK_USERS.find((u) => u.role === role);
    if (!targetUser) {
      targetUser = MOCK_USERS[0];
    }
    setCurrentRole(role);
    setCurrentUser(targetUser);
    saveState('euclide_user', targetUser);
    showToast(`Beralih ke mode ${role.toUpperCase()}: ${targetUser.name}`, 'info');
  };

  const switchUser = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    saveState('euclide_user', user);
    showToast(`Masuk sebagai ${user.name} (${user.role.toUpperCase()})`, 'info');
  };

  const signInWithGoogle = (email: string = 'raihan.pratama@siswa.euclide.edu'): boolean => {
    // Check whitelist or default to active student
    const matchedUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matchedUser) {
      setCurrentUser(matchedUser);
      setCurrentRole(matchedUser.role);
      saveState('euclide_user', matchedUser);
      showToast(`Login Google Berhasil! Selamat datang, ${matchedUser.name}`, 'success');
      return true;
    } else {
      // Create new active student session
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email,
        role: 'siswa',
        nis: `EUC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        sppStatus: 'paid',
        targetPTN1: 'Universitas Indonesia (UI)',
        targetProdi1: 'Teknik Komputer',
      };
      setCurrentUser(newUser);
      setCurrentRole('siswa');
      setStudents((prev) => [newUser, ...prev]);
      saveState('euclide_user', newUser);
      showToast(`Akun Terdaftar & Terverifikasi Aktif! Selamat datang, ${newUser.name}`, 'success');
      return true;
    }
  };

  const logout = () => {
    const defaultUser = MOCK_USERS[2];
    setCurrentUser(defaultUser);
    setCurrentRole('siswa');
    saveState('euclide_user', defaultUser);
    showToast('Sesi ditutup.', 'info');
  };

  // Exam engine methods
  const startExam = (tryoutId: string): ExamSession => {
    const existing = activeSessions[tryoutId];
    if (existing && !existing.isCompleted) {
      return existing;
    }

    const tryout = tryouts.find((t) => t.id === tryoutId) || tryouts[0];
    const initialTimers: Record<SubtestId, number> = {} as any;
    tryout.subtests.forEach((st) => {
      initialTimers[st.id] = st.durationMinutes * 60;
    });

    const newSession: ExamSession = {
      tryoutId,
      userId: currentUser.id,
      currentSubtestIndex: 0,
      currentQuestionIndex: 0,
      answers: {},
      subtestRemainingSeconds: initialTimers,
      violationsCount: 0,
      isFullscreen: false,
      isCompleted: false,
      startedAt: new Date().toISOString(),
    };

    const updatedSessions = { ...activeSessions, [tryoutId]: newSession };
    setActiveSessions(updatedSessions);
    saveState('euclide_sessions', updatedSessions);
    return newSession;
  };

  const getExamSession = (tryoutId: string): ExamSession | null => {
    return activeSessions[tryoutId] || null;
  };

  const saveAnswer = (
    tryoutId: string,
    questionId: string,
    type: any,
    answer: string | string[],
    isFlagged: boolean = false
  ) => {
    setActiveSessions((prev) => {
      const session = prev[tryoutId] || startExam(tryoutId);
      const updatedAnswers: Record<string, UserAnswer> = {
        ...session.answers,
        [questionId]: {
          questionId,
          type,
          answer,
          isFlagged: isFlagged !== undefined ? isFlagged : session.answers[questionId]?.isFlagged || false,
          answeredAt: new Date().toISOString(),
        },
      };

      const updatedSession: ExamSession = {
        ...session,
        answers: updatedAnswers,
      };

      const next = { ...prev, [tryoutId]: updatedSession };
      saveState('euclide_sessions', next);
      return next;
    });
  };

  const toggleFlagQuestion = (tryoutId: string, questionId: string) => {
    setActiveSessions((prev) => {
      const session = prev[tryoutId];
      if (!session) return prev;
      const current = session.answers[questionId];
      const isFlagged = !current?.isFlagged;

      const updatedAnswers: Record<string, UserAnswer> = {
        ...session.answers,
        [questionId]: {
          questionId,
          type: current?.type || 'single_choice',
          answer: current?.answer || '',
          isFlagged,
          answeredAt: current?.answeredAt || new Date().toISOString(),
        },
      };

      const updatedSession = { ...session, answers: updatedAnswers };
      const next = { ...prev, [tryoutId]: updatedSession };
      saveState('euclide_sessions', next);
      return next;
    });
  };

  const updateSubtestTimer = (tryoutId: string, subtestId: SubtestId, remainingSeconds: number) => {
    setActiveSessions((prev) => {
      const session = prev[tryoutId];
      if (!session) return prev;
      const updatedTimers = { ...session.subtestRemainingSeconds, [subtestId]: remainingSeconds };
      return {
        ...prev,
        [tryoutId]: {
          ...session,
          subtestRemainingSeconds: updatedTimers,
        },
      };
    });
  };

  const incrementViolations = (tryoutId: string): number => {
    let currentCount = 0;
    setActiveSessions((prev) => {
      const session = prev[tryoutId] || startExam(tryoutId);
      currentCount = (session.violationsCount || 0) + 1;
      const updatedSession: ExamSession = {
        ...session,
        violationsCount: currentCount,
      };
      const next = { ...prev, [tryoutId]: updatedSession };
      saveState('euclide_sessions', next);
      return next;
    });
    return currentCount;
  };

  const submitExam = (tryoutId: string): ExamResult => {
    const tryout = tryouts.find((t) => t.id === tryoutId) || tryouts[0];
    const session = activeSessions[tryoutId];

    // Build or calculate result
    const result: ExamResult = {
      ...MOCK_EXAM_RESULT,
      id: `res-${Date.now()}`,
      tryoutId,
      tryoutTitle: tryout.title,
      userId: currentUser.id,
      userName: currentUser.name,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    };

    // If student answered essay, add to essay grading queue
    const essayQuestion = tryout.questions.find((q) => q.type === 'essay');
    if (essayQuestion && session?.answers[essayQuestion.id]) {
      const essayAns = session.answers[essayQuestion.id].answer as string;
      if (essayAns && essayAns.trim().length > 0) {
        const newEssaySub: EssaySubmission = {
          id: `essay-${Date.now()}`,
          tryoutId,
          tryoutTitle: tryout.title,
          questionId: essayQuestion.id,
          questionNumber: essayQuestion.number,
          subtestId: essayQuestion.subtestId,
          questionText: essayQuestion.question,
          rubricGuide: essayQuestion.rubricGuide || '',
          studentId: currentUser.id,
          studentName: currentUser.name,
          studentNis: currentUser.nis || 'EUC-2026-XXXX',
          studentAnswer: essayAns,
          submittedAt: new Date().toLocaleString('id-ID') + ' WIB',
          wordCount: essayAns.trim().split(/\s+/).length,
          isGraded: false,
        };

        setEssaySubmissions((prev) => {
          const updated = [newEssaySub, ...prev];
          saveState('euclide_essays', updated);
          return updated;
        });
      }
    }

    // Mark session completed
    setActiveSessions((prev) => {
      const next = {
        ...prev,
        [tryoutId]: {
          ...(prev[tryoutId] || session),
          isCompleted: true,
          submittedAt: new Date().toISOString(),
        },
      };
      saveState('euclide_sessions', next);
      return next;
    });

    const updatedResults = { ...examResults, [tryoutId]: result };
    setExamResults(updatedResults);
    saveState('euclide_results', updatedResults);

    showToast('Ujian Berhasil Dikirim! Hasil Rasionalisasi telah siap.', 'success');
    return result;
  };

  const getExamResult = (tryoutId: string): ExamResult => {
    return examResults[tryoutId] || { ...MOCK_EXAM_RESULT, tryoutId };
  };

  const addQuestion = (newQ: Omit<Question, 'id'>) => {
    const id = `q-custom-${Date.now()}`;
    const questionObj: Question = { ...newQ, id };
    const updated = [questionObj, ...questions];
    setQuestions(updated);
    saveState('euclide_questions', updated);
    showToast('Soal berhasil ditambahkan ke Bank Soal!', 'success');
  };

  const deleteQuestion = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    saveState('euclide_questions', updated);
    showToast('Soal berhasil dihapus dari Bank Soal.', 'info');
  };

  const gradeEssay = (id: string, score: number, feedback: string) => {
    setEssaySubmissions((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? {
              ...item,
              score,
              feedback,
              isGraded: true,
              gradedBy: currentUser.name,
              gradedAt: new Date().toLocaleString('id-ID') + ' WIB',
            }
          : item
      );
      saveState('euclide_essays', updated);
      return updated;
    });
    showToast(`Nilai esai (${score}/100) berhasil disimpan & dikirim ke siswa.`, 'success');
  };

  const toggleStudentStatus = (studentId: string, status: UserStatus) => {
    setStudents((prev) => {
      const updated = prev.map((s) => (s.id === studentId ? { ...s, status } : s));
      saveState('euclide_students', updated);
      return updated;
    });
    showToast(`Status siswa diperbarui menjadi: ${status.toUpperCase()}`, 'info');
  };

  const addManualPayment = (paymentData: Omit<PaymentRecord, 'id' | 'invoiceNumber' | 'paidAt'>): PaymentRecord => {
    const newRecord: PaymentRecord = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      invoiceNumber: `INV-EUC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`,
      paidAt: new Date().toLocaleString('id-ID') + ' WIB',
    };
    const updated = [newRecord, ...payments];
    setPayments(updated);
    saveState('euclide_payments', updated);
    showToast(`Pembayaran ${newRecord.invoiceNumber} berhasil dicatat!`, 'success');
    return newRecord;
  };

  const importPaymentsBulk = (rows: PaymentImportRow[]) => {
    let imported = 0;
    let errors = 0;
    const newRecords: PaymentRecord[] = [];

    rows.forEach((row, idx) => {
      if (row.isValid && Number(row.Nominal) > 0) {
        newRecords.push({
          id: `pay-import-${Date.now()}-${idx}`,
          invoiceNumber: `INV-IMP-${Date.now().toString().slice(-4)}-${idx + 1}`,
          nis: row.Nomor_Induk || 'EUC-2026-XXXX',
          studentName: row.Nama,
          month: row.Bulan || 'Februari 2026',
          amount: Number(row.Nominal),
          paymentMethod: 'Transfer Bank',
          status: (row.Status === 'Lunas' ? 'Lunas' : 'Menunggu') as any,
          paidAt: row.Status === 'Lunas' ? new Date().toLocaleString('id-ID') + ' WIB' : '-',
          recordedBy: `Import Excel (${currentUser.name})`,
          notes: 'Bulk Excel Import',
        });
        imported++;
      } else {
        errors++;
      }
    });

    if (newRecords.length > 0) {
      const updated = [...newRecords, ...payments];
      setPayments(updated);
      saveState('euclide_payments', updated);
      showToast(`Berhasil mengimpor ${imported} data pembayaran! (${errors} baris dilewati)`, 'success');
    } else {
      showToast(`Gagal mengimpor. Semua baris tidak valid (${errors} baris).`, 'error');
    }

    return { importedCount: imported, errorsCount: errors };
  };

  const getFinancialMetrics = () => {
    const totalStudents = students.length;
    const activeConcurrent = 320; // Simulated concurrent active test-takers
    const monthlyRevenue = payments
      .filter((p) => p.status === 'Lunas')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const overdueAmount = payments
      .filter((p) => p.status === 'Jatuh Tempo')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    return {
      totalStudents,
      activeConcurrent,
      monthlyRevenue,
      overdueAmount,
    };
  };

  const updateBatchCapacity = (batchId: string, maxCapacity: number) => {
    setBatches((prev) => {
      const updated = prev.map((b) => (b.id === batchId ? { ...b, maxCapacity } : b));
      saveState('euclide_batches', updated);
      return updated;
    });
    showToast('Kapasitas kuota batch berhasil diperbarui!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        switchRole,
        switchUser,
        signInWithGoogle,
        logout,
        tryouts,
        questions,
        activeSessions,
        startExam,
        getExamSession,
        saveAnswer,
        toggleFlagQuestion,
        updateSubtestTimer,
        incrementViolations,
        submitExam,
        examResults,
        getExamResult,
        addQuestion,
        deleteQuestion,
        essaySubmissions,
        gradeEssay,
        batches,
        students,
        payments,
        updateBatchCapacity,
        toggleStudentStatus,
        addManualPayment,
        importPaymentsBulk,
        getFinancialMetrics,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
