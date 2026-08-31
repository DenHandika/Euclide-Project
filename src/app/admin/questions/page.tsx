'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SubtestId, QuestionType, Question } from '@/types';
import { SUBTEST_CONFIGS } from '@/data/mockData';
import MathRenderer from '@/components/common/MathRenderer';
import {
  Compass,
  PlusCircle,
  Sparkles,
  Layers,
  Calculator,
  Eye,
  CheckCircle2,
  Trash2,
  BookOpen,
} from 'lucide-react';

export default function BankSoalPage() {
  const { questions, addQuestion, showToast } = useApp();

  // Form State
  const [subtestId, setSubtestId] = useState<SubtestId>('penalaran_matematika');
  const [type, setType] = useState<QuestionType>('single_choice');
  const [stimulus, setStimulus] = useState<string>(
    'Diketahui sistem persamaan linear dua variabel dengan matriks koefisien $A = \\begin{pmatrix} 3 & 1 \\\\ 2 & 4 \\end{pmatrix}$.'
  );
  const [questionText, setQuestionText] = useState<string>(
    'Tentukan nilai determinan $\\det(A)$ dan invers matriks $A^{-1}$!'
  );
  const [options, setOptions] = useState([
    { id: 'A', text: '$\\det(A) = 10$, $A^{-1} = \\frac{1}{10}\\begin{pmatrix} 4 & -1 \\\\ -2 & 3 \\end{pmatrix}$' },
    { id: 'B', text: '$\\det(A) = 14$, $A^{-1} = \\frac{1}{14}\\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$' },
    { id: 'C', text: '$\\det(A) = 8$, $A^{-1} = \\frac{1}{8}\\begin{pmatrix} 3 & -1 \\\\ -2 & 4 \\end{pmatrix}$' },
    { id: 'D', text: '$\\det(A) = 10$, $A^{-1} = \\begin{pmatrix} 4 & -1 \\\\ -2 & 3 \\end{pmatrix}$' },
    { id: 'E', text: '$\\det(A) = 6$, $A^{-1} = \\text{tidak terdefinisi}$' },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [explanation, setExplanation] = useState<string>(
    'Perhitungan determinan:\n$$\\det(A) = (3)(4) - (1)(2) = 12 - 2 = 10$$\nRumus invers matriks $2 \\times 2$:\n$$A^{-1} = \\frac{1}{\\det(A)} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix} = \\frac{1}{10}\\begin{pmatrix} 4 & -1 \\\\ -2 & 3 \\end{pmatrix}$$\nJawaban benar: **A**.'
  );
  const [difficulty, setDifficulty] = useState<'Mudah' | 'Sedang' | 'Sukar'>('Sedang');

  // Math symbol helper insertion
  const insertMathSnippet = (snippet: string) => {
    setQuestionText((prev) => prev + ' ' + snippet);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const newQ: Omit<Question, 'id'> = {
      subtestId,
      type,
      number: questions.length + 1,
      stimulus,
      question: questionText,
      options: type === 'single_choice' || type === 'multi_select' ? options : undefined,
      correctAnswer,
      explanation,
      maxScore: 40,
      difficulty,
    };

    addQuestion(newQ);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-navy bg-blue-50 px-2.5 py-1 rounded-full mb-2">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>Modul Bank Soal & KaTeX Formula Creator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Bank Soal UTBK & Editor Formula KaTeX
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Buat dan modifikasi butir soal sains, matriks, kalkulus, dan literasi dengan visualisasi rumus matematika real-time.
            </p>
          </div>

          <div className="text-xs font-semibold bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            Total Bank Soal: <strong className="text-blue-600 font-mono text-sm">{questions.length}</strong> butir
          </div>
        </div>

        {/* 2-Column Layout: Form on Left, Live Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-slate-200 space-y-5">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-blue-600" />
              <span>Formulir Pembuatan Soal Baru</span>
            </h2>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subtest UTBK</label>
                  <select
                    value={subtestId}
                    onChange={(e) => setSubtestId(e.target.value as SubtestId)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    {SUBTEST_CONFIGS.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Format Soal</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as QuestionType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="single_choice">Pilihan Ganda (ABCDE)</option>
                    <option value="multi_select">Pilihan Majemuk (Ceklis)</option>
                    <option value="short_answer">Isian Singkat</option>
                    <option value="essay">Esai Argumentatif</option>
                  </select>
                </div>
              </div>

              {/* Math Formula Shortcuts Toolbar */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  ⚡ Shortcut Simbol & Rumus KaTeX:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => insertMathSnippet('$\\frac{a}{b}$')}
                    className="px-2 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 font-mono text-[11px]"
                  >
                    Pecahan \frac&#123;a&#125;&#123;b&#125;
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMathSnippet('$\\sqrt{x}$')}
                    className="px-2 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 font-mono text-[11px]"
                  >
                    Akar \sqrt&#123;x&#125;
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMathSnippet('$\\int_{0}^{2} f(x) \\, dx$')}
                    className="px-2 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 font-mono text-[11px]"
                  >
                    Integral \int
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMathSnippet('$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$')}
                    className="px-2 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 font-mono text-[11px]"
                  >
                    Matriks 2x2
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMathSnippet('$\\theta, \\alpha, \\pi$')}
                    className="px-2 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 font-mono text-[11px]"
                  >
                    Greek Simbol
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Wacana / Konteks Stimulus (Opsional):
                </label>
                <textarea
                  rows={2}
                  value={stimulus}
                  onChange={(e) => setStimulus(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pertanyaan Utama (Mendukung $formula$):
                </label>
                <textarea
                  rows={3}
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                />
              </div>

              {/* Options Setup if Single Choice */}
              {type === 'single_choice' && (
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700">Pilihan Jawaban (A-E):</label>
                  {options.map((opt, i) => (
                    <div key={opt.id} className="flex items-center space-x-2">
                      <span className="w-6 font-bold text-center text-slate-700">{opt.id}</span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...options];
                          updated[i].text = e.target.value;
                          setOptions(updated);
                        }}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}

                  <div className="pt-2 flex items-center space-x-2">
                    <label className="font-semibold text-slate-700">Kunci Jawaban Benar:</label>
                    <select
                      value={correctAnswer as string}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      className="px-3 py-1 bg-blue-50 border border-blue-300 rounded-lg font-bold text-blue-900"
                    >
                      {options.map((o) => (
                        <option key={o.id} value={o.id}>
                          Pilihan {o.id}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pembahasan / Solusi Konsep (KaTeX Supported):
                </label>
                <textarea
                  rows={4}
                  required
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 text-xs flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Soal ke Bank Soal</span>
              </button>
            </form>
          </div>

          {/* Right: Live Interactive KaTeX Preview */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Live KaTeX Renderer Preview
                  </h3>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>

              {stimulus && (
                <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs text-slate-300">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">
                    Stimulus Wacana:
                  </span>
                  <MathRenderer content={stimulus} />
                </div>
              )}

              <div className="text-sm sm:text-base font-semibold text-white">
                <MathRenderer content={questionText} />
              </div>

              {type === 'single_choice' && (
                <div className="space-y-2 pt-2">
                  {options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-xl border flex items-start space-x-3 text-xs ${
                        opt.id === correctAnswer
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                          : 'border-slate-800 bg-slate-800/50 text-slate-300'
                      }`}
                    >
                      <span className="font-bold">{opt.id}.</span>
                      <div className="flex-1">
                        <MathRenderer content={opt.text} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700 text-xs text-slate-300">
                <span className="font-bold text-amber-400 block mb-1">
                  Preview Pembahasan & Rumus:
                </span>
                <MathRenderer content={explanation} />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-4 border-t border-slate-800">
              ⚡ KaTeX di-compile secara instan tanpa request server (0ms server latency).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
