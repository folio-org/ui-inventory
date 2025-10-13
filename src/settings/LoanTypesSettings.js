import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import {
  IntlConsumer,
  TitleManager,
} from '@folio/stripes/core';
import { getSourceSuppressor } from '@folio/stripes/util';

import { RECORD_SOURCE } from '../constants';

const suppress = getSourceSuppressor(RECORD_SOURCE.CONSORTIUM);
const actionSuppressor = { edit: suppress, delete: suppress };

class LoanTypesSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const hasPerm = this.props.stripes.hasPerm('ui-inventory.settings.loan-types');

    return (
      <IntlConsumer>
        {intl => (
          <TitleManager
            page={intl.formatMessage({ id: 'ui-inventory.settings.inventory.title' })}
            record={intl.formatMessage({ id: 'ui-inventory.loanTypes' })}
          >
            <this.connectedControlledVocab
              {...this.props}
              baseUrl="loan-types"
              records="loantypes"
              label={<FormattedMessage id="ui-inventory.loanTypes" />}
              labelSingular={intl.formatMessage({ id: 'ui-inventory.loanType' })}
              objectLabel={<FormattedMessage id="ui-inventory.loans" />}
              actionSuppressor={actionSuppressor}
              hiddenFields={['description', 'numberOfObjects']}
              visibleFields={['name', 'source']}
              columnMapping={{
                source: intl.formatMessage({ id: 'ui-inventory.source' }),
              }}
              formatter={{
                source: (item) => item.source || 'folio',
              }}
              readOnlyFields={['source']}
              itemTemplate={{ source: 'local' }}
              nameKey="name"
              id="loantypes"
              sortby="name"
              editable={hasPerm}
            />
          </TitleManager>
        )}
      </IntlConsumer>
    );
  }
}

export default LoanTypesSettings;
