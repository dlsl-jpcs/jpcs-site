# JPCS Site — Supabase Backend Summary

Backend for the existing Next.js 16 site, built on Supabase (PostgreSQL + Auth + Storage).
The frontend design, routes and layouts are unchanged; the data layer behind them was replaced.

> **Status:** implemented and verified against a **local** Supabase stack (Docker). It has **not** been
> deployed to a hosted Supabase project, because no project credentials exist in the repo. See
> [§10](#10-test-results-known-limitations-and-remaining-manual-setup) for exactly what was and wasn't tested.

---

## 1. Existing frontend and inferred backend requirements

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind 4. No Supabase client existed in the code.

**Starting point found in the repo**

- All public data and the admin dashboard went through Next.js API routes (`/api/...`) backed by an
  **in-memory placeholder** (`lib/mock-data.ts`, always empty, lost on restart).
- Admin login compared a password from `.env.local` and issued a self-signed JWT, with a hard-coded
  fallback secret (`"fallback_secret_for_development_only"`).
- `supabase/migrations/` held draft migrations that could not run: syntax errors (trailing commas, `ENABLE ROW;`),
  no image column for events, no timestamps, dates stored as `VARCHAR`, and no policies.
- `next.config.ts` allowed no remote images, so any hosted image would have crashed `next/image`.

**Frontend feature → data it needs**

| Feature (source) | Data the UI reads / writes | Table(s) |
|---|---|---|
| Hero "Upcoming Events" carousel (`Hero.tsx`, `events/*`) → `GET /api/upcomingEvents` | `org, title, date, time, description, link, image, facebook, instagram` | `upcoming_events` |
| "Our Projects" carousel (`ProjectsEvents.tsx`, `ProjectsCarousel.tsx`) → `GET /api/projects`, `GET /api/eventImagesMain` | `id, name, description, org, date (free text, e.g. "November 2023"), facebook, instagram`, cover image | `projects_and_events`, `projects_and_events_images` |
| Homepage gallery carousel (`Gallery.tsx`) → `GET /api/galleryMain` | `id, image_url, display_order` | `gallery_main` |
| Gallery page grid + lightbox (`GalleryContainer.tsx`, `GalleryModal.tsx`) → `GET /api/gallery` | `id, src, alt` (paginated client-side, 20/page) | `gallery` |
| Contact form (`Contact.tsx`) → `POST /api/contact` | `name, email, subject, message` | `contact_form` |
| Admin dashboard (`app/admin/*`) → `/api/admin/*` | CRUD for events, projects, gallery; inbox with read/unread + delete; login | all of the above + `profiles` |

**Inferred decisions (from evidence in the code)**

- **No extra "status/featured/slug" columns.** Nothing in the UI uses them. "Upcoming" is derived from the date.
- **Projects keep a free-text `project_date`** because the admin form asks for "e.g. November 2023".
- **Event date + time → one `timestamptz` (`starts_at`)**, interpreted in `Asia/Manila` (no DST). The admin form's
  separate date/time inputs and the card's display strings are converted in `lib/site.ts`.
- **Messages use `is_read` (boolean)**, not new/read/resolved, because the inbox only toggles read/unread.
- **Two gallery tables are kept** (homepage carousel vs. gallery page) as the original drafts intended.
- **Admin auth moved to Supabase Auth + `profiles.role`** (the drafts already included a `profiles` table).

---

## 2. Database schema and relationships

```
auth.users 1──1 profiles (role: user | admin)

projects_and_events 1──* projects_and_events_images   (ON DELETE CASCADE; cover = lowest display_order)

upcoming_events      (standalone)
gallery_main         (standalone, homepage carousel)
gallery              (standalone, gallery page)
contact_form         (standalone, write-only for the public)
storage.objects      bucket "media" (public read, admin write)
```

| Table | Columns (all `NOT NULL` unless "null") | Why |
|---|---|---|
| `upcoming_events` | `id` identity PK · `event_name` · `starts_at timestamptz` · `event_location` (null) · `event_description` · `registration_link` (null) · `organization_names` default `'JPCS'` · `facebook_link` (null) · `instagram_link` (null) · `image_url` (null) · `created_at` · `updated_at` | Hero cards. Links optional so empty values don't render dead buttons. `image_url` didn't exist in the drafts but the admin form and `Event` type use it. |
| `projects_and_events` | `id` · `project_name` · `project_description` · `project_date` (text) · `organization_names` default `'JPCS'` · `facebook_link` (null) · `instagram_link` (null) · `created_at` · `updated_at` | Projects carousel. |
| `projects_and_events_images` | `id` · `project_id` FK→projects (cascade) · `image_url` · `alt_text` default `''` · `display_order` default 1 · `created_at` · `UNIQUE(project_id, display_order)` | Separate table so a project can hold several images; UI shows the lowest `display_order` as cover. |
| `gallery_main` | `id` · `image_url` · `alt_text` · `display_order` · `created_at` | Homepage carousel. |
| `gallery` | `id` · `image_url` · `alt_text` · `display_order` · `created_at` | Gallery page (`alt_text` feeds the lightbox `alt`). |
| `contact_form` | `id` · `fullname` · `email` · `subject` · `message` · `is_read` default false · `ip_hash` (null) · `created_at` | Matches the 4 form fields; `is_read` for the inbox; `ip_hash` (salted SHA-256) only for rate limiting. |
| `profiles` | `id` UUID PK FK→auth.users (cascade) · `email` (null) · `role` `'user'|'admin'` default `'user'` · `created_at` | Authorisation source of truth. |

**Constraints:** length `CHECK`s on every text column (e.g. message ≤ 5000), `https?://` `CHECK`s on link columns,
email-format `CHECK` on `contact_form.email`, FK + `UNIQUE`, identity primary keys.
**Indexes:** `upcoming_events(starts_at)`, `projects_and_events(created_at desc)`, `projects_and_events_images(project_id, display_order)`,
`gallery_main(display_order, id)`, `gallery(display_order, id desc)`, `contact_form(created_at desc)`,
`contact_form(lower(email), created_at desc)`, partial `contact_form(ip_hash, created_at desc)`.

---

## 3. SQL migrations and RLS policies

All files are in [`supabase/migrations/`](supabase/migrations). Sample data is in [`supabase/seed.sql`](supabase/seed.sql)
(local `db reset` only; clearly labelled `[SAMPLE]`; never pushed to a hosted project).

| File | Purpose |
|---|---|
| `20260917150022_create_upcoming_events_table.sql` | `upcoming_events` |
| `20260917150720_create_projects_and_events_table.sql` | `projects_and_events` |
| `20260917151321_create_projects_and_events_images_table.sql` | `projects_and_events_images` |
| `20260921061942_create_gallery_main_table.sql` | `gallery_main` |
| `20260921062146_create_gallery_table.sql` | `gallery` |
| `20260921062313_create_contact_form_table.sql` | `contact_form` |
| `20260921065453_create_profiles_table.sql` | `profiles` |
| `20260921070130_create_rls_policies.sql` | `is_admin()`, `updated_at` + new-user + contact rate-limit triggers, grants, RLS policies |
| `20261011000000_create_media_storage.sql` | `media` bucket + storage policies |

> **About the rewritten drafts.** The original draft migrations contained SQL syntax errors, so
> `supabase db reset/push` could never have gotten past the first file. I therefore fixed them in place (same filenames,
> same table names) instead of stacking `ALTER`s on top of tables that could never have existed.
> **If you ever pasted those drafts into a hosted project's SQL editor by hand, tell me before running `db push`**
> so we can migrate instead of re-creating. Nothing in these migrations drops or truncates data.

### Access matrix (enforced by grants **and** RLS)

| Table | anon (public) | authenticated, non-admin | admin (`profiles.role='admin'`) |
|---|---|---|---|
| `upcoming_events`, `projects_and_events`, `projects_and_events_images`, `gallery`, `gallery_main` | SELECT | SELECT | SELECT, INSERT, UPDATE, DELETE |
| `contact_form` | INSERT only the 5 submitted columns, `is_read` must be false | same as anon, no reads | SELECT (all columns except `ip_hash`), UPDATE `is_read`, DELETE |
| `profiles` | none | SELECT own row | SELECT all; **no one** can write through the API |
| `storage.objects` (`media`) | read by public URL, **no listing, no upload** | none | list, upload, update, delete |

Key functions: `is_admin()` (`SECURITY DEFINER`, `search_path=''`), `handle_new_user()` (creates a `'user'` profile),
`set_updated_at()`, `contact_form_rate_limit()` (max 3 messages / email / hour and 5 / ip_hash / hour; raises `rate_limited`).

---

## 4. Supabase client configuration and environment variables

| Variable | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` / hosting env | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` / hosting env | The anon (or publishable) key. Safe for browsers; RLS protects the data |
| `CONTACT_IP_SALT` | hosting env (optional) | Random string salting the stored IP hash |

A template is in [`.env.example`](.env.example). **The `service_role` key is not used anywhere** in this app, and must
never be added to it.

Clients (follows the empty `utils/supabase/` folder already in your project, the standard Next.js layout):

- [`utils/supabase/server.ts`](utils/supabase/server.ts) — the single request-scoped client (`@supabase/ssr`), anon key + visitor cookies.
- [`utils/supabase/middleware.ts`](utils/supabase/middleware.ts) — session refresh + admin check used by `proxy.ts`.
- No browser Supabase client exists on purpose: the browser only calls this app's `/api/*` routes.

---

## 5. Frontend files created or modified

**Created**

| File | Purpose |
|---|---|
| `utils/supabase/server.ts`, `utils/supabase/middleware.ts` | Supabase clients |
| `lib/admin.ts` | `requireAdmin()` guard for `/api/admin/*` |
| `lib/site.ts` | Time-zone helpers (Asia/Manila) |
| `lib/validation.ts` | Input sanitising, URL allow-list for images, storage path helper |
| `lib/projects.ts` | Row → `Project` mapper |
| `types/database.ts` | Table row types |
| `app/api/admin/upload/route.ts` | Admin image upload to Storage |
| `components/admin/ImageUploadButton.tsx` | "Upload" button used in admin forms |
| `supabase/seed.sql`, `supabase/migrations/20261011000000_create_media_storage.sql` | Seed + storage |
| `.env.example`, `BACKEND_SUMMARY.md` | Docs/config |

**Modified**

| File | Change |
|---|---|
| `app/api/upcomingEvents`, `projects`, `eventImagesMain`, `gallery`, `galleryMain`, `contact` `/route.ts` | Mock data → Supabase; response shapes unchanged |
| `app/api/admin/{auth,events,projects,gallery,messages}/route.ts` | Mock/JWT → Supabase Auth + RLS, validation |
| `proxy.ts` (was `middleware.ts`) | Cookie-JWT check → Supabase session + admin role check |
| `next.config.ts` | Allow Supabase Storage images (host derived from env) |
| `components/Hero.tsx`, `Gallery.tsx`, `ProjectsEvents.tsx` | Handle error/empty responses; fixed relative `fetch("api/galleryMain")` |
| `components/events/Events.tsx` | Empty state ("No upcoming events right now") — the carousel crashed on zero events |
| `components/events/EventCard.tsx` | Hide Register/Facebook/Instagram links that are empty |
| `components/Contact.tsx` | Invisible honeypot field (no visual change) |
| `app/admin/events`, `projects`, `gallery` `/page.tsx` | Upload button; Facebook/Instagram inputs (the data was displayed but couldn't be entered); alt text + "Homepage Carousel / Gallery Page" switch for the gallery |
| `supabase/config.toml` | Public sign-ups disabled |
| `package.json` | + `@supabase/supabase-js`, `@supabase/ssr`; − `jose` |
| `.gitignore` | `.env.example` is trackable |

**Removed:** `lib/mock-data.ts`, `lib/auth.ts` (self-signed JWT with fallback secret).

---

## 6. How each module talks to Supabase

All browser code still calls the same `/api/*` endpoints; the route handlers call Supabase with the visitor's own
credentials, so **RLS is the real gatekeeper**.

| Module | Endpoint | Supabase operation |
|---|---|---|
| Upcoming events | `GET /api/upcomingEvents` | `upcoming_events` where `starts_at >= start of today (Manila)` order by `starts_at` asc; formats `date`/`time` strings |
| Projects | `GET /api/projects`, `GET /api/eventImagesMain` | `projects_and_events` + embedded images; cover = lowest `display_order` |
| Gallery | `GET /api/galleryMain`, `GET /api/gallery` | `gallery_main` / `gallery` ordered by `display_order`; mapped to `{id, src, alt}` |
| Contact | `POST /api/contact` | Validates, honeypot, hashes IP, `INSERT` as anon (no read-back) |
| Admin login | `POST/DELETE /api/admin/auth` | `signInWithPassword` + `is_admin()` check; non-admins are signed out |
| Admin CRUD | `/api/admin/events|projects|gallery|messages` | `requireAdmin()` then RLS-bound `insert/update/delete/select` |
| Admin upload | `POST /api/admin/upload` | `storage.from('media').upload`, returns public URL |

Failure behaviour: public endpoints return `{ data: [], error }` with HTTP 500, and the components treat that as empty
(existing loading/empty UI is kept; the gallery page shows its existing error text).

---

## 7. Storage

- Bucket **`media`**: public read, 5 MiB limit, JPEG/PNG/WebP/GIF/AVIF only (created by migration, idempotent).
- Only admins can upload/replace/delete (storage RLS). Anonymous users can fetch a file by URL but cannot list the bucket.
- **Upload procedure:** Admin → Events / Projects / Gallery → *Add* → **Upload** button (calls `POST /api/admin/upload`, folder
  `events|projects|gallery`, random UUID filename) → the public URL fills the *Image URL* field → *Save*.
- The database stores the public URL (`image_url`); the object path is derived from it, so deleting a record (or replacing
  an event/project image) also deletes the file.
- Image URLs are validated server-side: only this project's storage URLs or site-relative paths (e.g. `/jpcslogo.png`)
  are accepted, because `next/image` would otherwise crash the public page on unknown hosts.

---

## 8. Setup and run instructions

### Local development (verified)

```bash
npm install
npx supabase start            # needs Docker; prints local URL + keys
npx supabase db reset         # applies all migrations + seed.sql to the LOCAL database
# .env.local
#   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:55321
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key printed by `supabase start`>
npm run dev
```

Create a local admin: Studio (http://127.0.0.1:55323) → Authentication → *Add user* (tick auto-confirm), then in the SQL editor:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

### Hosted project (not yet done — needs your values)

1. Create a project at supabase.com. From **Project Settings → API** copy the **Project URL** and **anon/publishable key**.
2. `npx supabase login` then `npx supabase link --project-ref <ref>` then `npx supabase db push`.
3. **Authentication → Providers → Email:** turn **off** "Allow new users to sign up". Set **Site URL** to your domain.
4. **Authentication → Users → Add user** (auto-confirm) for each admin, then run the `update public.profiles ...` SQL above.
5. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `CONTACT_IP_SALT` in your hosting provider's environment.
6. Remove the obsolete `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env.local`; they are no longer used.
   (That password was displayed while auditing this repo; retire it if it is used anywhere else.)

---

## 9. Security measures

- **RLS enabled on every table**, plus explicit least-privilege `GRANT`s (everything revoked first). Public gets read-only on
  content and insert-only on `contact_form`.
- **Roles can't be self-assigned:** no API-writable path to `profiles`; promotion is done by SQL only. New users always get `'user'`.
- **Admin enforced three times:** `proxy.ts` (pages), `requireAdmin()` (API handlers), and RLS (database/storage).
  Hiding admin UI is not relied on.
- **Server-validated Auth:** uses `auth.getUser()` (verified with the Auth server), not the unverified cookie.
- **Removed** the self-signed JWT with a hard-coded fallback secret and default `admin@test.com / password123` fallback.
- **Contact form:** DB `CHECK`s (email format, length), column-level insert grant, `is_read` forced false by policy, honeypot,
  hashed (salted) IP, DB-trigger rate limit (3/email/h, 5/IP/h), no read-back. The `ip_hash` column is not readable even by admins via the API.
- **Uploads:** admin only, type allow-list, 5 MiB cap (checked in app and bucket), random filenames, no bucket listing.
- **Inputs:** explicit field whitelists (extra JSON keys are ignored), URL scheme checks, integer ID parsing.
- **No service-role key** anywhere; `NEXT_PUBLIC_*` values are public by design.
- **Local** Auth sign-ups disabled in `config.toml` (hosted: step 3 above).

---

## 10. Test results, known limitations, and remaining manual setup

### Checks I actually ran

| Check | Result |
|---|---|
| `npx tsc --noEmit` | Pass |
| `npm run build` (Next 16 production build) | Pass, all 26 pages/routes generated |
| ESLint on files I created/changed (`app/api`, `utils`, `lib`, `proxy.ts`, `components/admin`, `Contact`, `Hero`, `Events`, `EventCard`, `next.config.ts`) | Clean |
| `supabase db reset` — all 9 migrations + seed on a fresh local Postgres 17 | Applied with no errors |
| Public endpoints (`upcomingEvents`, `projects`, `eventImagesMain`, `gallery`, `galleryMain`) against seeded DB | Correct shapes; event date/time formatted ("October 25, 2026", "11:45 AM") |
| Admin gating: `/admin` redirect without session (307); admin API 401 without session; wrong password 401; **valid non-admin account 401 and signed out**; admin login 200; logout invalidates | Pass |
| Admin CRUD: events (create/update/delete, 14:30 round-trips as "2:30 PM"), projects (cover image create/replace/clear/delete), gallery (both tables), messages (read toggle, delete by `id` or `form_id`) | Pass |
| Validation: external image host rejected, bad email rejected, non-image upload rejected | Pass |
| Storage: admin upload → public URL fetches (200); file removed when event image is replaced (then 400) | Pass |
| Contact: valid message saved; invalid email 400; honeypot silently dropped (not stored); 4th message from same email → 429 | Pass |
| **Direct PostgREST/Storage attacks as `anon`:** read `contact_form`, insert with `is_read=true`, bad email, 6000-char message, write/delete/update content, read `profiles`, upload to storage | All denied (401/403/400); anon read of public content allowed; bucket listing returns nothing |
| **Same as a signed-in non-admin user:** self-promote to admin, insert into `profiles`, write events, delete gallery rows (0 rows affected), read messages/`ip_hash`, upload to storage | All denied; data confirmed intact afterwards |

### Not tested / needs you

- **No hosted Supabase project was configured or tested**; everything above ran against the local Docker stack.
- **No visual/browser check** of the rendered pages (carousels, lightbox, admin modals). I verified HTML responses and API
  payloads, not the pixels. Please click through Home, Gallery, Contact and the admin pages once.
- No automated test suite exists in the repo and I did not add one; verification was done with scripted HTTP/SQL calls.
- Full `npm run lint` still reports 9 errors / 11 warnings in the **admin pages** (`any` types, unused `err`). These
  patterns existed before my changes; I did not rewrite those pages.

### Known limitations

- **Contact spam protection is not bulletproof.** Rate limits live in the DB and key on email and a client-supplied IP hash;
  a determined attacker could rotate both. For stronger protection add Cloudflare Turnstile/hCaptcha or your host's WAF rate limiting.
- **Project create/update is not one transaction** (project row, then cover image row). On a cover-image failure during
  create the project is removed again; on update, the project may save while the image step reports an error.
- Replacing a *gallery* image through `PUT` does not delete the old file (the admin UI only adds/deletes gallery images).
- A file uploaded and then abandoned (modal cancelled) stays in the bucket. Periodically clean `media/` if this matters.
- Row types in `types/database.ts` are hand-written. Once linked to a project you can generate them with
  `npx supabase gen types typescript --linked > types/supabase.ts`.
- Event time is assumed to be `Asia/Manila`; change `SITE_TIME_ZONE`/offset in `lib/site.ts` if that ever changes.
- The Programs pages and Officers still use static data (`data/programs.ts`, `data/officers.json`). They were out of scope.
- Next.js 16 renamed `middleware` to `proxy`; this repo now uses `proxy.ts`.
- Dev-only `images.dangerouslyAllowLocalIP` is on outside production so local Storage images (127.0.0.1) render; it is off in production.

### Remaining manual steps

1. Create the hosted Supabase project and follow §8 (link, `db push`, disable sign-ups, add admin user, promote via SQL, set env vars).
2. Optionally add Turnstile/WAF for the contact form.
3. Delete the obsolete `ADMIN_EMAIL`/`ADMIN_PASSWORD` entries from `.env.local`.
4. Click through the site once in a browser, locally and after deploy.
