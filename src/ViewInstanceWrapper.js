import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

import { withTags } from '@folio/stripes/smart-components';

import ViewInstance from './ViewInstance';
import useLoadSubInstances from './hooks/useLoadSubInstances';

const ViewInstanceWrapper = (props) => {
  const {
    match: { params: { id } },
    resources,
  } = props;
  const instance = resources.instance?.records?.[0];
  let selectedInstance = instance?.id === id ? instance : null;

  // only load after instance is present
  const parentInstances = useLoadSubInstances(selectedInstance?.parentInstances, 'superInstanceId');
  const childInstances = useLoadSubInstances(selectedInstance?.childInstances, 'subInstanceId');

  if (selectedInstance) {
    if (parentInstances?.length) {
      selectedInstance = { ...selectedInstance, parentInstances };
    }

    if (childInstances?.length) {
      selectedInstance = { ...childInstances, childInstances };
    }
  }

  return (
    <ViewInstance
      {...omit(props, ['resources', 'mutator'])}
      selectedInstance={selectedInstance}
    />
  );
};

ViewInstanceWrapper.manifest = Object.freeze({
  instance: {
    type: 'okapi',
    path: 'inventory/instances/:{id}',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
});

ViewInstanceWrapper.propTypes = {
  resources: PropTypes.shape({
    instance: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

export default withTags(ViewInstanceWrapper);
