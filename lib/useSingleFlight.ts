import { useCallback, useRef, useState } from "react";

/**
 * Runs one async action at a time. Calls made while an action is still in flight are
 * dropped, so double-clicks or a repeated Enter can't send the same request twice.
 * The ref is the real guard: `pending` state only updates on the next render, which is
 * too late to stop a second click that lands in the same frame.
 */
export function useSingleFlight() {
  const busyRef = useRef(false);
  const [pending, setPending] = useState(false);

  const run = useCallback(async (action: () => Promise<void>) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setPending(true);
    try {
      await action();
    } finally {
      busyRef.current = false;
      setPending(false);
    }
  }, []);

  return [pending, run] as const;
}
