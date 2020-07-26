import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  instanceType: belongsTo()
});
