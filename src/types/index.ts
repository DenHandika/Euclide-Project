export type UserRole = 'admin' | 'tentor' | 'siswa';

export type UserStatus = 'active' | 'suspended' | 'graduated';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  nis?: string;
  phone?: string;
  targetPTN1?: string;
  targetProdi1?: string;
  targetPTN2?: string;
  targetProdi2?: string;
  batchId?: string;
  status: UserStatus;
  joinedDate: string;
  sppStatus?: 'paid' | 'unpaid' | 'overdue';
}

export type QuestionType = 'single_choice' | 'multi_select' | 'short_answer' | 'essay';

export type SubtestId =
  | 'penalaran_umum'
  | 'pengetahuan_kuantitatif'
  | 'pemahaman_bacaan_menulis'
  | 'pengetahuan_pemahaman_umum'
  | 'literasi_indonesia'
  | 'literasi_inggris'
  | 'penalaran_matematika';

export interface SubtestConfig {
  id: SubtestId;
  name: string;
  category: 'TPS' | 'Literasi' | 'Penalaran Matematika';
  durationMinutes: number;
  questionCount: number;
  description: string;
}

export interface QuestionOption {
  id: string; // 'A' | 'B' | 'C' | 'D' | 'E'
  text: string; // Can contain KaTeX (e.g., "$x = \frac{-b \pm \sqrt{D}}{2a}$")
}

export interface Question {
  id: string;
  subtestId: SubtestId;
  type: QuestionType;
  number: number;
  stimulus?: string; // Text / Context / Stimulus with math/tables
  question: string; // The core prompt (KaTeX supported)
  imageUrl?: string;
  options?: QuestionOption[]; // For single_choice & multi_select
  correctAnswer: string | string[]; // Single option id, array of option ids, or exact short answer string
  explanation: string; // KaTeX explanation / Pembahasan
  rubricGuide?: string; // For essay grading
  maxScore: number;
  difficulty: 'Mudah' | 'Sedang' | 'Sukar';
}

export interface Tryout {
  id: string;
  code: string;
  title: string;
  description: string;
  totalDurationMinutes: number;
  totalQuestions: number;
  subtests: SubtestConfig[];
  questions: Question[];
  badge?: string;
  targetDate?: string;
  participantsCount: number;
  averageScore?: number;
}

export interface UserAnswer {
  questionId: string;
  type: QuestionType;
  answer: string | string[]; // 'A', ['A', 'C'], '12', or essay text
  isFlagged?: boolean; // Ragu-ragu
  answeredAt?: string;
  timeSpentSeconds?: number;
}

export interface ExamSession {
  tryoutId: string;
  userId: string;
  currentSubtestIndex: number;
  currentQuestionIndex: number;
  answers: Record<string, UserAnswer>;
  subtestRemainingSeconds: Record<SubtestId, number>;
  violationsCount: number;
  isFullscreen: boolean;
  isCompleted: boolean;
  startedAt: string;
  submittedAt?: string;
}

export interface SubtestScoreResult {
  subtestId: SubtestId;
  subtestName: string;
  score: number; // 0 - 1000 standard UTBK IRT
  maxPossibleScore: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  nationalAverage: number;
}

export interface PTNTargetAnalysis {
  ptnName: string;
  prodiName: string;
  targetScore: number;
  userScore: number;
  difference: number;
  status: 'aman' | 'kompetitif' | 'kritis'; // 🟢 Aman (>= target), 🟡 Kompetitif (target - 30 to target), 🔴 Kritis (< target - 30)
  chancePercentage: number;
  acceptanceQuota: number;
  applicantsLastYear: number;
  advice: string;
}

export interface ExamResult {
  id: string;
  tryoutId: string;
  tryoutTitle: string;
  userId: string;
  userName: string;
  date: string;
  totalScore: number; // e.g. 715 / 1000
  percentileRank: number; // e.g. 96.5%
  totalCorrect: number;
  totalIncorrect: number;
  totalUnanswered: number;
  subtestResults: SubtestScoreResult[];
  ptnTargets: PTNTargetAnalysis[];
  tentorFeedback: {
    evaluator: string;
    avatar: string;
    strengths: string;
    weaknesses: string;
    strategicActionPlan: string;
  };
}

export interface ClassBatch {
  id: string;
  name: string;
  program: 'SNBT Super Intensif' | 'Kedokteran Priority' | 'Reguler Weekend' | 'Drilling UTBK 2026';
  room: string;
  tutorName: string;
  currentStudents: number;
  maxCapacity: number;
  schedule: string;
  status: 'active' | 'upcoming' | 'completed';
}

export interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  nis: string;
  studentName: string;
  month: string;
  amount: number;
  paymentMethod: 'Transfer Bank' | 'Tunai / Kasir' | 'Virtual Account' | 'QRIS';
  status: 'Lunas' | 'Menunggu' | 'Jatuh Tempo';
  paidAt: string;
  recordedBy: string;
  notes?: string;
}

export interface PaymentImportRow {
  Nomor_Induk: string;
  Nama: string;
  Bulan: string;
  Nominal: number | string;
  Status: string;
  isValid?: boolean;
  errorMessage?: string;
}

export interface EssaySubmission {
  id: string;
  tryoutId: string;
  tryoutTitle: string;
  questionId: string;
  questionNumber: number;
  subtestId: SubtestId;
  questionText: string;
  rubricGuide: string;
  studentId: string;
  studentName: string;
  studentNis: string;
  studentAnswer: string;
  submittedAt: string;
  wordCount: number;
  score?: number; // 0 - 100
  isGraded: boolean;
  gradedBy?: string;
  feedback?: string;
  gradedAt?: string;
}
