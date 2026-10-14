"use client";

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { errorMessage, useToast } from "./ui";

/**
 * Up/down reordering for an admin list. A move updates the list at once, then saves the whole
 * order to `endpoint` ({ ids }). Saves run one after another so the last click wins on the server;
 * if one fails the list is reloaded with `onFailure`. Pass `group` to `move` when only part of the
 * list is shown together (e.g. one category): the item swaps with its neighbour inside the group.
 */
export function useReorder<T extends { id: number; name: string }>({
  items,
  setItems,
  endpoint,
  onFailure,
}: {
  items: T[];
  setItems: Dispatch<SetStateAction<T[]>>;
  endpoint: string;
  onFailure: () => void | Promise<void>;
}) {
  const [saving, setSaving] = useState(0);
  const [announce, setAnnounce] = useState("");
  const chain = useRef<Promise<void>>(Promise.resolve());
  const refocus = useRef<{ id: number; dir: "up" | "down" } | null>(null);
  const toast = useToast();

  // Reordering moves the row's DOM node, which drops keyboard focus; put it back.
  useEffect(() => {
    const target = refocus.current;
    if (!target) return;
    refocus.current = null;
    const get = (dir: string) => document.getElementById(`move-${dir}-${target.id}`) as HTMLButtonElement | null;
    const mine = get(target.dir);
    (mine && !mine.disabled ? mine : get(target.dir === "up" ? "down" : "up"))?.focus();
  }, [items]);

  const move = (id: number, delta: -1 | 1, group: T[] = items) => {
    const at = group.findIndex((x) => x.id === id);
    const neighbour = group[at + delta];
    if (at < 0 || !neighbour) return;

    const a = items.findIndex((x) => x.id === id);
    const b = items.findIndex((x) => x.id === neighbour.id);
    const next = [...items];
    [next[a], next[b]] = [next[b], next[a]];
    setItems(next);
    refocus.current = { id, dir: delta < 0 ? "up" : "down" };
    setAnnounce(`${items[a].name} moved to position ${at + delta + 1} of ${group.length}`);
    setSaving((n) => n + 1);

    const ids = next.map((x) => x.id);
    chain.current = chain.current.then(async () => {
      try {
        const res = await fetch(endpoint, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        });
        if (!res.ok) throw new Error(await errorMessage(res, "Couldn't save the new order. Try again."));
      } catch (err) {
        toast(err instanceof Error ? err.message : "Couldn't reach the server. Check your connection and try again.", "error");
        await onFailure(); // show what the server actually has
      } finally {
        setSaving((n) => n - 1);
      }
    });
  };

  return { move, saving, announce };
}
