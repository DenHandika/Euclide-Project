"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Users,
  Wallet,
  Armchair,
  ClipboardCheck,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApp } from "@/context/AppContext";
import Pagination from "@/components/common/Pagination";
import usePagination from "@/hooks/usePagination";
import { paymentPeriods, studentComposition } from "@/lib/adminDashboard";

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
const compact = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const paymentSeries = [
  { key: "Lunas", color: "#264775" },
  { key: "Menunggu", color: "#a16207" },
  { key: "Jatuh Tempo", color: "#be123c" },
] as const;

export default function AdminDashboardPage() {
  const { isHydrated, batches, payments, students, essaySubmissions } =
    useApp();
  const capacity = usePagination(batches, 4, "", [4, 8, 12]);
  const periods = paymentPeriods(payments);
  const paymentPages = usePagination(periods, 6, "", [3, 6, 12]);
  const composition = studentComposition(students);
  const paid = payments.filter((payment) => payment.status === "Lunas");
  const overdue = payments.filter(
    (payment) => payment.status === "Jatuh Tempo",
  );
  const paidTotal = paid.reduce(
    (sum, payment) => sum + Math.max(0, Number(payment.amount) || 0),
    0,
  );
  const seats = batches.reduce(
    (sum, batch) => sum + Math.max(0, batch.maxCapacity),
    0,
  );
  const occupied = batches.reduce(
    (sum, batch) => sum + Math.max(0, batch.currentStudents),
    0,
  );
  const remaining = batches.reduce(
    (sum, batch) =>
      sum + Math.max(0, batch.maxCapacity - batch.currentStudents),
    0,
  );
  const pendingEssays = essaySubmissions.filter(
    (essay) => !essay.isGraded,
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 py-6 text-slate-900 sm:py-9">
      <div className="mx-auto w-full min-w-0 space-y-6 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl leading-relaxed text-slate-600">
              Pantau pembayaran, ketersediaan kursi, dan pekerjaan yang perlu
              diselesaikan.
            </p>
          </div>
          <Link href="/admin/payments" className="eu-button-primary gap-2">
            Kelola pembayaran <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </header>
        {!isHydrated ? (
          <p role="status" className="py-12 text-slate-600">
            Memuat data dashboard...
          </p>
        ) : (
          <>
            <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Siswa terdaftar",
                  value: students.length,
                  note: `${students.filter((student) => student.status === "active").length} akun aktif`,
                  icon: Users,
                },
                {
                  label: "Pembayaran lunas",
                  value: currency.format(paidTotal),
                  note: `${paid.length} transaksi · seluruh periode`,
                  icon: Wallet,
                },
                {
                  label: "Kursi tersedia",
                  value: remaining,
                  note: `${occupied} terisi dari ${seats} kursi`,
                  icon: Armchair,
                },
                {
                  label: "Esai belum dinilai",
                  value: pendingEssays,
                  note: "Menunggu koreksi pengajar",
                  icon: ClipboardCheck,
                },
              ].map(({ label, value, note, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-sm font-medium text-slate-600">
                      {label}
                    </dt>
                    <Icon
                      size={20}
                      className="shrink-0 text-slate-500"
                      aria-hidden="true"
                    />
                  </div>
                  <dd className="mt-4 break-words text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                    {value}
                  </dd>
                  <dd className="mt-2 text-sm text-slate-600">{note}</dd>
                </div>
              ))}
            </dl>
            <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 id="payment-chart-title" className="text-xl font-bold">
                      Pembayaran per periode
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      Nominal menurut bulan tagihan, bukan tanggal uang
                      diterima.
                    </p>
                  </div>
                  <Link href="/admin/payments" className="overview-text-link">
                    Lihat pembayaran
                  </Link>
                </div>
                <ul className="my-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                  {paymentSeries.map((series) => (
                    <li key={series.key} className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: series.color }}
                      />
                      {series.key}
                    </li>
                  ))}
                </ul>
                {periods.length ? (
                  <>
                    <figure aria-labelledby="payment-chart-title">
                      <div className="h-72 min-w-0 sm:h-80" aria-hidden="true">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={paymentPages.pageItems}
                            margin={{ top: 12, right: 4, bottom: 4, left: 0 }}
                            barGap={3}
                          >
                            <CartesianGrid
                              strokeDasharray="3 5"
                              vertical={false}
                              stroke="#e2e8f0"
                            />
                            <XAxis
                              dataKey="label"
                              tick={{ fill: "#475569", fontSize: 12 }}
                              tickLine={false}
                              axisLine={false}
                              minTickGap={24}
                            />
                            <YAxis
                              tickFormatter={(value: number) =>
                                compact.format(value)
                              }
                              width={58}
                              tick={{ fill: "#475569", fontSize: 12 }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip
                              formatter={(value: number) =>
                                currency.format(value)
                              }
                              cursor={{ fill: "#f1f5f9" }}
                              contentStyle={{
                                borderRadius: 12,
                                borderColor: "#e2e8f0",
                              }}
                            />
                            {paymentSeries.map((series) => (
                              <Bar
                                key={series.key}
                                dataKey={series.key}
                                fill={series.color}
                                radius={[5, 5, 0, 0]}
                                maxBarSize={40}
                                isAnimationActive={false}
                              />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <figcaption className="mt-3 text-xs leading-relaxed text-slate-600">
                        Periode {paymentPages.from}–{paymentPages.to} dari{" "}
                        {periods.length} periode tercatat. Nilai lengkap
                        tersedia pada tabel data grafik.
                      </figcaption>
                    </figure>
                    <details className="mt-4 border-t border-slate-100 pt-3">
                      <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold text-[#264775]">
                        Lihat data grafik pembayaran
                      </summary>
                      <div
                        className="overview-table-scroll"
                        tabIndex={0}
                        role="region"
                        aria-label="Data pembayaran per periode"
                      >
                        <table className="overview-table">
                          <caption className="sr-only">
                            Nominal pembayaran per bulan tagihan
                          </caption>
                          <thead>
                            <tr>
                              <th scope="col">Periode</th>
                              {paymentSeries.map((series) => (
                                <th scope="col" key={series.key}>
                                  {series.key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {paymentPages.pageItems.map((period) => (
                              <tr key={period.label}>
                                <th scope="row">{period.label}</th>
                                {paymentSeries.map((series) => (
                                  <td
                                    key={series.key}
                                    className="whitespace-nowrap"
                                  >
                                    {currency.format(period[series.key])}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </details>
                    <Pagination
                      pagination={paymentPages}
                      label="periode pembayaran"
                    />
                  </>
                ) : (
                  <p className="py-16 text-slate-600">
                    Belum ada pembayaran tercatat. Catat pembayaran untuk
                    melihat grafik per periode.
                  </p>
                )}
              </section>
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 id="student-chart-title" className="text-xl font-bold">
                      Status siswa
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Komposisi akun siswa yang terdaftar.
                    </p>
                  </div>
                  <Link href="/admin/students" className="overview-text-link">
                    Lihat siswa
                  </Link>
                </div>
                {students.length ? (
                  <>
                    <figure
                      aria-labelledby="student-chart-title"
                      className="relative mx-auto mt-3 h-56 max-w-xs"
                    >
                      <div aria-hidden="true" className="h-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={composition.filter(
                                (item) => item.count > 0,
                              )}
                              dataKey="count"
                              nameKey="label"
                              innerRadius="66%"
                              outerRadius="88%"
                              paddingAngle={3}
                              stroke="#fff"
                              strokeWidth={3}
                              isAnimationActive={false}
                            >
                              {composition
                                .filter((item) => item.count > 0)
                                .map((item) => (
                                  <Cell key={item.label} fill={item.color} />
                                ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <figcaption className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold tabular-nums">
                          {students.length}
                        </span>
                        <span className="mt-1 text-sm text-slate-600">
                          siswa terdaftar
                        </span>
                      </figcaption>
                    </figure>
                    <table className="w-full text-sm">
                      <caption className="sr-only">
                        Jumlah siswa menurut status akun
                      </caption>
                      <thead className="sr-only">
                        <tr>
                          <th scope="col">Status</th>
                          <th scope="col">Jumlah siswa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {composition.map((item) => (
                          <tr
                            key={item.label}
                            className="border-b border-slate-100 last:border-0"
                          >
                            <th
                              scope="row"
                              className="py-2.5 text-left font-medium text-slate-600"
                            >
                              <span
                                className="mr-2 inline-block h-2.5 w-2.5 rounded-sm"
                                style={{ backgroundColor: item.color }}
                                aria-hidden="true"
                              />
                              {item.label}
                            </th>
                            <td className="py-2.5 text-right font-semibold tabular-nums">
                              {item.count}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <p className="py-16 text-slate-600">
                    Belum ada siswa terdaftar. Buka menu Siswa untuk memeriksa
                    data.
                  </p>
                )}
              </section>
            </div>
            <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">Keterisian kelas</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Kelas mana yang masih bisa menerima siswa?
                    </p>
                  </div>
                  <Link href="/admin/classes" className="overview-text-link">
                    Kelola kelas
                  </Link>
                </div>
                <div className="mt-6 space-y-6">
                  {capacity.pageItems.map((batch) => {
                    const percent =
                      batch.maxCapacity > 0
                        ? Math.round(
                            (batch.currentStudents / batch.maxCapacity) * 100,
                          )
                        : null;
                    const full = percent !== null && percent >= 100;
                    return (
                      <div key={batch.id}>
                        <div className="mb-2 flex flex-wrap justify-between gap-2 text-sm">
                          <h3 className="min-w-0 font-semibold">
                            {batch.name}
                          </h3>
                          <span className="shrink-0 tabular-nums text-slate-600">
                            {batch.currentStudents} / {batch.maxCapacity} kursi
                          </span>
                        </div>
                        <div
                          className="h-3 overflow-hidden rounded-full bg-slate-100"
                          aria-hidden="true"
                        >
                          <div
                            className={`h-full rounded-full ${full ? "bg-rose-700" : "bg-[#264775]"}`}
                            style={{
                              width: `${Math.max(0, Math.min(100, percent ?? 0))}%`,
                            }}
                          />
                        </div>
                        <p
                          className={`mt-2 text-xs ${full ? "font-semibold text-rose-700" : "text-slate-600"}`}
                        >
                          {percent === null
                            ? "Kuota belum diatur"
                            : full
                              ? `Penuh · ${percent}% terisi`
                              : `${percent}% terisi · ${Math.max(0, batch.maxCapacity - batch.currentStudents)} kursi tersedia`}
                        </p>
                      </div>
                    );
                  })}
                  {!batches.length && (
                    <p className="py-6 text-slate-600">
                      Belum ada kelas tercatat. Buka Kelola kelas untuk
                      memeriksa data.
                    </p>
                  )}
                </div>
                {batches.length > 0 && (
                  <Pagination pagination={capacity} label="kapasitas kelas" />
                )}
              </section>
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
                <h2 className="text-xl font-bold">Perlu ditindaklanjuti</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Lanjutkan ke catatan yang membutuhkan pemeriksaan.
                </p>
                <div className="mt-6 divide-y divide-slate-100">
                  {[
                    {
                      href: "/admin/payments",
                      count: overdue.length,
                      title: "Pembayaran jatuh tempo",
                      note: currency.format(
                        overdue.reduce(
                          (sum, item) =>
                            sum + Math.max(0, Number(item.amount) || 0),
                          0,
                        ),
                      ),
                    },
                    {
                      href: "/tentor/grading",
                      count: pendingEssays,
                      title: "Esai menunggu koreksi",
                      note: "Buka antrean penilaian",
                    },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-center gap-4 rounded-xl py-5 hover:bg-slate-50"
                    >
                      <span className="flex h-12 min-w-12 items-center justify-center rounded-xl bg-slate-100 text-xl font-bold tabular-nums text-[#264775]">
                        {item.count}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-sm text-slate-600">
                          {item.note}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={20}
                        aria-hidden="true"
                        className="shrink-0 text-slate-500"
                      />
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
