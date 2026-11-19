"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Check, ChevronDown, Plus } from "lucide-react";

export default function EditableCombobox({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const listId = useId();
  const input = useRef<HTMLInputElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const anchorName = `--combobox-${listId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [active, setActive] = useState(-1);
  const normalized = (text: string) => text.trim().toLocaleLowerCase("id-ID");
  const unique = [
    ...new Map(
      options
        .filter((option) => option.trim())
        .map((option) => [normalized(option), option.trim()]),
    ).values(),
  ];
  const matches = unique.filter(
    (option) => !filtering || normalized(option).includes(normalized(value)),
  );
  const isNew =
    !!value.trim() &&
    !unique.some((option) => normalized(option) === normalized(value));
  const choices = [
    ...matches.map((option) => ({ value: option, isNew: false })),
    ...(isNew ? [{ value: value.trim(), isNew: true }] : []),
  ];
  const activeIndex = active >= 0 && active < choices.length ? active : -1;
  const choose = (selected: string) => {
    onChange(selected);
    setOpen(false);
    setActive(-1);
    setFiltering(false);
    input.current?.focus();
  };
  useLayoutEffect(() => {
    if (!open) return;
    const element = popup.current;
    if (element && typeof element.showPopover === "function")
      element.showPopover();
    return () => {
      if (element && typeof element.hidePopover === "function")
        element.hidePopover();
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
        setActive(-1);
      }
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);
  useEffect(() => {
    if (open && activeIndex >= 0)
      list.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  return (
    <div
      ref={root}
      style={{ "--combobox-anchor": anchorName } as CSSProperties}
      className="min-w-0"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
          setActive(-1);
          setFiltering(false);
        }
      }}
    >
      <label htmlFor={id} className="mb-1.5 block text-sm">
        {label}
      </label>
      <div className="combobox-anchor flex min-w-0 items-center rounded-xl border border-slate-300 bg-white focus-within:border-[#244676] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#244676]">
        <input
          ref={input}
          id={id}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={
            open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
          }
          autoComplete="off"
          required
          maxLength={160}
          value={value}
          className="min-h-11 w-full min-w-0 flex-1 rounded-l-xl bg-transparent px-3 py-2 text-base text-slate-900 !outline-none !shadow-none"
          onFocus={() => {
            setOpen(true);
            setFiltering(false);
          }}
          onClick={() => setOpen(true)}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
            setFiltering(true);
            setActive(-1);
          }}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing || event.keyCode === 229) return;
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              setActive((previous) =>
                choices.length
                  ? event.key === "ArrowDown"
                    ? (previous + 1) % choices.length
                    : previous <= 0
                      ? choices.length - 1
                      : previous - 1
                  : -1,
              );
            } else if (event.key === "Enter" && open) {
              event.preventDefault();
              if (activeIndex >= 0) choose(choices[activeIndex].value);
              else {
                setOpen(false);
                setActive(-1);
              }
            } else if (event.key === "Escape" && open) {
              event.preventDefault();
              event.stopPropagation();
              setOpen(false);
              setActive(-1);
            } else if (event.key === "Tab") {
              setOpen(false);
              setActive(-1);
            }
          }}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Tampilkan pilihan ${label.toLowerCase()}`}
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-r-xl text-slate-600 hover:bg-slate-50"
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => {
            input.current?.focus();
            setFiltering(false);
            setActive(-1);
            setOpen(!open);
          }}
        >
          <ChevronDown
            size={18}
            aria-hidden="true"
            className={open ? "rotate-180" : ""}
          />
        </button>
      </div>
      {open && (
        <div
          ref={popup}
          popover="manual"
          className="combobox-popup rounded-xl border border-slate-200 bg-white p-1.5 text-slate-900 shadow-lg"
        >
          <p className="px-3 py-2 text-xs text-slate-600">
            {filtering ? "Hasil pencarian" : "Pilihan tersimpan"}
          </p>
          <ul
            ref={list}
            id={listId}
            role="listbox"
            aria-label={`Pilihan ${label.toLowerCase()}`}
            className="max-h-[min(13rem,35dvh)] overflow-y-auto overscroll-contain"
          >
            {choices.map((option, index) => (
              <li
                key={option.isNew ? `new-${option.value}` : option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={normalized(value) === normalized(option.value)}
                className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm leading-relaxed ${activeIndex === index ? "bg-[#244676] text-white" : normalized(value) === normalized(option.value) && !option.isNew ? "bg-slate-100 text-[#244676]" : "text-slate-700 hover:bg-slate-50"}`}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => choose(option.value)}
              >
                {option.isNew && (
                  <Plus size={16} aria-hidden="true" className="shrink-0" />
                )}
                <span className="min-w-0 flex-1 break-words">
                  {option.isNew ? `Gunakan “${option.value}”` : option.value}
                </span>
                {!option.isNew &&
                  normalized(value) === normalized(option.value) && (
                    <Check size={17} aria-hidden="true" className="shrink-0" />
                  )}
              </li>
            ))}
          </ul>
          {!choices.length && (
            <p className="px-3 py-3 text-sm leading-relaxed text-slate-600">
              Belum ada pilihan. Ketik nama untuk menggunakannya.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
