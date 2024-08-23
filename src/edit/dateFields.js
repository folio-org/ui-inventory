import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { useIntl } from 'react-intl';

import {
  Row,
  Col,
  Select,
  TextField,
} from '@folio/stripes/components';

const DateFields = ({ instanceDateTypeOptions }) => {
  const { formatMessage } = useIntl();

  const typeLabel = formatMessage({ id: 'ui-inventory.dateType' });
  const date1Label = formatMessage({ id: 'ui-inventory.date1' });
  const date2Label = formatMessage({ id: 'ui-inventory.date2' });

  return (
    <Row>
      <Col sm={3}>
        <Field
          label={typeLabel}
          name="instanceDate.instanceDateTypeId"
          component={Select}
          dataOptions={instanceDateTypeOptions}
          placeholder={formatMessage({ id: 'ui-inventory.selectInstanceDateType' })}
        />
      </Col>
      <Col sm={3}>
        <Field
          ariaLabel={date1Label}
          label={date1Label}
          name="dates.date1"
          component={TextField}
          maxLength={4}
        />
      </Col>
      <Col sm={3}>
        <Field
          ariaLabel={date2Label}
          label={date2Label}
          name="dates.date2"
          component={TextField}
          maxLength={4}
        />
      </Col>
    </Row>
  );
};

DateFields.propTypes = {
  instanceDateTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    selected: PropTypes.bool,
  })).isRequired,
};

export default DateFields;
