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
  RepeatableField,
  TextArea,
} from '@folio/stripes/components';

const PublicationFrequencyFields = ({
  canAdd = true,
  canEdit = true,
  canDelete = true,
}) => {
  const { formatMessage } = useIntl();

  const publicationFrequencyLabel = formatMessage({ id: 'ui-inventory.publicationFrequency' });

  const legend = (
    <Label tagName="legend">
      {publicationFrequencyLabel}
    </Label>
  );

  const renderField = field => (
    <Field
      aria-label={publicationFrequencyLabel}
      name={field}
      component={TextArea}
      rows={1}
      disabled={!canEdit}
    />
  );

  return (
    <FieldArray
      name="publicationFrequency"
      component={RepeatableField}
      legend={<FormattedMessage id="ui-inventory.publicationFrequency" />}
      addLabel={<FormattedMessage id="ui-inventory.addPublicationFrequency" />}
      onAdd={fields => fields.push('')}
      headLabels={legend}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

PublicationFrequencyFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default PublicationFrequencyFields;
