import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({

  serialize(object, request) {
    const json = ApplicationSerializer.prototype.serialize.call(this, object, request);

    function serializeOne(record) {
      const url = new URL(request.url);
      return { ...record,
        '@context': `${url.origin}/inventory/instance/context`,
        'links': {
          self: `${url.origin}/inventory/instances/${record.id}`
        } };
    }

    if (isArray(json.instances)) {
      return { ...json,
        instances: json.instances.map(serializeOne),
        totalRecords: json.instances.length };
    }
    return serializeOne(json.instance);
  }
});
