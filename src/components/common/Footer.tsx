'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/exam/') && !pathname.includes('/result')) return null;
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div><Link href="/" className="inline-flex items-center gap-2 text-xl font-extrabold text-[#19365F]"><GraduationCap size={24} />euclide.</Link><p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">Teman belajar dan bertumbuh. Persiapan UTBK yang terarah untuk langkahmu menuju kampus impian.</p></div>
          <div><h3 className="text-sm font-bold">Ruang belajar</h3><div className="mt-4 space-y-3 text-sm text-slate-500"><Link href="/tryouts" className="block hover:text-[#244676]">Tryout UTBK</Link><Link href="/drilling" className="block hover:text-[#244676]">Latihan soal</Link><Link href="/exam/to-utbk-national-01/result" className="block hover:text-[#244676]">Contoh hasil & target PTN</Link></div></div>
          <div><h3 className="text-sm font-bold">Bersama Euclide</h3><p className="mt-4 text-sm leading-7 text-slate-500">Satu ruang untuk siswa, pengajar, dan pengelola bimbingan belajar.</p><Link href="/login" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#244676]">Masuk ke akun<ArrowUpRight size={15} /></Link></div>
        </div>
        <div className="mt-9 flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-5 text-xs text-slate-400"><span>© {new Date().getFullYear()} Euclide. Belajar untuk masa depan.</span><span>Tryout & bimbingan belajar</span></div>
      </div>
    </footer>
  );
}
export default Footer;
