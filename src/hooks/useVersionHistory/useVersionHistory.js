import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import {
  keyBy,
  uniq,
} from 'lodash';

import {
  formatDateTime,
  useUsersBatch,
} from '@folio/stripes-acq-components';

import { getChangedFieldsList } from './getChangedFieldsList';
import { getActionLabel } from './getActionLabel';

const useVersionHistory = (data, totalRecords) => {
  const intl = useIntl();
  const anonymousUserLabel = intl.formatMessage({ id: 'ui-inventory.versionHistory.anonymousUser' });

  const [versions, setVersions] = useState([]);
  const [usersId, setUsersId] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [isLoadedMoreVisible, setIsLoadedMoreVisible] = useState(true);

  const { users } = useUsersBatch(usersId);

  // cleanup when component unmounts
  useEffect(() => () => {
    setVersions([]);
    setUsersMap({});
  }, []);

  // update usersId when data changes
  useEffect(() => {
    if (!data?.length) return;

    const newUsersId = uniq(data.map(version => version.userId));

    setUsersId(newUsersId);
  }, [data]);

  // update usersMap when new users are fetched
  useEffect(() => {
    if (!users?.length) return;

    setUsersMap(prevState => ({
      ...prevState,
      ...keyBy(users, 'id'),
    }));
  }, [users]);

  useEffect(() => {
    if (!data?.length) return;

    setVersions(prevState => [...prevState, ...data]);
  }, [data]);

  useEffect(() => {
    setIsLoadedMoreVisible(versions.length < totalRecords);
  }, [versions]);

  const versionsToDisplay = useMemo(
    () => {
      const getUserName = userId => {
        const user = usersMap[userId];

        return user ? `${user.personal.lastName}, ${user.personal.firstName}` : null;
      };
      const getSourceLink = userId => {
        return userId ? <Link to={`/users/preview/${userId}`}>{getUserName(userId)}</Link> : anonymousUserLabel;
      };

      const transformDiffToVersions = diffArray => {
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

      return transformDiffToVersions(versions);
    }, [versions, usersMap],
  );

  const actionsMap = { ...getActionLabel(intl.formatMessage) };

  return {
    actionsMap,
    isLoadedMoreVisible,
    versionsToDisplay,
  };
};

export default useVersionHistory;
