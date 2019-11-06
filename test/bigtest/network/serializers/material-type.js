import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize(...args) {
    const { materialTypes } = ApplicationSerializer.prototype.serialize.apply(this, args);

    return {
      mtypes: materialTypes,
      totalRecords: materialTypes.length,
    };
  }
});
