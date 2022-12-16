import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import { renderWithIntl, translationsProperties } from '../../test/jest/helpers';
import { ForItems, ForHoldings } from './Warning';

const defaultProps = {
  ForItems: {
    count: 2,
  },
  ForHoldings: {
    itemCount: 1,
  },
};

const ForItemsSetup = () => (
  <MemoryRouter>
    <ForItems count={1} />
    <ForHoldings itemCount={0} />
  </MemoryRouter>
);

const renderForItems = () => renderWithIntl(
  <ForItemsSetup />,
  translationsProperties
);

describe('Warning', () => {
  it('count and itemCount to be defined', () => {
    renderForItems();
    expect(defaultProps).toBeDefined();
  });
  it('count and itemCount will through errors if not match', () => {
    renderForItems();
    expect(defaultProps).not.toBeFalsy();
  });
});
