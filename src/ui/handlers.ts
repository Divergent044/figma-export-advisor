import { t, setLocale, localizeDOM, getLocale } from './i18n/translate';
import { toastEl, exportBtn, optServicesList, warningDescription, currentFormatHint, recommendedFormatHint, warningReasons, formatGroup, densityGroup, continueExportBtn, changeFormatBtn, confirmPngBtn, switchToJpgBtn, closeOptimizeBtn, langToggleBtn, themeToggleBtn, stepsIndicator, stepExport, stepOptimize } from './dom';
import {
  selectedFormat,
  selectedConstraint,
  recommendedFormat,
  isExporting,
  themeMode,
  setSelectedFormat,
  setSelectedConstraint,
  setRecommendedFormat,
  setAnalyses,
  setIsExporting,
  setThemeMode,
  type UINodeAnalysis,
} from './state';
import { openWarningModal, closeWarningModal, openPngConfirmModal, closePngConfirmModal } from './modal';
import { renderFormatButtons, renderDensityButtons, renderAnalysisCard, updateViewState, parseConstraint } from './render';
import { OPT_SERVICES } from './optimize-services';

interface PluginMessage {
  type: string;
  [key: string]: unknown;
}

export function postMessage(msg: PluginMessage): void {
  parent.postMessage({ pluginMessage: msg }, '*');
}

export function showToast(text: string, isError: boolean): void {
  toastEl.textContent = text;
  toastEl.className = 'toast' + (isError ? ' error' : '');
  requestAnimationFrame(() => {
    toastEl.classList.add('visible');
  });
  setTimeout(() => {
    toastEl.classList.remove('visible');
  }, 2500);
}

export function setExportLoading(loading: boolean): void {
  setIsExporting(loading);
  exportBtn.disabled = loading;
  exportBtn.classList.toggle('loading', loading);
}

function setActiveStep(step: 1 | 2): void {
  const steps = stepsIndicator.querySelectorAll('.step');
  steps.forEach((el) => {
    const s = el.getAttribute('data-step');
    el.classList.remove('active', 'completed');
    if (s === String(step)) {
      el.classList.add('active');
    } else if (Number(s) < step) {
      el.classList.add('completed');
    }
  });

  if (step === 1) {
    stepExport.style.display = '';
    stepOptimize.style.display = 'none';
  } else {
    stepExport.style.display = 'none';
    stepOptimize.style.display = '';
  }
}

function showOptimizeStep(format: string): void {
  optServicesList.innerHTML = '';
  OPT_SERVICES.forEach((svc) => {
    const link = document.createElement('a');
    link.className = 'opt-service-link';
    link.href = svc.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    const icon = document.createElement('span');
    icon.className = 'opt-service-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = svc.name.substring(0, 2).toUpperCase();

    const info = document.createElement('span');
    info.className = 'opt-service-info';

    const name = document.createElement('span');
    name.className = 'opt-service-name';
    name.textContent = svc.name;

    const desc = document.createElement('span');
    desc.className = 'opt-service-desc';
    desc.textContent = t(svc.descKey);

    const badges = document.createElement('span');
    badges.className = 'opt-format-badges';
    svc.formats.forEach((f) => {
      const badge = document.createElement('span');
      badge.className = 'opt-format-badge' + (f === format ? ' match' : '');
      badge.textContent = f;
      badges.appendChild(badge);
    });

    info.appendChild(name);
    info.appendChild(desc);
    info.appendChild(badges);
    link.appendChild(icon);
    link.appendChild(info);
    optServicesList.appendChild(link);
  });

  setActiveStep(2);
  (closeOptimizeBtn as HTMLElement).focus();
}

export function getMimeType(format: string): string {
  switch (format) {
    case 'SVG': return 'image/svg+xml';
    case 'PNG': return 'image/png';
    case 'JPG': return 'image/jpeg';
    default: return 'application/octet-stream';
  }
}

export function applyTheme(mode: 'auto' | 'light' | 'dark'): void {
  const root = document.documentElement;
  if (mode === 'auto') {
    root.removeAttribute('data-theme');
    themeToggleBtn.textContent = '\u25D0';
  } else if (mode === 'light') {
    root.setAttribute('data-theme', 'light');
    themeToggleBtn.textContent = '\u2600';
  } else {
    root.setAttribute('data-theme', 'dark');
    themeToggleBtn.textContent = '\u263E';
  }
}

