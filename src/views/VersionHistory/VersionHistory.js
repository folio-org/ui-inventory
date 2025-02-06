import PropTypes from 'prop-types';

import {
  VersionHistoryPane,
  VersionViewContextProvider,
} from '@folio/stripes-acq-components';

const VersionHistory = ({ onClose }) => {
  return (
    <VersionViewContextProvider
      snapshotPath=""
      versions={[]}
      versionId={null}
    >
      <VersionHistoryPane
        currentVersion={null}
        id="inventory"
        isLoading={false}
        onClose={onClose}
        onSelectVersion={() => {}}
        snapshotPath=""
        labelsMap={{}}
        versions={[]}
        hiddenFields={[]}
      />
    </VersionViewContextProvider>
  );
};

VersionHistory.propTypes = {
  onClose: PropTypes.func,
};


export default VersionHistory;
