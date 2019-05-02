import { Model, belongsTo, hasMany } from '@bigtest/mirage';

export default Model.extend({
  instance: belongsTo(),
  items: hasMany(),
});
