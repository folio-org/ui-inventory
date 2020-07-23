import { formattedLanguageName } from '@folio/stripes/components';

// eslint-disable-next-line
export const formatLanguages = (languages = [], intl, locale) => {
  return languages
    .map(languageCode => formattedLanguageName(languageCode, intl, locale))
    .join(', ');
};
