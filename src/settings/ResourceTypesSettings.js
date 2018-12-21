import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';

class ResourceTypesSettings extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  suppressEdit = term => term.source === 'rdacontent';
  suppressDelete = term => term.source === 'rdacontent';

  render() {
    const { intl: { formatMessage } } = this.props;

    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="instance-types"
        records="instanceTypes"
        label={<FormattedMessage id="ui-inventory.resourceTypes" />}
        labelSingular={<FormattedMessage id="ui-inventory.resourceType" />}
        objectLabel={<FormattedMessage id="ui-inventory.resourceTypes" />}
        visibleFields={['name', 'code', 'source']}
        columnMapping={{
          name: formatMessage({ id: 'ui-inventory.name' }),
          code: formatMessage({ id: 'ui-inventory.code' }),
          source: formatMessage({ id: 'ui-inventory.source' }),
        }}
        readOnlyFields={['source']}
        itemTemplate={{ source: 'local' }}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="name"
        // columnWidths={{ 'name': 300, 'code': 50 }}
        actionSuppressor={{ edit: this.suppressEdit, delete: this.suppressDelete }}
        id="instance-types"
        sortby="name"
      />
    );
  }
}

export default injectIntl(ResourceTypesSettings);
