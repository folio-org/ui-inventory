import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';

class InstanceStatusTypesSettings extends React.Component {
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

  suppressEdit = term => term.source === 'marcrelator';
  suppressDelete = term => term.source === 'marcrelator';

  render() {
    const { intl: { formatMessage } } = this.props;

    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="instance-statuses"
        records="instanceStatuses"
        label={<FormattedMessage id="ui-inventory.instanceStatusTypes" />}
        labelSingular={<FormattedMessage id="ui-inventory.instanceStatusType" />}
        objectLabel={<FormattedMessage id="ui-inventory.contributors" />}
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
        actionSuppressor={{ edit: this.suppressEdit, delete: this.suppressDelete }}
        id="instanceStatus-types"
        sortby="name"
      />
    );
  }
}

export default injectIntl(InstanceStatusTypesSettings);
