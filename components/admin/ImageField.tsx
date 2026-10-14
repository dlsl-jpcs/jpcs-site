"use client";
import { useState } from "react";
import { ImageOff, ImageIcon } from "lucide-react";
import ImageUploadButton from "./ImageUploadButton";
import { Button, Field, inputClass } from "./ui";

interface ImageFieldProps {
  id: string;
  label: string;
  hint?: string;
  optional?: boolean;
  folder: "events" | "projects" | "gallery" | "officers";
  value: string;
  onChange: (url: string) => void;
  onBusyChange?: (busy: boolean) => void;
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
}

/** Image picker with a preview: upload a file, or paste a storage URL. */
export default function ImageField({
  id,
  label,
  hint,
  optional,
  folder,
  value,
  onChange,
  onBusyChange,
  onRemove,
  removeLabel = "Remove",
  className = "sm:col-span-2",
}: ImageFieldProps) {
  return (
    <Field label={label} htmlFor={id} hint={hint} optional={optional} className={className}>
      <div className="flex items-start gap-3">
        <Thumb key={value} url={value} />
        <div className="min-w-0 flex-1 space-y-2">
          <input
            id={id}
            type="text"
            inputMode="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
            placeholder="Upload an image or paste a storage URL"
          />
          <div className="flex flex-wrap gap-2">
            <ImageUploadButton
              folder={folder}
              onUploaded={onChange}
              onBusyChange={onBusyChange}
              label={value ? "Replace" : "Upload"}
            />
            {(value || onRemove) && (
              <Button variant="ghost" onClick={onRemove ?? (() => onChange(""))}>
                {removeLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Field>
  );
}

function Thumb({ url }: { url: string }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className="flex h-[5.25rem] w-[5.25rem] shrink-0 items-center justify-center overflow-hidden rounded-control border border-zinc-200 bg-zinc-50 text-zinc-400">
      {url && !broken ? (
        // eslint-disable-next-line @next/next/no-img-element -- previews any pasted URL, before next/image would accept it
        <img src={url} alt="" className="h-full w-full object-cover" onError={() => setBroken(true)} />
      ) : url ? (
        <ImageOff size={22} aria-label="Image can't be loaded" />
      ) : (
        <ImageIcon size={22} aria-hidden="true" />
      )}
    </div>
  );
}
