export const line = {
  id: 'lineId',
  purchaseOrderId: 'orderId',
  poLineNumber: '1000',
  receiptStatus: 'Ongoing',
};
export const order = {
  id: line.purchaseOrderId,
  acqUnitIds: ['unitId'],
};
export const acqUnit = {
  id: order.acqUnitIds[0],
  name: 'unit',
};

export const title = {
  id: 'titleId',
  poLineId: line.id,
};

export const resultData = [{
  ...line,
  order: {
    ...order,
    acqUnits: [acqUnit],
  },
}];
