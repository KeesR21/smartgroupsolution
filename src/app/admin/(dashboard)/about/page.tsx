import { AdminShell } from "@/components/admin/AdminShell";
import { SectionSettingsForm } from "@/components/admin/SectionSettingsForm";
import { getSiteData } from "@/lib/content-store";
import { ABOUT_GROUPS } from "@/lib/section-schemas";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const { content } = await getSiteData();

  return (
    <AdminShell
      title="About"
      description="Heading, description, company story, highlights, mission and vision"
      breadcrumbs={[{ label: "Content" }, { label: "About" }]}
    >
      <SectionSettingsForm groups={ABOUT_GROUPS} initialContent={content} previewHref="/#about" />
    </AdminShell>
  );
}
