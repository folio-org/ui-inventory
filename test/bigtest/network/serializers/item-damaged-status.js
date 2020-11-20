import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    if (isArray(json.itemDamagedStatuses)) {
      return { ...json, totalRecords: json.itemDamagedStatuses.length };
    } else {
      return json.itemDamagedStatus;
    }
  }

});
