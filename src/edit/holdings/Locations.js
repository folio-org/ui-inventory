import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';

import {
  Row,
  Col,
  MessageBanner,
} from '@folio/stripes/components';

import { Field, useFormState } from 'react-final-form';
import { useRemoteStorageApi } from '../../RemoteStorage';
import { LocationSelectionWithCheck } from '../common';


export const Locations = ({ itemCount }) => {
  const { initialValues, values } = useFormState();
  const { formatMessage } = useIntl();

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
    <>
      <Row>
        <Col sm={4}>
          <Field
            label={formatMessage({ id: 'ui-inventory.permanentLocation' })}
            name="permanentLocationId"
            id="additem_permanentlocation"
            component={LocationSelectionWithCheck}
            fullWidth
            marginBottom0
          />
        </Col>
        <Col sm={4}>
          <Field
            label={formatMessage({ id: 'ui-inventory.temporaryLocation' })}
            name="temporaryLocationId"
            id="additem_temporarylocation"
            component={LocationSelectionWithCheck}
            fullWidth
            marginBottom0
          />
        </Col>
      </Row>
      <Row>
        <MessageBanner dismissable type="warning" show={isWarningShown}>
          <FormattedMessage
            id="ui-inventory.location.holdings.removeFromRemote.warning"
            values={{ itemCount }}
          />
        </MessageBanner>
      </Row>
    </>
  );
};

Locations.propTypes = {
  itemCount: PropTypes.number,
};


export default Locations;
