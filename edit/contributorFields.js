import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';

const ContributorFields = ({ contributorNameTypes }) => {
  const contributorNameTypeOptions = contributorNameTypes.map(
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
          label: 'Type',
          name: 'contributorNameTypeId',
          component: Select,
          dataOptions: [{ label: 'Select name type', value: '' }, ...contributorNameTypeOptions],
        },
      ]}
      newItemTemplate={{ name: '', contributorNameTypeId: '' }}
    />
  );
};

ContributorFields.propTypes = {
  contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
};

export default ContributorFields;
