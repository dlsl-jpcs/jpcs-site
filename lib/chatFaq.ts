import type { ChatFaqRow } from "@/types/database";

/** Database row -> the shape the admin uses. `name` is what useReorder announces. */
export function toFaq(row: ChatFaqRow) {
  return {
    id: row.id,
    name: row.question,
    question: row.question,
    answer: row.answer,
    keywords: row.keywords ?? "",
    active: row.is_active,
  };
}

export type Faq = ReturnType<typeof toFaq>;
