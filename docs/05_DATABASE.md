# 05 — Database

## Stack

- **Postgres**, self-hosted (Docker container alongside the app, per `09_DEVELOPMENT_GUIDELINES.md`)
- **Prisma ORM (v7 — see `09_DEVELOPMENT_GUIDELINES.md`)** — declarative schema file (`schema.prisma`), type-safe generated client, mature migration tooling (`prisma migrate`), and Prisma Studio for quickly poking at data during development — a good fit for a two-person team that wants a well-documented, low-friction ORM rather than hand-rolled SQL
- Migrations checked into the repo (`/prisma/migrations`), applied via `prisma migrate deploy` in production — never hand-edit the schema on the server

## Core tables

### `admins`
Login for the two of you (Auth.js credentials provider reads from here).
- `id` (uuid, pk)
- `email` (unique)
- `password_hash`
- `created_at`

### `people`
The two profile owners.
- `id` (uuid, pk)
- `slug` (unique, used in `/team/[person]`)
- `name`
- `title` — e.g. "Embedded Systems Engineer"
- `photo_url`
- `bio_en`, `bio_fa` (long text)
- `resume_url_en`, `resume_url_fa` (nullable — resume may be single-language)
- `social_links` (jsonb: `{github, linkedin, email, ...}`)
- `sort_order`

Seed data (the only two rows this table will ever have — see the note on contributors below):

| `slug` | `name` (en) | `name` (fa) |
|---|---|---|
| `iliya` | Iliya Zahedi Abghari | ایلیا زاهدی عبقری |
| `pouriya` | Pouriya Afshari Moghadam | پوریا افشاری مقدم |

### `experience`
Per-person work timeline.
- `id` (uuid, pk)
- `person_id` (fk → people)
- `role_en`, `role_fa`
- `organization`
- `start_date`, `end_date` (nullable = present)
- `description_en`, `description_fa`
- `sort_order`

### `skills`
Per-person skills/tools.
- `id` (uuid, pk)
- `person_id` (fk → people)
- `name`
- `category` — enum: `hardware` | `software` | `other`
- `sort_order`

### `projects`
Shared portfolio pieces.
- `id` (uuid, pk)
- `slug` (unique)
- `title_en`, `title_fa`
- `summary_en`, `summary_fa`
- `content_en`, `content_fa` (rich text, stored as HTML/JSON from the editor)
- `cover_image_url`
- `gallery` (jsonb array of media URLs)
- `tags` (jsonb array of strings, or a separate `project_tags` join table if filtering needs grow)
- `external_links` (jsonb: `{github, demo, publication, ...}`)
- `is_featured` (bool)
- `published_at` (nullable = draft)
- `sort_order`

### `project_models`
3D/STL models attached to a project (a project may have zero, one, or several — e.g. a full assembly plus individual printed parts).
- `id` (uuid, pk)
- `project_id` (fk → projects)
- `name_en`, `name_fa` — label shown in the viewer's model picker if a project has more than one
- `file_url` — path to the `.stl` file on local disk (see File uploads below)
- `file_size_bytes`
- `sort_order`

### `project_contributors`
Many-to-many between projects and people.
- `project_id` (fk → projects)
- `person_id` (fk → people)
- primary key on `(project_id, person_id)`

### `blog_posts`
- `id` (uuid, pk)
- `slug` (unique)
- `title_en`, `title_fa`
- `excerpt_en`, `excerpt_fa`
- `content_en`, `content_fa`
- `cover_image_url`
- `published_at` (nullable = draft)
- `tags` (jsonb array)

### `blog_post_authors`
Many-to-many, same pattern as `project_contributors`.
- `post_id` (fk → blog_posts)
- `person_id` (fk → people)

### `contact_messages`
- `id` (uuid, pk)
- `name`
- `email`
- `message`
- `recipient` — nullable, which person it's addressed to, or null for "both"
- `created_at`
- `read_at` (nullable)

### `site_settings`
Single-row (or key/value) table for global content that isn't per-entity — homepage tagline, contact-page copy, social links used site-wide, etc. Key/value jsonb is simplest:
- `key` (pk)
- `value_en`, `value_fa` (jsonb or text)

## Bilingual content pattern

Every user-facing text field is duplicated per locale (`_en`/`_fa`) directly on the row, rather than a separate translations table. For a two-person, low-volume content site this is simpler to build the admin forms against and simpler to query — a normalized i18n table only pays off at a content volume this project won't reach. Revisit only if a third language gets added later.

## File uploads

Media (project images/galleries, resumes, profile photos, STL models) are stored on local disk on the VPS under a persisted volume (e.g. `/var/app-data/uploads`), referenced by URL path in the DB (`cover_image_url`, `project_models.file_url`, etc.) — not in Postgres itself, and not on object storage. See `09_DEVELOPMENT_GUIDELINES.md` for the volume/backup setup and `07_ADMIN_PANEL.md` for the upload flow.

STL files are binary geometry, not images — they don't get run through `next/image` or any image optimization pipeline. Store them under their own subpath (e.g. `/uploads/models/{uuid}.stl`) and cap file size in the admin upload validation (`07_ADMIN_PANEL.md`) since raw STL exports can be large; encourage exporting print-resolution rather than CAD-tolerance meshes for anything meant for the web viewer.

## Indexes worth adding early

- `projects.slug`, `blog_posts.slug`, `people.slug` — unique, used for routing lookups
- `projects.published_at`, `blog_posts.published_at` — for index/listing queries filtering to published content
- `project_models.project_id` — every project detail page load queries its models
