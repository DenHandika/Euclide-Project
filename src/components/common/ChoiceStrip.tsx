"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function ChoiceStrip({
  label,
  value,
  children,
  className = "",
}: {
  label: string;
  value: string | number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reveal = () => {
      const strip = ref.current;
      const selected = strip?.querySelector<HTMLElement>(
        '[aria-pressed="true"]',
      );
      if (!strip || !selected) return;
      const bounds = strip.getBoundingClientRect();
      const item = selected.getBoundingClientRect();
      // Scroll only this strip; scrollIntoView could also move the document.
      if (item.left < bounds.left + 4)
        strip.scrollLeft += item.left - bounds.left - 4;
      else if (item.right > bounds.right - 4)
        strip.scrollLeft += item.right - bounds.right + 4;
    };
    reveal();
    window.addEventListener("resize", reveal);
    return () => window.removeEventListener("resize", reveal);
  }, [value]);

  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      className={`eu-choice-strip ${className}`}
    >
      {children}
    </div>
  );
}
