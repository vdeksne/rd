import type { ReactNode } from "react";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 text-black antialiased [&_input]:font-light [&_input]:text-neutral-600 [&_input]:placeholder:text-neutral-400 [&_textarea]:font-light [&_textarea]:text-neutral-600 [&_textarea]:placeholder:text-neutral-400">
      {children}
    </div>
  );
}
