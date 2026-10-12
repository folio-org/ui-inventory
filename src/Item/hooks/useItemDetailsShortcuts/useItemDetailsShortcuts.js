import { useHistory } from 'react-router-dom';

import {
  collapseAllSections,
  expandAllSections,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import useItemActions from '../useItemActions';
import { handleKeyCommand } from '../../../utils';

const useItemDetailsShortcuts = ({
  initialTenantId,
  accordionStatusRef,
}) => {
  const stripes = useStripes();
  const history = useHistory();

  const { handleEdit, handleCopy } = useItemActions({ initialTenantId });

  return [
    {
      name: 'edit',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-inventory.item.edit')) handleEdit();
      }),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
    {
      name: 'search',
      handler: handleKeyCommand(() => history.push('/inventory')),
    },
    {
      name: 'duplicateRecord',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-inventory.item.create')) handleCopy();
      }),
    },
  ];
};

export default useItemDetailsShortcuts;
