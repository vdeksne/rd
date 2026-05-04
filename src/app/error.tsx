"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Recoverable route errors → send visitors home instead of an error screen. */
export default function RouteError() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return null;
}
