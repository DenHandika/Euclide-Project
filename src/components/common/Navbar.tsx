'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  Menu,
  X,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, currentRole } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isPublicPage = pathname === '/';
  const links = {
    siswa: [
      { name: 'Beranda', href: '/' },
      { name: 'Tryout', href: '/tryouts' },
      { name: 'Latihan soal', href: '/drilling' },
      { name: 'Hasil & target PTN', href: '/exam/to-utbk-national-01/result' },
    ],
    tentor: [
      { name: 'Bank soal', href: '/admin/questions' },
      { name: 'Koreksi esai', href: '/tentor/grading' },
      { name: 'Analisis siswa', href: '/tentor/analytics' },
    ],
    admin: [
      { name: 'Ringkasan', href: '/admin' },
      { name: 'Pembayaran', href: '/admin/payments' },
      { name: 'Kelas', href: '/admin/classes' },
      { name: 'Siswa', href: '/admin/students' },
      { name: 'Bank soal', href: '/admin/questions' },
      { name: 'Koreksi', href: '/tentor/grading' },
      { name: 'Analisis', href: '/tentor/analytics' },
    ],
  };
  if (pathname.startsWith('/exam/') && !pathname.includes('/result'))
    return null;
  const activeLinks = isPublicPage
    ? [
        { name: 'Beranda', href: '/' },
        { name: 'Program belajar', href: '/#program' },
        { name: 'Cara bergabung', href: '/#pendaftaran' },
        { name: 'FAQ', href: '/#faq' },
      ]
    : links[currentRole];
  return (
    <>
      {!isPublicPage &&
        (currentUser.status === 'suspended' ||
          currentUser.status === 'graduated') && (
          <div className="flex items-center justify-center gap-2 bg-amber-50 px-5 py-3 text-xs text-amber-900">
            <AlertTriangle size={16} />
            {currentUser.status === 'graduated'
              ? 'Akun alumni: hubungi admin untuk informasi akses arsip.'
              : 'Akses akun dibatasi sementara. Silakan hubungi admin bimbel.'}
          </div>
        )}
      <header className="sticky top-0 z-40 border-b border-[#E4EAF2] bg-white">
        <div
          className={`mx-auto flex w-full items-center justify-between gap-5 px-5 py-4 sm:px-8 ${isPublicPage ? 'max-w-7xl' : ''}`}
        >
          <Link
            href="/"
            aria-label="Euclide, beranda"
            className="flex shrink-0 items-center gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#244676] text-[#F2C66E]">
              <GraduationCap size={24} />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-[#19365F]">
              euclide<span className="text-[#C69336]">.</span>
            </span>
          </Link>
          <nav
            aria-label="Navigasi utama"
            className="hidden items-center gap-1 xl:flex"
          >
            {activeLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${pathname === link.href ? 'bg-[#EAF0FA] text-[#244676]' : 'text-slate-500 hover:bg-slate-50 hover:text-[#244676]'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="hidden shrink-0 items-center gap-4 xl:flex">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-600 hover:text-[#244676]"
            >
              {isPublicPage ? (
                'Masuk'
              ) : (
                <>
                  {currentUser.name.split(' ')[0]}
                  <span className="ml-1.5 text-slate-400">
                    /{' '}
                    {currentRole === 'tentor'
                      ? 'Pengajar'
                      : currentRole === 'admin'
                        ? 'Admin'
                        : 'Siswa'}
                  </span>
                </>
              )}
            </Link>
            {(isPublicPage || currentRole === 'siswa') && (
              <Link
                href={isPublicPage ? '/#pendaftaran' : '/tryouts'}
                className="eu-button-primary !px-4 !py-2.5"
              >
                {isPublicPage ? 'Cara bergabung' : 'Mulai belajar'}
                <ArrowRight size={15} />
              </Link>
            )}
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={mobileOpen}
            aria-controls="navigation-menu"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-[#244676] xl:hidden"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {mobileOpen && (
          <nav
            id="navigation-menu"
            aria-label="Menu navigasi"
            className="space-y-1 border-t border-slate-100 bg-white px-5 py-4 xl:hidden"
          >
            {activeLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold ${pathname === link.href ? 'bg-[#EAF0FA] text-[#244676]' : 'text-slate-600'}`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-3 block border-t border-slate-100 px-4 pt-4 text-sm text-slate-500"
            >
              {isPublicPage
                ? 'Masuk ke akun'
                : `Akun ${currentUser.name.split(' ')[0]} · Ganti akun`}
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
export default Navbar;
