import { AdminShell } from "@/components/admin/AdminShell";
import { MessagesManager } from "@/components/admin/MessagesManager";
import { listMessages } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await listMessages();

  return (
    <AdminShell
      title="Messages"
      description="View and manage submissions from the contact form"
      breadcrumbs={[{ label: "Inbox" }, { label: "Messages" }]}
    >
      <MessagesManager initialMessages={messages} />
    </AdminShell>
  );
}
