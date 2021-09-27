import {
  areAllFieldsEmpty,
  canMarkItemAsMissing,
  canMarkItemAsWithdrawn,
  canMarkItemWithStatus,
  canMarkRequestAsOpen,
  craftLayerUrl,
} from './utils';

describe('areAllFieldsEmpty', () => {
  it('returns true for an array of empty values', () => {
    const values = [false, [], [], '-'];
    expect(areAllFieldsEmpty(values)).toBe(true);
  });

  it('returns false for an array with non-empty values', () => {
    const values = [false, [1], [], '-'];
    expect(areAllFieldsEmpty(values)).toBe(false);
  });
});

describe('craftLayerUrl', () => {
  it('returns a properly formatted URL', () => {
    const location= {
      pathname: 'https://folio/inventory/items/',
      search: 'petrichor',
    };
    expect(craftLayerUrl('makeitso', location)).toBe('https://folio/inventory/items/petrichor?layer=makeitso');
  });
});

describe('can mark items', () => {
  const markFunctions = [
    canMarkItemAsMissing,
    canMarkItemAsWithdrawn,
    canMarkItemWithStatus
  ];
  markFunctions.forEach(f => {
    it(`${f.name} returns true for an item with a listed status`, () => {
      const item = { status: { name: 'Available' }};
      expect(f(item)).toBe(true);
    });
  
    it(`${f.name} returns false for an item with an unlisted status`, () => {
      const item = { status: { name: 'Available but neglected' }};
      expect(f(item)).toBe(false);
    });
  });
});

describe('canMarkRequestAsOpen', () => {
  it('returns true for a request with a future expiration date and correct status', () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const request = {
      item: { status: 'Awaiting pickup' },
      holdShelfExpirationDate: date,
    };
    expect(canMarkRequestAsOpen(request)).toBe(true);
  });

  it('returns false otherwise', () => {
    const request = {
      item: { status: 'Awaiting pickup' },
      holdShelfExpirationDate: new Date(),
    };
    expect(canMarkRequestAsOpen(request)).toBe(false);
  });
});