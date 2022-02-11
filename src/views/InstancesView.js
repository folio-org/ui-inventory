import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { InstancesList } from '../components';

const InstancesView = props => (
  <div data-test-inventory-instances>
    <InstancesList {...props} />
  </div>
);

InstancesView.propTypes = {
  data: PropTypes.object,
  parentResources: PropTypes.object,
};

export default memo(InstancesView, (prevProps, nextProps) => {
  return isEqual(prevProps.data, nextProps.data) &&
    isEqual(prevProps.parentResources.records, nextProps.parentResources.records) &&
    isEqual(prevProps.parentResources.facets, nextProps.parentResources.facets) &&
    prevProps.segment === nextProps.segment;
});
