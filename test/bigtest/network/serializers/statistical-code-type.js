import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    if (isArray(json.statisticalCodeTypes)) {
      return { ...json, totalRecords: json.statisticalCodeTypes.length };
    } else {
      return json.statisticalCodeType;
    }
  }

});
