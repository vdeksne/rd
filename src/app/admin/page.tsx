import { AdminDashboard } from "./admin-dashboard";
import { loadSiteOverrides } from "@/lib/site-content";
import { getSiteEditorDefaults } from "@/lib/site-editor-defaults";

export const metadata = { title: "Admin — Raivis Deutschman", robots: "noindex" };

export default function AdminHomePage() {
  const overrides = loadSiteOverrides();
  const defaults = getSiteEditorDefaults();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <AdminDashboard
        key={JSON.stringify(overrides)}
        initial={{ overrides, defaults }}
      />
    </div>
  );
}
