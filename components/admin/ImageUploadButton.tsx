"use client";
import { useRef } from "react";
import { Upload } from "lucide-react";
import { useSingleFlight } from "@/lib/useSingleFlight";
import { Button, errorMessage, useToast } from "./ui";

interface ImageUploadButtonProps {
  folder: "events" | "projects" | "gallery";
  onUploaded: (url: string) => void;
  /** Lets the form hold its Save button until the upload finishes. */
  onBusyChange?: (busy: boolean) => void;
  label?: string;
}

/** Uploads an image to Supabase Storage through /api/admin/upload and hands back its public URL. */
export default function ImageUploadButton({ folder, onUploaded, onBusyChange, label = "Upload" }: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, runUpload] = useSingleFlight();
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    runUpload(async () => {
      onBusyChange?.(true);
      try {
        const body = new FormData();
        body.append("file", file);
        body.append("folder", folder);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        if (!res.ok) {
          toast(await errorMessage(res, "Couldn't upload the image. Try again."), "error");
          return;
        }
        const data = await res.json();
        onUploaded(data.url);
      } catch {
        toast("Couldn't reach the server. Check your connection and try again.", "error");
      } finally {
        onBusyChange?.(false);
      }
    });
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        tabIndex={-1}
        onChange={handleChange}
      />
      <Button variant="secondary" loading={uploading} onClick={() => inputRef.current?.click()}>
        {!uploading && <Upload size={16} aria-hidden="true" />}
        {uploading ? "Uploading…" : label}
      </Button>
    </>
  );
}
