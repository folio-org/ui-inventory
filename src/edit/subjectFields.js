import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@folio/stripes/components';
import RepeatableField from '../components/RepeatableField';

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
