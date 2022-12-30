import { isItemsSelected, selectItems } from './utils';

describe('isItemsSelected', () => {
  const sampleItems = [{ holdingsRecordId: '1', id: '1' }, { holdingsRecordId: '2', id: '2' }];
  it('returns true if all items are selected', () => {
    const selectedItemsMap = { '1': { '1': true }, '2': { '2': true } };
    expect(isItemsSelected(sampleItems, selectedItemsMap)).toBe(true);
  });
  it('returns false if any item is not selected', () => {
    const selectedItemsMap = { '1': { '1': true }, '2': { '2': false } };
    expect(isItemsSelected(sampleItems, selectedItemsMap)).toBe(false);
  });
  it('returns false if any item is not present in the selected items map', () => {
    const selectedItemsMap = { '1': { '1': true } };
    expect(isItemsSelected(sampleItems, selectedItemsMap)).toBe(false);
  });
});

describe('selectItems', () => {
  const prevItemsMap = { 1: { item1: true, item2: false } };
  const holdingId = 1;
  const items = [{ id: 'item1' }, { id: 'item2' }, { id: 'item3' }];
  const newItemsMap = { 1: { item1: true, item2: true, item3: true } };
  test('should return an object with the correct holdingId and items', () => {
    const result = selectItems(prevItemsMap, holdingId, items);
    expect(result[holdingId]).toEqual({ item1: true, item2: true, item3: true });
  });
  test('should return the selected items correctly', () => {
    const result = selectItems(prevItemsMap, holdingId, items);
    expect(result).toEqual({ 1: { item1: true, item2: true, item3: true } });
  });

  test('should return empty object if isNoNewItems', () => {
    const result = selectItems(newItemsMap, holdingId, items);
    expect(result).toMatchObject({});
  });
  test('should return withNewItems ', () => {
    const newprevItemsMap = { 1: { item1: true } };
    const newholdingId = 4;
    const newitems = [{ id: 4 }];
    const result = selectItems(newprevItemsMap, newholdingId, newitems);
    expect(result[newholdingId]).toEqual({ 4: true });
  });
});
