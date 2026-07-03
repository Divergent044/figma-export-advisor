import {
  warningPanel,
  pngConfirmPanel,
  changeFormatBtn,
  confirmPngBtn,
  stepsIndicator,
  stepExport,
  stepReview,
  stepOptimize,
} from './dom';

export function setActiveStep(step: 1 | 2 | 3): void {
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

  stepExport.style.display = step === 1 ? '' : 'none';
  stepReview.style.display = step === 2 ? '' : 'none';
  stepOptimize.style.display = step === 3 ? '' : 'none';
}

export function showWarningPanel(): void {
  pngConfirmPanel.style.display = 'none';
  warningPanel.style.display = '';
  setActiveStep(2);
  (changeFormatBtn as HTMLElement).focus();
}

export function showPngConfirmPanel(): void {
  warningPanel.style.display = 'none';
  pngConfirmPanel.style.display = '';
  setActiveStep(2);
  (confirmPngBtn as HTMLElement).focus();
}

export function hideReviewStep(): void {
  warningPanel.style.display = 'none';
  pngConfirmPanel.style.display = 'none';
  setActiveStep(1);
}
