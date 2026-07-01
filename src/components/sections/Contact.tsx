"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send, XCircle } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "@/components/providers/NotificationProvider";
import type { SiteContentRecord } from "@/types/cms";

type FormStatus = "idle" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required";
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!data.subject.trim()) errors.subject = "Subject is required";
  if (!data.message.trim()) errors.message = "Message is required";
  else if (data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }
  return errors;
}

export function Contact({ content }: { content: SiteContentRecord }) {
  const { notify } = useNotifications();
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      notify({
        type: "success",
        title: "Message sent",
        message: "We will respond within one business day.",
      });
    } catch (err) {
      setStatus("error");
      notify({
        type: "error",
        title: "Message failed",
        message: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <SectionWrapper id="contact" className="relative">
      <div className="text-center">
        <span className="accent-label text-sm font-semibold uppercase tracking-widest text-neon-cyan">
          {content.contactLabel}
        </span>
        <h2 className="section-title mt-3">{content.contactTitle}</h2>
        <p className="section-subtitle mx-auto">{content.contactSubtitle}</p>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          {[
            { icon: Mail, label: "Email", value: content.contactEmail, href: `mailto:${content.contactEmail}` },
            { icon: Phone, label: "Phone", value: content.contactPhone, href: `tel:${content.contactPhone.replace(/\D/g, "")}` },
            content.contactPhoneAlt
              ? {
                  icon: Phone,
                  label: "Alternate phone",
                  value: content.contactPhoneAlt,
                  href: `tel:${content.contactPhoneAlt.replace(/\D/g, "")}`,
                }
              : null,
            { icon: MapPin, label: "Address", value: content.contactAddress },
            content.contactHours
              ? { icon: Clock, label: "Business hours", value: content.contactHours }
              : null,
          ]
            .filter((item): item is { icon: typeof Mail; label: string; value: string; href?: string } => Boolean(item))
            .map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass flex gap-4 rounded-2xl p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neon-blue/15 text-neon-cyan">
                <item.icon className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-muted)]">{item.label}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="link-hover-theme mt-1 block font-medium transition-colors hover:text-neon-cyan"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-1 font-medium">{item.value}</p>
                )}
              </div>
            </motion.div>
          ))}

          <div className="glass overflow-hidden rounded-2xl">
            <iframe
              title="Office location map"
              src={
                content.contactMapEmbed ||
                "https://maps.google.com/maps?q=San+Francisco+CA&t=&z=13&ie=UTF8&iwloc=&output=embed"
              }
              className="h-56 w-full border-0 grayscale contrast-125 opacity-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {content.contactFormEnabled === false ? (
          <div className="glass-strong flex flex-col items-center justify-center rounded-3xl p-8 text-center">
            <p className="font-medium">The contact form is currently unavailable.</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Please reach us directly via email or phone.
            </p>
          </div>
        ) : (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-strong space-y-5 rounded-3xl p-8"
          noValidate
        >
          {(
            [
              { id: "name", label: "Full Name", type: "text" },
              { id: "email", label: "Email Address", type: "email" },
              { id: "subject", label: "Subject", type: "text" },
            ] as const
          ).map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="mb-2 block text-sm font-medium">
                {field.label}
              </label>
              <input
                id={field.id}
                type={field.type}
                value={form[field.id]}
                onChange={(e) => update(field.id, e.target.value)}
                className="form-field-theme w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/30"
                aria-invalid={!!errors[field.id]}
                aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
              />
              {errors[field.id] && (
                <p id={`${field.id}-error`} className="mt-1 text-xs text-red-400" role="alert">
                  {errors[field.id]}
                </p>
              )}
            </div>
          ))}

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              className="form-field-theme w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/30"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message && (
              <p id="message-error" className="mt-1 text-xs text-red-400" role="alert">
                {errors.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            icon={Send}
            disabled={submitting}
            className="w-full"
          >
            {submitting ? "Sending..." : "Send Message"}
          </Button>

          <AnimatePresence mode="wait">
            {status === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-xl bg-emerald-500/15 px-4 py-3 text-sm text-emerald-400"
                role="status"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                Thank you! Your message has been sent successfully.
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-400"
                role="alert"
              >
                <XCircle className="h-5 w-5 shrink-0" />
                Something went wrong. Please try again later.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
        )}
      </div>
    </SectionWrapper>
  );
}
