"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Move, X, ZoomIn } from "lucide-react";
import { blobToFile, getCroppedImageBlob } from "@/lib/crop-image";

interface ImageCropModalProps {
  imageSrc: string;
  outputFilename?: string;
  onClose: () => void;
  onComplete: (file: File, previewUrl: string) => void;
}

export function ImageCropModal({
  imageSrc,
  outputFilename = "team-photo.jpg",
  onClose,
  onComplete,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      const file = blobToFile(blob, outputFilename.replace(/\.[^.]+$/, "") + ".jpg");
      const previewUrl = URL.createObjectURL(blob);
      onComplete(file, previewUrl);
    } catch {
      alert("Could not crop this image. Try uploading a different file or use a direct image URL.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        aria-label="Close crop editor"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-universe-deep shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h3 className="font-semibold text-white">Crop & position photo</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Move className="h-3.5 w-3.5" />
              Drag to reposition · use zoom to frame the face
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative h-72 bg-black sm:h-80">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            objectFit="contain"
          />
        </div>

        <div className="space-y-4 border-t border-white/10 px-5 py-4">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
              <ZoomIn className="h-4 w-4 text-neon-cyan" />
              Zoom
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-neon-cyan"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-[var(--text-muted)] hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={processing || !croppedAreaPixels}
              className="rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {processing ? "Processing..." : "Apply crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
