import { formattedLanguageName } from '@folio/stripes/components';

// eslint-disable-next-line
export const formatLanguages = (languages = [], intl) => {
  return languages
    .map(languageCode => formattedLanguageName(languageCode, intl))
    .join(', ');
};
