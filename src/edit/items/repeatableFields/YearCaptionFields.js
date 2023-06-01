import React from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';

import {
  Label,
  TextField,
  RepeatableField,
} from '@folio/stripes/components';

const YearCaptionFields = ({
  canAdd,
  canEdit,
  canDelete,
}) => {
  const { formatMessage } = useIntl();

  const yearCaptionLabel = formatMessage({ id: 'ui-inventory.yearCaption' });

  const legend = (
    <Label tagName="legend">
      {yearCaptionLabel}
    </Label>
  );

  const renderField = field => (
    <Field
      ariaLabel={yearCaptionLabel}
      name={field}
      component={TextField}
      disabled={!canEdit}
    />
  );

  return (
    <FieldArray
      name="yearCaption"
      component={RepeatableField}
      addLabel={<FormattedMessage id="ui-inventory.addYearCaption" />}
      onAdd={fields => fields.push('')}
      headLabels={legend}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

YearCaptionFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

YearCaptionFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default YearCaptionFields;
