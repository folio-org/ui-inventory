import React, {
  useMemo,
} from 'react';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  KeyValue,
  Accordion,
} from '@folio/stripes/components';

import {
  getChildInstancesLabel,
  getParentInstanceLabel,
  formatChildInstances,
  formatParentInstance,
} from './utils';

const InstanceRelationshipView = ({
  location,

  id,
  instance,
  relationTypes,
}) => {
  const childInstancesLabel = useMemo(() => (
    getChildInstancesLabel(instance, relationTypes)
  ), [instance, relationTypes]);

  const parentInstanceLabel = useMemo(() => (
    getParentInstanceLabel(instance, relationTypes)
  ), [instance, relationTypes]);

  const formattedChildInstances = useMemo(() => (
    formatChildInstances(instance, location.search)
  ), [instance, location.search]);

  const formattedParentInstances = useMemo(() => (
    formatParentInstance(instance, location.search)
  ), [instance, location.search]);

  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-inventory.instanceRelationshipAnalyticsBoundWith" />}
    >
      <Row>
        <Col xs={12}>
          <KeyValue
            label={childInstancesLabel}
            value={formattedChildInstances}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={parentInstanceLabel}
            value={formattedParentInstances}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

InstanceRelationshipView.propTypes = {
  id: PropTypes.string.isRequired,
  instance: PropTypes.object.isRequired,
  relationTypes: PropTypes.arrayOf(PropTypes.object),

  location: PropTypes.object.isRequired,
};

InstanceRelationshipView.defaultProps = {
  relationTypes: [],
};

export default withRouter(InstanceRelationshipView);
