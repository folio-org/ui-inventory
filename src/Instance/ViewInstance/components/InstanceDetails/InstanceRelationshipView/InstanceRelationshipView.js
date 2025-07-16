import React from 'react';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Accordion,
} from '@folio/stripes/components';

import SubInstanceGroup from '../SubInstanceGroup';

const InstanceRelationshipView = ({
  id,
  parentInstances,
  childInstances,
}) => {
  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-inventory.instanceRelationshipAnalyticsBoundWith" />}
    >
      <Row>
        <Col xs={12}>
          <SubInstanceGroup
            id="childInstances"
            titleKey="subInstanceId"
            label={<FormattedMessage id="ui-inventory.childInstances" />}
            titles={childInstances}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <SubInstanceGroup
            id="parentInstances"
            titleKey="superInstanceId"
            label={<FormattedMessage id="ui-inventory.parentInstances" />}
            titles={parentInstances}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

InstanceRelationshipView.propTypes = {
  id: PropTypes.string.isRequired,
  parentInstances: PropTypes.arrayOf(PropTypes.object),
  childInstances: PropTypes.arrayOf(PropTypes.object),
};

export default withRouter(InstanceRelationshipView);
