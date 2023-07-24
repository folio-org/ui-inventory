import '../test/jest/__mock__';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { screen, act } from '@folio/jest-config-stripes/testing-library/react';

import { renderWithIntl, translationsProperties } from '../test/jest/helpers';
import ViewHoldingsRecord from './ViewHoldingsRecord';


jest.mock('./withLocation', () => jest.fn(c => c));

const spyOncollapseAllSections = jest.spyOn(require('@folio/stripes/components'), 'collapseAllSections');
const spyOnexpandAllSections = jest.spyOn(require('@folio/stripes/components'), 'expandAllSections');

const mockData = jest.fn().mockResolvedValue({ id: 'testId' });

const defaultProps = {
  id: 'id',
  goTo: jest.fn(),
  holdingsrecordid: 'holdingId',
  referenceTables: {
    holdingsSources: [{ id: 'sourceId', name: 'MARC' }],
    locationsById: {
      inactiveLocation: { name: 'Location 1', isActive: false },
    },
  },
  resources: {
    holdingsRecords: {
      records: [
        { sourceId: 'sourceId', temporaryLocationId: 'inactiveLocation' }
      ],
    },
    instances1: { records: [{ id: 'instanceId' }], hasLoaded: true },
    permanentLocation: { hasLoaded: true },
    temporaryLocation: { hasLoaded: true },
    boundWithParts: { records: [{ itemId: '9e8dc8ce-68f3-4e75-8479-d548ce521157' }], hasLoaded: true },
  },
  mutator: {
    instances1: {
      GET: jest.fn(() => Promise.resolve({ id: 'instanceId', source: 'testSource' })),
      reset: jest.fn(() => Promise.resolve()),
    },
    holdingsRecords: {
      GET: jest.fn(() => Promise.resolve({ hrid: 'hrid' })),
      POST: jest.fn(() => Promise.resolve()),
      PUT: jest.fn(() => Promise.resolve()),
      DELETE: jest.fn(() => Promise.resolve()),
      reset: jest.fn(() => Promise.resolve()),
    },
    marcRecord: {
      GET: mockData,
      DELETE: jest.fn(() => Promise.resolve()),
    },
    marcRecordId: {
      replace: jest.fn(),
    },
    permanentLocationQuery: {},
    temporaryLocationQuery: {},
    query: {},
  },
  history: {
    push: jest.fn(),
  },
  location: {
    search: '/',
    pathname: 'pathname'
  },
};

const queryClient = new QueryClient();

const renderViewHoldingsRecord = (props = {}) => renderWithIntl(
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      <ViewHoldingsRecord
        {...defaultProps}
        {...props}
      />,
    </MemoryRouter>
  </QueryClientProvider>,
  translationsProperties
);

describe('ViewHoldingsRecord actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render Loading when awaiting resource', () => {
    const { getByText } = renderViewHoldingsRecord({ referenceTables: {} });
    expect(getByText('LoadingView')).toBeDefined();
  });

  it('should close view holding page', async () => {
    renderViewHoldingsRecord();
    userEvent.click(await screen.findByRole('button', { name: 'confirm' }));
    expect(defaultProps.history.push).toBeCalled();
  });

  it('should translate to edit holding form page', async () => {
    renderViewHoldingsRecord();
    const editHoldingBtn = await screen.findByTestId('edit-holding-btn');
    userEvent.click(editHoldingBtn);
    expect(defaultProps.history.push).toHaveBeenCalled();
  });

  it('should translate to duplicate holding form page', async () => {
    renderViewHoldingsRecord();
    const duplicatHoldingBtn = await screen.findByTestId('duplicate-holding-btn');
    userEvent.click(duplicatHoldingBtn);
    expect(defaultProps.history.push).toHaveBeenCalled();
  });

  it('should display "inactive" by an inactive temporary location', async () => {
    await act(async () => { renderViewHoldingsRecord(); });
    const tempLocation = document.querySelector('*[data-test-id=temporary-location]').innerHTML;
    expect(tempLocation).toContain('Inactive');
  });

  describe('Tests for shortcut of HasCommand', () => {
    it('"onCopyHolding" function to be triggered on clicking "duplicateRecord" button', async () => {
      const data = {
        pathname: `/inventory/copy/${defaultProps.id}/${defaultProps.holdingsrecordid}`,
        search: defaultProps.location.search,
        state: { backPathname: defaultProps.location.pathname },
      };
      renderViewHoldingsRecord();
      userEvent.click(await screen.findByRole('button', { name: 'duplicateRecord' }));
      expect(defaultProps.history.push).toBeCalledWith(data);
    });
    it('"onEditHolding" function to be triggered on clicking edit button', async () => {
      const data = {
        pathname: `/inventory/edit/${defaultProps.id}/${defaultProps.holdingsrecordid}`,
        search: defaultProps.location.search,
        state: { backPathname: defaultProps.location.pathname },
      };
      renderViewHoldingsRecord();
      userEvent.click(await screen.findByRole('button', { name: 'edit' }));
      expect(defaultProps.history.push).toBeCalledWith(data);
    });
    it('"goTo" function to be triggered on clicking duplicateRecord button', async () => {
      renderViewHoldingsRecord();
      userEvent.click(await screen.findByRole('button', { name: 'search' }));
      expect(defaultProps.goTo).toBeCalledWith('/inventory');
    });
    it('collapseAllSections triggered on clicking collapseAllSections button', async () => {
      renderViewHoldingsRecord();
      userEvent.click(await screen.findByRole('button', { name: 'collapseAllSections' }));
      expect(spyOncollapseAllSections).toBeCalled();
    });
    it('expandAllSections triggered on clicking expandAllSections button', async () => {
      await act(async () => { renderViewHoldingsRecord(); });
      userEvent.click(await screen.findByRole('button', { name: 'expandAllSections' }));
      expect(spyOnexpandAllSections).toBeCalled();
    });
  });
});
