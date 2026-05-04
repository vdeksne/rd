import type { ReactNode } from "react";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={[
        "min-h-screen bg-white text-neutral-950 antialiased",
        "[&_input]:rounded-lg [&_input]:border-neutral-200 [&_input]:bg-neutral-50/80 [&_input]:text-neutral-900",
        "[&_input]:placeholder:text-neutral-400 [&_input]:transition-colors [&_input]:focus-visible:border-neutral-400 [&_input]:focus-visible:bg-white",
        "[&_textarea]:rounded-lg [&_textarea]:border-neutral-200 [&_textarea]:bg-neutral-50/80 [&_textarea]:text-neutral-900",
        "[&_textarea]:placeholder:text-neutral-400 [&_textarea]:transition-colors [&_textarea]:focus-visible:border-neutral-400 [&_textarea]:focus-visible:bg-white",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
