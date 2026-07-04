// ============================================================================
// Общая логика допустимости формата — используется в code.ts и UI
// Единственный источник истины, чтобы избежать расхождения.
// ============================================================================

import type { ExportFormat } from './types';

export interface FormatAnalysis {
  isVector: boolean;
  hasTransparency: boolean;
  hasImageFill: boolean;
}

/**
 * Проверяет, является ли формат допустимым для данного анализа.
 * - Вектор → только SVG
 * - Растр + прозрачность → только PNG
 * - Растр + IMAGE fill (альфа неизвестна) → PNG рекомендуется, JPG допустим
 * - Растр без прозрачности и IMAGE → только JPG
 */
export function isFormatAllowed(analysis: FormatAnalysis, format: ExportFormat): boolean {
  if (analysis.isVector) {
    return format === 'SVG';
  }
  if (analysis.hasTransparency) {
    return format === 'PNG';
  }
  if (analysis.hasImageFill) {
    return format === 'PNG' || format === 'JPG';
  }
  return format === 'JPG';
}
