"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
}

type Resolver = (value: boolean) => void;

const ConfirmContext = createContext<((o: ConfirmOptions) => Promise<boolean>) | null>(
  null
);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<Resolver | null>(null);

  const confirm = useCallback((o: ConfirmOptions) => {
    setOptions(o);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const settle = useCallback((value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setOptions(null);
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {options && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => settle(false)}
            />
            <motion.div
              role="alertdialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18 }}
              className="glass-strong relative z-10 w-full max-w-md rounded-2xl p-6"
            >
              <div className="flex gap-4">
                <div
                  className={
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl " +
                    (options.tone === "danger"
                      ? "bg-red-500/15 text-red-400"
                      : "bg-neon-blue/15 text-neon-cyan")
                  }
                >
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold">{options.title}</h2>
                  {options.message && (
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{options.message}</p>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => settle(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-[var(--text-muted)] transition-colors hover:text-white"
                >
                  {options.cancelLabel ?? "Cancel"}
                </button>
                <button
                  type="button"
                  autoFocus
                  onClick={() => settle(true)}
                  className={
                    "rounded-xl px-4 py-2 text-sm font-semibold text-white transition-transform hover:brightness-110 active:scale-95 " +
                    (options.tone === "danger"
                      ? "bg-red-500/90"
                      : "bg-gradient-to-r from-neon-blue to-neon-purple")
                  }
                >
                  {options.confirmLabel ?? "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}