export function initEventHandlers(): void {
  formatGroup.addEventListener('click', (e) => {
    const btn = (e.target as Element).closest('.format-btn');
    if (!btn) return;
    setSelectedFormat(btn.getAttribute('data-format')!);
    renderFormatButtons();
  });

  densityGroup.addEventListener('click', (e) => {
    const btn = (e.target as Element).closest('.density-btn');
    if (!btn) return;
    setSelectedConstraint(parseConstraint(btn.getAttribute('data-constraint')!));
    renderDensityButtons();
  });

  exportBtn.addEventListener('click', () => {
    if (isExporting) return;
    setExportLoading(true);
    postMessage({ type: 'validate-and-export', format: selectedFormat, constraint: selectedConstraint });
  });

  continueExportBtn.addEventListener('click', () => {
    closeWarningModal();
    setExportLoading(true);
    postMessage({ type: 'force-export', format: selectedFormat, constraint: selectedConstraint });
  });

  changeFormatBtn.addEventListener('click', () => {
    closeWarningModal();
    setExportLoading(false);
    setSelectedFormat(recommendedFormat);
    renderFormatButtons();
    showToast(t('ui.toast_format_changed').replace('{format}', recommendedFormat), false);
  });

  confirmPngBtn.addEventListener('click', () => {
    closePngConfirmModal();
    setExportLoading(true);
    postMessage({ type: 'confirm-png-export', format: selectedFormat, constraint: selectedConstraint });
  });

  switchToJpgBtn.addEventListener('click', () => {
    closePngConfirmModal();
    setExportLoading(false);
    setSelectedFormat('JPG');
    renderFormatButtons();
    showToast(t('ui.toast_format_changed').replace('{format}', 'JPG'), false);
  });

  closeOptimizeBtn.addEventListener('click', () => {
    setActiveStep(1);
  });

  langToggleBtn.addEventListener('click', () => {
    const newLocale = getLocale() === 'ru' ? 'en' : 'ru';
    setLocale(newLocale);
    localizeDOM();
    renderAnalysisCard();
    const langName = newLocale === 'ru' ? 'Русский' : 'English';
    showToast(t('ui.toast_lang_changed').replace('{lang}', langName), false);
  });

  themeToggleBtn.addEventListener('click', () => {
    const modes: Array<'auto' | 'light' | 'dark'> = ['auto', 'light', 'dark'];
    const nextIndex = (modes.indexOf(themeMode) + 1) % modes.length;
    const nextMode = modes[nextIndex];
    setThemeMode(nextMode);
    applyTheme(nextMode);
    const themeName = nextMode === 'auto' ? 'Auto' : nextMode === 'light' ? 'Light' : 'Dark';
    showToast(t('ui.toast_theme_changed').replace('{theme}', themeName), false);
  });
}

function isFormatAllowed(analysis: UINodeAnalysis, fmt: string): boolean {
  if (analysis.isVector) return fmt === 'SVG';
  if (analysis.hasTransparency) return fmt === 'PNG';
  return fmt === 'JPG';
}

export function initMessageHandler(): void {
  window.onmessage = (event: MessageEvent) => {
    const msg = (event.data as { pluginMessage?: PluginMessage }).pluginMessage;
    if (!msg) return;

    switch (msg.type) {
      case 'init': {
        setLocale((msg.locale as string) || 'en');
        localizeDOM();
        postMessage({ type: 'analyze' });
        break;
      }

      case 'no-selection': {
        setExportLoading(false);
        closeWarningModal();
        closePngConfirmModal();
        setActiveStep(1);
        updateViewState(false);
        break;
      }

      case 'analysis-result': {
        closeWarningModal();
        closePngConfirmModal();
        setActiveStep(1);
        setAnalyses(msg.analyses as UINodeAnalysis[]);
        setRecommendedFormat(msg.overallRecommended as string);
        updateViewState(true);
        renderAnalysisCard();
        const analysesArr = msg.analyses as UINodeAnalysis[];
        const currentFormatAllowed = analysesArr.some((a) => isFormatAllowed(a, selectedFormat));
        if (!currentFormatAllowed) {
          setSelectedFormat(msg.overallRecommended as string);
        }
        renderFormatButtons();
        renderDensityButtons();
        setExportLoading(false);
        break;
      }

      case 'format-warning': {
        setExportLoading(false);
        warningDescription.textContent = t(msg.descriptionKey as string);
        currentFormatHint.textContent = msg.selectedFormat as string;
        recommendedFormatHint.textContent = msg.recommendedFormat as string;
        setRecommendedFormat(msg.recommendedFormat as string);

        warningReasons.innerHTML = '';
        const reasons = msg.reasons as string[] | undefined;
        if (reasons && reasons.length > 0) {
          reasons.forEach((r) => {
            const item = document.createElement('div');
            item.className = 'reason-item';
            item.textContent = t(r);
            warningReasons.appendChild(item);
          });
        }

        openWarningModal();
        break;
      }

      case 'png-confirmation': {
        setExportLoading(false);
        openPngConfirmModal();
        break;
      }

      case 'export-result': {
        const blob = new Blob([msg.bytes as BlobPart], { type: getMimeType(msg.format as string) });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = msg.filename as string;
        a.click();
        URL.revokeObjectURL(url);
        setExportLoading(false);
        showOptimizeStep(msg.format as string);
        break;
      }

      case 'export-error': {
        setExportLoading(false);
        showToast(msg.message as string, true);
        break;
      }
    }
  };
}
