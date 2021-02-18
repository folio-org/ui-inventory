import { sortItems } from './utils';

describe('item sort handlers', () => {
  it('should sort by barcode, ascending, locale-compare', () => {
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

  it('should sort by barcode, descending, locale-compare', () => {
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

  it('should sort by chronology, ascending, locale-compare', () => {
    const list = [
      { barcode: 'b619', chronology: 'alpha' },
      { barcode: 'c618', chronology: 'beta' },
      { barcode: 'd617', chronology: 'gamma' },
      { barcode: 'e619' },
    ];

    const shuffled = [...list].sort(() => Math.random() - 0.5);

    expect(list).toEqual(sortItems(shuffled, { column: 'chronology' }));
  });

  it('should sort by copyNumber, ascending, numeric-extraction ', () => {
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

  it('should sort by effective location, ascending, locale-compare', () => {
    const a = { barcode: 'c612', effectiveLocation: { name: 'beta' } };
    const b = { barcode: 'd612', effectiveLocation: { name: 'gamma' } };
    const c = { barcode: 'a612' };
    const d = { barcode: 'b612', effectiveLocation: {} };

    const shuffled = [a, b, c, d].sort(() => Math.random() - 0.5);
    const list = sortItems(shuffled, { column: 'effectiveLocation' });

    // a and b should always float to the top
    // c and d both evaluate to empty string so how they sort is indeterminate.
    expect(list[0]).toEqual(a);
    expect(list[1]).toEqual(b);
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

      { barcode: 'k612', enumeration: 'x.5:4:3' },      // 5, 4, 3 => x
      { barcode: 'l612', enumeration: 'y.5:4:3' },      // 5, 4, 3 => y
      { barcode: 'm612', enumeration: 'z.5:4:3' },      // 5, 4, 3 => z

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

  it('should sort by enumeration, numeric-extraction, examples from real librarians', () => {
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

  it('should sort by enumeration, numeric-extraction, only a is numeric', () => {
    const list = [
      { barcode: 'a612', enumeration: 'a1' },
      { barcode: 'b612', enumeration: 'a' },
    ];

    const shuffled = [list[0], list[1]];
    expect(list).toEqual(sortItems(shuffled, { column: 'enumeration' }));
  });

  it('should sort by enumeration, numeric-extraction, only b is numeric', () => {
    const list = [
      { barcode: 'b612', enumeration: 'a1' },
      { barcode: 'a612', enumeration: 'a' },
    ];

    const shuffled = [list[1], list[0]];
    expect(list).toEqual(sortItems(shuffled, { column: 'enumeration' }));
  });

  it('should sort by enumeration, numeric-extraction, neither a nor b is numeric', () => {
    const list = [
      { barcode: 'a612', enumeration: 'a' },
      { barcode: 'b612', enumeration: 'b' },
    ];

    const shuffled = [list[1], list[0]];
    expect(list).toEqual(sortItems(shuffled, { column: 'enumeration' }));
  });

  it('should sort by loanType, ascending, locale-compare', () => {
    // temporary loan type overrules permanent loan type
    const list = [
      { barcode: 'a612', temporaryLoanType: { name: 'a' } },
      { barcode: 'b612', temporaryLoanType: { name: 'b' } },
      { barcode: 'c612', temporaryLoanType: { name: 'c' }, permanentLoanType: { name: 'a' } },

      { barcode: 'd612', permanentLoanType: { name: 'w' } },
      { barcode: 'e612', permanentLoanType: { name: 'x' } },
      { barcode: 'a612', permanentLoanType: { name: 'y' } },
    ];

    const shuffled = [...list].sort(() => Math.random() - 0.5);

    expect(list).toEqual(sortItems(shuffled, { column: 'loanType' }));
  });

  it('should sort by materialType, ascending, locale-compare', () => {
    const a = { barcode: 'c612', materialType: { name: 'beta' } };
    const b = { barcode: 'd612', materialType: { name: 'gamma' } };
    const c = { barcode: 'a612' };
    const d = { barcode: 'b612', materialType: {} };

    const shuffled = [a, b, c, d].sort(() => Math.random() - 0.5);
    const list = sortItems(shuffled, { column: 'materialType' });

    // a and b should always float to the top
    // c and d both evaluate to empty string so how they sort is indeterminate.
    expect(list[0]).toEqual(a);
    expect(list[1]).toEqual(b);
  });

  it('should sort by status, ascending, locale-compare', () => {
    const a = { barcode: 'c612', status: { name: 'beta' } };
    const b = { barcode: 'd612', status: { name: 'gamma' } };
    const c = { barcode: 'a612' };
    const d = { barcode: 'b612', status: {} };

    const shuffled = [a, b, c, d].sort(() => Math.random() - 0.5);
    const list = sortItems(shuffled, { column: 'status' });

    // a and b should always float to the top
    // c and d both evaluate to empty string so how they sort is indeterminate.
    expect(list[0]).toEqual(a);
    expect(list[1]).toEqual(b);
  });

  it('should sort by volume, numeric-extraction, ascending', () => {
    const list = [
      { barcode: 'a612', volume: '0' },
      { barcode: 'b612', volume: '1' },
      { barcode: 'c612', volume: '5' },
      { barcode: 'd612', volume: '20' },
      { barcode: 'e612', volume: '100' },
      { barcode: 'f612' },
      { barcode: 'g612', volume: 'a' },
    ];

    const shuffled = [...list].sort(() => Math.random() - 0.5);

    expect(list).toEqual(sortItems(shuffled, { column: 'volume' }));
  });

  /**
   * note: array-to-string is a straight string comparator,
   * NOT a numeric-extraction comparator, so here, empty
   * string floats to the top, _before_ numeric (or any)
   * array values.
   */
  it('should sort by yearCaption, array-to-string, ascending', () => {
    const list = [
      { barcode: 'a612' },
      { barcode: 'b612', yearCaption: [1999, 2000] },
      { barcode: 'c612', yearCaption: [2000, 2001] },
      { barcode: 'd612', yearCaption: ['a', 'b'] },
      { barcode: 'e612', yearCaption: ['c', 'd'] },
    ];

    const shuffled = [...list].sort(() => Math.random() - 0.5);

    expect(list).toEqual(sortItems(shuffled, { column: 'yearCaption' }));
  });

  // force a specific coverage scenario: a length 0
  it('should sort by yearCaption, array-to-string, ascending', () => {
    const list = [
      { barcode: 'a612', yearCaption: [] },
      { barcode: 'b612', yearCaption: [1999, 2000] },
    ];

    const shuffled = [list[1], list[0]];
    expect(list).toEqual(sortItems(shuffled, { column: 'yearCaption' }));
  });

  // force a specific coverage scenario: a undefined
  it('should sort by yearCaption, array-to-string, ascending', () => {
    const list = [
      { barcode: 'a612' },
      { barcode: 'b612', yearCaption: [1999, 2000] },
    ];

    const shuffled = [list[1], list[0]];
    expect(list).toEqual(sortItems(shuffled, { column: 'yearCaption' }));
  });
});
