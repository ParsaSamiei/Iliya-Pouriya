# 04 — Design System

## Foundation

Tailwind CSS v4, CSS-first configuration. No `tailwind.config.js` — theme lives in CSS via `@theme` in `app/globals.css`. Both dark and light themes are supported, switched via a `.dark`/`.light` class on `<html>` (see Theming below), with locale-based font overrides layered on top the same way.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* static tokens shared by both themes */
  --font-display: "Space Grotesk", "Vazirmatn", sans-serif;
  --font-body:    "Inter", "Vazirmatn", sans-serif;
  --font-mono:    "IBM Plex Mono", monospace;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}

/* Dark theme — the default/primary presentation */
:root,
.dark {
  --color-bg:          #0B0E12;
  --color-surface:     #12161C;
  --color-fg:          #E6E9EC;
  --color-fg-muted:    #9AA3AD;
  --color-accent:      #F2A93B; /* signature accent — finalize with brand */
  --color-accent-fg:   #14110A;
  --color-link:        #5B9DF9;
  --color-border:      rgba(230,233,236,0.08);
  --color-success:     #4ADE80;
  --color-warning:     #F2C94C;
  --color-error:       #EF5350;
}

/* Light theme — same brand, inverted surface */
.light {
  --color-bg:          #F5F6F7;
  --color-surface:     #FFFFFF;
  --color-fg:          #14171B;
  --color-fg-muted:    #5C6570;
  --color-accent:      #C8811A; /* same hue as dark accent, deepened for contrast on a light surface */
  --color-accent-fg:   #FFFFFF;
  --color-link:        #2563EB;
  --color-border:      rgba(20,23,27,0.08);
  --color-success:     #16A34A;
  --color-warning:     #B45309;
  --color-error:       #DC2626;
}

[dir="rtl"] {
  --font-display: "Vazirmatn", sans-serif;
  --font-body: "Vazirmatn", sans-serif;
}
```

Exact hex values above are placeholders derived from `02_BRAND_IDENTITY.md` — lock these in during initial design pass, then treat as fixed tokens; don't let components introduce one-off colors. Components must reference the CSS variables/Tailwind tokens (`bg-[--color-bg]`, or mapped Tailwind color names) — never a raw hex — so both themes stay correct automatically.

## Theming (dark default, light supported)

- Use `next-themes` for the toggle mechanism: class-based (`attribute="class"`), with `defaultTheme="dark"` and `enableSystem={true}`. If the visitor has no saved preference yet, follow their OS/browser `prefers-color-scheme`; if that can't be determined (or `next-themes` falls back), default to dark rather than light. Once the visitor explicitly picks a theme via the toggle, that choice always wins over the OS setting from then on.
- A theme toggle (sun/moon icon button, shadcn `button` + `dropdown-menu` or a simple two-state switch) lives in the site header, persists the visitor's choice (localStorage, handled by `next-themes`), and is available on every public page.
- Admin panel: dark by default same as the public site; a toggle there too is a nice-to-have, not a requirement — don't spend extra effort making the admin panel's light mode as polished as the public site's.
- First paint must not flash the wrong theme: `next-themes` handles this via a blocking inline script — make sure it's wired up in the root layout, not skipped for convenience.

## Spacing & layout

- Use Tailwind's default spacing scale; don't add a custom one unless a real gap shows up.
- Max content width: `max-w-6xl` for standard pages, `max-w-4xl` for long-form text (blog posts, project descriptions) to keep line length readable in both scripts.
- Section rhythm: consistent vertical spacing token (e.g. `py-24` between major homepage sections) — define as a reusable pattern, not repeated magic numbers.

## Component library: shadcn/ui

- Install via `npx shadcn@latest init`, on Base UI primitives (shadcn's current default as of mid-2026) rather than legacy Radix-only setup.
- Pull components as needed (`button`, `card`, `dialog`, `form`, `input`, `textarea`, `badge`, `avatar`, `table`, `tabs`, `dropdown-menu`, `sonner` for toasts) rather than installing everything up front.
- Because components are copied into the repo (not an npm dependency), re-skin them once using the tokens above rather than overriding classes per-usage.
- **RTL:** shadcn/ui (on Base UI) supports RTL — verify every pulled component in `dir="rtl"` before considering it integrated. Logical Tailwind properties (`ps-4`/`pe-4`/`start-`/`end-` instead of `pl-4`/`pr-4`/`left-`/`right-`) are mandatory, not optional, throughout custom code.

## Signature visual motifs (brand → implementation)

- **Blueprint grid background:** a low-opacity SVG/CSS grid pattern on hero/section backgrounds using `--color-border` — works in both themes since `--color-border` is theme-aware.
- **Circuit-trace dividers:** thin SVG line-art dividers between sections instead of plain `<hr>`s, sparingly — use `currentColor` or `--color-border` so they invert correctly with the theme.
- **Monospace metadata:** dates, tags, tool/version labels rendered in `--font-mono`, slightly smaller and muted — reinforces the "technical readout" feel site-wide (project specs, timestamps, skill tags).
- **Schematic-style icons:** prefer line-icon sets (e.g. Lucide, which shadcn ships with by default) over filled/glyph icons, consistent with the blueprint aesthetic.

## Theme priority

Dark is the primary, default, and most-designed-for theme — it's what the brand direction in `02_BRAND_IDENTITY.md` is built around, and where the blueprint/circuit motifs are expected to look best. Light is a fully functional secondary theme (same tokens, same components, same motifs, inverted surface), not a stripped-down fallback — but when a new component or visual treatment is being designed, design it dark-first and verify it against light second.

## Responsive breakpoints

Use Tailwind defaults (`sm`/`md`/`lg`/`xl`/`2xl`). Mobile-first. Admin panel can be desktop-optimized (it's just the two of you), but the public site must be fully usable on mobile.

## Accessibility baseline

- Color contrast: verify `--color-fg` on `--color-bg` and `--color-accent-fg` on `--color-accent` meet WCAG AA **in both themes** — the light theme's accent was deepened specifically for this; don't reuse the dark accent value as-is on a light background.
- All interactive components keyboard-navigable (shadcn/Base UI gives this by default — don't break it with custom overrides).
- Theme toggle itself must be keyboard-operable and clearly labeled (not icon-only with no accessible name).
- Respect `prefers-reduced-motion` for any decorative animation (grid/trace motifs, transitions, theme-switch transition).
