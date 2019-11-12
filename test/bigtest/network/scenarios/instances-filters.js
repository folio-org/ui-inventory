export default function (server) {
  server.createList('instance', 25, 'withHoldingAndItem');

  const identifierType = server.create('identifier-type', { name: 'isbn' });

  server.create('instance', {
    title: 'Sapiens: A Brief History of Humankind',
    contributors: [{ name: 'Yuval Noah Harari' }],
    identifiers: [{ identifierTypeId: identifierType.id }],
  }, 'withHoldingAndItem');
}
