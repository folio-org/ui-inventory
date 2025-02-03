import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pane } from '@folio/stripes/components';

const VersionHistory = ({ onClose, paneTitleRef }) => {
  return (
    <Pane
      id="version-history-pane"
      defaultWidth="20%"
      onClose={onClose}
      paneTitle={<FormattedMessage id="ui-inventory.versionHistory.paneTitle" />}
      dismissible
      paneTitleRef={paneTitleRef}
    >
      {/* TODO: Create here the list of version history cards in scope of https://folio-org.atlassian.net/browse/UIIN-3175 */}
      <span>Versions</span>
    </Pane>
  );
};

VersionHistory.propTypes = {
  onClose: PropTypes.func,
  paneTitleRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};


export default VersionHistory;
