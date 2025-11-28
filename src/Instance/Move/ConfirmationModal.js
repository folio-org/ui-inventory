import React from 'react';
import { useIntl } from 'react-intl';
import * as PropTypes from 'prop-types';

import { ConfirmationModal as OriginalConfirmationModal } from '@folio/stripes/components';

export const ConfirmationModal = props => {
  const intl = useIntl();

  return (
    <OriginalConfirmationModal
      heading={intl.formatMessage({ id: 'ui-inventory.moveEntity.modal.title' })}
      confirmLabel={intl.formatMessage({ id: 'ui-inventory.moveEntity.modal.confirmLabel' })}
      bodyTag="div"
      {...props}
    />
  );
};

ConfirmationModal.propTypes = {
  ...OriginalConfirmationModal.propTypes,
  heading: PropTypes.node, // to make it not required as in original ConfirmationModal
};

export default ConfirmationModal;
