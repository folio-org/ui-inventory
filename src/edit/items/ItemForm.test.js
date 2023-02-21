import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { waitFor } from '@testing-library/react';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import '../../../test/jest/__mock__';
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
});
