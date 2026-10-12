import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { useQuery } from 'react-query';

const useStaffMembersQuery = (staffMemberId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'staff-members' });

  const query = staffMemberId && `id==${staffMemberId}`;

  const { isLoading, data: staffMembers = {}, isFetching } = useQuery(
    [namespace, staffMemberId],
    () => ky.get('users', {
      searchParams: {
        ...(query && { query }),
      },
    }).json(),
    { enabled: Boolean(staffMemberId) },
  );

  return ({
    isLoading,
    isFetching,
    staffMembers: staffMembers.users || [],
  });
};

export default useStaffMembersQuery;
