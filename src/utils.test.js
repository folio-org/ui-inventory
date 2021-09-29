import '../test/jest/__mock__';

import {
  areAllFieldsEmpty,
  buildDateRangeQuery,
  buildOptionalBooleanQuery,
  canMarkItemAsMissing,
  canMarkItemAsWithdrawn,
  canMarkItemWithStatus,
  canMarkRequestAsOpen,
  craftLayerUrl,
  getQueryTemplate,
  makeDateRangeFilterString,
  parseFiltersToStr,
  retrieveDatesFromDateRangeFilterString,
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
    const location = {
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
      const item = { status: { name: 'Available' } };
      expect(f(item)).toBe(true);
    });

    it(`${f.name} returns false for an item with an unlisted status`, () => {
      const item = { status: { name: 'Available but neglected' } };
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

describe('parseFiltersToStr', () => {
  it('remaps filters to a comma-joined string', () => {
    const filters = {
      location: ['main', 'annex'],
      language: ['ind'],
    };
    const expected = 'location.main,location.annex,language.ind';
    expect(parseFiltersToStr(filters)).toEqual(expected);
  });
});

// Date functions are being skipped for now because the util functions aren't
// being used.
describe.skip('retrieveDatesFromDateRangeFilterString', () => {
  it('', () => {

  });
});

describe.skip('makeDateRangeFilterString', () => {
  it('', () => {

  });
});

describe.skip('buildDateRangeQuery', () => {
  it('', () => {

  });
});

describe('buildOptionalBooleanQuery', () => {
  it('returns expected filter strings', () => {
    const func = buildOptionalBooleanQuery('test');
    // 2 values
    expect(func(['a', 'b'])).toBe('cql.allRecords=1');
    // 1 value ('false')
    expect(func(['false'])).toBe('cql.allRecords=1 not test=="true"');
    // More than 2 values
    expect(func(['a', 'b', 'c'])).toBe('test=="a" or "b" or "c"');
  });
});

describe('getQueryTemplate', () => {
  it('returns a query template', () => {
    const indexes = [
      { value: 'title', queryTemplate: 'get a title' },
      { value: 'isbn', queryTemplate: 'get an isbn' },
    ];
    expect(getQueryTemplate('isbn', indexes)).toBe('get an isbn');
  });
});
