// ============================================================================
// Экспортер — выполнение экспорта узлов через Figma API
// ============================================================================

import type { ExportFormat, ExportConstraint } from '../shared/types';

/**
 * Выполняет экспорт узлов в заданном формате с указанным ограничением.
 * Отправляет результат (байты) в UI для скачивания.
 */
export async function performExport(
  nodes: readonly SceneNode[],
  format: ExportFormat,
  constraint: ExportConstraint
): Promise<void> {
  try {
    for (const node of nodes) {
      let exportSettings: ExportSettings;

      if (format === 'SVG') {
        exportSettings = { format: 'SVG' };
      } else if (format === 'PNG') {
        exportSettings = {
          format: 'PNG',
          constraint,
        };
      } else {
        exportSettings = {
          format: 'JPG',
          constraint,
        };
      }

      const bytes = await node.exportAsync(exportSettings);

      figma.ui.postMessage({
        type: 'export-result',
        bytes,
        format,
        filename: `${node.name}.${format.toLowerCase()}`,
      });
    }

    figma.notify('Экспорт завершён!');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    figma.ui.postMessage({
      type: 'export-error',
      message: `Ошибка экспорта: ${message}`,
    });
  }
}
