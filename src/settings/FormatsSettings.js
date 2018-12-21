import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';

class FormatSettings extends React.Component {
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

  suppressEdit = term => term.source === 'rdacarrier';
  suppressDelete = term => term.source === 'rdacarrier';

  render() {
    const { intl: { formatMessage } } = this.props;

    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="instance-formats"
        records="instanceFormats"
        label={<FormattedMessage id="ui-inventory.formats" />}
        labelSingular={<FormattedMessage id="ui-inventory.format" />}
        objectLabel={<FormattedMessage id="ui-inventory.instances" />}
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
        id="formats"
        sortby="name"
      />
    );
  }
}

export default injectIntl(FormatSettings);
