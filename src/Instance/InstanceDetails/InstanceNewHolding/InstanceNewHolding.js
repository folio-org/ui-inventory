import React from 'react';
import {
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import {
  IfPermission,
} from '@folio/stripes/core';
import {
  Row,
  Col,
  Button,
} from '@folio/stripes/components';

const InstanceNewHolding = ({
  location,

  instance,
}) => {
  const intl = useIntl();

  const label = intl.formatMessage({ id: 'ui-inventory.addHoldings' });

  return (
    <IfPermission perm="ui-inventory.holdings.create">
      <Row>
        <Col sm={12}>
          <Button
            id="clickable-new-holdings-record"
            to={`/inventory/create/${instance?.id}/holding${location.search}`}
            aria-label={label}
            buttonStyle="primary"
            fullWidth
          >
            {label}
          </Button>
        </Col>
      </Row>
    </IfPermission>
  );
};

InstanceNewHolding.propTypes = {
  location: PropTypes.object.isRequired,
  instance: PropTypes.object,
};

export default withRouter(InstanceNewHolding);
