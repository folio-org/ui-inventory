import { act } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import ItemVersionHistory, { createFieldFormatter, createItemFormatter } from './ItemVersionHistory';
import { DataContext } from '../../../../contexts';

import {
  useStaffMembersQuery,
  useTotalVersions,
} from '../../../../hooks';
import {
  useItemAuditDataQuery,
  useItemServicePointsQuery,
} from '../../../hooks';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  AuditLogPane: jest.fn(({
    versions,
    onClose,
    isLoadMoreVisible,
    handleLoadMore,
    isLoading,
    isInitialLoading,
  }) => (
    <div>
      <div>Version history</div>
      <div data-testid="versions">{JSON.stringify(versions)}</div>
      <div data-testid="is-loading">{isLoading.toString()}</div>
      <div data-testid="is-initial-loading">{isInitialLoading.toString()}</div>
      <button type="button" onClick={handleLoadMore} disabled={!isLoadMoreVisible}>Load more</button>
      <button type="button" onClick={onClose}>Close</button>
    </div>
  )),
}));

jest.mock('../../../../utils', () => ({
  getDateWithTime: jest.fn(date => `Formatted Date: ${date}`),
}));

jest.mock('../../../../hooks', () => ({
  ...jest.requireActual('../../../../hooks'),
  useInventoryVersionHistory: () => ({
    versions: [{ id: 'v1', changes: [] }],
    actionsMap: { create: 'Created', edit: 'Edited' }
  }),
  useTotalVersions: jest.fn(),
  useStaffMembersQuery: jest.fn(),
}));

jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useItemAuditDataQuery: jest.fn(),
  useItemServicePointsQuery: jest.fn(),
}));

const queryClient = new QueryClient();

const onCloseMock = jest.fn();
const itemId = 'itemId';
const date = '2024-02-26T12:00:00Z';
const mockReferenceData = {
  callNumberTypes: [{ id: '123', name: 'Test Call Number Type' }],
  itemDamagedStatuses: [{ id: 'damaged-1', name: 'Damaged' }],
  locationsById: { 'location-1': { name: 'Main Library' } },
  loanTypes: [{ id: 'loan-1', name: 'Short Term' }],
  materialTypes: [{ id: 'material-1', name: 'Book' }],
  statisticalCodes: [{ id: 'stat-1', statisticalCodeType: { name: 'Category' }, code: '001', name: 'Stat Code' }],
  electronicAccessRelationships: [{ id: 'rel-1', name: 'Online Access' }],
  itemNoteTypes: [{ id: 'note-1', name: 'Public Note' }],
};

const mockItem = {
  id: itemId,
  lastCheckIn: {
    servicePointId: 'sp-1',
    staffMemberId: 'staff-1',
    dateTime: date,
  },
};

const mockServicePoints = [{ id: 'sp-1', name: 'Main Desk' }];
const mockStaffMembers = [{
  id: 'staff-1',
  personal: {
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'M',
  },
}];

