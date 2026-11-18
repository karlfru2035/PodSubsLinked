# PodSubsLinked

The PodSubs app prototype. One self-contained file, `index.html`, published with GitHub Pages from `main`.

Current version: V19 (2026-11-18). 1,321 screens. V19 swaps the landing page for the approved round 7 landing; every other screen is unchanged.

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
