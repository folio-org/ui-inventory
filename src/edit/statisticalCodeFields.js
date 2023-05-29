import React from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import {
  RepeatableField,
  Label,
  Select,
} from '@folio/stripes/components';

const StatisticalCodeFields = ({
  canAdd,
  canEdit,
  canDelete,
  statisticalCodeOptions,
}) => {
  const { formatMessage } = useIntl();

  const statisticalCodeLabel = formatMessage({ id: 'ui-inventory.statisticalCode' });

  const legend = (
    <Label tagName="legend">
      {statisticalCodeLabel}
    </Label>
  );

  const renderField = field => (
    <Field
      aria-label={statisticalCodeLabel}
      name={field}
      component={Select}
      placeholder={formatMessage({ id: 'ui-inventory.selectCode' })}
      dataOptions={statisticalCodeOptions}
      disabled={!canEdit}
    />
  );

  return (
    <FieldArray
      name="statisticalCodeIds"
      component={RepeatableField}
      addLabel={<FormattedMessage id="ui-inventory.addStatisticalCode" />}
      headLabels={legend}
      renderField={renderField}
      onAdd={fields => fields.push('')}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

StatisticalCodeFields.propTypes = {
  statisticalCodeOptions: PropTypes.arrayOf(PropTypes.object),
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

StatisticalCodeFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default StatisticalCodeFields;
