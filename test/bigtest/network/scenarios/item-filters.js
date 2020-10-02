export default function (server) {
  const materialType = server.create('materialType', { name: 'book' });
  server.createList('instance', 25, 'withHoldingAndItem');

  const instance = server.create('instance', {
    title: 'Sapiens: A Brief History of Humankind',
    contributors: [{ name: 'Yuval Noah Harari' }],
  }, 'withHoldingAndItem');

  const item = instance.holdings.models[0].items.models[0];
  const holding = instance.holdings.models[0];

  server.create('materialType', { name: 'dvd' });
  server.create('materialType', { name: 'sound recording' });

  holding.permanentLocationId = '53cf956f-c1df-410b-8bea-27f712cca7c0';
  holding.save();

  item.materialType = materialType.attrs;
  item.status.name = 'Missing';
  item.hrid = 'it00000000005';
  item.barcode = '0100110101000011';

  item.save();
}
