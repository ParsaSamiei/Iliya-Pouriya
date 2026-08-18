# 02 — Brand Identity

## Direction

Dark, technical/engineering. The site should feel like it was built by people who design circuit boards and control systems — precise, structured, a little schematic — not like a generic "creative agency" dark-mode template.

## Mood references

- Blueprint/schematic drawings: thin grid lines, dimension marks, monospace annotations
- PCB silkscreen aesthetics: fine traces, pads, connector-style dividers
- Oscilloscope/terminal UI: monospace readouts, subtle scanline or grid textures used sparingly
- Avoid: neon cyberpunk clichés, overly "gamer" RGB gradients, stock-photo robots

## Color palette

Dark-first: dark is the default theme visitors see, and light is a fully supported secondary option — not an afterthought, but not the primary presentation either. A first-time visitor's theme follows their OS/browser preference (`prefers-color-scheme`); if that can't be detected, they see dark. Once someone picks a theme explicitly via the toggle, their choice sticks regardless of OS setting.

- **Background:** near-black, slightly blue/graphite (e.g. `#0B0E12` base, `#12161C` surface)
- **Foreground/text:** off-white, not pure white (e.g. `#E6E9EC`)
- **Accent (primary):** a single confident accent — circuit-trace copper/amber or PCB-silkscreen green, pick one as *the* signature color (e.g. amber `#F2A93B` or signal-green `#4ADE80`)
- **Secondary accent:** a cool blue for links/interactive states, distinct from primary
- **Borders/grid lines:** low-opacity foreground (e.g. `rgba(230,233,236,0.08)`) for the blueprint-grid feel
- **Semantic:** standard success/warning/error, desaturated to fit the dark palette

Exact hex values get finalized as design tokens in `04_DESIGN_SYSTEM.md` — this section sets direction, that one sets the source of truth.

## Light theme

The light theme is the same brand, not a different one — same accent color, same typography, same blueprint/circuit motifs, just inverted for a bright surface instead of dark. Concretely:

- **Background:** off-white/paper, not stark white (e.g. `#F5F6F7`), to keep the "technical drafting paper" feel rather than a generic bright UI
- **Foreground/text:** near-black, not pure black (e.g. `#14171B`)
- **Accent:** the same signature accent color as dark mode, adjusted in lightness/saturation only as needed for contrast — the brand's identity is the accent color, and it shouldn't change between themes
- **Blueprint grid/trace motifs:** carry over at low opacity against the light background the same way they do against dark — the schematic feel should read in both themes, not be a dark-mode-only flourish

## Typography

- **Headings/display:** a technical/geometric sans (e.g. Space Grotesk, IBM Plex Sans) — structured, slightly mechanical
- **Body:** a clean, highly legible sans (e.g. Inter, IBM Plex Sans) — must have solid Latin *and* Persian/Arabic glyph coverage, or pair with a matching Persian-friendly face (e.g. Vazirmatn) for `fa` locale
- **Monospace (for code, specs, labels, timestamps):** IBM Plex Mono or JetBrains Mono — used deliberately for technical details (project specs, tool versions, coordinates), reinforcing the engineering feel

Persian typography note: pick the Persian typeface pairing now (e.g. Vazirmatn for body/headings in `fa`) so `04_DESIGN_SYSTEM.md` can define per-locale font tokens from the start rather than bolting it on later.

## Imagery style

- Project photos/videos of actual hardware and builds — real photos, not stock imagery
- Diagrams: schematics, wiring diagrams, CAD renders, block diagrams treated as first-class content, not just screenshots
- Subtle background motifs: faint grid/blueprint lines, circuit-trace line art as section dividers — decorative, never competing with content

## Voice and tone

- Direct, technically precise, no marketing fluff ("we engineer robust embedded systems" > "we're passionate about innovation")
- First person plural where shared ("we built"), first person singular on individual bio/experience sections
- Comfortable with technical jargon — the audience is other engineers and technical recruiters
- Bilingual tone should match: professional and precise in both `en` and `fa`, not a stiff literal translation — see `i18n/README.md` for translation workflow

## Logo / mark (placeholder guidance)

If no formal logo exists yet, a simple wordmark in the monospace or display face, paired with a small circuit-node/trace glyph, is enough for v1. Treat as a placeholder to revisit once the two of you have content live and can see what fits.
