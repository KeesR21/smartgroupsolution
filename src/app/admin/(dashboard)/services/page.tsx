import { AdminShell } from "@/components/admin/AdminShell";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { SectionSettingsForm } from "@/components/admin/SectionSettingsForm";
import { Collapsible } from "@/components/admin/ui/Collapsible";
import { COLLECTIONS } from "@/lib/collections";
import { getSiteData } from "@/lib/content-store";
import { SERVICES_HEADER } from "@/lib/section-schemas";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const { content, services } = await getSiteData();

  return (
    <AdminShell
      title="Services"
      description="Manage the service catalog with icons, features and call-to-action links."
      breadcrumbs={[{ label: "Content" }, { label: "Services" }]}
    >
      <div className="space-y-5">
        <Collapsible title="Section heading" description="Edit the label, title and subtitle shown above the services.">
          <SectionSettingsForm inline groups={SERVICES_HEADER} initialContent={content} />
        </Collapsible>
        <CollectionManager config={COLLECTIONS.services} initialItems={services} />
      </div>
    </AdminShell>
  );
}
