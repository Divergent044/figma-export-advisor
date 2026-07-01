// ============================================================================
// Определение векторной природы узлов Figma
// Проверяет, содержит ли поддерево только векторные элементы
// ============================================================================

import { VECTOR_NODE_TYPES } from '../shared/types';

/**
 * Проверяет, является ли узел чисто векторным типом.
 * Векторные узлы: RECTANGLE, VECTOR, LINE, ELLIPSE, POLYGON, STAR,
 * BOOLEAN_OPERATION, TEXT.
 */
export function isVectorNode(node: SceneNode): boolean {
  return VECTOR_NODE_TYPES.has(node.type);
}

/**
 * Проверяет, есть ли в заливках узла видимое изображение.
 */
export function hasVisibleImageFill(node: SceneNode): boolean {
  if (!('fills' in node)) return false;
  const fills = (node as MinimalFillsMixin).fills as readonly Paint[] | null;
  if (!fills || !Array.isArray(fills)) return false;
  return fills.some((fill) => fill.visible !== false && fill.type === 'IMAGE');
}

/**
 * Рекурсивно проверяет, содержит ли поддерево узла
 * только векторные элементы (без растровых заливок).
 */
export function isVectorContentRecursive(node: SceneNode): boolean {
    if (isVectorNode(node) && hasVisibleImageFill(node)) {
      return false;
    }

  if ('children' in node) {
    const children = (node as ChildrenMixin).children;
    if (!children || children.length === 0) {
      return !hasVisibleImageFill(node);
    }
    return children.every((child) => isVectorContentRecursive(child));
  }

  return isVectorNode(node);


}
