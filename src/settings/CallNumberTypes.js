import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { IntlConsumer } from '@folio/stripes/core';

import { sourceSuppressor } from '../utils';

class CallNumberTypes extends React.Component {
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

  actionSuppressor = {
    edit: sourceSuppressor('system'),
    delete: sourceSuppressor('system'),
  }

  render() {
    const hasPerm = this.props.stripes.hasPerm('ui-inventory.settings.call-number-types');

    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            actionSuppressor={this.actionSuppressor}
            baseUrl="call-number-types"
            records="callNumberTypes"
            label={<FormattedMessage id="ui-inventory.callNumberTypes" />}
            labelSingular={intl.formatMessage({ id: 'ui-inventory.callNumberType' })}
            objectLabel={<FormattedMessage id="ui-inventory.callNumberTypes" />}
            visibleFields={['name', 'source']}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-inventory.name' }),
              source: intl.formatMessage({ id: 'ui-inventory.source' }),
            }}
            readOnlyFields={['source']}
            itemTemplate={{ source: 'local' }}
            hiddenFields={['description', 'numberOfObjects']}
            nameKey="name"
            id="callNumberTypes"
            sortby="name"
            editable={hasPerm}
          />
        )}
      </IntlConsumer>
    );
  }
}

export default CallNumberTypes;
