"use client";
import { useCallback, useEffect, useId, useState } from "react";
import { ImageIcon, Plus, Trash2 } from "lucide-react";
import ImageField from "@/components/admin/ImageField";
import {
  Button,
  EmptyState,
  Field,
  FormSection,
  Modal,
  PageHeader,
  Segmented,
  errorMessage,
  inputClass,
  panelClass,
  useConfirm,
  useToast,
} from "@/components/admin/ui";
import { useSingleFlight } from "@/lib/useSingleFlight";

type GalleryImage = { id: number; image_url: string; alt_text: string | null; display_order: number | null };
const EMPTY_FORM = { image_url: "", alt_text: "", display_order: 0 };

export default function GalleryManagement() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  // "main" = homepage carousel (gallery_main), "gallery" = full gallery page (gallery)
  const [target, setTarget] = useState<"main" | "gallery">("main");
  const [uploads, setUploads] = useState(0);
  const [saving, runSave] = useSingleFlight();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const toast = useToast();
  const confirm = useConfirm();
  const formId = useId();

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery?target=${target}`);
      if (!res.ok) throw new Error(await errorMessage(res, "Couldn't load the gallery."));
      const data = await res.json();
      setImages(data.data ?? []);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't load the gallery.", "error");
    } finally {
      setLoading(false);
    }
  }, [target, toast]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const trackUpload = useCallback((busy: boolean) => {
    setUploads((n) => Math.max(0, n + (busy ? 1 : -1)));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploads > 0) return;
    runSave(async () => {
      try {
        const res = await fetch(`/api/admin/gallery?target=${target}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          toast(await errorMessage(res, "Couldn't add the image. Try again."), "error");
          return;
        }
        setIsFormOpen(false);
        setForm(EMPTY_FORM);
        toast("Image added");
        fetchImages();
      } catch {
        toast("Couldn't reach the server. Check your connection and try again.", "error");
      }
    });
  };

  const handleDelete = async (img: GalleryImage) => {
    const ok = await confirm({
      title: "Delete this image?",
      message: "It will be removed from the website. This can't be undone.",
      confirmLabel: "Delete image",
      cancelLabel: "Keep image",
    });
    if (!ok) return;
    setDeletingId(img.id);
    try {
      const res = await fetch(`/api/admin/gallery?target=${target}&id=${img.id}`, { method: "DELETE" });
      if (!res.ok) {
        toast(await errorMessage(res, "Couldn't delete the image. Try again."), "error");
        return;
      }
      setImages((list) => list.filter((i) => i.id !== img.id));
      toast("Image deleted");
    } catch {
      toast("Couldn't reach the server. Check your connection and try again.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Gallery"
        description="Photos for the home page carousel and the full gallery page."
        action={
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus size={18} aria-hidden="true" /> Add image
          </Button>
        }
      />

      <div className="mb-4">
        <Segmented
          label="Gallery"
          value={target}
          onChange={setTarget}
          options={[
            { value: "main", label: "Home page carousel" },
            { value: "gallery", label: "Gallery page" },
          ]}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-square animate-pulse rounded-panel bg-zinc-200" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className={panelClass}>
          <EmptyState icon={<ImageIcon size={22} />} title="No images here yet" body="Add photos from recent events." />
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <li key={img.id} className={`${panelClass} overflow-hidden`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of a stored image */}
              <img src={img.image_url} alt={img.alt_text || ""} className="aspect-square w-full bg-zinc-100 object-cover" />
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="text-xs text-zinc-500 tabular-nums">Order {img.display_order ?? 0}</span>
                <Button
                  variant="ghost"
                  className="h-8 px-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={deletingId === img.id}
                  onClick={() => handleDelete(img)}
                  aria-label={`Delete ${img.alt_text || "image"}`}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={isFormOpen}
        onClose={() => !saving && setIsFormOpen(false)}
        dismissible={!saving}
        title="Add image"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsFormOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form={formId} loading={saving} disabled={uploads > 0 || !form.image_url}>
              {uploads > 0 ? "Waiting for upload…" : saving ? "Adding…" : "Add image"}
            </Button>
          </>
        }
      >
        <form id={formId} onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Image">
            <ImageField
              id={`${formId}-image`}
              label="Photo"
              folder="gallery"
              value={form.image_url}
              onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
              onBusyChange={trackUpload}
            />
            <Field label="Description" htmlFor={`${formId}-alt`} optional hint="Read out by screen readers." className="sm:col-span-2">
              <input id={`${formId}-alt`} type="text" maxLength={255} value={form.alt_text} onChange={(e) => { const v = e.target.value; setForm((f) => ({ ...f, alt_text: v })); }} className={inputClass} placeholder="e.g. Members at the 2026 General Assembly" />
            </Field>
            <Field label="Display order" htmlFor={`${formId}-order`} hint="Lower numbers show first.">
              <input id={`${formId}-order`} type="number" value={form.display_order} onChange={(e) => { const v = parseInt(e.target.value) || 0; setForm((f) => ({ ...f, display_order: v })); }} className={inputClass} />
            </Field>
          </FormSection>
        </form>
      </Modal>
    </div>
  );
}
