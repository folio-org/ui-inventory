import React from 'react';
import { FormattedMessage } from 'react-intl';

import { MessageBanner } from '@folio/stripes/components';

import { useFormState } from 'react-final-form';
import { useRemoteStorageApi } from '../../RemoteStorage';


export const RemoteStorageWarning = () => {
  const { initialValues, values } = useFormState();

  const { checkMoveFromRemoteToNonRemote } = useRemoteStorageApi();

  const permanentLocation = {
    fromLocationId: initialValues.permanentLocation?.id,
    toLocationId: values.permanentLocation?.id,
  };

  const temporaryLocation = {
    fromLocationId: initialValues.temporaryLocation?.id,
    toLocationId: values.temporaryLocation?.id,
  };

  const isWarningShown =
    checkMoveFromRemoteToNonRemote(permanentLocation) || checkMoveFromRemoteToNonRemote(temporaryLocation);

  return (
    <MessageBanner dismissable type="warning" show={isWarningShown}>
      <FormattedMessage id="ui-inventory.location.item.removeFromRemote.warning" />
    </MessageBanner>
  );
};

export default RemoteStorageWarning;
