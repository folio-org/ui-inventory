import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';

class LoanTypesSettings extends React.Component {
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
        baseUrl="loan-types"
        records="loantypes"
        label={<FormattedMessage id="ui-inventory.loanTypes" />}
        labelSingular={<FormattedMessage id="ui-inventory.loanType" />}
        objectLabel={<FormattedMessage id="ui-inventory.loans" />}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="name"
        id="loantypes"
        sortby="name"
      />
    );
  }
}

export default LoanTypesSettings;
