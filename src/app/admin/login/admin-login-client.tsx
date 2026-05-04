"use client";

import { Button } from "@/components/Ui/Button";
import { Input } from "@/components/Ui/Input";
import { Label } from "@/components/Ui/Label";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AdminLoginClient() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") ?? "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Could not sign in");
      }
      router.replace(next.startsWith("/") ? next : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-scope flex min-h-[85vh] flex-col justify-center px-6 py-16">
      <div className="mx-auto w-full max-w-[380px] space-y-10">
        <div className="space-y-2 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
            Raivis Deutschman
          </p>
          <h1 className="text-2xl font-light tracking-tight text-neutral-950">
            Sign in
          </h1>
        </div>

        <form className="space-y-6" onSubmit={(e) => void onSubmit(e)}>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 rounded-lg"
            />
          </div>
          {error ? (
            <p className="text-[13px] text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <Button
            type="submit"
            className="h-11 w-full rounded-lg bg-neutral-900 font-normal text-white shadow-none hover:bg-neutral-800"
            disabled={busy}
          >
            {busy ? "Signing in…" : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
