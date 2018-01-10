import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
import { Field } from 'redux-form';

class SubjectFields extends React.Component {
  render() {
    return (
      <RepeatableField
        name="subjects"
        label="Subjects"
        addLabel="+ Add subject"
        addId="clickable-add-subject"
        template={[{
          component: TextField
        }]}
      />
    );
  }
}

export default SubjectFields;
