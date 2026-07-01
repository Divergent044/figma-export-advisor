# 🎯 Export Advisor

**A smart Figma plugin that recommends the optimal export format for your layers and suggests free image optimization tools.**

Stop exporting vectors as PNGs and photos as SVGs. Export Advisor analyzes your layer content and tells you the best format before you export.

---

## ✨ What it does

Export Advisor acts as your personal export assistant:

1. **Analyzes layer content** — detects whether it's vector graphics, raster imagery, or a mix of both
2. **Checks for special properties** — transparency, alpha fills, drop shadows, blur effects, and masks
3. **Recommends the optimal format** — based on what's actually inside your layers
4. **Suggests optimization tools** — points you to free online services to compress your exported files

### Format recommendation logic

| Content type | Properties | Recommended format |
|---|---|---|
| Vector graphics | No raster fills | **SVG** |
| Any content | Transparency, shadows, blur, masks | **PNG** |
| Raster / mixed | No transparency or effects | **JPG** |

---

## 🖥️ How it works

1. Select a layer in Figma
2. Run Export Advisor
3. The plugin scans your layer and its children
4. If your current export format isn't optimal — you'll see a friendly warning with:
    - What format you're using now
    - What format would be better and why
    - **"Close and change format"** button — to go back and fix it
    - **"Continue export"** button — to keep your current choice
5. After export, get recommendations for free optimization services

### Optimization services we recommend

- 🖼️ [Squoosh](https://squoosh.app) — Google's image compression tool
- 🗜️ [TinyPNG](https://tinypng.com) — Smart PNG and JPEG compression
- 📐 [SVGOMG](https://jakearchibald.github.io/svgomg/) — SVG optimizer by Jake Archibald
- 🌐 [Compressor.io](https://compressor.io) — Multi-format image compressor

---

## 📦 Installation

### From Figma Community

1. Visit the [Export Advisor plugin page](#) in Figma Community
2. Click **"Try it out"**
3. The plugin appears in your **Plugins** menu

### Local development

```bash
# Clone the repository
git clone https://github.com/your-username/export-advisor.git
cd export-advisor

# Install dependencies
npm install

# Build the plugin
npm run build

# For development with auto-rebuild
npm run watch
