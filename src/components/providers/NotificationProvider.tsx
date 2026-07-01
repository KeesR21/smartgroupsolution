"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  durationMs?: number;
}

interface NotificationContextValue {
  notify: (n: Omit<AppNotification, "id">) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const STYLES: Record<
  NotificationType,
  { icon: typeof Info; ring: string; bg: string }
> = {
  success: {
    icon: CheckCircle2,
    ring: "ring-emerald-500/30",
    bg: "bg-emerald-500/10",
  },
  error: {
    icon: AlertCircle,
    ring: "ring-red-500/30",
    bg: "bg-red-500/10",
  },
  warning: {
    icon: AlertTriangle,
    ring: "ring-amber-500/30",
    bg: "bg-amber-500/10",
  },
  info: {
    icon: Info,
    ring: "ring-neon-cyan/30",
    bg: "bg-neon-blue/10",
  },
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<AppNotification[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback(
    (n: Omit<AppNotification, "id">) => {
      const id = crypto.randomUUID();
      const durationMs = n.durationMs ?? (n.type === "error" ? 8000 : 5000);
      setItems((prev) => [...prev.slice(-4), { ...n, id, durationMs }]);

      if (durationMs > 0) {
        window.setTimeout(() => dismiss(id), durationMs);
      }
    },
    [dismiss]
  );

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed right-4 top-4 z-[400] flex w-full max-w-sm flex-col gap-2 px-4 sm:right-6 sm:top-6"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence mode="popLayout">
          {items.map((item) => {
            const style = STYLES[item.type];
            const Icon = style.icon;
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.96 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "pointer-events-auto glass-strong rounded-xl p-4 ring-1",
                  style.ring,
                  style.bg
                )}
                role="alert"
              >
                <div className="flex gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-neon-cyan" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {item.title}
                    </p>
                    {item.message ? (
                      <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
                        {item.message}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => dismiss(item.id)}
                    className="shrink-0 rounded-lg p-1 text-[var(--text-muted)] transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Dismiss notification"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
}
