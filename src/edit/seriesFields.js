import React from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import {
  Label,
  RepeatableField,
  TextArea,
} from '@folio/stripes/components';

const SeriesFields = ({
  canAdd = true,
  canEdit = true,
  canDelete = true,
}) => {
  const { formatMessage } = useIntl();

  const seriesStatementsLabel = formatMessage({ id: 'ui-inventory.seriesStatements' });

  const legend = (
    <Label tagName="legend">
      {seriesStatementsLabel}
    </Label>
  );

  const renderField = field => (
    <Field
      aria-label={seriesStatementsLabel}
      name={`${field}.value`}
      component={TextArea}
      rows={1}
      disabled={!canEdit}
    />
  );

  return (
    <FieldArray
      name="series"
      component={RepeatableField}
      legend={<FormattedMessage id="ui-inventory.seriesStatements" />}
      addLabel={<FormattedMessage id="ui-inventory.addSeries" />}
      onAdd={fields => fields.push({ value: '' })}
      headLabels={legend}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

SeriesFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default SeriesFields;
