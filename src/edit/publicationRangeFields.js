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

const PublicationRangeFields = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  const legend = (
    <Label tagName="legend">
      <FormattedMessage id="ui-inventory.publicationRange" />
    </Label>
  );

  const renderField = field => (
    <FormattedMessage id="ui-inventory.publicationRange">
      {([ariaLabel]) => (
        <Field
          aria-label={ariaLabel}
          name={field}
          component={TextArea}
          rows={1}
          disabled={!canEdit}
        />
      )}
    </FormattedMessage>
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
PublicationRangeFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default PublicationRangeFields;
