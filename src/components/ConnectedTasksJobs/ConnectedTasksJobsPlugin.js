import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import { Pluggable } from '@folio/stripes/core';

import { CONNECTED_RECORD_TYPES } from '../../constants';

export const connectedTasksJobsPropTypes = {
  recordId: PropTypes.string.isRequired,
  recordObject: PropTypes.object,
  recordType: PropTypes.oneOf(Object.values(CONNECTED_RECORD_TYPES)).isRequired,
};

export const ConnectedTasksJobsPlugin = ({
  componentType,
  recordId,
  recordObject,
  recordType,
}) => {
  const location = useLocation();

  return (
    <Pluggable
      componentType={componentType}
      recordId={recordId}
      recordObject={recordObject}
      recordType={recordType}
      recordUrl={`${location.pathname}${location.search || ''}`}
      type="task-list"
    />
  );
};

ConnectedTasksJobsPlugin.propTypes = {
  componentType: PropTypes.oneOf([
    'ConnectedTasksJobsButton',
    'ConnectedTasksJobsPane',
  ]).isRequired,
  ...connectedTasksJobsPropTypes,
};
