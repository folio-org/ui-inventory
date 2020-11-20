import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    if (isArray(json.instanceStatuses)) {
      return { ...json, totalRecords: json.instanceStatuses.length };
    } else {
      return json.instanceStatus;
    }
  }

});
