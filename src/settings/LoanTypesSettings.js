import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { IntlConsumer } from '@folio/stripes/core';

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

  suppressActions = () => !this.props.stripes.hasPerm('ui-inventory.settings.loantypes');

  render() {
    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            baseUrl="loan-types"
            records="loantypes"
            label={<FormattedMessage id="ui-inventory.loanTypes" />}
            labelSingular={intl.formatMessage({ id: 'ui-inventory.loanType' })}
            objectLabel={<FormattedMessage id="ui-inventory.loans" />}
            hiddenFields={['description', 'numberOfObjects']}
            nameKey="name"
            actionSuppressor={{ edit: this.suppressActions, delete: this.suppressActions }}
            id="loantypes"
            sortby="name"
          />
        )}
      </IntlConsumer>
    );
  }
}

export default LoanTypesSettings;
