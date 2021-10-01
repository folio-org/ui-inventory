import { createIntl, createIntlCache } from 'react-intl';

import {
  formattedLanguageName,
  languageOptionsES,
} from './languages';

// This is optional but highly recommended
// since it prevents memory leak
const cache = createIntlCache();

const intl = createIntl({
  locale: 'en-US',
  messages: {}
}, cache);

// Mock formatMessage to avoid missing translation errors
// input is e.g. {id: 'stripes-components.languages.eng'}
intl.formatMessage = ({ id }) => {
  switch (id.slice(-3)) {
    case 'eng':
      return 'English';
    case 'ger':
      return 'German';
    case 'yid':
      return 'Yiddish';
    default:
      return 'Undefined';
  }
};

describe('formattedLanguageName', () => {
  it('returns undefined for an unmatched language code', () => {
    const result = formattedLanguageName('zvbxrpl', intl);
    expect(result).toBe('Undefined');
  });

  it('returns a language name for a two-character code', () => {
    const result = formattedLanguageName('yi', intl);
    expect(result).toBe('Yiddish');
  });

  it('returns a language name for a three-character code', () => {
    const result = formattedLanguageName('yid', intl);
    expect(result).toBe('Yiddish');
  });
});

describe('languageOptionsES', () => {
  const expected = [
    { label: 'English', value: 'eng', count: 17 },
    { label: 'German', value: 'ger', count: 3 }
  ];
  it('returns a properly formatted array of languages', () => {
    const selectedLanguages = ['eng', 'ger'];
    const langs = [{ id: 'eng', totalRecords: 17 }, { id: 'ger', totalRecords: 3 }, { id: 'kom' }];
    const result = languageOptionsES(selectedLanguages, intl, langs);
    expect(result).toEqual(expected);
  });
});
