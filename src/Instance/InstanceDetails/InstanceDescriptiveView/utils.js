import { useIntl } from 'react-intl';

import {
  intlPreferredLanguageCode,
  languageByCode,
} from '@folio/stripes/components';

// eslint-disable-next-line
export const formatLanguages = (languages = []) => {
  const intl = useIntl();
  return languages
    .map(languageCode => {
      const intlCode = intlPreferredLanguageCode(languageCode);
      // If formatDisplayName returns a localized language name, great -- use that.
      // Otherwise, fall back to the English name.
      return intl.formatDisplayName(intlCode, { fallback: 'none' }) || languageByCode(languageCode).name;
    })
    .join(', ');
};
