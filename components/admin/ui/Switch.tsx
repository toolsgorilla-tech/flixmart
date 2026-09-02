"use client";

import { cn } from "@/lib/utils";

export function Switch({
  checked,
  onChange,
  disabled,
  label
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D14]",
        checked ? "bg-red-600" : "bg-white/15"
      )}
      aria-label={label}
    >
      <span
        className={cn(
          "inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform duration-200",
          checked ? "translate-x-[22px]" : "translate-x-1"
        )}
      />
    </button>
  );
}
