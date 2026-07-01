import { warningOverlay, pngConfirmOverlay, changeFormatBtn, confirmPngBtn } from './dom';
import {
  lastFocusedElement,
  pngConfirmLastFocused,
  setLastFocusedElement,
  setPngConfirmLastFocused,
} from './state';

function getFocusableElements(container: Element): NodeListOf<Element> {
  return container.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
}

function createKeydownHandler(overlay: Element, closeFn: () => void): (e: KeyboardEvent) => void {
  return (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeFn();
      return;
    }
    if (e.key !== 'Tab') return;
    const focusable = getFocusableElements(overlay);
    if (focusable.length === 0) return;
    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length - 1] as HTMLElement;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
}

const handleWarningModalKeydown = createKeydownHandler(warningOverlay, closeWarningModal);
const handlePngConfirmKeydown = createKeydownHandler(pngConfirmOverlay, closePngConfirmModal);

export function openWarningModal(): void {
  setLastFocusedElement(document.activeElement);
  warningOverlay.classList.add('visible');
  document.addEventListener('keydown', handleWarningModalKeydown);
  (changeFormatBtn as HTMLElement).focus();
}

export function closeWarningModal(): void {
  warningOverlay.classList.remove('visible');
  document.removeEventListener('keydown', handleWarningModalKeydown);
  if (lastFocusedElement) (lastFocusedElement as HTMLElement).focus();
}

export function openPngConfirmModal(): void {
  setPngConfirmLastFocused(document.activeElement);
  pngConfirmOverlay.classList.add('visible');
  document.addEventListener('keydown', handlePngConfirmKeydown);
  (confirmPngBtn as HTMLElement).focus();
}

export function closePngConfirmModal(): void {
  pngConfirmOverlay.classList.remove('visible');
  document.removeEventListener('keydown', handlePngConfirmKeydown);
  if (pngConfirmLastFocused) (pngConfirmLastFocused as HTMLElement).focus();
}
