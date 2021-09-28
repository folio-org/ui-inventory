import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Field } from 'react-final-form';

import { LocationLookup, LocationSelection } from '@folio/stripes/smart-components';
import { ConfirmationModal, MessageBanner } from '@folio/stripes/components';

import * as RemoteStorage from '../../RemoteStorageService';


const MODAL_CLOSED = {
  open: false,
  heading: '',
};


export const LocationSelectionWithCheck = ({ input, ...rest }) => {
  const { value, onChange, ...restInput } = input;

  const { formatMessage } = useIntl();

  const checkFromRemoteToNonRemote = RemoteStorage.Check.useByLocation();

  const [selectedValue, setSelectedValue] = useState(value);
  const [rollbackValue, setRollbackValue] = useState(value);
  const [modal, setModal] = useState(MODAL_CLOSED);

  const fromLocationId = rest.meta.initial;

  const handleSelect = location => {
    const toLocationId = location?.id;

    setSelectedValue(toLocationId);

    const isNotSameLocation = toLocationId !== value;
    const isNewLocationInactive = location && !location.isActive;
    const isMovingFromRemote = checkFromRemoteToNonRemote({ fromLocationId, toLocationId });
    const isConfirmationNeeded = (isNewLocationInactive || isMovingFromRemote) && isNotSameLocation;

    if (isConfirmationNeeded) {
      const heading =
        (isNewLocationInactive && isMovingFromRemote && formatMessage({ id: 'ui-inventory.location.confirm.common.header' }))
        || (isNewLocationInactive && formatMessage({ id: 'ui-inventory.location.confirm.inactive.header' }))
        || (isMovingFromRemote && <RemoteStorage.Confirmation.Heading />);

      const messages = [
        isNewLocationInactive && formatMessage({ id: 'ui-inventory.location.confirm.inactive.message' }),
        isMovingFromRemote && <RemoteStorage.Confirmation.Message />,
      ];
      const message = messages.filter(Boolean).map(m => <MessageBanner type="warning" key={m}>{m}</MessageBanner>);

      setRollbackValue(isMovingFromRemote ? fromLocationId : value);
      setModal({ open: true, heading, message });

      return;
    }

    onChange(toLocationId);
  };

  const handleConfirm = () => {
    setModal(MODAL_CLOSED);
    onChange(selectedValue);
  };

  const handleCancel = () => {
    setModal(MODAL_CLOSED);
    setSelectedValue(rollbackValue);
  };

  return (
    <>
      <LocationSelection
        placeholder={formatMessage({ id: 'ui-inventory.selectLocation' })}
        value={selectedValue}
        onSelect={handleSelect}
        {...restInput}
        {...rest}
      />

      <LocationLookup
        onLocationSelected={handleSelect}
        disabled={rest.disabled}
      />

      <ConfirmationModal
        confirmLabel={formatMessage({ id: 'ui-inventory.location.confirm.confirmBtn' })}
        buttonStyle="default"
        cancelButtonStyle="primary"
        bodyTag="div"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        {...modal}
      />
    </>
  );
};

LocationSelectionWithCheck.propTypes = Field.propTypes;

export default LocationSelectionWithCheck;
