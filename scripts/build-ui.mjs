import { readFileSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';
import { build } from 'esbuild';

export const ROOT = resolve(import.meta.dirname, '..');
export const CSS_DIR = join(ROOT, 'src/ui/styles');
export const TEMPLATE = join(ROOT, 'src/ui/index.html');
export const ENTRY = join(ROOT, 'src/ui/main.ts');
export const OUTPUT = join(ROOT, 'ui.html');

export const CSS_ORDER = [
  'theme.css',
  'base.css',
  'header.css',
  'analysis-card.css',
  'export-btn.css',
  'format-density.css',
  'modals.css',
  'optimize.css',
  'toast.css',
];

export async function buildUI() {
  const dsCssRaw = readFileSync(
    join(ROOT, 'node_modules/figma-plugin-ds/dist/figma-plugin-ds.css'),
    'utf8'
  );

  const dsCss = dsCssRaw.replace(
    /@font-face\s*\{[^}]*src:\s*url\("https:\/\/rsms\.me\/inter\/font-files\/Inter-(Regular|Medium|SemiBold)\.woff2[^}]*\}\s*/g,
    ''
  );

  const fontFaces = `
@font-face { font-family: 'Inter'; font-weight: 400; font-style: normal; src: local('Inter'), local('Inter-Regular'), local('Inter UI'), local('InterUI-Regular'); }
@font-face { font-family: 'Inter'; font-weight: 500; font-style: normal; src: local('Inter-Medium'), local('Inter Medium'), local('InterUI-Medium'); }
@font-face { font-family: 'Inter'; font-weight: 600; font-style: normal; src: local('Inter-SemiBold'), local('Inter SemiBold'), local('InterUI-SemiBold'); }
`;

  const customCss = CSS_ORDER
    .map((f) => readFileSync(join(CSS_DIR, f), 'utf8'))
    .join('\n');

  const css = fontFaces + '\n' + dsCss + '\n' + customCss;

  const jsResult = await build({
    entryPoints: [ENTRY],
    bundle: true,
    target: ['es2020'],
    format: 'iife',
    write: false,
    minify: false,
  });

  const js = jsResult.outputFiles[0].text;

  const html = readFileSync(TEMPLATE, 'utf8')
    .replace('/*__CSS__*/', css)
    .replace('/*__JS__*/', js);

  writeFileSync(OUTPUT, html, 'utf8');
  console.log(`Built ${OUTPUT}`);
}

buildUI().catch((err) => {
  console.error(err);
  process.exit(1);
});