const renderItemVersionHistory = () => {
  const component = (
    <QueryClientProvider client={queryClient}>
      <DataContext.Provider value={mockReferenceData}>
        <ItemVersionHistory
          item={mockItem}
          onClose={onCloseMock}
        />
      </DataContext.Provider>
    </QueryClientProvider>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ItemVersionHistory', () => {
  beforeEach(() => {
    useItemAuditDataQuery.mockReturnValue({
      data: [{ id: 'audit1' }],
      totalRecords: 1,
      isLoading: false,
      isLoadingMore: false,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
    });

    useItemServicePointsQuery.mockReturnValue({
      servicePoints: mockServicePoints,
    });

    useStaffMembersQuery.mockReturnValue({
      staffMembers: mockStaffMembers,
    });

    useTotalVersions.mockReturnValue([1]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = await act(async () => renderItemVersionHistory());
    await runAxeTest({ rootNode: container });
  });

  it('should render Version history pane', async () => {
    renderItemVersionHistory();
    expect(screen.getByText('Version history')).toBeInTheDocument();
  });

  it('should handle loading states correctly', async () => {
    useItemAuditDataQuery.mockReturnValue({
      data: [],
      isLoading: true,
      isLoadingMore: false,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
    });

    renderItemVersionHistory();
    expect(screen.getByTestId('is-initial-loading').textContent).toBe('true');
  });

  it('should handle load more functionality', async () => {
    const fetchNextPage = jest.fn();
    useItemAuditDataQuery.mockReturnValue({
      data: [{ id: 'audit1' }],
      isLoading: false,
      isLoadingMore: false,
      fetchNextPage,
      hasNextPage: true,
    });

    renderItemVersionHistory();
    const loadMoreButton = screen.getByText('Load more');
    expect(loadMoreButton).not.toBeDisabled();

    await act(async () => {
      loadMoreButton.click();
    });

    expect(fetchNextPage).toHaveBeenCalled();
  });

  it('should handle close functionality', async () => {
    renderItemVersionHistory();
    const closeButton = screen.getByText('Close');

    await act(async () => {
      closeButton.click();
    });

    expect(onCloseMock).toHaveBeenCalled();
  });
});

describe('createFieldFormatter', () => {
  const fieldFormatter = createFieldFormatter(mockReferenceData, {
    servicePointName: 'Main Desk',
    source: 'Librarian User',
  });

  it('should format discoverySuppress field correctly', () => {
    expect(fieldFormatter.discoverySuppress(true)).toBe('true');
    expect(fieldFormatter.discoverySuppress(false)).toBe('false');
  });

  it('should format typeId field correctly', () => {
    expect(fieldFormatter.typeId('123')).toBe('Test Call Number Type');
  });

  it('should format itemLevelCallNumberTypeId correctly', () => {
    expect(fieldFormatter.itemLevelCallNumberTypeId('123')).toBe('Test Call Number Type');
  });

  it('should format itemDamagedStatusId field correctly', () => {
    expect(fieldFormatter.itemDamagedStatusId('damaged-1')).toBe('Damaged');
  });

  it('should format location IDs field correctly', () => {
    expect(fieldFormatter.permanentLocationId('location-1')).toBe('Main Library');
    expect(fieldFormatter.effectiveLocationId('location-1')).toBe('Main Library');
    expect(fieldFormatter.temporaryLocationId('location-1')).toBe('Main Library');
  });

  it('should format loan types field correctly', () => {
    expect(fieldFormatter.permanentLoanTypeId('loan-1')).toBe('Short Term');
    expect(fieldFormatter.temporaryLoanTypeId('loan-1')).toBe('Short Term');
  });

  it('should format material types field correctly', () => {
    expect(fieldFormatter.materialTypeId('material-1')).toBe('Book');
  });

  it('should format statistical codes field correctly', () => {
    expect(fieldFormatter.statisticalCodeIds('stat-1')).toBe('Category: 001 - Stat Code');
  });

  it('should format electronic access relationships field correctly', () => {
    expect(fieldFormatter.relationshipId('rel-1')).toBe('Online Access');
  });

  it('should format item note types field correctly', () => {
    expect(fieldFormatter.itemNoteTypeId('note-1')).toBe('Public Note');
  });

  it('should format staffOnly field correctly', () => {
    expect(fieldFormatter.staffOnly(true)).toBe('true');
    expect(fieldFormatter.staffOnly(false)).toBe('false');
  });

  it('should format date fields correctly', () => {
    expect(fieldFormatter.date(date)).toBe(`Formatted Date: ${date}`);
    expect(fieldFormatter.dateTime(date)).toBe(`Formatted Date: ${date}`);
  });

  it('should format servicePointId field correctly', () => {
    expect(fieldFormatter.servicePointId()).toBe('Main Desk');
  });

  it('should format staffMemberId field correctly', () => {
    expect(fieldFormatter.staffMemberId()).toBe('Librarian User');
  });

  it('should format source field correctly', () => {
    expect(fieldFormatter.source({ personal: { firstName: 'John', lastName: 'Doe' } })).toBe('Doe, John');
  });

  it('should display Unknown user as source if no personal info provided', () => {
    const result = fieldFormatter.source({ personal: null });

    expect(result.props.id).toBe('stripes-components.metaSection.unknownUser');
  });

  it('should display only last name as source if no first name provided', () => {
    expect(fieldFormatter.source({ personal: { lastName: 'Doe' } })).toBe('Doe');
  });
});

describe('createItemFormatter', () => {
  const fieldLabelsMap = {
    barcode: 'Item Barcode',
    discoverySuppress: 'Discovery Suppress',
    circulationNotes: 'Circulation History',
    'additionalCallNumbers.prefix': 'Additional call number prefix',
    'additionalCallNumbers.suffix': 'Additional call number suffix',
    'additionalCallNumbers.typeId': 'Additional call number type',
    'additionalCallNumbers.callNumber': 'Additional call number',
    'circulationNotes.staffOnly': 'Staff Only',
    'circulationNotes.note': 'Note',
    'circulationNotes.noteType': 'Note Type',
    materialTypeId: 'Material Type',
  };

  const fieldFormatter = createFieldFormatter(mockReferenceData, {
    servicePointName: 'Main Desk',
    source: 'Librarian User',
  });

  const itemFormatter = createItemFormatter(fieldLabelsMap, fieldFormatter);

  it('should return null for null element', () => {
    expect(itemFormatter(null, 0)).toBeNull();
  });

  it('should return null for undefined element', () => {
    expect(itemFormatter(undefined, 0)).toBeNull();
  });

  it('should format field with collectionName using composite key', () => {
    const element = {
      name: 'staffOnly',
      value: false,
      collectionName: 'circulationNotes',
    };

    const result = itemFormatter(element, 0);
    const { container } = renderWithIntl(result, translationsProperties);

    expect(container.querySelector('strong')).toHaveTextContent('Staff Only:');
    expect(container.querySelector('li')).toHaveTextContent('Staff Only: false');
  });

  it('should fallback to fieldName label when composite key not found', () => {
    const element = {
      name: 'discoverySuppress',
      value: true,
      collectionName: 'unknownCollection',
    };

    const result = itemFormatter(element, 0);
    const { container } = renderWithIntl(result, translationsProperties);

    expect(container.querySelector('strong')).toHaveTextContent('Discovery Suppress:');
    expect(container.querySelector('li')).toHaveTextContent('Discovery Suppress: true');
  });

  it('should fallback to collectionName label when fieldName not found', () => {
    const element = {
      name: 'unknownField',
      value: 'test value',
      collectionName: 'circulationNotes',
    };

    const result = itemFormatter(element, 0);
    const { container } = renderWithIntl(result, translationsProperties);

    expect(container.querySelector('strong')).toHaveTextContent('Circulation History:');
    expect(container.querySelector('li')).toHaveTextContent('Circulation History: test value');
  });

  it('should render additionalCallNumbers.prefix with label and value', () => {
    const element = {
      name: 'prefix',
      value: 'ABC',
      collectionName: 'additionalCallNumbers',
    };

    const result = itemFormatter(element, 0);
    const { container } = renderWithIntl(result, translationsProperties);

    expect(container.querySelector('li'))
      .toHaveTextContent('Additional call number prefix: ABC');
  });

  it('should render circulationNotes.note with label and value', () => {
    const element = {
      name: 'note',
      value: 'Damaged cover',
      collectionName: 'circulationNotes',
    };

    const result = itemFormatter(element, 0);
    const { container } = renderWithIntl(result, translationsProperties);

    expect(container.querySelector('li'))
      .toHaveTextContent('Note: Damaged cover');
  });
});
