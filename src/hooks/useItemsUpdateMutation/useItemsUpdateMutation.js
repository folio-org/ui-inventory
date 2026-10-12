import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  useMutation,
  useQueryClient,
} from 'react-query';

import {
  CalloutContext,
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useItemsUpdateMutation = ({ tenantId } = {}) => {
  const ky = useOkapiKy({ tenant: tenantId });
  const queryClient = useQueryClient();
  const [fetchItemsPerHoldingNamespace] = useNamespace({ key: 'itemsByHoldingId' });
  const callout = useContext(CalloutContext);

  const { mutateAsync } = useMutation({
    mutationFn: (body) => {
      const requestBody = { items: body.items.map(({ holdingId: _holdingId, ...item }) => item) };
      return ky.patch('item-storage/items', { json: requestBody }).json();
    },
    onError: () => {
      callout.sendCallout({
        type: 'error',
        message: <FormattedMessage id="ui-inventory.communicationProblem" />,
      });
    },
    onSettled: (data, error, variables) => {
      const updatedHoldingIds = variables.items.map(item => item.holdingId).filter(Boolean);

      if (!error) {
        for (const holdingId of updatedHoldingIds) {
          queryClient.invalidateQueries({ queryKey: [fetchItemsPerHoldingNamespace, 'items', holdingId] });
        }
      }
    },
  });

  return { mutateAsync };
};

export default useItemsUpdateMutation;
