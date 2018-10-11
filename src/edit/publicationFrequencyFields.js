import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@folio/stripes/components';
import RepeatableField from '../components/RepeatableField';

const PublicationFrequencyFields = ({ formatMsg }) => (
  <RepeatableField
    name="publicationFrequency"
    label={formatMsg({ id: 'ui-inventory.publicationFrequency' })}
    addLabel={formatMsg({ id: 'ui-inventory.addPublicationFrequency' })}
    addButtonId="clickable-add-publicationfrequency"
    template={[{
      label: formatMsg({ id: 'ui-inventory.publicationFrequency' }),
      component: TextField,
    }]}
  />
);

PublicationFrequencyFields.propTypes = { formatMsg: PropTypes.func };
export default PublicationFrequencyFields;
