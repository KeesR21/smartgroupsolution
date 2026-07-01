"use client";

import { useMemo, useState } from "react";
import { Inbox, Mail, MailOpen, Trash2 } from "lucide-react";
import { useNotifications } from "@/components/providers/NotificationProvider";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";
import { AdminButton } from "@/components/admin/ui/Button";
import { EmptyState, SearchInput, inputClass } from "@/components/admin/ui/Primitives";
import { GlassPanel } from "./GlassPanel";
import { cn } from "@/lib/utils";
import type { MessageRecord } from "@/types/cms";

type Filter = "all" | "unread";

export function MessagesManager({ initialMessages }: { initialMessages: MessageRecord[] }) {
  const { notify } = useNotifications();
  const confirm = useConfirm();

  const [messages, setMessages] = useState(
    initialMessages.map((m) => ({
      ...m,
      createdAt: typeof m.createdAt === "string" ? m.createdAt : String(m.createdAt),
    }))
  );
  const [selected, setSelected] = useState<MessageRecord | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter((m) => {
      if (filter === "unread" && m.read) return false;
      if (!q) return true;
      return [m.name, m.email, m.subject, m.message]
        .some((f) => String(f ?? "").toLowerCase().includes(q));
    });
  }, [messages, query, filter]);

  const unreadCount = messages.filter((m) => !m.read).length;

  const toggleRead = async (id: string, read: boolean) => {
    setMessages((msgs) => msgs.map((m) => (m.id === id ? { ...m, read } : m)));
    if (selected?.id === id) setSelected((s) => (s ? { ...s, read } : null));
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ read }),
      });
      if (!res.ok) throw new Error();
    } catch {
      notify({ type: "error", title: "Failed to update message" });
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete message?",
      message: "This message will be permanently removed.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setMessages((msgs) => msgs.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      notify({ type: "success", title: "Message deleted" });
    } catch {
      notify({ type: "error", title: "Failed to delete message" });
    }
  };

  const markAllRead = async () => {
    const ids = messages.filter((m) => !m.read).map((m) => m.id);
    if (ids.length === 0) return;
    setMessages((msgs) => msgs.map((m) => ({ ...m, read: true })));
    try {
      const res = await fetch(`/api/messages/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "read", ids }),
      });
      if (!res.ok) throw new Error();
      notify({ type: "success", title: "All marked as read" });
    } catch {
      notify({ type: "error", title: "Bulk update failed" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search messages..."
            className="sm:max-w-xs sm:flex-1"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
            className={cn(inputClass, "sm:w-40")}
            aria-label="Filter messages"
          >
            <option value="all">All ({messages.length})</option>
            <option value="unread">Unread ({unreadCount})</option>
          </select>
        </div>
        <AdminButton variant="secondary" icon={MailOpen} onClick={markAllRead} disabled={unreadCount === 0}>
          Mark all read
        </AdminButton>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-6 w-6" />}
          title="No messages yet"
          message="Submissions from the public contact form will appear here."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <GlassPanel className="lg:col-span-2" title="Inbox">
            <div className="max-h-[600px] space-y-2 overflow-y-auto">
              {filtered.length === 0 && (
                <p className="py-8 text-center text-sm text-[var(--text-muted)]">No matches.</p>
              )}
              {filtered.map((msg) => (
                <button
                  key={msg.id}
                  type="button"
                  onClick={() => {
                    setSelected(msg);
                    if (!msg.read) toggleRead(msg.id, true);
                  }}
                  className={cn(
                    "w-full rounded-xl p-4 text-left transition-colors",
                    selected?.id === msg.id
                      ? "bg-neon-blue/15 ring-1 ring-neon-cyan/30"
                      : "hover:bg-white/5",
                    !msg.read && "border-l-2 border-neon-cyan"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("truncate text-sm", msg.read ? "text-[var(--text-muted)]" : "font-semibold text-white")}>
                      {msg.name}
                    </p>
                    {!msg.read && (
                      <span className="shrink-0 rounded-full bg-neon-cyan/20 px-2 py-0.5 text-[10px] text-neon-cyan">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-xs text-[var(--text-muted)]">{msg.subject}</p>
                  <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="lg:col-span-3" title="Message detail">
            {selected ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold">{selected.subject}</h3>
                    <p className="text-sm text-neon-cyan">{selected.name}</p>
                    <a href={`mailto:${selected.email}`} className="text-sm text-[var(--text-muted)] hover:text-white">
                      {selected.email}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <AdminButton
                      variant="secondary"
                      icon={selected.read ? Mail : MailOpen}
                      onClick={() => toggleRead(selected.id, !selected.read)}
                    >
                      {selected.read ? "Mark Unread" : "Mark Read"}
                    </AdminButton>
                    <AdminButton variant="danger" icon={Trash2} onClick={() => handleDelete(selected.id)}>
                      Delete
                    </AdminButton>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Received {new Date(selected.createdAt).toLocaleString()}
                </p>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-muted)]">
                    {selected.message}
                  </p>
                </div>
              </div>
            ) : (
              <p className="py-16 text-center text-sm text-[var(--text-muted)]">
                Select a message to view details
              </p>
            )}
          </GlassPanel>
        </div>
      )}
    </div>
  );
}
