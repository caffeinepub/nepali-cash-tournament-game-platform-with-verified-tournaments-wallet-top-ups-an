import { t } from '../i18n';

export function mapErrorToNepali(error: unknown): string {
  if (typeof error === 'string') {
    if (error.includes('insufficient') || error.includes('Not enough')) {
      return t('insufficientFunds');
    }
    if (error.includes('not verified') || error.includes('needs to be verified')) {
      return t('tournamentNotVerified');
    }
    if (error.includes('Unauthorized') || error.includes('Only')) {
      return t('unauthorized');
    }
  }
  
  if (error instanceof Error) {
    return mapErrorToNepali(error.message);
  }
  
  return t('errorOccurred');
}
