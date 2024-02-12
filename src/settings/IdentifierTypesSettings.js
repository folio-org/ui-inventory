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

class IdentifierTypesSettings extends React.Component {
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
    const hasPerm = this.props.stripes.hasPerm('ui-inventory.settings.identifier-types');
    const suppress = getSourceSuppressor([
      RECORD_SOURCE.FOLIO,
      RECORD_SOURCE.CONSORTIUM,
    ]);

    return (
      <IntlConsumer>
        {intl => (
          <TitleManager
            page={intl.formatMessage({ id: 'ui-inventory.settings.inventory.title' })}
            record={intl.formatMessage({ id: 'ui-inventory.resourceIdentifierTypes' })}
          >
            <this.connectedControlledVocab
              {...this.props}
              baseUrl="identifier-types"
              records="identifierTypes"
              label={<FormattedMessage id="ui-inventory.resourceIdentifierTypes" />}
              labelSingular={intl.formatMessage({ id: 'ui-inventory.resourceIdentifierType' })}
              objectLabel={<FormattedMessage id="ui-inventory.resourceIdentifierTypes" />}
              visibleFields={['name', 'source']}
              columnMapping={{
                name: intl.formatMessage({ id: 'ui-inventory.name' }),
                source: intl.formatMessage({ id: 'ui-inventory.source' }),
              }}
              readOnlyFields={['source']}
              itemTemplate={{ source: 'local' }}
              hiddenFields={['description', 'numberOfObjects']}
              nameKey="name"
              // columnWidths={{ 'name': 300, 'code': 50 }}
              actionSuppressor={{ edit: suppress, delete: suppress }}
              id="identifier-types"
              sortby="name"
              editable={hasPerm}
            />
          </TitleManager>
        )}
      </IntlConsumer>
    );
  }
}

export default IdentifierTypesSettings;
