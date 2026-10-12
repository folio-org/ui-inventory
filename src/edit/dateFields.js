import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { useIntl } from 'react-intl';

import {
  Row,
  Col,
  Select,
  TextField,
} from '@folio/stripes/components';

import { DATE_LENGTH } from '../validation';

const DateFields = ({ instanceDateTypeOptions, disabled, initialDateTypeId }) => {
  const { formatMessage } = useIntl();

  const typeLabel = formatMessage({ id: 'ui-inventory.dateType' });
  const date1Label = formatMessage({ id: 'ui-inventory.date1' });
  const date2Label = formatMessage({ id: 'ui-inventory.date2' });

  // if there is no initial date type value - means it's not been saved so a user can unselect it
  // once a value is saved - user cannot unselect it, but they can still select "No attempt to code"
  const canUnselectDateType = !initialDateTypeId;
  const dataOptions = useMemo(() => {
    return canUnselectDateType
      ? [{
        label: formatMessage({ id: 'ui-inventory.selectInstanceDateType' }),
        value: '',
      }, ...instanceDateTypeOptions]
      : instanceDateTypeOptions;
  }, [initialDateTypeId]);

  return (
    <Row>
      <Col sm={3}>
        <Field
          label={typeLabel}
          name="dates.dateTypeId"
          component={Select}
          dataOptions={dataOptions}
          placeholder={canUnselectDateType ? null : formatMessage({ id: 'ui-inventory.selectInstanceDateType' })}
          disabled={disabled}
        />
      </Col>
      <Col sm={3}>
        <Field
          ariaLabel={date1Label}
          label={date1Label}
          name="dates.date1"
          component={TextField}
          maxLength={DATE_LENGTH}
          disabled={disabled}
        />
      </Col>
      <Col sm={3}>
        <Field
          ariaLabel={date2Label}
          label={date2Label}
          name="dates.date2"
          component={TextField}
          maxLength={DATE_LENGTH}
          disabled={disabled}
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
  disabled: PropTypes.bool,
  initialDateTypeId: PropTypes.string,
};

export default DateFields;
