"use client";
import { useCallback, useEffect, useId, useMemo, useState, type ChangeEvent } from "react";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import ImageField from "@/components/admin/ImageField";
import { useReorder } from "@/components/admin/useReorder";
import {
  Button,
  EmptyState,
  Field,
  FormSection,
  IconButton,
  ListThumb,
  Modal,
  PageHeader,
  ReorderControl,
  SkeletonRows,
  errorMessage,
  inputClass,
  panelClass,
  selectClass,
  useConfirm,
  useToast,
} from "@/components/admin/ui";
import {
  OFFICER_CATEGORIES,
  OFFICER_COURSES,
  OFFICER_YEARS,
  type Officer,
  type OfficerCategory,
} from "@/lib/officers";
import { useSingleFlight } from "@/lib/useSingleFlight";

type OfficerForm = Omit<Officer, "id">;

const emptyForm = (category: OfficerCategory = "executive"): OfficerForm => ({
  name: "",
  position: "",
  category,
  year: "1st Year",
  course: "BSIT",
  image: "",
});

export default function OfficersManagement() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Officer | null>(null);
  const [form, setForm] = useState<OfficerForm>(emptyForm());
  const [uploads, setUploads] = useState(0);
  const [saving, runSave] = useSingleFlight();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const toast = useToast();
  const confirm = useConfirm();
  const formId = useId();

  const fetchOfficers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/officers");
      if (!res.ok) throw new Error(await errorMessage(res, "Couldn't load officers."));
      const data = await res.json();
      setOfficers(data.data ?? []);
      setLoadError("");
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Couldn't load officers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOfficers();
  }, [fetchOfficers]);

  const { move, saving: orderSaving, announce } = useReorder({
    items: officers,
    setItems: setOfficers,
    endpoint: "/api/admin/officers/reorder",
    onFailure: fetchOfficers,
  });

  const groups = useMemo(
    () => OFFICER_CATEGORIES.map((c) => ({ ...c, items: officers.filter((o) => o.category === c.value) })),
    [officers],
  );

  const openForm = (officer: Officer | null, category?: OfficerCategory) => {
    setEditing(officer);
    setForm(officer ? { ...officer } : emptyForm(category));
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (!saving) setIsFormOpen(false);
  };

  const set =
    (key: keyof OfficerForm) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
    };

  const trackUpload = useCallback((busy: boolean) => {
    setUploads((n) => Math.max(0, n + (busy ? 1 : -1)));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploads > 0) return;
    runSave(async () => {
      const isEdit = editing !== null;
      try {
        const res = await fetch("/api/admin/officers", {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(isEdit ? { ...form, id: editing.id } : form),
        });
        if (!res.ok) {
          toast(await errorMessage(res, "Couldn't save the officer. Try again."), "error");
          return;
        }
        setIsFormOpen(false);
        toast(isEdit ? "Officer updated" : "Officer added");
        fetchOfficers();
      } catch {
        toast("Couldn't reach the server. Check your connection and try again.", "error");
      }
    });
  };

  const handleDelete = async (officer: Officer) => {
    const ok = await confirm({
      title: "Remove this officer?",
      message: (
        <>
          <strong className="font-semibold text-navy">{officer.name}</strong> and their photo will be
          removed from the website. This can&apos;t be undone.
        </>
      ),
      confirmLabel: "Remove officer",
      cancelLabel: "Keep officer",
    });
    if (!ok) return;

    setDeletingId(officer.id);
    try {
      const res = await fetch(`/api/admin/officers?id=${officer.id}`, { method: "DELETE" });
      if (!res.ok) {
        toast(await errorMessage(res, "Couldn't remove the officer. Try again."), "error");
        return;
      }
      setOfficers((list) => list.filter((o) => o.id !== officer.id));
      toast("Officer removed");
    } catch {
      toast("Couldn't reach the server. Check your connection and try again.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const addButton = (
    <Button onClick={() => openForm(null)}>
      <Plus size={18} aria-hidden="true" /> Add officer
    </Button>
  );

  return (
    <div>
      <PageHeader
        title="Officers"
        description="Everyone in The Officers section of the home page. Each group is shown in the order listed here, top first; use the arrows to move someone."
        action={addButton}
      />

      <div className="mb-3 flex h-5 items-center justify-end text-sm text-zinc-500" aria-hidden={orderSaving === 0}>
        {orderSaving > 0 ? "Saving order…" : ""}
      </div>
      <p role="status" className="sr-only">{announce}</p>

      {loading ? (
        <section className={`${panelClass} overflow-hidden`} aria-busy="true">
          <SkeletonRows rows={5} />
        </section>
      ) : loadError ? (
        <section className={panelClass}>
          <EmptyState
            icon={<Users size={22} />}
            title="Officers didn't load"
            body={loadError}
            action={<Button variant="secondary" onClick={() => { setLoading(true); fetchOfficers(); }}>Try again</Button>}
          />
        </section>
      ) : officers.length === 0 ? (
        <section className={panelClass}>
          <EmptyState
            icon={<Users size={22} />}
            title="No officers yet"
            body="Add the executive board, project heads, officers and representatives so members know who to reach."
            action={addButton}
          />
        </section>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.value} aria-labelledby={`group-${group.value}`}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 id={`group-${group.value}`} className="text-lg font-extrabold tracking-tight text-navy">
                  {group.label}
                  <span className="ml-2 text-sm font-semibold tabular-nums text-zinc-500">{group.items.length}</span>
                </h2>
                <Button variant="ghost" onClick={() => openForm(null, group.value)} aria-label={`Add to ${group.label}`}>
                  <Plus size={16} aria-hidden="true" /> Add
                </Button>
              </div>

              <div className={`${panelClass} overflow-hidden`}>
                {group.items.length === 0 ? (
                  <p className="px-5 py-6 text-sm text-zinc-500">
                    No one in this group yet. The group stays hidden on the website until someone is added.
                  </p>
                ) : (
                  <ul className="divide-y divide-zinc-100">
                    {group.items.map((officer, index) => (
                      <li
                        key={officer.id}
                        className="grid grid-cols-[2.25rem_2.75rem_minmax(0,1fr)_auto] items-center gap-x-3 px-4 py-3 sm:gap-x-4 sm:px-5"
                      >
                        <ReorderControl
                          id={officer.id}
                          name={officer.name}
                          position={index + 1}
                          count={group.items.length}
                          onMove={(delta) => move(officer.id, delta, group.items)}
                        />
                        <ListThumb url={officer.image} anchorTop fallback={<Users size={18} aria-hidden="true" />} />
                        <div className="min-w-0">
                          <p className="truncate font-bold text-navy">{officer.name}</p>
                          <p className="truncate text-sm text-zinc-600">{officer.position}</p>
                          <p className="truncate text-[13px] text-zinc-500">
                            {officer.year} {officer.course}
                          </p>
                        </div>
                        <div className="flex gap-0.5">
                          <IconButton label={`Edit ${officer.name}`} onClick={() => openForm(officer)}>
                            <Pencil size={17} />
                          </IconButton>
                          <IconButton
                            label={`Remove ${officer.name}`}
                            tone="danger"
                            disabled={deletingId === officer.id}
                            onClick={() => handleDelete(officer)}
                          >
                            <Trash2 size={17} />
                          </IconButton>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      )}

      <Modal
        open={isFormOpen}
        onClose={closeForm}
        dismissible={!saving}
        title={editing ? "Edit officer" : "Add officer"}
        description={editing ? editing.name : "They go to the end of the group; move them from the list."}
        footer={
          <>
            <Button variant="secondary" onClick={closeForm} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form={formId} loading={saving} disabled={uploads > 0}>
              {uploads > 0 ? "Waiting for upload…" : saving ? "Saving…" : editing ? "Save changes" : "Add officer"}
            </Button>
          </>
        }
      >
        <form id={formId} onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Photo">
            <ImageField
              id={`${formId}-image`}
              label="Photo"
              optional
              hint="A portrait with the face near the top; the website shows it at 4:5. Without a photo, their initials are shown. JPEG, PNG, WebP, GIF or AVIF, up to 5 MB."
              folder="officers"
              value={form.image}
              onChange={(url) => setForm((f) => ({ ...f, image: url }))}
              onBusyChange={trackUpload}
              removeLabel="Remove photo"
            />
          </FormSection>

          <FormSection title="Details">
            <Field label="Full name" htmlFor={`${formId}-name`} className="sm:col-span-2">
              <input id={`${formId}-name`} data-autofocus required maxLength={255} type="text" value={form.name} onChange={set("name")} className={inputClass} placeholder="e.g. Josiah Lamuel Rosell" />
            </Field>
            <Field label="Position" htmlFor={`${formId}-position`} className="sm:col-span-2">
              <input id={`${formId}-position`} required maxLength={255} type="text" value={form.position} onChange={set("position")} className={inputClass} placeholder="e.g. Vice President for IT" />
            </Field>
            <Field label="Group" htmlFor={`${formId}-category`} hint="Where they appear on the website." className="sm:col-span-2">
              <select id={`${formId}-category`} value={form.category} onChange={set("category")} className={selectClass}>
                {OFFICER_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Year level" htmlFor={`${formId}-year`} className="sm:col-span-2">
              <select id={`${formId}-year`} value={form.year} onChange={set("year")} className={selectClass}>
                {OFFICER_YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </Field>
            <Field label="Course" htmlFor={`${formId}-course`} className="sm:col-span-2">
              <select id={`${formId}-course`} value={form.course} onChange={set("course")} className={selectClass}>
                {OFFICER_COURSES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>
          </FormSection>
        </form>
      </Modal>
    </div>
  );
}
