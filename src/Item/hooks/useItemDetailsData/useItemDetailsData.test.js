import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import useItemDetailsData from './useItemDetailsData';
import useItemOpenLoansQuery from '../useItemOpenLoansQuery';
import useItemServicePointsQuery from '../useItemServicePointsQuery';
import useStaffMembersQuery from '../../../hooks/useStaffMembersQuery';

jest.mock('../useItemOpenLoansQuery');
jest.mock('../useItemServicePointsQuery');
jest.mock('../../../hooks/useStaffMembersQuery');

const mockItem = {
  id: 'item-1',
  hrid: 'it00000001',
  barcode: '123456789',
  permanentLocation: { id: 'loc-1', name: 'Main Library' },
  temporaryLocation: { id: 'loc-2', name: 'Special Collections' },
  effectiveLocation: { id: 'loc-3', name: 'Reference' },
  materialType: { name: 'Book' },
  itemLevelCallNumber: 'QA76.76',
  copyNumber: '1',
  enumeration: 'v.1',
  chronology: '2024',
  notes: [{ note: 'Test note', itemNoteTypeId: 'note-1' }],
  circulationNotes: [{ note: 'Test circulation note' }],
  lastCheckIn: {
    dateTime: '2024-03-20T10:00:00Z',
    servicePointId: 'sp-1',
    staffMemberId: 'staff-1',
  }
};

const mockInstance = {
  discoverySuppress: false,
};

const mockReferenceTables = {
  locationsById: {
    'loc-1': { isActive: true },
    'loc-2': { isActive: true },
    'loc-3': { isActive: false },
  },
  callNumberTypes: [
    { id: 'type-1', name: 'Library of Congress' },
  ],
  itemNoteTypes: [
    { id: 'note-1', name: 'General' },
  ],
  itemDamagedStatuses: [
    { id: 'status-1', name: 'Damaged' },
  ]
};

const mockRefLookup = (table, id) => table.find(item => item.id === id);

const mockHoldingLocation = {
  name: 'Main Library',
  code: 'MAIN'
};

describe('useItemDetailsData', () => {
  beforeEach(() => {
    useItemOpenLoansQuery.mockReturnValue({
      openLoans: {
        loans: [{
          userId: 'user-1',
          borrower: { barcode: '12345' },
          loanDate: '2024-03-19T10:00:00Z',
          dueDate: '2024-04-19T10:00:00Z'
        }]
      }
    });

    useItemServicePointsQuery.mockReturnValue({
      servicePoints: [{ id: 'sp-1', name: 'Main Desk' }]
    });

    useStaffMembersQuery.mockReturnValue({
      staffMembers: [{
        id: 'staff-1',
        personal: {
          firstName: 'John',
          lastName: 'Doe',
          middleName: 'Smith'
        }
      }]
    });
  });

  it('should return item location data', () => {
    const { result } = renderHook(() => useItemDetailsData({
      item: mockItem,
      referenceTables: mockReferenceTables,
      refLookup: mockRefLookup
    }));

    expect(result.current.itemLocation).toEqual({
      permanentLocation: {
        name: 'Main Library',
        isActive: true
      },
      temporaryLocation: {
        name: 'Special Collections',
        isActive: true
      },
      effectiveLocation: {
        name: 'Reference',
        isActive: false
      }
    });
  });

  it('should return administrative data', () => {
    const { result } = renderHook(() => useItemDetailsData({
      item: mockItem,
      instance: mockInstance,
      referenceTables: mockReferenceTables,
      refLookup: mockRefLookup,
    }));

    expect(result.current.administrativeData).toEqual({
      discoverySuppress: false,
      hrid: 'it00000001',
      barcode: '123456789',
      accessionNumber: undefined,
      identifier: undefined,
      formerIds: undefined,
      statisticalCodeIds: [],
      administrativeNotes: [],
    });
  });

  it('should return item data', () => {
    const { result } = renderHook(() => useItemDetailsData({
      item: mockItem,
      referenceTables: mockReferenceTables,
      refLookup: mockRefLookup,
    }));

    expect(result.current.itemData).toEqual({
      materialType: 'Book',
      callNumberType: undefined,
      callNumberPrefix: undefined,
      callNumber: 'QA76.76',
      callNumberSuffix: undefined,
      additionalCallNumbers: [],
      copyNumber: '1',
      numberOfPieces: undefined,
      descriptionOfPieces: undefined,
      effectiveShelvingOrder: undefined,
    });
  });

  it('should return enumeration data', () => {
    const { result } = renderHook(() => useItemDetailsData({
      item: mockItem,
      referenceTables: mockReferenceTables,
      refLookup: mockRefLookup,
    }));

    expect(result.current.enumerationData).toEqual({
      displaySummary: undefined,
      enumeration: 'v.1',
      chronology: '2024',
      volume: undefined,
      yearCaption: [],
    });
  });

  it('should return loan and availability data', () => {
    const { result } = renderHook(() => useItemDetailsData({
      item: mockItem,
      referenceTables: mockReferenceTables,
      refLookup: mockRefLookup,
      requestCount: 2,
      requestsUrl: '/requests',
    }));

    expect(result.current.loanAndAvailability).toEqual({
      permanentLoanType: undefined,
      temporaryLoanType: undefined,
      itemStatusDate: '-',
      requestLink: expect.any(Object),
      borrower: expect.any(Object),
      loanDate: expect.any(Object),
      dueDate: expect.any(Object),
      circulationNotes: expect.any(Object),
    });
  });

  it('should return circulation history', () => {
    const { result } = renderHook(() => useItemDetailsData({
      item: mockItem,
      referenceTables: mockReferenceTables,
      refLookup: mockRefLookup,
    }));

    expect(result.current.circulationHistory).toEqual({
      checkInDate: expect.any(Object),
      servicePointName: 'Main Desk',
      source: expect.any(Object),
    });
  });

  it('should return initial accordion states based on data presence', () => {
    const { result } = renderHook(() => useItemDetailsData({
      item: mockItem,
      instance: mockInstance,
      referenceTables: mockReferenceTables,
      refLookup: mockRefLookup,
      holdingLocation: mockHoldingLocation,
    }));

    expect(result.current.initialAccordionsState).toEqual({
      acc01: true, // administrative data
      acc02: true, // item data
      acc03: true, // enumeration data
      acc04: false, // condition
      acc05: true, // item notes
      acc06: true, // loan and availability
      acc07: true, // location
      acc08: false, // electronic access
      acc09: true, // circulation history
      acc10: false, // bound with titles
      itemAcquisitionAccordion: true,
    });
  });
});
