import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  holdingsRecord: belongsTo('holding')
});
