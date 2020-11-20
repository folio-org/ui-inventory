import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    if (isArray(json.instanceRelationshipTypes)) {
      return { ...json, totalRecords: json.instanceRelationshipTypes.length };
    } else {
      return json.instanceRelationshipType;
    }
  }

});
