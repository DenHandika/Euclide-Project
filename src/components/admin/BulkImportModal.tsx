'use client';

import React, { useState } from 'react';
import { Question, SubtestId } from '@/types';
import MathRenderer from '@/components/common/MathRenderer';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  X,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (questions: Omit<Question, 'id'>[]) => void;
}

// Smart Auto-Formatter: converts common plain math notations to KaTeX
function autoFormatMathText(text: string): string {
  if (!text) return '';

  let formatted = text;

  // If already contains $, preserve it
  if (formatted.includes('$')) {
    return formatted;
  }

  // 1. Simple square roots: sqrt(...) or akar(...) -> \sqrt{...}
  formatted = formatted.replace(/(?:sqrt|akar)\(([^)]+)\)/gi, '$\\sqrt{$1}$');

  // 2. Simple exponents: e.g., 3t^2, x^3, 2^n -> $3t^2$
  formatted = formatted.replace(/\b([a-zA-Z0-9]+)\^([a-zA-Z0-9]+)\b/g, '$$$1^{$2}$$');

  // 3. Simple inequality symbols: <= -> \le, >= -> \ge, != -> \neq, +- -> \pm
  formatted = formatted.replace(/<=/g, '$\\le$');
  formatted = formatted.replace(/>=/g, '$\\ge$');
  formatted = formatted.replace(/\+-/g, '$\\pm$');

  // 4. Equations with standard functions: e.g., V(t) = ... or f(x) = ...
  formatted = formatted.replace(/\b([fghvV]\([a-zA-Z]\)\s*=\s*[^,\n\r]+)/g, (match) => {
    if (match.includes('$')) return match;
    return `$${match}$`;
  });

  return formatted;
}

const TEMPLATE_EXAMPLE = `[SOAL 1]
[SUBTEST] penalaran_matematika
[KESULITAN] Sedang
Sebuah tangki air berbentuk silinder diisi dengan laju volume V(t) = 3t^2 + 4t liter/menit. Tentukan volume total air yang tertampung dalam waktu t = 3 menit jika kondisi awal tangki kosong!
[A] 35 liter
[B] 45 liter
[C] 54 liter
[D] 63 liter
[E] 72 liter
[KUNCI] B
[PEMBAHASAN] Volume total diperoleh dari integral laju pengisian: $V(3) = \\int_{0}^{3} (3t^2 + 4t) \\, dt = [t^3 + 2t^2]_{0}^{3} = (27 + 18) = 45\\text{ liter}$.

[SOAL 2]
[SUBTEST] penalaran_matematika
[KESULITAN] Sulit
Diberikan persamaan kuadrat x^2 - 6x + 8 = 0. Jika akar-akarnya adalah alpha dan beta, maka nilai dari alpha^2 + beta^2 adalah...
[A] 16
[B] 20
[C] 24
[D] 28
[E] 36
[KUNCI] B
[PEMBAHASAN] Diketahui $\\alpha + \\beta = 6$ dan $\\alpha \\cdot \\beta = 8$. Maka $\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta = 6^2 - 2(8) = 36 - 16 = 20$.`;

