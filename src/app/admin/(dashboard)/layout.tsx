import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { ConfirmProvider } from "@/components/admin/ui/ConfirmDialog";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return <ConfirmProvider>{children}</ConfirmProvider>;
}
