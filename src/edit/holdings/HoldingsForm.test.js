import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import { StripesContext } from '@folio/stripes/core';

import {
  renderWithIntl,
  translationsProperties,
  stripesStub,
} from '../../../test/jest/helpers';
import { DataContext } from '../../contexts';

import HoldingsForm from './HoldingsForm';

jest.mock('@folio/service-interaction', () => ({
  NumberGeneratorModalButton: () => <div>NumberGeneratorModalButton</div>
}));

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
            configs={{}}
            onSubmit={mockOnSubmit}
            onCancel={mockOnCancel}
            instance={mockInstance}
            referenceTables={mockReferenceTables}
            itemCount={mockItemCount}
            goTo={mockGoTo}
            isMARCRecord
            resources={mockResources}
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
});
