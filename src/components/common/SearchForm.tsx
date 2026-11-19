"use client";

import { useId } from "react";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchForm({
  label,
  placeholder,
  value,
  onChange,
  onSearch,
  className = "",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  className?: string;
}) {
  const id = useId();
  const pathname = usePathname();

  return (
    <search aria-label={label} className={`block w-full min-w-0 ${className}`}>
      <form
        method="get"
        action={pathname}
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
        className="eu-search-field flex min-w-0 items-center gap-2 rounded-xl border border-slate-500 bg-white p-1 pl-3"
      >
        <Search
          size={18}
          aria-hidden="true"
          className="shrink-0 text-slate-500"
        />
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <input
          id={id}
          name="q"
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-h-11 w-full min-w-0 flex-1 bg-transparent py-2 text-base text-slate-900 placeholder:text-slate-500"
        />
        <button
          type="submit"
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg bg-[#244676] px-3 text-sm font-semibold text-white hover:bg-[#19365F] active:bg-[#122C50]"
        >
          Cari
        </button>
      </form>
    </search>
  );
}
