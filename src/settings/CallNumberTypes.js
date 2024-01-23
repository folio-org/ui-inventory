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
    edit: getSourceSuppressor([RECORD_SOURCE.SYSTEM, RECORD_SOURCE.CONSORTIUM]),
    delete: getSourceSuppressor([RECORD_SOURCE.SYSTEM, RECORD_SOURCE.CONSORTIUM]),
  }

  render() {
    const hasPerm = this.props.stripes.hasPerm('ui-inventory.settings.call-number-types');

    return (
      <IntlConsumer>
        {intl => (
          <TitleManager
            page={intl.formatMessage({ id: 'ui-inventory.settings.inventory.title' })}
            record={intl.formatMessage({ id: 'ui-inventory.callNumberTypes' })}
          >
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
          </TitleManager>
        )}
      </IntlConsumer>
    );
  }
}

export default CallNumberTypes;
