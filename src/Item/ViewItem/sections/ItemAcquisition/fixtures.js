export const orderLine = {
  id: 'lineId',
  purchaseOrderId: 'orderId',
  poLineNumber: '1000-1',
  receiptStatus: 'Awaiting Receipt',
  acquisitionMethod: '12345',
  fundDistribution: [
    { code: 'ABC' },
    { code: 'XYZ' },
  ],
  locations: [
    { quantity: 2 },
    { quantity: 1 },
  ]
};
export const order = {
  id: orderLine.purchaseOrderId,
  vendor: 'vendorId',
  orderType: 'Ongoing',
  workflowStatus: 'Open',
};
export const orderSetting = {
  id: '12345',
  value: 'Purchase At Vendor System',
};
export const vendor = {
  id: order.vendor,
  name: 'Amazon',
  code: 'AMAZ',
};
export const piece = {
  id: 'pieceId',
  poLineId: orderLine.id,
  itemId: 'itemId'
};
export const finance = {
  transactions: [
    { currency: 'USD', encumbrance: { sourcePoLineId: 'lineId', amountExpended: 4.1 } },
    { currency: 'USD', encumbrance: { sourcePoLineId: 'lineId', amountExpended: 5.67 } },
  ]
};

export const resultData = {
  order,
  orderSetting,
  orderLine,
  piece,
  vendor,
  finance,
};
