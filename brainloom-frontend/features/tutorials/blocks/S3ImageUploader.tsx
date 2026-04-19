"use client";
// features/tutorials/blocks/S3ImageUploader.tsx
// Reusable image uploader: file picker → pre-signed URL → direct S3 upload → returns public URL

import React, { useRef, useState } from "react";
import { api } from "@/lib/axios";

interface Props {
  onUploaded: (publicUrl: string) => void;
  currentUrl?: string;
  label?: string;
}

export default function S3ImageUploader({ onUploaded, currentUrl, label = "Upload Image" }: Props) {
  const inputRef              = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [error,     setError]     = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate: images only, max 10 MB
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, GIF, WebP…)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10 MB");
      return;
    }

    setError("");
    setUploading(true);
    setProgress(10);

    try {
      // 1. Get pre-signed S3 PUT URL from tutorial service
      const { data } = await api.post("/media/upload-url", {
        filename:    file.name,
        contentType: file.type,
      });

      const { uploadUrl, publicUrl } = data;
      setProgress(30);

      // 2. Upload directly to S3 using the pre-signed URL
      await fetch(uploadUrl, {
        method:  "PUT",
        headers: { "Content-Type": file.type },
        body:    file,
      });

      setProgress(100);
      onUploaded(publicUrl);
    } catch (err: any) {
      console.error("S3 upload error:", err);
      setError(err?.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="s3-image-input"
      />

      {/* Drop zone / click area */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition
          ${uploading ? "border-blue-300 bg-blue-50 cursor-wait" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/40"}`}
      >
        {uploading ? (
          <>
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-blue-600 font-medium">Uploading… {progress}%</p>
            {progress > 0 && (
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}
          </>
        ) : currentUrl ? (
          <>
            <img
              src={currentUrl}
              alt="Current"
              className="max-h-40 rounded-xl border border-gray-200 object-contain bg-gray-50 w-full"
            />
            <p className="text-xs text-gray-400 mt-1">Click to replace</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-2xl">🖼️</div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, GIF, WebP · Max 10 MB</p>
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}
    </div>
  );
}
