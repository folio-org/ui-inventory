import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  item: belongsTo('item')
});
