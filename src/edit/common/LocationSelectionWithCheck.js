import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Field } from 'react-final-form';

import { LocationLookup } from '@folio/stripes-smart-components';
import LocationSelection from '@folio/stripes-smart-components/lib/LocationSelection';
import { ConfirmationModal, MessageBanner } from '@folio/stripes-components';

import { useRemoteStorageApi } from '../../RemoteStorage';


const MODAL_CLOSED = {
  open: false,
  heading: '',
};


export const LocationSelectionWithCheck = ({ input, ...rest }) => {
  const { value, onChange, ...restInput } = input;

  const { formatMessage } = useIntl();

  const { checkMoveFromRemoteToNonRemote } = useRemoteStorageApi();

  const [selectedValue, setSelectedValue] = useState(value);
  const [rollbackValue, setRollbackValue] = useState(value);
  const [modal, setModal] = useState(MODAL_CLOSED);

  const fromLocationId = rest.meta.initial;

  const handleSelect = location => {
    const toLocationId = location?.id;

    setSelectedValue(toLocationId);

    const isNotSameLocation = toLocationId !== value;
    const isNewLocationInactive = location && !location.isActive;
    const isMovingFromRemote = checkMoveFromRemoteToNonRemote({ fromLocationId, toLocationId });
    const isConfirmationNeeded = (isNewLocationInactive || isMovingFromRemote) && isNotSameLocation;

    if (isConfirmationNeeded) {
      const heading =
        (isNewLocationInactive && isMovingFromRemote && formatMessage({ id: 'ui-inventory.location.confirm.common.header' }))
        || (isNewLocationInactive && formatMessage({ id: 'ui-inventory.location.confirm.inactive.header' }))
        || (isMovingFromRemote && formatMessage({ id: 'ui-inventory.location.confirm.removeFromRemote.header' }));

      const messages = [
        isNewLocationInactive && formatMessage({ id: 'ui-inventory.location.confirm.inactive.message' }),
        isMovingFromRemote && formatMessage({ id: 'ui-inventory.location.confirm.removeFromRemote.message' }),
      ];
      const message = messages.filter(Boolean).map(m => <MessageBanner type="warning">{m}</MessageBanner>);

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

      <LocationLookup onLocationSelected={handleSelect} />

      <ConfirmationModal
        confirmLabel={formatMessage({ id: 'ui-inventory.location.confirm.confirmBtn' })}
        buttonStyle="default"
        cancelButtonStyle="primary"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        {...modal}
      />
    </>
  );
};

LocationSelectionWithCheck.propTypes = Field.propTypes;

export default LocationSelectionWithCheck;
