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


  it('should sort by enumeration, numeric-extraction ascending', () => {
    const list = [
      { barcode: 'a612', enumeration: 'v1' },           // 1, 0, 0
      { barcode: 'b612', enumeration: 'v.1:no.1-6' },   // 1, 1, 0

      { barcode: 'c612', enumeration: 'v1 n4' },        // 1, 4, 0
      { barcode: 'd612', enumeration: 'v1 n4:s5' },     // 1, 4, 5
      { barcode: 'e612', enumeration: 'v1 n4:s6' },     // 1, 4, 6

      { barcode: 'f612', enumeration: 'aaa.1:bbb.5' },  // 1, 5, 0
      { barcode: 'g612', enumeration: '1:11:111' },     // 1, 11, 111

      { barcode: 'h612', enumeration: 'z.2:5' },        // 2, 5, 0 => 2
      { barcode: 'i612', enumeration: 'y.3:5' },        // 3, 5, 0 => 3
      { barcode: 'j612', enumeration: 'x.4:5' },        // 4, 5, 0 => 4

      { barcode: 'k612', enumeration: 'x.5:1' },        // 5, 1, 0 => x
      { barcode: 'l612', enumeration: 'y.5:1' },        // 5, 1, 0 => y
      { barcode: 'm612', enumeration: 'z.5:1' },        // 5, 1, 0 => z

      { barcode: 'n612', enumeration: 'v.10:no.1-6' },  // 10, 1, 6
      { barcode: 'o612', enumeration: 'v.10:no.7-12' }, // 10, 7, 12
      { barcode: 'p612', enumeration: 'v.11:no.1-6' },  // 11, 1, 6
      { barcode: 'q612', enumeration: 'v.11:no.7-12' }, // 11, 7, 12
      { barcode: 'r612', enumeration: 'v.12:no.1-6' },  // 12, 1, 6
      { barcode: 's612', enumeration: 'v.20:no1,no2' }, // 20, 1, 2
      { barcode: 't612', enumeration: 'v.200:no.1-6' }, // 200, 1, 6

      { barcode: 'u612' },                              // [null]
      { barcode: 'v612', enumeration: 'alpha' },        // alpha
      { barcode: 'w612', enumeration: 'beta' },         // beta
      { barcode: 'x612', enumeration: 'gamma' },        // gamma

    ];

    const shuffled = [...list].sort(() => Math.random() - 0.5);

    expect(list).toEqual(sortItems(shuffled, { column: 'enumeration' }));
  });

  it('should sort by enumeration, numeric-extraction descending', () => {
    const list = [
      { barcode: 'w612', enumeration: 'gamma' },        // gamma
      { barcode: 'v612', enumeration: 'beta' },         // beta
      { barcode: 'u612', enumeration: 'alpha' },        // alpha
      { barcode: 't612', enumeration: 'v.200:no.1-6' }, // 200, 1, 0
      { barcode: 's612', enumeration: 'v.20:no1,no2' }, // 20, 1, 2
      { barcode: 'r612', enumeration: 'v.12:no.1-6' },  // 12, 1, 0
      { barcode: 'q612', enumeration: 'v.11:no.7-12' }, // 11, 7, 0
      { barcode: 'p612', enumeration: 'v.11:no.1-6' },  // 11, 1, 0
      { barcode: 'o612', enumeration: 'v.10:no.7-12' }, // 10, 7, 0
      { barcode: 'n612', enumeration: 'v.10:no.1-6' },  // 10, 1, 0
      { barcode: 'm612', enumeration: 'z.5:1' },        // 5, 1, 0 => z
      { barcode: 'l612', enumeration: 'y.5:1' },        // 5, 1, 0 => y
      { barcode: 'k612', enumeration: 'x.5:1' },        // 5, 1, 0 => x
      { barcode: 'j612', enumeration: 'x.4:5' },        // 4, 5, 0 => 4
      { barcode: 'i612', enumeration: 'y.3:5' },        // 3, 5, 0 => 3
      { barcode: 'h612', enumeration: 'z.2:5' },        // 2, 5, 0 => 2
      { barcode: 'g612', enumeration: '1:11:111' },     // 1, 11, 111
      { barcode: 'f612', enumeration: 'aaa.1:bbb.5' },  // 1, 5, 0
      { barcode: 'e612', enumeration: 'v1:n4:s6' },     // 1, 4, 6
      { barcode: 'd612', enumeration: 'v1:n4:s5' },     // 1, 4, 5
      { barcode: 'c612', enumeration: 'v1:n4' },        // 1, 4, 0
      { barcode: 'b612', enumeration: 'v.1:no.1-6' },   // 1, 1, 0
      { barcode: 'a612', enumeration: 'v1' },           // 1, 0, 0
    ];

    const shuffled = [...list].sort(() => Math.random() - 0.5);

    expect(list).toEqual(sortItems(shuffled, { column: 'enumeration', isDesc: true }));
  });

  it('should handle numeric-extraction examples from real librarians', () => {
    const list = [
      { enumeration: '6 (1984)' },
      { enumeration: '59 (2010)' },
      { enumeration: '60(2010)' },
      { enumeration: '61(2010)' },
      { enumeration: '62(2011)' },
      { enumeration: '63(2011)' },
      { enumeration: 'Suppl 63 (2011)' },
      { enumeration: '64 (2012)' },
      { enumeration: '65(2012)' },
      { enumeration: '66 (2013)' },
      { enumeration: '67(2013)' },
      { enumeration: '68 (2014)' },
      { enumeration: '69:2014' },
      { enumeration: '74 (2017)' },
      { enumeration: '76 (2019)' },
      { enumeration: '425 (2018)' },        // 425, 2018
      { enumeration: 'Suppl. 425 (2018)' }, // 425, 2018
      { enumeration: 'Nr X (2018)' },       // 2018, 0
      { enumeration: '2018:5' },            // 2018, 5
    ];

    const shuffled = [...list].sort(() => Math.random() - 0.5);
    expect(list).toEqual(sortItems(shuffled, { column: 'enumeration' }));
  });

  it('should sort by copyNumber, numeric-extraction ascending', () => {
    const list = [
      { barcode: 'a612', copyNumber: '0' },
      { barcode: 'b612', copyNumber: '1' },
      { barcode: 'c612', copyNumber: '5' },
      { barcode: 'd612', copyNumber: '20' },
      { barcode: 'e612', copyNumber: '100' },
      { barcode: 'f612' },
    ];

    const shuffled = [...list].sort(() => Math.random() - 0.5);

    expect(list).toEqual(sortItems(shuffled, { column: 'copyNumber' }));
  });

  it('should sort by yearCaption, array-to-string, ascending', () => {
    const list = [
      { barcode: 'a612', yearCaption: [1999, 2000] },
      { barcode: 'b612', yearCaption: [2000, 2001] },
      { barcode: 'c612', yearCaption: ['a', 'b'] },
      { barcode: 'd612', yearCaption: ['c', 'd'] },
    ];

    const shuffled = [...list].sort(() => Math.random() - 0.5);

    expect(list).toEqual(sortItems(shuffled, { column: 'yearCaption'}));
  });

  it('should sort by volume, numeric-extraction, ascending', () => {
    const list = [
      { barcode: 'a612', volume: '0' },
      { barcode: 'b612', volume: '1' },
      { barcode: 'c612', volume: '5' },
      { barcode: 'd612', volume: '20' },
      { barcode: 'e612', volume: '100' },
      { barcode: 'a612' },
    ];

    const shuffled = [...list].sort(() => Math.random() - 0.5);

    expect(list).toEqual(sortItems(shuffled, { column: 'volume' }));
  });
});
