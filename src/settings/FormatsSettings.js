import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { IntlConsumer } from '@folio/stripes/core';

import validateNameAndCode from './validateNameAndCode';

import { sourceSuppressor } from '../utils';

class FormatSettings extends React.Component {
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
    const hasPerm = this.props.stripes.hasPerm('ui-inventory.settings.instance-formats');
    const suppress = sourceSuppressor('rdacarrier');

    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            baseUrl="instance-formats"
            records="instanceFormats"
            tableName="instanceFormats"
            appName="ui-inventory"
            translatableFields={['name']}
            label={<FormattedMessage id="ui-inventory.formats" />}
            labelSingular={intl.formatMessage({ id: 'ui-inventory.format' })}
            objectLabel={<FormattedMessage id="ui-inventory.instances" />}
            visibleFields={['name', 'code', 'source']}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-inventory.name' }),
              code: intl.formatMessage({ id: 'ui-inventory.code' }),
              source: intl.formatMessage({ id: 'ui-inventory.source' }),
            }}
            readOnlyFields={['source']}
            itemTemplate={{ source: 'local' }}
            hiddenFields={['description', 'numberOfObjects']}
            nameKey="name"
            // columnWidths={{ 'name': 300, 'code': 50 }}
            actionSuppressor={{ edit: suppress, delete: suppress }}
            id="formats"
            sortby="name"
            validate={validateNameAndCode}
            editable={hasPerm}
          />
        )}
      </IntlConsumer>
    );
  }
}

export default FormatSettings;
