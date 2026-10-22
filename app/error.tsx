"use client";

import { useEffect } from "react";
import ErrorScreen, { errorSecondaryButton } from "@/components/ErrorScreen";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorScreen
      tag="// error 500 — something broke"
      lead="Something went"
      highlight="wrong"
      message="This page hit an unexpected error. Trying again often fixes it; if it keeps happening, let the officers know."
    >
      <button type="button" onClick={reset} className={errorSecondaryButton}>
        Try again
      </button>
    </ErrorScreen>
  );
}
