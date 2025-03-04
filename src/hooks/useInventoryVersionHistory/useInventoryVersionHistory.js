import {
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import {
  keyBy,
  uniq,
} from 'lodash';

import { useVersionHistory } from '@folio/stripes/components';
import {
  formatDateTime,
  useUsersBatch,
} from '@folio/stripes-acq-components';

import { getChangedFieldsList } from './getChangedFieldsList';
import { getActionLabel } from './getActionLabel';

export const versionsFormatter = (usersMap, intl) => (diffArray) => {
  const anonymousUserLabel = intl.formatMessage({ id: 'ui-inventory.versionHistory.anonymousUser' });

  const getUserName = (userId) => {
    const user = usersMap[userId];

    return user ? `${user.personal.lastName}, ${user.personal.firstName}` : null;
  };
  const getSourceLink = (userId) => {
    return userId ? <Link to={`/users/preview/${userId}`}>{getUserName(userId)}</Link> : anonymousUserLabel;
  };

  return diffArray
    .filter(({ action }) => action !== 'CREATE')
    .map(({ eventDate, eventTs, userId, eventId, diff }) => ({
      eventDate: formatDateTime(eventDate, intl),
      source: getSourceLink(userId),
      userName: getUserName(userId) || anonymousUserLabel,
      fieldChanges: diff ? getChangedFieldsList(diff) : [],
      eventId,
      eventTs,
    }));
};

const useInventoryVersionHistory = ({
  data,
  totalRecords,
}) => {
  const intl = useIntl();

  const [usersId, setUsersId] = useState([]);
  const [usersMap, setUsersMap] = useState({});

  const { users } = useUsersBatch(usersId);

  // cleanup when component unmounts
  useEffect(() => () => {
    setUsersMap({});
  }, []);

  // update usersId when data changes
  useEffect(() => {
    if (!data?.length) return;

    const updatedUsersId = uniq(data.map(i => i.userId));

    setUsersId(updatedUsersId);
  }, [data]);

  // update usersMap when new users are fetched
  useEffect(() => {
    if (!users?.length) return;

    setUsersMap(prevState => ({
      ...prevState,
      ...keyBy(users, 'id'),
    }));
  }, [users]);

  const {
    versions,
    isLoadMoreVisible,
  } = useVersionHistory({ data, totalRecords, versionsFormatter: versionsFormatter(usersMap, intl) });

  const actionsMap = { ...getActionLabel(intl.formatMessage) };

  return {
    actionsMap,
    versions,
    isLoadMoreVisible,
  };
};

export default useInventoryVersionHistory;
