import React from 'react';
import PropTypes from 'prop-types';
import ControlledVocab from '@folio/stripes-smart-components/lib/ControlledVocab';

class LoanTypesSettings extends React.Component {
  static propTypes = {
    // The stripes prop will probably get used eventually, so
    // it's probably best to leave it there.
    // eslint-disable-next-line
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
        baseUrl="loan-types"
        records="loantypes"
        label="Loan Types"
        labelSingular="Loan Type"
        objectLabel="Loans"
        hiddenFields={['description', 'numberOfObjects']}
        /* TODO: allowDeletion={(item) => return itemIsNotInUse} */
        columnMapping={{ name: 'Loan Type' }}
        nameKey="name"
        id="loantypes"
      />
    );
  }
}

export default LoanTypesSettings;
