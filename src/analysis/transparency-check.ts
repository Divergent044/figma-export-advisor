// ============================================================================
// Проверка прозрачности, альфа-канала и эффектов узлов Figma
// Определяет, требует ли контент формата с поддержкой прозрачности (PNG)
// ============================================================================

import {
  REASON_NODE_OPACITY,
  REASON_FILL_ALPHA,
  REASON_STROKE_ALPHA,
  REASON_EFFECT_DROP_SHADOW,
  REASON_EFFECT_INNER_SHADOW,
  REASON_EFFECT_LAYER_BLUR,
  REASON_EFFECT_BACKGROUND_BLUR,
  REASON_NODE_IS_MASK,
} from '../shared/i18n-keys';

/** Результат проверки прозрачности/эффектов */
export interface TransparencyCheckResult {
  has: boolean;
  reasons: string[];
}

/**
 * Проверяет наличие прозрачности самого узла (opacity < 1).
 */
function checkNodeOpacity(node: SceneNode): string[] {
  const reasons: string[] = [];
  if ('opacity' in node && (node as { opacity: number }).opacity < 1) {
    reasons.push(REASON_NODE_OPACITY);
  }
  return reasons;
}

/**
 * Проверяет заливки на наличие альфа-канала.
 */
function checkFillsTransparency(node: SceneNode): string[] {
  const reasons: string[] = [];
  if (!('fills' in node)) return reasons;

  const fills = (node as MinimalFillsMixin).fills as readonly Paint[] | null;
  if (!fills || !Array.isArray(fills)) return reasons;

  for (const fill of fills) {
    if (fill.visible === false) continue;

    if (fill.type === 'IMAGE') {
      continue;
    }

    if (fill.opacity !== undefined && fill.opacity < 1) {
      reasons.push(REASON_FILL_ALPHA);
      break;
    }
  }

  return reasons;
}

/**
 * Проверяет обводки на наличие альфа-канала.
 */
function checkStrokesTransparency(node: SceneNode): string[] {
  const reasons: string[] = [];
  if (!('strokes' in node)) return reasons;

  const strokes = (node as MinimalStrokesMixin).strokes as readonly Paint[] | null;
  if (!strokes || !Array.isArray(strokes)) return reasons;

  for (const stroke of strokes) {
    if (stroke.visible === false) continue;
    if (stroke.opacity !== undefined && stroke.opacity < 1) {
      reasons.push(REASON_STROKE_ALPHA);
      break;
    }
  }

  return reasons;
}

/**
 * Проверяет эффекты: тени, размытия и другие, требующие прозрачности.
 */
function checkEffectsTransparency(node: SceneNode): string[] {
  const reasons: string[] = [];
  if (!('effects' in node)) return reasons;

  const effects = (node as BlendMixin).effects as readonly Effect[] | null;
  if (!effects) return reasons;

  for (const effect of effects) {
    if (!effect.visible) continue;

    switch (effect.type) {
      case 'DROP_SHADOW':
        reasons.push(REASON_EFFECT_DROP_SHADOW);
        break;
      case 'INNER_SHADOW':
        reasons.push(REASON_EFFECT_INNER_SHADOW);
        break;
      case 'LAYER_BLUR':
        reasons.push(REASON_EFFECT_LAYER_BLUR);
        break;
      case 'BACKGROUND_BLUR':
        reasons.push(REASON_EFFECT_BACKGROUND_BLUR);
        break;
    }
  }

  return reasons;
}

/**
 * Проверяет, является ли узел маской.
 */
function checkMaskTransparency(node: SceneNode): string[] {
  const reasons: string[] = [];
  if ('isMask' in node && (node as { isMask: boolean }).isMask) {
    reasons.push(REASON_NODE_IS_MASK);
  }
  return reasons;
}

/**
 * Проверяет наличие прозрачности, альфа-канала или эффектов,
 * которые требуют формата с поддержкой прозрачности (PNG).
 * Рекурсивно обходит дочерние элементы.
 */
export function checkTransparencyOrEffects(node: SceneNode): TransparencyCheckResult {
  const reasons: string[] = [
    ...checkNodeOpacity(node),
    ...checkFillsTransparency(node),
    ...checkStrokesTransparency(node),
    ...checkEffectsTransparency(node),
    ...checkMaskTransparency(node),
  ];

  if ('children' in node) {
    const children = (node as ChildrenMixin).children;
    for (const child of children) {
      const childResult = checkTransparencyOrEffects(child);
      if (childResult.has) {
        reasons.push(...childResult.reasons);
      }
    }
  }

  const uniqueReasons = [...new Set(reasons)];
  return { has: uniqueReasons.length > 0, reasons: uniqueReasons };
}
