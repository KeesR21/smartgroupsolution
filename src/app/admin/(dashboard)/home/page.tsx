import { AdminShell } from "@/components/admin/AdminShell";
import { SectionSettingsForm } from "@/components/admin/SectionSettingsForm";
import { getSiteData } from "@/lib/content-store";
import { HOME_GROUPS } from "@/lib/section-schemas";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const { content } = await getSiteData();

  return (
    <AdminShell
      title="Home"
      description="Hero, call-to-action buttons, background and featured statistics"
      breadcrumbs={[{ label: "Content" }, { label: "Home" }]}
    >
      <SectionSettingsForm groups={HOME_GROUPS} initialContent={content} previewHref="/#home" />
    </AdminShell>
  );
}
