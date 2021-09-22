import {
  areAllFieldsEmpty,
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