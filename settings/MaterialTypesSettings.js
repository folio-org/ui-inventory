import React from 'react';
import PropTypes from 'prop-types';
import ControlledVocab from '@folio/stripes-smart-components/lib/ControlledVocab';

class MaterialTypesSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="material-types"
        records="mtypes"
        label="Material Types"
        labelSingular="Material Type"
        objectLabel="Items"
        hiddenFields={['description', 'numberOfObjects']}
        /* TODO: allowDeletion={(item) => return itemIsNotInUse} */
        nameKey="name"
        id="materialtypes"
      />
    );
  }
}

export default MaterialTypesSettings;
