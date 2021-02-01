import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Row,
  Col,
  MessageBanner,
} from '@folio/stripes/components';

import { Field, useFormState } from 'react-final-form';
import { useRemoteStorageApi } from '../../RemoteStorage';
import { LocationSelectionWithCheck } from '../common';


export const Locations = () => {
  const { initialValues, values } = useFormState();
  const { formatMessage } = useIntl();

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
    <>
      <Row>
        <Col sm={4}>
          <Field
            label={formatMessage({ id: 'ui-inventory.permanentLocation' })}
            name="permanentLocation.id"
            id="additem_permanentlocation"
            component={LocationSelectionWithCheck}
            fullWidth
            marginBottom0
          />
        </Col>
        <Col sm={4}>
          <Field
            label={formatMessage({ id: 'ui-inventory.temporaryLocation' })}
            name="temporaryLocation.id"
            id="additem_temporarylocation"
            component={LocationSelectionWithCheck}
            fullWidth
            marginBottom0
          />
        </Col>
      </Row>
      <Row>
        <MessageBanner dismissable type="warning" show={isWarningShown}>
          <FormattedMessage id="ui-inventory.location.item.removeFromRemote.warning" />
        </MessageBanner>
      </Row>
    </>
  );
};

export default Locations;
