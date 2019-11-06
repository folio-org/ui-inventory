export default function (server) {
  const materialType = server.create('materialType', { name: 'book' });
  const instances = server.createList('instance', 25, 'withHoldingAndItem');
  const item = instances[0].holdings.models[0].items.models[0];

  server.create('materialType', { name: 'dvd' });
  server.create('materialType', { name: 'sound recording' });

  item.materialType = materialType.attrs;
  item.save();
}
