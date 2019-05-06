import { Model, belongsTo } from '@bigtest/mirage';

export default Model.extend({
  item: belongsTo('item')
});
