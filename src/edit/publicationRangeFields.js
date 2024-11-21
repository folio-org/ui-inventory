import React from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl
} from 'react-intl';
import PropTypes from 'prop-types';

import {
  Label,
  RepeatableField,
  TextArea,
} from '@folio/stripes/components';

const PublicationRangeFields = ({
  canAdd = true,
  canEdit = true,
  canDelete = true,
}) => {
  const { formatMessage } = useIntl();

  const publicationRangeLabel = formatMessage({ id: 'ui-inventory.publicationRange' });

  const legend = (
    <Label tagName="legend">
      {publicationRangeLabel}
    </Label>
  );

  const renderField = field => (
    <Field
      aria-label={publicationRangeLabel}
      name={field}
      component={TextArea}
      rows={1}
      disabled={!canEdit}
    />
  );

  return (
    <FieldArray
      name="publicationRange"
      component={RepeatableField}
      legend={<FormattedMessage id="ui-inventory.publicationRange" />}
      addLabel={<FormattedMessage id="ui-inventory.addPublicationRange" />}
      onAdd={fields => fields.push('')}
      headLabels={legend}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

PublicationRangeFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default PublicationRangeFields;
