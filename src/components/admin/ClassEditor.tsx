"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { ClassBatch, ClassMeeting } from "@/types";
import {
  CLASS_DAYS,
  CLASS_PROGRAMS,
  ClassInput,
  readMeetings,
} from "@/lib/classManagement";

const field =
  "min-h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2 text-base text-slate-900";
const emptyMeeting = (): ClassMeeting => ({ day: 1, start: "", end: "" });

export default function ClassEditor({
  batch,
  onClose,
  onSaved,
}: {
  batch: ClassBatch | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { batches, saveBatch } = useApp();
  const dialog = useRef<HTMLDialogElement>(null);
  const prefix = useId();
  const [draft, setDraft] = useState<ClassInput>(() => ({
    name: batch?.name ?? "",
    program: batch?.program ?? CLASS_PROGRAMS[0],
    room: batch?.room ?? "",
    tutorName: batch?.tutorName ?? "",
    maxCapacity: batch?.maxCapacity ?? 30,
    status: batch?.status ?? "upcoming",
    schedule: batch?.schedule ?? "",
    meetings: batch ? readMeetings(batch) : [emptyMeeting()],
  }));
  const [error, setError] = useState("");
  useEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
    return () => element?.close();
  }, []);
  const change = <K extends keyof ClassInput>(key: K, value: ClassInput[K]) => {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setError("");
  };
  const updateMeeting = (index: number, patch: Partial<ClassMeeting>) =>
    change(
      "meetings",
      draft.meetings?.map((meeting, position) =>
        position === index ? { ...meeting, ...patch } : meeting,
      ),
    );

  return (
    <dialog
      ref={dialog}
      aria-labelledby={`${prefix}-title`}
      onClose={onClose}
      className="class-editor m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-xl sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id={`${prefix}-title`} className="text-xl font-bold">
            {batch ? "Ubah kelas & jadwal" : "Tambah kelas"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Atur ruang, tentor, dan sesi belajar mingguan. Jam menggunakan WIB.
          </p>
        </div>
        <button
          type="button"
          aria-label="Tutup formulir kelas"
          onClick={() => dialog.current?.close()}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl hover:bg-slate-100"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>
      <form
        className="mt-6 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          const message = saveBatch(draft, batch?.id);
          if (message) {
            setError(message);
            return;
          }
          onSaved();
          dialog.current?.close();
        }}
      >
        <div>
          <label
            htmlFor={`${prefix}-name`}
            className="mb-2 block text-sm font-semibold"
          >
            Nama kelas
          </label>
          <input
            autoFocus
            id={`${prefix}-name`}
            required
            maxLength={160}
            value={draft.name}
            onChange={(event) => change("name", event.target.value)}
            className={field}
          />
        </div>
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`${prefix}-program`}
              className="mb-2 block text-sm font-semibold"
            >
              Program
            </label>
            <select
              id={`${prefix}-program`}
              className={field}
              value={draft.program}
              onChange={(event) =>
                change("program", event.target.value as ClassBatch["program"])
              }
            >
              {CLASS_PROGRAMS.map((program) => (
                <option key={program}>{program}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor={`${prefix}-status`}
              className="mb-2 block text-sm font-semibold"
            >
              Status kelas
            </label>
            <select
              id={`${prefix}-status`}
              className={field}
              value={draft.status}
              onChange={(event) =>
                change("status", event.target.value as ClassBatch["status"])
              }
            >
              <option value="upcoming">Akan dimulai</option>
              <option value="active">Aktif</option>
              <option value="completed">Selesai</option>
            </select>
          </div>
          <div>
            <label
              htmlFor={`${prefix}-room`}
              className="mb-2 block text-sm font-semibold"
            >
              Ruang / lokasi belajar
            </label>
            <input
              id={`${prefix}-room`}
              required
              maxLength={160}
              list={`${prefix}-rooms`}
              value={draft.room}
              onChange={(event) => change("room", event.target.value)}
              className={field}
            />
            <datalist id={`${prefix}-rooms`}>
              {[...new Set(batches.map((item) => item.room))].map((room) => (
                <option key={room} value={room} />
              ))}
            </datalist>
            <p className="mt-2 text-xs text-slate-600">
              Pilih ruang yang ada atau ketik nama ruang baru.
            </p>
          </div>
          <div>
            <label
              htmlFor={`${prefix}-tutor`}
              className="mb-2 block text-sm font-semibold"
            >
              Tentor pengampu
            </label>
            <input
              id={`${prefix}-tutor`}
              required
              maxLength={160}
              list={`${prefix}-tutors`}
              value={draft.tutorName}
              onChange={(event) => change("tutorName", event.target.value)}
              className={field}
            />
            <datalist id={`${prefix}-tutors`}>
              {[...new Set(batches.map((item) => item.tutorName))].map(
                (tutor) => (
                  <option key={tutor} value={tutor} />
                ),
              )}
            </datalist>
            <p className="mt-2 text-xs text-slate-600">
              Nama pengampu untuk kelas ini; tidak membuat akun login.
            </p>
          </div>
        </div>
        <div>
          <label
            htmlFor={`${prefix}-capacity`}
            className="mb-2 block text-sm font-semibold"
          >
            Kuota siswa
          </label>
          <input
            id={`${prefix}-capacity`}
            type="number"
            inputMode="numeric"
            min={Math.max(1, batch?.currentStudents ?? 0)}
            max={10000}
            step={1}
            required
            value={Number.isNaN(draft.maxCapacity) ? "" : draft.maxCapacity}
            onChange={(event) =>
              change("maxCapacity", event.target.valueAsNumber)
            }
            className={`${field} sm:max-w-48`}
          />
          <p className="mt-2 text-xs text-slate-600">
            {batch
              ? `${batch.currentStudents} siswa sudah terdaftar. Kuota tidak boleh lebih kecil dari jumlah tersebut.`
              : "Kelas baru dimulai dengan 0 siswa terdaftar."}
          </p>
        </div>
        <fieldset className="min-w-0 border-t border-slate-200 pt-4">
          <legend className="pr-3 text-base font-bold">Jadwal mingguan</legend>
          <p className="mb-4 text-sm leading-relaxed text-slate-600">
            Tambahkan satu sesi untuk setiap hari atau waktu belajar. Ruang dan
            tentor mengikuti pengaturan kelas di atas.
          </p>
          {!draft.meetings?.length && batch?.schedule && (
            <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
              Jadwal lama: {batch.schedule}. Susun sesi di bawah sebelum
              menyimpan perubahan.
            </p>
          )}
          <div className="space-y-3">
            {draft.meetings?.map((meeting, index) => (
              <fieldset
                key={index}
                className="min-w-0 rounded-xl border border-slate-200 p-3"
              >
                <legend className="px-1 text-xs font-semibold text-slate-600">
                  Sesi {index + 1}
                </legend>
                <div className="grid min-w-0 grid-cols-2 items-end gap-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor={`${prefix}-day-${index}`}
                      className="mb-1.5 block text-sm"
                    >
                      Hari
                    </label>
                    <select
                      id={`${prefix}-day-${index}`}
                      className={field}
                      value={meeting.day}
                      onChange={(event) =>
                        updateMeeting(index, {
                          day: Number(event.target.value),
                        })
                      }
                    >
                      {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                        <option key={day} value={day}>
                          {CLASS_DAYS[day]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor={`${prefix}-start-${index}`}
                      className="mb-1.5 block text-sm"
                    >
                      Mulai
                    </label>
                    <input
                      id={`${prefix}-start-${index}`}
                      type="time"
                      required
                      className={field}
                      value={meeting.start}
                      onChange={(event) =>
                        updateMeeting(index, { start: event.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`${prefix}-end-${index}`}
                      className="mb-1.5 block text-sm"
                    >
                      Selesai
                    </label>
                    <input
                      id={`${prefix}-end-${index}`}
                      type="time"
                      required
                      className={field}
                      value={meeting.end}
                      onChange={(event) =>
                        updateMeeting(index, { end: event.target.value })
                      }
                    />
                  </div>
                  <button
                    type="button"
                    aria-label={`Hapus sesi ${index + 1}`}
                    className="eu-button-danger-icon justify-self-end col-span-2 sm:col-span-1"
                    onClick={() =>
                      change(
                        "meetings",
                        draft.meetings?.filter(
                          (_, position) => position !== index,
                        ),
                      )
                    }
                  >
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </div>
              </fieldset>
            ))}
          </div>
          <button
            type="button"
            disabled={(draft.meetings?.length ?? 0) >= 21}
            onClick={() =>
              change("meetings", [...(draft.meetings ?? []), emptyMeeting()])
            }
            className="eu-button-secondary mt-4 disabled:opacity-50"
          >
            <Plus size={17} aria-hidden="true" />
            Tambah sesi
          </button>
        </fieldset>
        <p role="alert" className="text-sm leading-relaxed text-rose-700">
          {error}
        </p>
        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            className="eu-button-secondary"
            onClick={() => dialog.current?.close()}
          >
            Batal
          </button>
          <button type="submit" className="eu-button-primary">
            {batch ? "Simpan perubahan" : "Simpan kelas"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
