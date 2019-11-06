import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({
  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.materialTypes)) {
      return {
        mtypes: json.materialTypes,
        totalRecords: json.materialTypes.length
      };
    } else {
      return json.instanceStatus;
    }
  }
});
