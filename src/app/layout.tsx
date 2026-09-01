import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import RoleSwitcher from '@/components/common/RoleSwitcher';
import ToastStack from '@/components/common/ToastStack';

export const metadata: Metadata = {
  title: 'EUCLIDE — EdTech CBT Tryout & Bimbel Management System',
  description:
    'Sistem Ujian Berbasis Komputer (CBT) dan Manajemen Bimbingan Belajar Modern SNBT dengan Analitik Rasionalisasi PTN, Bank Soal KaTeX, dan Modul Keuangan.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Spectral:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#F59E0B]/25 selection:text-[#0F172A]">
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <RoleSwitcher />
          <ToastStack />
        </AppProvider>
      </body>
    </html>
  );
}
