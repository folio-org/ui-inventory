import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { noValue } from '../../../../../constants';

import {
  getChildInstancesLabel,
  getParentInstanceLabel,
  formatParentInstance
} from './utils';

describe('getChildInstancesLabel', () => {
  it('return a FormattedMessage component with id "ui-inventory.childInstances"', () => {
    const instance = {};
    const relationTypes = [{ id: 1, name: 'Relation Type 1' }];
    const result = getChildInstancesLabel(instance, relationTypes);
    expect(result.type).toEqual(FormattedMessage);
    expect(result.props.id).toEqual('ui-inventory.childInstances');
  });
  it('return a string with the relation type name and "(M)"', () => {
    const instance = {
      childInstances: [{ instanceRelationshipTypeId: 1 }]
    };
    const relationTypes = [{ id: 1, name: 'Relation Type 1' }];
    const result = getChildInstancesLabel(instance, relationTypes);
    expect(result).toEqual('Relation Type 1 (M)');
  });
});

describe('getParentInstanceLabel', () => {
  it('return a FormattedMessage component with id "ui-inventory.parentInstances"', () => {
    const instance = {};
    const relationTypes = [{ id: 1, name: 'Relation Type 1' }];
    const result = getParentInstanceLabel(instance, relationTypes);
    expect(result.type).toEqual(FormattedMessage);
    expect(result.props.id).toEqual('ui-inventory.parentInstances');
  });
  it('return a string with the relation type name', () => {
    const instance = {
      parentInstances: [{ instanceRelationshipTypeId: 1 }]
    };
    const relationTypes = [{ id: 1, name: 'Relation Type 1' }];
    const result = getParentInstanceLabel(instance, relationTypes);
    expect(result).toEqual('Relation Type 1');
  });
});

describe('formatParentInstance', () => {
  it('return `noValue` when parentInstances is an empty array', () => {
    const instance = { parentInstances: [] };
    const search = '';
    expect(formatParentInstance(instance, search)).toBe(noValue);
  });
  it('return a link when parentInstances has items', () => {
    const instance = {
      parentInstances: [{ superInstanceId: '789', superInstanceRelationshipTypeId: 'ghi' }],
    };
    const search = '?some=param';
    const expectedResult = (<div><Link to={`/inventory/view/789${search}`}>789 (M)</Link></div>);
    expect(formatParentInstance(instance, search)).toEqual(expectedResult);
  });
});
