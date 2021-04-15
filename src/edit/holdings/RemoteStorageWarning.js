import React from 'react';
import PropTypes from 'prop-types';
import { useFormState } from 'react-final-form';

import { MessageBanner } from '@folio/stripes/components';

import * as RemoteStorage from '../../RemoteStorageService';


export const RemoteStorageWarning = ({ itemCount }) => {
  const { initialValues, values } = useFormState();

  const checkFromRemoteToNonRemote = RemoteStorage.Check.useByLocation();

  const permanentLocation = {
    fromLocationId: initialValues.permanentLocationId,
    toLocationId: values.permanentLocationId,
  };

  const temporaryLocation = {
    fromLocationId: initialValues.temporaryLocationId,
    toLocationId: values.temporaryLocationId,
  };

  const isWarningShown =
    checkFromRemoteToNonRemote(permanentLocation) || checkFromRemoteToNonRemote(temporaryLocation);

  return (
    <MessageBanner dismissable type="warning" show={isWarningShown}>
      <RemoteStorage.Warning.ForHoldings itemCount={itemCount} />
    </MessageBanner>
  );
};

RemoteStorageWarning.propTypes = {
  itemCount: PropTypes.number,
};


export default RemoteStorageWarning;
