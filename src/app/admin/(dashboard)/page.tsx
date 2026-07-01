import { AdminShell } from "@/components/admin/AdminShell";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { getDashboardStats } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <AdminShell title="Dashboard" description="Overview of your website content and activity">
      <DashboardOverview stats={stats} />
    </AdminShell>
  );
}
