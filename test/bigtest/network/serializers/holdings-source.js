import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({

  serialize(object, request) {
    const json = ApplicationSerializer.prototype.serialize.call(this, object, request);

    if (isArray(json.holdingsSources)) {
      return {
        holdingsRecordsSources: json.holdingsSources,
        totalRecords: json.holdingsSources.length,
      };
    }

    return json.holdingsSource;
  }
});
