import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { fireEvent, screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import DataContext from '../../../contexts/DataContext';

import { items as itemsFixture } from '../../../../test/fixtures/items';
import { holdingsRecords as holdingsRecordsFixture } from '../../../../test/fixtures/holdingsRecords';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import translations from '../../../../test/jest/helpers/translationsProperties';
import ItemsList from '../ItemsList';
import useHoldingItemsQuery from '../../../hooks/useHoldingItemsQuery';
import '../../../Holding/ViewHolding/HoldingBoundWith/useBoundWithHoldings';
import { InventoryActionsContext, InventoryStateContext } from '../../../dnd/InventoryProvider/InventoryProvider';
import { SelectionProvider } from '../../../dnd';
import { OrderManagementProvider } from '../../../providers';

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

const holdings = {
  'holdingId1': {
    itemIds: ['itemId1', 'itemId2'],
  },
};

const items = {
  'itemId1': {
    id: 'itemId1',
    barcode: '1234567890123',
    status: { name: 'Available' },
    copyNumber: '1',
    loanType: { name: 'Regular' },
    effectiveLocation: { id: 'fcd64ce1-6995-48f0-840e-89ffa2288371' },
    enumeration: 'Vol. 1',
    chronology: '2021',
    volume: '1',
    yearCaption: ['2021'],
    materialType: { name: 'Book' },
  },
  'itemId2': {
    id: 'itemId2',
    barcode: '1234567890124',
    status: { name: 'Checked out' },
    copyNumber: '2',
    loanType: { name: 'Regular' },
    effectiveLocation: { id: 'fcd64ce1-6995-48f0-840e-89ffa2288371' },
    enumeration: 'Vol. 2',
    chronology: '2022',
    volume: '2',
    yearCaption: ['2022'],
    materialType: { name: 'Book' },
  },
};

const ItemsListSetup = ({ isItemsMovement }) => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <DataContext.Provider value={{ locationsById: locations }}>
        <InventoryStateContext.Provider value={{ holdings, items }}>
          <InventoryActionsContext.Provider value={{ setItemsToHolding: jest.fn() }}>
            <SelectionProvider>
              <OrderManagementProvider>
                <ItemsList
                  holding={holdingsRecordsFixture[0]}
                  isItemsMovement={isItemsMovement}
                />
              </OrderManagementProvider>
            </SelectionProvider>
          </InventoryActionsContext.Provider>
        </InventoryStateContext.Provider>
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render all the items from the response', () => {
    const { container } = renderWithIntl(<ItemsListSetup />, translations);
    const amountOfItems = container.querySelectorAll('.mclRowFormatterContainer').length;

    expect(amountOfItems).toBe(2);
    expect(screen.getByText('1234567890123')).toBeInTheDocument();
    expect(screen.getByText('1234567890124')).toBeInTheDocument();
  });

  describe('non-draggable mode', () => {
    it('should display columns in the table', () => {
      renderWithIntl(<ItemsListSetup />, translations);

      expect(screen.getByText('Order')).toBeInTheDocument();
      expect(screen.getByText('Item: barcode')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Copy number')).toBeInTheDocument();
      expect(screen.getByText('Loan type')).toBeInTheDocument();
      expect(screen.getByText('Effective location')).toBeInTheDocument();
      expect(screen.getByText('Enumeration')).toBeInTheDocument();
      expect(screen.getByText('Chronology')).toBeInTheDocument();
      expect(screen.getByText('Volume')).toBeInTheDocument();
      expect(screen.getByText('Year, caption')).toBeInTheDocument();
      expect(screen.getByText('Material type')).toBeInTheDocument();
    });

    describe('when click on the header in order to sort', () => {
      it('should call the function to change the sorting', () => {
        renderWithIntl(<ItemsListSetup />, translations);

        const barcodeHeader = screen.getByRole('button', { name: 'Item: barcode' });
        fireEvent.click(barcodeHeader);

        expect(useHoldingItemsQuery.mock.calls[0][1].searchParams.sortBy).toBe('order');
      });
    });
  });

  describe('draggable mode', () => {
    it('should display columns in the table with checkbox column', () => {
      renderWithIntl(<ItemsListSetup isItemsMovement />, translations);

      expect(screen.getByText('Order')).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: 'Select/unselect all items for movement' })).toBeInTheDocument();
      expect(screen.getByText('Item: barcode')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Copy number')).toBeInTheDocument();
      expect(screen.getByText('Loan type')).toBeInTheDocument();
      expect(screen.getByText('Effective location')).toBeInTheDocument();
      expect(screen.getByText('Enumeration')).toBeInTheDocument();
      expect(screen.getByText('Chronology')).toBeInTheDocument();
      expect(screen.getByText('Volume')).toBeInTheDocument();
      expect(screen.getByText('Year, caption')).toBeInTheDocument();
      expect(screen.getByText('Material type')).toBeInTheDocument();
    });
  });

  describe('when moving items', () => {
    it('should sort items by order', () => {
      renderWithIntl(<ItemsListSetup isItemsMovement />, translations);

      expect(useHoldingItemsQuery.mock.calls[0][1].searchParams.sortBy).toBe('order');
    });
  });
});
