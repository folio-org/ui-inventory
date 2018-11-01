import { Model, belongsTo, hasMany } from '@bigtest/mirage';

export default Model.extend({
  primaryServicePoint: belongsTo('service-point'),
  servicePoints: hasMany('service-point')
});
