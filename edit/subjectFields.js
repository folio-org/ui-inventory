import React from 'react';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
import PropTypes from 'prop-types';

const SubjectFields = ({ formatMsg }) => (
  <RepeatableField
    name="subjects"
    label={formatMsg({ id: 'ui-inventory.subjects' })}
    addLabel={formatMsg({ id: 'ui-inventory.addSubject' })}
    addButtonId="clickable-add-subject"
    template={[{
      component: TextField,
    }]}
  />
);

SubjectFields.propTypes = { formatMsg: PropTypes.func };
export default SubjectFields;
