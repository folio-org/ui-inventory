import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import InstancesList from '../components/InstancesList';

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
    prevProps.isRequestUrlExceededLimit === nextProps.isRequestUrlExceededLimit &&
    prevProps.segment === nextProps.segment;
});
