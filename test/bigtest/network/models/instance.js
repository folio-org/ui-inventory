import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  alternativeTitles: () => [],
  instanceType: belongsTo('instance-type'),
  holdings: hasMany(),
});
