import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../../test/jest/__mock__';
import '../../../../test/jest/__mock__/stripesComponents.mock';

import DataContext from '../../../contexts/DataContext';

import { items as itemsFixture } from '../../../../test/fixtures/items';

import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import translations from '../../../../test/jest/helpers/translationsProperties';
import ItemsList from '../ItemsList';
import useHoldingItemsQuery from '../../../hooks/useHoldingItemsQuery';
import '../../../Holding/ViewHolding/HoldingBoundWith/useBoundWithHoldings';


jest.mock('../../../hooks/useHoldingItemsQuery', () => jest.fn());

jest.mock('../../../Holding/ViewHolding/HoldingBoundWith/useBoundWithHoldings', () => ({
  __esModule: true,
  default: () => ({
    boundWithHoldings: [],
    isLoading: false,
  }),
}));

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

const holding = {
  id: 'holdingsRecordId1',
};
const items = [
  {
    id: 'itemId1',
    holdingsRecordId: 'holdingsRecordId1',
    status: {
      name: 'Available',
    },
    copyNumber: '1',
    materialType: {
      name: 'Book',
    },
    temporaryLoanType: {
      name: 'Temporary Loan Type',
    },
    effectiveLocation: {
      id: 'locationId1',
    },
    enumeration: 'v.1',
    chronology: 'no.1',
    volume: 'vol.1',
    yearCaption: ['2021'],
  },
  {
    id: 'itemId2',
    holdingsRecordId: 'holdingsRecordId1',
    status: {
      name: 'Checked out',
    },
    copyNumber: '2',
    materialType: {
      name: 'CD',
    },
    permanentLoanType: {
      name: 'Permanent Loan Type',
    },
    effectiveLocation: {
      id: 'locationId2',
    },
    enumeration: 'v.2',
    chronology: 'no.2',
    volume: 'vol.2',
    yearCaption: ['2022'],
  },
];

const draggable = true;
const isItemsDragSelected = jest.fn();
const selectItemsForDrag = jest.fn();
const getDraggingItems = jest.fn();

const ItemsListSetup = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <DataContext.Provider value={{ locationsById: locations }}>
        <ItemsList
          holding={holding}
          items={items}
          draggable={draggable}
          isItemsDragSelected={isItemsDragSelected}
          selectItemsForDrag={selectItemsForDrag}
          getDraggingItems={getDraggingItems}
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
  it('should trigger the button click event', () => {
    const { container } = renderWithIntl(<ItemsListSetup />, translations);
    const buttonElement = container.querySelector('#list-items-holdingsRecordId1-clickable-list-column-dnd');
    expect(buttonElement).toBeInTheDocument();
    userEvent.click(buttonElement);
  });
  it('handles checkbox click correctly', () => {
    const checkbox = screen.getByLabelText('Select/unselect all items for movement');
    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
  it('calls onClick handler when clicked', () => {
    const { container } = renderWithIntl(<ItemsListSetup />, translations);
    const headerButton = container.querySelector('#list-items-holdingsRecordId1-clickable-list-column-status');
    expect(headerButton).toBeInTheDocument();
    userEvent.click(headerButton);
  });
});

describe('ItemsList - isFetching', () => {
  beforeEach(async () => {
    useHoldingItemsQuery.mockReturnValue({
      isFetching: true,
      totalRecords: itemsFixture.length,
    });
  });
  it('items should be empty array', () => {
    const { container } = renderWithIntl(
      <QueryClientProvider client={queryClient}>
        <Router>
          <DataContext.Provider value={{ locationsById: locations }}>
            <ItemsList
              holding={holding}
              items={[]}
              draggable={false}
              isItemsDragSelected={isItemsDragSelected}
              selectItemsForDrag={selectItemsForDrag}
              getDraggingItems={getDraggingItems}
            />
          </DataContext.Provider>
        </Router>
      </QueryClientProvider>,
      translations
    );
    expect(container).toBeInTheDocument();
  });
});
