# website

Marketing site for the Kintsugi tools family — deployed to
https://kintsugi.tools by GitHub Pages.

- `site/` — the static site (HTML/CSS/SVG, installer scripts `paper.sh`
  and `install.sh`). Product pages: `/` (Kintsugi), `/paperscope.html`
  (Paper), `/about.html`.
- `.github/workflows/pages.yml` — deploy on push to `main`.

The product repos contain no site files; this repo is the single home of
the website. Content changes deploy automatically.
