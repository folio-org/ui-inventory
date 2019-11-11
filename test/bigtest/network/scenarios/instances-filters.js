export default function (server) {
  server.createList('instance', 25, 'withHoldingAndItem');
  server.create('instance', {
    title: 'Sapiens: A Brief History of Humankind',
    contributors: [{ name: 'Yuval Noah Harari' }],
  }, 'withHoldingAndItem');
}
