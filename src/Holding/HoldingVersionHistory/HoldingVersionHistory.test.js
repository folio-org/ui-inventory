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
import HoldingVersionHistory, { createFieldFormatter } from './HoldingVersionHistory';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AuditLogPane: () => <div>Version history</div>,
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useHoldingAuditDataQuery: jest.fn().mockReturnValue({ data: [{}], isLoading: false }),
}));

const queryClient = new QueryClient();

const onCloseMock = jest.fn();
const holdingId = 'holdingId';
const mockReferenceData = {
  holdingsTypes: [{ id: 'holding-type-1', name: 'Holding type 1' }],
  statisticalCodes: [{ id: 'stat-1', statisticalCodeType: { name: 'Category' }, code: '001', name: 'Stat Code' }],
  callNumberTypes: [{ id: '123', name: 'Test Call Number Type' }],
  locationsById: { 'location-1': { name: 'Main Library' } },
  illPolicies: [{ id: 'ill-policy-1', name: 'Ill policy 1' }],
  holdingsNoteTypes: [{ id: 'h-note-type-1', name: 'H note type 1' }],
  electronicAccessRelationships: [{ id: 'rel-1', name: 'Online Access' }],
};

const renderHoldingVersionHistory = () => {
  const component = (
    <QueryClientProvider client={queryClient}>
      <DataContext.Provider value={mockReferenceData}>
        <HoldingVersionHistory
          holdingId={holdingId}
          onClose={onCloseMock}
        />
      </DataContext.Provider>
    </QueryClientProvider>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('HoldingVersionHistory', () => {
  it('should render View history pane', () => {
    renderHoldingVersionHistory();

    expect(screen.getByText('Version history')).toBeInTheDocument();
  });
});

describe('createVersionHistoryFieldFormatter', () => {
  const fieldFormatter = createFieldFormatter(mockReferenceData);

  it('should format discoverySuppress field correctly', () => {
    expect(fieldFormatter.discoverySuppress(true)).toBe('true');
    expect(fieldFormatter.discoverySuppress(false)).toBe('false');
  });

  it('should format holdingsTypeId field correctly', () => {
    expect(fieldFormatter.holdingsTypeId('holding-type-1')).toBe('Holding type 1');
  });

  it('should format statistical codes field correctly', () => {
    expect(fieldFormatter.statisticalCodeIds('stat-1')).toBe('Category: 001 - Stat Code');
  });

  it('should format typeId callNumberTypeId correctly', () => {
    expect(fieldFormatter.callNumberTypeId('123')).toBe('Test Call Number Type');
  });

  it('should format location IDs field correctly', () => {
    expect(fieldFormatter.permanentLocationId('location-1')).toBe('Main Library');
    expect(fieldFormatter.effectiveLocationId('location-1')).toBe('Main Library');
    expect(fieldFormatter.temporaryLocationId('location-1')).toBe('Main Library');
  });

  it('should format illPolicyId field correctly', () => {
    expect(fieldFormatter.illPolicyId('ill-policy-1')).toBe('Ill policy 1');
  });

  it('should format staffOnly field correctly', () => {
    expect(fieldFormatter.staffOnly(true)).toBe('true');
    expect(fieldFormatter.staffOnly(false)).toBe('false');
  });

  it('should format holdingsNoteTypeId field correctly', () => {
    expect(fieldFormatter.holdingsNoteTypeId('h-note-type-1')).toBe('H note type 1');
  });

  it('should format electronic access relationships field correctly', () => {
    expect(fieldFormatter.relationshipId('rel-1')).toBe('Online Access');
  });

  it('should format publicDisplay field correctly', () => {
    expect(fieldFormatter.publicDisplay(true)).toBe('true');
    expect(fieldFormatter.publicDisplay(false)).toBe('false');
  });
});
