import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { IntlConsumer } from '@folio/stripes/core';

class StatisticalCodeTypes extends React.Component {
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
    const hasPerm = this.props.stripes.hasPerm('ui-inventory.settings.statistical-code-types');

    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            baseUrl="statistical-code-types"
            records="statisticalCodeTypes"
            label={<FormattedMessage id="ui-inventory.statisticalCodeTypes" />}
            labelSingular={intl.formatMessage({ id: 'ui-inventory.statisticalCodeTypes' })}
            objectLabel={<FormattedMessage id="ui-inventory.statisticalCodeTypes" />}
            visibleFields={['name', 'source']}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-inventory.name' }),
              source: intl.formatMessage({ id: 'ui-inventory.source' }),
            }}
            readOnlyFields={['source']}
            itemTemplate={{ source: 'local' }}
            hiddenFields={['description', 'numberOfObjects']}
            nameKey="name"
            id="StatisticalCodeTypes"
            sortby="name"
            editable={hasPerm}
          />
        )}
      </IntlConsumer>
    );
  }
}

export default StatisticalCodeTypes;
