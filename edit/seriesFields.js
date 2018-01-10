import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
import { Field } from 'redux-form';

class SeriesFields extends React.Component {
  render() {
    return (
      <RepeatableField
        name="series"
        label="Series statements"
        addLabel="+ Add series"
        addId="clickable-add-series"
        template={[{
          component: TextField
        }]}
        newItemTemplate={''}
      />
    );
  }
}

export default SeriesFields;
