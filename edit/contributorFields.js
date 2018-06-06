import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';

const ContributorFields = ({ contributorNameTypes, contributorTypes }) => {
  const contributorNameTypeOptions = contributorNameTypes.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );

  const contributorTypeOptions = contributorTypes.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );

  return (
    <RepeatableField
      name="contributors"
      label="Contributors"
      addLabel="+ Add contributor"
      addButtonId="clickable-add-contributor"
      template={[
        {
          label: 'Name',
          name: 'name',
          component: TextField,
        },
        {
          label: 'Name Type *',
          name: 'contributorNameTypeId',
          component: Select,
          dataOptions: [{ label: 'Select type', value: '' }, ...contributorNameTypeOptions],
          required: true,
        },
        {
          label: 'Primary',
          name: 'primary',
          component: Checkbox,
        },
        {
          label: 'Type',
          name: 'contributorTypeId',
          component: Select,
          dataOptions: [{ label: 'Select type', value: '' }, ...contributorTypeOptions],
        },
        {
          label: 'Type, free text',
          name: 'contributorTypeText',
          component: TextField,
        },
      ]}
      newItemTemplate={{ name: '', contributorNameTypeId: '', primary: '', contributorTypeId: '', contributorTypeText: '' }}
    />
  );
};

ContributorFields.propTypes = {
  contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
  contributorTypes: PropTypes.arrayOf(PropTypes.object),
};

export default ContributorFields;
