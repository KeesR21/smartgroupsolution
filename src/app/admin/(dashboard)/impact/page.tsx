import { AdminShell } from "@/components/admin/AdminShell";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { SectionSettingsForm } from "@/components/admin/SectionSettingsForm";
import { Collapsible } from "@/components/admin/ui/Collapsible";
import { COLLECTIONS } from "@/lib/collections";
import { getSiteData } from "@/lib/content-store";
import { IMPACT_GROUPS } from "@/lib/section-schemas";

export const dynamic = "force-dynamic";

function GroupTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-2 text-sm font-semibold uppercase tracking-widest text-neon-cyan">
      {children}
    </h2>
  );
}

export default async function AdminImpactPage() {
  const { content, marketStats, riskItems, successStories } = await getSiteData();

  return (
    <AdminShell
      title="Impact"
      description="Statistics, opportunity & risk messaging, cost-of-inaction items and success stories."
      breadcrumbs={[{ label: "Content" }, { label: "Impact" }]}
    >
      <div className="space-y-6">
        <Collapsible
          title="Headings & messaging"
          description="Section titles, the opportunity/risk copy and the leadership message."
        >
          <SectionSettingsForm inline groups={IMPACT_GROUPS} initialContent={content} />
        </Collapsible>

        <div className="space-y-3">
          <GroupTitle>Statistics</GroupTitle>
          <CollectionManager config={COLLECTIONS.marketStats} initialItems={marketStats} />
        </div>

        <div className="space-y-3">
          <GroupTitle>Cost of inaction</GroupTitle>
          <CollectionManager config={COLLECTIONS.riskItems} initialItems={riskItems} />
        </div>

        <div className="space-y-3">
          <GroupTitle>Success stories</GroupTitle>
          <CollectionManager config={COLLECTIONS.successStories} initialItems={successStories} />
        </div>
      </div>
    </AdminShell>
  );
}
