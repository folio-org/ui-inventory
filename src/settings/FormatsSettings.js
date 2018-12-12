import React from 'react';
import PropTypes from 'prop-types';
import { ControlledVocab } from '@folio/stripes/smart-components';

class FormatSettings extends React.Component {
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

  suppressEdit = term => term.source === 'rdacarrier';
  suppressDelete = term => term.source === 'rdacarrier';

  render() {
    const { formatMessage } = this.props.stripes.intl;


    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="instance-formats"
        records="instanceFormats"
        label={formatMessage({ id: 'ui-inventory.formats' })}
        labelSingular={formatMessage({ id: 'ui-inventory.format' })}
        objectLabel={formatMessage({ id: 'ui-inventory.instances' })}
        visibleFields={['name', 'code', 'source']}
        readOnlyFields={['source']}
        itemTemplate={{ source: 'local' }}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="name"
        // columnWidths={{ 'name': 300, 'code': 50 }}
        actionSuppressor={{ edit: this.suppressEdit, delete: this.suppressDelete }}
        id="formats"
        sortby="name"
      />
    );
  }
}

export default FormatSettings;
