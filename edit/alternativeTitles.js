import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
import { Field } from 'redux-form';

class AlternativeTitles extends React.Component {
  render() {
    return (
      <RepeatableField
        name="alternativeTitles"
        label="Alternative titles"
        addLabel="+ Add alternative title"
        addId="clickable-add-alt-title"
        template={[{
          label: "Alternative title",
          component: TextField
        }]}
      />
    );
  }
}

export default AlternativeTitles;
