export const orderLine = {
  id: 'lineId',
  purchaseOrderId: 'orderId',
  poLineNumber: '1000-1',
  receiptStatus: 'Awaiting Receipt',
};
export const order = {
  id: orderLine.purchaseOrderId,
  vendor: 'vendorId',
  orderType: 'Ongoing',
  workflowStatus: 'Open',
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

export const resultData = {
  order,
  orderLine,
  piece,
  vendor,
};
