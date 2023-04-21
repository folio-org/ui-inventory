import React from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Label,
  TextField,
  RepeatableField,
} from '@folio/stripes/components';

const BoundWithTitlesFields = ({ canDelete }) => {
  const { formatMessage } = useIntl();

  const hridLabel = formatMessage({ id: 'ui-inventory.instanceHrid' });
  const titleLabel = formatMessage({ id: 'ui-inventory.instanceTitleLabel' });
  const holdingsHridLabel = formatMessage({ id: 'ui-inventory.holdingsHrid' });

  const headLabels = (
    <Row>
      <Col sm={4}>
        <Label tagName="legend">
          {hridLabel}
        </Label>
      </Col>
      <Col sm={4}>
        <Label tagName="legend">
          {titleLabel}
        </Label>
      </Col>
      <Col sm={4}>
        <Label tagName="legend">
          {holdingsHridLabel}
        </Label>
      </Col>
    </Row>
  );

  const renderField = field => (
    <Row>
      <Col sm={4}>
        <Field
          ariaLabel={hridLabel}
          name={`${field}.briefInstance.hrid`}
          component={TextField}
          value={boundWithTitle => boundWithTitle.briefInstance.hrid}
          disabled
        />
      </Col>
      <Col sm={4}>
        <Field
          ariaLabel={titleLabel}
          name={`${field}.briefInstance.title`}
          component={TextField}
          disabled
        />
      </Col>
      <Col sm={4}>
        <Field
          ariaLabel={holdingsHridLabel}
          name={`${field}.briefHoldingsRecord.hrid`}
          component={TextField}
          disabled
        />
      </Col>
    </Row>
  );

  return (
    <FieldArray
      name="boundWithTitles"
      component={RepeatableField}
      legend={<FormattedMessage id="ui-inventory.boundWithTitles" />}
      headLabels={headLabels}
      renderField={renderField}
      canAdd={false}
      canRemove={canDelete}
    />
  );
};

BoundWithTitlesFields.propTypes = { canDelete: PropTypes.bool };
BoundWithTitlesFields.defaultProps = { canDelete: true };

export default BoundWithTitlesFields;
