import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import '../../../test/jest/__mock__';

import { StripesContext } from '@folio/stripes/core';

import {
  renderWithIntl,
  translationsProperties,
  stripesStub,
} from '../../../test/jest/helpers';
import { DataContext } from '../../contexts';

import ItemForm from './ItemForm';

jest.mock('../common', () => ({
  LocationSelectionWithCheck: () => <div>LocationSelection</div>,
}));

const mockInitialValues = {
  permanentLocationId: 'permanentLocationId',
  holdingsRecordId: 'bw123',
  boundWithTitles: [
    {
      briefInstance: { hrid: 'bw123', title: 'bw123' },
      briefHoldingsRecord: { id: 'bw123', hrid: 'bw123' },
    },
    {
      briefInstance: { hrid: 'bw456', title: 'bw456' },
      briefHoldingsRecord: { id: 'bw456', hrid: 'bw456' },
    },
  ],
};
const mockHolding = {};
const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();
const mockInstance = { id: 'instanceId' };
const mockReferenceTables = {
  locationsById: [{ id: 'permanentLocationId' }],
  electronicAccessRelationships: [],
};
const mockStripes = {
  connect: jest.fn(),
};

const queryClient = new QueryClient();

const ItemFormSetup = (props = {}) => (
  <Router>
    <QueryClientProvider client={queryClient}>
      <StripesContext.Provider value={stripesStub}>
        <DataContext.Provider value={{
          contributorTypes: [],
          instanceFormats: [],
          modesOfIssuance: [],
          natureOfContentTerms: [],
          tagsRecords: [],
        }}
        >
          <ItemForm
            initialValues={mockInitialValues}
            onSubmit={mockOnSubmit}
            onCancel={mockOnCancel}
            instance={mockInstance}
            referenceTables={mockReferenceTables}
            stripes={mockStripes}
            holdingsRecord={mockHolding}
            {...props}
          />
        </DataContext.Provider>
      </StripesContext.Provider>
    </QueryClientProvider>
  </Router>
);

const renderItemForm = (props = {}) => renderWithIntl(
  <ItemFormSetup {...props} />,
  translationsProperties
);

describe('ItemForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render form', () => {
    const { container } = renderItemForm();

    expect(container.querySelectorAll('form').length).toEqual(1);
  });

  it('should place cursor in the barcode field as default', () => {
    const { getByLabelText } = renderItemForm();
    const barcodeField = getByLabelText(/Barcode/i);

    expect(barcodeField).toHaveFocus();
  });

  it('should render correct accordions', () => {
    const { getByText, getAllByText } = renderItemForm();

    expect(getByText('Administrative data')).toBeInTheDocument();
    expect(getByText('Item data')).toBeInTheDocument();
    expect(getByText('Enumeration data')).toBeInTheDocument();
    expect(getByText('Condition')).toBeInTheDocument();
    expect(getByText('Item notes')).toBeInTheDocument();
    expect(getByText('Loan and availability')).toBeInTheDocument();
    expect(getByText('Location')).toBeInTheDocument();
    expect(getAllByText('Electronic access')[0]).toBeInTheDocument();
    expect(getAllByText('Bound-with and analytics')[0]).toBeInTheDocument();
  });
});
