'use client';

import React, { useState } from 'react';
import {
  Divide,
  Sigma,
  Pi,
  Sparkles,
  FunctionSquare,
  Binary,
  Grid3X3,
  ChevronDown,
} from 'lucide-react';

interface MathToolbarProps {
  onInsert: (snippet: string) => void;
}

export default function MathToolbar({ onInsert }: MathToolbarProps) {
  const [activeCategory, setActiveCategory] = useState<'aljabar' | 'kalkulus' | 'simbol'>('aljabar');

  const aljabarSnippets = [
    { label: 'a/b', title: 'Pecahan', snippet: '\\frac{a}{b}', display: '\\frac{a}{b}' },
    { label: '√x', title: 'Akar Kuadrat', snippet: '\\sqrt{x}', display: '\\sqrt{x}' },
    { label: 'ⁿ√x', title: 'Akar Pangkat-n', snippet: '\\sqrt[n]{x}', display: '\\sqrt[3]{x}' },
    { label: 'xⁿ', title: 'Pangkat / Eksponen', snippet: 'x^{n}', display: 'x^2' },
    { label: 'xₙ', title: 'Indeks / Subskrip', snippet: 'x_{n}', display: 'x_1' },
    { label: '|x|', title: 'Nilai Mutlak', snippet: '|x|', display: '|x|' },
    { label: '( )', title: 'Kurung Otomatis', snippet: '\\left( x \\right)', display: '(x)' },
  ];

  const kalkulusSnippets = [
    { label: '∫ dx', title: 'Integral Tak Tentu', snippet: '\\int f(x) \\, dx', display: '\\int dx' },
    { label: '∫ₐᵇ dx', title: 'Integral Tentu', snippet: '\\int_{a}^{b} f(x) \\, dx', display: '\\int_0^t' },
    { label: 'lim', title: 'Limit Fungsi', snippet: '\\lim_{x \\to 0} f(x)', display: '\\lim_{x\\to 0}' },
    { label: '∑', title: 'Sigma / Deret', snippet: '\\sum_{i=1}^{n} x_i', display: '\\sum_{i=1}^n' },
    { label: 'df/dx', title: 'Turunan / Diferensial', snippet: '\\frac{df}{dx}', display: '\\frac{df}{dx}' },
    { label: '[2x2]', title: 'Matriks 2x2', snippet: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', display: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
    { label: 'det(A)', title: 'Determinan', snippet: '\\det(A)', display: '\\det(A)' },
    { label: 'x⃗', title: 'Vektor', snippet: '\\vec{v}', display: '\\vec{v}' },
  ];

  const simbolSnippets = [
    { label: '±', snippet: '\\pm' },
    { label: '≤', snippet: '\\le' },
    { label: '≥', snippet: '\\ge' },
    { label: '≠', snippet: '\\neq' },
    { label: '≈', snippet: '\\approx' },
    { label: '×', snippet: '\\times' },
    { label: '÷', snippet: '\\div' },
    { label: 'π', snippet: '\\pi' },
    { label: 'θ', snippet: '\\theta' },
    { label: 'α', snippet: '\\alpha' },
    { label: 'β', snippet: '\\beta' },
    { label: 'Δ', snippet: '\\Delta' },
    { label: '∞', snippet: '\\infty' },
    { label: '⟹', snippet: '\\implies' },
    { label: '∈', snippet: '\\in' },
    { label: '°', snippet: '^\\circ' },
  ];

  return (
    <div className="bg-[#FFFFFF] border border-[#13224E] p-2 space-y-2 shadow-sm font-sans">
      {/* Category Tabs & Info */}
      <div className="flex items-center justify-between border-b border-[#E4E4DC] pb-1.5 text-xs">
        <div className="flex items-center space-x-1 font-mono text-[11px]">
          <span className="text-[#637096] text-[10px] font-bold mr-1 hidden sm:inline">
            TOOLBAR RUMUS:
          </span>
          <button
            type="button"
            onClick={() => setActiveCategory('aljabar')}
            className={`px-2.5 py-0.5 border transition ${
              activeCategory === 'aljabar'
                ? 'bg-[#13224E] text-white border-[#13224E] font-semibold'
                : 'bg-[#FAFAF7] text-[#637096] border-[#E4E4DC] hover:border-[#CECEC2]'
            }`}
          >
            Aljabar & Pecahan
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('kalkulus')}
            className={`px-2.5 py-0.5 border transition ${
              activeCategory === 'kalkulus'
                ? 'bg-[#13224E] text-white border-[#13224E] font-semibold'
                : 'bg-[#FAFAF7] text-[#637096] border-[#E4E4DC] hover:border-[#CECEC2]'
            }`}
          >
            Kalkulus & Matriks
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('simbol')}
            className={`px-2.5 py-0.5 border transition ${
              activeCategory === 'simbol'
                ? 'bg-[#13224E] text-white border-[#13224E] font-semibold'
                : 'bg-[#FAFAF7] text-[#637096] border-[#E4E4DC] hover:border-[#CECEC2]'
            }`}
          >
            Simbol Sains
          </button>
        </div>

        <span className="font-mono text-[10px] text-[#C8831A] font-medium hidden md:inline">
          Klik tombol untuk menyisipkan rumus otomatis
        </span>
      </div>

      {/* Button Row by Category */}
      <div className="flex flex-wrap gap-1.5 items-center font-mono text-xs">
        {activeCategory === 'aljabar' && (
          <>
            {aljabarSnippets.map((item, idx) => (
              <button
                key={idx}
                type="button"
                title={item.title}
                onClick={() => onInsert(`$${item.snippet}$`)}
                className="px-2.5 py-1 bg-[#FAFAF7] hover:bg-[#1B3B8C] hover:text-white text-[#13224E] border border-[#CECEC2] text-xs font-bold transition flex items-center space-x-1"
              >
                <span>{item.label}</span>
                <span className="text-[9px] opacity-70 hidden lg:inline font-sans">({item.title})</span>
              </button>
            ))}
          </>
        )}

        {activeCategory === 'kalkulus' && (
          <>
            {kalkulusSnippets.map((item, idx) => (
              <button
                key={idx}
                type="button"
                title={item.title}
                onClick={() => onInsert(`$${item.snippet}$`)}
                className="px-2.5 py-1 bg-[#FAFAF7] hover:bg-[#1B3B8C] hover:text-white text-[#13224E] border border-[#CECEC2] text-xs font-bold transition flex items-center space-x-1"
              >
                <span>{item.label}</span>
                <span className="text-[9px] opacity-70 hidden lg:inline font-sans">({item.title})</span>
              </button>
            ))}
          </>
        )}

        {activeCategory === 'simbol' && (
          <>
            {simbolSnippets.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onInsert(`$${item.snippet}$`)}
                className="w-7 h-7 bg-[#FAFAF7] hover:bg-[#1B3B8C] hover:text-white text-[#13224E] border border-[#CECEC2] text-sm font-bold transition flex items-center justify-center"
              >
                {item.label}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
