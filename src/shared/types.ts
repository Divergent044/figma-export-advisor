// ============================================================================
// Доменные типы и константы плагина Smart Export Image
// ============================================================================

/** Поддерживаемые форматы экспорта */
export type ExportFormat = 'SVG' | 'PNG' | 'JPG';

/** Ограничение экспорта: плотность пикселей, ширина или высота */
export type ExportConstraint =
  | { type: 'SCALE'; value: number }
  | { type: 'WIDTH'; value: number }
  | { type: 'HEIGHT'; value: number };

/** Результат анализа одного узла */
export interface NodeAnalysis {
  isVector: boolean;
  hasTransparency: boolean;
  hasImageFill: boolean;
  recommendedFormat: ExportFormat;
  reasons: string[];
  nodeName: string;
  nodeType: string;
}

/**
 * Векторные типы узлов Figma, которые экспортируются как чистый вектор.
 * RECTANGLE включён — это векторный примитив; если в нём есть
 * растровая заливка (IMAGE), это выявляется в isVectorContentRecursive.
 * BOOLEAN_OPERATION и TEXT могут иметь детей — проверяются рекурсивно.
 */
export const VECTOR_NODE_TYPES: ReadonlySet<string> = new Set([
  'RECTANGLE',
  'VECTOR',
  'LINE',
  'ELLIPSE',
  'POLYGON',
  'STAR',
  'BOOLEAN_OPERATION',
  'TEXT',
]);
