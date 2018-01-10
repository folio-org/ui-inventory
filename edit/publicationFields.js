import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
import { Field } from 'redux-form';

class PublicationFields extends React.Component {
  render() {
    return (
      <RepeatableField
        name="publication"
        label="Publications"
        addLabel="+ Add publication"
        addId="clickable-add-publication"
        template={[
          {
            name: 'publisher',
            label: 'Publisher',
            component: TextField
          },
          {
            name: 'place',
            label: 'Place',
            component: TextField
          },
          {
            name: 'dateOfPublication',
            label: 'Date',
            component: TextField
          },
        ]}
      />
    );
  }
}

export default PublicationFields;
