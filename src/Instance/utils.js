export const isItemsSelected = (items, selectedItemsMap) => {
  return items.every((item) => Boolean(
    selectedItemsMap[item.holdingsRecordId] && selectedItemsMap[item.holdingsRecordId][item.id]
  ));
};

export const selectItems = (prevItemsMap, holdingId, items) => {
  const prevHolding = prevItemsMap[holdingId] || {};
  const prevSelectedCount = Object
    .keys(prevHolding)
    .filter(itemId => prevHolding[itemId])
    .length;
  const isNoNewItems = (items.length > 1 && prevSelectedCount === items.length);
  const withNewItems = (items.length > 1 && prevSelectedCount !== items.length);

  let newHolding;

  if (isNoNewItems) {
    newHolding = {};
  } else if (withNewItems) {
    newHolding = items.reduce((acc, item) => {
      acc[item.id] = true;

      return acc;
    }, {});
  } else {
    newHolding = {
      ...prevHolding,
      [items[0].id]: !prevHolding[items[0].id],
    };
  }

  return {
    ...prevItemsMap,
    [holdingId]: newHolding,
  };
};
