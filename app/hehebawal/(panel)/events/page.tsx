"use client";
import { useCallback, useEffect, useId, useMemo, useState, type ChangeEvent } from "react";
import { CalendarDays, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
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
  Segmented,
  SkeletonRows,
  errorMessage,
  inputClass,
  panelClass,
  textareaClass,
  useConfirm,
  useToast,
} from "@/components/admin/ui";
import { eventStatus, formatEventRange, toStartsAt, type EventStatus } from "@/lib/site";
import { useSingleFlight } from "@/lib/useSingleFlight";

type AdminEvent = {
  id: number;
  title: string;
  org: string;
  date: string;
  time: string;
  endDate: string;
  endTime: string;
  location: string;
  description: string;
  link: string;
  image: string;
  facebook: string;
  instagram: string;
};
type EventForm = Omit<AdminEvent, "id">;

const EMPTY_FORM: EventForm = {
  title: "", org: "JPCS", date: "", time: "", endDate: "", endTime: "", location: "",
  description: "", link: "", image: "", facebook: "", instagram: "",
};

const STATUS: Record<EventStatus, { label: string; className: string }> = {
  upcoming: { label: "Upcoming", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  ongoing: { label: "Ongoing", className: "bg-amber-50 text-amber-800 ring-amber-600/25" },
  past: { label: "Past", className: "bg-zinc-100 text-zinc-600 ring-zinc-500/20" },
};

function when(e: AdminEvent) {
  const start = toStartsAt(e.date, e.time);
  if (!start) return { date: e.date, time: e.time };
  const end = e.endDate ? toStartsAt(e.endDate, e.endTime || e.time) : null;
  return formatEventRange(start, end);
}

const startKey = (e: AdminEvent) => toStartsAt(e.date, e.time) ?? "";

export default function EventsManagement() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState<"current" | "past">("current");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminEvent | null>(null);
  const [form, setForm] = useState<EventForm>(EMPTY_FORM);
  const [uploads, setUploads] = useState(0);
  const [saving, runSave] = useSingleFlight();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const toast = useToast();
  const confirm = useConfirm();
  const formId = useId();

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/events");
      if (!res.ok) throw new Error(await errorMessage(res, "Couldn't load events."));
      const data = await res.json();
      setEvents(data.data ?? []);
      setLoadError("");
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Couldn't load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const openForm = (event: AdminEvent | null) => {
    setEditing(event);
    setForm(event ? { ...EMPTY_FORM, ...event } : EMPTY_FORM);
    setIsFormOpen(true);
  };

  // Opened from the overview's "Add event" shortcut (?new).
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
    (key: keyof EventForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        const res = await fetch("/api/admin/events", {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(isEdit ? { ...form, id: editing.id } : form),
        });
        if (!res.ok) {
          toast(await errorMessage(res, "Couldn't save the event. Try again."), "error");
          return;
        }
        setIsFormOpen(false);
        toast(isEdit ? "Event updated" : "Event added");
        fetchEvents();
      } catch {
        toast("Couldn't reach the server. Check your connection and try again.", "error");
      }
    });
  };

  const handleDelete = async (evt: AdminEvent) => {
    const ok = await confirm({
      title: "Delete this event?",
      message: (
        <>
          <strong className="font-semibold text-navy">{evt.title}</strong> and its poster will be
          removed from the website. This can&apos;t be undone.
        </>
      ),
      confirmLabel: "Delete event",
      cancelLabel: "Keep event",
    });
    if (!ok) return;

    setDeletingId(evt.id);
    try {
      const res = await fetch(`/api/admin/events?id=${evt.id}`, { method: "DELETE" });
      if (!res.ok) {
        toast(await errorMessage(res, "Couldn't delete the event. Try again."), "error");
        return;
      }
      setEvents((list) => list.filter((x) => x.id !== evt.id));
      toast("Event deleted");
    } catch {
      toast("Couldn't reach the server. Check your connection and try again.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const { current, past } = useMemo(() => {
    const withStatus = events.map((e) => ({ ...e, status: eventStatus(e) }));
    return {
      current: withStatus
        .filter((e) => e.status !== "past")
        .sort((a, b) => startKey(a).localeCompare(startKey(b))),
      past: withStatus
        .filter((e) => e.status === "past")
        .sort((a, b) => startKey(b).localeCompare(startKey(a))),
    };
  }, [events]);
  const shown = filter === "current" ? current : past;

  const addButton = (
    <Button onClick={() => openForm(null)}>
      <Plus size={18} aria-hidden="true" /> Add event
    </Button>
  );

  return (
    <div>
      <PageHeader
        title="Events"
        description="Upcoming and ongoing events appear on the home page until the day they end."
        action={addButton}
      />

      <div className="mb-4">
        <Segmented
          label="Show events"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "current", label: "Upcoming", count: loading ? undefined : current.length },
            { value: "past", label: "Past", count: loading ? undefined : past.length },
          ]}
        />
      </div>

      <section className={`${panelClass} overflow-hidden`} aria-busy={loading}>
        <div className="hidden grid-cols-[2.75rem_minmax(0,1fr)_15rem_7rem_5rem] gap-x-4 border-b border-zinc-200 bg-zinc-50 px-5 py-2.5 text-[13px] font-semibold text-zinc-500 md:grid">
          <span className="col-span-2">Event</span>
          <span>Date and time</span>
          <span>Status</span>
          <span className="sr-only">Actions</span>
        </div>

        {loading ? (
          <SkeletonRows />
        ) : loadError ? (
          <EmptyState
            icon={<CalendarDays size={22} />}
            title="Events didn't load"
            body={loadError}
            action={<Button variant="secondary" onClick={() => { setLoading(true); fetchEvents(); }}>Try again</Button>}
          />
        ) : shown.length === 0 ? (
          filter === "current" ? (
            <EmptyState
              icon={<CalendarDays size={22} />}
              title="No upcoming events"
              body="Add the next general assembly, seminar or hackathon so members can see it on the home page."
              action={addButton}
            />
          ) : (
            <EmptyState icon={<CalendarDays size={22} />} title="No past events yet" body="Events move here the day after they end." />
          )
        ) : (
          <ul className="divide-y divide-zinc-100">
            {shown.map((evt) => {
              const w = when(evt);
              const status = STATUS[evt.status];
              const chip = (
                <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold ring-1 ring-inset ${status.className}`}>
                  {status.label}
                </span>
              );
              return (
                <li
                  key={evt.id}
                  className="grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-start gap-x-4 md:items-center px-4 py-3.5 sm:px-5 md:grid-cols-[2.75rem_minmax(0,1fr)_15rem_7rem_5rem]"
                >
                  <ListThumb url={evt.image} fallback={<CalendarDays size={18} aria-hidden="true" />} />
                  <div className="min-w-0">
                    <p className="truncate font-bold text-navy">{evt.title}</p>
                    <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-sm text-zinc-500">
                      {evt.location ? (
                        <>
                          <MapPin size={14} className="shrink-0" aria-hidden="true" />
                          <span className="truncate">{evt.location}</span>
                        </>
                      ) : (
                        <span className="truncate">{evt.org}</span>
                      )}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm md:hidden">
                      <span className="font-semibold text-navy">{w.date}</span>
                      <span className="text-zinc-500">{w.time}</span>
                      {chip}
                    </div>
                  </div>
                  <div className="hidden text-sm md:block">
                    <p className="font-semibold text-navy">{w.date}</p>
                    <p className="text-zinc-500">{w.time}</p>
                  </div>
                  <div className="hidden md:block">{chip}</div>
                  <div className="flex justify-end gap-0.5 self-start md:self-center">
                    <IconButton label={`Edit ${evt.title}`} onClick={() => openForm(evt)}>
                      <Pencil size={17} />
                    </IconButton>
                    <IconButton
                      label={`Delete ${evt.title}`}
                      tone="danger"
                      disabled={deletingId === evt.id}
                      onClick={() => handleDelete(evt)}
                    >
                      <Trash2 size={17} />
                    </IconButton>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Modal
        open={isFormOpen}
        onClose={closeForm}
        dismissible={!saving}
        title={editing ? "Edit event" : "Add event"}
        description={editing ? editing.title : "It will show on the home page until the day it ends."}
        footer={
          <>
            <Button variant="secondary" onClick={closeForm} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form={formId} loading={saving} disabled={uploads > 0}>
              {uploads > 0 ? "Waiting for upload…" : saving ? "Saving…" : editing ? "Save changes" : "Add event"}
            </Button>
          </>
        }
      >
        <form id={formId} onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Details">
            <Field label="Event name" htmlFor={`${formId}-title`} className="sm:col-span-2">
              <input id={`${formId}-title`} data-autofocus required maxLength={255} type="text" value={form.title} onChange={set("title")} className={inputClass} placeholder="e.g. General Assembly 2026" />
            </Field>
            <Field label="Organizer" htmlFor={`${formId}-org`} hint="Shown above the event name." className="sm:col-span-2">
              <input id={`${formId}-org`} type="text" value={form.org} onChange={set("org")} className={inputClass} />
            </Field>
            <Field label="Description" htmlFor={`${formId}-desc`} className="sm:col-span-2">
              <textarea id={`${formId}-desc`} required maxLength={5000} value={form.description} onChange={set("description")} className={textareaClass} placeholder="What happens, who it's for, what to bring." />
            </Field>
          </FormSection>

          <FormSection title="Date and place">
            <Field label="Starts on" htmlFor={`${formId}-date`}>
              <input id={`${formId}-date`} required type="date" value={form.date} onChange={set("date")} className={inputClass} />
            </Field>
            <Field label="Start time" htmlFor={`${formId}-time`}>
              <input id={`${formId}-time`} required type="time" value={form.time} onChange={set("time")} className={inputClass} />
            </Field>
            <Field label="Ends on" htmlFor={`${formId}-enddate`} optional hint="For events that run over several days.">
              <input id={`${formId}-enddate`} type="date" min={form.date || undefined} value={form.endDate} onChange={set("endDate")} className={inputClass} />
            </Field>
            <Field label="End time" htmlFor={`${formId}-endtime`} optional>
              <input id={`${formId}-endtime`} type="time" value={form.endTime} onChange={set("endTime")} className={inputClass} />
            </Field>
            <Field label="Location" htmlFor={`${formId}-location`} optional className="sm:col-span-2">
              <input id={`${formId}-location`} type="text" value={form.location} onChange={set("location")} className={inputClass} placeholder="e.g. DLSL Auditorium" />
            </Field>
          </FormSection>

          <FormSection title="Poster">
            <ImageField
              id={`${formId}-image`}
              label="Event poster"
              optional
              hint="Shown in the event details. JPEG, PNG, WebP, GIF or AVIF, up to 5 MB."
              folder="events"
              value={form.image}
              onChange={(url) => setForm((f) => ({ ...f, image: url }))}
              onBusyChange={trackUpload}
            />
          </FormSection>

          <FormSection title="Links">
            <Field label="Registration link" htmlFor={`${formId}-link`} optional className="sm:col-span-2">
              <input id={`${formId}-link`} type="url" value={form.link} onChange={set("link")} className={inputClass} placeholder="https://forms.gle/…" />
            </Field>
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
