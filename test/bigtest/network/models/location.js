import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  primaryServicePoint: belongsTo('service-point'),
  servicePoints: hasMany('service-point')
});
