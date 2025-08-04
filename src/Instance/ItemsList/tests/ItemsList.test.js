import React from 'react';
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

const setSortingMock = jest.fn();

const ItemsListSetup = ({ draggable }) => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <DataContext.Provider value={{ locationsById: locations }}>
        <ItemsList
          items={itemsFixture}
          holding={holdingsRecordsFixture[0]}
          isItemsDragSelected={(_) => false}
          selectItemsForDrag={(_) => {}}
          getDraggingItems={jest.fn()}
          setSorting={setSortingMock}
          draggable={draggable}
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render all the items from the response', () => {
    const { container } = renderWithIntl(<ItemsListSetup />, translations);
    const amountOfItems = container.querySelectorAll('.mclRowFormatterContainer').length;

    expect(amountOfItems).toBe(itemsFixture.length);
    expect(screen.getByText(itemsFixture[0].barcode)).toBeInTheDocument();
    expect(screen.getByText(itemsFixture[1].barcode)).toBeInTheDocument();
    expect(screen.getByText(itemsFixture[2].barcode)).toBeInTheDocument();
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

        expect(setSortingMock).toHaveBeenCalledWith('-barcode');
      });
    });
  });

  describe('draggable mode', () => {
    it('should display columns in the table with checkbox column', () => {
      renderWithIntl(<ItemsListSetup draggable />, translations);

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
});
