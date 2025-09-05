import { getPOLineHoldingIds } from './utils';

// Generate by Co-polit(AI)
describe('getPOLineHoldingIds', () => {
  it('should return empty array if no poLines are passed', () => {
    const result = getPOLineHoldingIds();

    expect(result).toEqual([]);
  });

  it('should return the correct value', () => {
    const poLines = [
      {
        locations: [
          { holdingId: 'holdingId1' },
          { holdingId: 'holdingId2' },
        ],
      },
      {
        locations: [
          { holdingId: 'holdingId3' },
          { holdingId: 'holdingId4' },
        ],
      },
    ];
    const selectedHoldingIdsFromInstance = ['holdingId1', 'holdingId2'];

    const result = getPOLineHoldingIds(poLines, selectedHoldingIdsFromInstance);

    expect(result).toEqual(['holdingId1', 'holdingId2']);
  });

  it('should return the correct value', () => {
    const poLines = [
      {
        locations: [
          { holdingId: 'holdingId1' },
          { holdingId: 'holdingId2' },
        ],
      },
      {
        locations: [
          { holdingId: 'holdingId3' },
          { holdingId: 'holdingId4' },
        ],
      },
    ];
    const selectedHoldingIdsFromInstance = ['holdingId3', 'holdingId1'];

    const result = getPOLineHoldingIds(poLines, selectedHoldingIdsFromInstance);

    expect(result).toEqual(['holdingId1', 'holdingId2', 'holdingId3', 'holdingId4']);
  });
});
