import React from 'react';
import PropTypes from 'prop-types';
import ControlledVocab from '@folio/stripes-smart-components/lib/ControlledVocab';

class LoanTypesSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { formatMessage } = this.props.stripes.intl;

    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="loan-types"
        records="loantypes"
        label={formatMessage({ id: 'ui-inventory.loanTypes' })}
        labelSingular={formatMessage({ id: 'ui-inventory.loanType' })}
        objectLabel={formatMessage({ id: 'ui-inventory.loans' })}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="name"
        id="loantypes"
      />
    );
  }
}

export default LoanTypesSettings;
