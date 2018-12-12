import React from 'react';
import PropTypes from 'prop-types';
import { ControlledVocab } from '@folio/stripes/smart-components';

class InstanceStatusTypesSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  suppressEdit = term => term.source === 'marcrelator';
  suppressDelete = term => term.source === 'marcrelator';

  render() {
    const { formatMessage } = this.props.stripes.intl;

    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="instance-statuses"
        records="instanceStatuses"
        label={formatMessage({ id: 'ui-inventory.instanceStatusTypes' })}
        labelSingular={formatMessage({ id: 'ui-inventory.instanceStatusType' })}
        objectLabel={formatMessage({ id: 'ui-inventory.contributors' })}
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
