// ============================================================================
// Экспортер — выполнение экспорта узлов через Figma API
// ============================================================================

import type { ExportFormat, ExportConstraint } from '../shared/types';

const LOCALES = {
  en: {
    exportDone: 'Export complete',
    exportError: 'Export error',
  },
  ru: {
    exportDone: 'Экспорт завершён',
    exportError: 'Ошибка экспорта',
  },
} as const;

let currentLocale: 'en' | 'ru' = 'en';

export function setExporterLocale(locale: string): void {
  currentLocale = locale.startsWith('ru') ? 'ru' : 'en';
}

function buildExportSettings(format: ExportFormat, constraint: ExportConstraint): ExportSettings {
  if (format === 'SVG') return { format: 'SVG' };
  if (format === 'PNG') return { format: 'PNG', constraint };
  return { format: 'JPG', constraint };
}

/**
 * Выполняет экспорт узлов в заданном формате с указанным ограничением.
 * Для каждого узла отправляет export-result (байты для скачивания),
 * по завершении — export-complete (переход на шаг оптимизации).
 */
export async function performExport(
  nodes: readonly SceneNode[],
  format: ExportFormat,
  constraint: ExportConstraint
): Promise<void> {
  const settings = buildExportSettings(format, constraint);

  try {
    for (const node of nodes) {
      const bytes = await node.exportAsync(settings);
      figma.ui.postMessage({
        type: 'export-result',
        bytes,
        format,
        filename: `${node.name}.${format.toLowerCase()}`,
      });
    }

    figma.ui.postMessage({ type: 'export-complete', format });
    figma.notify(LOCALES[currentLocale].exportDone);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    figma.ui.postMessage({
      type: 'export-error',
      message: `${LOCALES[currentLocale].exportError}: ${message}`,
    });
  }
}
