import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { ConfirmationModal, MessageBanner } from '@folio/stripes-components';

import * as RemoteStorage from '../../RemoteStorageService';


export const Confirmation = ({ count, ...rest }) => {
  const intl = useIntl();

  const message = (
    <MessageBanner type="warning">
      <RemoteStorage.Confirmation.Message count={count} />
    </MessageBanner>
  );

  return (
    <ConfirmationModal
      confirmLabel="yes"
      heading={intl.formatMessage({ id: 'ui-inventory.moveItems.modal.title' })}
      message={message}
      bodyTag="div"
      {...rest}
    />
  );
};

Confirmation.propTypes = {
  ...ConfirmationModal.propTypes,
  heading: PropTypes.node, // to make it not required as in ConfirmationModal
  count: PropTypes.number,
};

export default Confirmation;
