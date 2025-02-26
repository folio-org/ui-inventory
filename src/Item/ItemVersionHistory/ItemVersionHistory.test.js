import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { screen } from '@folio/jest-config-stripes/testing-library/react';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import { DataContext } from '../../contexts';
import ItemVersionHistory, { createFieldFormatter } from './ItemVersionHistory';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AuditLogPane: () => <div>Version history</div>,
}));

jest.mock('../../utils', () => ({
  getDateWithTime: jest.fn(date => `Formatted Date: ${date}`),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useItemAuditDataQuery: jest.fn().mockReturnValue({ data: [{}], isLoading: false }),
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
const mockCirculationHistory = {
  servicePointName: 'Main Desk',
  source: 'Librarian User',
};

const renderItemVersionHistory = () => {
  const component = (
    <QueryClientProvider client={queryClient}>
      <DataContext.Provider value={mockReferenceData}>
        <ItemVersionHistory
          itemId={itemId}
          onClose={onCloseMock}
          circulationHistory={{}}
        />
      </DataContext.Provider>
    </QueryClientProvider>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ItemVersionHistory', () => {
  it('should render View history pane', () => {
    renderItemVersionHistory();

    expect(screen.getByText('Version history')).toBeInTheDocument();
  });
});

describe('createFieldFormatter', () => {
  const fieldFormatter = createFieldFormatter(mockReferenceData, mockCirculationHistory);

  it('should format discoverySuppress field correctly', () => {
    expect(fieldFormatter.discoverySuppress(true)).toBe('true');
    expect(fieldFormatter.discoverySuppress(false)).toBe('false');
  });

  it('should format typeId field correctly', () => {
    expect(fieldFormatter.typeId('123')).toBe('Test Call Number Type');
  });

  it('should format typeId itemLevelCallNumberTypeId correctly', () => {
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

  it('should format date field correctly', () => {
    expect(fieldFormatter.date(date)).toBe(`Formatted Date: ${date}`);
  });

  it('should format dateTime field correctly', () => {
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
});
