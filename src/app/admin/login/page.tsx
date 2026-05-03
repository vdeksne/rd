import { Suspense } from "react";
import { AdminLoginClient } from "./admin-login-client";

function LoginFallback() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-8 shadow-inner">
        <p className="type-site-display text-center text-xs font-light tracking-wide text-neutral-500">
          Loading…
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <AdminLoginClient />
    </Suspense>
  );
}
