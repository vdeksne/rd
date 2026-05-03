"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useId, useRef, useState } from "react";

type Props = {
  id?: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  /** Hint under the URL field */
  hint?: string;
  showPreview?: boolean;
};

export function AdminImageUrlField({
  id: idProp,
  label,
  value,
  onChange,
  hint,
  showPreview = true,
}: Props) {
  const autoId = useId();
  const id = idProp ?? `img-url-${autoId}`;
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const pickFile = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const onFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;

      setUploadError(null);
      setUploading(true);
      try {
        const body = new FormData();
        body.set("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body,
        });
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          url?: string;
        };
        if (!res.ok) {
          throw new Error(
            typeof data.error === "string" ? data.error : `Upload failed (${res.status})`,
          );
        }
        if (
          typeof data.url !== "string" ||
          (!data.url.startsWith("/") && !data.url.startsWith("https://"))
        ) {
          throw new Error("Invalid upload response");
        }
        onChange(data.url);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <Input
          id={id}
          className="min-w-0 flex-1 font-mono text-xs"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/… or https://…"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => void onFile(e)}
        />
        <Button
          type="button"
          variant="outline"
          size="default"
          className="shrink-0 sm:w-[7.5rem]"
          disabled={uploading}
          onClick={pickFile}
        >
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      </div>
      {hint ? <p className="text-[11px] text-neutral-500">{hint}</p> : null}
      {uploadError ? (
        <p className="text-xs text-red-600">{uploadError}</p>
      ) : null}
      {showPreview && value.trim() ? (
        <div className="mt-2 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin preview; arbitrary URLs */}
          <img
            src={value}
            alt=""
            className="mx-auto max-h-40 w-auto max-w-full object-contain"
          />
        </div>
      ) : null}
    </div>
  );
}
