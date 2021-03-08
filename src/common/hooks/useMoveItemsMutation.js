import { useOkapiKy } from '@folio/stripes/core';
import { useMutation } from 'react-query';
import { useIntl } from 'react-intl';

export const useMoveItemsMutation = ({ onError, onSuccess, ...restOptions }) => {
  const intl = useIntl();
  const ky = useOkapiKy();

  const customOptions = {
    onError: (_, variables, ...rest) => {
      const error = new Error(intl.formatMessage(
        { id: 'ui-inventory.moveItems.instance.items.error.server' },
        { items: variables?.itemIds?.join(', ') },
      ));

      return onError(error, variables, ...rest);
    },

    onSuccess: (data, ...rest) => {
      const { nonUpdatedIds } = data;
      const hasErrors = Boolean(nonUpdatedIds?.length);

      if (hasErrors) {
        const error = new Error(intl.formatMessage(
          { id: 'ui-inventory.moveItems.instance.items.error' },
          { items: nonUpdatedIds.join(', ') }
        ));

        return onError(error, ...rest);
      }

      return onSuccess(data, ...rest);
    },
  };

  return useMutation(
    json => ky.post('inventory/items/move', { json }),
    { ...customOptions, ...restOptions },
  );
};

export default useMoveItemsMutation;
