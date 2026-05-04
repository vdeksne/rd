"use client";

import { Input } from "@/components/Ui/Input";
import { flushSync } from "react-dom";
import { useState } from "react";

/** Plain text field so values can be cleared while typing; commits on blur. */
export function AdminSpacingInput({
  id,
  committed,
  onCommit,
  inputMode = "numeric",
}: {
  id: string;
  committed: number;
  onCommit: (n: number) => void;
  inputMode?: "numeric" | "decimal";
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const display =
    draft !== null ? draft : Number.isFinite(committed) ? String(committed) : "";

  return (
    <Input
      id={id}
      type="text"
      autoComplete="off"
      inputMode={inputMode}
      className="h-8 w-17 text-right text-[13px] tabular-nums"
      value={display}
      onChange={(e) => setDraft(e.target.value)}
      onFocus={() =>
        setDraft(Number.isFinite(committed) ? String(committed) : "")
      }
      onBlur={() => {
        if (draft === null) return;
        const raw = draft.trim();
        flushSync(() => {
          setDraft(null);
          if (raw === "") return;
          const n = Number(raw);
          if (!Number.isFinite(n)) return;
          onCommit(n);
        });
      }}
    />
  );
}
