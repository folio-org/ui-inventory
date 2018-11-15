import React from 'react';
import PropTypes from 'prop-types';
import { ControlledVocab } from '@folio/stripes/smart-components';

class HoldingsTypeSettings extends React.Component {
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

  render() {
    const { formatMessage } = this.props.stripes.intl;

    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="holdings-types"
        records="holdingsTypes"
        label={formatMessage({ id: 'ui-inventory.holdingsTypes' })}
        labelSingular={formatMessage({ id: 'ui-inventory.holdingsType' })}
        objectLabel={formatMessage({ id: 'ui-inventory.holdingsTypes' })}
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
