import PropTypes from 'prop-types';

import { Field } from 'react-final-form';

import { MultiSelection } from '@folio/stripes/components';

export const CallNumberTypeField = ({
  fieldProps,
  name,
  rowIndex,
  fieldIndex,
  fieldLabels,
  callNumberTypeOptions,
}) => {
  return (
    <Field
      {...fieldProps}
      component={MultiSelection}
      aria-label={`${fieldLabels[name]} ${rowIndex}`}
      placeholder={fieldLabels[name]}
      marginBottom0
      renderToOverlay
      valueFormatter={({ option }) => option.label}
      dataOptions={callNumberTypeOptions}
      autoFocus={fieldIndex === 0}
    />
  );
};

CallNumberTypeField.propTypes = {
  fieldProps: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  rowIndex: PropTypes.number.isRequired,
  fieldIndex: PropTypes.number.isRequired,
  fieldLabels: PropTypes.object.isRequired,
  callNumberTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
  })),
};
