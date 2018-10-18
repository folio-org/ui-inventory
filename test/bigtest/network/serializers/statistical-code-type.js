import ApplicationSerializer from './application';

const { isArray } = Array;
const { assign } = Object;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    if (isArray(json.statisticalCodeTypes)) {
      return assign({}, json, {
        totalRecords: json.statisticalCodeTypes.length
      });
    } else {
      return json.statisticalCodeType;
    }
  }

});
