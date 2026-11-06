'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StudyProgram, evaluateTarget, validateChoices } from '@/lib/snbtChoices';
import ProgramChoiceEditor from './ProgramChoiceEditor';

export default function TargetEvaluation({choices,score}: {choices:StudyProgram[];score:number}) {
  const [simulate,setSimulate]=useState(false);
  const [alternatives,setAlternatives]=useState<StudyProgram[]>(choices.map(p=>({...p})));
  const cards=(list:StudyProgram[])=>list.map((p,i)=>{
    const evaluation=evaluateTarget(score,p.targetScore);
    const color=evaluation.status==='aman'?'bg-emerald-50 text-emerald-800':evaluation.status==='kompetitif'?'bg-amber-50 text-amber-900':evaluation.status==='unavailable'?'bg-slate-100 text-slate-600':'bg-rose-50 text-rose-800';
    return <article key={p.id} className="rounded-xl border border-slate-200 p-5"><p className="text-xs font-semibold text-slate-500">Prioritas {i+1} · {p.degree}</p><h3 className="mt-2 font-bold">{p.name}</h3><p className="mt-1 text-xs leading-6 text-slate-500">{p.institution}</p><span className={`mt-3 inline-block rounded-full px-3 py-1.5 text-xs font-bold ${color}`}>{evaluation.label}</span><dl className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center"><div><dt className="text-xs text-slate-500">Skor demo</dt><dd className="mt-1 text-sm font-bold">{score}</dd></div><div><dt className="text-xs text-slate-500">Target contoh</dt><dd className="mt-1 text-sm font-bold">{p.targetScore??'—'}</dd></div><div><dt className="text-xs text-slate-500">Selisih</dt><dd className="mt-1 text-sm font-bold">{evaluation.difference===null?'—':`${evaluation.difference>=0?'+':''}${evaluation.difference}`}</dd></div></dl><p className="mt-4 text-xs leading-6 text-slate-500">{evaluation.difference===null?'Referensi target belum tersedia untuk prodi ini.':evaluation.difference<0?`Masih perlu ${Math.abs(evaluation.difference)} poin untuk mencapai target contoh. Prioritaskan subtes dengan skor terendah.`:'Target contoh tercapai. Pertahankan latihan dan perbaiki materi yang masih lemah.'}</p></article>;
  });
  return <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><div><h2 className="text-lg font-bold">Hasil terhadap pilihan awalmu</h2><p className="mt-2 text-sm leading-7 text-slate-500">Urutan di bawah adalah preferensi saat ujian dimulai. Skor serta target pada prototipe masih data contoh; lolos target bukan pengumuman diterima PTN.</p></div>
    {choices.length ? <div className="grid gap-4 sm:grid-cols-2">{cards(choices)}</div> : <p className="rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-500">Contoh hasil ini belum memiliki pilihan awal. <Link href="/tryouts" className="font-semibold text-[#244676] underline">Pilih tryout</Link> dan tentukan prodi sebelum mulai.</p>}
    <button type="button" onClick={()=>setSimulate(!simulate)} aria-expanded={simulate} className="eu-button-secondary w-full sm:w-auto">{simulate?'Tutup simulasi alternatif':'Coba prodi alternatif'}</button>
    {simulate&&<div className="space-y-5 border-t border-slate-100 pt-5"><h3 className="font-bold">Bagaimana jika pilihanmu berbeda?</h3><p className="text-sm leading-7 text-slate-500">Gunakan skor yang sama untuk membandingkan prodi lain. Simulasi ini tidak mengubah pilihan awal atau hasil tersimpan.</p><ProgramChoiceEditor choices={alternatives} onChange={setAlternatives}/>{validateChoices(alternatives).valid&&<div className="grid gap-4 sm:grid-cols-2">{cards(alternatives)}</div>}</div>}
  </section>;
}
