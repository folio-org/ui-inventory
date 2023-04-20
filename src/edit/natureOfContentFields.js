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

const NatureOfContentFields = props => {
  const { formatMessage } = useIntl();

  const {
    canAdd,
    canEdit,
    canDelete,
    natureOfContentTerms,
  } = props;

  const natureOfContentTermOptions = natureOfContentTerms
    ? natureOfContentTerms.map(it => ({
      label: it.name,
      value: it.id,
    }))
    : [];

  const headLabels = (
    <Label tagName="legend">
      <FormattedMessage id="ui-inventory.natureOfContentTerm" />
    </Label>
  );

  const renderField = field => (
    <Field
      aria-label={formatMessage({ id: 'ui-inventory.natureOfContentTerm' })}
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
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  natureOfContentTerms: PropTypes.arrayOf(PropTypes.object),
};
NatureOfContentFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default NatureOfContentFields;
