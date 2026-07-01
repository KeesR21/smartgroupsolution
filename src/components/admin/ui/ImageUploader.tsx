"use client";

import Image from "next/image";
import { useRef, useState, type DragEvent } from "react";
import { ImageIcon, Loader2, Trash2, UploadCloud } from "lucide-react";
import { useNotifications } from "@/components/providers/NotificationProvider";
import { isAllowedImageFile } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { inputClass } from "./Primitives";

export function ImageUploader({
  value,
  onChange,
  rounded = false,
}: {
  value: string;
  onChange: (url: string) => void;
  rounded?: boolean;
}) {
  const { notify } = useNotifications();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = (file: File) => {
    if (!isAllowedImageFile(file)) {
      notify({ type: "error", title: "Invalid image", message: "Use JPG, PNG, WebP or GIF." });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      notify({ type: "error", title: "File too large", message: "Maximum size is 2MB." });
      return;
    }

    setUploading(true);
    setProgress(0);
    const fd = new FormData();
    fd.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      setUploading(false);
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.url) {
          onChange(data.url);
          notify({ type: "success", title: "Image uploaded" });
        } else {
          throw new Error(data.error || "Upload failed");
        }
      } catch (err) {
        notify({
          type: "error",
          title: "Upload failed",
          message: err instanceof Error ? err.message : "Try again.",
        });
      }
    };
    xhr.onerror = () => {
      setUploading(false);
      notify({ type: "error", title: "Network error", message: "Upload failed." });
    };
    xhr.send(fd);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors",
          dragging
            ? "border-neon-cyan/70 bg-neon-cyan/5"
            : "border-white/15 hover:border-neon-cyan/40 hover:bg-white/[0.03]"
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="mb-3 h-6 w-6 animate-spin text-neon-cyan" />
            <p className="text-sm text-[var(--text-muted)]">Uploading... {progress}%</p>
            <div className="mt-3 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-neon-cyan to-neon-blue transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : (
          <>
            <UploadCloud className="mb-3 h-6 w-6 text-neon-cyan" />
            <p className="text-sm font-medium">
              Drag &amp; drop an image, or <span className="text-neon-cyan">browse</span>
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">JPG, PNG, WebP, GIF · up to 2MB</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <ImageIcon className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="or paste an image URL"
          className={inputClass}
        />
      </div>

      {value && (
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "relative h-24 w-24 shrink-0 overflow-hidden ring-1 ring-white/10",
              rounded ? "rounded-full" : "rounded-xl"
            )}
          >
            <Image src={value} alt="Preview" fill className="object-cover" unoptimized />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] transition-colors hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" /> Remove
          </button>
        </div>
      )}
    </div>
  );
}
