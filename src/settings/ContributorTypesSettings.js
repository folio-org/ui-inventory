import React from 'react';
import PropTypes from 'prop-types';
import { ControlledVocab } from '@folio/stripes/smart-components';

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

  suppressEdit = term => term.source === 'marcrelator';
  suppressDelete = term => term.source === 'marcrelator';

  render() {
    const { formatMessage } = this.props.stripes.intl;

    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="contributor-types"
        records="contributorTypes"
        label={formatMessage({ id: 'ui-inventory.contributorTypes' })}
        labelSingular={formatMessage({ id: 'ui-inventory.contributorType' })}
        objectLabel={formatMessage({ id: 'ui-inventory.contributors' })}
        visibleFields={['name', 'code', 'source']}
        readOnlyFields={['source']}
        itemTemplate={{ source: 'local' }}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="name"
        // columnWidths={{ 'name': 300, 'code': 50 }}
        actionSuppressor={{ edit: this.suppressEdit, delete: this.suppressDelete }}
        id="contributor-types"
      />
    );
  }
}

export default FormatTypesSettings;
