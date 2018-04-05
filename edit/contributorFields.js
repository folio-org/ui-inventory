import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';

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

  const primaryContributorOptions = [
    { label: 'Primary', value: true },
    { label: 'Non-primary', value: false },
  ];


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
          label: 'Primary *',
          name: 'primary',
          component: Select,
          dataOptions: [{ label: 'Select primary', value: '' }, ...primaryContributorOptions],
          required: true,
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
