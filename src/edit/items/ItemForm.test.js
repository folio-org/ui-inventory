import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import '../../../test/jest/__mock__';

import { fireEvent, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { StripesContext } from '@folio/stripes/core';

import {
  NUMBER_GENERATOR_OPTIONS_OFF,
  NUMBER_GENERATOR_OPTIONS_ON_EDITABLE,
  NUMBER_GENERATOR_OPTIONS_ON_NOT_EDITABLE,
} from '../../settings/NumberGeneratorSettings/constants';
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

  describe('Render ItemsForm with number generator settings "onNotEditable"', () => {
    it('should render number generate buttons and disable their fields', () => {
      const { getByRole } = renderItemForm({
        numberGeneratorData: {
          accessionNumber: NUMBER_GENERATOR_OPTIONS_ON_NOT_EDITABLE,
          barcode: NUMBER_GENERATOR_OPTIONS_ON_NOT_EDITABLE,
          callNumber: NUMBER_GENERATOR_OPTIONS_ON_NOT_EDITABLE,
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

  describe('Render ItemsForm with number generator settings "onEditable"', () => {
    it('should render number generate buttons and enable their fields', () => {
      const { getByRole } = renderItemForm({
        numberGeneratorData: {
          accessionNumber: NUMBER_GENERATOR_OPTIONS_ON_EDITABLE,
          barcode: NUMBER_GENERATOR_OPTIONS_ON_EDITABLE,
          callNumber: NUMBER_GENERATOR_OPTIONS_ON_EDITABLE,
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

  describe('Render ItemsForm with number generator settings "off"', () => {
    it('should render number generate buttons and enable their fields', () => {
      const { queryByRole, getByRole } = renderItemForm({
        numberGeneratorData: {
          accessionNumber: NUMBER_GENERATOR_OPTIONS_OFF,
          barcode: NUMBER_GENERATOR_OPTIONS_OFF,
          callNumber: NUMBER_GENERATOR_OPTIONS_OFF,
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
          accessionNumber: NUMBER_GENERATOR_OPTIONS_ON_NOT_EDITABLE,
          barcode: '',
          callNumber: NUMBER_GENERATOR_OPTIONS_OFF,
          callNumberHoldings: '',
          useSharedNumber: true,
        }
      });

      expect(getAllByRole('button', { name: 'Generate accession and call numbers' })).toHaveLength(2);
      expect(queryByRole('button', { name: 'Generate accession number' })).not.toBeInTheDocument();
      expect(queryByRole('button', { name: 'Generate call number' })).not.toBeInTheDocument();
    });
  });
  describe('Render additional call numbers', () => {
    it('should render additional call numbers', () => {
      const initialValues = {
        ...mockInitialValues,
        additionalCallNumbers: [{
          callNumber: 'cn1',
          prefix: 'prefix1',
          suffix: 'suffix1',
          typeId: '1',
        }],
      };
      const referenceTables = {
        ...mockReferenceTables,
        callNumberTypes: [{ id: '1', name: 'Library of Congress classification' }],
      };
      const { getByText, getAllByText, queryByText } = renderItemForm({
        initialValues,
        referenceTables,
      });

      expect(getByText('Additional call numbers')).toBeInTheDocument();
      expect(getByText('prefix1')).toBeInTheDocument();
      expect(getByText('suffix1')).toBeInTheDocument();
      expect(getByText('cn1')).toBeInTheDocument();
      expect(getAllByText('Library of Congress classification').length).toBe(2);
    });
  });

  describe('Form validation', () => {
    it('should display hint, when no call number is added', () => {
      const { getAllByText, getByRole } = renderItemForm();
      fireEvent.click(getByRole('button', { name: 'Add additional call number' }));
      fireEvent.click(getByRole('button', { name: 'Save & close' }));
      expect(getAllByText('Please select to continue').length).toBe(3);
    });
  });

  describe('Swap primary and additional call number', () => {
    it('should swap primary and additional call number', async () => {
      const mockHandleCallNumberSwap = jest.fn();
      const mockGetFieldState = jest.fn((fieldName) => {
        const values = {
          'itemLevelCallNumber': { value: 'itemLevelCallNumber' },
          'itemLevelCallNumberPrefix': { value: 'itemLevelCallNumberPrefix' },
          'itemLevelCallNumberSuffix': { value: 'itemLevelCallNumberSuffix' },
          'itemLevelCallNumberTypeId': { value: '2' },
          'additionalCallNumbers': {
            value: [{
              callNumber: 'cn1',
              prefix: 'prefix1',
              suffix: 'suffix1',
              typeId: '1'
            }]
          }
        };
        return values[fieldName];
      });

      const { container } = renderItemForm({
        ...mockInitialValues,
        handleCallNumberSwap: mockHandleCallNumberSwap,
        form: {
          getFieldState: mockGetFieldState,
          getState: () => ({
            values: {
              itemLevelCallNumber: 'itemLevelCallNumber',
              itemLevelCallNumberPrefix: 'itemLevelCallNumberPrefix',
              itemLevelCallNumberSuffix: 'itemLevelCallNumberSuffix',
              itemLevelCallNumberTypeId: '2',
              additionalCallNumbers: [{
                callNumber: 'cn1',
                prefix: 'prefix1',
                suffix: 'suffix1',
                typeId: '1'
              }]
            }
          }),
        },
        initialValues: {
          ...mockInitialValues,
          itemLevelCallNumber: 'itemLevelCallNumber',
          itemLevelCallNumberPrefix: 'itemLevelCallNumberPrefix',
          itemLevelCallNumberSuffix: 'itemLevelCallNumberSuffix',
          itemLevelCallNumberTypeId: '2',
          additionalCallNumbers: [{
            callNumber: 'cn1',
            prefix: 'prefix1',
            suffix: 'suffix1',
            typeId: '1'
          }]
        },
        referenceTables: {
          ...mockReferenceTables,
          callNumberTypes: [
            { id: '1', name: 'Library of Congress' },
            { id: '2', name: 'Dewey' },
          ]
        },
      });
      expect(container.querySelector('form')).toBeInTheDocument();

      const swapButton = screen.getByRole('button', { name: /Change with primary call number/i });
      expect(swapButton).toBeInTheDocument();
      await fireEvent.click(swapButton);
      waitFor(() => {
        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('itemLevelCallNumber', 'cn1');
        expect(mockHandleCallNumberSwap()).toHaveBeenCalledWith('itemLevelCallNumberPrefix', 'prefix1');
        expect(mockHandleCallNumberSwap()).toHaveBeenCalledWith('itemLevelCallNumberSuffix', 'suffix1');
        expect(mockHandleCallNumberSwap()).toHaveBeenCalledWith('itemLevelCallNumberTypeId', '1');
        expect(mockHandleCallNumberSwap()).toHaveBeenCalledWith('additionalCallNumbers', [{
          callNumber: 'itemLevelCallNumber',
          prefix: 'itemLevelCallNumberPrefix',
          suffix: 'itemLevelCallNumberSuffix',
          typeId: '2'
        }]);
      });
    });
    it('should swap primary and additional call number with the correct entry in array', async () => {
      const mockHandleCallNumberSwap = jest.fn();
      const mockGetFieldState = jest.fn((fieldName) => {
        const values = {
          'itemLevelCallNumber': { value: 'itemLevelCallNumber' },
          'itemLevelCallNumberPrefix': { value: 'itemLevelCallNumberPrefix' },
          'itemLevelCallNumberSuffix': { value: 'itemLevelCallNumberSuffix' },
          'itemLevelCallNumberTypeId': { value: '2' },
          'additionalCallNumbers':
            [
              {
                callNumber: 'cn1',
                prefix: 'prefix1',
                suffix: 'suffix1',
                typeId: '1'
              },
              {
                callNumber: 'cn2',
                prefix: 'prefix2',
                suffix: 'suffix2',
                typeId: '3'
              }
            ]
        };
        return values[fieldName];
      });

      renderItemForm({
        ...mockInitialValues,
        handleCallNumberSwap: mockHandleCallNumberSwap,
        form: {
          getFieldState: mockGetFieldState,
          getState: () => ({
            values: {
              itemLevelCallNumber: 'itemLevelCallNumber',
              itemLevelCallNumberPrefix: 'itemLevelCallNumberPrefix',
              itemLevelCallNumberSuffix: 'itemLevelCallNumberSuffix',
              itemLevelCallNumberTypeId: '2',
              additionalCallNumbers: [{
                callNumber: 'cn1',
                prefix: 'prefix1',
                suffix: 'suffix1',
                typeId: '1'
              },
              {
                callNumber: 'cn2',
                prefix: 'prefix2',
                suffix: 'suffix2',
                typeId: '3'
              }]
            }
          }),
        },
        initialValues: {
          ...mockInitialValues,
          itemLevelCallNumber: 'itemLevelCallNumber',
          itemLevelCallNumberPrefix: 'itemLevelCallNumberPrefix',
          itemLevelCallNumberSuffix: 'itemLevelCallNumberSuffix',
          itemLevelCallNumberTypeId: '2',
          additionalCallNumbers: [
            {
              callNumber: 'cn1',
              prefix: 'prefix1',
              suffix: 'suffix1',
              typeId: '1'
            },
            {
              callNumber: 'cn2',
              prefix: 'prefix2',
              suffix: 'suffix2',
              typeId: '3'
            }
          ]
        },
        referenceTables: {
          ...mockReferenceTables,
          callNumberTypes: [
            { id: '1', name: 'Library of Congress' },
            { id: '2', name: 'Dewey' },
            { id: '3', name: 'Local' }
          ]
        },
      });

      const swapButtons = screen.getAllByRole('button', { name: /Change with primary call number/i });
      fireEvent.click(swapButtons[1]);

      waitFor(() => {
        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('itemLevelCallNumber', 'cn2');
        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('itemLevelCallNumberPrefix', 'prefix2');
        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('itemLevelCallNumberSuffix', 'suffix2');
        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('itemLevelCallNumberTypeId', '3');

        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('additionalCallNumbers', [
          {
            callNumber: 'cn1',
            prefix: 'prefix1',
            suffix: 'suffix1',
            typeId: '1'
          },
          {
            callNumber: 'itemLevelCallNumber',
            prefix: 'itemLevelCallNumberPrefix',
            suffix: 'itemLevelCallNumberSuffix',
            typeId: '2'
          }
        ]);
      });

      // switch back
      await fireEvent.click(swapButtons[1]);

      waitFor(() => {
        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('itemLevelCallNumber', 'itemLevelCallNumber');
        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('itemLevelCallNumberPrefix', 'itemLevelCallNumberPrefix');
        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('itemLevelCallNumberSuffix', 'itemLevelCallNumberSuffix');
        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('itemLevelCallNumberTypeId', '2');

        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('additionalCallNumbers', [
          {
            callNumber: 'cn1',
            prefix: 'prefix1',
            suffix: 'suffix1',
            typeId: '1'
          },
          {
            callNumber: 'cn2',
            prefix: 'prefix2',
            suffix: 'suffix2',
            typeId: '3'
          }
        ]);
      });
    });
  });
});
