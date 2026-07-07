import { t, setLocale, localizeDOM, getLocale } from './i18n/translate';
import {
	toastEl,
	exportBtn,
	optServicesList,
	warningDescription,
	currentFormatHint,
	recommendedFormatHint,
	warningReasons,
	formatGroup,
	densityGroup,
	continueExportBtn,
	changeFormatBtn,
	confirmPngBtn,
	switchToJpgBtn,
	closeOptimizeBtn,
	langToggleBtn,
	themeToggleBtn,
	backToExportBtn,
} from './dom';
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
import {
	setActiveStep,
	showWarningPanel,
	showPngConfirmPanel,
	hideReviewStep,
} from './step-controller';
import {
	renderFormatButtons,
	renderDensityButtons,
	renderAnalysisCard,
	updateViewState,
	parseConstraint,
} from './render';
import { OPT_SERVICES } from './optimize-services';
import { isFormatAllowed } from '../shared/format-allowed';

interface PluginMessage {
	type: string;
	[key: string]: unknown;
}

let lastExportFormat: string | null = null;

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

export function renderLangSwitch(): void {
	langToggleBtn.querySelectorAll('.lang-opt').forEach((el) => {
		el.classList.toggle('active', el.getAttribute('data-lang') === getLocale());
	});
}

export function setExportLoading(loading: boolean): void {
	setIsExporting(loading);
	exportBtn.disabled = loading;
	exportBtn.classList.toggle('loading', loading);
}

function renderOptServices(format: string): void {
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
}

function showOptimizeStep(format: string): void {
	lastExportFormat = format;
	renderOptServices(format);
	setActiveStep(3);
	(closeOptimizeBtn as HTMLElement).focus();
}

export function getMimeType(format: string): string {
	switch (format) {
		case 'SVG':
			return 'image/svg+xml';
		case 'PNG':
			return 'image/png';
		case 'JPG':
			return 'image/jpeg';
		default:
			return 'application/octet-stream';
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
		setSelectedConstraint(
			parseConstraint(btn.getAttribute('data-constraint')!),
		);
		renderDensityButtons();
	});

	exportBtn.addEventListener('click', () => {
		if (isExporting) return;
		setExportLoading(true);
		postMessage({
			type: 'validate-and-export',
			format: selectedFormat,
			constraint: selectedConstraint,
		});
	});

	continueExportBtn.addEventListener('click', () => {
		hideReviewStep();
		setExportLoading(true);
		postMessage({
			type: 'force-export',
			format: selectedFormat,
			constraint: selectedConstraint,
		});
	});

	changeFormatBtn.addEventListener('click', () => {
		hideReviewStep();
		setExportLoading(false);
		setSelectedFormat(recommendedFormat);
		renderFormatButtons();
		showToast(
			t('ui.toast_format_changed').replace('{format}', recommendedFormat),
			false,
		);
	});

	confirmPngBtn.addEventListener('click', () => {
		hideReviewStep();
		setExportLoading(true);
		postMessage({
			type: 'confirm-png-export',
			format: selectedFormat,
			constraint: selectedConstraint,
		});
	});

	switchToJpgBtn.addEventListener('click', () => {
		hideReviewStep();
		setExportLoading(false);
		setSelectedFormat('JPG');
		renderFormatButtons();
		showToast(t('ui.toast_format_changed').replace('{format}', 'JPG'), false);
	});

	backToExportBtn.addEventListener('click', () => {
		hideReviewStep();
		setExportLoading(false);
	});

	closeOptimizeBtn.addEventListener('click', () => {
		setActiveStep(1);
	});

	langToggleBtn.addEventListener('click', (e) => {
		const opt = (e.target as Element).closest('.lang-opt');
		if (!opt) return;
		const newLocale = opt.getAttribute('data-lang')!;
		if (newLocale === getLocale()) return;
		setLocale(newLocale);
		localizeDOM();
		renderLangSwitch();
		renderAnalysisCard();
		if (lastExportFormat) renderOptServices(lastExportFormat);
		const langName = newLocale === 'ru' ? 'Русский' : 'English';
		showToast(t('ui.toast_lang_changed').replace('{lang}', langName), false);
	});

	themeToggleBtn.addEventListener('click', () => {
		const modes: Array<'auto' | 'light' | 'dark'> = ['auto', 'light', 'dark'];
		const nextIndex = (modes.indexOf(themeMode) + 1) % modes.length;
		const nextMode = modes[nextIndex];
		setThemeMode(nextMode);
		applyTheme(nextMode);
		const themeName =
			nextMode === 'auto' ? 'Auto' : nextMode === 'light' ? 'Light' : 'Dark';
		showToast(t('ui.toast_theme_changed').replace('{theme}', themeName), false);
	});
}

function isFormatAllowedForSelection(
	analyses: UINodeAnalysis[],
	fmt: string,
): boolean {
	return analyses.some((a) => isFormatAllowed(a, fmt as 'SVG' | 'PNG' | 'JPG'));
}

export function initMessageHandler(): void {
	window.onmessage = (event: MessageEvent) => {
		const msg = (event.data as { pluginMessage?: PluginMessage }).pluginMessage;
		if (!msg) return;

		switch (msg.type) {
			case 'init': {
				setLocale((msg.locale as string) || 'en');
				localizeDOM();
				renderLangSwitch();
				postMessage({ type: 'analyze' });
				break;
			}

			case 'no-selection': {
				setExportLoading(false);
				hideReviewStep();
				updateViewState(false);
				break;
			}

			case 'analysis-result': {
				hideReviewStep();
				setAnalyses(msg.analyses as UINodeAnalysis[]);
				setRecommendedFormat(msg.overallRecommended as string);
				updateViewState(true);
				renderAnalysisCard();
				const analysesArr = msg.analyses as UINodeAnalysis[];
				const currentFormatAllowed = isFormatAllowedForSelection(
					analysesArr,
					selectedFormat,
				);
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

				showWarningPanel();
				break;
			}

			case 'png-confirmation': {
				setExportLoading(false);
				showPngConfirmPanel();
				break;
			}

			case 'export-result': {
				const blob = new Blob([msg.bytes as BlobPart], {
					type: getMimeType(msg.format as string),
				});
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = msg.filename as string;
				a.click();
				URL.revokeObjectURL(url);
				break;
			}

			case 'export-complete': {
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
