import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';

import '../../../../test/jest/__mock__';

import DataContext from '../../../contexts/DataContext';

import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import translations from '../../../../test/jest/helpers/translationsProperties';
import { items as itemsFixture } from '../../../../test/fixtures/items';
import HoldingAccordion from './HoldingAccordion';
import useHoldingItemsQuery from '../../../hooks/useHoldingItemsQuery';

jest.mock('../../../hooks/useHoldingItemsQuery', () => jest.fn());

const HoldingAccordionSetup = () => (
  <Router>
    <DataContext.Provider value={{ locationsById: {} }}>
      <HoldingAccordion
        holding={{ id: '123' }}
        holdings={[]}
        onViewHolding={noop}
        onAddItem={noop}
        withMoveDropdown={false}
      >
        {() => null}
      </HoldingAccordion>
    </DataContext.Provider>
  </Router>
);

describe('HoldingAccordion', () => {
  beforeEach(async () => {
    useHoldingItemsQuery.mockReturnValue({
      isFetching: false,
      items: itemsFixture,
    });

    await act(async () => {
      await renderWithIntl(<HoldingAccordionSetup />, translations);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render items counter', () => {
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  describe('opening accordion', () => {
    beforeEach(() => {
      userEvent.click(screen.getByText(/Holdings:/));
    });

    it('should hide item counter', async () => {
      expect(screen.queryByText('3')).not.toBeInTheDocument();
    });
  });
});
