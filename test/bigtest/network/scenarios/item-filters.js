export default function (server) {
  const materialTypes = server.createList('materialType', 10);
  const instances = server.createList('instance', 25, 'withHoldingAndItem');
  const item = instances[0].holdings.models[0].items.models[0];

  item.materialType = materialTypes[0].attrs;
  item.save();
}
