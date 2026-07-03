# 🎯 Export Advisor

**A smart Figma plugin that analyzes your layers and recommends the optimal export format (SVG, PNG, JPG), then points you to free optimization tools.**

Stop exporting vectors as PNGs and photos as SVGs. Export Advisor inspects your layer content and tells you the best format before you export.

---

## ✨ Features

- **Content-aware format recommendation** — detects vector graphics, raster imagery, and mixed content
- **Transparency & effects analysis** — checks node opacity, fill/stroke alpha, drop & inner shadows, layer & background blur, and masks
- **Suboptimal-format warning** — if your chosen format isn't ideal, a modal explains why and offers a one-click switch to the recommended format
- **PNG confirmation for raster images** — when PNG is chosen for content with raster image fills (alpha unknown), the plugin asks you to confirm whether transparency is really needed, or suggests JPG for a smaller file size
- **Pixel density controls** — 0.5×, 0.75×, 1×, 1.5×, 2×, 3×, 4×, 512w, 512h (density section is hidden for SVG)
- **Two-step workflow** — Export → Optimize, with a step indicator
- **Optimization service suggestions** — links to free online tools matched to the exported format
- **Multi-selection support** — analyses every selected node and aggregates a single overall recommendation
- **Bilingual UI** — Russian / English, auto-detected from `figma.currentUser.locale`
- **Light / Dark / Auto theme** — follows Figma's theme by default, with manual override

---

## 🧠 Format recommendation logic

The plugin inspects every node in the selection (including children) and aggregates a recommendation.

| Content type | Detected properties | Recommended format |
|---|---|---|
| Vector graphics | No raster image fills | **SVG** |
| Raster with transparency/effects | Node opacity < 1, fill/stroke alpha, drop/inner shadow, layer/background blur, mask | **PNG** |
| Raster with image fills (alpha unknown) | `IMAGE` fill, transparency not detected | **PNG** (recommended) — **JPG** acceptable |
| Raster, no transparency | None of the above | **JPG** |
| Mixed vector + raster | Any combination above | **PNG** (universal for both types) |

For raster nodes whose alpha channel can't be inspected (video, sticky, widget, embed, link unfurl), PNG is recommended.

---

## 🖥️ How it works

1. **Select one or more layers** in Figma
2. **Run Export Advisor** — it scans the selection and its children
3. **Pick a format and density** in the plugin panel
4. **Click Export**:
   - If the format is suboptimal, a warning modal shows: your current format, the recommended format, the reasons detected, and two buttons — **"Change format"** (applies the recommendation) and **"Continue as is"** (keeps your choice)
   - If you chose PNG for content with raster image fills and no detected transparency, a confirmation modal asks whether transparency is truly needed — with **"Confirm PNG"** and **"Switch to JPG"** buttons
5. **After export**, the plugin switches to the **Optimize** step and lists free online services matched to your exported format

### Optimization services we recommend

- 📐 [SVGOMG](https://jakearchibald.github.io/svgomg/) — SVG optimizer by Jake Archibald
- 🗜️ [TinyPNG](https://tinypng.com/) — Smart PNG and JPEG compression
- 🖼️ [Squoosh](https://squoosh.app/) — Google's image compression tool with visual comparison
- 🌐 [Compressor.io](https://compressor.io/) — Multi-format image compressor (lossless & lossy)

---

## 📦 Installation

### From Figma Community

1. Visit the [Export Advisor plugin page](#) in Figma Community
2. Click **"Try it out"**
3. The plugin appears in your **Plugins** menu

The build produces two generated files (git-ignored):
- `code.js` — plugin backend, bundled from `src/code.ts` via esbuild cli
- `ui.html` — plugin UI, assembled from `src/ui/` modules (CSS + TS + HTML template) via `scripts/build-ui.mjs`

To develop, point Figma Desktop at this folder via **Plugins → Development → Import plugin from manifest…**.
