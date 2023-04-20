import React from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Label,
  RepeatableField,
  TextArea,
} from '@folio/stripes/components';

const SeriesFields = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  const legend = (
    <Label tagName="legend">
      <FormattedMessage id="ui-inventory.seriesStatements" />
    </Label>
  );

  const renderField = field => (
    <FormattedMessage id="ui-inventory.seriesStatement">
      {([ariaLabel]) => (
        <Field
          aria-label={ariaLabel}
          name={`${field}.value`}
          component={TextArea}
          rows={1}
          disabled={!canEdit}
        />
      )}
    </FormattedMessage>
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
SeriesFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default SeriesFields;
