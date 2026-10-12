import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import {
  noValue,
} from '../../../../../constants';

export const getChildInstancesLabel = (instance, relationTypes) => {
  if (!instance?.childInstances?.length) {
    return <FormattedMessage id="ui-inventory.childInstances" />;
  }

  const relationTypeName = relationTypes.find(
    relationType => relationType.id === instance.childInstances[0].instanceRelationshipTypeId
  ).name;

  return `${relationTypeName} (M)`;
};

export const getParentInstanceLabel = (instance, relationTypes) => {
  if (!instance?.parentInstances?.length) {
    return <FormattedMessage id="ui-inventory.parentInstances" />;
  }

  const relationTypeName = relationTypes.find(
    relationType => relationType.id === instance.parentInstances[0].instanceRelationshipTypeId
  ).name;

  return relationTypeName;
};

export const formatChildInstances = (instance, search) => {
  if (!instance?.childInstances?.length) {
    return noValue;
  }

  return instance.childInstances.map(childInstance => (
    <div key={childInstance.subInstanceId}>
      <Link to={`/inventory/view/${childInstance.subInstanceId}${search}`}>
        {childInstance.subInstanceId}
      </Link>
    </div>
  ));
};

export const formatParentInstance = (instance, search) => {
  if (!instance?.parentInstances?.length) {
    return noValue;
  }

  const parentInstance = instance.parentInstances[0];

  return (
    <div>
      <Link to={`/inventory/view/${parentInstance.superInstanceId}${search}`}>
        {`${parentInstance.superInstanceId} (M)`}
      </Link>
    </div>
  );
};
