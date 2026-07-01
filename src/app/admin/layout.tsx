import { AdminDarkMode } from "@/components/admin/AdminDarkMode";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "../globals.css";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminDarkMode />
      <div
        data-admin-root
        className="dark min-h-screen bg-universe-deep text-[var(--text-primary)] [color-scheme:dark]"
      >
        {children}
      </div>
    </SessionProvider>
  );
}
