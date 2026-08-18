# 01 — Product

## Vision

A single portfolio site for two robotics & embedded systems engineers, positioned as a shared technical practice rather than two separate personal sites. Visitors should come away understanding what the two of you build, how you work, and how to reach you — in either English or Persian.

## Who this is for

- **Primary audience:** recruiters/hiring managers, potential clients or collaborators, conference/meetup organizers, academic contacts (given the publications section).
- **Secondary audience:** the two of you — this is also a living record of projects and experience you'll want to keep updated over years, not a one-off launch-and-forget site.

## The two personas (site owners)

- **Iliya Zahedi Abghari** (ایلیا زاهدی عبقری)
- **Pouriya Afshari Moghadam** (پوریا افشاری مقدم)

Fill in specifics per person, but structurally each profile needs:
- Name (English + Persian), title/focus area (e.g. "Embedded Systems" / "Robotics & Controls")
- Short bio
- Individual work-experience timeline
- Individual skills/tool stack
- Contact/social links

Projects and blog posts are **shared** — either person can be tagged as a contributor/author on any project or post, rather than each project belonging to a strict single owner.

## Goals

1. Present shared project work with enough technical depth to be credible to other engineers (not a marketing-only portfolio).
2. Give each person their own identity within a shared site (experience, skills, bio).
3. Be trivially easy for the two of you to update — new project, new blog post, updated resume — without touching code.
4. Serve both English and Persian-speaking audiences natively, including correct RTL layout.
5. Be fast, accessible, and good enough at SEO that project pages and blog posts are discoverable.

## Non-goals (v1)

- No e-commerce, no paid content, no user accounts for visitors.
- No real-time collaboration features.
- No third-party CMS — content lives in your own Postgres DB via the custom admin panel (see `07_ADMIN_PANEL.md`).
- No mobile app.

## Content sections (confirmed)

- Projects/portfolio pieces
- Work experience & timeline (per person)
- Skills & tools (hardware/software stack)
- Blog/articles
- Contact form (with backend, stores/forwards messages)
- Resume/CV download (per person, PDF)

## Success criteria

- Both of you can publish a new project or blog post through the admin panel in under 5 minutes, no developer involved.
- Site is fully usable and correctly laid out in both `en` and `fa`.
- Core pages (home, projects, individual profiles) load fast and pass basic Core Web Vitals thresholds.
- Contact form reliably delivers messages (visible in admin, ideally also emailed).
