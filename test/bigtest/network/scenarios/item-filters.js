export default function (server) {
  const materialType = server.create('materialType', { name: 'book' });
  const instances = server.createList('instance', 25, 'withHoldingAndItem');
  const item = instances[0].holdings.models[0].items.models[0];
  const holding = instances[0].holdings.models[0];

  server.create('materialType', { name: 'dvd' });
  server.create('materialType', { name: 'sound recording' });

  holding.permanentLocationId = '53cf956f-c1df-410b-8bea-27f712cca7c0';
  holding.save();

  item.materialType = materialType.attrs;
  item.status.name = 'Withdrawn';
  item.save();
}
