import ApplicationSerializer from './application';

const { isArray } = Array;
const { assign } = Object;

export default ApplicationSerializer.extend({
  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);

    console.log('material type', json);

    if (isArray(json.instanceStatuses)) {
      return assign({}, json, {
        totalRecords: json.instanceStatuses.length
      });
    } else {
      return json.instanceStatus;
    }
  }
});
