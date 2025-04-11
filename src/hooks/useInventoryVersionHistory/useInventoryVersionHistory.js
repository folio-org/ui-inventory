import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import {
  keyBy,
  uniq,
} from 'lodash';

import {
  formatDateTime,
  useUsersBatch,
} from '@folio/stripes-acq-components';
import { useStripes } from '@folio/stripes/core';

import { getChangedFieldsList } from './getChangedFieldsList';
import { getActionLabel } from './getActionLabel';
import { ACTIONS } from './constants';

export const versionsFormatter = (usersMap, intl, canViewUser) => (diffArray) => {
  const anonymousUserLabel = intl.formatMessage({ id: 'ui-inventory.versionHistory.anonymousUser' });

  const getUserName = (userId) => {
    const user = usersMap[userId];

    return user ? `${user.personal.lastName}, ${user.personal.firstName}` : null;
  };

  const getSourceLink = (userId) => {
    if (userId && canViewUser) {
      return <Link to={`/users/preview/${userId}`}>{getUserName(userId)}</Link>;
    } else if (userId) {
      return getUserName(userId);
    } else {
      return anonymousUserLabel;
    }
  };

  return diffArray
    .map(({ action, eventDate, eventTs, userId, eventId, diff }) => ({
      isOriginal: action === ACTIONS.CREATE,
      eventDate: formatDateTime(eventDate, intl),
      source: getSourceLink(userId),
      userName: getUserName(userId) || anonymousUserLabel,
      fieldChanges: diff ? getChangedFieldsList(diff) : [],
      eventId,
      eventTs,
    }));
};

const useInventoryVersionHistory = (data) => {
  const stripes = useStripes();
  const intl = useIntl();

  const [usersId, setUsersId] = useState([]);
  const [usersMap, setUsersMap] = useState({});

  const centralTenantId = stripes.user.user.consortium?.centralTenantId;

  const { users } = useUsersBatch(usersId, { tenantId: centralTenantId });

  const canViewUser = stripes.hasPerm('users.collection.get');

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

  const actionsMap = { ...getActionLabel(intl.formatMessage) };
  const versions = useMemo(
    () => versionsFormatter(usersMap, intl, canViewUser)(data),
    [usersMap, canViewUser, data],
  );

  return {
    actionsMap,
    versions,
  };
};

export default useInventoryVersionHistory;
