// ============================================================================
// Валидатор формата экспорта
// Проверяет соответствие выбранного формата типу контента,
// формирует предупреждения и рекомендации
// ============================================================================

import type { ExportFormat, NodeAnalysis } from '../shared/types';
import { isFormatAllowed } from '../shared/format-allowed';
import {
  DESC_MIXED_CONTENT_SVG,
  DESC_MIXED_CONTENT_JPG,
  DESC_MIXED_CONTENT_PNG,
  DESC_VECTOR_NOT_SVG,
  DESC_RASTER_TRANSPARENCY_JPG,
  DESC_RASTER_TRANSPARENCY_SVG,
  DESC_RASTER_IMAGE_SVG,
  DESC_RASTER_NO_TRANSPARENCY_PNG,
  DESC_RASTER_NO_TRANSPARENCY_SVG,
  DESC_GENERIC_MISMATCH,
} from '../shared/i18n-keys';

// ============================================================================
// Проверка допустимости формата
// ============================================================================

/**
 * Проверяет, является ли выбранный формат допустимым
 * для данного результата анализа.
 * Делегирует в общий isFormatAllowed (shared/format-allowed.ts).
 */
export function isFormatAcceptable(format: ExportFormat, analysis: NodeAnalysis): boolean {
  return isFormatAllowed(analysis, format);
}

// ============================================================================
// Формирование описаний несовпадений
// ============================================================================

/**
 * Формирует текстовое описание причины несовпадения формата
 * для отображения в модальном окне предупреждения.
 * Корректно работает с мультивыделением: анализирует все узлы.
 */
export function getFormatMismatchDescription(
  selectedFormat: ExportFormat,
  analyses: NodeAnalysis[]
): string {
  const hasVector = analyses.some((a) => a.isVector);
  const hasTransparency = analyses.some((a) => a.hasTransparency);
  const hasImageFill = analyses.some((a) => a.hasImageFill);
  const hasRaster = analyses.some((a) => !a.isVector);
  const isMixedContent = hasVector && hasRaster;

  if (isMixedContent) {
    if (selectedFormat === 'SVG') return DESC_MIXED_CONTENT_SVG;
    if (selectedFormat === 'JPG') return DESC_MIXED_CONTENT_JPG;
    return DESC_MIXED_CONTENT_PNG;
  }

  if (hasVector && selectedFormat !== 'SVG') return DESC_VECTOR_NOT_SVG;

  if (hasTransparency && selectedFormat === 'JPG') return DESC_RASTER_TRANSPARENCY_JPG;
  if (hasTransparency && selectedFormat === 'SVG') return DESC_RASTER_TRANSPARENCY_SVG;

  if (hasImageFill && !hasTransparency && selectedFormat === 'SVG') return DESC_RASTER_IMAGE_SVG;

  if (!hasTransparency && !hasImageFill && selectedFormat === 'PNG') return DESC_RASTER_NO_TRANSPARENCY_PNG;
  if (!hasTransparency && !hasImageFill && selectedFormat === 'SVG') return DESC_RASTER_NO_TRANSPARENCY_SVG;

  return DESC_GENERIC_MISMATCH;
}

// ============================================================================
// Агрегация рекомендаций для мультивыделения
// ============================================================================

/**
 * Определяет общий рекомендуемый формат для нескольких узлов.
 * Приоритет: SVG (вектор) → PNG (прозрачность или IMAGE fill) → JPG.
 */
export function getOverallRecommendedFormat(analyses: NodeAnalysis[]): ExportFormat {
  if (analyses.some((a) => a.isVector)) {
    return 'SVG';
  }
  if (analyses.some((a) => a.hasTransparency || a.hasImageFill)) {
    return 'PNG';
  }
  return 'JPG';
}

// ============================================================================
// Подтверждение PNG для IMAGE fill
// ============================================================================

/**
 * Определяет, нужно ли показать диалог подтверждения PNG-экспорта.
 * Срабатывает когда выбран PNG, есть IMAGE fill, но нет обнаруженной
 * прозрачности — альфа-канал изображений неизвестен, и пользователь
 * должен подтвердить, что прозрачность действительно нужна.
 */
export function needsPngConfirmation(format: ExportFormat, analyses: NodeAnalysis[]): boolean {
  if (format !== 'PNG') return false;

  return analyses.some((a) => a.hasImageFill && !a.hasTransparency && !a.isVector);
}
