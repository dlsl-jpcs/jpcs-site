"use client";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface ImageUploadButtonProps {
  folder: "events" | "projects" | "gallery";
  onUploaded: (url: string) => void;
}

/** Uploads an image to Supabase Storage through /api/admin/upload and hands back its public URL. */
export default function ImageUploadButton({ folder, onUploaded }: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (res.ok && data.url) onUploaded(data.url);
      else alert(data.error || "Upload failed");
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="shrink-0 px-3 py-2 border rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-gray-50 disabled:opacity-60"
      >
        <Upload size={16} /> {uploading ? "Uploading..." : "Upload"}
      </button>
    </>
  );
}
