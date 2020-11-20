import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    if (isArray(json.electronicAccessRelationships)) {
      return { ...json, totalRecords: json.electronicAccessRelationships.length };
    } else {
      return json.electronicAccessRelationship;
    }
  }

});
