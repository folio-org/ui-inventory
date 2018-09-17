import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '../src/components/RepeatableField';

const PublicationRangeFields = ({ formatMsg }) => (
  <RepeatableField
    name="publicationRange"
    label={formatMsg({ id: 'ui-inventory.publicationRange' })}
    addLabel={formatMsg({ id: 'ui-inventory.addPublicationRange' })}
    addButtonId="clickable-add-publicationfrequency"
    template={[{
      label: formatMsg({ id: 'ui-inventory.publicationRange' }),
      component: TextField,
    }]}
  />
);

PublicationRangeFields.propTypes = { formatMsg: PropTypes.func };
export default PublicationRangeFields;
