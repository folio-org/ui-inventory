import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
import { Field } from 'redux-form';

class ClassificationFields extends React.Component {
  render() {

    const classificationTypeOptions = this.props.classificationTypes.map(
                                              it => ({
                                                label: it.name,
                                                value: it.id,
                                              }));
    return (
      <RepeatableField
        name="classifications"
        label="Classifications"
        addLabel="+ Add classification"
        addId="clickable-add-classification"
        addDefaultItem={false}
        template={
          [ {
              label:'Number *',
              name: 'classificationNumber',
              component: TextField,
              required: true,
            },
            {
              label:'Type *',
              name: 'classificationTypeId',
              component: Select,
              dataOptions: [{ label: 'Select classification type', value: '' }, ...classificationTypeOptions],
              required: true,
            },
          ]}
        newItemTemplate={{name:'', classificationNameTypeId:''}}
      />
    );
  }
}

ClassificationFields.PropTypes = {
  classificationNameTypes: PropTypes.arrayOf(PropTypes.object),
};

export default ClassificationFields;
