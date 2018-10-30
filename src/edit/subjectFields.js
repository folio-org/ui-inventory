import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@folio/stripes/components';
import RepeatableField from '../components/RepeatableField';

const SubjectFields = ({ formatMsg }) => (
  <RepeatableField
    name="subjects"
    addLabel={formatMsg({ id: 'ui-inventory.addSubject' })}
    addButtonId="clickable-add-subject"
    template={[{
      component: TextField,
      label: formatMsg({ id: 'ui-inventory.subjects' }),
    }]}
  />
);

SubjectFields.propTypes = { formatMsg: PropTypes.func };
export default SubjectFields;
