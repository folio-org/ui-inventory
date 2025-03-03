import {
  useMemo,
  useState,
} from 'react';

import { AuditLogPane } from '@folio/stripes/components';

import {
  useMarcAuditDataQuery,
  useVersionHistory,
} from '../../hooks';

const transformVersion = (version) => {
  const { diff: marcDiff, eventDate } = version;
  const diff = {
    fieldChanges: []
  };

  // Process added fields
  if (marcDiff.added) {
    marcDiff.added.forEach(entry => {
      diff.fieldChanges.push({
        changeType: 'ADDED',
        fieldName: entry.field,
        newValue: entry.newValue
      });
    });
  }

  // Process modified fields
  if (marcDiff.modified) {
    marcDiff.modified.forEach(entry => {
      diff.fieldChanges.push({
        changeType: 'MODIFIED',
        fieldName: entry.field,
        newValue: entry.newValue,
        oldValue: entry.oldValue
      });
    });
  }

  // Process removed fields
  if (marcDiff.removed) {
    marcDiff.removed.forEach(entry => {
      diff.fieldChanges.push({
        changeType: 'REMOVED',
        fieldName: entry.field,
        oldValue: entry.oldValue
      });
    });
  }

  return {
    ...version,
    diff,
    eventTs: new Date(eventDate).valueOf(), // convert event date string to timestamp. timestamp is used for fetching more records
  };
};

export const MarcVersionHistory = ({ onClose, id }) => {
  const [lastVersionEventTs, setLastVersionEventTs] = useState(null);

  const {
    data,
    totalRecords,
    isLoading,
  } = useMarcAuditDataQuery(id, lastVersionEventTs);

  const transformedVersions = useMemo(() => data?.map(version => transformVersion(version)), [data]);

  const {
    actionsMap,
    isLoadedMoreVisible,
    versionsToDisplay,
  } = useVersionHistory(transformedVersions, totalRecords);

  const handleLoadMore = lastEventTs => {
    setLastVersionEventTs(lastEventTs);
  };

  return (
    <AuditLogPane
      versions={versionsToDisplay}
      isLoadedMoreVisible={isLoadedMoreVisible}
      handleLoadMore={handleLoadMore}
      actionsMap={actionsMap}
      onClose={onClose}
      isLoading={isLoading}
    />
  );
};
