import { AdminShell } from "@/components/admin/AdminShell";
import { SectionSettingsForm } from "@/components/admin/SectionSettingsForm";
import { getSiteData } from "@/lib/content-store";
import { CONTACT_GROUPS } from "@/lib/section-schemas";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const { content } = await getSiteData();

  return (
    <AdminShell
      title="Contact"
      description="Address, phone, email, business hours, map, social links and form settings"
      breadcrumbs={[{ label: "Content" }, { label: "Contact" }]}
    >
      <SectionSettingsForm groups={CONTACT_GROUPS} initialContent={content} previewHref="/#contact" />
    </AdminShell>
  );
}
