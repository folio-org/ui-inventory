import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import {
  IfPermission,
  useStripes,
} from '@folio/stripes/core';
import {
  Row,
  Col,
  Button,
} from '@folio/stripes/components';

import { switchAffiliation } from '../../../utils';

const InstanceNewHolding = ({
  location,
  instance,
  tenantId,
  disabled,
}) => {
  const intl = useIntl();
  const stripes = useStripes();

  const label = intl.formatMessage({ id: 'ui-inventory.addHoldings' });

  const onNewHolding = useCallback(() => {
    window.location.href = `/inventory/create/${instance?.id}/holding${location.search}`;
  }, [location.search, instance.id]);

  return (
    <IfPermission perm="ui-inventory.holdings.create">
      <Row>
        <Col sm={12}>
          <Button
            id="clickable-new-holdings-record"
            aria-label={label}
            buttonStyle="primary"
            fullWidth
            onClick={() => switchAffiliation(stripes.okapi, tenantId, onNewHolding)}
            disabled={disabled}
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
  tenantId: PropTypes.string,
  disabled: PropTypes.bool,
};

export default withRouter(InstanceNewHolding);
