import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import '../../../../../../test/jest/__mock__';
import { formatLanguages } from './utils';

describe('formatLanguages', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should render comma-separated list of formatted language names', () => {
    const languages = ['en', 'es', 'fr'];
    const intl = {};
    const locale = 'en-US';
    render(<div data-testid="formatted-languages">{formatLanguages(languages, intl, locale)}</div>);
    expect(screen.getByText('English, Spanish, French')).toBeInTheDocument();
  });
});
