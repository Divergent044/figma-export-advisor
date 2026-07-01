export interface UINodeAnalysis {
  isVector: boolean;
  hasTransparency: boolean;
  hasImageFill: boolean;
  recommendedFormat: string;
  reasons: string[];
}

export let selectedFormat = 'PNG';
export let selectedConstraint: { type: string; value: number } = { type: 'SCALE', value: 2 };
export let recommendedFormat = 'PNG';
export let analyses: UINodeAnalysis[] = [];
export let isExporting = false;
export let lastFocusedElement: Element | null = null;
export let pngConfirmLastFocused: Element | null = null;
export let themeMode: 'auto' | 'light' | 'dark' = 'auto';

export function setSelectedFormat(v: string) { selectedFormat = v; }
export function setSelectedConstraint(v: { type: string; value: number }) { selectedConstraint = v; }
export function setRecommendedFormat(v: string) { recommendedFormat = v; }
export function setAnalyses(v: UINodeAnalysis[]) { analyses = v; }
export function setIsExporting(v: boolean) { isExporting = v; }
export function setLastFocusedElement(v: Element | null) { lastFocusedElement = v; }
export function setPngConfirmLastFocused(v: Element | null) { pngConfirmLastFocused = v; }
export function setThemeMode(v: 'auto' | 'light' | 'dark') { themeMode = v; }
