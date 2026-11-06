'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Languages,
  Calculator,
} from 'lucide-react';
import { Tryout } from '@/types';
import { useApp } from '@/context/AppContext';

export default function TryoutCard({ tryout }: { tryout: Tryout }) {
  const { getExamSession } = useApp();
  const session = getExamSession(tryout.id);
  const full = tryout.subtests.length >= 7;
  const literacy = tryout.subtests.every(
    (subtest) => subtest.category === 'Literasi'
  );
  const Icon = full ? GraduationCap : literacy ? Languages : Calculator;
  const theme = full
    ? 'bg-[#EAF0FA] text-[#244676]'
    : literacy
      ? 'bg-[#EDF6F1] text-[#2B8065]'
      : 'bg-[#FFF3DC] text-[#99691D]';
  const title = tryout.title;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E1E7EF] bg-white transition hover:border-[#B4C5DE] hover:shadow-card-hover">
      <div className={`flex items-center justify-between px-6 py-5 ${theme}`}>
        <Icon size={32} strokeWidth={1.6} />
        <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold">
          {tryout.badge ?? (full ? 'Tujuh subtes' : 'Latihan fokus')}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="eu-eyebrow">
          {full
            ? 'TPS · LITERASI · PENALARAN'
            : literacy
              ? 'LITERASI'
              : 'TPS & MATEMATIKA'}
        </p>
        <h3 className="mt-3 text-lg font-bold leading-7">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {tryout.description}
        </p>
        <div className="mb-5 mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <Clock size={15} />
            {tryout.totalDurationMinutes} menit
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen size={15} />
            {tryout.totalQuestions} soal
          </span>
          <span>{tryout.subtests.length} subtes</span>
        </div>
        <Link
          href={
            session?.isCompleted
              ? `/exam/${tryout.id}/result`
              : session?.targetChoices?.length
                ? `/exam/${tryout.id}`
                : `/tryouts/${tryout.id}/prepare`
          }
          className={`mt-auto flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${session?.isCompleted ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'bg-[#244676] text-white hover:bg-[#19365F]'}`}
        >
          {session?.isCompleted
            ? 'Lihat hasil'
            : session
              ? 'Lanjutkan tryout'
              : 'Mulai tryout'}
          {session?.isCompleted ? (
            <CheckCircle2 size={16} />
          ) : (
            <ArrowRight size={16} />
          )}
        </Link>
      </div>
    </article>
  );
}
