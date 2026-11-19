import type { PaymentRecord, User, UserStatus } from "@/types";

const months = [
  "januari",
  "februari",
  "maret",
  "april",
  "mei",
  "juni",
  "juli",
  "agustus",
  "september",
  "oktober",
  "november",
  "desember",
];

export function paymentPeriods(payments: PaymentRecord[]) {
  const groups = new Map<
    string,
    {
      label: string;
      order: number;
      Lunas: number;
      Menunggu: number;
      "Jatuh Tempo": number;
    }
  >();
  for (const payment of payments) {
    const raw = payment.month.trim();
    const match = /^(\S+)\s+(\d{4})$/.exec(raw.toLowerCase());
    const month = match ? months.indexOf(match[1]) : -1;
    const known = match && month >= 0;
    const key = known
      ? `${match[2]}-${month}`
      : raw.toLowerCase() || "tanpa periode";
    if (!groups.has(key))
      groups.set(key, {
        label: known
          ? `${months[month][0].toUpperCase()}${months[month].slice(1)} ${match[2]}`
          : raw || "Tanpa periode",
        order: known ? Number(match[2]) * 12 + month : Infinity,
        Lunas: 0,
        Menunggu: 0,
        "Jatuh Tempo": 0,
      });
    const amount = Number(payment.amount);
    if (Number.isFinite(amount) && amount > 0)
      groups.get(key)![payment.status] += amount;
  }
  return [...groups.values()].sort(
    (a, b) => a.order - b.order || a.label.localeCompare(b.label, "id"),
  );
}

export function studentComposition(students: User[]) {
  const statuses: { status: UserStatus; label: string; color: string }[] = [
    { status: "active", label: "Aktif", color: "#264775" },
    { status: "nonactive", label: "Nonaktif", color: "#64748b" },
    { status: "suspended", label: "Akses dibatasi", color: "#be123c" },
    { status: "graduated", label: "Lulus", color: "#047857" },
    { status: "leave", label: "Cuti", color: "#a16207" },
  ];
  return statuses.map((item) => ({
    ...item,
    count: students.filter((student) => student.status === item.status).length,
  }));
}
