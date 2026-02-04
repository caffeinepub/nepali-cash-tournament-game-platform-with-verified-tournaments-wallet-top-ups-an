import { np } from './np';

export type TranslationKey = keyof typeof np;

export function t(key: TranslationKey): string {
  return np[key] || key;
}

export { np };
