import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import DataContext from '../../../contexts/DataContext';

import { items as itemsFixture } from '../../../../test/fixtures/items';
import { holdingsRecords as holdingsRecordsFixture } from '../../../../test/fixtures/holdingsRecords';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import translations from '../../../../test/jest/helpers/translationsProperties';
import ItemsList from '../ItemsList';
import useHoldingItemsQuery from '../../../hooks/useHoldingItemsQuery';
import '../../../Holding/ViewHolding/HoldingBoundWith/useBoundWithHoldings';

jest.mock('../../../hooks/useHoldingItemsQuery', () => jest.fn());
jest.mock('../../../Holding/ViewHolding/HoldingBoundWith/useBoundWithHoldings', () => jest.fn(() => ({
  boundWithHoldings: [],
  isLoading: false,
})));

const queryClient = new QueryClient();

const locations = {
  'fcd64ce1-6995-48f0-840e-89ffa2288371':
    {
      id: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
      name: 'Main Library',
      isActive: true,
    },
  'fcd64ce1-6995-48f0-840e-89ffa2288372' :
    {
      id: 'fcd64ce1-6995-48f0-840e-89ffa2288372',
      name: 'Annex',
      isActive: false,
    },
};

const ItemsListSetup = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <DataContext.Provider value={{ locationsById: locations }}>
        <ItemsList
          items={itemsFixture}
          holding={holdingsRecordsFixture[0]}
          isItemsDragSelected={(_) => false}
          selectItemsForDrag={(_) => {}}
          getDraggingItems={jest.fn()}
          draggable={false}
          isFetching={false}
        />
      </DataContext.Provider>
    </Router>
  </QueryClientProvider>
);

describe('ItemsList', () => {
  beforeEach(async () => {
    useHoldingItemsQuery.mockReturnValue({
      isFetching: false,
      totalRecords: itemsFixture.length,
    });

    await act(async () => {
      await renderWithIntl(<ItemsListSetup />, translations);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display "inactive" by a location if applicable', () => {
    expect(screen.queryByText('Inactive')).toBeInTheDocument();
  });
});
