import { Suspense } from "react";
import { AdminLoginClient } from "./admin-login-client";

function LoginFallback() {
  return (
    <div className="flex min-h-[85vh] flex-col justify-center px-6 py-16">
      <p className="text-center text-[13px] font-normal text-neutral-400">
        Loading…
      </p>
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
