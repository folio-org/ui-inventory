import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  instance: belongsTo(),
  items: hasMany(),
});
