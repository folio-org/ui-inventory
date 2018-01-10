import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
import { Field } from 'redux-form';

class URLFields extends React.Component {
  render() {
    return (
      <RepeatableField
        name="urls"
        label="URLs"
        addLabel="+ Add URL"
        addId="clickable-add-url"
        template={[{
          label: 'URL',
          component: TextField
        }]}
      />
    );
  }
}

export default URLFields;
