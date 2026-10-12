/* eslint-disable react/prop-types */
import { Field } from 'react-final-form';
import { MultiSelection } from '@folio/stripes/components';

import { CLASSIFICATION_BROWSE_COLUMNS } from './constants';

const getFieldComponents = (fieldLabels, classificationIdentifierTypes) => ({
  [CLASSIFICATION_BROWSE_COLUMNS.TYPE_IDS]: ({ fieldProps, name, rowIndex, fieldIndex }) => (
    <Field
      {...fieldProps}
      component={MultiSelection}
      aria-label={`${fieldLabels[name]} ${rowIndex}`}
      placeholder={fieldLabels[name]}
      marginBottom0
      renderToOverlay
      valueFormatter={({ option }) => option.label}
      dataOptions={classificationIdentifierTypes}
      autoFocus={fieldIndex === 0}
    />
  ),
});

export default getFieldComponents;
