import PropTypes from 'prop-types';

import { Pane } from '@folio/stripes/components';


const VersionHistory = ({ onClose, paneTitleRef }) => {
  return (
    <Pane
      id="version-history-pane"
      defaultWidth="20%"
      onClose={onClose}
      paneTitle="Version history"
      dismissible
      paneTitleRef={paneTitleRef}
    >
      <span>Versions</span>
    </Pane>
  );
};

VersionHistory.propTypes = {
  onClose: PropTypes.func,
  paneTitleRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};


export default VersionHistory;
