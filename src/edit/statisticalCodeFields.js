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

  const legend = (
    <Label tagName="legend">
      <FormattedMessage id="ui-inventory.statisticalCode" />
    </Label>
  );

  const renderField = field => (
    <Field
      name={field}
      component={Select}
      dataOptions={[
        {
          label: formatMessage({ id: 'ui-inventory.selectCode' }),
          value: '',
        },
        ...statisticalCodeOptions,
      ]}
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
