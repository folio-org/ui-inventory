import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';

class HoldingsTypeSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="holdings-types"
        records="holdingsTypes"
        label={<FormattedMessage id="ui-inventory.holdingsTypes" />}
        labelSingular={<FormattedMessage id="ui-inventory.holdingsType" />}
        objectLabel={<FormattedMessage id="ui-inventory.holdingsTypes" />}
        visibleFields={['name', 'source']}
        readOnlyFields={['source']}
        itemTemplate={{ source: 'local' }}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="name"
        id="holdingsTypes"
        sortby="name"
      />
    );
  }
}

export default HoldingsTypeSettings;
