import { formattedLanguageName } from '@folio/stripes/components';

// eslint-disable-next-line
export const formatLanguages = (languages = []) => {
  return languages
    .map(languageCode => formattedLanguageName(languageCode))
    .join(', ');
};
