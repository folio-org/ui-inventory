import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    if (isArray(json.instanceTypes)) {
      return { ...json, totalRecords: json.instanceTypes.length };
    } else {
      return json.instanceType;
    }
  }

});
