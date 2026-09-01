'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SUBTEST_CONFIGS } from '@/data/mockData';
import { Question, SubtestId } from '@/types';
import MathRenderer from '@/components/common/MathRenderer';
import {
  Compass,
  PlusCircle,
  Code,
  Eye,
  CheckCircle2,
  Trash2,
  X,
} from 'lucide-react';

export default function AdminQuestionsPage() {
  const { questions, addQuestion, deleteQuestion, showToast } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [filterSubtest, setFilterSubtest] = useState<string>('all');

  const [formData, setFormData] = useState({
    subtestId: 'penalaran_matematika' as SubtestId,
    type: 'single_choice' as const,
    stimulus: '',
    question: 'Diberikan matriks $A = \\begin{pmatrix} 2 & x \\\\ 3 & 5 \\end{pmatrix}$. Jika $\\det(A) = 4$, maka nilai $x$ adalah...',
    options: [
      { id: 'A', text: '$x = 1$' },
      { id: 'B', text: '$x = 2$' },
      { id: 'C', text: '$x = 3$' },
      { id: 'D', text: '$x = 4$' },
      { id: 'E', text: '$x = 5$' },
    ],
    correctAnswer: 'B',
    explanation: 'Perhitungan determinan: $$\\det(A) = (2)(5) - (3)(x) = 10 - 3x$$ Diketahui $\\det(A) = 4$, maka: $$10 - 3x = 4 \\implies 3x = 6 \\implies x = 2$$',
    difficulty: 'Sedang' as const,
    maxScore: 100,
  });

  const handleOptionTextChange = (index: number, text: string) => {
    const newOptions = [...formData.options];
    newOptions[index].text = text;
    setFormData({ ...formData, options: newOptions });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQ: Question = {
      id: `q-custom-${Date.now()}`,
      subtestId: formData.subtestId,
      number: questions.length + 1,
      type: formData.type,
      stimulus: formData.stimulus || undefined,
      question: formData.question,
      options: formData.options,
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation,
      difficulty: formData.difficulty,
      maxScore: formData.maxScore,
    };

    addQuestion(newQ);
    setModalOpen(false);
    showToast('Soal KaTeX baru berhasil disimpan ke Bank Soal!', 'success');
  };

  const filteredQuestions = questions.filter((q) => {
    if (filterSubtest === 'all') return true;
    return q.subtestId === filterSubtest;
  });

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-8 font-sans text-[#13224E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#13224E] pb-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase text-[#1B3B8C] block mb-1">
              ENGINE PEMBUAT SOAL MATEMATIKA & SAINS
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#13224E]">
              Bank Soal KaTeX & Rumus Matematika
            </h1>
            <p className="text-xs sm:text-sm text-[#637096] mt-0.5">
              Kelola butir soal tryout dengan penulisan notasi LaTeX ($...$) dan preview instan client-side.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center space-x-1.5 bg-[#13224E] hover:bg-[#1B3B8C] text-white text-xs font-mono px-3.5 py-2 transition"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#EFA93B]" />
            <span>Buat Soal KaTeX Baru</span>
          </button>
        </div>

        {/* Subtest Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto font-mono text-xs">
          <button
            onClick={() => setFilterSubtest('all')}
            className={`px-3 py-1 border whitespace-nowrap transition ${
              filterSubtest === 'all'
                ? 'bg-[#13224E] text-white border-[#13224E] font-semibold'
                : 'bg-[#FFFFFF] text-[#637096] border-[#E4E4DC] hover:border-[#CECEC2]'
            }`}
          >
            Semua Subtest ({questions.length})
          </button>
          {SUBTEST_CONFIGS.map((st) => (
            <button
              key={st.id}
              onClick={() => setFilterSubtest(st.id)}
              className={`px-3 py-1 border whitespace-nowrap transition ${
                filterSubtest === st.id
                  ? 'bg-[#13224E] text-white border-[#13224E] font-semibold'
                  : 'bg-[#FFFFFF] text-[#637096] border-[#E4E4DC] hover:border-[#CECEC2]'
              }`}
            >
              {st.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-[#FFFFFF] border border-[#13224E] p-5 shadow-paper space-y-3"
            >
              <div className="flex items-start justify-between border-b border-[#E4E4DC] pb-2 font-mono text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold bg-[#13224E] text-white px-2 py-0.5">
                    #{idx + 1}
                  </span>
                  <span className="text-[#1B3B8C] font-semibold uppercase">
                    [{q.subtestId.replace(/_/g, ' ')}]
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 font-bold ${
                      q.difficulty === 'Sukar'
                        ? 'bg-[#FDECEB] text-[#D0342C]'
                        : q.difficulty === 'Sedang'
                        ? 'bg-[#FDF3E3] text-[#C8831A]'
                        : 'bg-[#EAF7F0] text-[#126340]'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[#637096] text-[11px]">Bobot: {q.maxScore} Poin</span>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="text-[#D0342C] hover:underline"
                    title="Hapus Soal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="text-sm font-serif font-semibold text-[#13224E] leading-relaxed">
                <MathRenderer content={q.question} />
              </div>

              {/* Options */}
              {q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-2 border flex items-center space-x-2 ${
                        opt.id === q.correctAnswer
                          ? 'border-[#1B8A5A] bg-[#EAF7F0]/40'
                          : 'border-[#E4E4DC] bg-[#FAFAF7]'
                      }`}
                    >
                      <span className="font-mono font-bold w-5 h-5 bg-[#FFFFFF] border border-[#CECEC2] flex items-center justify-center text-[10px]">
                        {opt.id}
                      </span>
                      <div className="text-[#13224E]">
                        <MathRenderer content={opt.text} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Explanation */}
              <div className="p-3 bg-[#FAFAF7] border border-[#E4E4DC] text-xs text-[#13224E] space-y-1">
                <span className="font-mono text-[9px] uppercase font-bold text-[#1B3B8C] block">
                  Pembahasan KaTeX:
                </span>
                <MathRenderer content={q.explanation} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Create Question */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#13224E]/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] max-w-2xl w-full p-6 border-2 border-[#13224E] space-y-4 shadow-sheet font-sans my-8">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E4DC]">
              <h3 className="font-serif font-bold text-base text-[#13224E]">
                Editor Naskah Soal & Rumus KaTeX
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#637096]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="block text-[#13224E] font-semibold mb-1">Subtest</label>
                  <select
                    value={formData.subtestId}
                    onChange={(e) => setFormData({ ...formData, subtestId: e.target.value as any })}
                    className="w-full p-2 bg-[#FAFAF7] border border-[#CECEC2] text-xs"
                  >
                    {SUBTEST_CONFIGS.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#13224E] font-semibold mb-1">Tingkat Kesulitan</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full p-2 bg-[#FAFAF7] border border-[#CECEC2] text-xs"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Sukar">Sukar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#13224E] mb-1">
                  Naskah Soal (Gunakan $rumus$ atau $$blok_rumus$$)
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full p-2.5 bg-[#FAFAF7] border border-[#CECEC2] font-mono text-xs focus:outline-none focus:border-[#13224E]"
                />
              </div>

              {/* Live Preview Box */}
              <div className="p-3 bg-[#FAFAF7] border border-[#1B3B8C] space-y-1">
                <span className="font-mono text-[9px] text-[#1B3B8C] uppercase font-bold block">
                  Pratinjau Live KaTeX:
                </span>
                <div className="font-serif text-sm font-semibold text-[#13224E]">
                  <MathRenderer content={formData.question || 'Ketik rumus di atas...'} />
                </div>
              </div>

              {/* Options Inputs */}
              <div className="space-y-2">
                <label className="block font-semibold text-[#13224E]">Pilihan Jawaban (A-E)</label>
                {formData.options.map((opt, idx) => (
                  <div key={opt.id} className="flex items-center space-x-2 font-mono">
                    <span className="w-6 h-6 bg-[#13224E] text-white flex items-center justify-center font-bold text-xs">
                      {opt.id}
                    </span>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                      className="flex-1 p-1.5 bg-[#FAFAF7] border border-[#CECEC2] text-xs"
                    />
                    <input
                      type="radio"
                      name="correctRadio"
                      checked={formData.correctAnswer === opt.id}
                      onChange={() => setFormData({ ...formData, correctAnswer: opt.id })}
                      className="w-4 h-4 text-[#1B8A5A]"
                    />
                    <span className="text-[10px] text-[#637096]">Kunci</span>
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold text-[#13224E] mb-1">
                  Pembahasan Solusi Lengkap
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="w-full p-2.5 bg-[#FAFAF7] border border-[#CECEC2] font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-[#E4E4DC] flex justify-end space-x-2 font-mono">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 bg-[#FAFAF7] border border-[#CECEC2] text-[#637096]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#13224E] hover:bg-[#1B3B8C] text-white font-semibold"
                >
                  Simpan ke Bank Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
