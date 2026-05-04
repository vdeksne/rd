import { AdminDashboard } from "@/components/AdminDashboard/AdminDashboard";
import { loadSiteOverrides } from "@/lib/site-content";
import { getSiteEditorDefaults } from "@/lib/site-editor-defaults";

export const metadata = { title: "Admin · Raivis Deutschman", robots: "noindex" };

export default async function AdminHomePage() {
  const overrides = await loadSiteOverrides();
  const defaults = getSiteEditorDefaults();

  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-8 sm:px-8 lg:max-w-7xl lg:px-12 lg:pt-10">
      <AdminDashboard
        key={JSON.stringify(overrides)}
        initial={{ overrides, defaults }}
      />
    </div>
  );
}
