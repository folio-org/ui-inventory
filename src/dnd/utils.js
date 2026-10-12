export const getPOLineHoldingIds = (poLines = [], selectedHoldingIdsFromInstance = []) => {
  return poLines
    .filter(({ locations }) => {
      return locations.some(({ holdingId }) => selectedHoldingIdsFromInstance.includes(holdingId));
    }).map(({ locations }) => locations.map(({ holdingId }) => holdingId))
    .flat();
};
