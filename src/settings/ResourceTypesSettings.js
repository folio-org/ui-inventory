import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { IntlConsumer } from '@folio/stripes/core';

import validateNameAndCode from './validateNameAndCode';

class ResourceTypesSettings extends React.Component {
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

  suppressEdit = term => term.source === 'rdacontent';
  suppressDelete = term => term.source === 'rdacontent';

  render() {
    const hasPerm = this.props.stripes.hasPerm('ui-inventory.settings.instance-types');

    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            baseUrl="instance-types"
            records="instanceTypes"
            label={<FormattedMessage id="ui-inventory.resourceTypes" />}
            labelSingular={intl.formatMessage({ id: 'ui-inventory.resourceType' })}
            objectLabel={<FormattedMessage id="ui-inventory.resourceTypes" />}
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
            actionSuppressor={{ edit: this.suppressEdit, delete: this.suppressDelete }}
            id="instance-types"
            sortby="name"
            validate={validateNameAndCode}
            editable={hasPerm}
          />
        )}
      </IntlConsumer>
    );
  }
}

export default ResourceTypesSettings;
