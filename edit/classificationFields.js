import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';

const ClassificationFields = ({ classificationTypes, formatMsg }) => {
  const classificationTypeOptions = classificationTypes.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );

  return (
    <RepeatableField
      name="classifications"
      label={formatMsg({ id: 'ui-inventory.classifications' })}
      addLabel={formatMsg({ id: 'ui-inventory.addClassifications' })}
      addButtonId="clickable-add-classification"
      addDefaultItem={false}
      template={[
        {
          label: `${formatMsg({ id: 'ui-inventory.number' })} *`,
          name: 'classificationNumber',
          component: TextField,
          required: true,
        },
        {
          label: `${formatMsg({ id: 'ui-inventory.type' })} *`,
          name: 'classificationTypeId',
          component: Select,
          dataOptions: [{ label: formatMsg({ id: 'ui-inventory.selectClassification' }), value: '' }, ...classificationTypeOptions],
          required: true,
        },
      ]}
      newItemTemplate={{ classificationNumber: '', classificationTypeId: '' }}
    />
  );
};

ClassificationFields.propTypes = {
  classificationTypes: PropTypes.arrayOf(PropTypes.object),
  formatMsg: PropTypes.func,
};

export default ClassificationFields;
