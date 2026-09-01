'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { SUBTEST_CONFIGS } from '@/data/mockData';
import { Question, SubtestId } from '@/types';
import MathRenderer from '@/components/common/MathRenderer';
import MathToolbar from '@/components/admin/MathToolbar';
import BulkImportModal from '@/components/admin/BulkImportModal';
import {
  PlusCircle,
  FileSpreadsheet,
  Trash2,
  X,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  ClipboardPaste,
  BookOpen,
  ArrowRight,
  Upload,
} from 'lucide-react';

export default function AdminQuestionsPage() {
  const { questions, addQuestion, addQuestionsBulk, deleteQuestion, showToast } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [filterSubtest, setFilterSubtest] = useState<string>('all');

  // Question form state
  const [formData, setFormData] = useState({
    subtestId: 'penalaran_matematika' as SubtestId,
    type: 'single_choice' as const,
    stimulus: '',
    stimulusImage: '' as string,
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

  const [activeTargetField, setActiveTargetField] = useState<'question' | 'explanation' | 'option-0' | 'option-1' | 'option-2' | 'option-3' | 'option-4'>('question');

  const handleOptionTextChange = (index: number, text: string) => {
    const newOptions = [...formData.options];
    newOptions[index].text = text;
    setFormData({ ...formData, options: newOptions });
  };

  // Insert snippet from MathToolbar into active target field
  const handleInsertMathSnippet = (snippet: string) => {
    if (activeTargetField === 'question') {
      setFormData((prev) => ({ ...prev, question: `${prev.question} ${snippet}` }));
    } else if (activeTargetField === 'explanation') {
      setFormData((prev) => ({ ...prev, explanation: `${prev.explanation} ${snippet}` }));
    } else if (activeTargetField.startsWith('option-')) {
      const optIdx = parseInt(activeTargetField.split('-')[1]);
      const newOptions = [...formData.options];
      newOptions[optIdx].text = `${newOptions[optIdx].text} ${snippet}`;
      setFormData((prev) => ({ ...prev, options: newOptions }));
    }
  };

  // Handle Ctrl+V image paste
  const handlePasteImage = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            setFormData((prev) => ({ ...prev, stimulusImage: dataUrl }));
            showToast('Gambar soal berhasil di-paste (Ctrl+V) sebagai stimulus!', 'success');
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  // Handle direct file upload for stimulus image
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setFormData((prev) => ({ ...prev, stimulusImage: dataUrl }));
        showToast('Gambar stimulus berhasil diunggah!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQ: Omit<Question, 'id'> = {
      subtestId: formData.subtestId,
      number: questions.length + 1,
      type: formData.type,
      stimulus: formData.stimulusImage ? `[IMAGE_STIMULUS]${formData.stimulusImage}` : formData.stimulus || undefined,
      question: formData.question,
      options: formData.options,
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation,
      difficulty: formData.difficulty,
      maxScore: formData.maxScore,
    };

    addQuestion(newQ);
    setModalOpen(false);
  };

  const handleBulkImportConfirm = (importedQuestions: Omit<Question, 'id'>[]) => {
    addQuestionsBulk(importedQuestions);
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
              BANK SOAL & INSTRUMEN UJIAN
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#13224E]">
              Bank Soal KaTeX & Rumus Matematika
            </h1>
            <p className="text-xs sm:text-sm text-[#637096] mt-0.5">
              Buat dan kelola butir soal dengan Math Toolbar visual, paste foto soal langsung (Ctrl+V), atau import massal dari template Word.
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              onClick={() => setBulkModalOpen(true)}
              className="inline-flex items-center space-x-1.5 bg-[#FFFFFF] hover:bg-[#F3F3ED] text-[#13224E] border border-[#13224E] px-3.5 py-2 font-semibold transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#1B3B8C]" />
              <span>Import Massal Word (.docx)</span>
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center space-x-1.5 bg-[#13224E] hover:bg-[#1B3B8C] text-white px-3.5 py-2 font-semibold transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#EFA93B]" />
              <span>Buat Soal Baru</span>
            </button>
          </div>
        </div>

        {/* Subtest Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto font-mono text-xs pb-1">
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
              {st.name} ({questions.filter((q) => q.subtestId === st.id).length})
            </button>
          ))}
        </div>

        {/* Questions Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-[#FFFFFF] border-2 border-[#E4E4DC] hover:border-[#13224E] p-5 shadow-paper space-y-4 flex flex-col justify-between transition"
            >
              <div className="space-y-3">
                {/* Meta Header */}
                <div className="flex items-center justify-between font-mono text-[10px] pb-2 border-b border-[#E4E4DC]">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#13224E] bg-[#FAFAF7] px-2 py-0.5 border border-[#CECEC2]">
                      #{q.number}
                    </span>
                    <span className="text-[#1B3B8C] font-semibold uppercase">
                      {q.subtestId.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#C8831A] bg-[#EFA93B]/20 px-2 py-0.2 font-bold">
                      {q.difficulty}
                    </span>
                    <button
                      onClick={() => deleteQuestion(q.id)}
                      className="text-[#9EABC7] hover:text-[#D0342C] transition p-0.5"
                      title="Hapus Soal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Stimulus Image Preview if present */}
                {q.stimulus && q.stimulus.startsWith('[IMAGE_STIMULUS]') && (
                  <div className="p-2 bg-[#FAFAF7] border border-[#E4E4DC] max-h-36 overflow-hidden flex items-center justify-center">
                    <img
                      src={q.stimulus.replace('[IMAGE_STIMULUS]', '')}
                      alt="Stimulus Soal"
                      className="max-h-32 object-contain"
                    />
                  </div>
                )}

                {/* Question Prompt with KaTeX */}
                <div className="font-serif text-sm font-semibold text-[#13224E] leading-relaxed">
                  <MathRenderer content={q.question} />
                </div>

                {/* Options OMR */}
                <div className="space-y-1.5 font-mono text-xs">
                  {q.options?.map((opt) => (
                    <div
                      key={opt.id}
                      className={`flex items-start space-x-2.5 p-2 border ${
                        opt.id === q.correctAnswer
                          ? 'bg-[#EAF7F0] border-[#1B8A5A]/50 text-[#126340] font-semibold'
                          : 'bg-[#FAFAF7] border-[#E4E4DC] text-[#13224E]'
                      }`}
                    >
                      <span className="omr-bubble shrink-0 text-[10px] w-5 h-5">
                        {opt.id}
                      </span>
                      <div className="pt-0.5 text-xs font-sans">
                        <MathRenderer content={opt.text} />
                      </div>
                      {opt.id === q.correctAnswer && (
                        <span className="ml-auto text-[9px] font-mono text-[#1B8A5A] uppercase font-bold">
                          [KUNCI]
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation Drawer */}
              <div className="pt-2 border-t border-[#E4E4DC] text-[11px] text-[#637096] bg-[#FAFAF7] p-2.5 border">
                <span className="font-mono text-[9px] uppercase font-bold text-[#13224E] block mb-0.5">
                  [ PEMBAHASAN RESMI ]
                </span>
                <MathRenderer content={q.explanation} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 1. Modal: Buat Soal Baru dengan Visual Math Toolbar & Paste Gambar */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#13224E]/70 flex items-center justify-center p-4 overflow-y-auto font-sans"
          onPaste={handlePasteImage}
        >
          <div className="bg-[#FFFFFF] max-w-4xl w-full p-6 border-2 border-[#13224E] space-y-4 shadow-sheet my-8 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4DC]">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-[#1B3B8C]" />
                  <h3 className="font-serif font-bold text-lg text-[#13224E]">
                    Editor Pembuat Soal KaTeX & Rumus Matematika
                  </h3>
                </div>
                <p className="font-mono text-xs text-[#637096] mt-0.5">
                  Gunakan Math Toolbar visual untuk menyisipkan rumus otomatis atau tekan Ctrl+V untuk paste gambar soal.
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-[#637096] hover:text-[#13224E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual Math Toolbar Component */}
            <MathToolbar onInsert={handleInsertMathSnippet} />

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              {/* Row 1: Subtest & Tingkat Kesulitan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                <div>
                  <label className="block text-[#13224E] font-bold mb-1">Subtest Ujian:</label>
                  <select
                    value={formData.subtestId}
                    onChange={(e) => setFormData({ ...formData, subtestId: e.target.value as SubtestId })}
                    className="w-full p-2 bg-[#FAFAF7] border border-[#CECEC2] text-xs focus:outline-none focus:border-[#13224E]"
                  >
                    {SUBTEST_CONFIGS.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#13224E] font-bold mb-1">Tingkat Kesulitan:</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full p-2 bg-[#FAFAF7] border border-[#CECEC2] text-xs focus:outline-none focus:border-[#13224E]"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Sukar">Sukar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#13224E] font-bold mb-1">Kunci Jawaban Benar:</label>
                  <select
                    value={formData.correctAnswer}
                    onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                    className="w-full p-2 bg-[#FAFAF7] border border-[#1B8A5A] text-xs font-bold text-[#1B8A5A] focus:outline-none"
                  >
                    <option value="A">Opsi A</option>
                    <option value="B">Opsi B</option>
                    <option value="C">Opsi C</option>
                    <option value="D">Opsi D</option>
                    <option value="E">Opsi E</option>
                  </select>
                </div>
              </div>

              {/* Stimulus Gambar (Ctrl+V paste / upload) */}
              <div className="p-3 bg-[#FAFAF7] border border-[#E4E4DC] space-y-2">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="font-bold text-[#13224E] uppercase flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#1B3B8C]" />
                    <span>Gambar Stimulus / Grafik Soal (Opsional):</span>
                  </span>
                  <span className="text-[#C8831A]">Bisa langsung tekan Ctrl+V (Paste) di halaman ini</span>
                </div>

                {formData.stimulusImage ? (
                  <div className="flex items-center space-x-4 p-2 bg-[#FFFFFF] border border-[#CECEC2]">
                    <img src={formData.stimulusImage} alt="Stimulus" className="h-16 object-contain border" />
                    <div className="text-xs">
                      <span className="text-[#1B8A5A] font-bold block">Gambar Terpasang</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, stimulusImage: '' })}
                        className="text-[#D0342C] text-[10px] font-mono hover:underline mt-1"
                      >
                        Hapus Gambar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between border border-dashed border-[#CECEC2] p-2.5 bg-[#FFFFFF]">
                    <span className="text-[#637096] text-[11px] font-mono">
                      Belum ada gambar. Paste screenshot soal atau unggah file:
                    </span>
                    <label className="px-2.5 py-1 bg-[#FAFAF7] hover:bg-[#F3F3ED] text-[#13224E] border border-[#CECEC2] font-mono text-[10px] cursor-pointer flex items-center space-x-1">
                      <Upload className="w-3 h-3" />
                      <span>Pilih Berkas Gambar</span>
                      <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                    </label>
                  </div>
                )}
              </div>

              {/* Question Textarea & Live Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#13224E] font-mono text-[11px]">
                      Pertanyaan Soal (LaTeX / Teks):
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTargetField('question')}
                      className={`text-[10px] font-mono px-1.5 py-0.2 border ${
                        activeTargetField === 'question' ? 'bg-[#13224E] text-white' : 'bg-[#FAFAF7] text-[#637096]'
                      }`}
                    >
                      Target Toolbar
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={formData.question}
                    onFocus={() => setActiveTargetField('question')}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full p-2.5 bg-[#FAFAF7] border border-[#CECEC2] font-mono text-xs focus:outline-none focus:border-[#13224E]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#13224E] font-mono text-[11px] block mb-1">
                    Live Preview Soal KaTeX:
                  </label>
                  <div className="p-3 bg-[#FFFFFF] border-2 border-[#13224E] min-h-[96px] max-h-[120px] overflow-y-auto font-serif text-xs leading-relaxed text-[#13224E]">
                    <MathRenderer content={formData.question} />
                  </div>
                </div>
              </div>

              {/* Options A to E */}
              <div className="space-y-2">
                <label className="font-bold text-[#13224E] font-mono text-[11px] block">
                  Pilihan Jawaban (A — E):
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {formData.options.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center space-x-2 bg-[#FAFAF7] p-1.5 border border-[#E4E4DC]">
                      <span className="w-5 h-5 bg-[#13224E] text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                        {opt.id}
                      </span>
                      <input
                        type="text"
                        required
                        value={opt.text}
                        onFocus={() => setActiveTargetField(`option-${idx}` as any)}
                        onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                        placeholder={`Teks pilihan ${opt.id}...`}
                        className="flex-1 p-1 bg-[#FFFFFF] border border-[#CECEC2] font-mono text-xs focus:outline-none focus:border-[#13224E]"
                      />
                      <div className="w-24 truncate text-right font-sans text-xs">
                        <MathRenderer content={opt.text} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#13224E] font-mono text-[11px]">
                    Langkah Pembahasan Soal (KaTeX):
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTargetField('explanation')}
                    className={`text-[10px] font-mono px-1.5 py-0.2 border ${
                      activeTargetField === 'explanation' ? 'bg-[#13224E] text-white' : 'bg-[#FAFAF7] text-[#637096]'
                    }`}
                  >
                    Target Toolbar
                  </button>
                </div>
                <textarea
                  rows={3}
                  required
                  value={formData.explanation}
                  onFocus={() => setActiveTargetField('explanation')}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="w-full p-2.5 bg-[#FAFAF7] border border-[#CECEC2] font-mono text-xs focus:outline-none focus:border-[#13224E]"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#E4E4DC] flex items-center justify-end space-x-2 font-mono">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 bg-[#FAFAF7] border border-[#CECEC2] text-[#637096]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#13224E] hover:bg-[#1B3B8C] text-white font-bold"
                >
                  Simpan Soal ke Bank Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Import Massal Naskah Soal Word (.docx / Text) */}
      <BulkImportModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        onImport={handleBulkImportConfirm}
      />
    </div>
  );
}
