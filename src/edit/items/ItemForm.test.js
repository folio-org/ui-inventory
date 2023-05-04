import React from 'react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { screen, waitFor, fireEvent } from '@testing-library/react';


import '../../../test/jest/__mock__';

import { StripesContext } from '@folio/stripes/core';


import {
  renderWithIntl,
  translationsProperties,
  stripesStub,
} from '../../../test/jest/helpers';
import { DataContext } from '../../contexts';

import ItemForm from './ItemForm';

import useHoldingsQueryByHrids from '../../hooks/useHoldingsQueryByHrids';
import useInstancesQuery from '../../hooks/useInstancesQuery';

jest.mock('../common', () => ({
  LocationSelectionWithCheck: () => <div>LocationSelection</div>,
}));
jest.mock('../../hooks/useHoldingsQueryByHrids');
useHoldingsQueryByHrids.mockImplementation(() => {
  return {
    isLoading: false,
    holdingsRecords: [
      { hrid: 'bw789', id: 'bw789', instanceId: 'bw789' },
    ],
  };
});
jest.mock('../../hooks/useInstancesQuery');
useInstancesQuery.mockImplementation(() => {
  return {
    isSuccess: true,
    data: {
      instances: [],
    },
  };
});
jest.mock('./RemoteStorageWarning', () => ({
  RemoteStorageWarning: jest.fn().mockReturnValue('RemoteStorageWarning'),
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
  callNumberTypeId: 'callNumberTypeId',
  itemNoteTypeId: 'itemNoteTypeId',
  statisticalCodeId: 'statisticalCodeId',
  id: 'id',
  damagedStatusId: 'damagedStatusId',
  loanType : [{ id: 'loanTypesId', name: 'loanTypesId' }],
  materialType: [{ id: 'materialTypeId', name: 'materialTypeId' }],
  permanentLoanType: [{ id: 'permanentLoanTypeId', name: 'permanentLoanTypeId' }],
};
const mockHolding = { id: '1',
  holdingsStatement: 'Example Holdings Statement' };
const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();
const mockInstance = { id: 'instanceId', title: 'Example Title' };
const mockStripes = {
  connect: jest.fn(),
};

const mockReferenceTables = {
  locationsById: [{ id: 'permanentLocationId' }],
  electronicAccessRelationships: [
    { id: '1', name: 'Resource' },
    { id: '2', name: 'Version of Resource' },
  ],
  callNumberTypes: [
    { id: '1', name: 'Dewey' },
    { id: '2', name: 'Library of Congress' },
  ],
  statisticalCodes: [
    { id: '1', code: 'STAT001', name: 'Statistical Code 1' },
    { id: '2', code: 'STAT002', name: 'Statistical Code 2' },
  ],
  statisticalCodeTypes: [
    { id: '1', name: 'Statistical Code Type 1' },
    { id: '2', name: 'Statistical Code Type 2' },
  ],
  itemNoteTypes: [
    { id: '1', name: 'General Note' },
    { id: '2', name: 'Public Note' },
  ],
  loanTypes: [
    { id: '1', name: 'Regular Loan' },
    { id: '2', name: 'Short Loan' },
  ],
  materialTypes: [
    { id: '1', name: 'Book' },
    { id: '2', name: 'CD' },
  ],
  itemDamagedStatuses: [
    { id: '1', name: 'Damaged' },
    { id: '2', name: 'Not Damaged' },
  ],
};
const okapi = {
  url: 'https://folio-testing-okapi.dev.folio.org',
  tenant: 'test-tenant',
  token: 'test-token'
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

describe('should validate validateBarcode', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      status: 200,
      json: () => Promise.resolve({ totalRecords: 0 }),
    }));
  });
  it('validateBarcode response', async () => {
    const props = {
      initialValues: { barcode: '123' },
      okapi: { url: 'https://folio-testing-okapi.dev.folio.org', tenant: 'test', token: 'token' }
    };
    renderItemForm(props);
    await waitFor(() => {
      const searchBarcode = screen.getByLabelText('Barcode');
      expect(searchBarcode.value).toBe('123');
    });
  });
});
describe('should render ItemForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update barcode and click Save', async () => {
    const props = { initialValues: { barcode: '12345' }, okapi };
    renderItemForm(props);
    await waitFor(() => {
      const searchBarcode = screen.getByLabelText('Barcode');
      fireEvent.change(searchBarcode, { target: { value: 56576567 } });
      expect(searchBarcode.value).toBe('56576567');
    });
    const noteButton = screen.getByRole('button', { name:'Add note' });
    expect(noteButton).toBeInTheDocument();
    userEvent.click(noteButton);
    const noteTextbox = screen.getByRole('textbox', { name: 'Note' });
    userEvent.type(noteTextbox, 'testing purpose');
    expect(noteTextbox).toHaveValue('testing purpose');
    const saveBtn = screen.getByRole('button', { name : 'Save & close' });
    userEvent.click(saveBtn);
  });

  describe('Bound With modal', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should open and close', async () => {
      renderItemForm();

      const openModalButton = await screen.findByTestId('bound-with-add-button');
      userEvent.click(openModalButton);

      // Open the modal, test that the save button is visible
      let saveButton = screen.queryByTestId('bound-with-modal-save-button');
      expect(saveButton).not.toBeNull();
      expect(saveButton).toBeVisible();

      // Close the modal, look for the button again, test that it has disappeared
      const cancelModalButton = screen.queryByTestId('bound-with-modal-cancel-button');
      userEvent.click(cancelModalButton);
      await waitFor(() => {
        saveButton = screen.queryByTestId('bound-with-modal-save-button');
        expect(saveButton).toBeNull();
      });
    });

    it('should trigger addBoundWiths when saved', async () => {
      const { container } = renderItemForm();

      // Initially there are two bound-with holdings
      let rows = container.querySelectorAll('#acc10 *[data-test-repeater-field-row]');
      expect(rows.length).toEqual(2);

      const openModalButton = await screen.findByTestId('bound-with-add-button');
      userEvent.click(openModalButton);

      const firstInput = screen.queryAllByTestId('bound-with-modal-input')[0];
      userEvent.type(firstInput, 'bw789');

      const saveModalButton = screen.queryByTestId('bound-with-modal-save-button');
      userEvent.click(saveModalButton);

      // There should now be three
      rows = container.querySelectorAll('#acc10 *[data-test-repeater-field-row]');
      expect(rows.length).toEqual(3);
    });
  });
});

