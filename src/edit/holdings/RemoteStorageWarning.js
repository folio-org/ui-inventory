import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { MessageBanner } from '@folio/stripes/components';

import { useFormState } from 'react-final-form';
import { useRemoteStorageApi } from '../../RemoteStorage';


export const RemoteStorageWarning = ({ itemCount }) => {
  const { initialValues, values } = useFormState();

  const { checkMoveFromRemoteToNonRemote } = useRemoteStorageApi();

  const permanentLocation = {
    fromLocationId: initialValues.permanentLocationId,
    toLocationId: values.permanentLocationId,
  };

  const temporaryLocation = {
    fromLocationId: initialValues.temporaryLocationId,
    toLocationId: values.temporaryLocationId,
  };

  const isWarningShown =
    checkMoveFromRemoteToNonRemote(permanentLocation) || checkMoveFromRemoteToNonRemote(temporaryLocation);

  return (
    <MessageBanner dismissable type="warning" show={isWarningShown}>
      <FormattedMessage
        id="ui-inventory.location.holdings.removeFromRemote.warning"
        values={{ itemCount }}
      />
    </MessageBanner>
  );
};

RemoteStorageWarning.propTypes = {
  itemCount: PropTypes.number,
};


export default RemoteStorageWarning;
