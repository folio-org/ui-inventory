import { items } from '../../mocks/items';

export default server => {
  server.get('/inventory/items', {
    items,
    totalRecords: items.length,
  });
};
