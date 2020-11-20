import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({
  serialize(object, request) {
    const json = ApplicationSerializer.prototype.serialize.call(this, object, request);

    if (isArray(json.holdings)) {
      return { ...json,
        holdingsRecords: json.holdings,
        totalRecords: json.holdings.length };
    }

    return json.holding;
  }
});
