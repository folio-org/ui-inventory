import { getChangedFieldsList } from './getChangedFieldsList';

describe('getChangedFieldsList', () => {
  it('should return correct list of changed fields', () => {
    const diff = {
      fieldChanges: [{
        fieldName: 'fieldName',
        changeType: 'ADDED',
        newValue: 'newValue',
      }],
      collectionChanges: [{
        collectionName: 'contributors',
        itemChanges: [{
          changeType: 'EDITED',
          newValue: 'contr 1',
          oldValue: 'contr 2',
        }],
      }],
    };
    const result = [
      {
        fieldName: 'fieldName',
        changeType: 'ADDED',
        newValue: 'newValue',
      }, {
        fieldName: 'contributors',
        changeType: 'EDITED',
        newValue: 'contr 1',
        oldValue: 'contr 2',
      },
    ];

    expect(getChangedFieldsList(diff)).toEqual(result);
  });

  it('should return correct list of changed fields if fieldChanges is empty', () => {
    const diff = {
      collectionChanges: [{
        collectionName: 'contributors',
        itemChanges: [{
          changeType: 'EDITED',
          newValue: 'contr 1',
          oldValue: 'contr 2',
        }],
      }],
    };
    const result = [
      {
        fieldName: 'contributors',
        changeType: 'EDITED',
        newValue: 'contr 1',
        oldValue: 'contr 2',
      },
    ];

    expect(getChangedFieldsList(diff)).toEqual(result);
  });

  it('should return correct list of changed fields if collectionChanges is empty', () => {
    const diff = {
      fieldChanges: [{
        fieldName: 'fieldName',
        changeType: 'ADDED',
        newValue: 'newValue',
      }],
    };
    const result = [
      {
        fieldName: 'fieldName',
        changeType: 'ADDED',
        newValue: 'newValue',
      },
    ];

    expect(getChangedFieldsList(diff)).toEqual(result);
  });

  it('should sort changes by change type', () => {
    const diff = {
      fieldChanges: [{
        fieldName: 'fieldName',
        changeType: 'REMOVED',
        newValue: 'newValue',
      }, {
        fieldName: 'fieldName',
        changeType: 'EDITED',
        newValue: 'newValue',
      }, {
        fieldName: 'fieldName',
        changeType: 'ADDED',
        newValue: 'newValue',
      }],
    };
    const result = [
      {
        fieldName: 'fieldName',
        changeType: 'ADDED',
        newValue: 'newValue',
      }, {
        fieldName: 'fieldName',
        changeType: 'EDITED',
        newValue: 'newValue',
      }, {
        fieldName: 'fieldName',
        changeType: 'REMOVED',
        newValue: 'newValue',
      },
    ];

    expect(getChangedFieldsList(diff)).toEqual(result);
  });
});
