import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import { act } from 'react';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import { DataContext } from '../../contexts';
import HoldingVersionHistory, { getFieldFormatter, getItemFormatter } from './HoldingVersionHistory';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
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
  it('should be rendered with no axe errors', async () => {
    const { container } = await act(async () => renderHoldingVersionHistory());

    await runAxeTest({ rootNode: container });
  });

  it('should render View history pane', () => {
    renderHoldingVersionHistory();

    expect(screen.getByText('Version history')).toBeInTheDocument();
  });
});

describe('field formatter', () => {
  const fieldFormatter = getFieldFormatter(mockReferenceData);

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

describe('getItemFormatter', () => {
  const fieldLabelsMap = {
    formerIds: 'Former ID',
    additionalCallNumbers: 'Additional call numbers',
    notes: 'Notes',
    'additionalCallNumbers.prefix': 'Additional call number prefix',
    'additionalCallNumbers.suffix': 'Additional call number suffix',
    'additionalCallNumbers.typeId': 'Additional call number type',
    'additionalCallNumbers.callNumber': 'Additional call number',
    'notes.holdingsNoteTypeId': 'Note type',
    'notes.note': 'Note',
    'notes.staffOnly': 'Staff only',
  };

  const fieldFormatter = getFieldFormatter(mockReferenceData);
  const itemFormatter = getItemFormatter(fieldLabelsMap, fieldFormatter);

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
      collectionName: 'notes',
    };

    const result = itemFormatter(element, 0);
    const { container } = renderWithIntl(result, translationsProperties);

    expect(container.querySelector('strong')).toHaveTextContent('Staff only:');
    expect(container.querySelector('li')).toHaveTextContent('Staff only: false');
  });

  it('should fallback to fieldName label when composite key not found', () => {
    const element = {
      name: 'formerIds',
      value: '1123',
      collectionName: 'unknownCollection',
    };

    const result = itemFormatter(element, 0);
    const { container } = renderWithIntl(result, translationsProperties);

    expect(container.querySelector('strong')).toHaveTextContent('Former ID:');
    expect(container.querySelector('li')).toHaveTextContent('Former ID: 1123');
  });

  it('should fallback to collectionName label when fieldName not found', () => {
    const element = {
      name: 'unknownField',
      value: 'test value',
      collectionName: 'notes',
    };

    const result = itemFormatter(element, 0);
    const { container } = renderWithIntl(result, translationsProperties);

    expect(container.querySelector('strong')).toHaveTextContent('Notes:');
    expect(container.querySelector('li')).toHaveTextContent('Notes: test value');
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
});

