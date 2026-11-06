import Link from 'next/link';
import { ArrowRight, BookOpen, Check, Clock, GraduationCap, Target, TrendingUp } from 'lucide-react';

const programs = [
  { icon: GraduationCap, title: 'Bimbingan belajar SMA', text: 'Bangun pemahaman materi dan kebiasaan belajar bersama pengajar.', points: ['Pendampingan materi sekolah', 'Belajar bersama kelas bimbingan', 'Evaluasi perkembangan belajar'] },
  { icon: Clock, title: 'Persiapan UTBK–SNBT', text: 'Persiapan terarah untuk TPS, literasi, dan penalaran matematika.', points: ['Latihan sesuai materi', 'Simulasi dengan waktu per subtes', 'Pembahasan dan evaluasi hasil'] },
  { icon: Target, title: 'Target kampus & prodi', text: 'Kenali jarak kemampuanmu dengan target program studi pilihan.', points: ['Tentukan prioritas prodi', 'Bandingkan hasil dengan target', 'Temukan fokus latihan berikutnya'] },
];

const registrationSteps = [
  { title: 'Ajukan pendaftaran', text: 'Calon siswa mengisi data diri dan program yang diminati. Admin juga dapat membantu pengajuan.' },
  { title: 'Admin meninjau', text: 'Data, pilihan kelas, dan ketersediaan tempat diperiksa sebelum pengajuan diterima atau ditolak.' },
  { title: 'Selesaikan pendaftaran', text: 'Jika diterima, ikuti arahan admin untuk penempatan kelas dan penyelesaian administrasi.' },
  { title: 'Mulai belajar', text: 'Gunakan akun yang telah diaktifkan untuk mengikuti kegiatan belajar dan melihat perkembanganmu.' },
];

const faqs = [
  { question: 'Apakah saya bisa mengajukan pendaftaran sendiri?', answer: 'Bisa. Calon siswa dapat mengajukan pendaftaran secara mandiri, atau meminta bantuan admin. Semua pengajuan ditinjau admin sebelum diterima.' },
  { question: 'Apakah mengajukan pendaftaran langsung memberi akses tryout?', answer: 'Belum. Pengajuan pendaftaran berbeda dari akun siswa aktif. Akses belajar diberikan setelah pengajuan diterima dan proses aktivasi diselesaikan.' },
  { question: 'Bagaimana jika saya sudah pernah belajar di Euclide?', answer: 'Gunakan akun dan Kode Siswa yang sama untuk daftar ulang. Jika lupa Kode Siswa, minta admin membantu mencari data lama agar riwayat belajarmu tetap tersambung.' },
  { question: 'Apakah hasil tryout menjamin diterima di PTN?', answer: 'Hasil terhadap target prodi merupakan bahan evaluasi belajar, bukan jaminan kelulusan atau pengumuman seleksi resmi.' },
  { question: 'Apakah bisa belajar melalui HP?', answer: 'Halaman belajar dirancang agar nyaman digunakan melalui browser HP. Pastikan koneksi internet stabil saat mengerjakan ujian.' },
];

