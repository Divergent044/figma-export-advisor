import { LOCALES } from './locales';

let locale = 'en';

export function getLocale(): string {
  return locale;
}

export function setLocale(newLocale: string): void {
  locale = newLocale;
}

export function t(key: string): string {
  return (LOCALES[locale] && LOCALES[locale][key]) || LOCALES.en[key] || key;
}

export function localizeDOM(): void {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t((el as HTMLElement).getAttribute('data-i18n')!);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    (el as HTMLElement).setAttribute('aria-label', t((el as HTMLElement).getAttribute('data-i18n-aria')!));
  });
  document.documentElement.lang = locale === 'ru' ? 'ru' : 'en';
}
