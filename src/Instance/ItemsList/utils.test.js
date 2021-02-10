import { sortItems } from './utils';

describe('item sort handlers', () => {
  it('should sort by barcode, ascending', () => {
    const list = [
      { barcode: 'b612', enumeration: 'v.1:no.1-6' },
      { barcode: 'b613', enumeration: 'v.1:no.2' },
      { barcode: 'b614', enumeration: 'v.2:no.1-6' },
      { barcode: 'b615', enumeration: 'v.12:no.1-6' },
      { barcode: 'b616', enumeration: 'v.20:no.1-6' },
      { barcode: 'b617', enumeration: 'v.200:no.1-6' },
      { barcode: 'b618', enumeration: 'v.200:no.2-12' },
      { barcode: 'b619', enumeration: 'v.200:no.36' },
    ];

    const shuffled = [...list].sort(() => Math.random() - 0.5);

    expect(list).toEqual(sortItems(shuffled, { column: 'barcode' }));
  });

  it('should sort by barcode, descending', () => {
    const list = [
      { barcode: 'b619', enumeration: 'v.200:no.36' },
      { barcode: 'b618', enumeration: 'v.200:no.2-12' },
      { barcode: 'b617', enumeration: 'v.200:no.1-6' },
      { barcode: 'b616', enumeration: 'v.20:no.1-6' },
      { barcode: 'b615', enumeration: 'v.12:no.1-6' },
      { barcode: 'b614', enumeration: 'v.2:no.1-6' },
      { barcode: 'b613', enumeration: 'v.1:no.2' },
      { barcode: 'b612', enumeration: 'v.1:no.1-6' },
    ];

    const shuffled = [...list].sort(() => Math.random() - 0.5);

    expect(list).toEqual(sortItems(shuffled, { column: 'barcode', isDesc: true }));
  });


  it('should sort by enumeration, numerically ascending', () => {
    const list = [
      { barcode: 'b612', enumeration: 'v.1:no.1-6' },
      { barcode: 'b613', enumeration: 'v.1:no.2' },
      { barcode: 'b613', enumeration: 'v.1:no.11' },
      { barcode: 'b614', enumeration: 'v.2:no.1-6' },
      { barcode: 'b615', enumeration: 'v.12:no.1-6' },
      { barcode: 'b616', enumeration: 'v.20:no.1-6' },
      { barcode: 'b617', enumeration: 'v.200:no.1-6' },
      { barcode: 'b618', enumeration: 'v.200:no.4-12' },
      { barcode: 'b618', enumeration: 'v.200:no.5-12' },
      { barcode: 'b618', enumeration: 'v.200:no.22' },
      { barcode: 'b619', enumeration: 'v.200:no.36' },
    ];

    const shuffled = [...list].sort(() => Math.random() - 0.5);

    expect(list).toEqual(sortItems(shuffled, { column: 'enumeration' }));
  });

  it('should sort by enumeration, numerically descending', () => {
    const list = [
      { barcode: 'b619', enumeration: 'v.200:no.36' },
      { barcode: 'b618', enumeration: 'v.200:no.22' },
      { barcode: 'b618', enumeration: 'v.200:no.5-12' },
      { barcode: 'b618', enumeration: 'v.200:no.4-12' },
      { barcode: 'b617', enumeration: 'v.200:no.1-6' },
      { barcode: 'b616', enumeration: 'v.20:no.1-6' },
      { barcode: 'b615', enumeration: 'v.12:no.1-6' },
      { barcode: 'b614', enumeration: 'v.2:no.1-6' },
      { barcode: 'b613', enumeration: 'v.1:no.11' },
      { barcode: 'b613', enumeration: 'v.1:no.2' },
      { barcode: 'b612', enumeration: 'v.1:no.1-6' },
    ];

    const shuffled = [...list].sort(() => Math.random() - 0.5);

    expect(list).toEqual(sortItems(shuffled, { column: 'enumeration', isDesc: true }));
  });

  it('should sort by enumeration, alphabetically ascending', () => {
    const list = [
      { barcode: 'b612', enumeration: '1' },
      { barcode: 'b613', enumeration: '12' },
      { barcode: 'b615', enumeration: '20' },
    ];

    const shuffled = [...list];
    shuffled.sort(() => Math.random() - 0.5);

    expect(list).toEqual(sortItems(shuffled, { column: 'enumeration' }));
  });

  it('should sort by enumeration, alphabetically descending', () => {
    const list = [
      { barcode: 'b619', enumeration: '20' },
      { barcode: 'b618', enumeration: '12' },
      { barcode: 'b617', enumeration: '1' },
    ];

    const shuffled = [...list];
    shuffled.sort(() => Math.random() - 0.5);

    expect(list).toEqual(sortItems(shuffled, { column: 'enumeration', isDesc: true }));
  });
});
