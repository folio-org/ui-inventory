import PropTypes from 'prop-types';

import {
  VersionHistoryPane,
  VersionViewContextProvider,
} from '@folio/stripes-acq-components';

const VersionHistory = ({ onClose }) => {
  // TODO: remove once API for inventory version history is implemented and pass currentVersion and versionId to props
  // set mocked data to avoid unit tests warnings, because these props are required
  const currentVersion = 'mockedVersion';
  const versionId = 'mockedVersionId';

  return (
    <VersionViewContextProvider
      snapshotPath=""
      versions={[]}
      versionId={versionId}
    >
      <VersionHistoryPane
        currentVersion={currentVersion}
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
