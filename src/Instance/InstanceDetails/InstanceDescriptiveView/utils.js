import languagetable from '../../../data/languages';

// eslint-disable-next-line
export const formatLanguages = (languages = []) => {
  return languages
    .map(languageCode => languagetable.languageByCode(languageCode))
    .join(', ');
};