export default function LandingPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-[#F4F7FB]">
        <div className="absolute right-0 top-0 hidden h-full w-1/3 bg-[#E9EEF7] lg:block" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D9E2F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#244676]"><GraduationCap size={16} /> Teman belajar menuju kampus impian</span>
            <h1 className="mt-6 max-w-xl text-4xl font-extrabold leading-[1.16] tracking-tight sm:text-5xl lg:text-[58px]">Langkah kecil hari ini.<br /><span className="text-[#244676]">Kampus impian</span><br />di depan nanti.</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600">Persiapkan UTBK bersama Euclide. Latih kemampuanmu, ikuti tryout, dan kenali materi yang perlu kamu tingkatkan.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="#pendaftaran" className="eu-button-primary">Kenali cara bergabung <ArrowRight size={17} /></Link><Link href="#program" className="eu-button-secondary">Lihat program <BookOpen size={17} /></Link></div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">{['7 subtes UTBK', 'Latihan per materi', 'Evaluasi hasil belajar'].map(text => <span key={text} className="flex items-center gap-1.5"><Check size={15} className="text-[#2B8065]" />{text}</span>)}</div>
          </div>
          <div className="relative mx-auto w-full max-w-lg lg:py-6">
            <div className="mb-4 flex items-center justify-between text-xs font-semibold text-[#526580]"><span>KENALI CARA BELAJARMU</span><span className="rounded-full bg-white px-3 py-1.5">Bersama Euclide</span></div>
            <div className="overflow-hidden rounded-3xl border border-[#D9E2EF] bg-white shadow-[0_18px_50px_-25px_rgba(25,48,83,0.3)]">
              <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF1CD] text-[#93641E]"><Target size={23} /></div><div><h2 className="text-base font-bold">Setiap latihan, satu langkah maju</h2><p className="mt-1 text-xs text-slate-500">Belajar terarah untuk persiapan UTBK</p></div></div>
              <div className="space-y-5 p-6">{[{icon: BookOpen, title: 'Mulai dari materi yang kamu butuhkan', text: 'Latihan TPS, literasi, dan penalaran matematika.', number: '01'}, {icon: Clock, title: 'Biasakan diri dengan waktu ujian', text: 'Kerjakan simulasi dengan timer per subtes.', number: '02'}, {icon: TrendingUp, title: 'Pahami hasil, perbaiki langkah', text: 'Lihat pembahasan dan evaluasi hasil tryout.', number: '03'}].map(item => <div key={item.number} className="flex items-start gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F5FA] text-[#244676]"><item.icon size={19} /></div><div className="flex-1"><h3 className="text-sm font-bold">{item.title}</h3><p className="mt-1 text-xs leading-6 text-slate-500">{item.text}</p></div><span className="pt-1 text-xs font-semibold text-slate-300">{item.number}</span></div>)}</div>
              <Link href="#program" className="flex items-center justify-between bg-[#244676] px-6 py-4 text-sm font-semibold text-white hover:bg-[#19365F]">Temukan langkah belajarmu<ArrowRight size={18} /></Link>
            </div>
            <p className="mt-4 text-center text-xs text-slate-500">Tidak harus langsung sempurna. Yang penting, mulai dulu.</p>
          </div>
        </div>
      </section>
      <section id="program" className="scroll-mt-28 mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="mb-8 max-w-2xl"><p className="eu-eyebrow">RUANG UNTUK BERTUMBUH</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">Dari memahami materi hingga menyiapkan tujuan.</h2><p className="mt-3 text-sm leading-7 text-slate-500">Pendampingan belajar, latihan, dan evaluasi yang saling melengkapi untuk langkah berikutnya.</p></div>
        <div className="grid gap-5 md:grid-cols-3">{programs.map(program => <article key={program.title} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7"><div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F5FA] text-[#244676]"><program.icon size={25} /></div><h3 className="text-lg font-bold">{program.title}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{program.text}</p><ul className="mt-5 space-y-3">{program.points.map(point => <li key={point} className="flex items-start gap-2 text-sm text-slate-600"><Check size={16} className="mt-0.5 shrink-0 text-[#2B8065]" />{point}</li>)}</ul></article>)}</div>
      </section>
      <section className="border-y border-slate-100 bg-[#F8FAFC]"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:py-16"><div><p className="eu-eyebrow">BELAJAR LEBIH TERARAH</p><h2 className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">Bukan sekadar selesai.<br />Pahami progresmu.</h2><p className="mt-4 max-w-md text-sm leading-7 text-slate-500">Jadikan hasil latihan sebagai bekal untuk menentukan langkah belajar berikutnya.</p></div><div className="grid gap-4 sm:grid-cols-2"><Link href="/drilling" className="eu-feature-card"><BookOpen className="mb-5 text-[#244676]" size={25} /><h3 className="font-bold">Latihan sesuai kebutuhan</h3><p className="mt-2 text-sm leading-6 text-slate-500">Ulangi materi dan pelajari pembahasannya sesuai ritme belajarmu.</p><span className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#244676]">Mulai latihan<ArrowRight size={16} /></span></Link><Link href="/exam/to-utbk-national-01/result" className="eu-feature-card"><Target className="mb-5 text-[#A67522]" size={25} /><h3 className="font-bold">Kenali target kampusmu</h3><p className="mt-2 text-sm leading-6 text-slate-500">Bandingkan hasil tryout dengan target program studi pilihanmu.</p><span className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#244676]">Lihat contoh hasil<ArrowRight size={16} /></span></Link></div></div></section>
      <section id="pendaftaran" className="scroll-mt-28 mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="max-w-2xl"><p className="eu-eyebrow">CARA BERGABUNG</p><h2 className="mt-3 text-2xl font-bold sm:text-3xl">Kenalan dulu. Lalu mulai perjalananmu.</h2><p className="mt-4 text-sm leading-7 text-slate-500">Kamu dapat mengajukan pendaftaran sendiri atau dibantu admin. Setiap pengajuan ditinjau agar data dan pilihan kelas sesuai.</p></div>
        <ol className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{registrationSteps.map((step, index) => <li key={step.title} className="rounded-2xl border border-slate-200 p-6"><span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF1CD] text-sm font-bold text-[#93641E]">{String(index + 1).padStart(2, '0')}</span><h3 className="mt-5 font-bold">{step.title}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{step.text}</p></li>)}</ol>
        <div className="mt-7 rounded-2xl bg-[#F1F5FA] p-5 text-sm leading-7 text-slate-600"><strong className="text-[#244676]">Sudah menjadi siswa Euclide?</strong> Daftar ulang menggunakan akun dan Kode Siswa yang sama. Tidak perlu membuat identitas baru.</div>
      </section>
      <section id="faq" className="scroll-mt-28 border-t border-slate-100 bg-[#F8FAFC]"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_1.5fr] lg:py-20"><div><p className="eu-eyebrow">SEBELUM MULAI</p><h2 className="mt-3 text-2xl font-bold sm:text-3xl">Yang sering ditanyakan.</h2><p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">Kenali alur pendaftaran dan ruang belajarmu di Euclide.</p></div><div className="space-y-3">{faqs.map(faq => <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer text-sm font-bold leading-6 text-slate-800 marker:text-[#C69336]">{faq.question}</summary><p className="mt-4 text-sm leading-7 text-slate-500">{faq.answer}</p></details>)}</div></div></section>
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8"><div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#FFF5DF] px-7 py-9 sm:px-10 md:flex-row md:items-center"><div><p className="text-xs font-bold tracking-widest text-[#956A22]">LANJUTKAN LANGKAHMU</p><h2 className="mt-2 text-2xl font-bold">Sudah punya akun siswa?</h2><p className="mt-2 text-sm leading-6 text-slate-600">Masuk untuk melanjutkan kegiatan belajar bersama Euclide.</p></div><Link href="/login" className="eu-button-primary shrink-0">Masuk ke akun<ArrowRight size={17} /></Link></div></section>
    </div>
  );
}
