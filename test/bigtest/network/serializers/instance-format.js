import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    if (isArray(json.instanceFormats)) {
      return { ...json, totalRecords: json.instanceFormats.length };
    } else {
      return json.instanceFormat;
    }
  }

});
