import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    if (isArray(json.classificationTypes)) {
      return { ...json, totalRecords: json.classificationTypes.length };
    } else {
      return json.classificationType;
    }
  }

});
