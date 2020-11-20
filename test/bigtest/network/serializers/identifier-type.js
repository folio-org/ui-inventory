import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    if (isArray(json.identifierTypes)) {
      return { ...json, totalRecords: json.identifierTypes.length };
    } else {
      return json.identifierType;
    }
  }

});
