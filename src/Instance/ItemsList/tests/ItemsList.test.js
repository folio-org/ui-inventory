import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { stubArray } from 'lodash';
import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';

import '../../../../test/jest/__mock__';

import DataContext from '../../../contexts/DataContext';

import { items as itemsFixture } from '../../../../test/fixtures/items';
import { holdingsRecords as holdingsRecordsFixture } from '../../../../test/fixtures/holdingsRecords';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import translations from '../../../../test/jest/helpers/translationsProperties';
import ItemsList from '../ItemsList';
import useHoldingItemsQuery from '../../../hooks/useHoldingItemsQuery';

jest.mock('../../../hooks/useHoldingItemsQuery', () => jest.fn());

const queryClient = new QueryClient();

const locations = [
  {
    id: 'fcd64ce1-6995-48f0-840e-89ffa2288372',
    name: 'Annex',
    isActive: false,
  },
];

const ItemsListSetup = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <DataContext.Provider value={{ locationsById: { locations } }}>
        <ItemsList
          items={itemsFixture}
          holding={holdingsRecordsFixture[0]}
          isItemsDragSelected={(_) => false}
          selectItemsForDrag={(_) => {}}
          getDraggingItems={stubArray}
          draggable={false}
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
