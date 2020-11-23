import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Tags } from '@folio/stripes/smart-components';

const HELPER_APPS = {
  tags: Tags,
};

function HelperApp({
  appName,
  match: { params },
  onClose,
}) {
  const HelperAppComponent = HELPER_APPS[appName];

  return (
    <HelperAppComponent
      link={`inventory/instances/${params.id}`}
      onToggle={onClose}
    />
  );
}

HelperApp.propTypes = {
  appName: PropTypes.string,
  match: PropTypes.object,
  onClose: PropTypes.func,
};

export default withRouter(HelperApp);
