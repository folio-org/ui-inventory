import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { fireEvent, waitFor, screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

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

import HoldingsForm from './HoldingsForm';

jest.mock('../common', () => ({
  LocationSelectionWithCheck: () => <div>LocationSelection</div>,
}));

const mockInitialValues = {
  holdingsNoteTypeId: 'holdingsNoteTypeId',
  callNumberTypeId: 'callNumberTypeId',
  holdingsTypeId: 'holdingsTypeId',
  sourceId: 'MARC',
  statisticalCodeId: 'statisticalCodeId',
  illPolicyId: 'illPolicyId',
  id: 'id',
  permanentLocationId: 'permanentLocationId',
};
const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();
const mockInstance = {};
const mockReferenceTables = {
  holdingsNoteTypes: [{ id: 'holdingsNoteTypeId', name: 'holdingsNoteTypeId' }],
  callNumberTypes: [{ id: 'callNumberTypeId', name: 'callNumberTypeId' }, { id: 'callNumberTypeId2', name: 'callNumberTypeId2' }],
  holdingsTypes: [{ id: 'holdingsTypeId', name: 'holdingsTypeId' }],
  holdingsSources: [{ id: 'MARC', name: 'MARC' }],
  holdingsSourcesByName: { MARC: { name: 'MARC' } },
  statisticalCodes: [{ id: 'statisticalCodeId', name: 'statisticalCodeId', code: 'statisticalCode' }],
  illPolicies: [{ id: 'illPolicyId', name: 'illPolicyId' }],
  electronicAccessRelationships: [],
};
const mockBlockedFields = [
  'shelvingTitle',
];
const mockResources = {
  holdingsBlockedFields: {
    hasLoaded: true,
    records: [{
      blockedFields: mockBlockedFields,
    }],
  },
};
const mockItemCount = 0;
const mockGoTo = jest.fn();
const mockSetKeepEditing = jest.fn();

const queryClient = new QueryClient();

const HoldingsFormSetup = (props = {}) => (
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
          <HoldingsForm
            initialValues={mockInitialValues}
            onSubmit={mockOnSubmit}
            onCancel={mockOnCancel}
            instance={mockInstance}
            referenceTables={mockReferenceTables}
            itemCount={mockItemCount}
            goTo={mockGoTo}
            isMARCRecord
            resources={mockResources}
            setKeepEditing={mockSetKeepEditing}
            {...props}
          />
        </DataContext.Provider>
      </StripesContext.Provider>
    </QueryClientProvider>
  </Router>
);

const renderHoldingsForm = (props = {}) => renderWithIntl(
  <HoldingsFormSetup {...props} />,
  translationsProperties
);

describe('HoldingsForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render form', () => {
    const { container } = renderHoldingsForm();

    expect(container.querySelectorAll('form').length).toEqual(1);
  });

  describe('when record source is MARC', () => {
    it('should disable mapped fields', async () => {
      const { getByLabelText } = renderHoldingsForm();

      expect(getByLabelText('Shelving title')).toBeDisabled();
    });

    it('should not disable not mapped fields', async () => {
      const { getByLabelText } = renderHoldingsForm();

      expect(getByLabelText('Holdings type')).toBeEnabled();
    });
  });

  describe('when record source is not MARC', () => {
    it('should not disable mapped fields', async () => {
      const { getByLabelText } = renderHoldingsForm({
        isMARCRecord: false,
      });

      expect(getByLabelText('Shelving title')).not.toBeDisabled();
    });
  });

  describe('when page was just loaded', () => {
    it('should have disabled Save and close button', () => {
      const { getByRole } = renderHoldingsForm();
      expect(getByRole('button', { name: /Save & close/i })).toBeDisabled();
    });
  });

  describe('when changing a field value', () => {
    it('should enable Save and close', async () => {
      const {
        getByLabelText,
        getByRole,
      } = renderHoldingsForm();

      fireEvent.change(getByLabelText('Copy number'), {
        target: { value: '12345' },
      });

      expect(getByRole('button', { name: /Save & close/i })).toBeEnabled();
    });
  });

  it('should render Save & keep editing and Save & close buttons', () => {
    const { getByRole } = renderHoldingsForm({
      showKeepEditingButton: true,
    });

    expect(getByRole('button', { name: 'Save & keep editing' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Save & close' })).toBeInTheDocument();
  });

  describe('when clicking Save & close', () => {
    it('should call setKeepEditing with false', () => {
      const { getByRole } = renderHoldingsForm();

      fireEvent.change(getByRole('textbox', { name: 'Call number' }), { target: { value: 'new call number' } });
      fireEvent.click(getByRole('button', { name: 'Save & close' }));

      expect(mockSetKeepEditing).toHaveBeenCalledWith(false);
    });
  });

  describe('when clicking Save & keep editing', () => {
    it('should call setKeepEditing with true', () => {
      const { getByRole } = renderHoldingsForm({
        showKeepEditingButton: true,
      });

      fireEvent.change(getByRole('textbox', { name: 'Call number' }), { target: { value: 'new call number' } });
      fireEvent.click(getByRole('button', { name: 'Save & keep editing' }));

      expect(mockSetKeepEditing).toHaveBeenCalledWith(true);
    });
  });

  describe('Render HoldingsForm with number generator settings "onNotEditable"', () => {
    it('should render generate call number button and disable call number field', () => {
      const { getByRole } = renderHoldingsForm({
        numberGeneratorData: {
          accessionNumber: '',
          barcode: '',
          callNumber: '',
          callNumberHoldings: NUMBER_GENERATOR_OPTIONS_ON_NOT_EDITABLE,
          useSharedNumber: false,
        }
      });

      expect(getByRole('button', { name: 'Generate call number' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Call number' })).toBeDisabled();
    });
  });

  describe('Render HoldingsForm with number generator settings "onEditable"', () => {
    it('should render generate call number button and enable call number field', () => {
      const { getByRole } = renderHoldingsForm({
        numberGeneratorData: {
          accessionNumber: '',
          barcode: '',
          callNumber: '',
          callNumberHoldings: NUMBER_GENERATOR_OPTIONS_ON_EDITABLE,
          useSharedNumber: true,
        }
      });

      expect(getByRole('button', { name: 'Generate call number' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Call number' })).toBeEnabled();
    });
  });

  describe('Render HoldingsForm with number generator settings "off"', () => {
    it('should not render Generate call number button and enable call number field', () => {
      const { queryByRole, getByRole } = renderHoldingsForm({
        numberGeneratorData: {
          accessionNumber: '',
          barcode: '',
          callNumber: '',
          callNumberHoldings: NUMBER_GENERATOR_OPTIONS_OFF,
          useSharedNumber: true,
        }
      });

      expect(queryByRole('button', { name: 'Generate call number' })).not.toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Call number' })).toBeEnabled();
    });
  });

  describe('Additional Call Numbers', () => {
    it('should render with initial additional call numbers', () => {
      const initialValues = {
        ...mockInitialValues,
        additionalCallNumbers: [{
          typeId: 'callNumberTypeId2',
          prefix: 'Prefix1',
          callNumber: 'CN1',
          suffix: 'Suffix1'
        }]
      };

      const { getByDisplayValue } = renderHoldingsForm({
        initialValues
      });

      expect(getByDisplayValue('Prefix1')).toBeInTheDocument();
      expect(getByDisplayValue('CN1')).toBeInTheDocument();
      expect(getByDisplayValue('Suffix1')).toBeInTheDocument();
      expect(getByDisplayValue('callNumberTypeId2')).toBeInTheDocument();
    });

    it('should render additional call numbers section', () => {
      const { getByText } = renderHoldingsForm();

      expect(getByText('Additional holdings call numbers')).toBeInTheDocument();
    });

    it('should render add button for additional call numbers', () => {
      const { getByRole } = renderHoldingsForm();

      expect(getByRole('button', { name: 'Add additional call number' })).toBeInTheDocument();
    });

    it('should add new additional call number fields when clicking add button', () => {
      const { getByRole, getAllByLabelText } = renderHoldingsForm();

      fireEvent.click(getByRole('button', { name: 'Add additional call number' }));

      expect(getAllByLabelText('Call number type')).toHaveLength(2); // One for main call number, one for additional
      expect(getAllByLabelText('Call number')).toHaveLength(2);
      expect(getAllByLabelText('Call number prefix')).toHaveLength(2);
      expect(getAllByLabelText('Call number suffix')).toHaveLength(2);
    });

    it('should remove additional call number fields when clicking delete button', () => {
      const { getByRole, getAllByLabelText } = renderHoldingsForm();

      fireEvent.click(getByRole('button', { name: 'Add additional call number' }));

      const deleteButton = screen.getByRole('button', { name: 'Delete this item' });
      fireEvent.click(deleteButton);

      // Should only have the main call number fields left
      expect(getAllByLabelText('Call number type')).toHaveLength(1);
      expect(getAllByLabelText('Call number')).toHaveLength(1);
      expect(getAllByLabelText('Call number prefix')).toHaveLength(1);
      expect(getAllByLabelText('Call number suffix')).toHaveLength(1);
    });
  });
  describe('form validation', () => {
    it('should show error when call number is required but empty', async () => {
      const { getByRole, getAllByText } = renderHoldingsForm();

      fireEvent.click(getByRole('button', { name: 'Add additional call number' }));
      fireEvent.click(getByRole('button', { name: 'Save & close' }));
      expect(getAllByText('Please select to continue').length).toBe(1);
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

      const { container } = renderHoldingsForm({
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
          callNumber: 'callNumber',
          callNumberPrefix: 'callNumberPrefix',
          callNumberSuffix: 'callNumberSuffix',
          callNumberTypeId: '2',
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
        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('callNumber', 'cn1');
        expect(mockHandleCallNumberSwap()).toHaveBeenCalledWith('callNumberPrefix', 'prefix1');
        expect(mockHandleCallNumberSwap()).toHaveBeenCalledWith('callNumberSuffix', 'suffix1');
        expect(mockHandleCallNumberSwap()).toHaveBeenCalledWith('callNumberTypeId', '1');
        expect(mockHandleCallNumberSwap()).toHaveBeenCalledWith('additionalCallNumbers', [{
          callNumber: 'callNumber',
          prefix: 'callNumberPrefix',
          suffix: 'callNumberSuffix',
          typeId: '2'
        }]);
      });
    });
    it('should swap primary and additional call number with the correct entry in array', async () => {
      const mockHandleCallNumberSwap = jest.fn();
      const mockGetFieldState = jest.fn((fieldName) => {
        const values = {
          'callNumber': { value: 'callNumber' },
          'callNumberPrefix': { value: 'callNumberPrefix' },
          'callNumberSuffix': { value: 'callNumberSuffix' },
          'callNumberTypeId': { value: '2' },
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

      renderHoldingsForm({
        ...mockInitialValues,
        form: {
          handleCallNumberSwap: mockHandleCallNumberSwap,
          getFieldState: mockGetFieldState,
          getState: () => ({
            values: {
              callNumber: 'callNumber',
              callNumberPrefix: 'callNumberPrefix',
              callNumberSuffix: 'callNumberSuffix',
              callNumberTypeId: '2',
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
          callNumber: 'callNumber',
          callNumberPrefix: 'callNumberPrefix',
          callNumberSuffix: 'callNumberSuffix',
          callNumberTypeId: '2',
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
        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('callNumber', 'cn2');
        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('callNumberPrefix', 'prefix2');
        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('callNumberSuffix', 'suffix2');
        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('callNumberTypeId', '3');

        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('additionalCallNumbers', [
          {
            callNumber: 'cn1',
            prefix: 'prefix1',
            suffix: 'suffix1',
            typeId: '1'
          },
          {
            callNumber: 'callNumber',
            prefix: 'callNumberPrefix',
            suffix: 'callNumberSuffix',
            typeId: '2'
          }
        ]);
      });

      // switch back
      await fireEvent.click(swapButtons[1]);

      waitFor(() => {
        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('callNumber', 'callNumber');
        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('callNumberPrefix', 'callNumberPrefix');
        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('callNumberSuffix', 'callNumberSuffix');
        expect(mockHandleCallNumberSwap).toHaveBeenCalledWith('callNumberTypeId', '2');

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
