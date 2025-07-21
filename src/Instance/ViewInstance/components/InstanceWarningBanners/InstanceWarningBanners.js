import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { MessageBanner } from '@folio/stripes/components';

const InstanceWarningBanners = ({ instance }) => {
  const warningBanners = useMemo(() => ([
    {
      condition: !instance.deleted && instance.staffSuppress && !instance.discoverySuppress,
      messageId: 'ui-inventory.warning.instance.staffSuppressed',
    },
    {
      condition: !instance.deleted && instance.discoverySuppress && !instance.staffSuppress,
      messageId: 'ui-inventory.warning.instance.suppressedFromDiscovery',
    },
    {
      condition: !instance.deleted && instance.discoverySuppress && instance.staffSuppress,
      messageId: 'ui-inventory.warning.instance.suppressedFromDiscoveryAndStaffSuppressed',
    },
    {
      condition: instance.deleted && instance.discoverySuppress && instance.staffSuppress,
      messageId: 'ui-inventory.warning.instance.setForDeletionAndSuppressedFromDiscoveryAndStaffSuppressed',
    },
  ]), [instance]);

  return warningBanners.map(({ condition, messageId }) => (
    <MessageBanner marginTop0 key={messageId} show={Boolean(condition)} type="warning">
      <FormattedMessage id={messageId} />
    </MessageBanner>
  ));
};

export default InstanceWarningBanners;
