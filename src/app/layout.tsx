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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen bg-slate-50 font-sans">
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
