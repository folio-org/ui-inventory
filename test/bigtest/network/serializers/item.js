import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({

  serialize(object, request) {
    const json = ApplicationSerializer.prototype.serialize.call(this, object, request);

    if (isArray(json.items)) {
      return {
        items: json.items,
        totalRecords: json.items.length
      };
    }

    return json.item;
  }
});
