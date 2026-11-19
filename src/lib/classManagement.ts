import type { ClassBatch, ClassMeeting } from "@/types";

export const CLASS_DAYS = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];
export const CLASS_PROGRAMS: ClassBatch["program"][] = [
  "SNBT Super Intensif",
  "Kedokteran Priority",
  "Reguler Weekend",
  "Drilling UTBK 2026",
];
export type ClassInput = Omit<ClassBatch, "id" | "currentStudents">;
const normalize = (value: string) =>
  value.trim().replace(/\s+/g, " ").toLowerCase();

export function readMeetings(
  batch: Pick<ClassBatch, "schedule" | "meetings"> &
    Partial<Pick<ClassBatch, "room" | "tutorName">>,
): ClassMeeting[] {
  if (batch.meetings)
    return batch.meetings.map((meeting) => ({
      ...meeting,
      room: meeting.room ?? batch.room ?? "",
      tutorName: meeting.tutorName ?? batch.tutorName ?? "",
    }));
  const times = [...batch.schedule.matchAll(/\b(\d{2})[.:](\d{2})\b/g)];
  if (times.length !== 2) return [];
  const days = /setiap hari/i.test(batch.schedule)
    ? CLASS_DAYS.map((_, day) => day)
    : CLASS_DAYS.flatMap((label, day) =>
        batch.schedule.toLowerCase().includes(label.toLowerCase()) ? [day] : [],
      );
  return days.map((day) => ({
    day,
    start: `${times[0][1]}:${times[0][2]}`,
    end: `${times[1][1]}:${times[1][2]}`,
    room: batch.room ?? "",
    tutorName: batch.tutorName ?? "",
  }));
}

export function formatMeetings(meetings: ClassMeeting[]) {
  return [...meetings]
    .sort(
      (a, b) =>
        ((a.day + 6) % 7) - ((b.day + 6) % 7) || a.start.localeCompare(b.start),
    )
    .map(
      (meeting) =>
        `${CLASS_DAYS[meeting.day]} ${meeting.start}–${meeting.end} WIB`,
    )
    .join("; ");
}

export function validateClass(
  input: ClassInput,
  batches: ClassBatch[],
  id?: string,
): string | null {
  const current = id ? batches.find((batch) => batch.id === id) : undefined;
  if (id && !current)
    return "Kelas tidak ditemukan. Tutup formulir lalu buka kembali.";
  if ([input.name].some((value) => !value.trim() || value.trim().length > 160))
    return "Isi nama kelas (maksimal 160 karakter).";
  if (
    !CLASS_PROGRAMS.includes(input.program) ||
    !["active", "upcoming", "completed"].includes(input.status)
  )
    return "Pilih program dan status kelas yang tersedia.";
  if (
    !Number.isInteger(input.maxCapacity) ||
    input.maxCapacity < Math.max(1, current?.currentStudents ?? 0) ||
    input.maxCapacity > 10000
  )
    return `Kuota harus bilangan bulat antara ${Math.max(1, current?.currentStudents ?? 0)} dan 10.000 kursi.`;
  if (
    batches.some(
      (batch) =>
        batch.id !== id && normalize(batch.name) === normalize(input.name),
    )
  )
    return "Nama kelas sudah digunakan. Gunakan nama yang berbeda.";
  const meetings = readMeetings(input);
  if (!meetings.length || meetings.length > 21)
    return "Tambahkan 1–21 sesi jadwal mingguan.";
  const time = /^([01]\d|2[0-3]):[0-5]\d$/;
  for (const meeting of meetings) {
    if (
      [meeting.room, meeting.tutorName].some(
        (value) => !value?.trim() || value.trim().length > 160,
      )
    )
      return "Isi ruang dan tentor pada setiap sesi (maksimal 160 karakter).";
    if (
      !Number.isInteger(meeting.day) ||
      meeting.day < 0 ||
      meeting.day > 6 ||
      !time.test(meeting.start) ||
      !time.test(meeting.end) ||
      meeting.start >= meeting.end
    )
      return "Periksa jadwal: hari wajib diisi dan jam selesai harus setelah jam mulai pada hari yang sama.";
  }
  const overlaps = (a: ClassMeeting, b: ClassMeeting) =>
    a.day === b.day && a.start < b.end && b.start < a.end;
  if (
    meetings.some((a, index) =>
      meetings.slice(index + 1).some((b) => overlaps(a, b)),
    )
  )
    return "Ada sesi yang bertumpuk dalam jadwal kelas ini.";
  if (input.status !== "completed") {
    for (const batch of batches) {
      if (batch.id === id || batch.status === "completed") continue;
      for (const a of meetings) {
        for (const b of readMeetings(batch)) {
          if (!overlaps(a, b)) continue;
          const roomConflict =
            normalize(a.room ?? "") === normalize(b.room ?? "");
          const tutorConflict =
            normalize(a.tutorName ?? "") === normalize(b.tutorName ?? "");
          if (roomConflict || tutorConflict)
            return `Jadwal bentrok dengan ${batch.name}: ${roomConflict ? "ruang" : "tentor"} dipakai pada ${CLASS_DAYS[a.day]} ${b.start}–${b.end}.`;
        }
      }
    }
  }
  return null;
}
