# PodSubsLinked

The PodSubs app prototype. One self-contained file, `index.html`, published with GitHub Pages from `main`.

Current version: V18 (2026-11-17). 1,321 screens.

## Checks

Both need Playwright with Chromium.

```bash
node checks/screens.js "$PWD/index.html"
```

Draws every screen and fails on a draw error, a script error, or a link to a screen that does not exist.

```bash
node checks/phone.js "$PWD/index.html"
```

Draws the landing page and every V18 screen at 390 pixels wide and fails on sideways overflow.
