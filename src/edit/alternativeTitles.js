import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Select } from '@folio/stripes/components';
import RepeatableField from '../components/RepeatableField';

const AlternativeTitles = ({ alternativeTitleTypes, formatMsg }) => {
  const alternativeTitleTypeOptions = alternativeTitleTypes.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );

  return (
    <RepeatableField
      name="alternativeTitles"
      label={formatMsg({ id: 'ui-inventory.alternativeTitles' })}
      addLabel={formatMsg({ id: 'ui-inventory.addAlternativeTitles' })}
      addButtonId="clickable-add-alternativeTitle"
      template={[
        {
          name: 'alternativeTitleTypeId',
          label: `${formatMsg({ id: 'ui-inventory.type' })} *`,
          component: Select,
          dataOptions: [{ label: 'Select alternative title type', value: '' }, ...alternativeTitleTypeOptions],
          required: true,
        },
        {
          name: 'alternativeTitle',
          label: `${formatMsg({ id: 'ui-inventory.alternativeTitle' })} *`,
          component: TextField,
          required: true,
        }
      ]}
      newItemTemplate={{ alternativeTitleTypeId: '', alternativeTitle: '' }}
    />
  );
};

AlternativeTitles.propTypes = { formatMsg: PropTypes.func };
export default AlternativeTitles;
