'use client';

import React, { useId } from 'react';

type Props = {
  type: 'short_answer' | 'essay';
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
};

export default function WrittenAnswer({
  type,
  value,
  onChange,
  readOnly = false,
}: Props) {
  const id = useId();
  const essay = type === 'essay';
  const field = {
    id,
    value,
    readOnly,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => onChange(event.target.value),
    'aria-describedby': `${id}-hint`,
    className:
      'written-answer w-full min-h-12 rounded-xl border border-slate-500 bg-white p-3 text-base leading-relaxed text-slate-900 placeholder:text-slate-500 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 read-only:bg-slate-50',
  };

  return (
    <div className="space-y-2 pt-1">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-800"
      >
        {essay ? 'Jawaban esai' : 'Jawaban singkat'}
      </label>
      {essay ? (
        <textarea
          {...field}
          rows={6}
          placeholder="Tuliskan jawaban dan alasanmu di sini…"
        />
      ) : (
        <input
          {...field}
          type="text"
          autoComplete="off"
          placeholder="Ketik jawaban di sini…"
        />
      )}
      <p id={`${id}-hint`} className="text-sm text-slate-600">
        {readOnly
          ? 'Jawaban yang sudah diperiksa.'
          : essay
            ? 'Jelaskan dengan kalimatmu sendiri.'
            : 'Ikuti format jawaban yang diminta pada soal.'}
      </p>
    </div>
  );
}
