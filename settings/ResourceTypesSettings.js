import React from 'react';
import PropTypes from 'prop-types';
import ControlledVocab from '@folio/stripes-smart-components/lib/ControlledVocab';

class FormatTypesSettings extends React.Component {
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

  suppressEdit = term => term.source === 'rdacontent';
  suppressDelete = term => term.source === 'rdacontent';

  render() {
    const { formatMessage } = this.props.stripes.intl;

    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="instance-types"
        records="instanceTypes"
        label={formatMessage({ id: 'ui-inventory.resourceTypes' })}
        labelSingular={formatMessage({ id: 'ui-inventory.resourceType' })}
        objectLabel={formatMessage({ id: 'ui-inventory.instances' })}
        visibleFields={['name', 'code', 'source']}
        readOnlyFields={['source']}
        itemTemplate={{ source: 'local' }}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="name"
        columnWidths={{ 'name': 300, 'code': 50 }}
        actionSuppressor={{ edit: this.suppressEdit, delete: this.suppressDelete }}
        id="instance-types"
      />
    );
  }
}

export default FormatTypesSettings;
