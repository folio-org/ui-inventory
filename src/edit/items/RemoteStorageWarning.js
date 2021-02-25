import React from 'react';
import { useFormState } from 'react-final-form';

import { MessageBanner } from '@folio/stripes/components';

import * as RemoteStorage from '../../RemoteStorageService';


export const RemoteStorageWarning = () => {
  const { initialValues, values } = useFormState();

  const checkFromRemoteToNonRemote = RemoteStorage.Check.useByLocation();

  const permanentLocation = {
    fromLocationId: initialValues.permanentLocation?.id,
    toLocationId: values.permanentLocation?.id,
  };

  const temporaryLocation = {
    fromLocationId: initialValues.temporaryLocation?.id,
    toLocationId: values.temporaryLocation?.id,
  };

  const isWarningShown =
    checkFromRemoteToNonRemote(permanentLocation) || checkFromRemoteToNonRemote(temporaryLocation);

  return (
    <MessageBanner dismissable type="warning" show={isWarningShown}>
      <RemoteStorage.Warning.ForItems />
    </MessageBanner>
  );
};

export default RemoteStorageWarning;
