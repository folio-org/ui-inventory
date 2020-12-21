import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { IntlConsumer } from '@folio/stripes/core';

import { sourceSuppressor } from '../utils';

class ClassificationTypesSettings extends React.Component {
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
    const hasPerm = this.props.stripes.hasPerm('ui-inventory.settings.classification-types');
    const suppress = sourceSuppressor('folio');

    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            baseUrl="classification-types"
            records="classificationTypes"
            label={<FormattedMessage id="ui-inventory.classificationIdentifierTypes" />}
            labelSingular={intl.formatMessage({ id: 'ui-inventory.classificationIdentifierType' })}
            objectLabel={<FormattedMessage id="ui-inventory.classificationIdentifierTypes" />}
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
            id="classification-types"
            sortby="name"
            editable={hasPerm}
          />
        )}
      </IntlConsumer>
    );
  }
}

export default ClassificationTypesSettings;
