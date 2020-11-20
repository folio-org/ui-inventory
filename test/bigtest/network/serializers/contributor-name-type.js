import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    if (isArray(json.contributorNameTypes)) {
      return { ...json, totalRecords: json.contributorNameTypes.length };
    } else {
      return json.contributorNameType;
    }
  }

});
