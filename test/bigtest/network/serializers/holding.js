import ApplicationSerializer from './application';

const { isArray } = Array;
const { assign } = Object;

export default ApplicationSerializer.extend({

  serialize(object, request) {
    const json = ApplicationSerializer.prototype.serialize.call(this, object, request);

    if (isArray(json.holdings)) {
      return assign({}, json, {
        holdingsRecords: json.holdings,
        totalRecords: json.holdings.length
      });
    }

    return json.holding;
  }
});
