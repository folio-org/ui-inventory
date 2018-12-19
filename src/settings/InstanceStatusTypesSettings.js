import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';

class InstanceStatusTypesSettings extends React.Component {
  static propTypes = {
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
    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="instance-statuses"
        records="instanceStatuses"
        label={<FormattedMessage id="ui-inventory.instanceStatusTypes" />}
        labelSingular={<FormattedMessage id="ui-inventory.instanceStatusType" />}
        objectLabel={<FormattedMessage id="ui-inventory.contributors" />}
        visibleFields={['name', 'code', 'source']}
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

export default InstanceStatusTypesSettings;
