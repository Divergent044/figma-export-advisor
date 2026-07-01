// ============================================================================
// Оркестратор анализа узлов Figma
// Определяет тип контента, наличие IMAGE fill и рекомендуемый формат
// ============================================================================

import type { ExportFormat, NodeAnalysis } from '../shared/types';
import { isVectorContentRecursive, hasVisibleImageFill } from './vector-content';
import { checkTransparencyOrEffects } from './transparency-check';

/**
 * Типы узлов, которые считаем заведомо растровыми с возможной прозрачностью.
 * Не входят в VECTOR_NODE_TYPES и не имеют children.
 * Множества VECTOR_NODE_TYPES и RASTER_NODE_TYPES не пересекаются
 * по природе Figma API — runtime guard избыточен.
 */
const RASTER_NODE_TYPES: ReadonlySet<string> = new Set([
  'VIDEO',
  'STICKY',
  'WIDGET',
  'EMBED',
  'LINK_UNFURL',
]);

/**
 * Проверяет, является ли узел растровым типом с возможной прозрачностью
 * (альфа-канал неизвестен).
 */
function isRasterNodeWithUnknownAlpha(node: SceneNode): boolean {
  return RASTER_NODE_TYPES.has(node.type);
}

/**
 * Рекурсивно проверяет, содержит ли поддерево узла IMAGE заливку.
 */
function hasImageFillRecursive(node: SceneNode): boolean {
  if (hasVisibleImageFill(node)) return true;

  if ('children' in node) {
    const children = (node as ChildrenMixin).children;
    if (children) {
      return children.some((child) => hasImageFillRecursive(child));
    }
  }

  return false;
}

/**
 * Анализирует один узел: определяет тип содержимого,
 * наличие прозрачности/эффектов и рекомендуемый формат экспорта.
 */
export function analyzeNode(node: SceneNode): NodeAnalysis {
  const isVector = isVectorContentRecursive(node);
  const { has: hasTransparency, reasons } = checkTransparencyOrEffects(node);
  const hasImageFill = hasImageFillRecursive(node) || isRasterNodeWithUnknownAlpha(node);

  let recommendedFormat: ExportFormat;
  if (isVector) {
    recommendedFormat = 'SVG';
  } else if (hasTransparency || hasImageFill) {
    recommendedFormat = 'PNG';
  } else {
    recommendedFormat = 'JPG';
  }

  return {
    isVector,
    hasTransparency,
    hasImageFill,
    recommendedFormat,
    reasons,
    nodeName: node.name,
    nodeType: node.type,
  };
}
