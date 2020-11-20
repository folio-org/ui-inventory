import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    if (isArray(json.issuanceModes)) {
      return { ...json, totalRecords: json.issuanceModes.length };
    } else {
      return json.issuanceMode;
    }
  }

});
