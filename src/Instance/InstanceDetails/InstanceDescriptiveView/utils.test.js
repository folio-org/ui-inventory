import { formatLanguages } from './utils';

jest.mock('@folio/stripes/components', () => ({
  formattedLanguageName: jest.fn().mockReturnValue('English'),
}));

describe('formatLanguages', () => {
  it('formats the given languages', () => {
    const languages = ['eng', 'spa'];
    const intl = {};
    const locale = 'en';
    const result = formatLanguages(languages, intl, locale);
    expect(result).toBe('English, English');
  });
  it('returns an empty string when there are no languages', () => {
    const languages = [];
    const intl = {};
    const locale = 'en';
    const result = formatLanguages(languages, intl, locale);
    expect(result).toBe('');
  });
});
