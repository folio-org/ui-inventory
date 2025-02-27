import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import { StripesContext } from '@folio/stripes/core';

import { NUMBER_GENERATOR_OPTIONS } from '../../settings/NumberGeneratorSettings/constants';

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
  callNumberTypes: [{ id: 'callNumberTypeId', name: 'callNumberTypeId' }],
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

  describe('Render HoldingsForm with number generator settings "useGenerator"', () => {
    it('should render generate call number button and disable call number field', () => {
      const { getByRole } = renderHoldingsForm({
        numberGeneratorData: {
          accessionNumber: '',
          barcode: '',
          callNumber: '',
          callNumberHoldings: NUMBER_GENERATOR_OPTIONS.USE_GENERATOR,
          useSharedNumber: false,
        }
      });

      expect(getByRole('button', { name: 'Generate call number' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Call number' })).toBeDisabled();
    });
  });

  describe('Render HoldingsForm with number generator settings "useBoth"', () => {
    it('should render generate call number button and enable call number field', () => {
      const { getByRole } = renderHoldingsForm({
        numberGeneratorData: {
          accessionNumber: '',
          barcode: '',
          callNumber: '',
          callNumberHoldings: NUMBER_GENERATOR_OPTIONS.USE_BOTH,
          useSharedNumber: true,
        }
      });

      expect(getByRole('button', { name: 'Generate call number' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Call number' })).toBeEnabled();
    });
  });

  describe('Render HoldingsForm with number generator settings "useTextField"', () => {
    it('should not render Generate call number button and enable call number field', () => {
      const { queryByRole, getByRole } = renderHoldingsForm({
        numberGeneratorData: {
          accessionNumber: '',
          barcode: '',
          callNumber: '',
          callNumberHoldings: NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD,
          useSharedNumber: true,
        }
      });

      expect(queryByRole('button', { name: 'Generate call number' })).not.toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Call number' })).toBeEnabled();
    });
  });
});
