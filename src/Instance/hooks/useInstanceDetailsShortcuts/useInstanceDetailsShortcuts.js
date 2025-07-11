import { FormattedMessage } from 'react-intl';

import {
  collapseAllSections,
  expandAllSections,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import {
  handleKeyCommand,
  isMARCSource,
} from '../../../utils';
import useInstanceActions from '../useInstanceActions';

const useInstanceDetailsShortcuts = ({
  instance,
  marcRecord,
  callout,
  canBeOpenedInLinkedData,
}) => {
  const stripes = useStripes();

  const {
    handleCreate,
    handleEdit,
    handleEditInstanceMarc,
    handleCopy,
  } = useInstanceActions({
    marcRecord,
    callout,
    instance,
    canBeOpenedInLinkedData,
  });

  return [
    {
      name: 'new',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-inventory.instance.create')) {
          handleCreate();
        }
      }),
    },
    {
      name: 'edit',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-inventory.instance.edit')) handleEdit();
      }),
    },
    {
      name: 'editMARC',
      handler: handleKeyCommand(() => {
        if (!isMARCSource(instance.source)) {
          return;
        }

        if (!stripes.hasPerm('ui-quick-marc.quick-marc-editor.all')) {
          callout.sendCallout({
            type: 'error',
            message: <FormattedMessage id="ui-inventory.shortcut.editMARC.noPermission" />,
          });
          return;
        }

        handleEditInstanceMarc();
      }),
    },
    {
      name: 'duplicateRecord',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-inventory.instance.create')) handleCopy();
      }),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, this.accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, this.accordionStatusRef),
    },
  ];
};

export default useInstanceDetailsShortcuts;
