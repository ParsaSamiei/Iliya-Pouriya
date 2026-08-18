# 07 — Admin Panel

## Purpose

A custom, private admin panel is how both of you manage all content: projects, experience, skills, blog posts, resumes, and viewing contact messages. No third-party CMS.

## Auth

- **Auth.js (NextAuth)**, Credentials provider — email + password against the `admins` table (`05_DATABASE.md`).
- Passwords hashed with bcrypt/argon2, never stored plain.
- Session via Auth.js's default JWT/session cookie handling.
- **No public sign-up.** Admin accounts are seeded manually (a one-off script or migration), never created through a UI form.
- `/admin/**` (except `/admin/login`) is protected by middleware that checks the session server-side — not a client-side redirect. Unauthenticated requests to any admin route should never leak admin data even momentarily.

```
/middleware.ts → checks session for /admin/* (excluding /admin/login), redirects to /admin/login if absent
```

## Structure

- `/admin/dashboard` — quick overview: counts of projects/posts, recent unread contact messages, quick links.
- `/admin/people` — edit each person's own profile: name (en/fa), title, photo, bio (en/fa), and **per-person social links** (github, linkedin, email, etc. — see `05_DATABASE.md`'s `social_links` field). This is where Iliya's and Pouriya's individual GitHub links get set, independent of each other.
- `/admin/projects` — list + create/edit/delete. Fields per `05_DATABASE.md`'s `projects` table, with a contributor picker (checkbox for each person), bilingual fields (`en`/`fa` tabs in the same form), image/gallery upload, and STL model upload (see below).
- `/admin/experience` — per-person timeline CRUD, simple ordered list with drag-to-reorder or manual `sort_order`.
- `/admin/skills` — per-person skill CRUD, grouped by category (hardware/software/other).
- `/admin/blog` — post CRUD, same bilingual-tab pattern as projects, author picker.
- `/admin/messages` — read-only list of contact submissions, mark-as-read, filter by recipient.
- `/admin/resume` — upload/replace resume PDF per person, per locale if applicable.
- `/admin/settings` — site-wide key/value content (`site_settings` table): homepage tagline, contact page copy, shared social links.

## Bilingual content editing

Every content form (projects, blog, experience, skills where applicable) presents `en`/`fa` fields together — e.g. as tabs within one form, not two separate forms — so nothing gets published in only one language by accident. Consider a visible "missing translation" indicator per field.

## Rich text

- Project/blog long-form content needs a rich text editor, not a plain textarea. A lightweight option (e.g. Tiptap) that outputs clean HTML or JSON is enough — avoid a heavyweight page-builder-style editor; this is a content field, not a layout tool.
- Editor must support RTL input for the `fa` fields.

## File uploads

- Images/video/PDFs/STLs uploaded through admin forms are written to the local-disk volume (`05_DATABASE.md`), under a structure like `/var/app-data/uploads/{projects,blog,resumes,profiles,models}/{uuid}-{filename}`.
- Validate file type/size server-side before writing to disk (images: jpg/png/webp; video: mp4/webm, with a sensible size cap or a nudge toward linking an external host like YouTube/Vimeo for anything long-form; resumes: pdf; STL models: `.stl` only).
- On delete/replace, remove the old file from disk to avoid orphaned files accumulating — or, simpler for v1, leave orphaned files and add a cleanup script later rather than building this into the critical path.

### STL model uploads

- Within a project's edit form, an "Models" section lets you attach one or more `.stl` files, each with a bilingual label (`name_en`/`name_fa` — e.g. "Full assembly" / "Gripper arm"), reorderable via `sort_order`.
- Validate the upload is actually a parseable STL server-side (not just a `.stl` extension check) before writing it and creating the `project_models` row — catches corrupted exports early rather than surfacing a broken viewer to site visitors.
- Enforce a max file size (recommend starting around 20–30 MB per model — STL viewers on a portfolio site should load quickly; nudge toward decimated/print-resolution exports rather than full CAD-tolerance meshes, and mention this limit in the upload UI so it's not a confusing rejection).
- After upload, the project detail page's STL viewer (`06_FRONTEND_ARCHITECTURE.md`) picks these up automatically — no separate publish step beyond saving the project.

## Contact messages

- Contact form submissions write to `contact_messages`. Optionally also send an email notification (e.g. via SMTP/Resend) so you don't have to keep the admin panel open to know a message arrived — recommended, since checking `/admin/messages` manually will get missed.

## Permissions

- v1 has exactly two admin accounts, both with full access to everything — no role/permission system needed at this scale. Don't build granular RBAC; it's unnecessary complexity for two trusted co-owners.
