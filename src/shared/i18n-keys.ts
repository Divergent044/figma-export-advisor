// ============================================================================
// Ключи интернационализации
// Используются в TypeScript как идентификаторы строк,
// разрешаются в ui.html через словарь LOCALES
// ============================================================================

// ============================================================================
// Причины прозрачности (transparency-check.ts → NodeAnalysis.reasons)
// ============================================================================
export const REASON_NODE_OPACITY = 'reason.node_opacity';
export const REASON_FILL_ALPHA = 'reason.fill_alpha';
export const REASON_STROKE_ALPHA = 'reason.stroke_alpha';
export const REASON_EFFECT_DROP_SHADOW = 'reason.effect_drop_shadow';
export const REASON_EFFECT_INNER_SHADOW = 'reason.effect_inner_shadow';
export const REASON_EFFECT_LAYER_BLUR = 'reason.effect_layer_blur';
export const REASON_EFFECT_BACKGROUND_BLUR = 'reason.effect_background_blur';
export const REASON_NODE_IS_MASK = 'reason.node_is_mask';

// ============================================================================
// Описания несовпадения формата (validator.ts → FormatWarningMessage.descriptionKey)
// ============================================================================
export const DESC_MIXED_CONTENT_SVG = 'desc.mixed_content_svg';
export const DESC_MIXED_CONTENT_JPG = 'desc.mixed_content_jpg';
export const DESC_MIXED_CONTENT_PNG = 'desc.mixed_content_png';
export const DESC_VECTOR_NOT_SVG = 'desc.vector_not_svg';
export const DESC_RASTER_TRANSPARENCY_JPG = 'desc.raster_transparency_jpg';
export const DESC_RASTER_TRANSPARENCY_SVG = 'desc.raster_transparency_svg';
export const DESC_RASTER_IMAGE_SVG = 'desc.raster_image_svg';
export const DESC_RASTER_NO_TRANSPARENCY_PNG = 'desc.raster_no_transparency_png';
export const DESC_RASTER_NO_TRANSPARENCY_SVG = 'desc.raster_no_transparency_svg';
export const DESC_GENERIC_MISMATCH = 'desc.generic_mismatch';
