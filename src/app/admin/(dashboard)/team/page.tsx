import { AdminShell } from "@/components/admin/AdminShell";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { SectionSettingsForm } from "@/components/admin/SectionSettingsForm";
import { Collapsible } from "@/components/admin/ui/Collapsible";
import { COLLECTIONS } from "@/lib/collections";
import { getSiteData } from "@/lib/content-store";
import { TEAM_HEADER } from "@/lib/section-schemas";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const { content, team } = await getSiteData();

  return (
    <AdminShell
      title="Team"
      description="Add, edit and reorder team members with photos, bios and contact links."
      breadcrumbs={[{ label: "Content" }, { label: "Team" }]}
    >
      <div className="space-y-5">
        <Collapsible title="Section heading" description="Edit the label, title and subtitle shown above the team.">
          <SectionSettingsForm inline groups={TEAM_HEADER} initialContent={content} />
        </Collapsible>
        <CollectionManager config={COLLECTIONS.team} initialItems={team} />
      </div>
    </AdminShell>
  );
}
