import { AdminShell } from "@/components/admin/AdminShell";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { SectionSettingsForm } from "@/components/admin/SectionSettingsForm";
import { Collapsible } from "@/components/admin/ui/Collapsible";
import { COLLECTIONS } from "@/lib/collections";
import { getSiteData } from "@/lib/content-store";
import { INDUSTRIES_HEADER } from "@/lib/section-schemas";

export const dynamic = "force-dynamic";

export default async function AdminIndustriesPage() {
  const { content, industries } = await getSiteData();

  return (
    <AdminShell
      title="Industries"
      description="Sectors you serve, with featured projects and icons."
      breadcrumbs={[{ label: "Content" }, { label: "Industries" }]}
    >
      <div className="space-y-5">
        <Collapsible title="Section heading" description="Edit the label, title and subtitle shown above the industries.">
          <SectionSettingsForm inline groups={INDUSTRIES_HEADER} initialContent={content} />
        </Collapsible>
        <CollectionManager config={COLLECTIONS.industries} initialItems={industries} />
      </div>
    </AdminShell>
  );
}
