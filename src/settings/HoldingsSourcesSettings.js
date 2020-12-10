import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { IntlConsumer } from '@folio/stripes/core';

import { sourceSuppressor } from '../utils';

class HoldingsSourcesSettings extends React.Component {
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
    const hasPerm = this.props.stripes.hasPerm('ui-inventory.settings.holdings-sources');
    const suppress = sourceSuppressor('folio');

    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            baseUrl="holdings-sources"
            records="holdingsRecordsSources"
            label={<FormattedMessage id="ui-inventory.holdingsSources" />}
            labelSingular={intl.formatMessage({ id: 'ui-inventory.holdingsSource' })}
            objectLabel={<FormattedMessage id="ui-inventory.holdingsSources" />}
            visibleFields={['name', 'source']}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-inventory.name' }),
              source: intl.formatMessage({ id: 'ui-inventory.source' }),
            }}
            readOnlyFields={['source']}
            itemTemplate={{ source: 'local' }}
            hiddenFields={['numberOfObjects']}
            nameKey="name"
            actionSuppressor={{ edit: suppress, delete: suppress }}
            id="holdingsSources"
            sortby="name"
            editable={hasPerm}
          />
        )}
      </IntlConsumer>
    );
  }
}

export default HoldingsSourcesSettings;
