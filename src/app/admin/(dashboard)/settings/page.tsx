import { getServerSession } from "next-auth";
import { KeyRound, Mail, ShieldCheck, Database } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { GlassPanel } from "@/components/admin/GlassPanel";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <AdminShell
      title="Settings"
      description="Account and system information"
      breadcrumbs={[{ label: "System" }, { label: "Settings" }]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassPanel title="Account" description="You are signed in as an administrator.">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-blue/15 text-neon-cyan">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Email</p>
                <p className="font-medium">{session?.user?.email ?? "admin"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-purple/15 text-neon-purple">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Name</p>
                <p className="font-medium">{session?.user?.name ?? "Administrator"}</p>
              </div>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel title="Credentials" description="How to change your admin login.">
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-neon-cyan" />
            <div className="space-y-2 text-sm text-[var(--text-muted)]">
              <p>
                Login credentials are managed through environment variables — no database required.
              </p>
              <p>
                Set <code className="text-neon-cyan">ADMIN_EMAIL</code> and{" "}
                <code className="text-neon-cyan">ADMIN_PASSWORD</code> (or{" "}
                <code className="text-neon-cyan">ADMIN_PASSWORD_HASH</code> for a bcrypt hash) in
                your <code className="text-neon-cyan">.env</code> file, then restart the server.
              </p>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel
          title="Content storage"
          description="Where your website content lives."
          className="lg:col-span-2"
        >
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <Database className="mt-0.5 h-5 w-5 shrink-0 text-neon-cyan" />
            <div className="space-y-2 text-sm text-[var(--text-muted)]">
              <p>
                All content is stored in a JSON file on the server (default{" "}
                <code className="text-neon-cyan">data/content.json</code>). There is no external
                database to configure or maintain.
              </p>
              <p>
                Every change you publish in this dashboard is written to that file and served
                immediately on the public website.
              </p>
            </div>
          </div>
        </GlassPanel>
      </div>
    </AdminShell>
  );
}
