import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Label,
  Select,
  RepeatableField,
} from '@folio/stripes/components';

const InstanceFormatFields = props => {
  const { formatMessage } = useIntl();

  const {
    instanceFormats,
    canAdd,
    canEdit,
    canDelete,
  } = props;

  const instanceFormatOptions = instanceFormats
    ? instanceFormats.map(it => ({
      label: it.name,
      value: it.id,
    }))
    : [];

  const instanceFormatLabel = formatMessage({ id: 'ui-inventory.instanceFormat' });

  const legend = (
    <Label tagName="legend">
      {instanceFormatLabel}
    </Label>
  );

  const renderField = (field, index) => (
    <Field
      aria-label={instanceFormatLabel}
      name={field}
      title={field}
      component={Select}
      placeholder={formatMessage({ id: 'ui-inventory.selectInstanceFormat' })}
      dataOptions={instanceFormatOptions}
      data-test-instance-format-field-count={index}
      disabled={!canEdit}
    />
  );

  return (
    <FieldArray
      name="instanceFormatIds"
      component={RepeatableField}
      legend={<FormattedMessage id="ui-inventory.instanceFormats" />}
      addLabel={<FormattedMessage id="ui-inventory.addInstanceFormat" />}
      onAdd={fields => fields.push('')}
      headLabels={legend}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

InstanceFormatFields.propTypes = {
  instanceFormats: PropTypes.arrayOf(PropTypes.object),
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
InstanceFormatFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default InstanceFormatFields;
