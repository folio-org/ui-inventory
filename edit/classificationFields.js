import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';

const ClassificationFields = ({ classificationTypes }) => {
  const classificationTypeOptions = classificationTypes.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );

  return (
    <RepeatableField
      name="classifications"
      label="Classifications"
      addLabel="+ Add classification"
      addButtonId="clickable-add-classification"
      addDefaultItem={false}
      template={[
        {
          label: 'Number *',
          name: 'classificationNumber',
          component: TextField,
          required: true,
        },
        {
          label: 'Type *',
          name: 'classificationTypeId',
          component: Select,
          dataOptions: [{ label: 'Select classification type', value: '' }, ...classificationTypeOptions],
          required: true,
        },
      ]}
      newItemTemplate={{ classificationNumber: '', classificationTypeId: '' }}
    />
  );
};

ClassificationFields.propTypes = {
  classificationTypes: PropTypes.arrayOf(PropTypes.object),
};

export default ClassificationFields;
