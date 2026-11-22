# Kintsugi website — design brief (OpenDesign)

Base folder: /Users/p0is0n/GitHub/kintsugi-tools
Current live site: website/site/ (index.html, paperscope.html, about.html),
deployed by GitHub Pages to https://kintsugi.tools.

---

Design the new marketing website for Kintsugi — a small company building
local-first developer tools. Work from this folder as the base:
/Users/p0is0n/GitHub/kintsugi-tools — the current live site is
website/site/ (index.html, paperscope.html, about.html), deployed by
GitHub Pages to https://kintsugi.tools.

## The company

Name: Kintsugi (GitHub org: kintsugi-tools). Named after the Japanese art
of repairing broken pottery with gold — beauty in what's been broken and
mended. Let that metaphor carry the design: a thin gold "seam" as the
signature accent, used sparingly (section transitions, the logo mark,
citation highlights).

## Three products (facts must stay accurate)

1. **Kintsugi** — a safety layer for AI coding agents. It sits between
   agents and your shell: warns before destructive commands run, makes
   them reversible with one-command undo, and keeps a tamper-evident,
   hash-chained record of everything every agent did. 100% local.
   Install: `curl -fsSL https://kintsugi.tools/install.sh | sh`
2. **Paper** — local-first AI document search with exact citations: every
   answer names the file, page and line it came from. One binary: CLI +
   MCP server. PDF, DOCX, 15+ formats, OCR for scans, 100+ languages, no
   cloud, no API keys, no telemetry. Zero-touch: first run installs its
   own background service, models and index.
   Install: `curl -fsSL https://kintsugi.tools/paper.sh | sh`
3. **Oryn** — a safe, Rust-native accelerator for Cargo test suites. Runs
   only the tests your change can affect, skips ones it can prove are
   unchanged, scores flaky tests with real statistics. Warm runs up to
   ~1,200× faster, never by risking a wrong result. No AI, no nightly.
   Install: `cargo install oryn`

## What to design

A dense, premium product site (Linear/Vercel/Stripe grade — the current
site is close; push it further, do not make it airy). Structure: a home
page presenting the company and the three products, one page per product
with hero → proof → install, and an about page. Dark section(s) allowed
for code/terminal content.

## Motion and video are part of the design

- Section reveals on scroll, one signature scroll-driven sequence (the
  gold seam "repairing" a crack), and controlled easing on every
  transition. Reduced-motion users get a static, complete experience.
- Short, silent, muted, autoplay-looped product clips (a terminal running
  a `paper search`, the kintsugi approval queue, the oryn TUI) wherever a
  static mock exists today. Self-hosted as small compressed mp4/webm
  under site/assets/ (under ~5 MB each, `playsinline`, poster image,
  lazy-loaded). No external video hosting.

## Hard constraints

- Static HTML/CSS/JS only, no build step, no runtime framework; files
  live at the root of website/site/ and deploy as-is.
- These exact URLs must keep working at the same paths: /paperscope.html
  (crates.io links to it), /paper.sh, /install.sh, /about.html, and the
  CNAME file must stay.
- Every install command gets a one-line copy button — commands are short
  and must be copied exactly.
- Keep the {G_ANALYTICS_TAG} placeholder in the HTML head; it is injected
  at deploy time.
- MIT OR Apache-2.0, local-first, no telemetry — say it, don't hide it.

## Start with

The home page: brand mark with the gold seam, one-sentence company pitch,
the three products as strong cards with their real install commands, then
a "why local-first" section. Desktop first, but show me mobile early.
Read the product READMEs in ../paperscope, ../kintsugi, ../oryn for the
real feature lists before writing any copy — no invented features.
