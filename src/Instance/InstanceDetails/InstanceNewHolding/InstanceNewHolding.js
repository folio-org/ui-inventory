import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { useHistory } from 'react-router-dom';

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
}) => {
  const intl = useIntl();
  const stripes = useStripes();
  const history = useHistory();

  const label = intl.formatMessage({ id: 'ui-inventory.addHoldings' });

  const onNewHolding = useCallback(() => {
    history.push({
      pathname: `/inventory/create/${instance?.id}/holding`,
      search: location.search,
      state: {
        tenantTo: tenantId,
        tenantFrom: stripes.okapi.tenant,
      }
    });
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
            onClick={async () => {
              await switchAffiliation(stripes, tenantId, onNewHolding);
            }}
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
};

export default withRouter(InstanceNewHolding);
