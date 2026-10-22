"use client";
import { useCallback, useEffect, useId, useState, type ChangeEvent } from "react";
import { HelpCircle, MessageSquareText, Pencil, Plus, Trash2 } from "lucide-react";
import { useReorder } from "@/components/admin/useReorder";
import {
  Button,
  EmptyState,
  Field,
  FormSection,
  IconButton,
  Modal,
  PageHeader,
  ReorderControl,
  Segmented,
  SkeletonRows,
  errorMessage,
  inputClass,
  panelClass,
  textareaClass,
  useConfirm,
  useToast,
} from "@/components/admin/ui";
import type { Faq } from "@/lib/chatFaq";
import { useSingleFlight } from "@/lib/useSingleFlight";
import type { ChatQuestionRow } from "@/types/database";

type Tab = "faq" | "questions";
type QuestionFilter = "unanswered" | "all";
type FaqForm = Omit<Faq, "id" | "name">;

const emptyForm = (question = ""): FaqForm => ({ question, answer: "", keywords: "", active: true });

const SOURCE_LABEL: Record<ChatQuestionRow["source"], string> = {
  llm: "AI",
  search: "FAQ search",
  none: "No answer",
};

const askedAt = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Manila",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default function ChatbotManagement() {
  const [tab, setTab] = useState<Tab>("faq");
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [faqLoading, setFaqLoading] = useState(true);
  const [faqError, setFaqError] = useState("");
  const [questions, setQuestions] = useState<ChatQuestionRow[]>([]);
  const [filter, setFilter] = useState<QuestionFilter>("unanswered");
  const [qLoading, setQLoading] = useState(true);
  const [qError, setQError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [fromQuestion, setFromQuestion] = useState<ChatQuestionRow | null>(null);
  const [form, setForm] = useState<FaqForm>(emptyForm());
  const [saving, runSave] = useSingleFlight();
  const [busyId, setBusyId] = useState<number | null>(null);
  const toast = useToast();
  const confirm = useConfirm();
  const formId = useId();

  const fetchFaqs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/chat-faq");
      if (!res.ok) throw new Error(await errorMessage(res, "Couldn't load FAQs."));
      setFaqs((await res.json()).data ?? []);
      setFaqError("");
    } catch (err) {
      setFaqError(err instanceof Error ? err.message : "Couldn't load FAQs.");
    } finally {
      setFaqLoading(false);
    }
  }, []);

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/chat-questions?filter=${filter}`);
      if (!res.ok) throw new Error(await errorMessage(res, "Couldn't load questions."));
      setQuestions((await res.json()).data ?? []);
      setQError("");
    } catch (err) {
      setQError(err instanceof Error ? err.message : "Couldn't load questions.");
    } finally {
      setQLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  useEffect(() => {
    setQLoading(true);
    fetchQuestions();
  }, [fetchQuestions]);

  const { move, saving: orderSaving, announce } = useReorder({
    items: faqs,
    setItems: setFaqs,
    endpoint: "/api/admin/chat-faq/reorder",
    onFailure: fetchFaqs,
  });

  const openForm = (faq: Faq | null, question?: ChatQuestionRow) => {
    setEditing(faq);
    setFromQuestion(question ?? null);
    setForm(faq ? { question: faq.question, answer: faq.answer, keywords: faq.keywords, active: faq.active } : emptyForm(question?.question));
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (!saving) setIsFormOpen(false);
  };

  const set = (key: "question" | "answer" | "keywords") => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const deleteQuestions = async (ids: number[]) => {
    const res = await fetch("/api/admin/chat-questions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error(await errorMessage(res, "Couldn't delete. Try again."));
    setQuestions((list) => list.filter((q) => !ids.includes(q.id)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSave(async () => {
      const isEdit = editing !== null;
      try {
        const res = await fetch("/api/admin/chat-faq", {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(isEdit ? { ...form, id: editing.id } : form),
        });
        if (!res.ok) {
          toast(await errorMessage(res, "Couldn't save the FAQ. Try again."), "error");
          return;
        }
        setIsFormOpen(false);
        toast(isEdit ? "FAQ updated" : "FAQ added");
        fetchFaqs();
        // The gap is filled, so the visitor's question no longer needs to sit in the log.
        if (fromQuestion) await deleteQuestions([fromQuestion.id]).catch(() => {});
      } catch {
        toast("Couldn't reach the server. Check your connection and try again.", "error");
      }
    });
  };

  const handleDeleteFaq = async (faq: Faq) => {
    const ok = await confirm({
      title: "Delete this FAQ?",
      message: (
        <>
          The chatbot will stop using <strong className="font-semibold text-navy">{faq.question}</strong>. This can&apos;t be undone.
        </>
      ),
      confirmLabel: "Delete FAQ",
      cancelLabel: "Keep FAQ",
    });
    if (!ok) return;

    setBusyId(faq.id);
    try {
      const res = await fetch(`/api/admin/chat-faq?id=${faq.id}`, { method: "DELETE" });
      if (!res.ok) {
        toast(await errorMessage(res, "Couldn't delete the FAQ. Try again."), "error");
        return;
      }
      setFaqs((list) => list.filter((f) => f.id !== faq.id));
      toast("FAQ deleted");
    } catch {
      toast("Couldn't reach the server. Check your connection and try again.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const handleClearQuestions = async () => {
    const ok = await confirm({
      title: `Clear ${questions.length} question${questions.length === 1 ? "" : "s"}?`,
      message: "Removes every question shown in this list from the log. This can't be undone.",
      confirmLabel: "Clear list",
      cancelLabel: "Keep them",
    });
    if (!ok) return;
    try {
      await deleteQuestions(questions.map((q) => q.id));
      toast("Questions cleared");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't delete. Try again.", "error");
    }
  };

  const addButton = (
    <Button onClick={() => openForm(null)}>
      <Plus size={18} aria-hidden="true" /> Add FAQ
    </Button>
  );

  return (
    <div>
      <PageHeader
        title="Chatbot"
        description="The assistant in the corner of the website answers from events, projects, officers and programs automatically. Add FAQs for anything those don't cover, like how to join."
        action={tab === "faq" ? addButton : undefined}
      />

      <div className="mb-4">
        <Segmented<Tab>
          label="Chatbot section"
          value={tab}
          onChange={setTab}
          options={[
            { value: "faq", label: "FAQ", count: faqs.length },
            { value: "questions", label: "Visitor questions" },
          ]}
        />
      </div>

      {tab === "faq" ? (
        <>
          <div className="mb-3 flex h-5 items-center justify-end text-sm text-zinc-500" aria-hidden={orderSaving === 0}>
            {orderSaving > 0 ? "Saving order…" : ""}
          </div>
          <p role="status" className="sr-only">{announce}</p>

          {faqLoading ? (
            <section className={`${panelClass} overflow-hidden`} aria-busy="true">
              <SkeletonRows rows={4} />
            </section>
          ) : faqError ? (
            <section className={panelClass}>
              <EmptyState
                icon={<HelpCircle size={22} />}
                title="FAQs didn't load"
                body={faqError}
                action={<Button variant="secondary" onClick={() => { setFaqLoading(true); fetchFaqs(); }}>Try again</Button>}
              />
            </section>
          ) : faqs.length === 0 ? (
            <section className={panelClass}>
              <EmptyState
                icon={<HelpCircle size={22} />}
                title="No FAQs yet"
                body="Start with what students ask most: how to join, membership fees, when meetings happen."
                action={addButton}
              />
            </section>
          ) : (
            <ul className={`${panelClass} divide-y divide-zinc-100 overflow-hidden`}>
              {faqs.map((faq, index) => (
                <li key={faq.id} className="grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-x-3 px-4 py-3 sm:gap-x-4 sm:px-5">
                  <ReorderControl id={faq.id} name={faq.question} position={index + 1} count={faqs.length} onMove={(delta) => move(faq.id, delta)} />
                  <div className="min-w-0">
                    <p className="truncate font-bold text-navy">
                      {faq.question}
                      {!faq.active && (
                        <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 align-middle text-[11px] font-semibold text-zinc-500">Hidden</span>
                      )}
                    </p>
                    <p className="line-clamp-2 text-sm text-zinc-600">{faq.answer}</p>
                  </div>
                  <div className="flex gap-0.5">
                    <IconButton label={`Edit ${faq.question}`} onClick={() => openForm(faq)}>
                      <Pencil size={17} />
                    </IconButton>
                    <IconButton label={`Delete ${faq.question}`} tone="danger" disabled={busyId === faq.id} onClick={() => handleDeleteFaq(faq)}>
                      <Trash2 size={17} />
                    </IconButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <Segmented<QuestionFilter>
              label="Show"
              value={filter}
              onChange={setFilter}
              options={[
                { value: "unanswered", label: "Couldn't answer" },
                { value: "all", label: "All" },
              ]}
            />
            {questions.length > 0 && (
              <Button variant="ghost" onClick={handleClearQuestions}>
                <Trash2 size={16} aria-hidden="true" /> Clear list
              </Button>
            )}
          </div>

          {qLoading ? (
            <section className={`${panelClass} overflow-hidden`} aria-busy="true">
              <SkeletonRows rows={4} />
            </section>
          ) : qError ? (
            <section className={panelClass}>
              <EmptyState
                icon={<MessageSquareText size={22} />}
                title="Questions didn't load"
                body={qError}
                action={<Button variant="secondary" onClick={() => { setQLoading(true); fetchQuestions(); }}>Try again</Button>}
              />
            </section>
          ) : questions.length === 0 ? (
            <section className={panelClass}>
              <EmptyState
                icon={<MessageSquareText size={22} />}
                title={filter === "unanswered" ? "No gaps right now" : "No questions yet"}
                body={
                  filter === "unanswered"
                    ? "Questions the chatbot couldn't answer show up here, so you know which FAQs to add."
                    : "Questions visitors ask the chatbot show up here."
                }
              />
            </section>
          ) : (
            <ul className={`${panelClass} divide-y divide-zinc-100 overflow-hidden`}>
              {questions.map((q) => (
                <li key={q.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 px-4 py-3 sm:px-5">
                  <div className="min-w-0">
                    <p className="break-words font-semibold text-navy">{q.question}</p>
                    <p className="text-[13px] text-zinc-500">
                      {askedAt.format(new Date(q.created_at))} · {q.unanswered ? "Couldn't answer" : `Answered by ${SOURCE_LABEL[q.source]}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Button variant="ghost" onClick={() => openForm(null, q)}>
                      <Plus size={16} aria-hidden="true" /> FAQ
                    </Button>
                    <IconButton
                      label={`Delete question: ${q.question}`}
                      tone="danger"
                      disabled={busyId === q.id}
                      onClick={async () => {
                        setBusyId(q.id);
                        try {
                          await deleteQuestions([q.id]);
                        } catch (err) {
                          toast(err instanceof Error ? err.message : "Couldn't delete. Try again.", "error");
                        } finally {
                          setBusyId(null);
                        }
                      }}
                    >
                      <Trash2 size={17} />
                    </IconButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <Modal
        open={isFormOpen}
        onClose={closeForm}
        dismissible={!saving}
        title={editing ? "Edit FAQ" : "Add FAQ"}
        description={fromQuestion ? "From a visitor's question. Rewrite it so it reads well, then answer it." : "The chatbot uses this word for word when someone asks something similar."}
        footer={
          <>
            <Button variant="secondary" onClick={closeForm} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form={formId} loading={saving}>
              {saving ? "Saving…" : editing ? "Save changes" : "Add FAQ"}
            </Button>
          </>
        }
      >
        <form id={formId} onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="FAQ">
            <Field label="Question" htmlFor={`${formId}-question`} className="sm:col-span-2">
              <input id={`${formId}-question`} data-autofocus required maxLength={300} type="text" value={form.question} onChange={set("question")} className={inputClass} placeholder="e.g. How do I become a member?" />
            </Field>
            <Field label="Answer" htmlFor={`${formId}-answer`} className="sm:col-span-2">
              <textarea id={`${formId}-answer`} required maxLength={2000} value={form.answer} onChange={set("answer")} className={textareaClass} placeholder="Keep it short; the chat window is small." />
            </Field>
            <Field
              label="Other words people might use"
              htmlFor={`${formId}-keywords`}
              optional
              hint="Helps the backup search when the AI is unavailable, e.g. join, sign up, register, membership."
              className="sm:col-span-2"
            >
              <input id={`${formId}-keywords`} maxLength={300} type="text" value={form.keywords} onChange={set("keywords")} className={inputClass} />
            </Field>
            <label className="flex items-center gap-2 text-sm font-medium text-navy sm:col-span-2">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="h-4 w-4 accent-navy" />
              Chatbot can use this answer
            </label>
          </FormSection>
        </form>
      </Modal>
    </div>
  );
}
