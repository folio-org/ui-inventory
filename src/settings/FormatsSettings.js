import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';

class FormatSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  suppressEdit = term => term.source === 'rdacarrier';
  suppressDelete = term => term.source === 'rdacarrier';

  render() {
    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="instance-formats"
        records="instanceFormats"
        label={<FormattedMessage id="ui-inventory.formats" />}
        labelSingular={<FormattedMessage id="ui-inventory.format" />}
        objectLabel={<FormattedMessage id="ui-inventory.instances" />}
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
