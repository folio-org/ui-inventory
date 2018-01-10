import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
import { Field } from 'redux-form';

class ContributorFields extends React.Component {
  render() {

    const contributorNameTypeOptions = this.props.contributorNameTypes.map(
                                              it => ({
                                                label: it.name,
                                                value: it.id,
                                              }));
    return (

      <RepeatableField
        name="contributors"
        label="Contributors"
        addLabel="+ Add contributor"
        addId="clickable-add-contributor"
        template={
          [ {
              label:'Name',
              name:'name',
              component: TextField
            },
            {
              label: 'Type',
              name: 'contributorNameTypeId',
              component: Select,
              dataOptions: [{ label: 'Select name type', value: '' }, ...contributorNameTypeOptions],
            },
          ]}
        newItemTemplate={{name:'', contributorNameTypeId:''}}
      />
    );
  }
}

ContributorFields.PropTypes = {
  contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
};

export default ContributorFields;
