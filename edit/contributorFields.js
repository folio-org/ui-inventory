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
          label: 'Name Type',
          name: 'contributorNameTypeId',
          component: Select,
          dataOptions: [{ label: 'Select name type', value: '' }, ...contributorNameTypeOptions],
        },
        {
          label: 'Contributor Type',
          name: 'contributorTypeId',
          component: Select,
          dataOptions: [{ label: 'Select contributor type', value: '' }, ...contributorTypeOptions],
        },
        {
          label: 'Type, free text',
          name: 'contributorTypeText',
          component: TextField,
        },
      ]}
      newItemTemplate={{ name: '', contributorNameTypeId: '', contributorTypeId: '', contributorTypeText: '' }}
    />
  );
};

ContributorFields.propTypes = {
  contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
  contributorTypes: PropTypes.arrayOf(PropTypes.object),
};

export default ContributorFields;
