import { watchFile, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { buildUI, ROOT, TEMPLATE } from './build-ui.mjs';

function watchDir(dirPath, onChange) {
  try {
    const entries = readdirSync(dirPath);
    for (const entry of entries) {
      const fullPath = join(dirPath, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        watchDir(fullPath, onChange);
      } else if (stat.isFile()) {
        const ext = extname(entry);
        if (ext === '.ts' || ext === '.css' || ext === '.html') {
          watchFile(fullPath, { interval: 500 }, () => {
            onChange();
          });
        }
      }
    }
  } catch {
    // directory may not exist yet
  }
}

console.log('Watching src/ui/ for changes...');
buildUI();

const uiDir = join(ROOT, 'src/ui');
watchDir(uiDir, buildUI);
watchFile(TEMPLATE, { interval: 500 }, buildUI);
