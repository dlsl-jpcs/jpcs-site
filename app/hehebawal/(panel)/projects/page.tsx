"use client";
import { useCallback, useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { FolderKanban, Images, Pencil, Plus, Trash2 } from "lucide-react";
import ImageField from "@/components/admin/ImageField";
import {
  Button,
  EmptyState,
  Field,
  FormSection,
  IconButton,
  ListThumb,
  Modal,
  PageHeader,
  SkeletonRows,
  errorMessage,
  inputClass,
  panelClass,
  textareaClass,
  useConfirm,
  useToast,
} from "@/components/admin/ui";
import { MAX_GALLERY_IMAGES } from "@/lib/projects";
import { useSingleFlight } from "@/lib/useSingleFlight";

type AdminProject = {
  id: number;
  name: string;
  org: string;
  date: string;
  description: string;
  facebook: string;
  instagram: string;
  image: string;
  gallery: string[];
};
/** Extra photos carry a stable key so an upload that finishes late lands in the right slot. */
type Photo = { key: number; url: string };
type ProjectForm = Omit<AdminProject, "id" | "gallery"> & { gallery: Photo[] };

const EMPTY_FORM: ProjectForm = {
  name: "", org: "JPCS", date: "", description: "", facebook: "", instagram: "", image: "", gallery: [],
};

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProject | null>(null);
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM);
  const [uploads, setUploads] = useState(0);
  const [saving, runSave] = useSingleFlight();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const photoKey = useRef(0);
  const toast = useToast();
  const confirm = useConfirm();
  const formId = useId();

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (!res.ok) throw new Error(await errorMessage(res, "Couldn't load projects."));
      const data = await res.json();
      setProjects(data.data ?? []);
      setLoadError("");
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Couldn't load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const toPhotos = (urls: string[]) => urls.map((url) => ({ key: ++photoKey.current, url }));

  const openForm = (project: AdminProject | null) => {
    setEditing(project);
    setForm(
      project
        ? { ...EMPTY_FORM, ...project, gallery: toPhotos(project.gallery ?? []) }
        : EMPTY_FORM,
    );
    setIsFormOpen(true);
  };

  // Opened from the overview's "Add project" shortcut (?new).
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("new")) return;
    window.history.replaceState(null, "", window.location.pathname);
    setEditing(null);
    setForm(EMPTY_FORM);
    setIsFormOpen(true);
  }, []);

  const closeForm = () => {
    if (!saving) setIsFormOpen(false);
  };

  const set =
    (key: "name" | "org" | "date" | "description" | "facebook" | "instagram") =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
    };

  const setPhoto = (key: number, url: string) =>
    setForm((f) => ({ ...f, gallery: f.gallery.map((p) => (p.key === key ? { ...p, url } : p)) }));
  const removePhoto = (key: number) =>
    setForm((f) => ({ ...f, gallery: f.gallery.filter((p) => p.key !== key) }));
  const addPhoto = () =>
    setForm((f) => ({ ...f, gallery: [...f.gallery, { key: ++photoKey.current, url: "" }] }));

  const trackUpload = useCallback((busy: boolean) => {
    setUploads((n) => Math.max(0, n + (busy ? 1 : -1)));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploads > 0) return;
    runSave(async () => {
      const isEdit = editing !== null;
      const body = { ...form, gallery: form.gallery.map((p) => p.url) };
      try {
        const res = await fetch("/api/admin/projects", {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(isEdit ? { ...body, id: editing.id } : body),
        });
        if (!res.ok) {
          toast(await errorMessage(res, "Couldn't save the project. Try again."), "error");
          return;
        }
        setIsFormOpen(false);
        toast(isEdit ? "Project updated" : "Project added");
        fetchProjects();
      } catch {
        toast("Couldn't reach the server. Check your connection and try again.", "error");
      }
    });
  };

  const handleDelete = async (project: AdminProject) => {
    const ok = await confirm({
      title: "Delete this project?",
      message: (
        <>
          <strong className="font-semibold text-navy">{project.name}</strong> and all of its photos
          will be removed from the website. This can&apos;t be undone.
        </>
      ),
      confirmLabel: "Delete project",
      cancelLabel: "Keep project",
    });
    if (!ok) return;

    setDeletingId(project.id);
    try {
      const res = await fetch(`/api/admin/projects?id=${project.id}`, { method: "DELETE" });
      if (!res.ok) {
        toast(await errorMessage(res, "Couldn't delete the project. Try again."), "error");
        return;
      }
      setProjects((list) => list.filter((p) => p.id !== project.id));
      toast("Project deleted");
    } catch {
      toast("Couldn't reach the server. Check your connection and try again.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const addButton = (
    <Button onClick={() => openForm(null)}>
      <Plus size={18} aria-hidden="true" /> Add project
    </Button>
  );
  const photoCount = (p: AdminProject) => (p.image ? 1 : 0) + (p.gallery?.length ?? 0);

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Past activities shown in the Projects carousel on the home page, newest first."
        action={addButton}
      />

      <section className={`${panelClass} overflow-hidden`} aria-busy={loading}>
        <div className="hidden grid-cols-[2.75rem_minmax(0,1fr)_11rem_6rem_5rem] gap-x-4 border-b border-zinc-200 bg-zinc-50 px-5 py-2.5 text-[13px] font-semibold text-zinc-500 md:grid">
          <span className="col-span-2">Project</span>
          <span>Date</span>
          <span>Photos</span>
          <span className="sr-only">Actions</span>
        </div>

        {loading ? (
          <SkeletonRows />
        ) : loadError ? (
          <EmptyState
            icon={<FolderKanban size={22} />}
            title="Projects didn't load"
            body={loadError}
            action={<Button variant="secondary" onClick={() => { setLoading(true); fetchProjects(); }}>Try again</Button>}
          />
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<FolderKanban size={22} />}
            title="No projects yet"
            body="Add a past seminar, outreach or competition with a few photos to show what JPCS has done."
            action={addButton}
          />
        ) : (
          <ul className="divide-y divide-zinc-100">
            {projects.map((proj) => (
              <li
                key={proj.id}
                className="grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-start gap-x-4 md:items-center px-4 py-3.5 sm:px-5 md:grid-cols-[2.75rem_minmax(0,1fr)_11rem_6rem_5rem]"
              >
                <ListThumb url={proj.image} fallback={<FolderKanban size={18} aria-hidden="true" />} />
                <div className="min-w-0">
                  <p className="truncate font-bold text-navy">{proj.name}</p>
                  <p className="mt-0.5 truncate text-sm text-zinc-500">{proj.org}</p>
                  <p className="mt-1 flex flex-wrap gap-x-3 text-sm md:hidden">
                    <span className="font-semibold text-navy">{proj.date}</span>
                    <span className="text-zinc-500">
                      {photoCount(proj)} {photoCount(proj) === 1 ? "photo" : "photos"}
                    </span>
                  </p>
                </div>
                <p className="hidden truncate text-sm font-semibold text-navy md:block">{proj.date}</p>
                <p className="hidden items-center gap-1.5 text-sm text-zinc-500 md:flex">
                  <Images size={15} aria-hidden="true" />
                  <span className="tabular-nums">{photoCount(proj)}</span>
                </p>
                <div className="flex justify-end gap-0.5 self-start md:self-center">
                  <IconButton label={`Edit ${proj.name}`} onClick={() => openForm(proj)}>
                    <Pencil size={17} />
                  </IconButton>
                  <IconButton
                    label={`Delete ${proj.name}`}
                    tone="danger"
                    disabled={deletingId === proj.id}
                    onClick={() => handleDelete(proj)}
                  >
                    <Trash2 size={17} />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Modal
        open={isFormOpen}
        onClose={closeForm}
        dismissible={!saving}
        title={editing ? "Edit project" : "Add project"}
        description={editing ? editing.name : "It will appear first in the Projects carousel."}
        footer={
          <>
            <Button variant="secondary" onClick={closeForm} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form={formId} loading={saving} disabled={uploads > 0}>
              {uploads > 0 ? "Waiting for upload…" : saving ? "Saving…" : editing ? "Save changes" : "Add project"}
            </Button>
          </>
        }
      >
        <form id={formId} onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Details">
            <Field label="Project name" htmlFor={`${formId}-name`} className="sm:col-span-2">
              <input id={`${formId}-name`} data-autofocus required maxLength={255} type="text" value={form.name} onChange={set("name")} className={inputClass} placeholder="e.g. Tech Talk Series" />
            </Field>
            <Field label="Date" htmlFor={`${formId}-date`} hint="Shown exactly as written.">
              <input id={`${formId}-date`} required maxLength={255} type="text" value={form.date} onChange={set("date")} className={inputClass} placeholder="e.g. November 2025" />
            </Field>
            <Field label="Organizer" htmlFor={`${formId}-org`}>
              <input id={`${formId}-org`} type="text" value={form.org} onChange={set("org")} className={inputClass} />
            </Field>
            <Field label="Description" htmlFor={`${formId}-desc`} className="sm:col-span-2">
              <textarea id={`${formId}-desc`} required maxLength={5000} value={form.description} onChange={set("description")} className={textareaClass} placeholder="What the project was and what came out of it." />
            </Field>
          </FormSection>

          <FormSection title="Photos">
            <ImageField
              id={`${formId}-cover`}
              label="Cover photo"
              optional
              hint="Shown on the project card. JPEG, PNG, WebP, GIF or AVIF, up to 5 MB."
              folder="projects"
              value={form.image}
              onChange={(url) => setForm((f) => ({ ...f, image: url }))}
              onBusyChange={trackUpload}
            />
            {form.gallery.map((photo, i) => (
              <ImageField
                key={photo.key}
                id={`${formId}-photo-${photo.key}`}
                label={`Extra photo ${i + 1}`}
                folder="projects"
                value={photo.url}
                onChange={(url) => setPhoto(photo.key, url)}
                onRemove={() => removePhoto(photo.key)}
                removeLabel="Remove photo"
                onBusyChange={trackUpload}
              />
            ))}
            <div className="sm:col-span-2">
              {form.gallery.length < MAX_GALLERY_IMAGES ? (
                <>
                  <Button variant="secondary" onClick={addPhoto} disabled={!form.image}>
                    <Plus size={16} aria-hidden="true" /> Add extra photo
                    <span className="font-normal text-zinc-500 tabular-nums">
                      {form.gallery.length}/{MAX_GALLERY_IMAGES}
                    </span>
                  </Button>
                  <p className="mt-1.5 text-[13px] text-zinc-500">
                    {form.image
                      ? "Extra photos appear in the project details, after the cover."
                      : "Add a cover photo first."}
                  </p>
                </>
              ) : (
                <p className="text-[13px] text-zinc-500">
                  That&apos;s the most extra photos a project can have ({MAX_GALLERY_IMAGES}).
                </p>
              )}
            </div>
          </FormSection>

          <FormSection title="Links">
            <Field label="Facebook post" htmlFor={`${formId}-fb`} optional>
              <input id={`${formId}-fb`} type="url" value={form.facebook} onChange={set("facebook")} className={inputClass} placeholder="https://facebook.com/…" />
            </Field>
            <Field label="Instagram post" htmlFor={`${formId}-ig`} optional>
              <input id={`${formId}-ig`} type="url" value={form.instagram} onChange={set("instagram")} className={inputClass} placeholder="https://instagram.com/…" />
            </Field>
          </FormSection>
        </form>
      </Modal>
    </div>
  );
}
