import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const renderNatureOfContentField = ({ field, fieldIndex, canEdit }, natureOfContentTerms, translate) => {
  const natureOfContentTermOptions = natureOfContentTerms
    ? natureOfContentTerms.map(it => ({
      label: translate.formatMessage({ id: `ui-inventory.natureOfContentTerms.name.${it.name}`, defaultMessage: it.name }),
      value: it.id,
    }))
    : [];
  const label = fieldIndex === 0 ? <FormattedMessage id="ui-inventory.natureOfContentTerm" /> : null;

  return (
    <FormattedMessage id="ui-inventory.selectNatureOfContentTerm">
      {([placeholder]) => (
        <Field
          label={label}
          name={field}
          component={Select}
          placeholder={placeholder}
          dataOptions={natureOfContentTermOptions}
          data-test-nature-of-content-field-count={fieldIndex}
          disabled={!canEdit}
        />
      )}
    </FormattedMessage>
  );
};

renderNatureOfContentField.propTypes = {
  field: PropTypes.object,
  fieldIndex: PropTypes.number,
  canEdit: PropTypes.bool,
};
renderNatureOfContentField.defaultProps = {
  canEdit: true,
};

const NatureOfContentFields = props => {
  const {
    canAdd,
    canEdit,
    canDelete,
    natureOfContentTerms,
  } = props;

  const translate = useIntl();

  return (
    <RepeatableField
      name="natureOfContentTermIds"
      label={<FormattedMessage id="ui-inventory.natureOfContentTerms" />}
      addLabel={<FormattedMessage id="ui-inventory.addNatureOfContentTerm" />}
      addButtonId="clickable-add-nature-of-content"
      template={[{
        render(fieldObj) { return renderNatureOfContentField({ ...fieldObj, canEdit }, natureOfContentTerms, translate); },
      }]}
      canAdd={canAdd}
      canDelete={canDelete}
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
