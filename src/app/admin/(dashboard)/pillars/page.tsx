import { AdminShell } from "@/components/admin/AdminShell";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { SectionSettingsForm } from "@/components/admin/SectionSettingsForm";
import { Collapsible } from "@/components/admin/ui/Collapsible";
import { COLLECTIONS } from "@/lib/collections";
import { getSiteData } from "@/lib/content-store";
import { PILLARS_HEADER } from "@/lib/section-schemas";

export const dynamic = "force-dynamic";

export default async function AdminPillarsPage() {
  const { content, pillars } = await getSiteData();

  return (
    <AdminShell
      title="Pillars"
      description="The core capability cards. Drag to reorder, publish or save drafts."
      breadcrumbs={[{ label: "Content" }, { label: "Pillars" }]}
    >
      <div className="space-y-5">
        <Collapsible title="Section heading" description="Edit the label, title and subtitle shown above the pillars.">
          <SectionSettingsForm inline groups={PILLARS_HEADER} initialContent={content} />
        </Collapsible>
        <CollectionManager config={COLLECTIONS.pillars} initialItems={pillars} />
      </div>
    </AdminShell>
  );
}
