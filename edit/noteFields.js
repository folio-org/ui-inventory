import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
import { Field } from 'redux-form';

class NoteFields extends React.Component {
  render() {
    return (
      <RepeatableField
        name="notes"
        label="Notes"
        addLabel="+ Add note"
        addId="clickable-add-note"
        template={[{
          label: 'Note',
          component: TextField
        }]}
      />
    );
  }
}

export default NoteFields;