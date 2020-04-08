import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  KeyValue,
  Row,
  Col,
  TextField,
} from '@folio/stripes/components';

import InstancePlugin from '../InstancePlugin';
import TitleLabel from '../TitleLabel';

const UnconnectedTitle = ({ field, onSelect }) => (
  <Row>
    <Col xs>
      <Field
        component={TextField}
        label={
          <TitleLabel
            label={<FormattedMessage id="ui-inventory.precedingField.title" />}
            subLabel={<FormattedMessage id="ui-inventory.precedingField.notConnected" />}
            required
          />
        }
        name={`${field}.title`}
      />
    </Col>
    <Col xs={1}>
      <InstancePlugin onSelect={onSelect} />
    </Col>
    <Col xs>
      <KeyValue
        label={<FormattedMessage id="ui-inventory.instanceHrid" />}
        value={<FormattedMessage id="ui-inventory.notAvailable" />}
      />
    </Col>
    <Col xs>
      <Field
        component={TextField}
        label={<FormattedMessage id="ui-inventory.isbn" />}
        name={`${field}.isbn`}
      />
    </Col>
    <Col xs>
      <Field
        component={TextField}
        label={<FormattedMessage id="ui-inventory.issn" />}
        name={`${field}.issn`}
      />
    </Col>
  </Row>
);

UnconnectedTitle.propTypes = {
  field: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default UnconnectedTitle;
