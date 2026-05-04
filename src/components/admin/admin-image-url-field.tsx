"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useCallback, useId, useRef, useState } from "react";

type Props = {
  id?: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  hint?: string;
  showPreview?: boolean;
  previewSize?: "default" | "hero";
  /** Show “Remove” when there is an image (e.g. optional mobile hero). */
  allowClear?: boolean;
};

export function AdminImageUrlField({
  id: idProp,
  label,
  value,
  onChange,
  hint,
  showPreview = true,
  previewSize = "default",
  allowClear = false,
}: Props) {
  const autoId = useId();
  const id = idProp ?? `img-upload-${autoId}`;
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewBroken, setPreviewBroken] = useState(false);

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
            typeof data.error === "string"
              ? data.error
              : `Upload failed (${res.status})`,
          );
        }
        if (
          typeof data.url !== "string" ||
          (!data.url.startsWith("/") && !data.url.startsWith("https://"))
        ) {
          throw new Error("Invalid upload response");
        }
        setPreviewBroken(false);
        onChange(data.url);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  const trimmed = value.trim();
  const showFrame = showPreview && Boolean(trimmed);

  return (
    <div className="space-y-3">
      <Label htmlFor={id}>{label}</Label>

      {showFrame ? (
        <div
          className={cn(
            "relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-black/6",
            previewSize === "hero"
              ? "aspect-1202/801 max-h-[min(420px,52vh)]"
              : "aspect-3/2 max-h-[min(280px,38vh)] sm:max-h-[min(320px,42vh)]",
          )}
        >
          {!previewBroken ? (
            /* eslint-disable-next-line @next/next/no-img-element -- admin preview; arbitrary URLs */
            <img
              src={trimmed}
              alt=""
              className="max-h-full max-w-full object-contain"
              onError={() => setPreviewBroken(true)}
              onLoad={() => setPreviewBroken(false)}
            />
          ) : (
            <p className="max-w-[18rem] px-4 text-center text-[13px] leading-snug text-neutral-500">
              Preview unavailable — try uploading again.
            </p>
          )}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          id={id}
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
          className="rounded-lg border-neutral-200 bg-white text-[13px] font-normal shadow-none hover:bg-neutral-50"
          disabled={uploading}
          onClick={pickFile}
        >
          {uploading ? "Uploading…" : "Upload"}
        </Button>
        {allowClear && trimmed ? (
          <Button
            type="button"
            variant="ghost"
            size="default"
            className="text-[13px] font-normal text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            disabled={uploading}
            onClick={() => {
              setPreviewBroken(false);
              onChange("");
            }}
          >
            Remove
          </Button>
        ) : null}
      </div>
      {hint ? (
        <p className="text-[12px] leading-relaxed text-neutral-500">{hint}</p>
      ) : null}
      {uploadError ? (
        <p className="text-[13px] text-red-600">{uploadError}</p>
      ) : null}
    </div>
  );
}