describe('changing props for ItemForm', () => {
  const onCancelMock = jest.fn();
  const onSubmitMock = jest.fn();
  const mockReferenceData = {
    locationsById: [{ id: 'permanentLocationId' }],
    electronicAccessRelationships: [],
    holdingsNoteTypes: [{ id: 'holdingsNoteTypeId', name: 'holdingsNoteTypeId' }],
    loanTypes: [],
  };
  const handleSubmitMock = jest.fn();
  const mockOnClose = jest.fn();
  const historyMock = {
    push: jest.fn(),
  };
  const httpErrorMock = null;
  const defaultProps = {
    handleSubmit: handleSubmitMock,
    pristine: true,
    submitting: true,
    copy: true,
    newItem: false,
    initialValues: {},
    onSubmit: onSubmitMock,
    onCancel: mockOnCancel,
    onClose: mockOnClose,
    instance: mockInstance,
    referenceTables: mockReferenceData,
    stripes: mockStripes,
    history: historyMock,
    httpError: httpErrorMock,
  };

  const renderItemFormSetup = (props = {}) => renderWithIntl(
    <ItemFormSetup {...props} {...defaultProps} />,
    translationsProperties
  );

  beforeEach(() => {
    onCancelMock.mockClear();
    renderItemFormSetup();
  });
  it('click Cancel button', () => {
    expect(screen.queryByLabelText('Instance HRID')).toBeNull();
    const CancelButton = screen.getByRole('button', { name:'Cancel' });
    expect(CancelButton).toBeInTheDocument();
    userEvent.click(CancelButton);
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});
