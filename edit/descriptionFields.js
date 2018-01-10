import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
import { Field } from 'redux-form';

class DescriptionFields extends React.Component {
  render() {
    return (
      <RepeatableField
        name="physicalDescriptions"
        label="Descriptions"
        addLabel="+ Add description"
        addId="clickable-add-description"
        template={[{
          label: 'Description',
          component: TextField
        }]}
      />
    );
  }
}

export default DescriptionFields;
