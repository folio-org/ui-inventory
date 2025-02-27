import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import '../../../test/jest/__mock__';

import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { StripesContext } from '@folio/stripes/core';


import { NUMBER_GENERATOR_OPTIONS } from '../../settings/NumberGeneratorSettings/constants';
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
const mockSetKeepEditing = jest.fn();

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
            setKeepEditing={mockSetKeepEditing}
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

  it('should render Save & keep editing and Save & close buttons', () => {
    const { getByRole } = renderItemForm({
      showKeepEditingButton: true,
    });

    expect(getByRole('button', { name: 'Save & keep editing' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Save & close' })).toBeInTheDocument();
  });

  describe('when clicking Save & close', () => {
    it('should call setKeepEditing with false', () => {
      const { getByRole } = renderItemForm();

      fireEvent.change(getByRole('textbox', { name: 'Barcode' }), { target: { value: 'new barcode' } });
      fireEvent.click(getByRole('button', { name: 'Save & close' }));

      expect(mockSetKeepEditing).toHaveBeenCalledWith(false);
    });
  });

  describe('when clicking Save & keep editing', () => {
    it('should call setKeepEditing with true', () => {
      const { getByRole } = renderItemForm({
        showKeepEditingButton: true,
      });

      fireEvent.change(getByRole('textbox', { name: 'Barcode' }), { target: { value: 'new barcode' } });
      fireEvent.click(getByRole('button', { name: 'Save & keep editing' }));

      expect(mockSetKeepEditing).toHaveBeenCalledWith(true);
    });
  });

  describe('Render ItemsForm with number generator settings "useGenerator"', () => {
    it('should render number generate buttons and disable their fields', () => {
      const { getByRole } = renderItemForm({
        numberGeneratorData: {
          accessionNumber: NUMBER_GENERATOR_OPTIONS.USE_GENERATOR,
          barcode: NUMBER_GENERATOR_OPTIONS.USE_GENERATOR,
          callNumber: NUMBER_GENERATOR_OPTIONS.USE_GENERATOR,
          callNumberHoldings: '',
          useSharedNumber: false,
        }
      });

      expect(getByRole('button', { name: 'Generate accession number' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Accession number' })).toBeDisabled();

      expect(getByRole('button', { name: 'Generate barcode' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Barcode' })).toBeDisabled();

      expect(getByRole('button', { name: 'Generate call number' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Call number' })).toBeDisabled();
    });
  });

  describe('Render ItemsForm with number generator settings "useBoth"', () => {
    it('should render number generate buttons and enable their fields', () => {
      const { getByRole } = renderItemForm({
        numberGeneratorData: {
          accessionNumber: NUMBER_GENERATOR_OPTIONS.USE_BOTH,
          barcode: NUMBER_GENERATOR_OPTIONS.USE_BOTH,
          callNumber: NUMBER_GENERATOR_OPTIONS.USE_BOTH,
          callNumberHoldings: '',
          useSharedNumber: false,
        }
      });

      expect(getByRole('button', { name: 'Generate accession number' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Accession number' })).toBeEnabled();

      expect(getByRole('button', { name: 'Generate barcode' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Barcode' })).toBeEnabled();

      expect(getByRole('button', { name: 'Generate call number' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Call number' })).toBeEnabled();
    });
  });

  describe('Render ItemsForm with number generator settings "useTextField"', () => {
    it('should render number generate buttons and enable their fields', () => {
      const { queryByRole, getByRole } = renderItemForm({
        numberGeneratorData: {
          accessionNumber: NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD,
          barcode: NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD,
          callNumber: NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD,
          callNumberHoldings: '',
          useSharedNumber: false,
        }
      });

      expect(queryByRole('button', { name: 'Generate accession number' })).not.toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Accession number' })).toBeEnabled();

      expect(queryByRole('button', { name: 'Generate barcode' })).not.toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Barcode' })).toBeEnabled();

      expect(queryByRole('button', { name: 'Generate call number' })).not.toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Call number' })).toBeEnabled();
    });
  });

  describe('Render ItemsForm with number generator settings "useSharedNumber" true', () => {
    it('should render renderSharedNumberGenerator', () => {
      const { getAllByRole, queryByRole } = renderItemForm({
        numberGeneratorData: {
          accessionNumber: NUMBER_GENERATOR_OPTIONS.USE_GENERATOR,
          barcode: '',
          callNumber: NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD,
          callNumberHoldings: '',
          useSharedNumber: true,
        }
      });

      expect(getAllByRole('button', { name: 'Generate accession and call numbers' })).toHaveLength(2);
      expect(queryByRole('button', { name: 'Generate accession number' })).not.toBeInTheDocument();
      expect(queryByRole('button', { name: 'Generate call number' })).not.toBeInTheDocument();
    });
  });
});
