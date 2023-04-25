import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

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

  describe('when displaying boundWithTitles rows', () => {
    it('should disable delete on a directly linked holding', async () => {
      const { container } = renderItemForm();

      await waitFor(() => {
        const directlyLinkedTitle = container.querySelector("*[data-test-repeater-field-row] input[value='bw123']");
        const directlyLinkedDelete = directlyLinkedTitle.closest('div[data-test-repeater-field-row]')
          .getElementsByTagName('button').item(0);
        expect(directlyLinkedDelete.disabled).toBeTruthy();
      });
    });

    it('should enable delete on an indirectly linked holding', async () => {
      const { container } = renderItemForm();

      await waitFor(() => {
        const indirectlyLinkedTitle = container.querySelector("*[data-test-repeater-field-row] input[value='bw456']");
        const indirectlyLinkedDelete = indirectlyLinkedTitle.closest('div[data-test-repeater-field-row]')
          .getElementsByTagName('button').item(0);
        expect(indirectlyLinkedDelete.disabled).toBeFalsy();
      });
    });
  });

  describe('Bound With modal', () => {
    it('should start out closed', async () => {
      renderItemForm();

      const saveButton = screen.queryByTestId('bound-with-modal-save-button');
      expect(saveButton).toBeNull();
    });

    it('should open and close', async () => {
      renderItemForm();

      const openModalButton = await screen.findByTestId('bound-with-add-button');
      user.click(openModalButton);

      // Open the modal, test that the save button is visible
      let saveButton = screen.queryByTestId('bound-with-modal-save-button');
      expect(saveButton).not.toBeNull();
      expect(saveButton).toBeVisible();

      // Close the modal, look for the button again, test that it has disappeared
      const cancelModalButton = screen.queryByTestId('bound-with-modal-cancel-button');
      user.click(cancelModalButton);
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
      user.click(openModalButton);

      const firstInput = screen.queryAllByTestId('bound-with-modal-input')[0];
      user.type(firstInput, 'bw789');

      const saveModalButton = screen.queryByTestId('bound-with-modal-save-button');
      user.click(saveModalButton);

      // There should now be three
      rows = container.querySelectorAll('#acc10 *[data-test-repeater-field-row]');
      expect(rows.length).toEqual(3);
    });
  });
});
