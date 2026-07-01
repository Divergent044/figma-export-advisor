import { t } from './i18n/translate';
import { formatGroup, densityGroup, densitySection, analysisCard, emptyState, analysisSection } from './dom';
import {
  selectedFormat,
  selectedConstraint,
  recommendedFormat,
  analyses,
  type UINodeAnalysis,
} from './state';

export function renderFormatButtons(): void {
  const buttons = formatGroup.querySelectorAll('.format-btn');
  buttons.forEach((btn: Element) => {
    const fmt = btn.getAttribute('data-format')!;
    const isActive = fmt === selectedFormat;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    btn.classList.toggle('recommended-indicator', fmt === recommendedFormat && fmt !== selectedFormat);
  });
  densitySection.style.display = selectedFormat === 'SVG' ? 'none' : '';
}

export function renderDensityButtons(): void {
  const buttons = densityGroup.querySelectorAll('.density-btn');
  buttons.forEach((btn: Element) => {
    const btnConstraint = parseConstraint(btn.getAttribute('data-constraint')!);
    const isActive = btnConstraint.type === selectedConstraint.type && btnConstraint.value === selectedConstraint.value;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
  });
}

export function parseConstraint(str: string): { type: string; value: number } {
  const parts = str.split(':');
  return { type: parts[0], value: parseFloat(parts[1]) };
}

export function renderAnalysisCard(): void {
  if (analyses.length === 0) return;

  const vectorCount = analyses.filter((a: UINodeAnalysis) => a.isVector).length;
  const transparencyCount = analyses.filter((a: UINodeAnalysis) => a.hasTransparency).length;
  const totalCount = analyses.length;

  let contentTypeKey: string;
  if (vectorCount === totalCount) {
    contentTypeKey = 'ui.content_vector';
  } else if (transparencyCount > 0) {
    contentTypeKey = 'ui.content_raster_transparency';
  } else {
    contentTypeKey = 'ui.content_raster_plain';
  }

  const allReasons: string[] = [];
  const seen: Record<string, boolean> = {};
  analyses.forEach((a: UINodeAnalysis) => {
    a.reasons.forEach((r: string) => {
      if (!seen[r]) { seen[r] = true; allReasons.push(r); }
    });
  });

  analysisCard.innerHTML = '';

  function createRow(key: string, value: string, valueClass?: string): HTMLDivElement {
    const row = document.createElement('div');
    row.className = 'analysis-row';
    const keySpan = document.createElement('span');
    keySpan.className = 'analysis-key';
    keySpan.textContent = key;
    const valueSpan = document.createElement('span');
    valueSpan.className = 'analysis-value' + (valueClass ? ' ' + valueClass : '');
    valueSpan.textContent = value;
    row.appendChild(keySpan);
    row.appendChild(valueSpan);
    return row;
  }

  analysisCard.appendChild(createRow(t('ui.row_objects'), String(totalCount)));
  analysisCard.appendChild(createRow(t('ui.row_content_type'), t(contentTypeKey)));
  analysisCard.appendChild(createRow(t('ui.row_recommended'), recommendedFormat, 'recommended'));

  if (allReasons.length > 0) {
    const reasonsDiv = document.createElement('div');
    reasonsDiv.className = 'reasons-list';
    allReasons.forEach((r) => {
      const badge = document.createElement('span');
      badge.className = 'reason-badge';
      badge.textContent = t(r);
      reasonsDiv.appendChild(badge);
    });
    analysisCard.appendChild(reasonsDiv);
  }
}

export function updateViewState(hasSelection: boolean): void {
  emptyState.style.display = hasSelection ? 'none' : 'block';
  analysisSection.style.display = hasSelection ? 'block' : 'none';
}
