import React from 'react';
import '../../test/jest/__mock__';
import { renderWithIntl, translationsProperties } from '../../test/jest/helpers';

import { ForItems, ForHoldings } from './Warning';

describe('Warning', () => {
  it('should render ForItems with count props ', () => {
    const { getByText } = renderWithIntl(<ForItems count={2} />, translationsProperties);
    expect(getByText(/Item has been successfully moved in FOLIO. To complete removing this item from remote storage, run an exception report or communicate this directly to your remote storage location./i)).toBeInTheDocument();
  });
  it('should render ForItems without count props ', () => {
    const { getByText } = renderWithIntl(<ForItems />, translationsProperties);
    expect(getByText(/Item has been successfully moved in FOLIO. To complete removing this item from remote storage, run an exception report or communicate this directly to your remote storage location./i)).toBeInTheDocument();
  });
  it('should render ForHoldings with itemCount props', () => {
    const { getByText } = renderWithIntl(<ForHoldings itemCount={1} />, translationsProperties);
    expect(getByText(/To remove the holdings from remote storage, run an exception report or communicate this directly to your remote storage location. This includes/i)).toBeInTheDocument();
    expect(getByText(1)).toBeInTheDocument();
    expect(getByText(/title./i)).toBeInTheDocument();
  });
  it('should render ForHoldings without itemCount props', () => {
    const { getByText } = renderWithIntl(<ForHoldings />, translationsProperties);
    expect(getByText(/To remove the holdings from remote storage, run an exception report or communicate this directly to your remote storage location. This includes/i)).toBeInTheDocument();
    expect(getByText(/no/i)).toBeInTheDocument();
    expect(getByText(/title./i)).toBeInTheDocument();
  });
});
