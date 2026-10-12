import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import {
  IntlConsumer,
  TitleManager,
} from '@folio/stripes/core';

class ILLPolicy extends React.Component {
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
    const hasPerm = this.props.stripes.hasPerm('ui-inventory.settings.ill-policies');

    return (
      <IntlConsumer>
        {intl => (
          <TitleManager
            page={intl.formatMessage({ id: 'ui-inventory.settings.inventory.title' })}
            record={intl.formatMessage({ id: 'ui-inventory.ILLPolicy' })}
          >
            <this.connectedControlledVocab
              {...this.props}
              baseUrl="ill-policies"
              records="illPolicies"
              label={<FormattedMessage id="ui-inventory.ILLPolicy" />}
              labelSingular={intl.formatMessage({ id: 'ui-inventory.ILLPolicy' })}
              objectLabel={<FormattedMessage id="ui-inventory.ILLPolicy" />}
              visibleFields={['name', 'source']}
              columnMapping={{
                name: intl.formatMessage({ id: 'ui-inventory.name' }),
                source: intl.formatMessage({ id: 'ui-inventory.source' }),
              }}
              readOnlyFields={['source']}
              itemTemplate={{ source: 'local' }}
              hiddenFields={['description', 'numberOfObjects']}
              nameKey="name"
              id="ILLPolicy"
              sortby="name"
              editable={hasPerm}
            />
          </TitleManager>
        )}
      </IntlConsumer>
    );
  }
}

export default ILLPolicy;
