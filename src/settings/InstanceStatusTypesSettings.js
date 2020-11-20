import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { IntlConsumer } from '@folio/stripes/core';

import validateNameAndCode from './validateNameAndCode';

class InstanceStatusTypesSettings extends React.Component {
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

  suppressEdit = term => term.source === 'marcrelator';
  suppressDelete = term => term.source === 'marcrelator';

  render() {
    const hasPerm = this.props.stripes.hasPerm('ui-inventory.settings.instance-statuses');

    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            baseUrl="instance-statuses"
            records="instanceStatuses"
            label={<FormattedMessage id="ui-inventory.instanceStatusTypes" />}
            labelSingular={intl.formatMessage({ id: 'ui-inventory.instanceStatusType' })}
            objectLabel={<FormattedMessage id="ui-inventory.contributors" />}
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
            actionSuppressor={{ edit: this.suppressEdit, delete: this.suppressDelete }}
            id="instanceStatus-types"
            sortby="name"
            validate={validateNameAndCode}
            editable={hasPerm}
          />
        )}
      </IntlConsumer>
    );
  }
}

export default InstanceStatusTypesSettings;
