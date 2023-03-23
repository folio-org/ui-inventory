import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import '../../../test/jest/__mock__';

import DataContext from '../../contexts/DataContext';
import DnDContext from '../DnDContext';
import { items as itemsFixture } from '../../../test/fixtures/items';
import { holdingsRecords as holdingsRecordsFixture } from '../../../test/fixtures/holdingsRecords';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translations from '../../../test/jest/helpers/translationsProperties';

import ItemsListContainer from './ItemsListContainer';
import useHoldingItemsQuery from '../../hooks/useHoldingItemsQuery';
import '../../Holding/ViewHolding/HoldingBoundWith/useBoundWithHoldings';

jest.mock('../../hooks/useHoldingItemsQuery', () => jest.fn());

jest.mock('../../Holding/ViewHolding/HoldingBoundWith/useBoundWithHoldings', () => jest.fn(() => ({
  boundWithHoldings: [],
  isLoading: false,
})));

const queryClient = new QueryClient();

const referenceData = {
  isItemsDragSelected:jest.fn(),
  selectItemsForDrag:jest.fn(),
  getDraggingItems:jest.fn(),
  isItemsDroppable:jest.fn(),
  activeDropZone:jest.fn(),
  isFetching: jest.fn(),
  draggable:jest.fn(),
  droppable:jest.fn(),
};

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

const ItemsListContainerSetup = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <DataContext.Provider value={{ locationsById: locations }}>
        <DnDContext.Provider value={referenceData}>
          <ItemsListContainer
            holding={holdingsRecordsFixture[0]}
            draggable="true"
            droppable="true"
          />
        </DnDContext.Provider>
      </DataContext.Provider>
    </Router>
  </QueryClientProvider>
);

describe('ItemsListContainer', () => {
  beforeEach(async () => {
    useHoldingItemsQuery.mockReturnValue({
      isFetching: true,
      totalRecords: itemsFixture.length,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('isFetching should be true', async () => {
    await act(async () => {
      const { container } = renderWithIntl(<ItemsListContainerSetup />, translations);
      const spinner = container.querySelector('.spinner');
      expect(spinner).toBeInTheDocument();
      const bounce1 = container.querySelector('.bounce1');
      const bounce2 = container.querySelector('.bounce2');
      const bounce3 = container.querySelector('.bounce3');
      expect(bounce1).toBeInTheDocument();
      expect(bounce2).toBeInTheDocument();
      expect(bounce3).toBeInTheDocument();
    });
  });
});

describe('ItemsList', () => {
  beforeEach(async () => {
    useHoldingItemsQuery.mockReturnValue({
      isFetching: false,
      totalRecords: itemsFixture.length,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('render ItemsList component', async () => {
    await act(async () => {
      const { container } = renderWithIntl(<ItemsListContainerSetup />, translations);
      expect(container).toBeDefined();
    });
  });
});
