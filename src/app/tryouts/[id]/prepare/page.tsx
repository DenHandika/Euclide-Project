'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock, BookOpen } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DEMO_PROGRAMS } from '@/data/programs';
import { StudyProgram, validateChoices } from '@/lib/snbtChoices';
import ProgramChoiceEditor from '@/components/student/ProgramChoiceEditor';

export default function PrepareTryoutPage() {
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const { tryouts, currentUser, isHydrated, startExam, getExamSession } = useApp();
  const [choices,setChoices]=useState<StudyProgram[]>([]);
  const [confirmed,setConfirmed]=useState(false);
  const [loaded,setLoaded]=useState(false);
  const [error,setError]=useState('');
  const tryout=tryouts.find(t=>t.id===id);
  const existing=getExamSession(id);
  const ongoing=existing && !existing.isCompleted && !!existing.targetChoices?.length;
  const validation=validateChoices(choices);

  useEffect(()=>{
    if (!isHydrated) return;
    try {
      const saved=JSON.parse(localStorage.getItem(`euclide_preferences_${currentUser.id}`)||'[]');
      const resolved=Array.isArray(saved) ? saved.map(programId=>DEMO_PROGRAMS.find(p=>p.id===programId)).filter((p):p is StudyProgram=>!!p).slice(0,4) : [];
      setChoices(resolved);
    } catch {setChoices([]);}
    setLoaded(true);
  },[isHydrated,currentUser.id]);

  const change=(next:StudyProgram[])=>{setChoices(next);setConfirmed(false);setError('');};
  const begin=()=>{
    if (!tryout || !validation.valid || !confirmed) return;
    try {
      localStorage.setItem(`euclide_preferences_${currentUser.id}`,JSON.stringify(choices.map(p=>p.id)));
      startExam(id,choices);
      router.push(`/exam/${id}`);
    } catch(e) {setError(e instanceof Error ? e.message : 'Sesi belum dapat dimulai. Silakan coba lagi.');}
  };
  if (!isHydrated || !loaded) return <div className="p-10 text-center text-sm text-slate-500">Memuat preferensimu...</div>;
  if (!tryout) return <div className="p-10 text-center"><h1 className="text-xl font-bold">Paket tidak ditemukan</h1><Link href="/tryouts" className="eu-button-secondary mt-5">Kembali ke tryout</Link></div>;
  return (
    <div className="bg-[#F7F9FC] pb-10">
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        <Link href="/tryouts" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500"><ArrowLeft size={16}/>Kembali ke tryout</Link>
        <p className="eu-eyebrow">LANGKAH 1 · TENTUKAN TUJUANMU</p>
        <h1 className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">Kampus impianmu, mulai dari sini.</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">Susun 1–4 pilihan prodi sebelum ujian. Setelah selesai, hasil tryout akan dibandingkan dengan target pilihan awalmu.</p>
        <div className="my-6 rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-sm font-bold leading-6">{tryout.title}</h2><div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500"><span className="flex items-center gap-1.5"><Clock size={15}/>{tryout.totalDurationMinutes} menit</span><span className="flex items-center gap-1.5"><BookOpen size={15}/>{tryout.totalQuestions} soal</span><span>Timer dimulai setelah konfirmasi</span></div></div>
        {ongoing ? <div className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-bold">Tryout sudah berjalan</h2><p className="mt-3 text-sm leading-7 text-slate-500">Pilihan awal sudah tersimpan pada sesi ini. Lanjutkan pengerjaan dengan target yang sama.</p><ol className="my-5 space-y-3">{existing.targetChoices?.map((p,i)=><li key={p.id} className="text-sm">{i+1}. <strong>{p.name}</strong> ({p.degree})<span className="block pl-4 text-xs leading-6 text-slate-500">{p.institution}</span></li>)}</ol><Link href={`/exam/${id}`} className="eu-button-primary">Lanjutkan tryout<ArrowRight size={17}/></Link></div> : <>
          <ProgramChoiceEditor choices={choices} onChange={change}/>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <label className="flex cursor-pointer items-start gap-3"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#244676]"/><span className="text-sm leading-7 text-slate-600">Saya sudah memeriksa urutan prioritas. Saya memahami bahwa kampus dan skor target pada demo ini adalah contoh, bukan hasil seleksi resmi.</span></label>
            {error&&<p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
            <button type="button" disabled={!validation.valid||!confirmed} onClick={begin} className="eu-button-primary mt-5 w-full disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">Konfirmasi & mulai tryout<ArrowRight size={17}/></button>
            <p className="mt-3 text-xs leading-6 text-slate-500">Pilihan disalin ke sesi saat ujian dimulai. Mengganti preferensi berikutnya tidak mengubah target sesi ini.</p>
          </div>
        </>}
      </div>
    </div>
  );
}
