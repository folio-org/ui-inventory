import ApplicationSerializer from './application';

const { isArray } = Array;
const { assign } = Object;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    if (isArray(json.instanceFormats)) {
      return assign({}, json, {
        totalRecords: json.instanceFormats.length
      });
    } else {
      return json.instanceFormat;
    }
  }

});
