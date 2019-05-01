import { Model, belongsTo, hasMany } from '@bigtest/mirage';

export default Model.extend({
  alternativeTitles: () => [],
  instanceType: belongsTo('instance-type'),
  holdings: hasMany(),
});
