import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
import { Field } from 'redux-form';

class IdentifierFields extends React.Component {
  render() {

    const identifierTypeOptions = this.props.identifierTypes.map(
                                              it => ({
                                                label: it.name,
                                                value: it.id,
                                              }));
    return (
      <RepeatableField
        name="identifiers"
        label="Identifiers"
        addLabel="+ Add identifier"
        addId="clickable-add-identifier"
        template={
          [ {
              name: "value",
              label: "Identifier *",
              component: TextField,
              required: true,
            },
            {
              name: "identifierTypeId",
              label: "Type *",
              component: Select,
              dataOptions: [{ label: 'Select identifier type', value: '' }, ...identifierTypeOptions],
              required: true,
            },
          ]}
        newItemTemplate={{name:'', identifierNameTypeId:''}}
      />
    );
  }
}

IdentifierFields.PropTypes = {
  identifierNameTypes: PropTypes.arrayOf(PropTypes.object),
};

export default IdentifierFields;

