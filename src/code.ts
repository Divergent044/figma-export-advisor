// ============================================================================
// Export Advisor Plugin — точка входа
// Оркестратор: связывает анализ, валидацию, экспорт и UI
// ============================================================================

import type { ExportFormat, ExportConstraint, NodeAnalysis } from './shared/types';
import type { UIMessage } from './shared/messaging';
import { analyzeNode } from './analysis';
import {
  isFormatAcceptable,
  getFormatMismatchDescription,
  getOverallRecommendedFormat,
  needsPngConfirmation,
} from './validation/validator';
import { performExport, setExporterLocale } from './export/exporter';

// ============================================================================
// Инициализация UI
// ============================================================================

figma.showUI(__html__, { width: 350, height: 500, themeColors: true });

function detectLocale(): string {
  const user = figma.currentUser as (typeof figma.currentUser & { locale?: string }) | null;
  if (user?.locale) {
    return user.locale.startsWith('ru') ? 'ru' : 'en';
  }
  return 'en';
}

const locale = detectLocale();
setExporterLocale(locale);
figma.ui.postMessage({ type: 'init', locale });

// ============================================================================
// Анализ текущего выделения
// ============================================================================

/** Анализирует текущее выделение и отправляет результаты в UI */
function handleAnalyze(): void {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'no-selection' });
    return;
  }

  const analyses = selection.map((node) => analyzeNode(node));
  const overallRecommended = getOverallRecommendedFormat(analyses);

  figma.ui.postMessage({
    type: 'analysis-result',
    analyses,
    overallRecommended,
    selectionCount: selection.length,
  });
}

// ============================================================================
// Обработчики команд от UI
// ============================================================================

/** Валидирует формат и запускает экспорт (с предупреждением при несовпадении) */
async function handleValidateAndExport(format: ExportFormat, constraint: ExportConstraint): Promise<void> {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'no-selection' });
    return;
  }

  const analyses: NodeAnalysis[] = selection.map((node) => analyzeNode(node));
  const needsWarning = analyses.some((a) => !isFormatAcceptable(format, a));

  if (needsWarning) {
    const overallRecommended = getOverallRecommendedFormat(analyses);
    const description = getFormatMismatchDescription(format, analyses);
    const allReasons = [...new Set(analyses.flatMap((a) => a.reasons))];

    figma.ui.postMessage({
      type: 'format-warning',
      selectedFormat: format,
      recommendedFormat: overallRecommended,
      descriptionKey: description,
      reasons: allReasons,
    });
    return;
  }

  if (needsPngConfirmation(format, analyses)) {
    figma.ui.postMessage({ type: 'png-confirmation' });
    return;
  }

  await performExport(selection, format, constraint);
}

/** Принудительный экспорт (пользователь нажал «Продолжить» в предупреждении) */
async function handleForceExport(format: ExportFormat, constraint: ExportConstraint): Promise<void> {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'no-selection' });
    return;
  }

  await performExport(selection, format, constraint);
}

// ============================================================================
// Маршрутизатор сообщений от UI
// ============================================================================

/** Обрабатывает входящее сообщение от UI, маршрутизируя его по типу */
function routeUIMessage(msg: UIMessage): void {
  switch (msg.type) {
    case 'analyze':
      handleAnalyze();
      break;

    case 'validate-and-export':
      handleValidateAndExport(msg.format, msg.constraint);
      break;

    case 'force-export':
      handleForceExport(msg.format, msg.constraint);
      break;

    case 'confirm-png-export':
      handleForceExport(msg.format, msg.constraint);
      break;

    case 'cancel':
      figma.closePlugin();
      break;
  }
}

// ============================================================================
// Подписки на события
// ============================================================================

/** Отслеживание изменения выделения в реальном времени */
figma.on('selectionchange', () => {
  handleAnalyze();
});

/** Основной обработчик сообщений от UI */
figma.ui.onmessage = (msg: UIMessage) => {
  routeUIMessage(msg);
};

// Первичный анализ при открытии плагина
handleAnalyze();
