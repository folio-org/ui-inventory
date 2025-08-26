import React from 'react';
import PropTypes from 'prop-types';

import { MessageBanner } from '@folio/stripes/components';

import * as RemoteStorage from '../../RemoteStorageService';
import { ConfirmationModal } from './ConfirmationModal';

export const ItemsConfirmation = ({ count, ...rest }) => {
  const message = (
    <MessageBanner type="warning">
      <RemoteStorage.Confirmation.Message count={count} />
    </MessageBanner>
  );

  return (
    <ConfirmationModal
      message={message}
      {...rest}
    />
  );
};

ItemsConfirmation.propTypes = {
  ...ConfirmationModal.propTypes,
  count: PropTypes.number,
};

export default ItemsConfirmation;
