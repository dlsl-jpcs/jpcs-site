"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, ChevronDown, ChevronUp, Loader2, X, XCircle } from "lucide-react";
import { useModalA11y } from "@/lib/useModalA11y";

/* ---------------------------------------------------------------- styles */

export const panelClass = "rounded-panel border border-zinc-200 bg-white";

export const inputClass =
  "block w-full h-10 rounded-control border border-zinc-300 bg-white px-3 text-[15px] text-navy placeholder:text-zinc-400 transition-colors hover:border-zinc-400 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15 disabled:bg-zinc-50 disabled:text-zinc-500";

export const selectClass = `${inputClass} pr-8`;

export const textareaClass = inputClass.replace("h-10", "min-h-32 py-2.5 leading-relaxed resize-y");

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";

/* --------------------------------------------------------------- buttons */

type Variant = "primary" | "secondary" | "danger" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-neon text-navy hover:bg-neon-hover",
  secondary: "border border-zinc-300 bg-white text-navy hover:bg-zinc-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-zinc-600 hover:bg-zinc-100 hover:text-navy",
};

export function Button({
  variant = "primary",
  loading = false,
  className = "",
  type = "button",
  disabled,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean }) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-control px-4 text-sm font-bold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${focusRing} ${variants[variant]} ${className}`}
    >
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

/** Square icon-only button for table rows. `label` is read out and shown as a tooltip. */
export function IconButton({
  label,
  tone = "default",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; tone?: "default" | "danger" }) {
  return (
    <button
      {...props}
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-control transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${focusRing} ${
        tone === "danger"
          ? "text-zinc-500 hover:bg-red-50 hover:text-red-600"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-navy"
      } ${className}`}
    >
      {children}
    </button>
  );
}

/** Up/down arrows around the item's position number. Pair with useReorder (it refocuses by id). */
export function ReorderControl({
  id,
  name,
  position,
  count,
  onMove,
}: {
  id: number;
  name: string;
  position: number;
  count: number;
  onMove: (delta: -1 | 1) => void;
}) {
  const arrow =
    "flex h-6 w-8 items-center justify-center rounded-control text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent";
  return (
    <div className="flex flex-col items-center" role="group" aria-label={`Order of ${name}`}>
      <button type="button" id={`move-up-${id}`} onClick={() => onMove(-1)} disabled={position === 1} aria-label={`Move ${name} up`} title="Move up" className={arrow}>
        <ChevronUp size={17} aria-hidden="true" />
      </button>
      <span className="text-xs leading-5 font-bold tabular-nums text-navy" aria-hidden="true">{position}</span>
      <button type="button" id={`move-down-${id}`} onClick={() => onMove(1)} disabled={position === count} aria-label={`Move ${name} down`} title="Move down" className={arrow}>
        <ChevronDown size={17} aria-hidden="true" />
      </button>
    </div>
  );
}

/* ----------------------------------------------------------------- forms */

