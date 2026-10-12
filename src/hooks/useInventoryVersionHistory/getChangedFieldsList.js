import { sortBy } from 'lodash';

/**
 * Merge fieldChanges and collectionChanges into a list of changed fields and sort by changeType
 * @param {Object} diff
 * @param {Array} diff.fieldChanges
 * @param {Array} diff.collectionChanges
 * @returns {Array.<{fieldName: String, changeType: String, newValue: any, oldValue: any}>}
 */
export const getChangedFieldsList = diff => {
  const fieldChanges = diff.fieldChanges ? diff.fieldChanges.map(field => ({
    fieldName: field.fieldName,
    changeType: field.changeType,
    newValue: field.newValue,
    oldValue: field.oldValue,
  })) : [];

  const collectionChanges = diff.collectionChanges ? diff.collectionChanges.flatMap(collection => {
    return collection.itemChanges.map(field => ({
      fieldName: collection.collectionName,
      changeType: field.changeType,
      newValue: field.newValue,
      oldValue: field.oldValue,
    }));
  }) : [];

  return sortBy([...fieldChanges, ...collectionChanges], data => data.changeType);
};
