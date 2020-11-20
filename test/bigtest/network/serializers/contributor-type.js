import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    if (isArray(json.contributorTypes)) {
      return { ...json, totalRecords: json.contributorTypes.length };
    } else {
      return json.contributorType;
    }
  }

});
