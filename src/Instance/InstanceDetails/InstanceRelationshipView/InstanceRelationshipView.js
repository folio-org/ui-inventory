import React from 'react';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Accordion,
} from '@folio/stripes/components';

import useLoadSubInstances from '../../../hooks/useLoadSubInstances';
import SubInstanceList from '../SubInstanceList';

const InstanceRelationshipView = ({
  id,
  instance,
}) => {
  const parentInstances = useLoadSubInstances(instance.parentInstances, 'superInstanceId');
  const childInstances = useLoadSubInstances(instance.childInstances, 'subInstanceId');

  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-inventory.instanceRelationshipAnalyticsBoundWith" />}
    >
      <Row>
        <Col xs={12}>
          <SubInstanceList
            id="childInstances"
            titleKey="subInstanceId"
            label={<FormattedMessage id="ui-inventory.childInstances" />}
            titles={childInstances}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <SubInstanceList
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
  instance: PropTypes.object.isRequired,
};

export default withRouter(InstanceRelationshipView);
