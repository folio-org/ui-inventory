import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Headline,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import React from 'react';
import PropTypes from 'prop-types';

const Location = ({
  holdingLocation,
  itemLocation,
}) => {
  return (
    <Accordion
      id="acc07"
      label={<FormattedMessage id="ui-inventory.location" />}
    >
      <Row>
        <Col xs={12}>
          <Headline>
            <FormattedMessage id="ui-inventory.holdingsLocation" />
          </Headline>
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.permanentLocation" />}
            value={holdingLocation.permanentLocation?.name}
            subValue={holdingLocation.permanentLocation?.isActive === false &&
              <FormattedMessage id="ui-inventory.inactive" />
            }
            data-testid="holding-permanent-location"
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.temporaryLocation" />}
            value={holdingLocation.temporaryLocation?.name}
            subValue={holdingLocation.temporaryLocation?.isActive === false &&
              <FormattedMessage id="ui-inventory.inactive" />
            }
            data-testid="holding-temporary-location"
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Headline>
            <FormattedMessage id="ui-inventory.itemLocation" />
          </Headline>
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.permanentLocation" />}
            value={itemLocation.permanentLocation?.name}
            subValue={itemLocation.permanentLocation?.isActive === false &&
              <FormattedMessage id="ui-inventory.inactive" />
            }
            data-testid="item-permanent-location"
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.temporaryLocation" />}
            value={itemLocation.temporaryLocation?.name}
            subValue={itemLocation.temporaryLocation?.isActive === false &&
              <FormattedMessage id="ui-inventory.inactive" />
            }
            data-testid="item-temporary-location"
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.effectiveLocation" />}
            value={itemLocation.effectiveLocation?.name}
            subValue={itemLocation.effectiveLocation?.isActive === false &&
              <FormattedMessage id="ui-inventory.inactive" />
            }
            data-testid="location-item-effective-location"
          />
        </Col>
      </Row>
    </Accordion>
  );
};

Location.propTypes = {
  holdingLocation: PropTypes.object.isRequired,
  itemLocation: PropTypes.object.isRequired,
};

export default Location;
