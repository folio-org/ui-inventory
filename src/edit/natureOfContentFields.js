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
  RepeatableField,
  Select,
} from '@folio/stripes/components';

const NatureOfContentFields = ({
  natureOfContentTerms = [],
  canAdd = true,
  canEdit = true,
  canDelete = true,
}) => {
  const { formatMessage } = useIntl();

  const natureOfContentTermOptions = natureOfContentTerms
    ? natureOfContentTerms.map(it => ({
      label: it.name,
      value: it.id,
    }))
    : [];

  const natureOfContentTermLabel = formatMessage({ id: 'ui-inventory.natureOfContentTerm' });

  const headLabels = (
    <Label tagName="legend">
      {natureOfContentTermLabel}
    </Label>
  );

  const renderField = field => (
    <Field
      aria-label={natureOfContentTermLabel}
      name={field}
      title={field}
      component={Select}
      placeholder={formatMessage({ id: 'ui-inventory.selectNatureOfContentTerm' })}
      dataOptions={natureOfContentTermOptions}
      disabled={!canEdit}
    />
  );

  return (
    <FieldArray
      name="natureOfContentTermIds"
      component={RepeatableField}
      legend={<FormattedMessage id="ui-inventory.natureOfContentTerms" />}
      addLabel={<FormattedMessage id="ui-inventory.addNatureOfContentTerm" />}
      onAdd={fields => fields.push('')}
      headLabels={headLabels}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

NatureOfContentFields.propTypes = {
  natureOfContentTerms: PropTypes.arrayOf(PropTypes.object),
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default NatureOfContentFields;