export function Field({
  label,
  htmlFor,
  hint,
  optional,
  className = "",
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-navy">
        {label}
        {optional && <span className="ml-1.5 font-normal text-zinc-500">Optional</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[13px] leading-snug text-zinc-500">{hint}</p>}
    </div>
  );
}

/** A titled group of fields inside a form. */
export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-zinc-200 pt-5 first:border-t-0 first:pt-0">
      <legend className="float-left mb-4 w-full text-[13px] font-bold text-zinc-500">{title}</legend>
      <div className="clear-left grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

/* ---------------------------------------------------------------- layout */

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[1.75rem] leading-tight font-extrabold tracking-tight text-navy sm:text-[2rem]">
          {title}
        </h1>
        {description && <p className="mt-1.5 max-w-prose text-[15px] text-zinc-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
        {icon}
      </div>
      <p className="font-bold text-navy">{title}</p>
      {body && <p className="mt-1 max-w-sm text-sm text-zinc-500">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function SkeletonRows({ rows = 3 }: { rows?: number }) {
  return (
    <div className="divide-y divide-zinc-100" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4 sm:px-5">
          <div className="h-11 w-11 shrink-0 animate-pulse rounded-control bg-zinc-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/2 animate-pulse rounded bg-zinc-200" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Small square image for list rows, with an icon when there's no image. */
export function ListThumb({
  url,
  fallback,
  anchorTop = false,
}: {
  url: string;
  fallback: ReactNode;
  /** Keep the top of the photo in frame, for portraits. */
  anchorTop?: boolean;
}) {
  return (
    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-control bg-zinc-100 text-zinc-400">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- small admin thumbnail of any stored URL
        <img src={url} alt="" className={`h-full w-full object-cover ${anchorTop ? "object-top" : ""}`} loading="lazy" />
      ) : (
        fallback
      )}
    </div>
  );
}

/** Filter switch, e.g. Upcoming / Past. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; count?: number }[];
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-control bg-zinc-200/70 p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`flex h-8 items-center gap-2 rounded-[0.45rem] px-3 text-sm font-semibold transition-colors ${focusRing} ${
              active ? "bg-white text-navy shadow-sm" : "text-zinc-600 hover:text-navy"
            }`}
          >
            {o.label}
            {o.count !== undefined && (
              <span className="text-xs tabular-nums text-zinc-500">{o.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------- modal */

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  dismissible = true,
  closeOnBackdrop = false,
  size = "lg",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: ReactNode;
  /** false while saving, so the dialog can't be closed mid-request */
  dismissible?: boolean;
  /** Forms keep this off so a stray click outside doesn't throw away typing. */
  closeOnBackdrop?: boolean;
  size?: "sm" | "lg";
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useModalA11y(open, ref);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissible) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismissible, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-navy/60 sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (closeOnBackdrop && dismissible && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`flex max-h-[94dvh] w-full flex-col rounded-t-panel bg-white text-navy shadow-2xl outline-none sm:max-h-[90dvh] sm:rounded-panel ${
          size === "sm" ? "sm:max-w-md" : "sm:max-w-2xl"
        }`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-zinc-200 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-extrabold tracking-tight">
              {title}
            </h2>
            {description && <p className="mt-0.5 text-sm text-zinc-500">{description}</p>}
          </div>
          <IconButton label="Close" onClick={onClose} disabled={!dismissible} className="-mr-2 -mt-1">
            <X size={20} />
          </IconButton>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">{children}</div>
        {footer && (
          <footer className="flex flex-col-reverse gap-2 border-t border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}

/* --------------------------------------------------------- toast/confirm */

type ToastTone = "success" | "error";
type Toast = { id: number; tone: ToastTone; message: string };
type ConfirmOptions = {
  title: string;
  message: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
};

const ToastContext = createContext<(message: string, tone?: ToastTone) => void>(() => {});
const ConfirmContext = createContext<(options: ConfirmOptions) => Promise<boolean>>(
  async () => false,
);

/** Shows a short status message in the corner, e.g. toast("Event saved"). */
export const useToast = () => useContext(ToastContext);
/** Asks before a destructive action; resolves true when the person confirms. */
export const useConfirm = () => useContext(ConfirmContext);

export function AdminProviders({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const [confirmState, setConfirmState] = useState<
    (ConfirmOptions & { resolve: (ok: boolean) => void }) | null
  >(null);

  const dismiss = useCallback((id: number) => {
    setToasts((all) => all.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, tone: ToastTone = "success") => {
      const id = ++nextId.current;
      setToasts((all) => [...all.slice(-2), { id, tone, message }]);
      setTimeout(() => dismiss(id), tone === "error" ? 7000 : 4000);
    },
    [dismiss],
  );

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => setConfirmState({ ...options, resolve })),
    [],
  );

  const settle = (ok: boolean) => {
    confirmState?.resolve(ok);
    setConfirmState(null);
  };

  return (
    <ToastContext.Provider value={toast}>
      <ConfirmContext.Provider value={confirm}>
        {children}

        <Modal
          open={confirmState !== null}
          onClose={() => settle(false)}
          title={confirmState?.title ?? ""}
          size="sm"
          closeOnBackdrop
          footer={
            <>
              <Button variant="secondary" onClick={() => settle(false)} data-autofocus>
                {confirmState?.cancelLabel ?? "Cancel"}
              </Button>
              <Button variant="danger" onClick={() => settle(true)}>
                {confirmState?.confirmLabel}
              </Button>
            </>
          }
        >
          <div className="text-[15px] leading-relaxed text-zinc-600">{confirmState?.message}</div>
        </Modal>

        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[110] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6">
          {toasts.map((t) => (
            <div
              key={t.id}
              role={t.tone === "error" ? "alert" : "status"}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-control bg-navy px-4 py-3 text-sm text-white shadow-xl"
            >
              {t.tone === "error" ? (
                <XCircle size={18} className="mt-px shrink-0 text-red-400" aria-hidden="true" />
              ) : (
                <CheckCircle2 size={18} className="mt-px shrink-0 text-neon" aria-hidden="true" />
              )}
              <p className="flex-1 font-medium">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="-mr-1 rounded text-white/60 hover:text-white focus-visible:outline-2 focus-visible:outline-neon"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </ConfirmContext.Provider>
    </ToastContext.Provider>
  );
}

/** Reads `{ error }` from a failed API response, falling back to a generic message. */
export async function errorMessage(res: Response, fallback: string) {
  const body = await res.json().catch(() => null);
  if (res.status === 401) return "Your session has ended. Sign in again to continue.";
  return (body && typeof body.error === "string" && body.error) || fallback;
}