export default function BulkImportModal({ isOpen, onClose, onImport }: BulkImportModalProps) {
  const [rawText, setRawText] = useState<string>('');
  const [parsedQuestions, setParsedQuestions] = useState<Omit<Question, 'id'>[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [autoMathEnabled, setAutoMathEnabled] = useState<boolean>(true);

  if (!isOpen) return null;

  const parseRawTextToQuestions = (text: string): Omit<Question, 'id'>[] => {
    if (!text.trim()) return [];

    // Split by [SOAL ... or [NOMOR ...
    const blocks = text.split(/\[(?:SOAL|NOMOR)[^\]]*\]/i).filter((b) => b.trim().length > 0);

    const results: Omit<Question, 'id'>[] = [];

    blocks.forEach((block, idx) => {
      // Extract subtest
      const subtestMatch = block.match(/\[SUBTEST\]\s*([a-zA-Z0-9_-]+)/i);
      const subtestId: SubtestId = (subtestMatch?.[1] as SubtestId) || 'penalaran_matematika';

      // Extract difficulty (Mudah | Sedang | Sukar/Sulit)
      const diffMatch = block.match(/\[KESULITAN\]\s*(Mudah|Sedang|Sulit|Sukar)/i);
      let difficulty: 'Mudah' | 'Sedang' | 'Sukar' = 'Sedang';
      if (diffMatch) {
        const d = diffMatch[1].toLowerCase();
        if (d === 'mudah') difficulty = 'Mudah';
        else if (d === 'sulit' || d === 'sukar') difficulty = 'Sukar';
        else difficulty = 'Sedang';
      }

      // Extract Stimulus (optional)
      const stimMatch = block.match(/\[STIMULUS\]([\s\S]*?)(?=\[(?:SOAL|A|B|C|D|E|KUNCI|PEMBAHASAN)\]|$)/i);
      const stimulus = stimMatch ? stimMatch[1].trim() : undefined;

      // Extract Question prompt: text between subtest/kesulitan and first option [A]
      let questionPrompt = '';
      const promptRegex = /(?:\[KESULITAN\][^\n]*\n|\[SUBTEST\][^\n]*\n|^)([\s\S]*?)(?=\[A\])/i;
      const promptMatch = block.match(promptRegex);
      if (promptMatch) {
        questionPrompt = promptMatch[1]
          .replace(/\[SUBTEST\][^\n]*\n?/gi, '')
          .replace(/\[KESULITAN\][^\n]*\n?/gi, '')
          .replace(/\[STIMULUS\][\s\S]*?\[\/STIMULUS\]/gi, '')
          .trim();
      }

      // Extract Options [A] to [E]
      const optA = block.match(/\[A\]\s*([^\n\r]+)/i)?.[1]?.trim() || '';
      const optB = block.match(/\[B\]\s*([^\n\r]+)/i)?.[1]?.trim() || '';
      const optC = block.match(/\[C\]\s*([^\n\r]+)/i)?.[1]?.trim() || '';
      const optD = block.match(/\[D\]\s*([^\n\r]+)/i)?.[1]?.trim() || '';
      const optE = block.match(/\[E\]\s*([^\n\r]+)/i)?.[1]?.trim() || '';

      // Extract Key
      const keyMatch = block.match(/\[KUNCI\]\s*([A-Ea-e])/i);
      const correctAnswer = keyMatch ? keyMatch[1].toUpperCase() : 'A';

      // Extract Explanation
      const expMatch = block.match(/\[PEMBAHASAN\]\s*([\s\S]*?)(?=\[(?:SOAL|NOMOR)\]|$)/i);
      const explanation = expMatch ? expMatch[1].trim() : 'Pembahasan resmi belum ditambahkan.';

      if (questionPrompt && optA && optB) {
        const finalQuestion = autoMathEnabled ? autoFormatMathText(questionPrompt) : questionPrompt;
        const options = [
          { id: 'A', text: autoMathEnabled ? autoFormatMathText(optA) : optA },
          { id: 'B', text: autoMathEnabled ? autoFormatMathText(optB) : optB },
          ...(optC ? [{ id: 'C', text: autoMathEnabled ? autoFormatMathText(optC) : optC }] : []),
          ...(optD ? [{ id: 'D', text: autoMathEnabled ? autoFormatMathText(optD) : optD }] : []),
          ...(optE ? [{ id: 'E', text: autoMathEnabled ? autoFormatMathText(optE) : optE }] : []),
        ];

        results.push({
          number: idx + 1,
          subtestId,
          type: 'single_choice',
          stimulus,
          question: finalQuestion,
          options,
          correctAnswer,
          explanation: autoMathEnabled ? autoFormatMathText(explanation) : explanation,
          difficulty,
          maxScore: 100,
        });
      }
    });

    return results;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawText(val);
    const parsed = parseRawTextToQuestions(val);
    setParsedQuestions(parsed);
  };

  const handleLoadSample = () => {
    setRawText(TEMPLATE_EXAMPLE);
    const parsed = parseRawTextToQuestions(TEMPLATE_EXAMPLE);
    setParsedQuestions(parsed);
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(TEMPLATE_EXAMPLE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content);
      const parsed = parseRawTextToQuestions(content);
      setParsedQuestions(parsed);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (parsedQuestions.length === 0) return;
    onImport(parsedQuestions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#13224E]/70 flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-[#FFFFFF] max-w-4xl w-full p-6 border-2 border-[#13224E] space-y-5 shadow-sheet my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E4DC] shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-[#1B3B8C]" />
              <h3 className="font-serif font-bold text-lg text-[#13224E]">
                Import Massal Naskah Soal (Template Word / Text)
              </h3>
            </div>
            <p className="font-mono text-xs text-[#637096] mt-0.5">
              Paste naskah soal berformat bracket dari Microsoft Word (.docx/txt) dengan konversi otomatis rumus.
            </p>
          </div>
          <button onClick={onClose} className="text-[#637096] hover:text-[#13224E]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#FAFAF7] border border-[#E4E4DC] text-xs font-mono shrink-0">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#F3F3ED] text-[#13224E] border border-[#CECEC2] font-semibold transition"
            >
              Muat Contoh Template
            </button>
            <button
              type="button"
              onClick={handleCopyTemplate}
              className="px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#F3F3ED] text-[#13224E] border border-[#CECEC2] transition flex items-center space-x-1"
            >
              {copied ? <Check className="w-3 h-3 text-[#1B8A5A]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Template Disalin!' : 'Salin Template'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-1.5 cursor-pointer text-[#13224E]">
              <input
                type="checkbox"
                checked={autoMathEnabled}
                onChange={(e) => {
                  setAutoMathEnabled(e.target.checked);
                  setParsedQuestions(parseRawTextToQuestions(rawText));
                }}
                className="accent-[#1B3B8C]"
              />
              <span>Auto-Format Rumus (Pangkat/Akar/Integral)</span>
            </label>

            <label className="px-2.5 py-1 bg-[#13224E] hover:bg-[#1B3B8C] text-white cursor-pointer transition flex items-center space-x-1">
              <Upload className="w-3 h-3 text-[#EFA93B]" />
              <span>Unggah File .txt</span>
              <input type="file" accept=".txt,.doc,.docx" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Editor & Preview Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[280px] overflow-hidden">
          {/* Left: Input Textarea */}
          <div className="flex flex-col space-y-1">
            <span className="font-mono text-[10px] text-[#637096] uppercase font-bold">
              Area Tempel (Paste) Teks Naskah Soal:
            </span>
            <textarea
              rows={12}
              value={rawText}
              onChange={handleTextChange}
              placeholder="Paste naskah soal dari Word di sini... Format: [SOAL 1] [SUBTEST] penalaran_matematika [A] ... [KUNCI] B"
              className="flex-1 w-full p-3 bg-[#FAFAF7] border border-[#CECEC2] font-mono text-xs focus:outline-none focus:border-[#13224E] resize-none leading-relaxed text-[#13224E]"
            />
          </div>

          {/* Right: Realtime Parsed Preview */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-[#637096] uppercase font-bold">
                Hasil Parsing & Preview KaTeX ({parsedQuestions.length} Soal):
              </span>
              {parsedQuestions.length > 0 ? (
                <span className="text-[#1B8A5A] font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Format Valid</span>
                </span>
              ) : (
                <span className="text-[#C8831A]">Belum ada soal terdeteksi</span>
              )}
            </div>

            <div className="flex-1 p-3 bg-[#FFFFFF] border-2 border-[#13224E] overflow-y-auto space-y-3 font-sans max-h-[300px]">
              {parsedQuestions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#9EABC7] space-y-2">
                  <BookOpen className="w-8 h-8 opacity-40" />
                  <p className="text-xs font-mono">
                    Ketik atau paste teks soal ber-tag di panel kiri, atau klik <strong>"Muat Contoh Template"</strong>.
                  </p>
                </div>
              ) : (
                parsedQuestions.map((q, i) => (
                  <div key={i} className="p-3 bg-[#FAFAF7] border border-[#E4E4DC] space-y-2 text-xs">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="font-bold text-[#13224E] bg-[#FFFFFF] px-1.5 py-0.5 border border-[#CECEC2]">
                        Nomor #{i + 1}
                      </span>
                      <span className="text-[#C8831A] font-medium capitalize">
                        {q.subtestId.replace(/_/g, ' ')} • {q.difficulty}
                      </span>
                    </div>

                    {/* Question text with KaTeX */}
                    <div className="font-serif font-semibold text-[#13224E]">
                      <MathRenderer content={q.question} />
                    </div>

                    {/* Options list */}
                    <div className="space-y-1 pt-1 font-mono text-[11px]">
                      {q.options?.map((opt) => (
                        <div
                          key={opt.id}
                          className={`flex items-center space-x-2 px-2 py-1 border ${
                            opt.id === q.correctAnswer
                              ? 'bg-[#EAF7F0] border-[#1B8A5A]/40 text-[#126340] font-bold'
                              : 'bg-[#FFFFFF] border-[#E4E4DC] text-[#13224E]'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-[#13224E] text-white flex items-center justify-center text-[9px]">
                            {opt.id}
                          </span>
                          <div className="text-xs font-sans">
                            <MathRenderer content={opt.text} />
                          </div>
                          {opt.id === q.correctAnswer && (
                            <span className="text-[9px] font-mono text-[#1B8A5A] ml-auto uppercase">
                              [KUNCI JAWABAN]
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#E4E4DC] flex items-center justify-between font-mono text-xs shrink-0">
          <span className="text-[#637096]">
            Total siap di-import: <strong>{parsedQuestions.length} butir soal</strong>
          </span>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-[#FAFAF7] hover:bg-[#F3F3ED] text-[#637096] border border-[#CECEC2]"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={parsedQuestions.length === 0}
              onClick={handleConfirmImport}
              className={`px-5 py-1.5 flex items-center space-x-1.5 font-bold transition ${
                parsedQuestions.length > 0
                  ? 'bg-[#13224E] hover:bg-[#1B3B8C] text-white cursor-pointer'
                  : 'bg-[#CECEC2] text-[#637096] cursor-not-allowed'
              }`}
            >
              <span>Simpan ke Bank Soal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
