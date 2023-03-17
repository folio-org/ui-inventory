import React from 'react';
import { render } from '@testing-library/react';
import { formattedLanguageName } from '@folio/stripes/components';
import { formatLanguages } from './utils';

jest.mock('@folio/stripes/components', () => ({
  formattedLanguageName: jest.fn(),
}));

describe('formatLanguages', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should render comma-separated list of formatted language names', () => {
    const languages = ['en', 'es', 'fr'];
    const intl = {};
    const locale = 'en-US';
    formattedLanguageName.mockImplementation((languageCode) => {
      switch (languageCode) {
        case 'en':
          return 'English';
        case 'es':
          return 'Spanish';
        case 'fr':
          return 'French';
        default:
          return '';
      }
    });
    const { getByTestId } = render(<div data-testid="formatted-languages">{formatLanguages(languages, intl, locale)}</div>);
    expect(formattedLanguageName).toHaveBeenCalledTimes(3);
    expect(formattedLanguageName).toHaveBeenCalledWith('en', intl, locale);
    expect(formattedLanguageName).toHaveBeenCalledWith('es', intl, locale);
    expect(formattedLanguageName).toHaveBeenCalledWith('fr', intl, locale);
    expect(getByTestId('formatted-languages')).toHaveTextContent('English, Spanish, French');
  });
});
