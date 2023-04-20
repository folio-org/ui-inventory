import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';

import {
  Label,
  RepeatableField,
  TextArea,
} from '@folio/stripes/components';

const PublicationFrequencyFields = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  const legend = (
    <Label tagName="legend">
      <FormattedMessage id="ui-inventory.publicationFrequency" />
    </Label>
  );

  const renderField = field => (
    <FormattedMessage id="ui-inventory.publicationFrequency">
      {([ariaLabel]) => (
        <Field
          name={field}
          component={TextArea}
          rows={1}
          disabled={!canEdit}
          ariaLabel={ariaLabel}
        />
      )}
    </FormattedMessage>
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
PublicationFrequencyFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default PublicationFrequencyFields;
