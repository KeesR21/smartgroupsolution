"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { UniverseBackground } from "@/components/background/UniverseBackground";
import { useNotifications } from "@/components/providers/NotificationProvider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { notify } = useNotifications();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      notify({
        type: "error",
        title: "Sign in failed",
        message: "Invalid email or password.",
      });
      return;
    }

    notify({
      type: "success",
      title: "Signed in",
      message: "Welcome to the admin panel.",
    });

    const callback = searchParams.get("callbackUrl") ?? "/admin";
    router.push(callback);
    router.refresh();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-universe-deep">
        <UniverseBackground particleCount={100} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md glass-strong rounded-3xl p-8"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandLogo size={120} animated forceDark />
          <p className="mt-4 gradient-text text-sm font-medium sm:text-base">
            Modernize. Protect. Scale.
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold">Admin</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Sign in to manage your website content
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-neon-cyan/40"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-neon-cyan/40"
              />
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple py-3 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-white">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
