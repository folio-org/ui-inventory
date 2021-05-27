import React from 'react';
import PropTypes from 'prop-types';

import { MessageBanner } from '@folio/stripes/components';

import * as RemoteStorage from '../../RemoteStorageService';
import * as Move from '../Move';


export const Confirmation = ({ count, ...rest }) => {
  const message = (
    <MessageBanner type="warning">
      <RemoteStorage.Confirmation.Message count={count} />
    </MessageBanner>
  );

  return (
    <Move.ConfirmationModal
      message={message}
      {...rest}
    />
  );
};

Confirmation.propTypes = {
  ...Move.ConfirmationModal.propTypes,
  count: PropTypes.number,
};

export default Confirmation;
