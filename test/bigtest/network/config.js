import CQLParser, { CQLBoolean } from './cql';

// typical mirage config export
export default function configure() {
  // users
  this.get('/users', ({ users }, request) => {
    if (request.queryParams.query) {
      const cqlParser = new CQLParser();
      cqlParser.parse(request.queryParams.query);
      return users.where({
        id: cqlParser.tree.term
      });
    } else {
      return [];
    }
  });

  this.get('/instance-types');
  this.get('/instance-types/:id');

  this.get('/instance-formats');
  this.get('/instance-formats/:id');

  this.get('/instance-statuses');
  this.get('/instance-statuses/:id');

  this.get('/identifier-types');
  this.get('/identifier-types/:id');

  this.get('/contributor-types');
  this.get('/contributor-types/:id');

  this.get('/contributor-name-types');
  this.get('/contributor-name-types/:id');

  this.get('/classification-types');
  this.get('/classification-types/:id');

  this.get('/instance-relationship-types');
  this.get('/instance-relationship-types/:id');

  this.get('/modes-of-issuance', ({ issuanceModes }) => issuanceModes.all());
  this.get('/modes-of-issuance/:id', ({ issuanceModes }, { params }) => {
    return issuanceModes.find(params.id);
  });

  this.get('/electronic-access-relationships');
  this.get('/electronic-access-relationships/:id');

  this.get('/statistical-code-types');
  this.get('/statistical-code-types/:id');

  this.get('/statistical-codes', {
    statisticalCodes: [],
    totalRecords: 0
  });

  this.get('/alternative-title-types', {
    alternativeTitleTypes: [],
    totalRecords: 0
  });

  this.get('/inventory/instances', (schema /* , request */) => {
    return schema.instances.all();
  });
  this.get('/inventory/instances/:id', (schema, { params }) => {
    return schema.instances.find(params.id);
  });

  this.get('/locations');
  this.get('/locations/:id');

  this.get('/platforms', { platforms: [], totalRecords: 0 });

  // item-storage
  this.get('/service-points', {
    servicepoints: [],
    totalRecords: 0
  });

  this.get('/inventory/items', ({ items }, request) => {
    if (request.queryParams.query) {
      const cqlParser = new CQLParser();
      cqlParser.parse(request.queryParams.query);
      return items.where({
        barcode: cqlParser.tree.term
      });
    } else {
      return items.all();
    }
  });

  this.get('/circulation/loans', ({ loans }, request) => {
    if (request.queryParams.query) {
      const cqlParser = new CQLParser();
      cqlParser.parse(request.queryParams.query);
      if (cqlParser.tree instanceof CQLBoolean) {
        return loans.where({
          itemId: cqlParser.tree.left.term
        });
      } else {
        return loans.where({
          itemId: cqlParser.tree.term
        });
      }
    } else {
      return loans.all();
    }
  });

  this.put('/circulation/loans/:id', (_, request) => {
    return JSON.parse(request.requestBody);
  });

  this.get('/holdings-storage/holdings', {
    holdingsRecords: [],
    totalRecords: 0
  });

  this.get('/circulation/requests', {
    requests: [],
    totalRecords: 0
  });

  this.get('/service-points-users', {
    servicePointsUsers: [],
    totalRecords: 0
  });

  this.get('/staff-slips-storage/staff-slips', {});
  this.get('/groups', {});
  this.get('/addresstypes', {});
  this.get('/users/:id', {});
  this.get('/perms/users/:id/permissions', {});
}
